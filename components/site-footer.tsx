import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#f7f4ee]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
        
        <div>
          © 2026 Smart Drive Elite LLC. All rights reserved.
        </div>

        <div className="flex items-center gap-5">
          <Link href="/terms" className="transition hover:text-black">
            Terms of Service
          </Link>

          <Link href="/privacy" className="transition hover:text-black">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Legal Disclaimer Line */}
      <div className="border-t border-black/5 px-6 pb-6 text-center text-xs text-black/45">
        Smart Drive Elite provides decision support tools for automotive deal structuring. 
        Approval and funding are not guaranteed and remain subject to lender review.
      </div>
    </footer>
  );
}
