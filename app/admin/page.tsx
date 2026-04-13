import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const applicationCount = await prisma.application.count();
  const statusHistoryCount = await prisma.statusHistory.count();

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f4ee",
        padding: "32px 24px",
        color: "#111111",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: "rgba(17,17,17,0.45)",
              marginBottom: "12px",
            }}
          >
            Smart Drive Elite
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "48px",
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              marginTop: "12px",
              marginBottom: 0,
              maxWidth: "760px",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(17,17,17,0.65)",
            }}
          >
            Administrative overview for Smart Drive Elite system activity.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "20px",
          }}
        >
          <section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(17,17,17,0.08)",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(17,17,17,0.45)",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              Applications
            </div>

            <div
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "#111111",
              }}
            >
              {applicationCount}
            </div>
          </section>

          <section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(17,17,17,0.08)",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(17,17,17,0.45)",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              Status History Records
            </div>

            <div
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "#111111",
              }}
            >
              {statusHistoryCount}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
