import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Papa from "papaparse"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const text = await file.text()

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    const rows = parsed.data as any[]

    for (const row of rows) {
      const stockNumber = row["Stock Number"]?.toString().trim()
      const vin = row["VIN"]?.toString().trim()

      if (!stockNumber || !vin) continue // skip bad rows

      await (prisma as any).vehicle.upsert({
        where: { stockNumber },
        update: {
          vehicleYear: Number(row["Year"]) || null,
          vehicleMake: row["Make"] || null,
          vehicleModel: row["Model"] || null,
          vehiclePrice: Number(row["Asking Price"]) || null,
          mileage: Number(row["Odometer"]) || null,
          vin,
          trim: row["Trim"] || null,
          vehicleClass: normalizeClass(row["Vehicle Class"]),
          driveTrain: row["Drive Train"] || null,
          fuelType: row["Fuel Type"] || null,
          transmission: row["Transmission"] || null,
          daysInInventory: Number(row["Days In Inventory"]) || null,
          dateInStock: parseDate(row["Date In Stock"]),
          status: normalizeStatus(row["Status"]),
        },
        create: {
          stockNumber,
          vehicleYear: Number(row["Year"]) || null,
          vehicleMake: row["Make"] || null,
          vehicleModel: row["Model"] || null,
          vehiclePrice: Number(row["Asking Price"]) || null,
          mileage: Number(row["Odometer"]) || null,
          vin,
          trim: row["Trim"] || null,
          vehicleClass: normalizeClass(row["Vehicle Class"]),
          driveTrain: row["Drive Train"] || null,
          fuelType: row["Fuel Type"] || null,
          transmission: row["Transmission"] || null,
          daysInInventory: Number(row["Days In Inventory"]) || null,
          dateInStock: parseDate(row["Date In Stock"]),
          status: normalizeStatus(row["Status"]),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Inventory imported successfully",
      count: rows.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// ✅ Normalize vehicle class
function normalizeClass(val: string) {
  if (!val) return "STANDARD"

  const v = val.toUpperCase()

  if (v.includes("USED")) return "USED"
  if (v.includes("NEW")) return "NEW"

  return "STANDARD"
}

// ✅ Normalize status (DealerCenter → Smart Drive)
function normalizeStatus(val: string) {
  if (!val) return "INACTIVE"

  const v = val.toUpperCase()

  if (v.includes("IN INVENTORY")) return "ACTIVE"
  if (v.includes("READY")) return "ACTIVE"

  return "INACTIVE"
}

// ✅ Safe date parsing
function parseDate(val: string) {
  if (!val) return null
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}