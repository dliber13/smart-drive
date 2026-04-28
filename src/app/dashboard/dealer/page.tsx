"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  firstName?: string;
  lastName?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehiclePrice?: number;
  status?: string;
  lender?: string;
  tier?: string;
  maxPayment?: number;
  createdAt: string;
};

export default function DealerDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/dealer/dashboard")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setApplications(data.applications);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // auto refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-6 text-lg">Loading deals...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dealer Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Lender</th>
              <th className="p-3">Tier</th>
              <th className="p-3">Max Payment</th>
              <th className="p-3">Submitted</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-t cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  (window.location.href = `/dashboard/dealer/${app.id}`)
                }
              >
                <td className="p-3">
                  {app.firstName} {app.lastName}
                </td>

                <td className="p-3">
                  {app.vehicleYear} {app.vehicleMake} {app.vehicleModel}
                </td>

                <td className="p-3">
                  ${app.vehiclePrice?.toLocaleString() || "—"}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      app.status === "APPROVED"
                        ? "bg-green-600"
                        : app.status === "DECLINED"
                        ? "bg-red-600"
                        : app.status === "SUBMITTED"
                        ? "bg-blue-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="p-3">{app.lender || "—"}</td>
                <td className="p-3">{app.tier || "—"}</td>

                <td className="p-3">
                  {app.maxPayment
                    ? `$${app.maxPayment.toLocaleString()}`
                    : "—"}
                </td>

                <td className="p-3">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div className="p-4 text-gray-500">No deals yet.</div>
        )}
      </div>
    </div>
  );
}
