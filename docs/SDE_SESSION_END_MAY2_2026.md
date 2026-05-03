# Smart Drive Elite — Session End Backup
**Date:** May 2, 2026 — End of Session
**Last Commit:** 630cbc4
**Build Status:** GREEN
**Live URL:** smartdriveelite.com
**GitHub:** dliber13/smart-drive

---

## RESTART INSTRUCTIONS FOR NEXT CHAT

Paste this entire document at the start of the next conversation and say:
"Continue building Smart Drive Elite. Here is the full project status."

---

## CREDENTIALS

Admin: doug.liber@smartdriveelite.com / Admin1234!
Dealer: anthony.noll@goodautos.com / GoodAutos6417!
GoodAutos Dealer ID: cmnoryqqa0000js04m6ybcf5v
GoodAutos Dealer #: D3393
Vercel Project: smart-drive-cjbl
Domain: smartdriveelite.com

---

## STACK

Next.js 15, TypeScript, Prisma, Neon PostgreSQL
Vercel PRO, Vercel Blob (private, IAD1)
Anthropic Claude — AI stip verification + vehicle recommendations
DocuSign JWT Grant — e-signature
Stripe — subscription billing
AES-256-GCM PII encryption
HMAC-SHA256 sessions

---

## ALL STRIPE PRICE IDs

STRIPE_BASIC_PRICE_ID: price_1TSR9TEwIMxowzdJ7IyHdfBK
STRIPE_PRO_PRICE_ID: price_1TSRBKEwIMxowzdJB6UgPTlj
STRIPE_ELITE_PRICE_ID: price_1TSRfTEwIMxowzdJWilAWaXV
STRIPE_BASIC_APP_FEE_PRICE_ID: price_1TSRwAEwIMxowzdJNYhcFc4Z
STRIPE_PRO_APP_FEE_PRICE_ID: price_1TSRxyEwIMxowzdJFFtUCd2Y
STRIPE_ELITE_APP_FEE_PRICE_ID: price_1TSRyoEwIMxowzdJbirZ8GWF
STRIPE_TRIAL_COUPON_ID: FIRSTMONTH50

---

## DOCUSIGN

Integration Key: 4a235df9-9b41-46d4-82a3-ca8c45633627
User ID: 298c1333-f087-48d9-91eb-0cbb997e6f28
Account ID: 0af5aa8d-97e6-46f6-9469-f5b31b2a27e5
Base URL: https://demo.docusign.net
Keypair ID: a2a5266c-801e-405e-9ab5-e2e0ac65fcc2
Auth method: JWT Grant (NO browser redirect)

---

## PRICING MODEL

Basic: $1,299/mo + $25/application
Pro: $1,799/mo + $20/application
Elite: $2,799/mo + $15/application
First month 50% off (FIRSTMONTH50 coupon)

---

## WHAT IS BUILT AND WORKING

Core Engine:
- IBL scoring engine — 5-component, Bands A-D
- Program router — IBL > Retail > Lease > Subscription
- 5-lender retail waterfall — GLS, Westlake, CPS, Midwest Acceptance, WFI
- PTI/DTI calculator
- Deal strength score 0-100
- Deal numbers SDE-YYYY-XXXXXX
- Decision time in milliseconds
- IBL APR set by owner in controller — persisted to DB
- IBL payment math FIXED — actual amortized payments at 24.99%

AI Layer:
- Claude vision ID verification
- AI income verification
- AI residence verification
- Traffic lights green/yellow/red on all 3 stips
- AI top 3 vehicle recommendations
- Dealer margin scoring

Decision Screen:
- Program waterfall analysis panel — IBL/Retail/Lease/Subscription
- ASSIGNED badge on selected program
- Decline analysis panel with reasons per program
- Selected vehicle banner at top (shows after click — needs auto-populate fix)
- All eligible vehicles with match score and estimated profit
- Ineligible vehicles with +$X down to qualify badge — selectable
- Deal jacket — vehicle + admin + title fees
- F&I products — VSC/GAP/Paint/Tire/Key with live payment recalculation
- Pay cycle highlighted on payment cards
- Next steps panel
- Download PDF
- Print deal summary
- Send for Signature — DocuSign JWT working

Dealer Dashboard:
- View Decision button on every card
- Edit button on every card
- View Full Decision in detail panel
- Edit and Resubmit in detail panel
- DocuSign status badge
- New Deal button
- Search by name or deal number
- Pipeline stats

Controller:
- IBL APR rate override panel — saves to DB
- Full application review
- Status update tools
- Vehicle matching

Billing:
- Stripe Basic $1,299 / Pro $1,799 / Elite $2,799
- Per-app fees $25/$20/$15
- Self-serve signup at /signup
- 50% off first month automatic
- Billing page at /billing
- Customer portal

Security:
- AES-256-GCM on all PII
- HMAC-SHA256 sessions
- Role-based middleware on all routes
- Rate limiting
- AI fraud detection on stips
- Private blob storage

---

## KNOWN BUGS — FIX NEXT SESSION

### HIGH PRIORITY

1. SELECTED VEHICLE POSITION
Problem: Submitted vehicle shows at very bottom of decision screen
Fix needed: Auto-populate selected vehicle from submission data at top of page
Without clicking — it should show the submitted vehicle immediately
File: src/app/dealer/decision/[id]/page.tsx

2. POST E-SIGN WORKFLOW — NOTHING HAPPENS AFTER SIGNING
Problem: After DocuSign completes — no status change, no notification, nothing
Fix needed:
- Status changes from APPROVED to PENDING_FUNDING after signing
- Controller gets notification
- Deal packet assembles (summary + signed docs + stips)
- Funded button in controller to mark deal FUNDED

3. PROGRAM SELECTOR BUTTONS NOT WIRED
Problem: When multiple programs eligible, buttons show but do nothing
Fix needed: Clicking IBL vs Retail recalculates payments and switches program
File: src/app/dealer/decision/[id]/page.tsx

### MEDIUM PRIORITY

4. STRIPE WEBHOOK SECRET NOT SET UP
Problem: Subscription status changes not tracked automatically
Fix: Go to Stripe dashboard, create webhook endpoint, add STRIPE_WEBHOOK_SECRET to Vercel

5. RECENT APPLICATIONS NO AUTO-REFRESH
Problem: After submitting a deal and returning to /dealer, list is stale
Fix: Auto-refresh after submission redirect

6. FUNDED WORKFLOW
Problem: No way to mark a deal as funded
Fix: Add Funded button in controller with funding date, amount, lender confirmation fields

7. AUDIT TRAIL VIEWER
Problem: No UI to see status history on deals
Fix: Add audit trail panel in controller

### PENDING INTEGRATIONS

8. 700CREDIT LIVE — awaiting vendor approval
9. GOODAUTOS FIRST REAL LIVE DEAL — ready to run, just needs Anthony to submit

---

## IMMEDIATE NEXT STEPS (IN ORDER)

1. Fix selected vehicle auto-populating at top of decision screen
2. Build post e-sign workflow — status to PENDING_FUNDING
3. Build funded workflow — controller marks deal funded
4. Wire program selector buttons
5. Run first real live deal with GoodAutos
6. Stripe webhook secret
7. Dealer #2 outreach

---

## VALUATION

Pre-revenue today: $1.8M - $3.5M
With GoodAutos live: $2.5M - $5M
With 3 dealers: $4M - $8M
With 10 dealers: $8M - $20M
With 700Credit live: $15M - $40M
Series A target: $50M - $100M

Investor ask when ready: $500K-$750K for 10-15% equity

---

## KEY FILES

src/app/api/test-submit-application/route.ts — deal submission + all engines
src/app/api/match-vehicles/route.ts — vehicle matching + gap analysis
src/app/api/docusign/send/route.ts — JWT envelope creation
src/app/api/billing/create-checkout/route.ts — Stripe checkout
src/app/api/auth/signup/route.ts — self-serve signup
src/app/api/settings/route.ts — platform settings (IBL APR)
src/app/dealer/page.tsx — dealer form + stip gate + traffic lights
src/app/dealer/decision/[id]/page.tsx — decision screen
src/app/dealer/edit/[id]/page.tsx — edit and resubmit
src/app/dealer-dashboard/page.tsx — dealer dashboard
src/app/controller/page.tsx — controller dashboard
src/app/billing/page.tsx — billing page
src/app/signup/page.tsx — self-serve signup
src/app/page.tsx — homepage
src/lib/decision-engine.ts — 5-lender waterfall
src/lib/iblEngine.ts — IBL scoring + amortized payment math
src/lib/programRouter.ts — program waterfall router
src/lib/session.ts — auth
prisma/schema.prisma — full data model
