# Smart Drive Elite — Project Status

**Last Updated:** April 29, 2026
**Overall Completion:** 83%
**Estimated Valuation (current):** $350,000 - $450,000
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
- Domain: smartdriveelite.com / smart-drive-cjbl.vercel.app

---

## CRITICAL — Environment Variables

Every time you run `npx vercel env pull .env.local` it REMOVES SESSION_SECRET and ENCRYPTION_KEY. Always re-add after pulling:

SESSION_SECRET=f9f927b2532ba665690f476ac536ddc234d62c5fc243b790e2ebcc6d30d53157
ENCRYPTION_KEY=65ad524efbf8c2af3a967a026d7dfdbe44eb374acd403b2240470fe848418176

Full .env.local needs:
- DATABASE_URL (auto-pulled)
- BLOB_READ_WRITE_TOKEN (auto-pulled)
- SESSION_SECRET (manually add after pull)
- ENCRYPTION_KEY (manually add after pull)

---

## Key IDs and Accounts

- GoodAutos Dealer ID: cmnoryqqa0000js04m6ybcf5v
- GoodAutos Dealer #: D3393
- GoodAutos Location: Gladstone, MO
- Admin login: doug.liber@smartdriveelite.com
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

## Competitive Positioning

Smart Drive Elite is a NEW CATEGORY:
- NOT a DMS (not CDK, Tekion, DealerCenter)
- NOT infrastructure (not DealerTrack, RouteOne)
- NOT a CRM (not DealerSocket)
- NOT an F&I menu (not Darwin)
- DECISION + OPTIMIZATION + INTELLIGENCE layer

Slogan: Built for what they were never designed for.
Hero: The finance desk. Rebuilt from the ground up.
CTA: Access the Decision Engine
Comparison header: Legacy platforms manage deals. Smart Drive Elite decides them.
Comparison sub: Most platforms help you submit deals. We control the outcome.

Competitor table (9 competitors, correct categories):
- Smart Drive Elite = Decision Intelligence (NEW CATEGORY)
- DealerTrack / RouteOne = Infrastructure
- CDK / Tekion / DealerCenter = DMS
- DealerSocket = CRM
- Darwin Auto = F&I Menu
- Reynolds = Legacy DMS

---

## Completed Features

### Security
- AES-256-GCM encryption — src/lib/encryption.ts
- HMAC-SHA256 signed sessions — src/lib/session.ts
- Hardened middleware
- PII fields: ssnEncrypted, dobEncrypted, dlEncrypted, dlState, ipAddress, userAgent

### Homepage
- Mobile responsive — clamp-based fluid layout
- Viewport meta tag in layout.tsx
- Tier-based lender section (no lender names)
- 9-competitor table with correct categories
- Legal disclaimer on comparison table
- Outcome-driven copy throughout

### Deal Submission Form (src/app/dealer/page.tsx)
- Customer: firstName, lastName, phone, email
- Identity: SSN, DOB, DL number, DL state
- Financial: monthlyIncome, payFrequency, monthlyExpenses, downPayment
- Stability: residenceMonths, employmentMonths
- Credit score (optional)
- Vehicle dropdown from inventory
- Stip upload gate — 3 required docs before submit allowed:
  - Government-issued ID
  - Proof of Income
  - Proof of Residence
- Real file upload wired to Vercel Blob
- Files stored at: stips/{userId}/{documentType}/{timestamp}.{ext}
- 10MB max, allowed: PDF, JPG, PNG, HEIC
- Upload API: src/app/api/upload-document/route.ts

### Infrastructure
- Vercel Blob storage LIVE (smart-drive-cjbl-blob)
- @vercel/blob package installed
- Decision engine — 5-lender waterfall, PTI/DTI, risk scoring
- Admin panel — dealers, users, groups
- CSV import API
- 34 vehicles active with VIN

---

## Foundation Build Order (Remaining — Do In Order)

1. TEST document upload end to end
   - Login as dealer at smartdriveelite.com/dealer
   - Upload all 3 stips
   - Confirm files appear in Vercel Blob browser
   - Confirm submit button unlocks

2. ID Authentication
   - Scan DL, verify expiry, name match
   - Wire to identityStatus on Application

3. 700Credit Integration
   - Sign up at 700credit.com — get API credentials
   - Add CREDIT_API_KEY to Vercel env vars
   - Auto-fires on submission
   - Returns score, tradelines, DTI data

4. IBL Scoring Engine
   - PTI/DTI calculation
   - Income + residence stability scoring
   - Risk tier assignment
   - Uses 700Credit data + form data

5. Program Router
   - Auto-assigns IBL > Retail > Lease > Subscription
   - No salesman input, full audit trail

6. Vehicle Matching Engine
   - Filter inventory to qualifying vehicles only

7. Decision Screen
   - Read only — no editable fields
   - Approved/declined + program + vehicles + payment

Then after foundation:
- Dealer dashboard metrics
- Audit trail
- Rate limiting
- IBL payment calculator
- Billing
- CSV upload UI
- autoComplete="off" on request-access form

---

## Known Issues

1. SESSION_SECRET and ENCRYPTION_KEY wiped on every vercel env pull — always re-add manually
2. crypto/Edge runtime warning in middleware — warning only, not breaking
3. request-access form shows browser autofill — need autoComplete="off"

---

## Valuation Trajectory

- Today 83% complete: $350K-$450K
- At 100%: $1.2M-$2.5M
- With GoodAutos live revenue: $2M-$5M
- With 10+ dealers: $5M-$15M
- Series A target: $100M

---

## File Structure Key Files

src/app/api/upload-document/route.ts — Vercel Blob upload (NEW)
src/app/dealer/page.tsx — deal form with stip gate + real upload
src/app/page.tsx — homepage mobile responsive
src/lib/encryption.ts — AES-256-GCM
src/lib/session.ts — HMAC-SHA256
src/middleware.ts — role-based auth
prisma/schema.prisma — full data model
