<<<<<<< HEAD
"use client";
=======
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const applicationCount = await prisma.application.count();
>>>>>>> cafa814 (save current Smart Drive updates)

export default function AdminPage() {
  return (
<<<<<<< HEAD
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12 text-[#111111]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
            Smart Drive Elite
          </div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-base text-black/60">
            Platform overview will load dynamically.
          </p>
        </div>

        <div className="rounded-[24px] border border-black/8 bg-white p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="text-sm text-black/50">
            Admin data temporarily disabled during build.
          </div>
          <div className="mt-2 text-sm text-black/40">
            Runtime data panels will be connected next.
          </div>
        </div>
      </div>
    </main>
  );
}
=======
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="p-6 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Applications</div>
        <div className="text-2xl font-bold">{applicationCount}</div>
      </div>
    </main>
  );
}
>>>>>>> cafa814 (save current Smart Drive updates)
