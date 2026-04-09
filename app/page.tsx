import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      {/* NAV */}
      <div className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-wider">
          SmartDrive Financial
        </h1>

        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/dealer" className="hover:text-white">Dealer</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-6xl font-bold leading-tight">
          SmartDrive Financial.
          <br />
          Underwriting. Reimagined.
        </h2>

        <p className="mt-6 max-w-xl text-gray-400 text-lg">
          A modern underwriting platform built for speed, precision, and control.
          Instantly evaluate deals, route lenders, and lock approvals.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/dealer"
            className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200"
          >
            Start a Deal
          </Link>

          <Link
            href="/dashboard"
            className="border border-gray-700 px-6 py-3 rounded-xl hover:border-white"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-8 pb-20 grid md:grid-cols-3 gap-6">
        <div className="border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold">Instant Decisions</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Real-time underwriting logic calculates tier, payment,
            and lender routing instantly.
          </p>
        </div>

        <div className="border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold">Full Visibility</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Track deal status from submission through funding with
            a clean, centralized dashboard.
          </p>
        </div>

        <div className="border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold">Dealer Workflow</h3>
          <p className="mt-3 text-gray-400 text-sm">
            Built for speed at the dealership level — submit,
            evaluate, and move deals forward without friction.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <div className="border-t border-gray-800 px-8 py-6 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} SmartDrive Financial
      </div>
    </main>
  )
}
