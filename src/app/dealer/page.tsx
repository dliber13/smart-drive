"use client";

import { useState } from "react";

export default function DealerPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    creditScore: "",
    monthlyIncome: "",
    vehiclePrice: "",
    dealType: "RETAIL",
    acceptedTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && "checked" in e.target ? e.target.checked : false;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.acceptedTerms) {
      alert("You must accept Terms of Service and Privacy Policy before submitting.");
      return;
    }

    const res = await fetch("/api/test-submit-application", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      alert(data.reason || "Submission failed");
      return;
    }

    alert("Application Submitted");

    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      creditScore: "",
      monthlyIncome: "",
      vehiclePrice: "",
      dealType: "RETAIL",
      acceptedTerms: false,
    });
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-semibold">New Deal Submission</h1>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            className="rounded border p-2"
            onChange={handleChange}
            value={form.firstName}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            className="rounded border p-2"
            onChange={handleChange}
            value={form.lastName}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="rounded border p-2"
            onChange={handleChange}
            value={form.phone}
          />

          <input
            name="email"
            placeholder="Email"
            className="rounded border p-2"
            onChange={handleChange}
            value={form.email}
          />

          <input
            name="creditScore"
            placeholder="Credit Score"
            className="rounded border p-2"
            onChange={handleChange}
            value={form.creditScore}
          />

          <input
            name="monthlyIncome"
            placeholder="Monthly Income"
            className="rounded border p-2"
            onChange={handleChange}
            value={form.monthlyIncome}
          />

          <input
            name="vehiclePrice"
            placeholder="Vehicle Price"
            className="rounded border p-2"
            onChange={handleChange}
            value={form.vehiclePrice}
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm">Deal Type</label>
          <select
            name="dealType"
            className="w-full rounded border p-2"
            onChange={handleChange}
            value={form.dealType}
          >
            <option value="RETAIL">Retail</option>
            <option value="IBL">IBL (Income Based Lending)</option>
            <option value="LEASE">Lease</option>
            <option value="SUBSCRIPTION">Subscription</option>
          </select>
        </div>

        <div className="mt-6 rounded-xl border border-black/10 bg-[#faf7f1] p-4">
          <label className="flex items-start gap-3 text-sm text-black/70">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className="mt-1"
            />
            <span>
              I agree to the{" "}
              <a href="/terms" className="underline hover:text-black">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-black">
                Privacy Policy
              </a>.
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-lg bg-black px-6 py-3 text-white"
        >
          Submit Deal
        </button>
      </div>
    </main>
  );
}
