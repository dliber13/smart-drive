"use client";

import { useState } from "react";

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dealerName: "",
    title: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    monthlyUnits: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-[#111111]">
        <div className="mx-auto max-w-5xl">
          <a href="/" className="inline-flex rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold shadow-sm">Back to Home</a>
          <section className="mt-10 rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm md:p-14 text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mb-4 tracking-[0.45em] text-sm text-neutral-400">SMART DRIVE ELITE</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Request Received</h1>
            <p className="mt-6 max-w-xl mx-auto text-lg leading-relaxed text-neutral-600">We will review your information and reach out within 1 business day.</p>
            <p className="mt-4 text-sm text-neutral-400">Check your email for a confirmation.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-[#111111]">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="inline-flex rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold shadow-sm">Back to Home</a>
        <section className="mt-10 rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm md:p-14">
          <p className="mb-6 tracking-[0.45em] text-sm text-neutral-400">SMART DRIVE ELITE</p>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">Request Access</h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-neutral-700">Submit your information and our team will review your request for platform access.</p>
          <form onSubmit={handleSubmit} className="mt-12 grid gap-8 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">FIRST NAME *</span>
              <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="Doug" />
            </label>
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">LAST NAME *</span>
              <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="Liber" />
            </label>
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">DEALERSHIP NAME *</span>
              <input name="dealerName" value={formData.dealerName} onChange={handleChange} required className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="Good Autos" />
            </label>
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">TITLE</span>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="Finance Manager" />
            </label>
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">EMAIL *</span>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="you@dealership.com" />
            </label>
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">PHONE</span>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="816-555-0100" />
            </label>
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">CITY</span>
              <input name="city" value={formData.city} onChange={handleChange} className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="Kansas City" />
            </label>
            <label className="block">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">STATE</span>
              <select name="state" value={formData.state} onChange={handleChange} className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none bg-white">
                <option value="">Select state</option>
                <option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">MONTHLY UNITS SOLD</span>
              <select name="monthlyUnits" value={formData.monthlyUnits} onChange={handleChange} className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none bg-white">
                <option value="">Select range</option>
                <option value="1-10">1 - 10 units</option>
                <option value="11-25">11 - 25 units</option>
                <option value="26-50">26 - 50 units</option>
                <option value="51-100">51 - 100 units</option>
                <option value="100+">100+ units</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-3 block tracking-[0.35em] text-xs font-semibold text-neutral-400">MESSAGE</span>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full rounded-[1.5rem] border border-neutral-200 px-5 py-4 outline-none" placeholder="Tell us about your current finance process..." />
            </label>
            {error && (
              <div className="md:col-span-2 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="rounded-full bg-black px-8 py-4 font-semibold text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors">
                {loading ? "Submitting..." : "Submit Request"}
              </button>
              <p className="mt-4 text-sm text-neutral-400">We typically respond within 1 business day.</p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
