import { NextRequest, NextResponse } from "next/server";
import { validateInquiry, type InquiryBody } from "@/lib/inquiry-validation";
import { createInquiryRateLimiter, getInquiryRateLimitConfig } from "@/lib/inquiry-rate-limit";

const inquiryRateLimiter = createInquiryRateLimiter(getInquiryRateLimitConfig());

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

async function sendInquiryEmail(payload: {
  name: string;
  businessEmail: string;
  company: string;
  region: string;
  service: string;
  description: string;
  timeline: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL;
  const fromEmail = process.env.INQUIRY_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return { ok: false as const };
  }

  const subject = `Consultancy inquiry: ${payload.service}`;
  const text = [
    "New consultancy inquiry",
    "",
    `Name: ${payload.name}`,
    `Business email: ${payload.businessEmail}`,
    `Company: ${payload.company}`,
    `Country/region: ${payload.region}`,
    `Service: ${payload.service}`,
    `Expected timeline: ${payload.timeline}`,
    "",
    "Project description:",
    payload.description,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: payload.businessEmail,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    return { ok: false as const };
  }

  const data = (await response.json()) as { id?: string };
  if (!data.id) {
    return { ok: false as const };
  }

  return { ok: true as const };
}

export async function POST(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const identifier = getClientIdentifier(request);

    // This in-memory limiter reduces basic spam but is not globally reliable
    // across multiple serverless instances or cold starts on Vercel.
    // In development only, limit behavior can be relaxed via server environment
    // variables to make local testing practical.
    if (inquiryRateLimiter.isRateLimited(identifier)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 },
      );
    }

    const body = (await request.json()) as InquiryBody;
    const validated = validateInquiry(body);

    if (!validated.ok) {
      // Field names are safe to log; values and inquiry contents are intentionally omitted.
      console.warn("inquiry_validation_failed", {
        reason: validated.reason,
        invalidFields: validated.invalidFields,
      });

      return NextResponse.json(
        {
          ok: false,
          message: "Please review the form details and try again.",
          ...(isProduction ? {} : { reason: validated.reason, invalidFields: validated.invalidFields }),
        },
        { status: 400 },
      );
    }

    const result = await sendInquiryEmail(validated.payload);
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Unable to send inquiry right now. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Unable to send inquiry right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
