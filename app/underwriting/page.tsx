export default function UnderwritingPage() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Underwriting Engine</h1>
      <p>Smart Drive decision system</p>

      <div style={{ marginTop: 20 }}>
        <p><strong>Applications in Queue:</strong> 18</p>
        <p><strong>Pending Review:</strong> 7</p>
        <p><strong>Approved Today:</strong> 12</p>
        <p><strong>Declined Today:</strong> 4</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <button style={{ padding: 10, marginRight: 10 }}>
          Approve Deal
        </button>
        <button style={{ padding: 10, marginRight: 10 }}>
          Send to Stips
        </button>
        <button style={{ padding: 10 }}>
          Decline
        </button>
      </div>
    </div>
  );
}
