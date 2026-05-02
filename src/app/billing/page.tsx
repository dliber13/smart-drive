"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success")) {
      setMessage("Subscription activated successfully! Welcome to Smart Drive Elite.");
      setMessageType("success");
    } else if (params.get("cancelled")) {
      setMessage("Checkout cancelled. No charges were made.");
      setMessageType("error");
    }
  }, []);

  const handleSubscribe = async (plan: "basic" | "pro" | "elite") => {
    setLoading(plan);
    setMessage("");
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "Failed to create checkout session");
        setMessageType("error");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "Failed to open billing portal");
        setMessageType("error");
      }
    } catch {
      setMessage("Something went wrong.");
      setMessageType("error");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "basic" as const,
      name: "Basic",
      price: "$1,299",
      period: "/mo",
      appFee: "$25 per application",
      description: "Up to 50 deals per month",
      features: [
        "AI deal decisioning",
        "5-lender waterfall",
        "Inventory matching",
        "Deal strength scoring",
        "DocuSign e-signature",
        "AI stip verification",
        "Up to 50 deals/mo",
        "$25 per application submitted",
      ],
      highlight: false,
    },
    {
      id: "pro" as const,
      name: "Pro",
      price: "$1,799",
      period: "/mo",
      appFee: "$20 per application",
      description: "Unlimited deals per month",
      features: [
        "Everything in Basic",
        "Unlimited deals",
        "Priority support",
        "Advanced analytics",
        "Multi-user access",
        "$20 per application submitted",
      ],
      highlight: true,
    },
    {
      id: "elite" as const,
      name: "Elite",
      price: "$2,799",
      period: "/mo",
      appFee: "$15 per application",
      description: "Multi-rooftop. Unlimited everything.",
      features: [
        "Everything in Pro",
        "Multi-rooftop support",
        "Dedicated account manager",
        "Custom lender configuration",
        "API access",
        "$15 per application submitted",
      ],
      highlight: false,
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", padding: "2rem 1.5rem", color: "#111" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/dealer" style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", textDecoration: "none" }}>← Back to Dashboard</Link>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(0,0,0,0.4)", marginBottom: 8, marginTop: 16 }}>Smart Drive Elite</div>
          <h1 style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-0.04em", margin: 0 }}>Billing & Plans</h1>
          <p style={{ fontSize: 15, color: "rgba(0,0,0,0.55)", marginTop: 8 }}>Choose the plan that fits your dealership. All plans include full platform access.</p>
        </div>

        {message && (
          <div style={{ background: messageType === "success" ? "#eef6f2" : "#fbefee", border: `1px solid ${messageType === "success" ? "#d7e9df" : "#f0c8c4"}`, borderRadius: 14, padding: "12px 16px", marginBottom: 24, fontSize: 14, color: messageType === "success" ? "#2f6f55" : "#b42318", fontWeight: 500 }}>
            {message}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: plan.highlight ? "#0f0f0f" : "#fff", border: `1px solid ${plan.highlight ? "#C9A84C" : "rgba(0,0,0,0.1)"}`, borderRadius: 24, padding: "2rem", position: "relative" }}>
              {plan.highlight && (
                <div style={{ background: "#C9A84C", color: "#0f0f0f", borderRadius: 999, padding: "3px 12px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", display: "inline-block", marginBottom: 16 }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: plan.highlight ? "#C9A84C" : "rgba(0,0,0,0.4)", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 700, color: plan.highlight ? "#fff" : "#111", letterSpacing: "-0.04em" }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: plan.highlight ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 600, marginBottom: 8 }}>+ {plan.appFee}</div>
              <div style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginBottom: 24 }}>{plan.description}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                style={{ width: "100%", background: plan.highlight ? "#C9A84C" : "#0f0f0f", color: plan.highlight ? "#0f0f0f" : "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: loading === plan.id ? "not-allowed" : "pointer", opacity: loading === plan.id ? 0.7 : 1 }}
              >
                {loading === plan.id ? "Redirecting…" : `Subscribe to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.5rem", textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#111", marginBottom: 8 }}>Already subscribed?</div>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>Manage your subscription, update payment method, or view invoices.</div>
          <button
            onClick={handleManageBilling}
            disabled={loading === "portal"}
            style={{ background: "#f7f4ee", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#111" }}
          >
            {loading === "portal" ? "Opening…" : "Manage Billing"}
          </button>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, color: "rgba(0,0,0,0.35)" }}>
          Powered by Stripe · Secure payments · Cancel anytime · All plans include full platform access
        </div>
      </div>
    </main>
  );
}
