import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  let total = 0;
  let submitted = 0;
  let inReview = 0;
  let approved = 0;
  let denied = 0;
  let readyForFunding = 0;
  let funded = 0;
  let recentApplications: Array<{
    id: string;
    customerFirstName: string;
    customerLastName: string;
    status: string;
    grossIncome: number | null;
    creditScore: number | null;
    requestedVehicle: string | null;
    createdAt: Date;
  }> = [];

  try {
    total = await prisma.application.count();
    submitted = await prisma.application.count({ where: { status: "SUBMITTED" } });
    inReview = await prisma.application.count({ where: { status: "IN_REVIEW" } });
    approved = await prisma.application.count({
      where: {
        status: {
          in: ["APPROVED", "APPROVED_CONDITIONAL", "APPROVED_ALT_VEHICLE"],
        },
      },
    });
    denied = await prisma.application.count({ where: { status: "DENIED" } });
    readyForFunding = await prisma.application.count({
      where: { status: "READY_FOR_FUNDING" },
    });
    funded = await prisma.application.count({ where: { status: "FUNDED" } });

    recentApplications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        customerFirstName: true,
        customerLastName: true,
        status: true,
        grossIncome: true,
        creditScore: true,
        requestedVehicle: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Dashboard load failed:", error);
  }

  return (
    <main style={pageStyle}>
      <h1 style={titleStyle}>Smart Drive Financial</h1>
      <p style={subtitleStyle}>Live Lending Dashboard</p>

      <div style={statsGrid}>
        <StatCard label="Total Applications" value={total} />
        <StatCard label="Submitted" value={submitted} />
        <StatCard label="In Review" value={inReview} />
        <StatCard label="Approved" value={approved} />
        <StatCard label="Denied" value={denied} />
        <StatCard label="Ready For Funding" value={readyForFunding} />
        <StatCard label="Funded" value={funded} />
      </div>

      <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>Recent Applications</h2>

        {recentApplications.length === 0 ? (
          <p>No applications in database yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {recentApplications.map((app) => (
              <div key={app.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>
                      {app.customerFirstName} {app.customerLastName}
                    </div>
                    <div style={{ color: "#475569", marginTop: 4 }}>
                      {app.requestedVehicle || "No vehicle selected"}
                    </div>
                  </div>
                  <span style={badgeStyle}>{app.status}</span>
                </div>

                <div style={{ marginTop: 10, lineHeight: 1.8 }}>
                  <div><strong>Income:</strong> ${Number(app.grossIncome || 0).toLocaleString()}</div>
                  <div><strong>Credit:</strong> {app.creditScore ?? "N/A"}</div>
                  <div><strong>Created:</strong> {new Date(app.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={statCardStyle}>
      <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f4f7fb",
  padding: 40,
  fontFamily: "Arial, sans-serif",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 34,
};

const subtitleStyle: React.CSSProperties = {
  color: "#64748b",
  marginTop: 8,
  marginBottom: 24,
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const statCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 18,
};

const panelStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 20,
};

const sectionTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 16,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: 14,
  background: "#fcfdff",
};

const badgeStyle: React.CSSProperties = {
  background: "#e8f1fd",
  color: "#0b4ea2",
  padding: "8px 12px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 12,
  height: "fit-content",
};
