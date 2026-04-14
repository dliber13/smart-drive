export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12 text-[#111111]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
            Smart Drive Elite
          </div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base text-black/60">Effective Date: April 14, 2026</p>
        </div>

        <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-8">
          <p className="text-[17px] leading-8 text-black/70">
            Smart Drive Elite LLC (“we,” “our,” or “us”) respects your privacy.
          </p>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">1. Information We Collect</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              We may collect name, email, phone number, financial and application data, usage data,
              and system interaction data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">2. How We Use Information</h2>
            <div className="mt-4 rounded-[24px] border border-black/8 bg-[#faf7f1] p-6">
              <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">We use data to</div>
              <ul className="mt-4 space-y-3 text-[16px] text-black/68">
                <li>• Provide underwriting and decision support</li>
                <li>• Improve platform performance</li>
                <li>• Communicate with users</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">3. Data Protection</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              We implement reasonable security measures to protect user data. However, no system is
              100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">4. Data Sharing</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              We do not sell user data.
            </p>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              We may share data with authorized partners, including lenders and integrations, or
              when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">5. User Responsibility</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              Users are responsible for ensuring they have proper authorization to submit customer
              data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">6. Changes</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              We may update this policy at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">7. Contact</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">Smart Drive Elite LLC</p>
          </section>
        </div>
      </div>
    </main>
  );
}
