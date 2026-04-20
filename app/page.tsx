import Link from "next/link";

const platformPillars = [
  {
    title: "Dealer Intake",
    description:
      "Capture applicant, vehicle, and structure details in a fast intake flow built for real dealership desk work.",
  },
  {
    title: "Controller Review",
    description:
      "Centralize lender direction, approval structure, and deal strength from one controlled command layer.",
  },
  {
    title: "Identity Control",
    description:
      "Support cleaner identity handling, role visibility, and disciplined underwriting workflow across the platform.",
  },
  {
    title: "Decision Output",
    description:
      "Return the lender path, tier, max payment, and max vehicle in a usable structure ready to move the deal.",
  },
];

const decisionStats = [
  { label: "Lender", value: "Westlake" },
  { label: "Status", value: "Locked" },
  { label: "Max Payment", value: "$685" },
  { label: "Max Vehicle", value: "$32,880" },
];

const commandMetrics = [
  { label: "Avg Decision Time", value: "42 sec" },
  { label: "Workflow Model", value: "Dealer + Controller" },
  { label: "Decision Style", value: "Controlled" },
  { label: "System Focus", value: "Operational Underwriting" },
];

const workflowSteps = [
  {
    step: "01",
    title: "Submit the Deal",
    copy:
      "Start with applicant, identity, vehicle, and structure details in a guided intake process designed for clean submissions.",
  },
  {
    step: "02",
    title: "Apply Review Discipline",
    copy:
      "Move the file through controller-side visibility for lender fit, approval structure, and risk direction.",
  },
  {
    step: "03",
    title: "Control the Outcome",
    copy:
      "Return a structured result with lender path, tier, payment guidance, and vehicle fit to move with confidence.",
  },
];

const securityPoints = [
  "Role-based access control",
  "Controller-led decision workflow",
  "Identity verification handling",
  "Audit-ready operating structure",
];

export default function Home() {
  return (
    <main className="bg-[#030816] text-white">
      {/* LIGHT HERO */}
      <section className="relative overflow-hidden bg-[#f7f3ec] text-[#111111]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(194,161,93,0.20),transparent_26%),radial-gradient(circle_at_82%_20%,rgba(194,161,93,0.10),transparent_18%),linear-gradient(180deg,#f7f3ec_0%,#f3eee6_58%,#ece5da_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.018)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />

        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-white/55 shadow-sm backdrop-blur">
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
              <a href="#platform" className="transition hover:text-black">
                Platform
              </a>
              <a href="#workflow" className="transition hover:text-black">
                Workflow
              </a>
              <a href="#security" className="transition hover:text-black">
                Security
              </a>
              <Link href="/login" className="transition hover:text-black">
                Login
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/request-access"
                className="hidden rounded-full border border-black/10 bg-white/55 px-5 py-3 text-sm font-medium text-black transition hover:bg-white/75 sm:inline-flex"
              >
                Request Access
              </Link>
              <Link
                href="/login"
                className="inline-flex rounded-full border border-black/10 bg-white/75 px-6 py-3 text-sm font-medium text-black transition hover:bg-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8 lg:pb-28 lg:pt-10">
          <div className="grid items-start gap-16 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="pt-6">
              <div className="inline-flex rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm uppercase tracking-[0.32em] text-black/55 shadow-sm">
                Built for Modern Auto Finance
              </div>

              <h1 className="mt-10 max-w-4xl text-[5rem] font-semibold leading-[0.92] tracking-[-0.065em] text-black xl:text-[6.9rem]">
                Control the decision. Control the outcome.
              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-black/68">
                Smart Drive Elite is a premium operational front door for
                dealership finance teams to submit deals, verify identity,
                structure approvals, and direct lender outcomes with more
                control.
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
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#c2a15d]/20 blur-3xl" />
              <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-white/25 blur-3xl" />

              <div className="relative overflow-hidden rounded-[38px] border border-black/10 bg-white/75 p-5 shadow-[0_35px_100px_rgba(0,0,0,0.10)] backdrop-blur-xl">
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

                  <div className="mt-10 rounded-[32px] border border-black/10 bg-[#f1efeb] p-8 shadow-inner">
                    <div className="text-sm uppercase tracking-[0.34em] text-black/55">
                      Key Decision Metrics
                    </div>

                    <div className="mt-8 grid gap-8 sm:grid-cols-2">
                      {decisionStats.map((item) => (
                        <div key={item.label}>
                          <div className="text-sm uppercase tracking-[0.24em] text-black/55">
                            {item.label}
                          </div>
                          <div className="mt-3 text-3xl font-semibold tracking-tight text-black">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {["Dealer Intake", "Controller Review", "Lender Direction"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-black/10 bg-white/60 px-4 py-4 text-center text-sm font-medium text-black/75"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REFINED TRANSITION */}
        <div className="relative h-28 bg-[#ece5da]">
          <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-b from-transparent via-[#09111d] to-[#030816]" />
          <div className="absolute inset-x-0 bottom-8 h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />
          <div className="absolute left-1/2 bottom-5 h-16 w-[30rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
      </section>

      {/* DARK OPERATIONS */}
      <section className="relative overflow-hidden bg-[#030816]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(37,99,235,0.14),transparent_24%),linear-gradient(180deg,#030816_0%,#07101d_52%,#030816_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(circle_at_center,black,transparent_86%)]" />
        <div className="absolute left-[-8%] top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-10%] top-16 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {commandMetrics.map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_35%)] opacity-70" />
                <div className="relative">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                    {metric.label}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    {metric.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="platform"
          className="relative mx-auto max-w-7xl px-6 py-4 lg:px-8 lg:py-8"
        >
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300">
                Platform
              </div>
              <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Premium first impression. Real operational system underneath.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              The top of the homepage establishes the brand. Everything below it
              proves Smart Drive Elite is built to operate, structure deals, and
              control outcomes.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {platformPillars.map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.028))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.09),transparent_32%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 h-1.5 w-14 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                  <h3 className="text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="workflow"
          className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
        >
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300">
                Workflow
              </div>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                From intake to lender outcome, built to move with discipline.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                Smart Drive Elite is not just a landing page. It is a controlled
                entry point into a real platform designed to structure deals and
                direct financial outcomes.
              </p>

              <div className="mt-8 relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.03))] p-6 backdrop-blur-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_36%)]" />
                <div className="relative">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                    Access Paths
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-200">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span>Returning User</span>
                      <span className="font-semibold text-white">
                        Login to Platform
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span>New Dealership</span>
                      <span className="font-semibold text-white">
                        Request Access
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span>System Entry</span>
                      <span className="font-semibold text-white">
                        Dealer / Controller
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(16,185,129,0.18)]"
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

            <div className="space-y-5">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_34%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-start gap-5">
                    <div className="min-w-[58px] rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-center text-sm font-bold text-emerald-300">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="security"
          className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-24"
        >
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
            <div className="grid lg:grid-cols-[1fr_1fr]">
              <div className="relative border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_34%)]" />
                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300">
                    Security + Control
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Built to feel elite. Designed to operate with authority.
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                    Smart Drive Elite should present like a premium platform while
                    reinforcing trust through structured access, cleaner
                    visibility, and disciplined financial workflow.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 px-6 py-3.5 text-sm font-semibold text-slate-950"
                    >
                      Login to Platform
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

              <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                {securityPoints.map((item) => (
                  <div key={item} className="bg-[#07111f] p-8">
                    <div className="h-2 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                    <p className="mt-5 text-lg font-medium text-white">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-10 lg:flex-row lg:items-center lg:px-8">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300">
                Smart Drive Elite
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                Elite presentation. Operational depth. Controlled outcome.
              </h3>
              <p className="mt-3 max-w-2xl text-slate-300">
                Enter the platform to build deals, direct approvals, and move
                with operational confidence.
              </p>
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
        </section>
      </section>
    </main>
  );
}
