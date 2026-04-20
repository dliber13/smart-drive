import Link from "next/link";

const investorPoints = [
  {
    title: "Real Workflow",
    description:
      "Built around actual dealership finance operations: intake, verification, controller review, and structured deal output.",
  },
  {
    title: "Clear Market Use",
    description:
      "Designed for auto finance teams that need faster decisions, cleaner process control, and stronger lender routing discipline.",
  },
  {
    title: "Platform Depth",
    description:
      "Smart Drive Elite is positioned as operational infrastructure, not just a landing page or lead-gen concept.",
  },
];

const operatingHighlights = [
  "Dealer Intake",
  "Identity Verification",
  "Controller Review",
  "Lender Direction",
];

export default function Home() {
  return (
    <main className="bg-[#030816] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#f7f3ec] text-[#111111]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(194,161,93,0.18),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(194,161,93,0.08),transparent_20%),linear-gradient(180deg,#f7f3ec_0%,#f3eee6_58%,#ece5da_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.018)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />

        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-white/60 shadow-sm backdrop-blur">
                <span className="text-2xl font-semibold tracking-[0.18em]">
                  SDE
                </span>
              </div>
              <div>
                <div className="text-4xl font-semibold tracking-tight">
                  Smart Drive Elite
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.42em] text-black/70">
                  Controlled Underwriting Platform
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-10 text-sm font-medium text-black/80 lg:flex">
              <a href="#overview" className="transition hover:text-black">
                Overview
              </a>
              <a href="#platform" className="transition hover:text-black">
                Platform
              </a>
              <a href="#investor" className="transition hover:text-black">
                Opportunity
              </a>
              <Link href="/login" className="transition hover:text-black">
                Login
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/request-access"
                className="hidden rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80 sm:inline-flex"
              >
                Request Access
              </Link>
              <Link
                href="/login"
                className="inline-flex rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-medium text-black transition hover:bg-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pb-24 lg:pt-10">
          <div className="grid items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="pt-4">
              <div className="inline-flex rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm uppercase tracking-[0.32em] text-black/55 shadow-sm">
                Built for Modern Auto Finance
              </div>

              <h1 className="mt-10 max-w-4xl text-[4.9rem] font-semibold leading-[0.92] tracking-[-0.065em] text-black xl:text-[6.7rem]">
                Control the decision. Control the outcome.
              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-black/68">
                Smart Drive Elite is a premium operational platform for
                dealership finance teams to submit deals, verify identity,
                structure approvals, and direct lender outcomes with greater
                speed and control.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-[#111111] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:scale-[1.01]"
                >
                  Enter Platform
                </Link>
                <Link
                  href="/request-access"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/60 px-8 py-4 text-base font-medium text-black transition hover:bg-white/85"
                >
                  Request Access
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {operatingHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-black/10 bg-white/55 px-4 py-2 text-sm font-medium text-black/75"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#c2a15d]/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[38px] border border-black/10 bg-white/78 p-5 shadow-[0_35px_100px_rgba(0,0,0,0.10)] backdrop-blur-xl">
                <div className="rounded-[32px] border border-black/10 bg-[#f8f5ef] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-sm uppercase tracking-[0.36em] text-black/70">
                        Live Decision Proof
                      </div>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium uppercase tracking-[0.22em] text-emerald-700">
                        Live
                      </span>
                    </div>
                    <span className="rounded-full bg-[#e8dcc2] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black/80">
                      Tier 1
                    </span>
                  </div>

                  <div className="mt-8 text-7xl font-semibold leading-none tracking-[-0.06em] text-black md:text-8xl">
                    APPROVED
                  </div>

                  <div className="mt-8 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium uppercase tracking-[0.24em] text-emerald-700">
                    Rate Locked
                  </div>

                  <div className="mt-10 grid gap-6 rounded-[30px] border border-black/10 bg-[#f1efeb] p-8 sm:grid-cols-2">
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-black/55">
                        Lender
                      </div>
                      <div className="mt-2 text-3xl font-semibold text-black">
                        Westlake
                      </div>
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-black/55">
                        Status
                      </div>
                      <div className="mt-2 text-3xl font-semibold text-black">
                        Locked
                      </div>
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-black/55">
                        Max Payment
                      </div>
                      <div className="mt-2 text-3xl font-semibold text-black">
                        $685
                      </div>
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-black/55">
                        Max Vehicle
                      </div>
                      <div className="mt-2 text-3xl font-semibold text-black">
                        $32,880
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="overview" className="mt-20 grid gap-6 md:grid-cols-3">
            {investorPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-[28px] border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur"
              >
                <div className="mb-4 h-1.5 w-12 rounded-full bg-[#c2a15d]" />
                <h3 className="text-xl font-semibold text-black">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-24 bg-[#ece5da]">
          <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-b from-transparent via-[#08111d] to-[#030816]" />
          <div className="absolute inset-x-0 bottom-7 h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />
        </div>
      </section>

      {/* DARK SECTION */}
      <section
        id="platform"
        className="relative overflow-hidden bg-[#030816] py-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(37,99,235,0.12),transparent_24%),linear-gradient(180deg,#030816_0%,#07101d_52%,#030816_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:54px_54px]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300">
                Platform
              </div>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Operational infrastructure for structured finance decisions.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                Smart Drive Elite is built to turn fragmented dealership finance
                workflow into a controlled system for intake, review, and lender
                direction.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Guided deal intake with applicant, vehicle, and structure data",
                  "Controller-led review for cleaner underwriting discipline",
                  "Structured decision output for lender path, payment, and vehicle fit",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="rounded-[28px] border border-white/10 bg-[#08111d] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-300">
                      System Snapshot
                    </div>
                    <h3 className="mt-3 text-3xl font-semibold text-white">
                      Built for speed, control, and repeatability.
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-400/12 px-4 py-2 text-sm font-semibold text-emerald-300">
                    Avg 42 sec
                  </span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Workflow", "Dealer + Controller"],
                    ["Decision Style", "Controlled"],
                    ["Output", "Structured"],
                    ["Use Case", "Operational Underwriting"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                    >
                      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                        {label}
                      </div>
                      <div className="mt-3 text-xl font-semibold text-white">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 px-6 py-3.5 text-sm font-semibold text-slate-950"
                  >
                    Enter Platform
                  </Link>
                  <Link
                    href="/request-access"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white"
                  >
                    Request Access
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div
            id="investor"
            className="mt-20 rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)]"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300">
                  Opportunity
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  A platform positioned for operational scale in dealership
                  finance.
                </h2>
              </div>

              <div className="space-y-4 text-slate-300">
                <p className="leading-8">
                  Smart Drive Elite is designed to solve a real workflow
                  problem: slow, inconsistent, and fragmented finance decision
                  handling at the dealership level.
                </p>
                <p className="leading-8">
                  By centralizing intake, verification, controller review, and
                  lender direction into one controlled system, the platform is
                  positioned as a scalable operating layer rather than a simple
                  software feature.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 lg:flex-row lg:items-center">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300">
                Smart Drive Elite
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                Premium presentation. Clear platform value. Real operational use.
              </h3>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request-access"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white"
              >
                Request Access
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 px-6 py-3.5 text-sm font-semibold text-slate-950"
              >
                Enter Platform
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
