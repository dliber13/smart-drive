# Smart Drive Elite — Project Status

**Last Updated:** April 29, 2026
**Overall Completion:** 90%
**Estimated Valuation (current):** $400,000 - $500,000
**Estimated Valuation (at 100%):** $1,200,000 - $2,500,000

---

## Overview

Smart Drive Elite is a 100% automated real-time underwriting, deal structuring, and inventory matching platform for dealership use. No salesman touches the deal structure — the engine does everything. Salesmen submit customer info and required documents. The system decides.

Program waterfall order:
1. IBL (Income Based Lending / BHPH) — first
2. Retail — second
3. Lease — third
4. Subscription — fourth

---

## Stack

- Framework: Next.js 15, App Router, TypeScript
- Database: Prisma + Neon PostgreSQL (autumn-grass-29488256)
- File Storage: Vercel Blob (smart-drive-cjbl-blob) — Private, IAD1
- Deployment: Vercel PRO — unlimited deployments
- Auth: Custom HMAC-SHA256 signed sessions (no NextAuth)
- Encryption: AES-256-GCM for all PII fields
- AI: Anthropic Claude (claude-opus-4-5) — ID vision extraction
- Domain: smartdriveelite.com / smart-drive-cjbl.vercel.app

---

## CRITICAL — Environment Variables

Every time you run `npx vercel env pull .env.local` it REMOVES SESSION_SECRET and ENCRYPTION_KEY. Always re-add after pulling:

SESSION_SECRET=f9f927b2532ba665690f476ac536ddc234d62c5fc243b790e2ebcc6d30d53157
ENCRYPTION_KEY=65ad524efbf8c2af3a967a026d7dfdbe44eb374acd403b2240470fe848418176
ANTHROPIC_API_KEY=sk-ant-api03-[GET FROM VERCEL DASHBOARD]

Full .env.local needs:
- DATABASE_URL (auto-pulled)
- BLOB_READ_WRITE_TOKEN (auto-pulled)
- SESSION_SECRET (manually add after pull)
- ENCRYPTION_KEY (manually add after pull)
- ANTHROPIC_API_KEY (manually add after pull)

---

## Key IDs and Accounts

- GoodAutos Dealer ID: cmnoryqqa0000js04m6ybcf5v
- GoodAutos Dealer #: D3393
- GoodAutos Location: Gladstone, MO
- Admin login: doug.liber@smartdriveelite.com / Admin1234!
- Dealer login: anthony.noll@goodautos.com / GoodAutos6417!
- USPTO Trademark: #99764274 filed April 14, 2026
- Legal entity: Smart Drive Elite LLC, Missouri
- Vercel plan: PRO — unlimited deployments
- Vercel project: smart-drive-cjbl
- Blob store: smart-drive-cjbl-blob (Private, IAD1)

---

## Lender Waterfall (Internal — NOT shown publicly)

1. GLS
2. Westlake
3. CPS
4. MAC
5. WFI

NOTE: Lender names NOT shown on public homepage. Tiers only.

---

## Completed Features

### Security
- AES-256-GCM encryption — src/lib/encryption.ts
- HMAC-SHA256 signed sessions — src/lib/session.ts
- Edge-compatible middleware
- Auth on ALL API routes
- Rate limiting: login (5/15min), upload (20/hr), request-access (3/hr)
- Role-based access: DEALER_USER/MANAGER → /dealer, admins → /controller

### Homepage
- Mobile responsive
- Tier-based lender section (no lender names)
- 9-competitor table with correct categories
- Outcome-driven copy throughout

### Login / Auth
- Fixed Edge runtime crypto bug 4/29/2026
- Custom HMAC-SHA256 session — cookie: sde_session
- Role-based routing working correctly

### Deal Submission (src/app/dealer/page.tsx)
- Full customer, identity, financial, stability, vehicle intake
- Stip upload gate — 3 required docs before submit
- Real file upload to Vercel Blob
- Files: stips/{userId}/{documentType}/{timestamp}.{ext}
- Auto-fires identity verification after submission

### ID Authentication (src/app/api/verify-identity/route.ts) ✅ COMPLETE
- Downloads ID image from Vercel Blob
- Sends to Claude vision (claude-opus-4-5)
- Extracts: firstName, lastName, DOB, expiry, documentType
- Checks expiry — rejects if expired
- Checks name match against application
- Updates identityStatus: VERIFIED or REJECTED
- Updates ApplicationDocument.verifyStatus
- Auto-fires after deal submission

### Dealer Dashboard (src/app/dealer-dashboard/page.tsx)
- Dealer-filtered applications (security)
- Pipeline counts + metrics row
- Deal strength bar with color coding
- Full deal detail panel

### Controller Dashboard (src/app/controller/page.tsx)
- All applications across all dealers
- Filter tabs: Submitted, Approved, Declined, All
- Full metrics row
- Stip status dots + identity status
- Dealer name + number shown
- Underwriting decision form
- Vehicle matching engine panel
- Auth locked — admin roles only

### Infrastructure
- Vercel Blob storage LIVE
- Decision engine — 5-lender waterfall, PTI/DTI, risk scoring
- Admin panel — dealers, users, groups
- request-access API — saves to DealerRequest table
- admin/applications API — auth-gated, all-dealer view
- Rate limiting on key routes
- 34 vehicles active with VIN

---

## Foundation Build Order (Remaining — Do In Order)

1. ✅ TEST document upload end to end — COMPLETE 4/29/2026
2. ✅ ID Authentication — COMPLETE 4/29/2026
3. 700Credit Integration
   - Sign up at 700credit.com
   - Add CREDIT_API_KEY to Vercel env
   - Auto-fires on submission, returns score + tradelines
4. IBL Scoring Engine
5. Program Router
6. Vehicle Matching Engine
7. Decision Screen

Then after foundation:
- Logout button
- Audit trail viewer
- IBL payment calculator
- Billing
- CSV upload UI

---

## Known Issues

1. SESSION_SECRET, ENCRYPTION_KEY, ANTHROPIC_API_KEY wiped on every vercel env pull — always re-add manually
2. @/ alias maps to project root ./lib/ not ./src/lib/ — always put shared lib files in both /lib/ and /src/lib/

---

## Valuation Trajectory

- Today 90% complete: $400K-$500K
- At 100%: $1.2M-$2.5M
- With GoodAutos live revenue: $2M-$5M
- With 10+ dealers: $5M-$15M
- Series A target: $100M

---

## File Structure Key Files

src/app/api/verify-identity/route.ts — Claude vision ID auth
src/app/api/upload-document/route.ts — Vercel Blob upload
src/app/api/admin/applications/route.ts — admin all-dealer view
src/app/api/controller-decision/route.ts — auth-gated decision
src/app/api/dealer-dashboard/route.ts — dealer-filtered apps
src/app/api/request-access/route.ts — dealer request form
src/app/dealer/page.tsx — deal form with stip gate
src/app/dealer-dashboard/page.tsx — dealer metrics dashboard
src/app/controller/page.tsx — controller/admin dashboard
src/lib/session.ts — HMAC-SHA256 (NOTE: also at /lib/session.ts)
lib/rateLimit.ts — rate limiting (root lib folder)
src/middleware.ts — Edge-compatible role-based auth
prisma/schema.prisma — full data model
