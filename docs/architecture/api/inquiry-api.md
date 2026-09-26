# Inquiry API Specification

## Endpoint
- Method: POST
- Path: /api/inquiry
- Source: [app/api/inquiry/route.ts](../../../app/api/inquiry/route.ts)

## Purpose
Accept consultancy inquiry submissions, enforce validation and abuse controls, and send a notification email through Resend.

## Request Schema
Expected JSON body:

- name: string
- businessEmail: string
- company: string
- region: string
- service: string
- description: string
- timeline: string
- website: string (honeypot; must be empty)

Validation implementation:
- [lib/inquiry-validation.ts](../../../lib/inquiry-validation.ts)
- [lib/inquiry-services.ts](../../../lib/inquiry-services.ts)

## Environment Variables (names only)
- RESEND_API_KEY
- INQUIRY_TO_EMAIL
- INQUIRY_FROM_EMAIL

Rate-limit behavior may also use:
- NODE_ENV
- INQUIRY_DEV_RATE_LIMIT_MODE
- INQUIRY_DEV_RATE_LIMIT_MAX
- INQUIRY_DEV_RATE_LIMIT_WINDOW_MS

## Validation Rules
### Required semantics
- All user fields are trimmed server-side.
- name length: 2 to 80
- businessEmail: valid email format and max 254
- company length: 2 to 120
- region length: 2 to 80
- service: must be one of INQUIRY_SERVICE_OPTIONS
- description length: 3 to 3000
- timeline length: 1 to 120
- website honeypot must be empty

### Allowed service values
- Azure Cloud Architecture and Consulting
- Cloud Migration and Business IT Onboarding
- DevOps and Platform Engineering
- Microsoft Active Directory and IT Automation
- Cloud Security, Governance and Reliability
- AI Agents and Intelligent Business Automation
- IT Architecture and Technical Advisory

## Abuse Protection
### Honeypot
- Hidden website field is included in request payload.
- Non-empty value results in 400 invalid submission.

### Rate limiting
Implementation in [lib/inquiry-rate-limit.ts](../../../lib/inquiry-rate-limit.ts):
- Production and non-development behavior:
  - enabled true
  - max 5 requests
  - 15-minute window
- Development behavior:
  - enabled true by default
  - max 100 requests
  - 1-minute window
  - optional bypass with INQUIRY_DEV_RATE_LIMIT_MODE=bypass

Important limitation:
- Limiter state is in-memory and not globally consistent across multiple serverless instances or cold starts.

## Email Delivery Workflow
1. API receives POST payload.
2. API evaluates rate limit using client identifier from x-forwarded-for, then x-real-ip, else unknown.
3. API validates payload using validateInquiry.
4. On success, API sends request to Resend endpoint https://api.resend.com/emails.
5. Email fields:
   - from: INQUIRY_FROM_EMAIL
   - to: INQUIRY_TO_EMAIL
   - reply_to: validated businessEmail
   - subject: Consultancy inquiry plus selected service
   - text: plain text summary of validated inquiry fields
6. API returns 200 only when Resend response is successful and includes id.

## Response Contract
### 200 OK
```json
{ "ok": true }
```

### 400 Bad Request
```json
{ "ok": false, "message": "Please review the form details and try again." }
```

In non-production environments, the response may include safe debugging fields:
- reason
- invalidFields

### 429 Too Many Requests
```json
{ "ok": false, "message": "Too many requests. Please try again later." }
```

### 500 Internal Server Error
```json
{ "ok": false, "message": "Unable to send inquiry right now. Please try again later." }
```

## Security and Privacy Notes
### Implemented
- API keys are only read server-side from environment variables.
- Inquiry body values are not logged.
- Validation logs include safe metadata only (reason and invalid field names).
- Provider error internals are not returned to client.

### Not verified
- No repository evidence of centralized secret rotation policy or runtime secret scanning in deployment environment.

## Proposed Improvements (Not implemented)
- Add structured error codes in production-safe format for better client telemetry.
- Add integration tests that mock Resend HTTP responses in route-level API tests.
