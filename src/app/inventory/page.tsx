import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const db = prisma as any;

  const vehicles = await db.$queryRawUnsafe(`
    SELECT *
    FROM public."Vehicle"
    ORDER BY "createdAt" DESC
    LIMIT 100
  `);

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Inventory
      </h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Stock #</th>
            <th>Year</th>
            <th>Make</th>
            <th>Model</th>
            <th>Price</th>
            <th>Mileage</th>
            <th>Status</th>
            <th>VIN</th>
          </tr>
        </thead>

        <tbody>
          {(vehicles as any[]).map((v) => (
            <tr key={v.id}>
              <td>{v.stockNumber}</td>
              <td>{v.year}</td>
              <td>{v.make}</td>
              <td>{v.model}</td>
              <td>{v.askingPrice ? `$${v.askingPrice}` : ""}</td>
              <td>{v.mileage}</td>
              <td>{v.status}</td>
              <td>{v.vin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}