"use client";

import Link from "next/link";
import { useState } from "react";

type RequestAccessForm = {
  fullName: string;
  dealershipName: string;
  title: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: RequestAccessForm = {
  fullName: "",
  dealershipName: "",
  title: "",
  email: "",
  phone: "",
  message: "",
};

export default function RequestAccessPage() {
  const [form, setForm] = useState<RequestAccessForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#111111]">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-black/75 transition hover:bg-black hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="rounded-[36px] border border-black/10 bg-white p-8 shadow-[0_25px_80px_rgba(0,0,0,0.08)] md:p-10">
          <div className="max-w-2xl">
            <div className="text-[12px] uppercase tracking-[0.34em] text-black/45">
              Smart Drive Elite
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-black md:text-6xl">
              Request Access
            </h1>
            <p className="mt-5 text-lg leading-8 text-black/65">
              Submit your information and we’ll review your request for platform
              access. This gives you a live page instead of the 404 and creates
              a polished intake point for future workflow integration.
            </p>
          </div>

          {submitted ? (
            <div className="mt-10 rounded-[28px] border border-emerald-200 bg-emerald-50 p-8">
              <div className="text-[12px] uppercase tracking-[0.28em] text-emerald-700">
                Request Received
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-emerald-900">
                Access request submitted
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-900/80">
                Your request has been captured on this page for now. Next, we can
                wire this into your real application workflow so requests save to
                the database, notify you, or route into admin review.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <InfoCard label="Full Name" value={form.fullName} />
                <InfoCard label="Dealership" value={form.dealershipName} />
                <InfoCard label="Title" value={form.title} />
                <InfoCard label="Email" value={form.email} />
                <InfoCard label="Phone" value={form.phone} />
                <InfoCard label="Message" value={form.message || "N/A"} />
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm(initialForm);
                  }}
                  className="rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                />
                <Field
                  label="Dealership Name"
                  name="dealershipName"
                  value={form.dealershipName}
                  onChange={handleChange}
                />
                <Field
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
                <Field
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <Field
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-[22px] border border-black/10 bg-[#fcfbf8] px-5 py-4 text-base outline-none"
                  placeholder="Tell us about your dealership or access need"
                />
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#111111] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition hover:scale-[1.01]"
                >
                  Submit Request
                </button>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-8 py-4 text-base font-medium text-black transition hover:bg-black hover:text-white"
                >
                  Go to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-[22px] border border-black/10 bg-[#fcfbf8] px-5 py-4 text-base outline-none"
      />
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-emerald-200 bg-white px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-700/70">
        {label}
      </div>
      <div className="mt-2 text-base font-medium text-emerald-950">
        {value || "N/A"}
      </div>
    </div>
  );
}