export default function UnderwritingPage() {
  const navy = "#0B1F3A";
  const blue = "#4A90E2";
  const bg = "#f4f7fb";
  const border = "#d9e2f1";
  const muted = "#5f6f86";
  const white = "#ffffff";

  const card: React.CSSProperties = {
    background: white,
    border: `1px solid ${border}`,
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 8px 24px rgba(11,31,58,0.06)",
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    color: muted,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  };

  const value: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 800,
    color: navy,
  };

  const buttonBase: React.CSSProperties = {
    display: "inline-block",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: bg,
        fontFamily: "Arial, sans-serif",
        color: navy,
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #143761 100%)",
          color: white,
          padding: "28px 36px",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: "#b9cde9",
                marginBottom: 8,
              }}
            >
              Smart Drive Financial
            </div>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800 }}>
              Underwriting Decision Workspace
            </h1>
            <p style={{ margin: "10px 0 0 0", color: "#dbe7f6", fontSize: 16 }}>
              Score the borrower, validate structure, and choose the right vehicle.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/dashboard"
              style={{
                ...buttonBase,
                background: white,
                color: navy,
              }}
            >
              Back to Dashboard
            </a>
            <a
              href="/dealer"
              style={{
                ...buttonBase,
                background: blue,
                color: white,
              }}
            >
              Dealer Portal
            </a>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 36px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.2fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={card}>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>
              Customer Profile
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <div style={label}>Customer</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>James Carter</div>
              </div>

              <div>
                <div style={label}>Monthly Income</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>$2,600</div>
              </div>

              <div>
                <div style={label}>Job Time</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>8 Months</div>
              </div>

              <div>
                <div style={label}>Residence</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>10 Months</div>
              </div>

              <div>
                <div style={label}>Credit Score</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>512</div>
              </div>

              <div>
                <div style={label}>MVR</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Moderate</div>
              </div>

              <div>
                <div style={label}>Available Down Payment</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>$2,200</div>
              </div>

              <div
                style={{
                  marginTop: 6,
                  display: "inline-block",
                  background: "#f8e8c8",
                  color: "#9a6100",
                  padding: "10px 14px",
                  borderRadius: 12,
                  fontWeight: 800,
                }}
              >
                Risk Tier: C
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>
              Decision Summary
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <div>
                <div style={label}>Max Payment</div>
                <div style={value}>$416/mo</div>
              </div>

              <div>
                <div style={label}>Min Down Required</div>
                <div style={value}>$2,400</div>
              </div>

              <div>
                <div style={label}>Approved Term Range</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>30–36 Months</div>
              </div>

              <div>
                <div style={label}>APR Range</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>21%–24%</div>
              </div>

              <div
                style={{
                  marginTop: 8,
                  background: "#e8f1fd",
                  color: navy,
                  borderRadius: 14,
                  padding: 14,
                  fontWeight: 700,
                }}
              >
                Auto Decision Complete
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                <span
                  style={{
                    background: "#d8ead7",
                    color: "#2f7d32",
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  Payment Analysis Passed
                </span>

                <span
                  style={{
                    background: "#d8ead7",
                    color: "#2f7d32",
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  Stability Verified
                </span>

                <span
                  style={{
                    background: "#f8e8c8",
                    color: "#9a6100",
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  Moderate Risk
                </span>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>
              Vehicle Match Options
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 16,
                  padding: 18,
                  background: "#fbfdff",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "#d8ead7",
                    color: "#2f7d32",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  Recommended Deal
                </div>

                <div style={{ fontSize: 22, fontWeight: 800 }}>2017 Chevrolet Malibu</div>
                <div style={{ color: muted, marginTop: 6 }}>Best fit for approval and payment stability</div>

                <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                  <div><strong>Price:</strong> $10,995</div>
                  <div><strong>Down:</strong> $2,200</div>
                  <div><strong>Term:</strong> 36 Months</div>
                  <div><strong>APR:</strong> 21.9%</div>
                  <div><strong>Payment:</strong> $398/mo</div>
                </div>

                <div style={{ marginTop: 14, color: "#2f7d32", fontWeight: 800 }}>
                  Approved
                </div>
              </div>

              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 16,
                  padding: 18,
                  background: "#fffdf7",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "#f8e8c8",
                    color: "#9a6100",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  Conditional Approval
                </div>

                <div style={{ fontSize: 22, fontWeight: 800 }}>2018 Ford Escape</div>
                <div style={{ color: muted, marginTop: 6 }}>Needs structure adjustment to fit safely</div>

                <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                  <div><strong>Price:</strong> $16,295</div>
                  <div><strong>Down:</strong> $2,800</div>
                  <div><strong>Term:</strong> 36 Months</div>
                  <div><strong>APR:</strong> 23.5%</div>
                  <div><strong>Payment:</strong> $432/mo</div>
                </div>

                <div style={{ marginTop: 14, color: "#9a6100", fontWeight: 800 }}>
                  Needs More Down or Shorter Term
                </div>
              </div>

              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 16,
                  padding: 18,
                  background: "#fff9f9",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "#f6d6d4",
                    color: "#a12626",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  Blocked Deal
                </div>

                <div style={{ fontSize: 22, fontWeight: 800 }}>2019 Dodge Charger</div>
                <div style={{ color: muted, marginTop: 6 }}>Exceeds PTI and risk tolerance</div>

                <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                  <div><strong>Price:</strong> $19,995</div>
                  <div><strong>Down:</strong> $3,500</div>
                  <div><strong>Term:</strong> 36 Months</div>
                  <div><strong>APR:</strong> 24.9%</div>
                  <div><strong>Payment:</strong> $510/mo</div>
                </div>

                <div style={{ marginTop: 14, color: "#a12626", fontWeight: 800 }}>
                  Outside Tier C Guidelines
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...card, marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>Decision Actions</div>
              <div style={{ color: muted, marginTop: 6 }}>
                Finalize structure, push conditions, or block the deal.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="/dashboard"
                style={{
                  ...buttonBase,
                  background: "#e8f1fd",
                  color: navy,
                }}
              >
                Back to Dashboard
              </a>

              <a
                href="/funding"
                style={{
                  ...buttonBase,
                  background: "#d8ead7",
                  color: "#2f7d32",
                }}
              >
                Approve Best Match
              </a>

              <a
                href="/dealer"
                style={{
                  ...buttonBase,
                  background: "#f8e8c8",
                  color: "#9a6100",
                }}
              >
                Request More Down
              </a>

              <a
                href="/dashboard"
                style={{
                  ...buttonBase,
                  background: "#f6d6d4",
                  color: "#a12626",
                }}
              >
                Block Deal
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
