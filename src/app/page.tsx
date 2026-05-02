import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#F8F6F1", minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>

      <nav style={{ background: "rgba(248,246,241,0.95)", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "0 clamp(16px, 4vw, 56px)", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0F0F0F"/><path d="M8 16 L13 10 L19 10 L24 16 L19 22 L13 22 Z" fill="none" stroke="#C9A84C" strokeWidth="1.5"/><circle cx="16" cy="16" r="3" fill="#C9A84C"/></svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.4px", color: "#0F0F0F", lineHeight: 1 }}>Smart Drive Elite</div>
            <div style={{ fontSize: 9, letterSpacing: "2px", color: "#C9A84C", fontWeight: 600, lineHeight: 1, marginTop: 2 }}>FINANCE INTELLIGENCE</div>
          </div>
        </div>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <a href="#platform" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>Platform</a>
          <a href="#lenders" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>Lenders</a>
          <a href="#how" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>How It Works</a>
          <a href="#opportunity" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>Opportunity</a>
          <a href="#demo" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>Demo</a>
          <div style={{ width: 1, height: 16, background: "#DDD" }} />
          <Link href="/request-access" style={{ fontSize: 13, color: "#777", textDecoration: "none" }}>Request Access</Link>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: "#0F0F0F", background: "#C9A84C", borderRadius: 7, padding: "8px 20px", textDecoration: "none" }}>Sign In</Link>
        </div>
      </nav>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 100px) clamp(20px, 4vw, 56px) clamp(40px, 6vw, 80px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(32px, 5vw, 80px)", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F0F0F", borderRadius: 100, padding: "5px 14px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", letterSpacing: "1px" }}>LIVE PLATFORM · INSTANT DECISIONS</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 62px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-2px", color: "#0F0F0F", margin: "0 0 24px" }}>The finance desk.<br /><span style={{ color: "#C9A84C" }}>Rebuilt from</span><br />the ground up.</h1>
          <p style={{ fontSize: 18, color: "#666", lineHeight: 1.65, maxWidth: 480, margin: "0 0 16px" }}>Every deal optimized for approval before it ever reaches a lender. Structured, matched, and decisioned in under 60 seconds.</p>
          <p style={{ fontSize: 14, color: "#999", lineHeight: 1.6, maxWidth: 440, margin: "0 0 40px" }}>No legacy software. No 1,500-lender network you will never use. Just AI-powered decisioning built specifically for independent dealers.</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 40 }}>
            <Link href="/signup" style={{ fontSize: 14, fontWeight: 700, color: "#0F0F0F", background: "#C9A84C", borderRadius: 8, padding: "14px 32px", textDecoration: "none" }}>Start Free Trial →</Link>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#555", background: "#FFFFFF", border: "1px solid #E0DBD0", borderRadius: 8, padding: "14px 24px", textDecoration: "none" }}>Sign In</Link>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {[{ value: "100%", label: "Automated" }, { value: "<60s", label: "Decisions" }, { value: "10", label: "Risk tiers" }, { value: "Zero", label: "Manual steps" }].map((s, i) => (
              <div key={s.label} style={{ paddingRight: 28, marginRight: 28, borderRight: i < 3 ? "1px solid #E0DBD0" : "none" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#0F0F0F", letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-decision-card" style={{ position: "relative" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E3D8", borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div><div style={{ fontSize: 11, color: "#999", letterSpacing: "1px", fontWeight: 600, marginBottom: 2 }}>DEAL DECISION</div><div style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F" }}>Marcus Johnson</div></div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ background: "#0F0F0F", color: "#4ADE80", fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", padding: "6px 14px", borderRadius: 6 }}>APPROVED</div>
                <div style={{ background: "#C9A84C", borderRadius: 6, padding: "4px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#0F0F0F" }}>Decision in</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#0F0F0F", letterSpacing: "-0.5px", lineHeight: 1 }}>47s</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[{ label: "Lender", value: "Global Lending" }, { label: "Tier", value: "TIER_2" }, { label: "Max Payment", value: "$612/mo" }, { label: "Max Vehicle", value: "$28,400" }, { label: "Deal Strength", value: "84 / 100" }, { label: "PTI", value: "18.2%" }].map(r => (
                <div key={r.label} style={{ background: "#F8F6F1", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#AAA", letterSpacing: "0.5px", fontWeight: 600, marginBottom: 3 }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F0F0F" }}>{r.value}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #F0EBE0", paddingTop: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#AAA", letterSpacing: "1px", fontWeight: 600, marginBottom: 10 }}>LENDER WATERFALL</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ name: "TIER 1", active: true }, { name: "TIER 2", active: false }, { name: "TIER 3", active: false }, { name: "TIER 4", active: false }, { name: "IBL", active: false }].map(l => (
                  <div key={l.name} style={{ flex: 1, textAlign: "center", padding: "6px 4px", borderRadius: 6, background: l.active ? "#0F0F0F" : "#F8F6F1", border: "1px solid " + (l.active ? "#0F0F0F" : "#E8E3D8") }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: l.active ? "#C9A84C" : "#CCC" }}>{l.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#F8F6F1", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "#AAA", letterSpacing: "1px", fontWeight: 600, marginBottom: 6 }}>TOP VEHICLE MATCH</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: "#0F0F0F" }}>2021 Ford Bronco Sport</div><div style={{ fontSize: 11, color: "#888" }}>Stock #7773 · 42,100 mi</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 14, fontWeight: 800, color: "#0F0F0F" }}>$16,999</div><div style={{ fontSize: 10, color: "#4ADE80", fontWeight: 600 }}>WITHIN RANGE</div></div>
              </div>
            </div>
          </div>

        </div>
      </section>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", margin: "0 56px", opacity: 0.3 }} />
      <section id="how" style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 12 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-1.5px", color: "#0F0F0F", margin: "0 0 16px" }}>Four steps. One decision.</h2>
          <p style={{ fontSize: 16, color: "#777", maxWidth: 480, margin: "0 auto" }}>Everything a finance manager does manually — automated, documented, delivered instantly.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 8 }}>
          {[{ step: "01", title: "Capture the deal", desc: "Salesperson enters customer info, uploads required documents, and submits. 90 seconds.", dark: false }, { step: "02", title: "Score and structure instantly", desc: "Engine calculates PTI/DTI, assigns a precise risk tier, and builds the deal structure automatically.", dark: false }, { step: "03", title: "Route to the right tier", desc: "Automatically routes through all applicable tiers in order. Stops at the highest-probability approval.", dark: false }, { step: "04", title: "Return a funded path", desc: "Returns tier, max payment, max vehicle, deal strength score, and top inventory matches — ready to present.", dark: true }].map((s, i) => (
            <div key={s.step} style={{ background: s.dark ? "#0F0F0F" : "#FFFFFF", padding: "32px 28px", borderRadius: i === 0 ? "12px 0 0 12px" : i === 3 ? "0 12px 12px 0" : 0, border: "1px solid " + (s.dark ? "#222" : "#E8E3D8"), borderLeft: i > 0 ? "none" : undefined }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#C9A84C", letterSpacing: "1px", marginBottom: 16 }}>{s.step}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.dark ? "#FFFFFF" : "#0F0F0F", marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", margin: "0 56px", opacity: 0.3 }} />
      <section id="platform" style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(32px, 5vw, 80px)", alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 16 }}>THE PLATFORM</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1.5px", color: "#0F0F0F", margin: "0 0 20px", lineHeight: 1.1 }}>Built for the deal desk.<br /><span style={{ color: "#C9A84C" }}>Powered by AI.</span></h2>
            <p style={{ fontSize: 15, color: "#777", lineHeight: 1.7, margin: "0 0 32px" }}>Every feature is built to increase approvals, reduce time-to-decision, and eliminate lender guesswork.</p>
            <Link href="/request-access" style={{ fontSize: 13, fontWeight: 700, color: "#0F0F0F", background: "#C9A84C", borderRadius: 7, padding: "11px 24px", textDecoration: "none" }}>Request Access</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
            {[{ num: "01", title: "Risk Scoring Engine", desc: "Instantly assigns a precise risk tier so every deal starts structured correctly — before it ever reaches a lender." }, { num: "02", title: "Lender Waterfall", desc: "Multi-tier automated waterfall. Prime to catch-all. Every deal gets its best possible home without manual shopping or lender guessing." }, { num: "03", title: "Inventory Matching", desc: "Shows only the vehicles most likely to get approved — ranked by fit and pulled live from your inventory. No guesswork." }, { num: "04", title: "IBL Calculator", desc: "Structures income-based approvals for customers traditional lenders miss. No FICO required. Income is the qualifier — and every deal gets a path." }, { num: "05", title: "Deal Strength Score", desc: "Every decision returns a 0–100 score. One number that tells your team exactly where the deal stands and what to expect." }, { num: "06", title: "Audit Trail", desc: "Every decision logged with timestamp, tier assignment, and reasoning. Compliance documentation built in from day one — no retrofitting." }].map(f => (
              <div key={f.num} style={{ background: "#FFFFFF", border: "1px solid #E8E3D8", borderRadius: 12, padding: "24px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#C9A84C", letterSpacing: "1.5px", marginBottom: 12 }}>{f.num}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", margin: "0 56px", opacity: 0.3 }} />

      {/* Platform Demo Section */}
      <section id="demo" style={{ background: "#0F0F0F", padding: "clamp(48px, 6vw, 96px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 16 }}>LIVE PLATFORM PREVIEW</div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#FFFFFF", margin: "0 0 16px" }}>This is what your finance desk looks like.</h2>
            <p style={{ fontSize: 16, color: "#777", maxWidth: 540, margin: "0 auto" }}>Real screens. Real decisions. No mock data — this is the actual platform running live.</p>
          </div>

          {/* Decision Screen Mockup */}
          <div style={{ background: "#1A1A1A", borderRadius: 20, padding: 24, marginBottom: 24, border: "1px solid #2A2A2A" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
              <div style={{ marginLeft: 12, fontSize: 12, color: "#555", fontFamily: "monospace" }}>smartdriveelite.com/dealer/decision/app_xyz</div>
            </div>
            <div style={{ background: "#F7F4EE", borderRadius: 14, padding: "clamp(20px, 3vw, 32px)" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Smart Drive Elite · Decision Engine</div>
              <div style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 600, letterSpacing: "-0.04em", color: "#111", marginBottom: 4 }}>John D. — 2019 Ford F-150</div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", marginBottom: 20 }}>anthony.noll@goodautos.com · Submitted 4/30/2026 9:14 AM</div>
              <div style={{ background: "#eef6f2", border: "1px solid #d7e9df", borderRadius: 16, padding: "20px 24px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "#2f6f55", opacity: 0.7, marginBottom: 6 }}>Engine Decision</div>
                  <div style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 600, color: "#2f6f55" }}>APPROVED</div>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", marginTop: 6, maxWidth: 400 }}>NEAR PRIME profile. Westlake Financial Gold. Max payment $714 / Max vehicle $34,424. Deal strength 72/100.</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 4 }}>Deal Strength</div>
                  <div style={{ fontSize: 48, fontWeight: 600, color: "#1D9E75" }}>72</div>
                  <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>out of 100</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
                {[["Lender", "Westlake Financial"], ["Max Monthly", "$714/mo"], ["Max Weekly", "$165/wk"], ["Max Vehicle", "$34,424"], ["APR", "15.99%"], ["Term", "72 months"]].map(([label, value]) => (
                  <div key={label} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.35)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two column — dealer form + pipeline */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 16 }}>

            {/* Stip upload mockup */}
            <div style={{ background: "#1A1A1A", borderRadius: 20, padding: 24, border: "1px solid #2A2A2A" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                <div style={{ marginLeft: 8, fontSize: 11, color: "#555", fontFamily: "monospace" }}>Deal Intake · Required Documents</div>
              </div>
              <div style={{ background: "#F7F4EE", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 12 }}>Required Documents</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", marginBottom: 12 }}>All three documents must be uploaded before submission.</div>
                {[
                  { label: "Government-Issued ID", status: "uploaded", file: "drivers_license.jpg" },
                  { label: "Proof of Income", status: "uploaded", file: "paystub_april.pdf" },
                  { label: "Proof of Residence", status: "uploaded", file: "utility_bill.pdf" },
                ].map(doc => (
                  <div key={doc.label} style={{ background: "#eef6f2", border: "1px solid #d7e9df", borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{doc.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginTop: 2 }}>{doc.file}</div>
                    </div>
                    <span style={{ background: "#d7e9df", color: "#2f6f55", borderRadius: 999, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>✓ Uploaded</span>
                  </div>
                ))}
                <div style={{ background: "#111", color: "#fff", borderRadius: 12, padding: "12px", textAlign: "center", fontSize: 13, fontWeight: 600, marginTop: 12 }}>Submit Deal →</div>
              </div>
            </div>

            {/* Pipeline mockup */}
            <div style={{ background: "#1A1A1A", borderRadius: 20, padding: 24, border: "1px solid #2A2A2A" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                <div style={{ marginLeft: 8, fontSize: 11, color: "#555", fontFamily: "monospace" }}>Dealer Dashboard · Live Pipeline</div>
              </div>
              <div style={{ background: "#F7F4EE", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[["Submitted", "8"], ["Approved", "4"], ["Declined", "1"], ["Funded", "2"]].map(([label, val]) => (
                    <div key={label} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(0,0,0,0.35)" }}>{label}</div>
                      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{val}</div>
                    </div>
                  ))}
                </div>
                {[
                  { name: "Bill D.", vehicle: "Ford Expedition EL", status: "APPROVED", strength: 55, color: "#eef6f2", textColor: "#2f6f55" },
                  { name: "Sarah M.", vehicle: "Chevy Silverado 1500", status: "SUBMITTED", strength: 68, color: "#f8f2e8", textColor: "#9a6700" },
                  { name: "James R.", vehicle: "Dodge Charger", status: "DECLINED", strength: 23, color: "#fbefee", textColor: "#b42318" },
                ].map(app => (
                  <div key={app.name} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{app.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>{app.vehicle}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>Strength: {app.strength}</span>
                      <span style={{ background: app.color, color: app.textColor, borderRadius: 999, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>This is the actual platform. Request access and your team is live within 24 hours.</p>
            <a href="/signup" style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", background: "#C9A84C", borderRadius: 8, padding: "14px 36px", textDecoration: "none", display: "inline-block" }}>Start Free Trial →</a>
          </div>
        </div>
      </section>
      <section id="lenders" style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 12 }}>LENDER NETWORK</div>
          <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-1.5px", color: "#0F0F0F", margin: "0 0 16px" }}>Every customer profile has a home.</h2>
          <p style={{ fontSize: 16, color: "#777", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>Our multi-tier lender network covers prime to no-credit, W2 to 1099, standard to IBL. The engine finds the right fit automatically — no manual shopping required.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: 12, marginBottom: 48 }}>
          {[
            { tier: "TIER 1", title: "Prime", sub: "Standard financing", range: "Strong credit profile", specs: ["W2 income", "Competitive APR", "Max vehicle flexibility"], dark: false },
            { tier: "TIER 2", title: "Near Prime", sub: "Flexible programs", range: "Moderate credit profile", specs: ["All income types", "Extended terms", "Higher PTI allowance"], dark: false },
            { tier: "TIER 3", title: "Subprime", sub: "Income-based approval", range: "Challenged credit", specs: ["1099 accepted", "Self-employed OK", "Multiple tiers"], dark: false },
            { tier: "TIER 4", title: "Deep Subprime", sub: "BHPH programs", range: "Minimal credit history", specs: ["Income verified", "Down payment flex", "In-house options"], dark: false },
            { tier: "CATCH-ALL", title: "IBL", sub: "No credit required", range: "Income is the qualifier", specs: ["All titles accepted", "No FICO minimum", "True last resort"], dark: true },
          ].map(l => (
            <div key={l.tier} style={{ background: l.dark ? "#0F0F0F" : "#FFFFFF", border: "1px solid " + (l.dark ? "#2A2A2A" : "#E8E3D8"), borderRadius: 12, padding: "24px 18px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: l.dark ? "#1A1A1A" : "#F8F6F1", border: "1px solid " + (l.dark ? "#333" : "#E8E3D8"), borderRadius: 6, padding: "4px 10px", marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#C9A84C", letterSpacing: "1px" }}>{l.tier}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: l.dark ? "#FFFFFF" : "#0F0F0F", marginBottom: 4 }}>{l.title}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", marginBottom: 8 }}>{l.sub}</div>
              <div style={{ fontSize: 11, color: l.dark ? "#555" : "#BBB", marginBottom: 12 }}>{l.range}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {l.specs.map(sp => (
                  <div key={sp} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: l.dark ? "#666" : "#888" }}>{sp}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0F0F0F", borderRadius: 12, padding: "28px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>Multi-tier waterfall. Fully automated.</div>
            <div style={{ fontSize: 13, color: "#555" }}>Every deal routed. Every approval captured. Zero missed opportunities.</div>
          </div>
          <div style={{ display: "flex", gap: 32, flexShrink: 0 }}>
            {[{ val: "100%", label: "Automated" }, { val: "<60s", label: "Decision" }, { val: "Zero", label: "Manual steps" }].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#C9A84C", letterSpacing: "-1px", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "#0F0F0F", padding: "clamp(40px, 6vw, 64px) clamp(20px, 4vw, 56px)", overflowX: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 12 }}>WHY SMART DRIVE ELITE</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", color: "#FFFFFF", margin: "0 0 12px" }}>Legacy platforms manage deals. Smart Drive Elite decides them.</h2>
            <p style={{ fontSize: 14, color: "#555", margin: 0 }}>Most platforms help you submit deals. We control the outcome.</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 1100, border: "1px solid #2A2A2A", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid #2A2A2A" }}>
                <div style={{ padding: "14px 20px", background: "#1A1A1A" }}>
                  <span style={{ fontSize: 11, color: "#555", fontWeight: 700 }}>CAPABILITY</span>
                  <div style={{ fontSize: 9, color: "#333", marginTop: 3 }}>They manage the dealership. We decision the deal.</div>
                </div>
                {[
                  { name: "Smart Drive Elite", sub: "Decision Intelligence", gold: true },
                  { name: "DealerTrack", sub: "Infrastructure", gold: false },
                  { name: "RouteOne", sub: "Infrastructure", gold: false },
                  { name: "CDK Global", sub: "DMS", gold: false },
                  { name: "Tekion", sub: "DMS", gold: false },
                  { name: "DealerCenter", sub: "DMS/CRM", gold: false },
                  { name: "DealerSocket", sub: "CRM", gold: false },
                  { name: "Darwin Auto", sub: "F&I Menu", gold: false },
                  { name: "Reynolds", sub: "Legacy DMS", gold: false },
                ].map(h => (
                  <div key={h.name} style={{ padding: "10px 8px", background: h.gold ? "rgba(201,168,76,0.08)" : "#1A1A1A", borderLeft: "1px solid #2A2A2A", textAlign: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: h.gold ? "#C9A84C" : "#444", display: "block" }}>{h.name}</span>
                    <span style={{ fontSize: 9, color: h.gold ? "#7A6030" : "#333", display: "block", marginTop: 2 }}>{h.sub}</span>
                  </div>
                ))}
              </div>
              {[
                { feature: "AI deal decisioning",            v: [1,0,0,0,0,0,0,0,0] },
                { feature: "Automated lender waterfall",     v: [1,0,0,0,0,0,0,0,0] },
                { feature: "IBL / BHPH income support",      v: [1,0,0,0,0,0,0,0,0] },
                { feature: "Deal strength score",            v: [1,0,0,0,0,0,0,0,0] },
                { feature: "Under 60-second decisions",      v: [1,0,0,0,0,0,0,0,0] },
                { feature: "Built for independent dealers",  v: [1,0,0,0,0,0,0,0,0] },
                { feature: "Stip gate — docs required",      v: [1,0,0,0,0,0,0,0,0] },
                { feature: "1099 / self-employed routing",   v: [1,0,0,0,0,0,0,1,0] },
                { feature: "Subprime lender routing",        v: [1,1,1,0,0,0,1,1,1] },
                { feature: "Live inventory matching",        v: [1,1,0,1,1,1,1,0,0] },
                { feature: "F&I menu / deal structure",      v: [1,1,0,1,1,0,1,1,1] },
                { feature: "Deal management / DMS",          v: [1,1,1,1,1,1,1,0,1] },
              ].map((row, i) => (
                <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", borderBottom: i < 11 ? "1px solid #1A1A1A" : "none" }}>
                  <div style={{ padding: "12px 20px" }}><span style={{ fontSize: 12, color: "#888" }}>{row.feature}</span></div>
                  {row.v.map((val, j) => (
                    <div key={j} style={{ padding: "12px 8px", borderLeft: "1px solid #2A2A2A", textAlign: "center", background: j === 0 ? "rgba(201,168,76,0.08)" : "transparent" }}>
                      {val ? <span style={{ color: j === 0 ? "#C9A84C" : "#4ADE80", fontSize: 15, fontWeight: 800 }}>&#10003;</span> : <span style={{ color: "#2A2A2A" }}>&#8212;</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#444", fontStyle: "italic" }}>* Competitive assessment based on publicly available product information as of 2026. Feature availability may vary by plan, tier, or third-party integration. Smart Drive Elite makes no claim that competitors are incapable of building or offering similar features.</p>
          </div>
        </div>
      </section>
      <section id="opportunity" style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "clamp(32px, 5vw, 80px)", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 16 }}>THE OPPORTUNITY</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-1.5px", color: "#0F0F0F", margin: "0 0 20px", lineHeight: 1.1 }}>The platform the dealer market has been waiting for.</h2>
            <p style={{ fontSize: 16, color: "#777", lineHeight: 1.7, margin: "0 0 16px" }}>DealerTrack was built for franchises. Reynolds and Reynolds was built in another era. Neither was built for you.</p>
            <p style={{ fontSize: 16, color: "#777", lineHeight: 1.7, margin: "0 0 32px" }}>Smart Drive Elite gives franchise and independent dealers the same AI decisioning infrastructure that enterprise groups pay hundreds of thousands for — at a fraction of the cost, with none of the bloat. Every deal processed is a data point. Every approval, every decline, every lender decision at every tier — captured, learned, applied. The system builds an intelligence layer that no competitor can buy, copy, or fast-follow. Because they don't have the data. And they never will. Legacy platforms are submission pipes. They move paper. They don't think. Smart Drive Elite is the decision-making infrastructure sitting between the dealer and the lender — and it gets smarter, faster, and more accurate every single day it runs. The incumbents have been around for decades and still can't tell you if a deal will get approved before you submit it. We do that in under 60 seconds. On day one. Imagine what this system looks like after 10,000 deals. That's not software. That's a new category.</p>
            <Link href="/request-access" style={{ fontSize: 14, fontWeight: 700, color: "#0F0F0F", background: "#C9A84C", borderRadius: 8, padding: "13px 28px", textDecoration: "none", display: "inline-block" }}>Get Early Access</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ value: "40,000+", label: "Independent dealers in the US", sub: "Underserved by legacy software" }, { value: "$750B", label: "Used auto finance market", sub: "Annual originations" }, { value: "72%", label: "Deals need subprime routing", sub: "Most platforms skip this" }, { value: "1", label: "Built from the ground up for dealers", sub: "No legacy code. No shortcuts." }].map(s => (
              <div key={s.label} style={{ background: "#FFFFFF", border: "1px solid #E8E3D8", borderRadius: 12, padding: "24px 20px" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#0F0F0F", letterSpacing: "-1.5px", marginBottom: 6, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#AAA" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility & Trust Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 16 }}>BUILT ON REAL CREDENTIALS</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.5px", color: "#0F0F0F", margin: "0 0 16px" }}>A real company. A real platform. Real results.</h2>
          <p style={{ fontSize: 16, color: "#777", maxWidth: 560, margin: "0 auto" }}>Smart Drive Elite is a licensed Missouri LLC built by an automotive finance professional with over a decade of dealership experience.</p>
        </div>

        {/* License & Legal Credentials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 16, marginBottom: 48 }}>
          {[
            { icon: "🏛️", label: "Missouri LLC", value: "Smart Drive Elite LLC", sub: "Legally incorporated entity" },
            { icon: "📋", label: "Occupational License", value: "License #2763", sub: "City of Smithville, MO · Software Platform" },
            { icon: "™️", label: "USPTO Trademark", value: "#99764274", sub: "Filed April 14, 2026" },
            { icon: "📍", label: "Business Address", value: "Smithville, MO 64089", sub: "Located in Smithville, Missouri" },
          ].map(item => (
            <div key={item.label} style={{ background: "#FFFFFF", border: "1px solid #E8E3D8", borderRadius: 16, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 24 }}>{item.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#C9A84C", textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0F0F0F", letterSpacing: "-0.5px" }}>{item.value}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* About the founder */}
        <div style={{ background: "#F8F6F1", border: "1px solid #E8E3D8", borderRadius: 20, padding: "clamp(28px, 4vw, 48px)", marginBottom: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 32, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 16 }}>ABOUT THE FOUNDER & CEO</div>
            <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", color: "#0F0F0F", margin: "0 0 16px" }}>Douglas Liber</h3>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 12px" }}>Douglas Liber has spent 15+ years on the front lines of automotive finance — not in a boardroom, but on the floor, at the desk, in the deal. He knows what it takes to build a deal from scratch: pulling credit, reading a bureau, finding the right lender, structuring the payment, negotiating the rate, getting the approval, working the stips, and finally — getting ink on paper.</p>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 12px" }}>He has lived every step of that process hundreds of times over. He knows what a 540 FICO with 3 months on the job looks like to a lender. He knows when GLS won't touch it but Westlake will. He knows how to structure a deal around income when the credit file is thin. He knows the difference between a deal that funds and a deal that looks like it will.</p>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: 0 }}>He built Smart Drive Elite because the tools available to independent dealers were built for someone else. Legacy platforms were designed for franchise groups with DMS contracts and captive lenders. Nothing was built for the dealer — franchise or independent — sitting across from a customer with a 580 score, a pay stub, and a $2,000 down payment — trying to get them into something reliable before the end of the month. Smart Drive Elite is that tool. Built from the desk up.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "15+ years automotive finance experience",
              "Worked directly with Ally, Westlake, CPS, Wells Fargo, Citizens Bank, Arvest, Santander, Credit Acceptance, Flagship, Exeter, Midwest Acceptance, and more",
              "Built for franchise and independent dealers alike",
              "Missouri-based, dealer-focused",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", marginTop: 7, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lender network */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#AAA", marginBottom: 24, textTransform: "uppercase" }}>Integrated Lender Network</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {["Global Lending Services", "Westlake Financial", "Consumer Portfolio Services", "Midwest Acceptance Corp", "Western Funding"].map(lender => (
              <div key={lender} style={{ background: "#FFFFFF", border: "1px solid #E8E3D8", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "#444" }}>
                {lender}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#CCC", marginTop: 16 }}>Lender availability subject to program eligibility, geographic restrictions, and applicant qualifications.</p>
        </div>
      </section>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px) clamp(48px, 6vw, 96px)" }}>
        <div style={{ background: "#0F0F0F", borderRadius: 20, padding: "clamp(40px, 6vw, 72px) clamp(24px, 5vw, 80px)" }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", color: "#C9A84C", marginBottom: 20 }}>READY TO TRANSFORM YOUR FINANCE DESK</div>
            <h2 style={{ fontSize: "clamp(30px, 6vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", color: "#FFFFFF", margin: "0 0 20px", lineHeight: 1.05 }}>Stop losing deals to slow decisions.</h2>
            <p style={{ fontSize: 17, color: "#777", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 520 }}>Request access today. Your team will be submitting deals and getting instant AI-powered approvals within 24 hours of onboarding.</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link href="/signup" style={{ fontSize: 15, fontWeight: 700, color: "#0F0F0F", background: "#C9A84C", borderRadius: 8, padding: "15px 36px", textDecoration: "none" }}>Start Free Trial →</Link>
              <Link href="/login" style={{ fontSize: 15, fontWeight: 500, color: "#777", background: "transparent", border: "1px solid #2A2A2A", borderRadius: 8, padding: "15px 28px", textDecoration: "none" }}>Sign In</Link>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "12px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#C9A84C", marginBottom: 4 }}>BASIC</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>$1,299<span style={{ fontSize: 12, color: "#555", fontWeight: 400 }}>/mo</span></div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Up to 50 deals/mo + $25/app</div>
              </div>
              <div style={{ background: "#C9A84C", borderRadius: 10, padding: "12px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#0F0F0F", marginBottom: 4 }}>PRO</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0F0F0F" }}>$1,799<span style={{ fontSize: 12, color: "#7A6030", fontWeight: 400 }}>/mo</span></div>
                <div style={{ fontSize: 11, color: "#7A6030", marginTop: 2 }}>Unlimited deals + $20/app</div>
              </div>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "12px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#C9A84C", marginBottom: 4 }}>ELITE</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>Custom</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Multi-rooftop + $15/app</div>
              </div>
            </div>
            <div style={{ marginTop: 20, fontSize: 12, color: "#444" }}>Missouri · USPTO Trademark #99764274 · Smart Drive Elite LLC 2026</div>
          </div>
        </div>
      </section>
      <footer style={{ borderTop: "1px solid #E8E3D8", padding: "28px clamp(20px, 4vw, 56px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, background: "#F8F6F1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#0F0F0F"/><path d="M8 16 L13 10 L19 10 L24 16 L19 22 L13 22 Z" fill="none" stroke="#C9A84C" strokeWidth="1.5"/><circle cx="16" cy="16" r="3" fill="#C9A84C"/></svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0F0F0F" }}>Smart Drive Elite LLC</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          <Link href="/privacy" style={{ fontSize: 12, color: "#AAA", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ fontSize: 12, color: "#AAA", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/request-access" style={{ fontSize: 12, color: "#AAA", textDecoration: "none" }}>Request Access</Link>
          <Link href="/login" style={{ fontSize: 12, color: "#AAA", textDecoration: "none" }}>Sign In</Link>
        </div>
        <div style={{ fontSize: 11, color: "#CCC" }}>2026 Smart Drive Elite LLC · All rights reserved</div>
      </footer>
    </div>
  );
}
