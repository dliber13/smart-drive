"use client";

import { useState } from "react";

export default function ImportInventoryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [summary, setSummary] = useState<{
    imported?: number;
    updated?: number;
    skipped?: number;
  } | null>(null);

  async function handleImport() {
    if (!file) {
      setMessage("Please choose a CSV file first.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");
      setSummary(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import-inventory", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data?.reason || "Inventory import failed");
        setMessageType("error");
        return;
      }

      setMessage(data?.message || "Inventory import completed");
      setMessageType("success");
      setSummary({
        imported: data.imported,
        updated: data.updated,
        skipped: data.skipped,
      });
    } catch (error) {
      console.error("IMPORT INVENTORY PAGE ERROR:", error);
      setMessage("Inventory import failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-8 text-[#111111] md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="text-[13px] uppercase tracking-[0.32em] text-black/40">
            Smart Drive Elite
          </div>
          <h1 className="mt-4 text-6xl font-semibold tracking-[-0.06em]">
            Inventory Import
          </h1>
          <p className="mt-4 max-w-3xl text-2xl leading-[1.6] text-black/65">
            Upload your dealership inventory CSV and map it into the live vehicle
            matching engine.
          </p>
        </div>

        {message ? (
          <div
            className={`mb-8 rounded-[24px] border px-7 py-6 text-[18px] ${
              messageType === "success"
                ? "border-[#bfe3c6] bg-[#eaf6ee] text-[#2d7a45]"
                : "border-[#efc7c7] bg-[#fff3f3] text-[#c64223]"
            }`}
          >
            {message}
          </div>
        ) : null}

        <section className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="rounded-[28px] border border-black/6 bg-[#fcfbf8] p-6">
            <h2 className="text-[30px] font-semibold tracking-[-0.04em]">
              CSV Upload
            </h2>
            <p className="mt-2 text-[15px] text-black/55">
              Expected columns include Stock Number, Year, Make, Model, Odometer,
              and Asking Price.
            </p>

            <div className="mt-6">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 text-[16px]"
              />
            </div>

            <button
              onClick={handleImport}
              disabled={loading}
              className="mt-6 rounded-[20px] bg-black px-6 py-4 text-[17px] font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Importing Inventory..." : "Import Inventory"}
            </button>
          </div>

          <div className="mt-6 rounded-[28px] border border-black/6 bg-[#fcfbf8] p-6">
            <h3 className="text-[24px] font-semibold tracking-[-0.04em]">
              Import Summary
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <SummaryCard label="Imported" value={summary?.imported ?? 0} />
              <SummaryCard label="Updated" value={summary?.updated ?? 0} />
              <SummaryCard label="Skipped" value={summary?.skipped ?? 0} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[22px] border border-black/8 bg-white px-6 py-6">
      <div className="text-[13px] uppercase tracking-[0.22em] text-black/45">
        {label}
      </div>
      <div className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
        {value}
      </div>
    </div>
  );
}