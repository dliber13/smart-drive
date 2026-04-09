import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAV */}
      <div className="flex items-center justify-between px-8 py-6">
        <h1 className="text-xl font-semibold tracking-wide">
          SMART DRIVE
        </h1>

        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/dealer">Dealer</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-8 py-20">
        <h2 className="text-5xl font-bold leading-tight">
          Underwriting.
          <br />
          Reimagined.
        </h2>

        <p className="mt-6 max-w-xl text-gray-400 text-lg">
          A modern decision engine built for speed, precision, and control.
          Instantly evaluate deals, route lenders, and lock approvals.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/dealer"
            className="rounded-xl bg-white px-6 py-3 text-black font-medium hover:bg-gray-200"
          >
            Start a Deal
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-700 px-6 py-3 hover:border-white"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-8 pb-20 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold">Instant Decisions</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Real-time underwriting logic calculates tier, payment,
            and lender routing instantly.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold">Full Visibility</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Track deal status from submission through funding with
            a clean, centralized dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold">Dealer Workflow</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Built for speed at the dealership level — submit,
            evaluate, and move deals forward without friction.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <div className="border-t border-gray-800 px-8 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Drive
      </div>
    </main>
  )
}
