"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#020617', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      fontFamily: 'sans-serif',
      color: 'white'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        width: '100%', 
        background: '#0f172a', 
        padding: '40px', 
        borderRadius: '24px', 
        border: '1px solid #1e293b', 
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <CheckCircle2 size={64} color="#22c55e" />
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Payment Successful!
        </h1>
        
        <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
          Your credits are being processed and will be available in your account in a few moments. Get ready to create viral content with **GenTone**.
        </p>

        <div style={{ display: 'grid', gap: '12px' }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#2563eb',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'opacity 0.2s'
          }}>
            Go to Dashboard <ArrowRight size={18} />
          </Link>
          
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} /> 
            AI Engine is warming up for your next script.
          </p>
        </div>
      </div>
    </div>
  );
}