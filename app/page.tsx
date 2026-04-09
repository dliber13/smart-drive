import Link from "next/link"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030508] text-white">
      {/* BACKGROUND LAYERS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-8%] top-[8%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_20%,transparent_80%,rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      {/* NAV */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <span className="text-sm font-bold tracking-widest text-white">
                SDF
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-wide text-white">
                SmartDrive Financial
              </div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/40">
                Decision Intelligence Platform
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <Link href="/dealer" className="transition hover:text-white">
              Dealer
            </Link>
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-8 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
              SmartDrive Financial Platform
            </div>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.94] tracking-[-0.05em] text-white sm:text-7xl xl:text-[96px]">
              Underwriting
              <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">
                {" "}with{" "}
              </span>
              presence.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-8 text-white/65 sm:text-2xl">
              A visually dominant underwriting platform built for modern finance teams.
              Route lenders, qualify structure, and lock decisions with speed,
              confidence, and high-trust presentation.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dealer"
                className="group inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100"
              >
                Start a Deal
                <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/10"
              >
                View Dashboard
              </Link>
            </div>

            {/* STATS STRIP */}
            <div className="mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Decisioning
                </div>
                <div className="mt-3 text-3xl font-bold text-white">Real-Time</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Workflow
                </div>
                <div className="mt-3 text-3xl font-bold text-white">Structured</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Visibility
                </div>
                <div className="mt-3 text-3xl font-bold text-white">Full Stack</div>
              </div>
            </div>
          </div>

          {/* HERO PANEL */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyan-400/10 via-transparent to-indigo-400/10 blur-xl" />
            <div className="relative rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-white/40">
                    Live Decision View
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    SmartDrive Financial
                  </div>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  APPROVED
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-3 text-xs uppercase tracking-[0.22em] text-white/40">
                    Borrower Snapshot
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white/45">Tier</div>
                      <div className="mt-1 text-lg font-semibold text-white">Tier 1</div>
                    </div>
                    <div>
                      <div className="text-white/45">Lender</div>
                      <div className="mt-1 text-lg font-semibold text-white">Westlake</div>
                    </div>
                    <div>
                      <div className="text-white/45">Max Payment</div>
                      <div className="mt-1 text-lg font-semibold text-white">$685</div>
                    </div>
                    <div>
                      <div className="text-white/45">Max Vehicle</div>
                      <div className="mt-1 text-lg font-semibold text-white">$32,880</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-3 text-xs uppercase tracking-[0.22em] text-white/40">
                    Decision Reasoning
                  </div>
                  <p className="leading-7 text-white/70">
                    Verified income, qualifying score band, and acceptable cash
                    down position the file for a clean approval path with strong
                    lender fit.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-emerald-500/10 p-4 text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/60">
                      Status
                    </div>
                    <div className="mt-2 font-semibold text-emerald-300">
                      Approved
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-amber-500/10 p-4 text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-amber-200/60">
                      Docs
                    </div>
                    <div className="mt-2 font-semibold text-amber-300">
                      Clear
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-cyan-500/10 p-4 text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/60">
                      Route
                    </div>
                    <div className="mt-2 font-semibold text-cyan-300">
                      Locked
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BLOCKS */}
      <section className="relative z-10 pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 md:grid-cols-3">
          <div className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.06]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-cyan-400/10 text-lg font-bold text-cyan-200">
              01
            </div>
            <h3 className="text-2xl font-bold text-white">Instant Decisions</h3>
            <p className="mt-4 text-base leading-7 text-white/65">
              Evaluate tier, structure, payment tolerance, and lender fit in a
              fast, decisive workflow built for real deal velocity.
            </p>
          </div>

          <div className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.06]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-indigo-400/10 text-lg font-bold text-indigo-200">
              02
            </div>
            <h3 className="text-2xl font-bold text-white">Full Visibility</h3>
            <p className="mt-4 text-base leading-7 text-white/65">
              Move from intake to underwriting to outcome with complete status
              visibility across the entire decision pipeline.
            </p>
          </div>

          <div className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.06]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-bold text-white">
              03
            </div>
            <h3 className="text-2xl font-bold text-white">Dealer Workflow</h3>
            <p className="mt-4 text-base leading-7 text-white/65">
              Give stores a polished operational experience that feels premium,
              fast, and built for production use.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-8 py-6 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} SmartDrive Financial</div>
          <div className="uppercase tracking-[0.22em] text-white/25">
            Underwriting Platform
          </div>
        </div>
      </footer>
    </main>
  )
}
