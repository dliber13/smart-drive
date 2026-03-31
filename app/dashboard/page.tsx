export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      <h1>Smart Drive Dashboard</h1>
      <p>System is running successfully.</p>

      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 10 }}>Applications Today: 42</div>
        <div style={{ marginBottom: 10 }}>Approved Deals: 28</div>
        <div style={{ marginBottom: 10 }}>Funding Ready: 19</div>
        <div style={{ marginBottom: 10 }}>High Risk Accounts: 7</div>
      </div>
    </main>
  );
}
