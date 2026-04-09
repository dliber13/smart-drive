import Link from "next/link"

export default function HomePage() {
  return (
    <main className="sd-home">
      <header className="sd-nav">
        <div className="sd-brand">SMART DRIVE</div>

        <nav className="sd-nav-links">
          <Link href="/dealer">Dealer</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <section className="sd-hero">
        <div className="sd-eyebrow">Modern Auto Finance Platform</div>

        <h1 className="sd-title">
          Underwriting.
          <br />
          Reimagined.
        </h1>

        <p className="sd-subtitle">
          A modern decision engine built for speed, precision, and control.
          Instantly evaluate deals, route lenders, and lock approvals.
        </p>

        <div className="sd-actions">
          <Link href="/dealer" className="sd-btn sd-btn-primary">
            Start a Deal
          </Link>

          <Link href="/dashboard" className="sd-btn sd-btn-secondary">
            View Dashboard
          </Link>
        </div>
      </section>

      <section className="sd-grid">
        <div className="sd-card">
          <div className="sd-card-number">01</div>
          <h2>Instant Decisions</h2>
          <p>
            Real-time underwriting logic calculates tier, payment, and lender
            routing instantly.
          </p>
        </div>

        <div className="sd-card">
          <div className="sd-card-number">02</div>
          <h2>Full Visibility</h2>
          <p>
            Track deal status from submission through funding with a clean,
            centralized dashboard.
          </p>
        </div>

        <div className="sd-card">
          <div className="sd-card-number">03</div>
          <h2>Dealer Workflow</h2>
          <p>
            Built for speed at the dealership level — submit, evaluate, and move
            deals forward without friction.
          </p>
        </div>
      </section>

      <section className="sd-banner">
        <div>
          <p className="sd-banner-label">Built for production</p>
          <h3>Operational underwriting, now with persistence.</h3>
        </div>

        <Link href="/dealer" className="sd-btn sd-btn-primary">
          Open Platform
        </Link>
      </section>

      <footer className="sd-footer">
        © {new Date().getFullYear()} Smart Drive
      </footer>
    </main>
  )
}
