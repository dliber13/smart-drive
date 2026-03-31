export default function UnderwritingPage() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Underwriting Engine</h1>
      <p>Smart Drive Decision System</p>

      <div style={{ marginTop: 30 }}>
        <h2>Deal Information</h2>

        <input placeholder="Customer Name" style={inputStyle} />
        <input placeholder="Monthly Income" style={inputStyle} />
        <input placeholder="Job Time (months)" style={inputStyle} />
        <input placeholder="Residence Time (months)" style={inputStyle} />
        <input placeholder="Credit Score" style={inputStyle} />
        <input placeholder="Down Payment" style={inputStyle} />
      </div>

      <div style={{ marginTop: 30 }}>
        <button style={approveBtn}>Approve Deal</button>
        <button style={declineBtn}>Decline Deal</button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  marginBottom: 10,
  padding: 10,
  width: 300,
};

const approveBtn = {
  padding: 12,
  marginRight: 10,
  background: "green",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const declineBtn = {
  padding: 12,
  background: "red",
  color: "white",
  border: "none",
  cursor: "pointer",
};
