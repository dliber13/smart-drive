export const BRANDING = {
  platformName: "Smart Drive Elite",
  ownerName: "Douglas Liber",
  tagline: "Elite underwriting and deal control platform",
} as const

export function assertBrandName(name: string) {
  if (name !== BRANDING.platformName) {
    throw new Error(
      `Branding mismatch detected. Expected "${BRANDING.platformName}" but received "${name}".`
    )
  }
  return name
}
