export default function Home() {
  const cardStyle: React.CSSProperties = {
    border: "1px solid #d9e2f1",
    borderRadius: 16,
    padding: 20,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(11,31,58,0.08)",
  };

  const linkStyle: React.CSSProperties = {
    display: "block",
    textDecoration: "none",
    color: "#0B1F3A",
    fontWeight: 600,
    marginTop: 10,
  };

  const statStyle: React.CSSProperties = {
    ...cardStyle,
    minHeight: 110,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        color: "#0B1F3A",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #143761 100%)",
          color: "#ffffff",
          padding: "48px 40px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "#4A90E2",
              color: "#ffffff",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Smart Drive Financial
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 44,
              lineHeight: 1.1,
              fontWeight: 800,
            }}
          >
            Lending Operating System
          </h1>

          <p
            style={{
              marginTop: 16,
              maxWidth: 720,
              fontSize: 18,
              lineHeight: 1.6,
              color: "#dbe7f6",
            }}
          >
            Control approvals, structure stronger deals, match customers to the
            right vehicles, and manage risk from underwriting through
            collections.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <a
              href="/dashboard"
              style={{
                textDecoration: "none",
                background: "#4A90E2",
                color: "#ffffff",
                padding: "14px 22px",
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              Open Dashboard
            </a>

            <a
              href="/underwriting"
              style={{
                textDecoration: "none",
                background: "#ffffff",
                color: "#0B1F3A",
                padding: "14px 22px",
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              Go to Underwriting
            </a>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: -42,
          }}
        >
          <div style={statStyle}>
            <div style={{ fontSize: 13, color: "#5f6f86", fontWeight: 700 }}>
              Applications Today
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>42</div>
            <div style={{ fontSize: 13, color: "#2f7d32", marginTop: 10 }}>
              +12% vs yesterday
            </div>
          </div>

          <div style={statStyle}>
            <div style={{ fontSize: 13, color: "#5f6f86", fontWeight: 700 }}>
              Approved Deals
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>28</div>
            <div style={{ fontSize: 13, color: "#2f7d32", marginTop: 10 }}>
              Strong approval mix
            </div>
          </div>

          <div style={statStyle}>
            <div style={{ fontSize: 13, color: "#5f6f86", fontWeight: 700 }}>
              Funding Ready
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>19</div>
            <div style={{ fontSize: 13, color: "#b26a00", marginTop: 10 }}>
              3 need final stips
            </div>
          </div>

          <div style={statStyle}>
            <div style={{ fontSize: 13, color: "#5f6f86", fontWeight: 700 }}>
              High Risk Accounts
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>7</div>
            <div style={{ fontSize: 13, color: "#c62828", marginTop: 10 }}>
              Early warning active
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            marginTop: 28,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              System Modules
            </div>
            <p style={{ color: "#5f6f86", lineHeight: 1.6, marginTop: 0 }}>
              Use Smart Drive as your centralized control center for dealer
              intake, underwriting, funding, monitoring, and collections.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
                marginTop: 18,
              }}
            >
              <div style={{ ...cardStyle, boxShadow: "none" }}>
                <div style={{ fontWeight: 800 }}>Dashboard</div>
                <div style={{ color: "#5f6f86", marginTop: 8 }}>
                  KPI overview, dealer activity, and portfolio visibility.
                </div>
                <a href="/dashboard" style={linkStyle}>
                  Open →
                </a>
              </div>

              <div style={{ ...cardStyle, boxShadow: "none" }}>
                <div style={{ fontWeight: 800 }}>Underwriting</div>
                <div style={{ color: "#5f6f86", marginTop: 8 }}>
                  Score borrowers, match inventory, and approve structures.
                </div>
                <a href="/underwriting" style={linkStyle}>
                  Open →
                </a>
              </div>

              <div style={{ ...cardStyle, boxShadow: "none" }}>
                <div style={{ fontWeight: 800 }}>Dealer Portal</div>
                <div style={{ color: "#5f6f86", marginTop: 8 }}>
                  Submit deals, track statuses, and manage missing stips.
                </div>
                <a href="/dealer" style={linkStyle}>
                  Open →
                </a>
              </div>

              <div style={{ ...cardStyle, boxShadow: "none" }}>
                <div style={{ fontWeight: 800 }}>Funding Desk</div>
                <div style={{ color: "#5f6f86", marginTop: 8 }}>
                  Control final verification and release funds cleanly.
                </div>
                <a href="/funding" style={linkStyle}>
                  Open →
                </a>
              </div>

              <div style={{ ...cardStyle, boxShadow: "none" }}>
                <div style={{ fontWeight: 800 }}>Portfolio</div>
                <div style={{ color: "#5f6f86", marginTop: 8 }}>
                  Monitor active accounts, balances, and delinquency.
                </div>
                <a href="/portfolio" style={linkStyle}>
                  Open →
                </a>
              </div>

              <div style={{ ...cardStyle, boxShadow: "none" }}>
                <div style={{ fontWeight: 800 }}>Collections</div>
                <div style={{ color: "#5f6f86", marginTop: 8 }}>
                  Work accounts, log outreach, and manage escalations.
                </div>
                <a href="/collections" style={linkStyle}>
                  Open →
                </a>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
              Today’s Focus
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700 }}>Underwriting Queue</div>
              <div style={{ color: "#5f6f86", marginTop: 6 }}>
                12 deals need decisioning
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700 }}>Funding Holds</div>
              <div style={{ color: "#5f6f86", marginTop: 6 }}>
                3 deals waiting on insurance or GPS
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700 }}>Dealer Compliance</div>
              <div style={{ color: "#5f6f86", marginTop: 6 }}>
                2 dealers need stip quality review
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700 }}>Early Warning</div>
              <div style={{ color: "#5f6f86", marginTop: 6 }}>
                7 accounts flagged for follow-up
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
