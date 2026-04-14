import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Smart Drive Elite",
  description: "Automotive underwriting and deal structuring platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
