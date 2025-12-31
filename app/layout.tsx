import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt">
        <head>
          {/* Script de Configuração de Afiliados Lemon Squeezy */}
          <Script id="lemon-affiliate-config" strategy="afterInteractive">
            {`window.lemonSqueezyAffiliateConfig = { store: "nedra" };`}
          </Script>
          <Script 
            src="https://lmsqueezy.com/affiliate.js" 
            strategy="afterInteractive" 
            defer 
          />
        </head>
        <body style={{ backgroundColor: '#020617', color: 'white', margin: 0, fontFamily: 'sans-serif' }}>
          {children}

          {/* Script do Checkout Lemon Squeezy Overlay */}
          <Script
            src="https://app.lemonsqueezy.com/js/lemon.js"
            strategy="afterInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
