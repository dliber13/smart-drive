// underwriting route live
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B1F3A",
        color: "white",
        fontFamily: "Arial",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 42 }}>Smart Drive Financial 🚀</h1>
        <p style={{ marginTop: 10 }}>
          Lending Operating System is Live
        </p>

        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "12px 20px",
            background: "#4A90E2",
            color: "white",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Go to Dashboard →
        </a>
      </div>
    </main>
  );
}
