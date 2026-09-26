const PROJECT_NAME_PATTERN = /^[a-z0-9-]{3,24}$/;
const ENVIRONMENTS = ["dev", "test", "prod", "demo"] as const;
const KEY_VAULT_PREFIX_PATTERN = /^[a-z0-9-]{3,16}$/;

export function isValidProjectName(value: string): boolean {
  return PROJECT_NAME_PATTERN.test(value);
}

export function isValidEnvironment(value: string): boolean {
  return (ENVIRONMENTS as readonly string[]).includes(value);
}

export function isValidKeyVaultPrefix(value: string): boolean {
  return KEY_VAULT_PREFIX_PATTERN.test(value);
}

export function composeResourceGroupName(key: string): string {
  return `rg-${key}`;
}

export function composeKeyVaultName(prefix: string, suffix: string): string {
  return `${prefix}${suffix}`.replace(/-/g, "").slice(0, 24);
}

export function hasSensitiveTokens(input: string): boolean {
  const normalized = input.toLowerCase();
  const forbidden = ["subscription_id", "tenant_id", "client_secret", "password", "token", "apikey"];
  return forbidden.some((token) => normalized.includes(token));
}
