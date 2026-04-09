import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#111111]">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-6%] h-[420px] w-[420px] rounded-full bg-white/70 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-[360px] w-[360px] rounded-full bg-[#e7ddd0] blur-3xl" />
        <div className="absolute bottom-[-12%] left-[25%] h-[340px] w-[340px] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),rgba(246,243,238,0.92))]" />
      </div>

      {/* NAV */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-7">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <span className="text-sm font-bold tracking-[0.18em] text-[#111111]">
                SDF
              </span>
            </div>

            <div>
              <div className="text-2xl font-semibold tracking-[-0.02em]">
                SmartDrive Financial
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Underwriting Platform
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-black/55 md:flex">
            <Link href="/dealer" className="transition hover:text-black">
              Dealer
            </Link>
            <Link href="/dashboard" className="transition hover:text-black">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-8 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pt-14">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-black/55 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#b89a6a]" />
              SmartDrive Financial
            </div>

            <h1 className="max-w-5xl text-6xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#111111] sm:text-7xl xl:text-[98px]">
              Luxury-grade
              <br />
              underwriting
              <br />
              infrastructure.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-8 text-black/62 sm:text-2xl">
              A refined decision platform built for modern auto finance teams.
              Evaluate deals, route lender fit, and move with clarity, speed,
              and institutional confidence.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dealer"
                className="inline-flex items-center justify-center rounded-2xl bg-[#111111] px-7 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
              >
                Start a Deal
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-black/12 bg-white/75 px-7 py-4 text-base font-semibold text-[#111111] shadow-[0_12px_30px_rgba(0,0,0,0.04)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Dashboard
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-[26px] border border-black/8 bg-white/70 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)] backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-black/38">
                  Decisioning
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Real-Time
                </div>
              </div>

              <div className="rounded-[26px] border border-black/8 bg-white/70 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)] backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-black/38">
                  Workflow
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Structured
                </div>
              </div>

              <div className="rounded-[26px] border border-black/8 bg-white/70 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)] backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-black/38">
                  Visibility
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Full Stack
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[34px] bg-white/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-[34px] border border-black/8 bg-white/78 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-black/38">
                    Decision Snapshot
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#111111]">
                    SmartDrive Financial
                  </div>
                </div>

                <div className="rounded-full border border-black/8 bg-[#f4efe8] px-4 py-2 text-sm font-semibold text-[#111111]">
                  APPROVED
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[26px] border border-black/8 bg-[#fbfaf8] p-5">
                  <div className="mb-3 text-xs uppercase tracking-[0.22em] text-black/38">
                    Borrower Snapshot
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-black/45">Tier</div>
                      <div className="mt-1 text-lg font-semibold">Tier 1</div>
                    </div>
                    <div>
                      <div className="text-black/45">Lender</div>
                      <div className="mt-1 text-lg font-semibold">Westlake</div>
                    </div>
                    <div>
                      <div className="text-black/45">Max Payment</div>
                      <div className="mt-1 text-lg font-semibold">$685</div>
                    </div>
                    <div>
                      <div className="text-black/45">Max Vehicle</div>
                      <div className="mt-1 text-lg font-semibold">$32,880</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-black/8 bg-[#fbfaf8] p-5">
                  <div className="mb-3 text-xs uppercase tracking-[0.22em] text-black/38">
                    Decision Reasoning
                  </div>
                  <p className="leading-7 text-black/62">
                    Verified income, qualifying score band, and acceptable cash
                    down position the file for a clean approval path with strong
                    lender alignment.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[22px] border border-black/8 bg-white p-4 text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-black/35">
                      Status
                    </div>
                    <div className="mt-2 font-semibold text-[#111111]">
                      Approved
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-black/8 bg-white p-4 text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-black/35">
                      Docs
                    </div>
                    <div className="mt-2 font-semibold text-[#111111]">
                      Clear
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-black/8 bg-white p-4 text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-black/35">
                      Route
                    </div>
                    <div className="mt-2 font-semibold text-[#111111]">
                      Locked
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="relative z-10 pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 md:grid-cols-3">
          <div className="rounded-[30px] border border-black/8 bg-white/72 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] backdrop-blur">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-[#f1ebe3] text-sm font-semibold text-[#111111]">
              01
            </div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">
              Instant Decisions
            </h3>
            <p className="mt-4 text-base leading-7 text-black/60">
              Evaluate score, income, down payment strength, and lender fit in a
              refined workflow built for real deal velocity.
            </p>
          </div>

          <div className="rounded-[30px] border border-black/8 bg-white/72 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] backdrop-blur">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-[#f1ebe3] text-sm font-semibold text-[#111111]">
              02
            </div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">
              Full Visibility
            </h3>
            <p className="mt-4 text-base leading-7 text-black/60">
              Move from intake to underwriting to outcome with a clean operating
              layer designed for confidence and control.
            </p>
          </div>

          <div className="rounded-[30px] border border-black/8 bg-white/72 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] backdrop-blur">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-[#f1ebe3] text-sm font-semibold text-[#111111]">
              03
            </div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">
              Dealer Workflow
            </h3>
            <p className="mt-4 text-base leading-7 text-black/60">
              Give your stores a polished operational experience that feels
              premium, fast, and production-ready.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-black/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-8 py-6 text-sm text-black/42 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} SmartDrive Financial</div>
          <div className="uppercase tracking-[0.22em] text-black/28">
            Underwriting Platform
          </div>
        </div>
      </footer>
    </main>
  )
}
