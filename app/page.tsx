import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ee] text-[#111111]">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fcfaf6_0%,#f7f4ee_42%,#f1ece4_100%)]" />
        <div className="absolute left-[-12%] top-[-8%] h-[560px] w-[560px] rounded-full bg-white/95 blur-3xl" />
        <div className="absolute left-[18%] top-[8%] h-[420px] w-[420px] rounded-full bg-[#e9dece] blur-3xl opacity-80" />
        <div className="absolute right-[-8%] top-[4%] h-[460px] w-[460px] rounded-full bg-white/80 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(17,17,17,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.16)_1px,transparent_1px)] [background-size:88px_88px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-black/8" />
      </div>

      {/* HEADER */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-black/8 bg-white/95 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <span className="text-[15px] font-bold tracking-[0.24em] text-[#111111]">
                SDF
              </span>
            </div>

            <div>
              <div className="text-[42px] font-semibold leading-none tracking-[-0.05em] text-[#111111]">
                SmartDrive Financial
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.42em] text-black/38">
                Underwriting Platform
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-10 text-[15px] font-medium text-black/52">
              <Link href="/dealer" className="transition hover:text-black">
                Dealer
              </Link>
              <Link href="/dashboard" className="transition hover:text-black">
                Dashboard
              </Link>
            </nav>

            <button className="rounded-full border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold text-black/70 transition hover:text-black">
              Request access
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-8 pb-20 pt-8 lg:grid-cols-[1.03fr_0.97fr]">
          {/* LEFT */}
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.28em] text-black/50 shadow-[0_12px_30px_rgba(0,0,0,0.04)] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#c6a96b] to-[#a8894f]" />
              Built for modern auto finance
            </div>

            <h1 className="max-w-3xl text-[78px] font-semibold leading-[0.92] tracking-[-0.065em] text-[#111111] sm:text-[96px] xl:text-[110px]">
              Control the decision.
              <br />
              Control the outcome.
            </h1>

            <p className="mt-8 max-w-3xl text-[23px] leading-[1.5] tracking-[-0.02em] text-black/62">
              SmartDrive Financial helps finance teams evaluate credit, structure
              deals, route lender fit, and lock decisions in a platform designed
              to increase speed, improve visibility, and strengthen underwriting
              confidence.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dealer"
                className="inline-flex items-center justify-center rounded-[20px] bg-[#111111] px-8 py-4 text-[16px] font-semibold text-white shadow-[0_16px_36px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black"
              >
                Start a Deal
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[20px] border border-black/10 bg-white/85 px-8 py-4 text-[16px] font-semibold text-[#111111] shadow-[0_14px_34px_rgba(0,0,0,0.05)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Dashboard
              </Link>
            </div>

            {/* STATS BAR */}
            <div className="mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-black/8 bg-white/74 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/36">
                  Decision Time
                </div>
                <div className="mt-3 text-[34px] font-semibold leading-none tracking-[-0.05em]">
                  42 sec
                </div>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-white/74 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/36">
                  Match Rate
                </div>
                <div className="mt-3 text-[34px] font-semibold leading-none tracking-[-0.05em]">
                  92%
                </div>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-white/74 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/36">
                  Monthly Volume
                </div>
                <div className="mt-3 text-[34px] font-semibold leading-none tracking-[-0.05em]">
                  1,284
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[42px] bg-white/75 blur-2xl" />
            <div className="relative overflow-hidden rounded-[42px] border border-black/10 bg-white/86 p-8 shadow-[0_60px_140px_rgba(0,0,0,0.18)] ring-1 ring-black/5 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-[150px] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0))]" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.30em] text-black/38">
                    <span>Live decision proof</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d7e9df] bg-[#eef6f2] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#2f6f55]">
                      <span className="h-2 w-2 rounded-full bg-[#2f6f55]" />
                      LIVE
                    </span>
                  </div>

                  <div className="mt-4 text-[64px] font-semibold leading-none text-[#111111]">
                    <span className="tracking-[-0.06em]">APPROVED</span>
                  </div>
                </div>

                <div className="rounded-full border border-black/8 bg-gradient-to-r from-[#efe4d2] to-[#e2d3bb] px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#111111]">
                  Tier 1
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d7e9df] bg-[#eef6f2] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f6f55]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2f6f55]" />
                  Rate locked
                </span>
              </div>

              <div className="mt-8 rounded-[30px] border border-black/8 bg-[#fcfbf8] p-7 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]">
                <div className="mb-5 text-[12px] uppercase tracking-[0.28em] text-black/38">
                  Key decision metrics
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-9">
                  <div>
                    <div className="text-[13px] uppercase tracking-[0.20em] text-black/36">
                      Lender
                    </div>
                    <div className="mt-2 text-[34px] font-semibold leading-none tracking-[-0.05em]">
                      Westlake
                    </div>
                  </div>

                  <div>
                    <div className="text-[13px] uppercase tracking-[0.20em] text-black/36">
                      Status
                    </div>
                    <div className="mt-2 text-[34px] font-semibold leading-none tracking-[-0.05em]">
                      Locked
                    </div>
                  </div>

                  <div>
                    <div className="text-[13px] uppercase tracking-[0.20em] text-black/36">
                      Max Payment
                    </div>
                    <div className="mt-2 text-[42px] font-semibold leading-none tracking-[-0.065em]">
                      $685
                    </div>
                  </div>

                  <div>
                    <div className="text-[13px] uppercase tracking-[0.20em] text-black/36">
                      Max Vehicle
                    </div>
                    <div className="mt-2 text-[42px] font-semibold leading-none tracking-[-0.065em]">
                      $32,880
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[30px] border border-black/8 bg-[#fcfbf8] p-7">
                <div className="mb-4 text-[12px] uppercase tracking-[0.28em] text-black/38">
                  Why this matters
                </div>
                <p className="text-[22px] leading-9 tracking-[-0.02em] text-black/60">
                  Clean lender alignment, clear payment tolerance, and structured
                  approval logic reduce friction, improve file quality, and help
                  finance teams move faster with better control across every decision.
                </p>

                <div className="mt-6">
                  <button className="rounded-full border border-black/10 bg-[#111111] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.10)] transition hover:bg-black">
                    Request access
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[24px] border border-black/8 bg-white p-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.03)]">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-black/34">
                    Speed
                  </div>
                  <div className="mt-3 text-[18px] font-semibold">Fast</div>
                </div>

                <div className="rounded-[24px] border border-black/8 bg-white p-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.03)]">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-black/34">
                    Visibility
                  </div>
                  <div className="mt-3 text-[18px] font-semibold">Clear</div>
                </div>

                <div className="rounded-[24px] border border-black/8 bg-white p-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.03)]">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-black/34">
                    Outcome
                  </div>
                  <div className="mt-3 text-[18px] font-semibold">Controlled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE BLOCKS */}
      <section className="relative z-10 pb-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-10 max-w-3xl">
            <div className="text-[12px] uppercase tracking-[0.28em] text-black/36">
              Platform value
            </div>
            <h2 className="mt-4 text-[44px] font-semibold leading-[1] tracking-[-0.05em] text-[#111111]">
              Everything the page should prove at first glance.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-[32px] border border-black/8 bg-white/74 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[18px] border border-black/8 bg-[#f1ebe2] text-[14px] font-semibold text-[#111111]">
                01
              </div>
              <h3 className="text-[30px] font-semibold leading-none tracking-[-0.04em]">
                Faster underwriting
              </h3>
              <p className="mt-4 text-[17px] leading-8 text-black/60">
                Move from intake to decision with less friction and better
                structure, so teams can spend more time moving deals and less
                time chasing clarity.
              </p>
            </div>

            <div className="rounded-[32px] border border-black/8 bg-white/74 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[18px] border border-black/8 bg-[#f1ebe2] text-[14px] font-semibold text-[#111111]">
                02
              </div>
              <h3 className="text-[30px] font-semibold leading-none tracking-[-0.04em]">
                Smarter lender routing
              </h3>
              <p className="mt-4 text-[17px] leading-8 text-black/60">
                Match structure and borrower strength to the right path faster,
                with clearer lender fit and more disciplined decision logic.
              </p>
            </div>

            <div className="rounded-[32px] border border-black/8 bg-white/74 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[18px] border border-black/8 bg-[#f1ebe2] text-[14px] font-semibold text-[#111111]">
                03
              </div>
              <h3 className="text-[30px] font-semibold leading-none tracking-[-0.04em]">
                Better operational control
              </h3>
              <p className="mt-4 text-[17px] leading-8 text-black/60">
                Keep visibility across every file, every decision, and every
                status so underwriting becomes easier to manage, trust, and
                scale.
              </p>
            </div>
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
