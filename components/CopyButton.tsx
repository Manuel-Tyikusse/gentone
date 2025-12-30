"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: copied ? '#22c55e' : '#334155',
        background: copied ? 'rgba(34, 197, 94, 0.1)' : '#020617',
        color: copied ? '#22c55e' : '#e2e8f0',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '500',
        transition: 'all 0.3s ease'
      }}
    >
      {copied ? (
        <><Check size={16} /> Copiado!</>
      ) : (
        <><Copy size={16} /> Copiar Texto</>
      )}
    </button>
  );
}