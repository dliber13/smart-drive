"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/application-status");
        const data = await res.json();
        setApplicationCount(data.count || 0);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="p-6 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Applications</div>
        <div className="text-2xl font-bold">{applicationCount}</div>
      </div>
    </main>
  );
}