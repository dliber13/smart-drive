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
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: "4px solid #2563eb" }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Total Applications</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#2563eb" }}>{total}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: "4px solid #16a34a" }}></div>