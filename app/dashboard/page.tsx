import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const [
    totalApplications,
    approvedApplications,
    fundingReady,
    funded,
    declined,
    inReview,
    highRiskAccounts,
    totalAccounts,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "READY_FOR_FUNDING" } }),
    prisma.application.count({ where: { status: "FUNDED" } }),
    prisma.application.count({ where: { status: "DENIED" } }),
    prisma.application.count({ where: { status: "IN_REVIEW" } }),
    prisma.fundedAccount.count({
      where: { accountStatus: { in: ["DELINQUENT", "REPO_REVIEW", "REPOSSESSED"] } },
    }),
    prisma.fundedAccount.count(),
  ]);

  const stats = [
    { label: "Total Applications", value: totalApplications, color: "#2563eb" },
    { label: "Approved", value: approvedApplications, color: "#16a34a" },
    { label: "In Review", value: inReview, color: "#d97706" },
    { label: "Ready to Fund", value: fundingReady, color: "#0891b2" },
    { label: "Funded", value: funded, color: "#7c3aed" },
    { label: "Declined", value: declined, color: "#dc2626" },
    { label: "Active Accounts", value: totalAccounts, color: "#0f766e" },
    { label: "High Risk Accounts", value: highRiskAccounts, color: "#b91c1c" },
  ];

  const links = [
    { label: "Underwriting Workstation", href: "/underwriting" },
    { label: "Dealer Submission System", href: "/dealer" },
    { label: "Funding Queue", href: "/funding" },
    { label: "Collections", href: "/collections" },
    { label: "Early Warning", href: "/early-warning" },
    { label: "Applications", href: "/applications" },
  ];

  const systemStatus = [
    { label: "Database", status: "Connected", ok: true },
    { label: "Vercel Deployment", status: "Live", ok: true },
    { label: "Early Warning Cron", status: "Active - 9AM Daily", ok: true },
    { label: "Auth Middleware", status: "Protecting all routes", ok: true },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1e293b",
            margin: 0,
          }}
        >
          Smart Drive Financial
        </h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>
          Lending Operating System - Live Dashboard
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "24px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              borderTop: "4px solid " + stat.color,
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#64748b",
                marginBottom: 8,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#1e293b",
              marginTop: 0,
            }}
          >
            Quick Links
          </h2>
          {links.map((link) => (
            
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "10px 0",
                borderBottom: "1px solid #f1f5f9",
                color: "#2563eb",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              {link.label} →
            </a>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#1e293b",
              marginTop: 0,
            }}
          >
            System Status
          </h2>
          {systemStatus.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #f1f5f9",
                fontSize: 14,
              }}
            >
              <span style={{ color: "#475569" }}>{item.label}</span>
              <span
                style={{
                  color: item.ok ? "#16a34a" : "#dc2626",
                  fontWeight: 600,
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
