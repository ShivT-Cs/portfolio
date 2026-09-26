import { INQUIRY_SERVICE_OPTIONS } from "./inquiry-services";

export type InquiryBody = {
  name?: string;
  businessEmail?: string;
  company?: string;
  region?: string;
  service?: string;
  description?: string;
  timeline?: string;
  website?: string;
};

export const INQUIRY_LIMITS = {
  name: { min: 2, max: 80 },
  businessEmail: { max: 254 },
  company: { min: 2, max: 120 },
  region: { min: 2, max: 80 },
  description: { min: 3, max: 3000 },
  timeline: { min: 1, max: 120 },
} as const;

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string): boolean {
  if (!value || value.includes(" ")) {
    return false;
  }

  const atIndex = value.indexOf("@");
  const lastAtIndex = value.lastIndexOf("@");
  if (atIndex <= 0 || atIndex !== lastAtIndex) {
    return false;
  }

  const dotAfterAt = value.indexOf(".", atIndex + 2);
  if (dotAfterAt === -1 || dotAfterAt >= value.length - 1) {
    return false;
  }

  return true;
}

export type InquiryValidationFailure = {
  ok: false;
  reason: "invalid_submission";
  invalidFields: string[];
};

export type InquiryValidationSuccess = {
  ok: true;
  payload: {
    name: string;
    businessEmail: string;
    company: string;
    region: string;
    service: string;
    description: string;
    timeline: string;
  };
};

export function validateInquiry(body: InquiryBody): InquiryValidationFailure | InquiryValidationSuccess {
  const name = trimString(body.name);
  const businessEmail = trimString(body.businessEmail).toLowerCase();
  const company = trimString(body.company);
  const region = trimString(body.region);
  const service = trimString(body.service);
  const description = trimString(body.description);
  const timeline = trimString(body.timeline);
  const website = trimString(body.website);
  const invalidFields: string[] = [];

  if (website.length > 0) {
    invalidFields.push("website");
  }

  if (name.length < INQUIRY_LIMITS.name.min || name.length > INQUIRY_LIMITS.name.max) {
    invalidFields.push("name");
  }

  if (!isValidEmail(businessEmail) || businessEmail.length > INQUIRY_LIMITS.businessEmail.max) {
    invalidFields.push("businessEmail");
  }

  if (company.length < INQUIRY_LIMITS.company.min || company.length > INQUIRY_LIMITS.company.max) {
    invalidFields.push("company");
  }

  if (region.length < INQUIRY_LIMITS.region.min || region.length > INQUIRY_LIMITS.region.max) {
    invalidFields.push("region");
  }

  if (!INQUIRY_SERVICE_OPTIONS.includes(service as (typeof INQUIRY_SERVICE_OPTIONS)[number])) {
    invalidFields.push("service");
  }

  if (description.length < INQUIRY_LIMITS.description.min || description.length > INQUIRY_LIMITS.description.max) {
    invalidFields.push("description");
  }

  if (timeline.length < INQUIRY_LIMITS.timeline.min || timeline.length > INQUIRY_LIMITS.timeline.max) {
    invalidFields.push("timeline");
  }

  if (invalidFields.length > 0) {
    return {
      ok: false,
      reason: "invalid_submission",
      invalidFields,
    };
  }

  return {
    ok: true,
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