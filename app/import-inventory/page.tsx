"use client";

import { useState } from "react";

export default function ImportInventoryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/import-inventory", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || "Done");
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Import Inventory</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Upload
      </button>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}