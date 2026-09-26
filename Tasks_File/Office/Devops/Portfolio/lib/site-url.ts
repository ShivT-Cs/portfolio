const FALLBACK_SITE_URL = "https://example.com";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return FALLBACK_SITE_URL;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function getSiteUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicitUrl) {
    return normalizeSiteUrl(explicitUrl);
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProductionUrl) {
    return normalizeSiteUrl(vercelProductionUrl);
  }

  const vercelPreviewUrl = process.env.VERCEL_URL;
  if (vercelPreviewUrl) {
    return normalizeSiteUrl(vercelPreviewUrl);
  }

  return FALLBACK_SITE_URL;
}
