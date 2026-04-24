"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Match = {
  id: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  askingPrice: number;
  matchScore: number;
};

export default function ControllerApplicationPage() {
  const params = useParams();
  const applicationId = params?.id as string;

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) return;

    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/match-vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ applicationId }),
        });

        const data = await res.json();

        if (data.success) {
          setMatches(data.matches || []);
        }
      } catch (err) {
        console.error("Failed to load matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [applicationId]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">
          Controller Review
        </h1>

        <div className="mb-8 text-sm text-black/60">
          Application ID: {applicationId}
        </div>

        {loading && <div>Loading matches...</div>}

        {!loading && matches.length === 0 && (
          <div>No matches found</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow p-5 border"
            >
              <div className="text-sm text-black/50 mb-1">
                Stock: {vehicle.stockNumber}
              </div>

              <div className="text-lg font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </div>

              <div className="text-sm text-black/60 mt-2">
                Mileage: {vehicle.mileage?.toLocaleString()}
              </div>

              <div className="text-sm text-black/60">
                Price: ${vehicle.askingPrice?.toLocaleString()}
              </div>

              <div className="mt-4 text-sm">
                Match Score:
                <span className="ml-2 font-bold text-green-600">
                  {vehicle.matchScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}