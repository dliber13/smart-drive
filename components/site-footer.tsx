import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/8 bg-[#f7f4ee]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-black/55 md:flex-row md:items-center md:justify-between">
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
    </footer>
  );
}
