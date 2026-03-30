export default function DashboardPage() {
  const pageBg = "#f4f7fb";
  const navy = "#0B1F3A";
  const blue = "#4A90E2";
  const border = "#d9e2f1";
  const textMuted = "#5f6f86";
  const white = "#ffffff";

  const card: React.CSSProperties = {
    background: white,
    border: `1px solid ${border}`,
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 8px 24px rgba(11,31,58,0.06)",
  };

  const tableCell: React.CSSProperties = {
    padding: "12px 10px",
    borderBottom: `1px solid ${border}`,
    fontSize: 14,
  };

  const badge = (bg: string, color = "#fff"): React.CSSProperties => ({
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: bg,
    color,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: pageBg,
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
            gap: 20,
            alignItems: "center",
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
              Command Center Dashboard
            </h1>
            <p style={{ margin: "10px 0 0 0", color: "#dbe7f6", fontSize: 16 }}>
              Live view of approvals, funding, dealer activity, and portfolio risk.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/underwriting"
              style={{
                textDecoration: "none",
                background: blue,
                color: white,
                padding: "12px 18px",
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              Underwriting Queue
            </a>
            <a
              href="/dealer"
              style={{
                textDecoration: "none",
                background: white,
                color: navy,
                padding: "12px 18px",
                borderRadius: 12,
                fontWeight: 700,
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
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            marginTop: -42,
          }}
        >
          <div style={card}>
            <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
              Applications Today
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>42</div>
            <div style={{ marginTop: 10, color: "#2f7d32", fontSize: 13 }}>
              +12% vs yesterday
            </div>
          </div>

          <div style={card}>
            <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
              Approved Deals
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>28</div>
            <div style={{ marginTop: 10, color: "#2f7d32", fontSize: 13 }}>
              Strong close performance
            </div>
          </div>

          <div style={card}>
            <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
              Funding Ready
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>19</div>
            <div style={{ marginTop: 10, color: "#b26a00", fontSize: 13 }}>
              3 deals missing final stips
            </div>
          </div>

          <div style={card}>
            <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
              High Risk Accounts
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>7</div>
            <div style={{ marginTop: 10, color: "#c62828", fontSize: 13 }}>
              Immediate follow-up required
            </div>
          </div>

          <div style={card}>
            <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
              Avg Gross Per Deal
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>$2,450</div>
            <div style={{ marginTop: 10, color: textMuted, fontSize: 13 }}>
              Backend + finance mix
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            marginTop: 24,
          }}
        >
          <div style={card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>Today’s Pipeline</div>
                <div style={{ color: textMuted, marginTop: 6 }}>
                  Real-time production across underwriting and funding.
                </div>
              </div>
              <span style={badge("#e8f1fd", navy)}>Live Snapshot</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr 1fr",
                gap: 16,
              }}
            >
              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 16,
                  padding: 18,
                  background: "#fbfdff",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 12 }}>Underwriting Queue</div>
                <div style={{ fontSize: 30, fontWeight: 800 }}>12</div>
                <div style={{ color: textMuted, marginTop: 6 }}>
                  Deals waiting for review
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 13, color: textMuted }}>Approved</div>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "#d8ead7",
                        overflow: "hidden",
                        marginTop: 6,
                      }}
                    >
                      <div
                        style={{
                          width: "72%",
                          height: "100%",
                          background: "#2f7d32",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 13, color: textMuted }}>Conditional</div>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "#f8e8c8",
                        overflow: "hidden",
                        marginTop: 6,
                      }}
                    >
                      <div
                        style={{
                          width: "20%",
                          height: "100%",
                          background: "#b26a00",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, color: textMuted }}>Blocked</div>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "#f6d6d4",
                        overflow: "hidden",
                        marginTop: 6,
                      }}
                    >
                      <div
                        style={{
                          width: "8%",
                          height: "100%",
                          background: "#c62828",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 16,
                  padding: 18,
                  background: "#fbfdff",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 12 }}>Funding Desk</div>
                <div style={{ fontSize: 30, fontWeight: 800 }}>19</div>
                <div style={{ color: textMuted, marginTop: 6 }}>
                  Deals ready to fund
                </div>

                <ul style={{ marginTop: 18, paddingLeft: 18, color: textMuted, lineHeight: 1.8 }}>
                  <li>3 need insurance confirmation</li>
                  <li>2 need GPS verification</li>
                  <li>1 needs final structure review</li>
                </ul>
              </div>

              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 16,
                  padding: 18,
                  background: "#fbfdff",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 12 }}>Early Warning</div>
                <div style={{ fontSize: 30, fontWeight: 800 }}>7</div>
                <div style={{ color: textMuted, marginTop: 6 }}>
                  Accounts on watch
                </div>

                <ul style={{ marginTop: 18, paddingLeft: 18, color: textMuted, lineHeight: 1.8 }}>
                  <li>2 critical</li>
                  <li>3 high risk</li>
                  <li>2 watchlist</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 14 }}>
              Today’s Focus
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700 }}>Funding Holds</div>
              <div style={{ color: textMuted, marginTop: 6 }}>
                Clear missing insurance and GPS installs before close of business.
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700 }}>Dealer Quality</div>
              <div style={{ color: textMuted, marginTop: 6 }}>
                Review 2 stores with low stip quality and rising exception requests.
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700 }}>Portfolio Risk</div>
              <div style={{ color: textMuted, marginTop: 6 }}>
                Follow up on 2 critical accounts within 24 hours.
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700 }}>Gross Opportunity</div>
              <div style={{ color: textMuted, marginTop: 6 }}>
                Push backend penetration on conditional approvals still pending close.
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div style={card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800 }}>Dealer Scoreboard</div>
              <a
                href="/dealer"
                style={{ color: blue, fontWeight: 700, textDecoration: "none" }}
              >
                Open Dealer Portal →
              </a>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ textAlign: "left", color: textMuted }}>
                  <th style={tableCell}>Dealer</th>
                  <th style={tableCell}>Apps</th>
                  <th style={tableCell}>Approval Rate</th>
                  <th style={tableCell}>Funding Rate</th>
                  <th style={tableCell}>Compliance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tableCell}>GoodAutos Gladstone</td>
                  <td style={tableCell}>24</td>
                  <td style={tableCell}>68%</td>
                  <td style={tableCell}>52%</td>
                  <td style={tableCell}>
                    <span style={badge("#d8ead7", "#2f7d32")}>Strong</span>
                  </td>
                </tr>
                <tr>
                  <td style={tableCell}>GoodAutos Tracy</td>
                  <td style={tableCell}>18</td>
                  <td style={tableCell}>61%</td>
                  <td style={tableCell}>48%</td>
                  <td style={tableCell}>
                    <span style={badge("#f8e8c8", "#9a6100")}>Watch</span>
                  </td>
                </tr>
                <tr>
                  <td style={tableCell}>Partner Store Alpha</td>
                  <td style={tableCell}>11</td>
                  <td style={tableCell}>54%</td>
                  <td style={tableCell}>39%</td>
                  <td style={tableCell}>
                    <span style={badge("#f6d6d4", "#a12626")}>Review</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={card}>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
              Portfolio Snapshot
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 14,
                  background: "#fbfdff",
                }}
              >
                <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
                  Active Accounts
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>312</div>
              </div>

              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 14,
                  background: "#fbfdff",
                }}
              >
                <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
                  Total Portfolio
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>$2.8M</div>
              </div>

              <div
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 14,
                  background: "#fbfdff",
                }}
              >
                <div style={{ color: textMuted, fontSize: 13, fontWeight: 700 }}>
                  Avg Yield
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>21%</div>
              </div>

              <a
                href="/portfolio"
                style={{
                  textDecoration: "none",
                  textAlign: "center",
                  background: navy,
                  color: white,
                  padding: "14px 18px",
                  borderRadius: 12,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                Open Portfolio →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
 
