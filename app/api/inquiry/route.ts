import { NextRequest, NextResponse } from "next/server";
import { INQUIRY_SERVICE_OPTIONS } from "@/lib/inquiry-services";

type InquiryBody = {
  name?: string;
  businessEmail?: string;
  company?: string;
  region?: string;
  service?: string;
  description?: string;
  timeline?: string;
  website?: string;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const rateLimitStore = new Map<string, RateLimitState>();

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

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

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(identifier);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(identifier, current);
  return false;
}

function validate(body: InquiryBody) {
  const name = trimString(body.name);
  const businessEmail = trimString(body.businessEmail).toLowerCase();
  const company = trimString(body.company);
  const region = trimString(body.region);
  const service = trimString(body.service);
  const description = trimString(body.description);
  const timeline = trimString(body.timeline);
  const website = trimString(body.website);

  if (website.length > 0) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  if (name.length < 2 || name.length > 80) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  if (!EMAIL_REGEX.test(businessEmail) || businessEmail.length > 254) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  if (company.length < 2 || company.length > 120) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  if (region.length < 2 || region.length > 80) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  if (!INQUIRY_SERVICE_OPTIONS.includes(service as (typeof INQUIRY_SERVICE_OPTIONS)[number])) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  if (description.length < 20 || description.length > 3000) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  if (timeline.length < 2 || timeline.length > 120) {
    return { ok: false as const, reason: "invalid_submission" };
  }

  return {
    ok: true as const,
    payload: {
      name,
      businessEmail,
      company,
      region,
      service,
      description,
      timeline,
    },
  };
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
    const identifier = getClientIdentifier(request);

    // This in-memory rate limiter reduces basic spam but is not globally reliable
    // across multiple serverless instances or cold starts on Vercel.
    if (isRateLimited(identifier)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 },
      );
    }

    const body = (await request.json()) as InquiryBody;
    const validated = validate(body);

    if (!validated.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please review the form details and try again.",
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
