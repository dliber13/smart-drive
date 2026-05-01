"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditDealPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [original, setOriginal] = useState<any>(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    monthlyIncome: "", payFrequency: "BIWEEKLY",
    monthlyExpenses: "", downPayment: "",
    residenceMonths: "", employmentMonths: "",
    creditScore: "",
    stockNumber: "", vin: "", vehicleYear: "",
    vehicleMake: "", vehicleModel: "", vehiclePrice: "", mileage: "",
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/applications/${id}`).then(r => r.json()),
      fetch("/api/vehicle-options", { cache: "no-store" }).then(r => r.json()),
    ]).then(([appData, vehData]) => {
      if (appData?.application) {
        const app = appData.application;
        setOriginal(app);
        setForm({
          firstName: app.firstName || "",
          lastName: app.lastName || "",
          phone: app.phone || "",
          email: app.email || "",
          monthlyIncome: app.monthlyIncome?.toString() || "",
          payFrequency: app.payFrequency || "BIWEEKLY",
          monthlyExpenses: "",
          downPayment: app.downPayment?.toString() || "",
          residenceMonths: app.residenceMonths?.toString() || "",
          employmentMonths: app.employmentMonths?.toString() || "",
          creditScore: app.creditScore?.toString() || "",
          stockNumber: app.stockNumber || "",
          vin: app.vin || "",
          vehicleYear: app.vehicleYear?.toString() || "",
          vehicleMake: app.vehicleMake || "",
          vehicleModel: app.vehicleModel || "",
          vehiclePrice: app.vehiclePrice?.toString() || "",
          mileage: "",
        });
      } else {
        setError("Deal not found.");
      }
      if (vehData?.vehicles) setVehicles(vehData.vehicles);
    }).catch(() => setError("Failed to load deal."))
    .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = e.target.value;
    setSelectedVehicleId(vehicleId);
    if (!vehicleId) return;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setForm(prev => ({
        ...prev,
        stockNumber: vehicle.stockNumber || "",
        vin: vehicle.vin || "",
        vehicleYear: vehicle.year?.toString() || "",
        vehicleMake: vehicle.make || "",
        vehicleModel: vehicle.model || "",
        vehiclePrice: vehicle.askingPrice?.toString() || "",
        mileage: vehicle.mileage?.toString() || "",
      }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/test-submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ssn: original?.ssnEncrypted ? "[PRESERVED]" : "",
          dob: original?.dobEncrypted ? "[PRESERVED]" : "",
          dlNumber: original?.dlEncrypted ? "[PRESERVED]" : "",
          dlState: original?.dlState || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data?.reason || "Submission failed"); setSubmitting(false); return; }
      if (data?.applicationId) {
        router.push(`/dealer/decision/${data.applicationId}`);
      }
    } catch { setMessage("Submission failed"); }
    finally { setSubmitting(false); }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 16, color: "#888" }}>Loading deal...</div>
    </main>
  );

  if (error) return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 16, color: "#b42318" }}>{error}</div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", padding: "2rem 1.5rem", color: "#111" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Smart Drive Elite · Edit & Resubmit</div>
          <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.04em", margin: 0 }}>
            {form.firstName} {form.lastName}
          </h1>
          {original?.dealNumber && (
            <div style={{ display: "inline-block", marginTop: 8, background: "#0f0f0f", color: "#C9A84C", borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>
              Original: {original.dealNumber} → New deal number will be assigned on resubmit
            </div>
          )}
        </div>

        <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 14, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#856404" }}>
          <strong>Edit mode:</strong> SSN, DOB, and DL are preserved from the original deal. Adjust the fields below and resubmit — a new deal number will be assigned.
        </div>

        {message && (
          <div style={{ background: "#fbefee", border: "1px solid #f0c8c4", borderRadius: 14, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#b42318" }}>{message}</div>
        )}

        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.5rem", marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 16 }}>Customer Info</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
          </div>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.5rem", marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 16 }}>Financial — Adjustable</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input name="monthlyIncome" placeholder="Monthly Income ($)" value={form.monthlyIncome} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
            <select name="payFrequency" value={form.payFrequency} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none", background: "#fff" }}>
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-Weekly</option>
              <option value="SEMIMONTHLY">Semi-Monthly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
            <input name="downPayment" placeholder="Down Payment ($)" value={form.downPayment} onChange={handleChange} style={{ borderRadius: 12, border: "2px solid #C9A84C", padding: "10px 14px", fontSize: 14, outline: "none", background: "#fffdf5" }} />
            <input name="creditScore" placeholder="Credit Score" value={form.creditScore} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
            <input name="monthlyExpenses" placeholder="Monthly Expenses ($)" value={form.monthlyExpenses} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
            <input name="residenceMonths" placeholder="Months at Residence" value={form.residenceMonths} onChange={handleChange} style={{ borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none" }} />
          </div>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.5rem", marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 16 }}>Vehicle</div>
          <select value={selectedVehicleId} onChange={handleVehicleSelect} style={{ width: "100%", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 14, outline: "none", background: "#fff", marginBottom: 12 }}>
            <option value="">Keep current vehicle or select new</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} — Stock #{v.stockNumber} — {formatCurrency(v.askingPrice)}</option>
            ))}
          </select>
          {form.vehicleMake && (
            <div style={{ background: "#faf7f1", borderRadius: 12, padding: "12px 14px", fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
              {form.vehicleYear} {form.vehicleMake} {form.vehicleModel} — Stock #{form.stockNumber} — {formatCurrency(Number(form.vehiclePrice))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.back()} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.2)", borderRadius: 999, padding: "12px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#111" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? "#ccc" : "#0f0f0f", border: "none", borderRadius: 999, padding: "12px 36px", fontSize: 14, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", color: "#fff" }}>
            {submitting ? "Resubmitting..." : "Resubmit Deal"}
          </button>
        </div>

      </div>
    </main>
  );
}
