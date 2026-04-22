import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function toTextOrNull(value: unknown) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text ? text : null
}

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined) return null 
  const text = String(value).trim()
  if (!text) return null
  const parsed = Number(text)
  return Number.isNaN(parsed) ? null : parsed
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          reason: "Request body must be an array of inventory rows.",
        },
        { status: 400 }
      )
    }

    const results = []

    for (const row of body) {
      const stockNumber =
        toTextOrNull(row?.stockNumber) ??
        toTextOrNull(row?.["Stock Number"]) ??
        toTextOrNull(row?.stock) ??
        toTextOrNull(row?.["Stock"])

      if (!stockNumber) {
        continue
      }

      const savedUnit = await prisma.inventoryUnit.upsert({
        where: { stockNumber },
        update: {
          vin: toTextOrNull(row?.vin) ?? toTextOrNull(row?.["VIN"]),
          year: toNumberOrNull(row?.year) ?? toNumberOrNull(row?.["Year"]),
          make: toTextOrNull(row?.make) ?? toTextOrNull(row?.["Make"]),
          model: toTextOrNull(row?.model) ?? toTextOrNull(row?.["Model"]),
          trim: toTextOrNull(row?.trim) ?? toTextOrNull(row?.["Trim"]),
          price: toNumberOrNull(row?.price) ?? toNumberOrNull(row?.["Price"]),
          mileage:
            toNumberOrNull(row?.mileage) ?? toNumberOrNull(row?.["Mileage"]),
          bodyStyle:
            toTextOrNull(row?.bodyStyle) ??
            toTextOrNull(row?.["Body Style"]) ??
            toTextOrNull(row?.["BodyStyle"]),
          exteriorColor:
            toTextOrNull(row?.exteriorColor) ??
            toTextOrNull(row?.["Exterior Color"]),
          interiorColor:
            toTextOrNull(row?.interiorColor) ??
            toTextOrNull(row?.["Interior Color"]),
          isAvailable:
            row?.isAvailable === false ||
            String(row?.["Is Available"] ?? "").toLowerCase() === "false"
              ? false
              : true,
          minCreditScore:
            toNumberOrNull(row?.minCreditScore) ??
            toNumberOrNull(row?.["Min Credit Score"]),
          maxAdvance:
            toNumberOrNull(row?.maxAdvance) ??
            toNumberOrNull(row?.["Max Advance"]),
          featuredRank:
            toNumberOrNull(row?.featuredRank) ??
            toNumberOrNull(row?.["Featured Rank"]),
        },
        create: {
          stockNumber,
          vin: toTextOrNull(row?.vin) ?? toTextOrNull(row?.["VIN"]),
          year: toNumberOrNull(row?.year) ?? toNumberOrNull(row?.["Year"]),
          make: toTextOrNull(row?.make) ?? toTextOrNull(row?.["Make"]),
          model: toTextOrNull(row?.model) ?? toTextOrNull(row?.["Model"]),
          trim: toTextOrNull(row?.trim) ?? toTextOrNull(row?.["Trim"]),
          price: toNumberOrNull(row?.price) ?? toNumberOrNull(row?.["Price"]),
          mileage:
            toNumberOrNull(row?.mileage) ?? toNumberOrNull(row?.["Mileage"]),
          bodyStyle:
            toTextOrNull(row?.bodyStyle) ??
            toTextOrNull(row?.["Body Style"]) ??
            toTextOrNull(row?.["BodyStyle"]),
          exteriorColor:
            toTextOrNull(row?.exteriorColor) ??
            toTextOrNull(row?.["Exterior Color"]),
          interiorColor:
            toTextOrNull(row?.interiorColor) ??
            toTextOrNull(row?.["Interior Color"]),
          isAvailable:
            row?.isAvailable === false ||
            String(row?.["Is Available"] ?? "").toLowerCase() === "false"
              ? false
              : true,
          minCreditScore:
            toNumberOrNull(row?.minCreditScore) ??
            toNumberOrNull(row?.["Min Credit Score"]),
          maxAdvance:
            toNumberOrNull(row?.maxAdvance) ??
            toNumberOrNull(row?.["Max Advance"]),
          featuredRank:
            toNumberOrNull(row?.featuredRank) ??
            toNumberOrNull(row?.["Featured Rank"]),
        },
      })

      results.push(savedUnit)
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      inventory: results,
    })
  } catch (error) {
    console.error("IMPORT INVENTORY ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to import inventory",
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
