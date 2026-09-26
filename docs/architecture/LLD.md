# Portfolio Website Low-Level Design (LLD)

## Scope
This LLD reflects actual implementation in the current repository and focuses on website behavior, inquiry API, validation, abuse controls, and test coverage.

Related documents:
- [High-Level Design](./HLD.md)
- [Inquiry API Specification](./api/inquiry-api.md)
- [Architecture Mermaid Source](./architecture-diagram.mmd)

## 1) Actual Folder Structure
Top-level implementation-relevant structure:

- app/
  - layout.tsx
  - page.tsx
  - consultancy/page.tsx
  - projects/[slug]/page.tsx
  - demos/azure-devops-pipeline/page.tsx
  - demos/aiops-incident-lab/page.tsx
  - api/inquiry/route.ts
  - robots.ts
  - sitemap.ts
- components/
  - hero.tsx
  - navbar.tsx
  - featured-projects-strip.tsx
  - demos-section.tsx
  - expertise-grid.tsx
  - experience-timeline.tsx
  - certification-grid.tsx
  - contact-section.tsx
  - project-detail-template.tsx
  - engineering-evidence-section.tsx
  - pipeline-simulator-demo.tsx
  - aiops-incident-lab-demo.tsx
  - consultancy-inquiry-form.tsx
  - motion-wrapper.tsx
- content/
  - profile.ts
  - social.ts
  - projects.ts
  - project-evidence.ts
  - expertise.ts
  - experience.ts
  - certifications.ts
- lib/
  - site-url.ts
  - inquiry-services.ts
  - inquiry-validation.ts
  - inquiry-rate-limit.ts
  - pipeline-simulator.ts
  - aiops-incident-lab.ts
  - architecture-explorer-data.ts
- tests/
  - inquiry-validation.test.ts
  - inquiry-rate-limit.test.ts
  - project-evidence.test.ts
  - pipeline-simulator.test.ts
  - aiops-incident-lab.test.ts
  - architecture-explorer.test.ts
  - landing-zone-iac*.test.ts
- infrastructure/
  - landing-zone/* (Terraform assets)
- .github/workflows/
  - landing-zone-iac-checks.yml

## 2) Route Responsibilities
### Implemented pages
- / from [app/page.tsx](../../app/page.tsx)
  - Composes portfolio sections and shared components.
- /consultancy from [app/consultancy/page.tsx](../../app/consultancy/page.tsx)
  - Renders consultancy content and inquiry form container.
- /projects/[slug] from [app/projects/[slug]/page.tsx](../../app/projects/[slug]/page.tsx)
  - Uses generateStaticParams from content/projects.ts.
  - Uses generateMetadata for per-project title/description.
- /demos/azure-devops-pipeline from [app/demos/azure-devops-pipeline/page.tsx](../../app/demos/azure-devops-pipeline/page.tsx)
- /demos/aiops-incident-lab from [app/demos/aiops-incident-lab/page.tsx](../../app/demos/aiops-incident-lab/page.tsx)
- /robots.txt from [app/robots.ts](../../app/robots.ts)
- /sitemap.xml from [app/sitemap.ts](../../app/sitemap.ts)

### Implemented API
- POST /api/inquiry from [app/api/inquiry/route.ts](../../app/api/inquiry/route.ts)

## 3) Page and Component Responsibilities
### Layout and metadata
- [app/layout.tsx](../../app/layout.tsx)
  - Global metadata base/title/OG/Twitter.
  - Loads Google fonts and global styles.

### Navigation
- [components/navbar.tsx](../../components/navbar.tsx)
  - Desktop and mobile navigation.
  - Mobile menu open/close state and Esc handling.
  - Includes top-level Consultancy link.

### Home sections
- [components/hero.tsx](../../components/hero.tsx)
- [components/featured-projects-strip.tsx](../../components/featured-projects-strip.tsx)
- [components/demos-section.tsx](../../components/demos-section.tsx)
- [components/expertise-grid.tsx](../../components/expertise-grid.tsx)
- [components/experience-timeline.tsx](../../components/experience-timeline.tsx)
- [components/certification-grid.tsx](../../components/certification-grid.tsx)
- [components/contact-section.tsx](../../components/contact-section.tsx)

### Consultancy inquiry form
- [components/consultancy-inquiry-form.tsx](../../components/consultancy-inquiry-form.tsx)
  - Controlled client form state.
  - Submission to /api/inquiry using fetch.
  - Loading/success/error states.
  - Duplicate-submission prevention while sending.

### Project details and evidence
- [components/project-detail-template.tsx](../../components/project-detail-template.tsx)
- [components/engineering-evidence-section.tsx](../../components/engineering-evidence-section.tsx)

### Motion behavior
- [components/motion-wrapper.tsx](../../components/motion-wrapper.tsx)
  - Applies framer-motion reveal animation unless reduced motion is preferred.

## 4) Navigation Model
### Implemented links in navbar
- /#home
- /#about
- /#expertise
- /#projects
- /#experience
- /consultancy
- /#contact
- Resume download from profile.resumePath

### Mobile behavior
- Menu toggles with button (Menu/X).
- Closes when a mobile link is clicked.
- Esc key closes menu.

## 5) Responsive Behavior
### Implemented
- Tailwind breakpoints used across sections and cards.
- Mobile-first layout patterns with md/lg/xl variants.
- Inquiry form uses 2-column grid at md and above, single column on smaller widths.

### Styling foundations
- Global theme and effects in [app/globals.css](../../app/globals.css).
- Tokenized colors/shadows in [tailwind.config.ts](../../tailwind.config.ts).

## 6) Inquiry Form Fields and Payload
### Implemented fields
- name
- businessEmail
- company
- region
- service
- description
- timeline
- website (hidden honeypot)

### Client payload contract
Form submits JSON body with exactly the fields above to POST /api/inquiry.

## 7) Client and Server Validation
### Client-side constraints (implemented)
From [components/consultancy-inquiry-form.tsx](../../components/consultancy-inquiry-form.tsx) and [lib/inquiry-validation.ts](../../lib/inquiry-validation.ts):
- name min 2 max 80
- businessEmail max 254
- company min 2 max 120
- region min 2 max 80
- description min 3 max 3000
- timeline min 1 max 120
- required service selection from allow-list options

### Server-side validation (implemented)
From [lib/inquiry-validation.ts](../../lib/inquiry-validation.ts):
- Trims all string fields.
- Validates email format via deterministic checks.
- Validates service against INQUIRY_SERVICE_OPTIONS.
- Rejects non-empty honeypot website.
- On invalid payload returns reason invalid_submission and invalidFields list to caller in non-production only.

## 8) Inquiry API Contract
### Endpoint
- POST /api/inquiry

### Request body schema
- name: string
- businessEmail: string
- company: string
- region: string
- service: string
- description: string
- timeline: string
- website: string (honeypot, expected empty)

### Response codes (implemented)
- 200: { ok: true }
- 400: { ok: false, message } and in non-production also { reason, invalidFields }
- 429: { ok: false, message }
- 500: { ok: false, message }

For full API details see [api/inquiry-api.md](./api/inquiry-api.md).

## 9) Resend Integration
### Implemented
- Server sends email via fetch to https://api.resend.com/emails.
- Uses environment variables (names only):
  - RESEND_API_KEY
  - INQUIRY_TO_EMAIL
  - INQUIRY_FROM_EMAIL
- Sender uses INQUIRY_FROM_EMAIL.
- Recipient uses INQUIRY_TO_EMAIL.
- Reply-To uses validated businessEmail.

### Failure handling
- Missing env vars or non-success provider response leads to generic 500 response.
- Provider internals are not exposed to client response.

## 10) Honeypot and Rate Limiting
### Honeypot (implemented)
- Hidden website field in client form.
- Server rejects if website is non-empty.

### Rate limiting (implemented)
From [lib/inquiry-rate-limit.ts](../../lib/inquiry-rate-limit.ts):
- Production and non-development defaults:
  - enabled: true
  - maxRequests: 5
  - window: 15 minutes
- Development defaults:
  - enabled: true
  - maxRequests: 100
  - window: 1 minute
- Optional development-only bypass:
  - INQUIRY_DEV_RATE_LIMIT_MODE=bypass
- Optional development tuning:
  - INQUIRY_DEV_RATE_LIMIT_MAX
  - INQUIRY_DEV_RATE_LIMIT_WINDOW_MS

### Limitation (implemented and documented)
- In-memory limiter is not globally reliable across multiple serverless instances/cold starts.

## 11) Error Handling and Logging
### Implemented
- Validation failures:
  - generic user-facing message
  - safe invalid field names optionally returned in non-production
- Logging:
  - logs reason and invalid field names only
  - does not log inquiry body content
- API catch-all returns generic 500 response.

## 12) SEO and Metadata
### Implemented
- Global metadata in [app/layout.tsx](../../app/layout.tsx).
- Canonical URL resolution in [lib/site-url.ts](../../lib/site-url.ts).
- Robots route in [app/robots.ts](../../app/robots.ts).
- Sitemap route in [app/sitemap.ts](../../app/sitemap.ts), includes /consultancy and generated project entries.

## 13) Testing Coverage
### Implemented tests relevant to website functionality
- [tests/inquiry-validation.test.ts](../../tests/inquiry-validation.test.ts)
- [tests/inquiry-rate-limit.test.ts](../../tests/inquiry-rate-limit.test.ts)
- [tests/pipeline-simulator.test.ts](../../tests/pipeline-simulator.test.ts)
- [tests/aiops-incident-lab.test.ts](../../tests/aiops-incident-lab.test.ts)
- [tests/architecture-explorer.test.ts](../../tests/architecture-explorer.test.ts)
- [tests/project-evidence.test.ts](../../tests/project-evidence.test.ts)

### Not verified
- No repository artifact proves production monitoring, alerting, or live post-deployment smoke checks.

## 14) Proposed Improvements (Not yet implemented)
- Add integration tests for API route.ts with mocked fetch to Resend.
- Add explicit app CI workflow (lint/typecheck/test/build) under .github/workflows.
- Persist rate-limit state in shared store for multi-instance consistency.
