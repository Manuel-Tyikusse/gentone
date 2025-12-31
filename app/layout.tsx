import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
// 1. Primeiro, importamos o componente de Script do Next.js
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt">
        <body style={{ backgroundColor: '#020617', color: 'white', margin: 0, fontFamily: 'sans-serif' }}>
          {children}

          {/* 2. Colocamos o script aqui, antes de fechar o body */}
          <Script
            src="https://app.lemonsqueezy.com/js/lemon.js"
            strategy="afterInteractive" 
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
