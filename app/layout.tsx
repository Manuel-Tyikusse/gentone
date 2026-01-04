"use client";

import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

/**
 * COMPONENTE DE RASTREIO DINÂMICO DE AFILIADOS
 * Consulta o Google Sheets em tempo real para validar o ID
 */
function AffiliateTracker() {
  useEffect(() => {
    async function verifyAndTrack() {
      if (typeof window === "undefined") return;

      const urlParams = new URLSearchParams(window.location.search);
      const affTag = urlParams.get("aff")?.toLowerCase().trim();

      if (affTag) {
        try {
          // SEU LINK DO GOOGLE SHEETS (CSV)
          const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRehnOTN6PcEBu31rshT7aVyDi2txwOwmq-kL6ScFFs7x2IVzt-CaZjfjTAWr3jHsFn203qVurYckS3/pub?output=csv";
          
          const response = await fetch(SHEET_CSV_URL);
          const csvText = await response.text();
          
          // Limpa o CSV e transforma em uma lista de IDs válidos
          const approvedIds = csvText
            .split(/\r?\n/) // Divide por linhas
            .map(row => {
              // Pega o primeiro valor da linha, remove aspas e espaços
              return row.split(',')[0].replace(/['"]+/g, '').toLowerCase().trim();
            })
            .filter(id => id !== "" && id !== "affiliate_id"); // Remove cabeçalhos ou linhas vazias

          // Verifica se o ID da URL está na lista aprovada
          if (approvedIds.includes(affTag)) {
            const days = 30;
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "; expires=" + date.toUTCString();
            
            // Salva o cookie de afiliado
            document.cookie = `gentone_aff_id=${affTag}${expires}; path=/`;
            console.log("GenTone: Affiliate verified from Sheets:", affTag);
          } else {
            console.warn("GenTone: Affiliate ID not authorized:", affTag);
          }
        } catch (error) {
          console.error("GenTone: Affiliate system error:", error);
        }
      }
    }

    verifyAndTrack();
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <AffiliateTracker />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}