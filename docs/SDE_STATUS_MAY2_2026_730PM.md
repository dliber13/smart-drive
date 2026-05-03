# Smart Drive Elite — Full Project Status
**Date:** May 2, 2026 — 7:30 PM Central
**Last Commit:** 069b23f
**Build Status:** GREEN ✅
**Live URL:** smartdriveelite.com

---

## KNOWN BUGS / NEEDS FIXING (Priority Order)

### 1. IBL Payment Math Is Wrong — HIGH PRIORITY
**Problem:** IBL payments ($512/mo, $118/wk, $236/biweekly) are income-based caps, not amortized payments
**What it should be:** Actual amortized payment on selected vehicle at 24.99% over term
**Example:** $19,708 at 24.99% for 36 months = ~$745/mo not $512
**File:** src/lib/iblEngine.ts — maxPayment calculation
**Impact:** Wrong payment shown to customer and dealer

### 2. Recent Applications Not Auto-Refreshing — MEDIUM
**Problem:** After submitting a deal and returning to /dealer, the recent applications list is stale
**Fix needed:** Auto-refresh or reload after submission redirect
**File:** src/app/dealer/page.tsx

### 3. Program Selector Buttons Not Wired — MEDIUM
**Problem:** When multiple programs are eligible (IBL + Retail), selector buttons show but clicking them does nothing — does not recalculate payments or switch program
**File:** src/app/dealer/decision/[id]/page.tsx
**Impact:** Dealer cannot choose between programs

### 4. Selected Vehicle Position — PARTIALLY FIXED
**Status:** Banner now shows at top ✅ but vehicles still also show at bottom
**May need:** Hide bottom position once banner is showing at top

### 5. Stripe Webhook Secret — NOT SET UP
**Problem:** Webhook endpoint exists but STRIPE_WEBHOOK_SECRET not configured
**Impact:** Subscription status changes not automatically tracked
**Workaround:** Manual Stripe portal check

### 6. DocuSign OAuth Route Still Exists
**Problem:** Old OAuth auth route still in codebase even though we switched to JWT
**File:** src/app/api/docusign/auth/route.ts — can be deprecated
**Impact:** Minor — just dead code

---

## COMPLETED TODAY (May 2, 2026)

### DocuSign
- ✅ Switched from OAuth to JWT Grant — no browser redirect
- ✅ RSA keypair generated and stored as DOCUSIGN_PRIVATE_KEY
- ✅ Consent granted at account-d.docusign.com
- ✅ Send for Signature working — tested successfully
- ✅ Tab positions fixed (TAB_OUT_OF_BOUNDS resolved)
- ✅ Deal number included in envelope subject

### Stripe Billing
- ✅ 3 subscription products: Basic $1,299 / Pro $1,799 / Elite $2,799
- ✅ 3 per-app fee products: $25 / $20 / $15
- ✅ All 8 Stripe env vars in Vercel
- ✅ FIRSTMONTH50 coupon — 50% off first month
- ✅ Billing page at /billing with plan cards
- ✅ Billing & Plans link in dealer dashboard header
- ✅ Stripe checkout with coupon applied at signup

### Self-Serve Signup
- ✅ /signup page with plan selector and dealer registration
- ✅ /api/auth/signup — creates Dealer + User + Stripe customer + checkout
- ✅ 50% off first month applied automatically
- ✅ Homepage CTAs updated to "Get Started — 50% Off First Month →"

### Program Waterfall
- ✅ Program waterfall analysis panel on decision screen
- ✅ IBL / Retail / Lease / Subscription — each shows eligible/not with reason
- ✅ ASSIGNED badge on selected program
- ✅ Multiple program selector buttons (UI only — not wired yet)
- ✅ programWaterfallJson saved to DB on every submission
- ✅ PlatformSetting table added to schema

### IBL Fixes
- ✅ IBL APR set to 24.99% default
- ✅ IBL APR override in controller dashboard — owner can set any rate 0-24.99%
- ✅ IBL APR persisted to DB via PlatformSetting table
- ✅ IBL lender shows "IBL / In-House" not retail lender
- ✅ IBL tier shows "IBL Band X" 
- ✅ IBL decision reason shows IBL text not retail text
- ✅ Term shows in months
- ✅ APR shows "in-house rate" label
- ⚠️ Payment math is WRONG — needs fix (see bugs above)

### Vehicle Display
- ✅ Selected vehicle banner at top of decision screen
- ✅ Gross/net profit on all vehicle cards (bookValue vs askingPrice)
- ✅ Ineligible vehicles with "+$X down to qualify" badge
- ✅ Ineligible vehicles now selectable with warning
- ✅ AI top 3 recommendations — gold/blue/green ranked cards

### Decline Reasons
- ✅ Decline analysis panel on declined deals
- ✅ Shows which programs failed and why
- ✅ "What can improve this decision?" tips panel

### Deal Numbers
- ✅ SDE-YYYY-XXXXXX on every deal
- ✅ All existing deals backfilled
- ✅ Shows on: decision screen, dashboard cards, controller, PDF, DocuSign envelope

### Dashboard
- ✅ /dashboard redirects to /dealer-dashboard
- ✅ View Decision button on every queue card
- ✅ Edit button on every queue card
- ✅ View Full Decision button in detail panel
- ✅ Edit & Resubmit button in detail panel
- ✅ DocuSign status badge in detail panel
- ✅ + New Deal button in header

### Upload
- ✅ Upload limit increased to 20MB
- ✅ HEIF support added

---

## PENDING / NEXT PRIORITIES

### Immediate
1. Fix IBL payment math — amortized payments not income caps
2. Wire program selector buttons — let dealer choose IBL vs Retail
3. Auto-refresh recent applications after submission
4. Run first real live deal with GoodAutos

### Short Term
5. Funded status workflow — button to move deal from APPROVED to FUNDED
6. Audit trail viewer in controller
7. Stripe webhook secret setup
8. 700Credit live integration (awaiting approval)

### Growth
9. Dealer #2 outreach
10. Investor pitch prep
11. Multi-rooftop dealer support

---

## ALL ENV VARS (Vercel Production + Preview)

DATABASE_URL — Neon PostgreSQL
SESSION_SECRET — f9f927b2532ba665690f476ac536ddc234d62c5fc243b790e2ebcc6d30d53157
ENCRYPTION_KEY — 65ad524efbf8c2af3a967a026d7dfdbe44eb374acd403b2240470fe848418176
ANTHROPIC_API_KEY — in Vercel
BLOB_READ_WRITE_TOKEN — in Vercel

DocuSign:
DOCUSIGN_INTEGRATION_KEY — 4a235df9-9b41-46d4-82a3-ca8c45633627
DOCUSIGN_USER_ID — 298c1333-f087-48d9-91eb-0cbb997e6f28
DOCUSIGN_ACCOUNT_ID — 0af5aa8d-97e6-46f6-9469-f5b31b2a27e5
DOCUSIGN_BASE_URL — https://demo.docusign.net
DOCUSIGN_KEYPAIR_ID — a2a5266c-801e-405e-9ab5-e2e0ac65fcc2
DOCUSIGN_PRIVATE_KEY — sensitive, in Vercel only
DOCUSIGN_SECRET_KEY — sensitive, in Vercel only

Stripe:
STRIPE_SECRET_KEY — sensitive, in Vercel only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — pk_test_51TSQnfEwIMxowzdJbifOB0Wg5jNXId7Yg5PNa5EYMBzhr5NRI6K0RIWE9h752UZ0EsLl8Pn5R5S1Bl8g0f9J8ZUU00hlAmhIti
STRIPE_BASIC_PRICE_ID — price_1TSR9TEwIMxowzdJ7IyHdfBK
STRIPE_PRO_PRICE_ID — price_1TSRBKEwIMxowzdJB6UgPTlj
STRIPE_ELITE_PRICE_ID — price_1TSRfTEwIMxowzdJWilAWaXV
STRIPE_BASIC_APP_FEE_PRICE_ID — price_1TSRwAEwIMxowzdJNYhcFc4Z
STRIPE_PRO_APP_FEE_PRICE_ID — price_1TSRxyEwIMxowzdJFFtUCd2Y
STRIPE_ELITE_APP_FEE_PRICE_ID — price_1TSRyoEwIMxowzdJbirZ8GWF
STRIPE_TRIAL_COUPON_ID — FIRSTMONTH50

---

## KEY CREDENTIALS

Admin: doug.liber@smartdriveelite.com / Admin1234!
Dealer: anthony.noll@goodautos.com / GoodAutos6417!
GoodAutos Dealer ID: cmnoryqqa0000js04m6ybcf5v
GoodAutos Dealer #: D3393

---

## PRICING MODEL
- Basic: $1,299/mo + $25/application
- Pro: $1,799/mo + $20/application
- Elite: $2,799/mo + $15/application
- First month 50% off (FIRSTMONTH50)

---

## VALUATION (May 2, 2026)
- Current (pre-revenue): $1.8M - $3.5M
- With GoodAutos live: $2.5M - $5M
- With 3 dealers: $4M - $8M
- With 10 dealers: $8M - $20M
- With 700Credit live: $15M - $40M

---

## STACK
- Next.js 15, TypeScript, Prisma, Neon PostgreSQL
- Vercel PRO deployment
- Vercel Blob private storage
- Anthropic Claude — AI stip verification + vehicle recommendations
- DocuSign JWT Grant — e-signature
- Stripe — subscription billing
- AES-256-GCM encryption on all PII
- HMAC-SHA256 signed sessions
