import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

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
        </body>
      </html>
    </ClerkProvider>
  );
}
