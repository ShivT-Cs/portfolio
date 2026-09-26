# Azure Landing Zone IaC Demonstration (Sanitized)

This folder contains a self-contained Terraform/OpenTofu demonstration for the `azure-landing-zone-iac-modules` case study.

It is intentionally sanitized and uses generic naming only. It does **not** include credentials, subscription IDs, tenant IDs, customer data, or production topology details.

## What Is Implemented

- Reusable module: `modules/resource-group`
- Reusable module: `modules/networking`
- Reusable module: `modules/key-vault`
- Root composition: `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`
- Sample input values: `terraform.tfvars.example`
- CI checks (format/validate/plan/security): `.github/workflows/landing-zone-iac-checks.yml`

## Architecture

- Sanitized static diagram: `/diagrams/landing-zone-sanitized.svg`
- Interactive case-study diagram: Architecture Explorer on `/projects/azure-landing-zone-iac-modules`

Data flow (sanitized):

1. Governance/resource-group baseline created.
2. Networking baseline created (VNet, subnets, NSG + subnet association).
3. Key Vault created with RBAC enabled and default-deny network ACLs.
4. Key Vault network ACL allows only configured subnet IDs.

## Security Considerations

- Key Vault RBAC authorization enabled.
- Key Vault purge protection and soft-delete retention enabled.
- Key Vault network ACL uses `default_action = "Deny"`.
- NSG explicit deny rule for inbound internet traffic.
- No secrets, credentials, or cloud identities are stored in this demo.

## Prerequisites

- Terraform CLI >= 1.5 (or OpenTofu equivalent)
- Optional: `tfsec` for local security scanning

## Exact Commands

Run from repository root:

```bash
cd infrastructure/landing-zone
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
terraform plan -refresh=false -var-file=terraform.tfvars.example -out=tfplan
```

OpenTofu equivalent:

```bash
cd infrastructure/landing-zone
tofu fmt -check -recursive
tofu init -backend=false
tofu validate
tofu plan -refresh=false -var-file=terraform.tfvars.example -out=tfplan
```

## Expected Results

- `fmt -check`: no formatting diffs
- `init -backend=false`: provider/module initialization succeeds locally
- `validate`: configuration is valid
- `plan`: creates an execution plan file (`tfplan`) without applying resources

## Current Evidence Status (2026-09-26)

- Azure deployment verification: **Not performed / Evidence pending**
- Reason: this repository verification intentionally excludes Azure subscription access and deployment actions.

Commands actually executed in this environment:

```text
terraform version
tofu version
node_modules/.bin/eslint.cmd .
node_modules/.bin/tsc.cmd --noEmit
node_modules/.bin/tsc.cmd -p tsconfig.test.json
node --test .test-dist/tests/**/*.test.js
node_modules/.bin/next.cmd build
```

Actual command results in this environment:

- `terraform version`: command not found
- `tofu version`: command not found
- `node --test .test-dist/tests/**/*.test.js`: passed (21/21)
- `node_modules/.bin/next.cmd build`: passed

Terraform/OpenTofu checks remain pending until Terraform/OpenTofu CLI is installed in the executing environment.

## Cleanup

No cloud resources are created unless `apply` is executed.

Remove local artifacts:

```bash
cd infrastructure/landing-zone
rm -rf .terraform tfplan .terraform.lock.hcl
```

PowerShell cleanup:

```powershell
Set-Location infrastructure/landing-zone
Remove-Item -Recurse -Force .terraform -ErrorAction SilentlyContinue
Remove-Item -Force tfplan,.terraform.lock.hcl -ErrorAction SilentlyContinue
```

## Limitations

- This demonstration does not perform `apply` and does not validate deployment behavior in Azure.
- The tenant ID is a placeholder value for static validation only.
- Production verification requires controlled deployment, post-deployment checks, and security review in a real environment.

## Verification Status Guidance

- **Locally verified checks in this environment**: repository lint, typecheck, node tests, Next.js build.
- **Not performed / Evidence pending**: Terraform/OpenTofu CLI checks (CLI unavailable in this environment) and all Azure deployment verification.
