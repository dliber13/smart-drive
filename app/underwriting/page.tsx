"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UnderwritingPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [deal, setDeal] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDeal = async () => {
      const res = await fetch(`/api/deals`);
      const data = await res.json();

      const found = data.applications.find((d: any) => d.id === id);
      setDeal(found);
    };

    fetchDeal();
  }, [id]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Underwriting Workstation</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <h2>Borrower Input</h2>

          <input value={deal?.customerName || ""} placeholder="Customer Name" />
          <input value={deal?.income || ""} placeholder="Monthly Income" />
          <input value={deal?.creditScore || ""} placeholder="Credit Score" />
          <input placeholder="Job Time (months)" />
          <input placeholder="Residence Time (months)" />
          <input value={deal?.downPayment || ""} placeholder="Down Payment" />

          <div style={{ marginTop: 10 }}>
            <button>Approve & Lock</button>
            <button>Request Stips</button>
            <button>Decline</button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2>Decision Summary</h2>

          {deal ? (
            <div>
              <p>Customer: {deal.customerName}</p>
              <p>Income: ${deal.income}</p>
              <p>Credit: {deal.creditScore}</p>
              <p>Down: ${deal.downPayment}</p>
            </div>
          ) : (
            <p>Loading deal...</p>
          )}
        </div>
      </div>
    </div>
  );
}
