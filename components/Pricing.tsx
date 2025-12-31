// import styles from './Pricing.module.css';
// import { Zap } from 'lucide-react';

// export default function Pricing() {
//   const plans = [
//     { title: "Free", price: "0", popular: false },
//     { title: "Monthly", price: "19", popular: true },
//     { title: "Annual", price: "159", popular: false }
//   ];

//   return (
//     <section id="pricing" className={styles.section}>
//       <h2>Simple, Transparent Pricing</h2>
//       <div className={styles.grid}>
//         {plans.map((p, i) => (
//           <div key={i} className={`${styles.card} ${p.popular ? styles.popular : ''}`}>
//             {p.popular && <span className={styles.badge}>MOST POPULAR</span>}
//             <p style={{color: '#94a3b8'}}>{p.title}</p>
//             <div className={styles.price}>${p.price}<span style={{fontSize: '1rem', color: '#6b7280'}}>/mo</span></div>
//             <ul className={styles.list}>
//               <li className={styles.listItem}><Zap size={16} color="#2563eb" /> Unlimited Scripts</li>
//               <li className={styles.listItem}><Zap size={16} color="#2563eb" /> AI Generation</li>
//             </ul>
//             <button className={`${styles.cardBtn} ${p.popular ? styles.popularBtn : ''}`}>
//               Choose Plan
//             </button>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
"use client";

import { Check, Zap, Rocket, Crown } from "lucide-react";
import { useEffect } from "react"; // 1. Importado useEffect

export default function PricingSection() {
  
  // 2. Hook para ativar o overlay do Lemon Squeezy
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).createLemonSqueezy) {
      (window as any).createLemonSqueezy();
    }
  }, []);

  const plans = [
    {
      name: "Starter",
      icon: <Zap size={24} className="text-blue-400" />,
      price: "9",
      credits: "15 Credits",
      description: "Perfect for trying out GenTone and creating your first scripts.",
      features: ["15 AI-Generated Scripts", "All Tones Included", "Multi-language Support", "Life-time Access"],
      buttonText: "Get Started",
      // 3. Inseri o teu link real do Starter
      checkoutUrl: "https://nedra.lemonsqueezy.com/checkout/buy/335fdcc3-79e1-4d3e-9551-186d4c7b64c3?embed=1", 
      popular: false
    },
    {
      name: "Pro Creator",
      icon: <Rocket size={24} className="text-blue-400" />,
      price: "27",
      credits: "60 Credits",
      description: "Our most popular plan for consistent content creators.",
      features: ["60 AI-Generated Scripts", "Priority AI Processing", "Advanced Tone Settings", "Commercial License", "24/7 Support"],
      buttonText: "Buy Pro Now",
      // 3. Inseri o teu link real do Pro
      checkoutUrl: "https://nedra.lemonsqueezy.com/checkout/buy/a089f67e-edbc-4cb5-8c4c-c2c71128032c?embed=1",
      popular: true
    },
    {
      name: "Elite Agency",
      icon: <Crown size={24} className="text-blue-400" />,
      price: "67",
      credits: "200 Credits",
      description: "Best value for agencies and professional YouTubers.",
      features: ["200 AI-Generated Scripts", "Early Access to New Features", "Highest Quality AI Model", "Dedicated Manager", "Unlimited History"],
      buttonText: "Go Elite",
      // 3. Inseri o teu link real do Elite
      checkoutUrl: "https://nedra.lemonsqueezy.com/checkout/buy/854fc472-42c3-4eb7-acf0-5ed1a55f3366?embed=1",
      popular: false
    }
  ];

  return (
    <section id="pricing" style={{ padding: '100px 20px', background: '#020617', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Simple, Credit-Based Pricing</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            No subscriptions. No monthly fees. Just buy the credits you need and use them whenever you want.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              style={{
                background: plan.popular ? '#0f172a' : 'transparent',
                padding: '40px',
                borderRadius: '24px',
                border: plan.popular ? '2px solid #3b82f6' : '1px solid #1e293b',
                position: 'relative',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {plan.popular && (
                <div style={{ 
                  position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                  background: '#3b82f6', color: 'white', padding: '5px 20px', borderRadius: '20px',
                  fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>{plan.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{plan.name}</h3>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                  ${plan.price}
                  <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>/one-time</span>
                </div>
                <p style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>{plan.credits}</p>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '30px', lineHeight: '1.5' }}>
                {plan.description}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', flexGrow: 1 }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                    <Check size={16} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* 4. Mudança aqui: Usamos <a> em vez de <Link> e adicionamos a classe do Lemon */}
              <a 
                href={plan.checkoutUrl}
                className="lemonsqueezy-button"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '16px',
                  background: plan.popular ? '#3b82f6' : 'white',
                  color: plan.popular ? 'white' : '#020617',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'opacity 0.2s'
                }}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Secure checkout powered by Lemon Squeezy 🍋
          </p>
        </div>
      </div>
    </section>
  );
}