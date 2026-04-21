import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function AdminPage() {
  const applicationCount = await prisma.application.count()
  const inventoryCount = await prisma.inventoryUnit.count()

  return (
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
            Platform overview and system totals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Applications
            </div>
            <div className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              {applicationCount}
            </div>
            <p className="mt-3 text-sm text-black/55">
              Total application records currently in the system.
            </p>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Inventory Units
            </div>
            <div className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              {inventoryCount}
            </div>
            <p className="mt-3 text-sm text-black/55">
              Total inventory units currently stored in the platform.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
