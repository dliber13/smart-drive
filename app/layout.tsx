export const metadata = {
  title: "Smart Drive",
  description: "Underwriting Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            font-family: Arial, Helvetica, sans-serif;
            background: #05070b;
            color: #f5f7fb;
          }

          * {
            box-sizing: border-box;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .sd-home {
            min-height: 100vh;
            background:
              radial-gradient(circle at top left, rgba(94, 106, 210, 0.16), transparent 28%),
              radial-gradient(circle at top right, rgba(0, 194, 255, 0.10), transparent 22%),
              linear-gradient(180deg, #070a10 0%, #0b111b 55%, #0a0f17 100%);
          }

          .sd-nav {
            max-width: 1200px;
            margin: 0 auto;
            padding: 28px 24px;
            display: flex;
            justify-content: space-between;
          }

          .sd-brand {
            font-size: 34px;
            font-weight: 800;
            letter-spacing: 2px;
          }

          .sd-nav-links {
            display: flex;
            gap: 24px;
          }

          .sd-hero {
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 24px;
          }

          .sd-title {
            font-size: 72px;
            line-height: 1;
            margin: 0;
          }

          .sd-subtitle {
            margin-top: 20px;
            font-size: 20px;
            color: #aab6c7;
          }

          .sd-actions {
            margin-top: 30px;
            display: flex;
            gap: 12px;
          }

          .sd-btn {
            padding: 14px 20px;
            border-radius: 10px;
            font-weight: bold;
          }

          .sd-btn-primary {
            background: white;
            color: black;
          }

          .sd-btn-secondary {
            border: 1px solid #555;
          }
        `}</style>

        {children}
      </body>
    </html>
  )
}
