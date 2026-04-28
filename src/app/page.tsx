import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#FAFAF8", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E4DC", padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#1a1a1a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 12, height: 12, border: "2px solid #C9A84C", borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.3px", color: "#1a1a1a" }}>Smart Drive Elite</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#platform" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>Platform</a>
          <a href="#lenders" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>Lenders</a>
          <a href="#opportunity" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>Opportunity</a>
          <Link href="/request-access" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>Request Access</Link>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", background: "#F5F0E8", border: "1px solid #C9A84C", borderRadius: 6, padding: "7px 18px", textDecoration: "none" }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 48px 80px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F5F0E8", border: "1px solid #C9A84C", borderRadius: 100, padding: "5px 14px", marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C" }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: "#8B6914", letterSpacing: "0.5px" }}>AI-POWERED DEALERSHIP FINANCE</span>
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-2px", color: "#0F0F0F", margin: "0 0 24px", maxWidth: 720 }}>
          Finance decisions<br />
          <span style={{ color: "#C9A84C" }}>in under 60 seconds.</span>
        </h1>
        <p style={{ fontSize: 20, color: "#555", lineHeight: 1.6, maxWidth: 560, margin: "0 0 48px" }}>
          Smart Drive Elite connects your dealership to a full lender waterfall — scoring risk, calculating PTI/DTI, and returning structured approvals instantly.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/request-access" style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", background: "#C9A84C", border: "none", borderRadius: 8, padding: "13px 28px", textDecoration: "none", letterSpacing: "-0.2px" }}>Request Dealer Access</Link>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#555", background: "transparent", border: "1px solid #DDD", borderRadius: 8, padding: "13px 28px", textDecoration: "none" }}>Sign In →</Link>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48, marginTop: 72, paddingTop: 48, borderTop: "1px solid #E8E4DC" }}>
          {[
            { value: "5", label: "Active lenders" },
            { value: "<60s", label: "Decision time" },
            { value: "10", label: "Risk tiers" },
            { value: "100%", label: "Automated waterfall" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#0F0F0F", letterSpacing: "-1px" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C40, transparent)", margin: "0 48px" }} />

      {/* Platform section */}
      <section id="platform" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", color: "#C9A84C", marginBottom: 12 }}>THE PLATFORM</div>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-1px", color: "#0F0F0F", margin: "0 0 16px" }}>Built for the deal desk.<br />Powered by AI.</h2>
          <p style={{ fontSize: 17, color: "#666", maxWidth: 480, lineHeight: 1.6, margin: 0 }}>From customer profile to structured approval — every step automated, every decision documented.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { num: "01", title: "Risk Scoring", desc: "AI evaluates credit profile, income type, PTI/DTI ratios, and employment stability to assign a precise risk tier." },
            { num: "02", title: "Lender Waterfall", desc: "Automatically routes through GLS → Westlake → CPS → MAC → WFI until the strongest approval is found." },
            { num: "03", title: "Structured Decision", desc: "Returns max payment, max vehicle price, deal strength score, and lender match — all in under 60 seconds." },
            { num: "04", title: "Inventory Matching", desc: "Top 3 vehicles ranked by approval likelihood and gross profit margin pulled directly from live inventory." },
            { num: "05", title: "IBL Calculator", desc: "Income-based lending payment structures for self-employed and 1099 customers — no FICO required." },
            { num: "06", title: "Audit Trail", desc: "Every decision logged with timestamp, lender reasoning, and compliance documentation built in." },
          ].map(f => (
            <div key={f.num} style={{ background: "#FFFFFF", border: "1px solid #E8E4DC", borderRadius: 12, padding: "28px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: "1px", marginBottom: 12 }}>{f.num}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#0F0F0F", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "#777", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C40, transparent)", margin: "0 48px" }} />

      {/* Lenders section */}
      <section id="lenders" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", color: "#C9A84C", marginBottom: 12 }}>LENDER NETWORK</div>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-1px", color: "#0F0F0F", margin: "0 0 16px" }}>Five lenders.<br />Every customer covered.</h2>
          <p style={{ fontSize: 17, color: "#666", maxWidth: 480, lineHeight: 1.6, margin: 0 }}>From prime to catch-all — our waterfall ensures no deal is left behind.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[
            { name: "Global Lending", tier: "Tier 1", range: "400–680 FICO", note: "W2 only" },
            { name: "Westlake", tier: "Tier 2", range: "No min FICO", note: "4 tiers" },
            { name: "CPS", tier: "Tier 3", range: "No min FICO", note: "1099 OK" },
            { name: "Midwest Accept.", tier: "Tier 4", range: "MO/IL/AR/KS", note: "5 tiers" },
            { name: "Western Funding", tier: "Catch-All", range: "No minimums", note: "All titles" },
          ].map((l, i) => (
            <div key={l.name} style={{ background: i === 4 ? "#0F0F0F" : "#FFFFFF", border: `1px solid ${i === 4 ? "#333" : "#E8E4DC"}`, borderRadius: 12, padding: "24px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: i === 4 ? "#C9A84C" : "#C9A84C", letterSpacing: "1px", marginBottom: 8 }}>{l.tier}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: i === 4 ? "#FFFFFF" : "#0F0F0F", marginBottom: 6 }}>{l.name}</div>
              <div style={{ fontSize: 12, color: i === 4 ? "#AAA" : "#888", marginBottom: 2 }}>{l.range}</div>
              <div style={{ fontSize: 12, color: i === 4 ? "#888" : "#AAA" }}>{l.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C40, transparent)", margin: "0 48px" }} />

      {/* Opportunity section */}
      <section id="opportunity" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", color: "#C9A84C", marginBottom: 12 }}>THE OPPORTUNITY</div>
            <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-1px", color: "#0F0F0F", margin: "0 0 20px" }}>A platform built to scale to hundreds of dealerships.</h2>
            <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, margin: "0 0 16px" }}>Smart Drive Elite was designed from the ground up for the independent dealership market — the segment most underserved by legacy finance software.</p>
            <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, margin: "0 0 32px" }}>Every dealer gets the same AI decisioning engine that enterprise groups pay hundreds of thousands for — at a fraction of the cost.</p>
            <Link href="/request-access" style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", background: "#C9A84C", borderRadius: 8, padding: "13px 28px", textDecoration: "none" }}>Get Early Access</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { value: "40,000+", label: "Independent dealers in the US" },
              { value: "$750B", label: "Used auto finance market" },
              { value: "72%", label: "Deals need subprime routing" },
              { value: "1", label: "Platform doing it with AI" },
            ].map(s => (
              <div key={s.label} style={{ background: "#FFFFFF", border: "1px solid #E8E4DC", borderRadius: 12, padding: "24px 20px" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#0F0F0F", letterSpacing: "-1px", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "#0F0F0F", margin: "0 48px 80px", borderRadius: 16, padding: "64px 64px" }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", color: "#C9A84C", marginBottom: 16 }}>READY TO START</div>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-1px", color: "#FFFFFF", margin: "0 0 20px" }}>Your dealership deserves better than a fax machine and a prayer.</h2>
          <p style={{ fontSize: 17, color: "#AAA", lineHeight: 1.6, margin: "0 0 32px" }}>Request access today and get your team set up with AI-powered finance decisioning.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/request-access" style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", background: "#C9A84C", borderRadius: 8, padding: "13px 28px", textDecoration: "none" }}>Request Dealer Access</Link>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#FFF", background: "transparent", border: "1px solid #444", borderRadius: 8, padding: "13px 28px", textDecoration: "none" }}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E8E4DC", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 20, background: "#1a1a1a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, border: "1.5px solid #C9A84C", borderRadius: 1 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Smart Drive Elite LLC</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/privacy" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>Terms</Link>
          <Link href="/login" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>Sign In</Link>
        </div>
        <div style={{ fontSize: 12, color: "#BBB" }}>© 2026 Smart Drive Elite LLC · Missouri · USPTO #99764274</div>
      </footer>

    </div>
  );
}
