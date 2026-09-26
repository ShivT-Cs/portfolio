# Portfolio (Next.js)

Premium Azure Solutions Architect and DevOps portfolio built with Next.js, TypeScript, and Tailwind CSS.

## Deployment target

- Hosting platform: Vercel
- Package manager: npm (`package-lock.json` present)
- Build command: `npm run build`
- Output mode: standard Next.js server build (`next build`)

## Local verification before deploy

Run these commands from the repository root:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Expected result: all commands succeed with no errors.

## Vercel project settings

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: leave empty (Next.js default)
- Node version: use the Vercel default compatible with Next.js 16

## Environment variables and secrets

This repository currently requires no secrets for build or runtime.

Optional environment variable:

- `NEXT_PUBLIC_SITE_URL`
  - Purpose: canonical metadata, Open Graph URL, sitemap URLs, and robots sitemap URL.
  - Example: `https://your-domain.example`
  - If not set, the app auto-falls back to Vercel system variables (`VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`), then to `https://example.com`.

Do not store credentials in source control. If future integrations require secrets, add them only in Vercel Project Settings.

## Routes and static metadata endpoints

Core routes:

- `/`
- `/projects/[slug]` generated from `content/projects.ts`
- `/demos/azure-devops-pipeline`
- `/demos/aiops-incident-lab`

Metadata routes:

- `/robots.txt` from `app/robots.ts`
- `/sitemap.xml` from `app/sitemap.ts`

## Resume and public assets

- Resume file path: `public/Shivkumar_Resume_Azure Consultant.pdf`
- Resume links resolve through `content/profile.ts` (`resumePath`).

## Scope note

This repository is a portfolio web application. No Azure infrastructure deployment is performed as part of the Vercel publish flow.
