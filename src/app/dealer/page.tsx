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
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);
    alert("Application Submitted");
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold mb-6">New Deal Submission</h1>

        <div className="grid grid-cols-2 gap-4">

          <input
            name="firstName"
            placeholder="First Name"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="creditScore"
            placeholder="Credit Score"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="monthlyIncome"
            placeholder="Monthly Income"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="vehiclePrice"
            placeholder="Vehicle Price"
            className="border p-2 rounded"
            onChange={handleChange}
          />

        </div>

        {/* 🔥 DEAL TYPE DROPDOWN (YOUR NEW FEATURE) */}
        <div className="mt-6">
          <label className="block text-sm mb-2">Deal Type</label>
          <select
            name="dealType"
            className="border p-2 rounded w-full"
            onChange={handleChange}
            value={form.dealType}
          >
            <option value="RETAIL">Retail</option>
            <option value="IBL">IBL (Income Based Lending)</option>
            <option value="LEASE">Lease</option>
            <option value="SUBSCRIPTION">Subscription</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg w-full"
        >
          Submit Deal
        </button>
      </div>
    </main>
  );
}
