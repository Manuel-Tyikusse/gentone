import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
// 1. Importamos o useEffect para ativar o overlay assim que a página carregar
"use client"; 
import { useEffect } from "react";

export default function PricingPage() {
  // 2. Ativamos o script do Lemon Squeezy
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).createLemonSqueezy) {
      (window as any).createLemonSqueezy();
    }
  }, []);

  const plans = [
    { 
      name: "Starter", 
      credits: 15, 
      price: "$9", 
      link: "https://nedra.lemonsqueezy.com/checkout/buy/335fdcc3-79e1-4d3e-9551-186d4c7b64c3?embed=1" 
    },
    { 
      name: "Pro", 
      credits: 50, 
      price: "$27", 
      link: "https://nedra.lemonsqueezy.com/checkout/buy/a089f67e-edbc-4cb5-8c4c-c2c71128032c?embed=1", 
      popular: true 
    },
    { 
      name: "Elite", 
      credits: 200, 
      price: "$67", 
      link: "https://nedra.lemonsqueezy.com/checkout/buy/854fc472-42c3-4eb7-acf0-5ed1a55f3366?embed=1" 
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '60px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <Link href="/dashboard" style={{ color: '#60a5fa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>Choose your Power</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '50px' }}>Unlock more scripts and take your content to the next level.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              background: '#0f172a',
              padding: '40px',
              borderRadius: '24px',
              border: plan.popular ? '2px solid #3b82f6' : '1px solid #1e293b',
              position: 'relative'
            }}>
              {plan.popular && <span style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>MOST POPULAR</span>}
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{plan.name}</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>{plan.price}<span style={{ fontSize: '1rem', color: '#64748b' }}>/one-time</span></div>
              
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '30px', color: '#94a3b8' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><Check size={18} color="#22c55e"/> {plan.credits} Scripts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><Check size={18} color="#22c55e"/> All Tones Included</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><Check size={18} color="#22c55e"/> High-Quality AI</li>
              </ul>

              {/* 3. Aqui está a mudança principal: Adicionámos a class "lemonsqueezy-button" */}
              <a href={plan.link} className="lemonsqueezy-button" style={{
                display: 'block',
                textAlign: 'center',
                padding: '15px',
                background: plan.popular ? '#3b82f6' : 'white',
                color: plan.popular ? 'white' : '#020617',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                Buy Credits Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}