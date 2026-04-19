export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold leading-tight">
          Control the Decision. <br /> Control the Outcome.
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Smart Drive Elite is a controlled underwriting platform built for dealership
          finance teams. Submit deals, structure approvals, and route to lenders — all in one system.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">
            Get Early Access
          </button>
          <button className="border border-gray-600 px-6 py-3 rounded-lg">
            View How It Works
          </button>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          Avg Decision Time: <span className="text-white font-semibold">42 seconds</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            How Smart Drive Elite Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Submit Deal</h3>
              <p className="text-gray-400 text-sm">
                Enter applicant, structure, and vehicle details. Inventory auto-populates for speed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Smart Evaluation</h3>
              <p className="text-gray-400 text-sm">
                Identity verification, credit tiering, and deal structure analysis happen instantly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Instant Decision</h3>
              <p className="text-gray-400 text-sm">
                Get matched with lenders and receive structured approval terms in seconds.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Controlled Output</h3>
              <p className="text-gray-400 text-sm">
                Return clean, usable deal terms back to the desk — ready to close.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DECISION EXAMPLE */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">
            Example Decision Output
          </h2>

          <div className="bg-zinc-900 rounded-xl p-8 text-left space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Lender</span>
              <span className="font-semibold">Westlake Financial</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tier</span>
              <span className="font-semibold">B2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Payment</span>
              <span className="font-semibold">$525</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Vehicle</span>
              <span className="font-semibold">$28,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Deal Strength</span>
              <span className="font-semibold">78 / 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT EXISTS */}
      <section className="px-6 py-20 bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Smart Drive Elite Exists
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Too many deals are lost due to poor structure, slow decisions, and inconsistent lender routing.
            Finance teams are left guessing instead of controlling outcomes.
            <br /><br />
            Smart Drive Elite was built to give dealerships a structured, repeatable system that
            turns every deal into a calculated decision — not a gamble.
          </p>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">
            Built for Dealership Finance Teams
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-semibold mb-2">Controlled Underwriting</h3>
              <p className="text-gray-400 text-sm">
                Every deal follows a structured evaluation process designed for consistency and performance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Identity & Compliance</h3>
              <p className="text-gray-400 text-sm">
                Built with identity verification and compliance-driven workflows in mind.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dealer + Controller Workflow</h3>
              <p className="text-gray-400 text-sm">
                Separate roles ensure clear decision authority and clean operational flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-white text-black text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start Controlling Your Deals
        </h2>
        <p className="mb-6">
          Apply for early access and bring structure to your underwriting process.
        </p>

        <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold">
          Apply for Access
        </button>
      </section>

    </main>
  );
}
