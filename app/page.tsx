import Link from "next/link";

const operationalPillars = [
  {
    title: "Dealer Intake",
    description:
      "Capture applicant, vehicle, and structure details through a disciplined intake flow built for speed at the desk.",
  },
  {
    title: "Controller Review",
    description:
      "Centralize approvals, risk direction, lender fit, and deal strength from one controlled command layer.",
  },
  {
    title: "Identity Control",
    description:
      "Support identity handling, role-based visibility, and cleaner underwriting discipline across the workflow.",
  },
  {
    title: "Decision Output",
    description:
      "Return the lender path, tier, max payment, and max vehicle in a format ready to move the deal forward.",
  },
];

const commandMetrics = [
  { label: "Avg Decision Time", value: "42 sec" },
  { label: "Workflow Model", value: "Dealer + Controller" },
  { label: "Decision Style", value: "Controlled" },
  { label: "Platform Focus", value: "Operational Underwriting" },
];

const workflowSteps = [
  {
    step: "01",
    title: "Submit the Deal",
    copy:
      "Start with applicant, identity, vehicle, and structure details in a guided intake flow designed for clean submissions.",
  },
  {
    step: "02",
    title: "Apply Review Discipline",
    copy:
      "Route the file through controller-side visibility for risk evaluation, lender direction, and approval structure.",
  },
  {
    step: "03",
    title: "Control the Outcome",
    copy:
      "Return a structured result with lender path, tier, payment guidance, and vehicle fit to move with confidence.",
  },
];

const controlPoints = [
  "Role-based access control",
  "Controller-led decision workflow",
  "Identity verification handling",
  "Audit-ready operating structure",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(59,130,246,0.16),transparent_26%),linear-gradient(180deg,#020617_0%,#06101d_48%,#020617_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
        <div className="absolute left-[-8%] top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-10%] top-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-emerald-400/8 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="group flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-white/5 shadow-[0_0_40px_rgba(16,185,129,0.10)] transition duration-300 group-hover:border-emerald-400/40 group-hover:bg-white/10">
              <span className="bg-gradient-to-br from-white via-emerald-200 to-emerald-500 bg-clip-text text-xl font-black text-transparent">
                S
              </span>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.38em] text-emerald-300/85">
                Smart Drive Elite
              </div>
              <div className="mt-1 text-sm text-slate-300">
                Controlled Underwriting Platform
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <a href="#platform" className="transition hover:text-white">
              Platform
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#security" className="transition hover:text-white">
              Security
            </a>
            <Link href="/login" className="transition hover:text-white">
              Login
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10 sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(16,185,129,0.22)] transition duration-300 hover:scale-[1.01]"
            >
              Enter Platform
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
              Private Operational Access
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-6xl xl:text-7xl">
              Elite control for dealership finance operations.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Smart Drive Elite is the high-end operational front door for
              submitting deals, verifying identity, structuring approvals, and
              directing lender outcomes from one controlled system.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_24px_70px_rgba(16,185,129,0.24)] transition duration-300 hover:scale-[1.01]"
              >
                Enter Platform
              </Link>
              <Link
                href="/request-access"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-medium text-white transition duration-300 hover:border-white/25 hover:bg-white/10"
              >
                Request Access
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "Dealer Intake",
                "Controller Review",
                "Identity Verification",
                "Lender Direction",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {commandMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl"
                >
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                    {metric.label}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-500/12 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-blue-500/12 blur-3xl" />

            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#f8fafc]">
                <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-700">
                        Smart Drive Elite
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                        Controller Command
                      </h2>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Review submitted files, direct underwriting strategy,
                        and control deal outcomes from a single operational
                        surface.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 text-right">
                      <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-600">
                        5 FILES
                      </span>
                      <span className="rounded-full bg-emerald-950 px-4 py-2 text-[11px] font-semibold text-emerald-100">
                        CONTROLLER
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_22%)] p-5">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Controller command loaded
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Submitted Queue
                          </h3>
                          <p className="text-xs text-slate-500">
                            Files ready for controlled review
                          </p>
                        </div>
                        <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
                          Refresh
                        </button>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            name: "Allowed Test",
                            detail: "Verified / Ready for direction",
                            status: "APPROVED",
                            statusClass:
                              "border-emerald-200 bg-emerald-100 text-emerald-700",
                          },
                          {
                            name: "Test User",
                            detail: "Pending review",
                            status: "PENDING",
                            statusClass:
                              "border-amber-200 bg-amber-100 text-amber-700",
                          },
                          {
                            name: "Denied Sample",
                            detail: "Outside fit",
                            status: "REJECTED",
                            statusClass:
                              "border-rose-200 bg-rose-100 text-rose-700",
                          },
                        ].map((item) => (
                          <div
                            key={item.name}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {item.name}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                  {item.detail}
                                </div>
                                <div className="mt-1 text-xs text-slate-400">
                                  Vehicle: N/A
                                </div>
                              </div>
                              <span
                                className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide ${item.statusClass}`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Decision Snapshot
                          </h3>
                          <p className="text-xs text-slate-500">
                            Structured file details and control inputs
                          </p>
                        </div>
                        <button className="rounded-xl bg-emerald-950 px-3 py-2 text-xs font-semibold text-emerald-100">
                          Test Credit Access
                        </button>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-3 text-sm font-semibold text-slate-800">
                          Applicant Snapshot
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            ["Borrower", "Allowed Test"],
                            ["Phone", "N/A"],
                            ["Identity Type", "SSN"],
                            ["Country", "US"],
                            ["Identity Status", "VERIFIED"],
                            ["Risk Tier", "LOW"],
                            ["Lender Path", "WESTLAKE"],
                            ["Confidence", "HIGH"],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                            >
                              <div className="text-slate-400">{label}</div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    {[
                      ["Total Files", "5"],
                      ["Approved", "2"],
                      ["Pending", "2"],
                      ["Avg Decision", "18m"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
                      >
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          {label}
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
              Platform
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Built for elite operational control.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Smart Drive Elite should feel powerful before the user even logs in.
            The homepage sets the tone. The platform carries the work.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {operationalPillars.map((card) => (
            <div
              key={card.title}
              className="group rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-300 hover:border-emerald-400/20 hover:bg-white/[0.06]"
            >
              <div className="mb-5 h-1.5 w-14 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
              Workflow
            </div>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              From intake to lender outcome, built to move with discipline.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              This is not a brochure site. It is a premium front door into a
              real operating system built to structure deals and control
              outcomes.
            </p>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Access Paths
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Returning User</span>
                  <span className="font-semibold text-white">Login to Platform</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>New Dealership</span>
                  <span className="font-semibold text-white">Request Access</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>System Entry</span>
                  <span className="font-semibold text-white">Dealer / Controller</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl"
              >
                <div className="flex items-start gap-5">
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
      </section>

      <section
        id="security"
        className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-24"
      >
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
          <div className="grid lg:grid-cols-[1fr_1fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
                Security + Control
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Premium presentation backed by disciplined control.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                Smart Drive Elite should look elite, but it also has to feel
                trustworthy. The platform is positioned around controlled access,
                cleaner visibility, and structured financial workflow.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
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

            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {controlPoints.map((item) => (
                <div key={item} className="bg-[#07111f] p-8">
                  <div className="h-2 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                  <p className="mt-5 text-lg font-medium text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-10 lg:flex-row lg:items-center lg:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
              Smart Drive Elite
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
              Elite entry. Real system. Controlled outcome.
            </h3>
            <p className="mt-3 max-w-2xl text-slate-300">
              Enter the platform to build deals, direct approvals, and move with
              operational confidence.
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
    </main>
  );
}
