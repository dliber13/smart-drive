"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dealerName: "", city: "", state: "", monthlyUnits: "",
    password: "", confirmPassword: "", plan: "basic",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.dealerName || !form.password) {
      setError("Please fill in all required fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Signup failed"); setLoading(false); return; }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push("/dealer");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const plans = [
    { id: "basic", name: "Basic", price: "$1,299/mo", fee: "+ $25/app", desc: "Up to 50 deals/mo" },
    { id: "pro", name: "Pro", price: "$1,799/mo", fee: "+ $20/app", desc: "Unlimited deals" },
    { id: "elite", name: "Elite", price: "$2,799/mo", fee: "+ $15/app", desc: "Multi-rooftop" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", padding: "2rem 1.5rem", color: "#111" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0F0F0F"/><path d="M8 16 L13 10 L19 10 L24 16 L19 22 L13 22 Z" fill="none" stroke="#C9A84C" strokeWidth="1.5"/><circle cx="16" cy="16" r="3" fill="#C9A84C"/></svg>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F0F0F" }}>Smart Drive Elite</div>
                <div style={{ fontSize: 9, letterSpacing: "2px", color: "#C9A84C", fontWeight: 600 }}>FINANCE INTELLIGENCE</div>
              </div>
            </div>
          </Link>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", margin: "0 0 8px" }}>Get started today</h1>
          <p style={{ fontSize: 15, color: "rgba(0,0,0,0.55)", margin: 0 }}>50% off your first month. Full platform access from day one.</p>
        </div>

        {/* Trial Banner */}
        <div style={{ background: "#0f0f0f", borderRadius: 16, padding: "16px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C", marginBottom: 2 }}>🎉 Limited Time Offer</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>50% off your first month when you sign up today</div>
          </div>
          <div style={{ background: "#C9A84C", color: "#0f0f0f", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 800 }}>50% OFF FIRST MONTH</div>
        </div>

        {/* Plan Selector */}
        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.5rem", marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>Choose Your Plan</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {plans.map(p => (
              <button key={p.id} onClick={() => setForm(prev => ({ ...prev, plan: p.id }))}
                style={{ padding: "14px 10px", borderRadius: 12, border: `2px solid ${form.plan === p.id ? "#C9A84C" : "rgba(0,0,0,0.1)"}`, background: form.plan === p.id ? "#0f0f0f" : "#faf7f1", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.plan === p.id ? "#C9A84C" : "#111", marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: form.plan === p.id ? "#fff" : "#111" }}>{p.price}</div>
                <div style={{ fontSize: 10, color: form.plan === p.id ? "#C9A84C" : "rgba(0,0,0,0.4)" }}>{p.fee}</div>
                <div style={{ fontSize: 10, color: form.plan === p.id ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", marginTop: 2 }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.5rem", marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>Your Information</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Doug" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>Email Address *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doug@yourdealership.com" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="816-555-0000" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>Monthly Units</label>
              <select name="monthlyUnits" value={form.monthlyUnits} onChange={handleChange} style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" }}>
                <option value="">Select range</option>
                <option value="1-10">1-10 units</option>
                <option value="11-25">11-25 units</option>
                <option value="26-50">26-50 units</option>
                <option value="51-100">51-100 units</option>
                <option value="100+">100+ units</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)", marginBottom: 12, marginTop: 20 }}>Dealership Information</div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>Dealership Name *</label>
            <input name="dealerName" value={form.dealerName} onChange={handleChange} placeholder="Smith Auto Group" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Kansas City" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>State</label>
              <select name="state" value={form.state} onChange={handleChange} style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" }}>
                <option value="">Select state</option>
                {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)", marginBottom: 12 }}>Create Password</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", display: "block", marginBottom: 4 }}>Confirm Password *</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fbefee", border: "1px solid #f0c8c4", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#b42318", fontWeight: 500 }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: "#C9A84C", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", color: "#0f0f0f", opacity: loading ? 0.7 : 1, marginBottom: 16 }}>
          {loading ? "Creating your account…" : "Get Started — 50% Off First Month →"}
        </button>

        <div style={{ textAlign: "center", fontSize: 13, color: "rgba(0,0,0,0.4)", marginBottom: 24 }}>
          Already have an account? <Link href="/login" style={{ color: "#111", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: "rgba(0,0,0,0.3)" }}>
          By signing up you agree to our <Link href="/terms" style={{ color: "rgba(0,0,0,0.5)" }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: "rgba(0,0,0,0.5)" }}>Privacy Policy</Link>
        </div>
      </div>
    </main>
  );
}
