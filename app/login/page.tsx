"use client"

import { useEffect, useState } from "react"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "bootstrap">("login")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" }).then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        if (data?.user?.role === "ADMIN") {
          window.location.href = "/admin"
        } else {
          window.location.href = "/dealer"
        }
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")

    const endpoint =
      mode === "bootstrap" ? "/api/auth/bootstrap" : "/api/auth/login"

    const payload =
      mode === "bootstrap"
        ? { fullName, email, password }
        : { email, password }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data?.error || "Request failed")
        return
      }

      if (mode === "bootstrap" || data?.user?.role === "ADMIN") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/dealer"
      }
    } catch (error) {
      console.error(error)
      setMessage("Request failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-12 text-[#111111]">
      <div className="mx-auto max-w-md rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="mb-8">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
            SmartDrive Financial
          </div>
          <h1 className="mt-3 text-[42px] font-semibold leading-none tracking-[-0.05em]">
            {mode === "bootstrap" ? "Create Admin" : "Sign In"}
          </h1>
          <p className="mt-3 text-[16px] leading-7 text-black/60">
            {mode === "bootstrap"
              ? "Set up the first administrator account for the platform."
              : "Use your assigned email and password to access the platform."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "bootstrap" && (
            <label className="block">
              <div className="mb-3 text-[12px] uppercase tracking-[0.28em] text-black/38">
                Full Name
              </div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-[20px] border border-black/10 bg-white px-5 py-4 outline-none"
                placeholder="Admin Name"
              />
            </label>
          )}

          <label className="block">
            <div className="mb-3 text-[12px] uppercase tracking-[0.28em] text-black/38">
              Email
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[20px] border border-black/10 bg-white px-5 py-4 outline-none"
              placeholder="you@company.com"
            />
          </label>

          <label className="block">
            <div className="mb-3 text-[12px] uppercase tracking-[0.28em] text-black/38">
              Password
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[20px] border border-black/10 bg-white px-5 py-4 outline-none"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[20px] bg-[#111111] px-6 py-4 text-[16px] font-semibold text-white disabled:opacity-60"
          >
            {submitting
              ? "Please wait..."
              : mode === "bootstrap"
              ? "Create Admin"
              : "Sign In"}
          </button>
        </form>

        {message && (
          <div className="mt-5 rounded-[18px] border border-black/8 bg-[#fcfbf8] px-4 py-3 text-[14px] text-[#8a4a3d]">
            {message}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between text-sm text-black/55">
          <button
            type="button"
            onClick={() => {
              setMode("login")
              setMessage("")
            }}
            className="hover:text-black"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("bootstrap")
              setMessage("")
            }}
            className="hover:text-black"
          >
            First-time setup
          </button>
        </div>
      </div>
    </main>
  )
}
