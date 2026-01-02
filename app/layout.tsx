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
        </head>
        <body style={{ backgroundColor: '#020617', color: 'white', margin: 0, fontFamily: 'sans-serif' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
