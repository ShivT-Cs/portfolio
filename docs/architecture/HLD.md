# Portfolio Website High-Level Design (HLD)

## Scope
This document describes the implemented architecture of the Next.js consultancy portfolio in this repository.

Related documents:
- [Low-Level Design](./LLD.md)
- [Inquiry API Specification](./api/inquiry-api.md)
- [Mermaid Source Diagram](./architecture-diagram.mmd)

## 1) System Context
### Implemented
- Public web portfolio for consultant profile, case studies, demos, and consultancy inquiry intake.
- Primary users:
  - Recruiters and hiring managers
  - Engineering leaders and potential clients
- Main interaction channels:
  - Static and dynamic web pages
  - Consultancy inquiry form that sends email through Resend

### External systems
- Resend Email API for inquiry delivery.
- Vercel is the documented hosting target in [README.md](../../README.md).

### Not verified
- No verified production deployment status is stored in repository artifacts.

## 2) Architecture Overview
### Implemented architecture style
- Monolithic Next.js web app using App Router.
- Mixed rendering model:
  - Static routes for main pages and demos.
  - Dynamic route for case-study details at /projects/[slug] with generateStaticParams.
- Single server API endpoint for inquiry handling at /api/inquiry.

### Mermaid architecture diagram
```mermaid
flowchart TB
  visitor[Visitor Browser]

  subgraph vercel[Vercel Hosted Next.js App]
    appRouter[Next.js App Router]

    subgraph pages[Pages and Routes]
      home[/ /]
      consultancy[/consultancy]
      demoPipeline[/demos/azure-devops-pipeline]
      demoAiops[/demos/aiops-incident-lab]
      projectDetail[/projects/[slug]/]
      robots[/robots.txt]
      sitemap[/sitemap.xml]
    end

    subgraph ui[Client UI Components]
      navbar[Navbar]
      inquiryForm[ConsultancyInquiryForm]
      motion[MotionWrapper]
      demos[Demos and Simulators]
    end

    subgraph dataModules[Data and Domain Modules]
      contentData[content/* static content]
      inquiryValidation[inquiry-validation]
      inquiryRateLimit[inquiry-rate-limit]
      inquiryServices[inquiry-services]
      siteUrl[site-url]
    end

    subgraph api[Server API]
      inquiryApi[/api/inquiry POST]
    end
  end

  subgraph integrations[External Integration]
    resend[Resend Email API]
  end

  subgraph tests[Automated Tests]
    nodeTests[node:test suite]
  end

  visitor --> home
  visitor --> consultancy
  visitor --> demoPipeline
  visitor --> demoAiops
  visitor --> projectDetail

  appRouter --> pages
  home --> navbar
  home --> contentData
  consultancy --> inquiryForm
  consultancy --> contentData
  inquiryForm --> inquiryApi

  inquiryApi --> inquiryValidation
  inquiryApi --> inquiryRateLimit
  inquiryValidation --> inquiryServices
  inquiryApi --> resend

  robots --> siteUrl
  sitemap --> siteUrl
  sitemap --> contentData

  demos --> dataModules
  nodeTests --> dataModules
  nodeTests --> api
```

## 3) Technology Stack
### Implemented
- Framework: Next.js 16.3.6 (App Router)
- Language: TypeScript 6.x
- UI: React 19.x
- Styling: Tailwind CSS 3.x + global CSS
- Animation: framer-motion
- Icons: lucide-react
- Linting: ESLint with Next core-web-vitals and TypeScript presets
- Testing: node:test executed after TypeScript compile to .test-dist
- Runtime integration: Resend HTTP API called via fetch from server route

## 4) Major Components and Boundaries
### Implemented
- Presentation and navigation
  - Home page and section-based content
  - Consultancy page with inquiry form
  - Project detail pages and demo pages
- Content layer
  - Centralized static data under content/*
- API layer
  - One inquiry endpoint with validation, abuse protection, and external email integration
- Utility/domain layer
  - Inquiry validation
  - Inquiry rate limiter
  - Site URL resolution for metadata/sitemap/robots
- Test layer
  - Unit and integrity tests for simulators, architecture data, inquiry validation/rate limiting, and evidence metadata

## 5) User Journeys
### Implemented journeys
1. Portfolio exploration
- Visitor lands on / and navigates sections via anchor-based navbar links.
- Visitor opens case-study details at /projects/[slug].

2. Demo exploration
- Visitor opens deterministic local demos at:
  - /demos/azure-devops-pipeline
  - /demos/aiops-incident-lab

3. Consultancy inquiry submission
- Visitor opens /consultancy.
- Visitor fills inquiry form and submits.
- Client sends JSON POST to /api/inquiry.
- Server validates payload and applies honeypot/rate-limit checks.
- If valid, server sends email via Resend and returns { ok: true }.

## 6) Hosting and Deployment Architecture
### Implemented/documented
- Hosting target: Vercel, documented in [README.md](../../README.md).
- Build command: npm run build.
- App runtime: standard Next.js server build.
- Canonical URL resolution uses:
  - NEXT_PUBLIC_SITE_URL
  - fallback to Vercel URL env vars
  - fallback to https://example.com

### Implemented CI beyond app build
- GitHub workflow exists for Terraform landing-zone checks only:
  - [.github/workflows/landing-zone-iac-checks.yml](../../.github/workflows/landing-zone-iac-checks.yml)

### Not verified
- No repository evidence proving production deploy pipeline execution for the Next.js app.

## 7) Integrations
### Implemented
- Resend Email API endpoint: https://api.resend.com/emails
- Integration purpose: delivery of inquiry submissions from /api/inquiry.

### Secrets handling
- Environment variable names only (values not documented here):
  - RESEND_API_KEY
  - INQUIRY_TO_EMAIL
  - INQUIRY_FROM_EMAIL

## 8) Security Architecture
### Implemented controls
- Server-side validation for required fields, lengths, email format, and allowed service values.
- Honeypot field website enforced server-side.
- In-memory rate limiting with stricter production defaults.
- Development-only limiter relax/bypass controlled only by server environment variables.
- Reply-To uses validated visitor email; sender uses server-configured INQUIRY_FROM_EMAIL.
- Generic server errors for email delivery failure; no provider internals returned.
- Validation logs contain only safe metadata (reason and invalid field names).

### Known limitation (implemented and documented in code)
- In-memory limiter is not globally consistent across multiple serverless instances/cold starts.

## 9) Non-Functional Requirements (NFRs)
### Implemented
- Responsive layout across sections and mobile navbar.
- Keyboard-accessible controls and focus-visible styles.
- Reduced-motion support through MotionWrapper and CSS media query.
- SEO metadata, OpenGraph/Twitter metadata, robots.txt, and sitemap.xml.
- Strict TypeScript configuration and lint/test scripts.

### Not verified
- No Lighthouse, load, or uptime metrics are committed as evidence.

## 10) Proposed Improvements (Not yet implemented)
- Replace in-memory rate limiting with shared persistent storage for multi-instance consistency.
- Add explicit app CI workflow for lint/typecheck/test/build on pull requests.
- Add structured observability around API failures without logging inquiry content.
- Optional: convert inquiry API to provider SDK if required for operational consistency.
