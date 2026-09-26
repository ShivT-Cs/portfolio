"use client";

import { FormEvent, useMemo, useState } from "react";
import { INQUIRY_SERVICE_OPTIONS } from "@/lib/inquiry-services";

type Status = "idle" | "sending" | "success" | "error";

type InquiryPayload = {
  name: string;
  businessEmail: string;
  company: string;
  region: string;
  service: string;
  description: string;
  timeline: string;
  website: string;
};

const initialPayload: InquiryPayload = {
  name: "",
  businessEmail: "",
  company: "",
  region: "",
  service: "",
  description: "",
  timeline: "",
  website: "",
};

export function ConsultancyInquiryForm() {
  const [payload, setPayload] = useState<InquiryPayload>(initialPayload);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isSending = status === "sending";

  const buttonLabel = useMemo(() => {
    if (status === "sending") {
      return "Sending...";
    }

    return "Send Inquiry";
  }, [status]);

  const updateField = (field: keyof InquiryPayload, value: string) => {
    setPayload((current) => ({ ...current, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSending) {
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Unable to send inquiry right now. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Inquiry sent successfully. You can expect a response by email.");
      setPayload(initialPayload);
    } catch {
      setStatus("error");
      setMessage("Unable to send inquiry right now. Please try again.");
    }
  };

  return (
    <form className="mt-8 grid gap-4 md:grid-cols-2" aria-describedby="inquiry-note inquiry-privacy" onSubmit={onSubmit}>
      <label className="flex flex-col gap-2 text-sm text-muted">
        <span className="text-ink">Name</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          className="min-h-[44px] rounded-lg border border-white/15 bg-surface/60 px-3 py-2 text-ink"
          placeholder="Your name"
          required
          maxLength={80}
          value={payload.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-muted">
        <span className="text-ink">Business email</span>
        <input
          name="businessEmail"
          type="email"
          autoComplete="email"
          className="min-h-[44px] rounded-lg border border-white/15 bg-surface/60 px-3 py-2 text-ink"
          placeholder="name@company.com"
          required
          maxLength={254}
          value={payload.businessEmail}
          onChange={(event) => updateField("businessEmail", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-muted">
        <span className="text-ink">Company</span>
        <input
          name="company"
          type="text"
          autoComplete="organization"
          className="min-h-[44px] rounded-lg border border-white/15 bg-surface/60 px-3 py-2 text-ink"
          placeholder="Company name"
          required
          maxLength={120}
          value={payload.company}
          onChange={(event) => updateField("company", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-muted">
        <span className="text-ink">Country or region</span>
        <input
          name="region"
          type="text"
          autoComplete="country-name"
          className="min-h-[44px] rounded-lg border border-white/15 bg-surface/60 px-3 py-2 text-ink"
          placeholder="Country or region"
          required
          maxLength={80}
          value={payload.region}
          onChange={(event) => updateField("region", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-muted md:col-span-2">
        <span className="text-ink">Service of interest</span>
        <select
          name="service"
          className="min-h-[44px] rounded-lg border border-white/15 bg-surface/60 px-3 py-2 text-ink"
          value={payload.service}
          required
          onChange={(event) => updateField("service", event.target.value)}
        >
          <option value="" disabled>
            Select a service
          </option>
          {INQUIRY_SERVICE_OPTIONS.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-muted md:col-span-2">
        <span className="text-ink">Project description</span>
        <textarea
          name="description"
          rows={5}
          className="rounded-lg border border-white/15 bg-surface/60 px-3 py-2 text-ink"
          placeholder="Business context, current setup, and what you want to achieve"
          required
          maxLength={3000}
          value={payload.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-muted md:col-span-2">
        <span className="text-ink">Expected timeline</span>
        <input
          name="timeline"
          type="text"
          className="min-h-[44px] rounded-lg border border-white/15 bg-surface/60 px-3 py-2 text-ink"
          placeholder="Example: Discovery this month, implementation next quarter"
          required
          maxLength={120}
          value={payload.timeline}
          onChange={(event) => updateField("timeline", event.target.value)}
        />
      </label>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={payload.website}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </label>
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-accent/45 bg-accent/20 px-5 py-2.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buttonLabel}
        </button>

        {message ? (
          <p
            className={`mt-3 text-xs ${status === "success" ? "text-emerald-200" : "text-amber-100"}`}
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}

        <p id="inquiry-note" className="mt-3 text-xs text-muted">
          No credentials, passwords, access keys, or secrets should be shared through this form.
        </p>
        <p id="inquiry-privacy" className="mt-2 text-xs text-muted">
          Privacy notice: your submission is used only to review your inquiry and respond by email.
        </p>
      </div>
    </form>
  );
}
