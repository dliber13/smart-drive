"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PROTECTED_PATHS = ["/dealer", "/dealer-dashboard", "/controller", "/admin"];

export default function SiteFooter() {
  const [user, setUser] = useState<{ email: string; role: string; firstName?: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));

  useEffect(() => {
    if (!isProtected) return;
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => { if (d?.user) setUser(d.user); })
      .catch(() => {});
  }, [isProtected, pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  return (
    <footer className="border-t border-black/10 bg-[#f7f4ee]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
        <div>© 2026 Smart Drive Elite LLC. All rights reserved.</div>
        <div className="flex items-center gap-5">
          <Link href="/terms" className="transition hover:text-black">Terms of Service</Link>
          <Link href="/privacy" className="transition hover:text-black">Privacy Policy</Link>
          {user && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-black/10">
              <span className="text-black/50 text-xs">
                {user.firstName || user.email} · {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-black/15 bg-white px-4 py-1.5 text-xs font-semibold text-black/70 hover:bg-black hover:text-white transition-all"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-black/5 px-6 pb-6 text-center text-xs text-black/45">
        Smart Drive Elite provides decision support tools for automotive deal structuring. 
        Approval and funding are not guaranteed and remain subject to lender review.
      </div>
    </footer>
  );
}
