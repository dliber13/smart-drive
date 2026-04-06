import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const total = await prisma.application.count();

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: 40 }}>
      <h1>Smart Drive Financial</h1>
      <p>Dashboard Live</p>

      <div style={{ marginTop: 20 }}>
        <strong>Total Applications:</strong> {total}
      </div>
    </main>
  );
}
