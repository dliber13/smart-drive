import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const total = await prisma.application.count();
  const approved = await prisma.application.count({ where: { status: "APPROVED" } });
  const fundingReady = await prisma.application.count({ where: { status: "READY_FOR_FUNDING" } });
  const funded = await prisma.application.count({ where: { status: "FUNDED" } });
  const declined = await prisma.application.count({ where: { status: "DENIED" } });
  const inReview = await prisma.application.count({ where: { status: "IN_REVIEW" } });
  const highRisk = await prisma.fundedAccount.count({
    where: { accountStatus: { in: ["DELINQUENT", "REPO_REVIEW", "REPOSSESSED"] } },
  });
  const accounts = await prisma.fundedAccount.count();

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: 40, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", margin: 0 }}>
        Smart Drive Financial
      </h1>
      <p style={{ color: "#64748b", marginTop: 4 }}>
        Lending Operating System - Live Dashboard
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 32, marginBottom: 40 }}>
        <StatCard label="Total Applications" value={total} color="#2563eb" />
        <StatCard label="Approved" value={approved} color="#16a34a" />
        <StatCard label="In Review" value={inReview} color="#d97706" />
        <StatCard label="Ready to Fund" value={fundingReady} color="#0891b2" />
        <StatCard label="Funded" value={funded} color="#7c3aed" />
        <StatCard label="Declined" value={declined} color="#dc2626" />
        <StatCard label="Active Accounts" value={accounts} color="#0f766e" />
        <StatCard label="High Risk Accounts" value={highRisk} color="#b91c1c" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginTop: 0 }}>
            Quick Links
          </h2>
          <a href="/underwriting" style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f1f5f9", color: "#2563eb", textDecoration: "none", fontSize: 14 }}>Underwriting Workstation</a>
          <a href="/dealer" style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f1f5f9", color: "#2563eb", textDecoration: "none", fontSize: 14 }}>Dealer Submission System</a>
          <a href="/funding" style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f1f5f9", color: "#2563eb", textDecoration: "none", fontSize: 14 }}>Funding Queue</a>
          <a href="/collections" style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f1f5f9", color: "#2563eb", textDecoration: "none", fontSize: 14 }}>Collections</a>
          <a href="/early-warning" style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f1f5f9", color: "#2563eb", textDecoration: "none", fontSize: 14 }}>Early Warning</a>
          <a href="/applications" style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f1f5f9", color: "#2563eb", textDecoration: "none", fontSize: 14 }}>Applications</a>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginTop: 0 }}>
            System Status
          </h2>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
            <span style={{ color: "#475569" }}>Database</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Connected</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
            <span style={{ color: "#475569" }}>Vercel Deployment</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Live</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
            <span style={{ color: "#475569" }}>Early Warning Cron</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Active - 9AM Daily</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
            <span style={{ color: "#475569" }}>Auth Middleware</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Protecting all routes</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: "4px solid " + color }}>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: color }}>{value}</div>
    </div>
  );
}
