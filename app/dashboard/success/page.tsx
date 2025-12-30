"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redireciona após 5 segundos
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    // Atualiza o contador visualmente
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#020617', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ 
        textAlign: 'center', 
        background: '#0f172a', 
        padding: '50px', 
        borderRadius: '24px', 
        border: '1px solid #1e293b',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <CheckCircle2 size={80} color="#22c55e" />
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>
          Payment Successful!
        </h1>
        
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '30px' }}>
          Your credits have been added to your account. Get ready to create amazing scripts!
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px',
          background: 'rgba(255,255,255,0.05)',
          padding: '15px',
          borderRadius: '12px'
        }}>
          <Loader2 className="animate-spin" size={20} color="#3b82f6" />
          <p style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>
            Redirecting to Dashboard in <strong>{countdown}s</strong>...
          </p>
        </div>

        <button 
          onClick={() => router.push("/dashboard")}
          style={{
            marginTop: '25px',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Click here if you are not redirected automatically
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}