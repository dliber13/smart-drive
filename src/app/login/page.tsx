"use client"

import { CSSProperties, FormEvent, useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setMessageType("error")
        setMessage(data?.message || "Sign in failed")
        return
      }

      setMessageType("success")
      setMessage("Sign in successful")

      if (data?.redirectTo) {
        window.location.href = data.redirectTo
        return
      }

      if (data?.user?.role === "DEALER_MANAGER" || ["SUPER_ADMIN","EXECUTIVE","UNDERWRITER","SENIOR_UNDERWRITER"].includes(data?.user?.role)) {
        window.location.href = "/controller"
      } else if (false) {
        window.location.href = "/controller"
      } else {
        window.location.href = "/dealer-dashboard"
      }
    } catch (error) {
      console.error(error)
      setMessageType("error")
      setMessage("Something went wrong during sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.brandBlock}>
          <div style={styles.kicker}>Smart Drive Elite</div>
          <h1 style={styles.title}>Sign In</h1>
          <p style={styles.subtitle}>
            Use your assigned email and password to access the platform.
          </p>
        </div>

        <section style={styles.card}>
          {message ? (
            <div
              style={{
                ...styles.message,
                ...(messageType === "success"
                  ? styles.messageSuccess
                  : messageType === "error"
                  ? styles.messageError
                  : styles.messageInfo),
              }}
            >
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.labelWrap}>
              <div style={styles.label}>Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={styles.input}
                autoComplete="email"
              />
            </label>

            <label style={styles.labelWrap}>
              <div style={styles.label}>Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={styles.input}
                autoComplete="current-password"
              />
            </label>

            <div style={styles.buttonRow}>
              <button type="submit" disabled={loading} style={styles.primaryButton}>
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <a href="/admin" style={styles.secondaryButton}>
                First-Time Setup
              </a>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f7f4ee",
    color: "#111111",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "32px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  shell: {
    width: "100%",
    maxWidth: "520px",
  },
  brandBlock: {
    marginBottom: "24px",
  },
  kicker: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.28em",
    color: "rgba(17,17,17,0.45)",
    marginBottom: "12px",
  },
  title: {
    margin: 0,
    fontSize: "56px",
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  subtitle: {
    marginTop: "16px",
    marginBottom: 0,
    fontSize: "16px",
    lineHeight: 1.7,
    color: "rgba(17,17,17,0.65)",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid rgba(17,17,17,0.08)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  labelWrap: {
    display: "block",
  },
  label: {
    marginBottom: "8px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    color: "rgba(17,17,17,0.45)",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.1)",
    backgroundColor: "#ffffff",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "6px",
  },
  primaryButton: {
    borderRadius: "18px",
    border: "none",
    backgroundColor: "#111111",
    padding: "14px 22px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#ffffff",
    cursor: "pointer",
  },
  secondaryButton: {
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.1)",
    backgroundColor: "#ffffff",
    padding: "14px 22px",
    fontSize: "14px",
    fontWeight: 700,
    color: "rgba(17,17,17,0.78)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  message: {
    marginBottom: "18px",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.1)",
    padding: "14px 16px",
    fontSize: "14px",
  },
  messageSuccess: {
    backgroundColor: "#eefaf1",
    borderColor: "#b7e3c2",
    color: "#1f7a37",
  },
  messageError: {
    backgroundColor: "#fff1f1",
    borderColor: "#efc0c0",
    color: "#b42318",
  },
  messageInfo: {
    backgroundColor: "#ffffff",
    borderColor: "rgba(17,17,17,0.1)",
    color: "rgba(17,17,17,0.75)",
  },
}
