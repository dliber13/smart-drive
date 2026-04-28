export default function RequestAccessPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-[#111111]">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="inline-flex rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold shadow-sm"
        >
          ← Back to Home
        </a>

        <section className="mt-10 rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm md:p-14">
          <p className="mb-6 tracking-[0.45em] text-sm text-neutral-400">
            SMART DRIVE ELITE
          </p>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Request Access
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-neutral-700">
            Submit your information and our team will review your request for
            platform access. Smart Drive Elite is built for dealerships and
            finance teams looking to improve deal intake, approval structuring,
            inventory fit, and lender routing.
          </p>

          <form className="mt-12 grid gap-8 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">
                FULL NAME
              </span>
              <input className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" />
            </label>

            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">
                DEALERSHIP NAME
              </span>
              <input className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" />
            </label>

            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">
                TITLE
              </span>
              <input className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" />
            </label>

            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">
                EMAIL
              </span>
              <input
                type="email"
                className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">
                MESSAGE
              </span>
              <textarea
                rows={5}
                className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none"
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="button"
                className="rounded-full bg-black px-8 py-4 font-semibold text-white"
              >
                Submit Request
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}