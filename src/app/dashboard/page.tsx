import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default async function DashboardPage() {
  let total = 0;
  let submitted = 0;
  let approved = 0;
  let funded = 0;
  let recentApplications: any[] = [];

  try {
    total = await prisma.application.count();
    submitted = await prisma.application.count({
      where: { status: "SUBMITTED" },
    });
    approved = await prisma.application.count({
      where: { status: "APPROVED" },
    });
    funded = await prisma.application.count({
      where: { status: "FUNDED" },
    });

    recentApplications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch (error) {
    console.error("Dashboard load error:", error);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-10 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-[0.28em] text-black/45">
              Smart Drive Elite
            </div>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">
              Dashboard
            </h1>
            <p className="mt-3 max-w-3xl text-[16px] leading-7 text-black/60">
              High-level operational view of submitted files, approvals, and funded deals.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dealer"
              className="rounded-[18px] border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black/70 transition hover:bg-white"
            >
              Dealer Intake
            </Link>
            <Link
              href="/controller"
              className="rounded-[18px] bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Controller
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Total Files
            </div>
            <div className="mt-3 text-[36px] font-semibold tracking-[-0.05em]">
              {total}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Submitted
            </div>
            <div className="mt-3 text-[36px] font-semibold tracking-[-0.05em]">
              {submitted}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Approved
            </div>
            <div className="mt-3 text-[36px] font-semibold tracking-[-0.05em]">
              {approved}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Funded
            </div>
            <div className="mt-3 text-[36px] font-semibold tracking-[-0.05em]">
              {funded}
            </div>
          </div>
        </div>

        <section className="rounded-[32px] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
          <div className="mb-5">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em]">
              Recent Applications
            </h2>
            <p className="mt-2 text-sm text-black/55">
              Latest application activity across the platform.
            </p>
          </div>

          {recentApplications.length === 0 ? (
            <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] p-6 text-black/60">
              No applications found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.22em] text-black/38">
                    <th className="px-3 py-2">Applicant</th>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Income</th>
                    <th className="px-3 py-2">Amount Financed</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="rounded-[18px] bg-[#faf7f1]">
                      <td className="px-3 py-4 font-semibold">
                        {app.firstName || "Unknown"} {app.lastName || "Applicant"}
                      </td>
                      <td className="px-3 py-4 text-black/65">
                        {[app.vehicleYear, app.vehicleMake, app.vehicleModel]
                          .filter(Boolean)
                          .join(" ") || "N/A"}
                      </td>
                      <td className="px-3 py-4 text-black/65">{app.status || "DRAFT"}</td>
                      <td className="px-3 py-4 text-black/65">
                        {app.monthlyIncome != null ? formatCurrency(app.monthlyIncome) : "N/A"}
                      </td>
                      <td className="px-3 py-4 text-black/65">
                        {app.amountFinanced != null ? formatCurrency(app.amountFinanced) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
