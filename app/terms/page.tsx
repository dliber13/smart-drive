export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12 text-[#111111]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
            Smart Drive Elite
          </div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">
            Terms of Service
          </h1>
          <p className="mt-4 text-base text-black/60">Effective Date: April 14, 2026</p>
        </div>

        <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-8">
          <p className="text-[17px] leading-8 text-black/70">
            Welcome to Smart Drive Elite™, a platform owned and operated by Smart Drive Elite LLC,
            a Missouri limited liability company.
          </p>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">1. Ownership</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              All rights, title, and interest in and to Smart Drive Elite™, including all software,
              design, algorithms, workflows, and intellectual property, are and shall remain the
              exclusive property of Smart Drive Elite LLC, solely owned by Douglas W Liber.
            </p>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              Unauthorized use, copying, reproduction, or distribution of any part of the platform
              is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">2. Use of Platform</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              You agree to use Smart Drive Elite only for lawful business purposes related to
              automotive deal structuring, underwriting, and financial analysis.
            </p>
            <div className="mt-4 rounded-[24px] border border-black/8 bg-[#faf7f1] p-6">
              <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">You may not</div>
              <ul className="mt-4 space-y-3 text-[16px] text-black/68">
                <li>• Reverse engineer or copy the system</li>
                <li>• Attempt to extract proprietary logic</li>
                <li>• Use the platform to compete with Smart Drive Elite</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">3. Account Responsibility</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              Users are responsible for maintaining the confidentiality of their account and all
              activities under it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">4. Intellectual Property</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              All content, including but not limited to software code, UI/UX design, branding and
              logos, decision logic, and scoring systems, is protected by applicable intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">5. Limitation of Liability</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              Smart Drive Elite is provided “as is” without warranties of any kind. Smart Drive
              Elite LLC shall not be liable for any indirect or consequential damages arising from
              use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">6. Modifications</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              We reserve the right to modify these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">7. Governing Law</h2>
            <p className="mt-3 text-[16px] leading-8 text-black/68">
              These terms are governed by the laws of the State of Missouri.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
