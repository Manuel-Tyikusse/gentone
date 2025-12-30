import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    { name: "Starter", credits: 10, price: "$9", link: "TEU_LINK_LEMON_SQUEEZY_AQUI" },
    { name: "Pro", credits: 50, price: "$29", link: "TEU_LINK_LEMON_SQUEEZY_AQUI", popular: true },
    { name: "Elite", credits: 200, price: "$79", link: "TEU_LINK_LEMON_SQUEEZY_AQUI" },
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

              <Link href={plan.link} style={{
                display: 'block',
                padding: '15px',
                background: plan.popular ? '#3b82f6' : 'white',
                color: plan.popular ? 'white' : '#020617',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                Buy Credits Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}