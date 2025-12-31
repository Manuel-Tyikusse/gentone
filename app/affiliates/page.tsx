"use client";

import Link from "next/link";
import { Zap, DollarSign, Users, BarChart3, ArrowRight, Globe, ShieldCheck } from "lucide-react";

export default function AffiliatesPage() {
  const signupLink = "https://nedra.lemonsqueezy.com/affiliates";

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Simple Navbar */}
      <nav style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', textDecoration: 'none' }}>GenTone</Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
           <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <Globe size={14} /> GLOBAL AFFILIATE PROGRAM
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '800', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
          Partner with GenTone & <span style={{ color: '#3b82f6' }}>Earn 30%</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Promote the next generation of AI scriptwriting. Get recurring commissions for every creator you bring to our platform.
        </p>
        <Link 
          href={signupLink}
          target="_blank"
          style={{ 
            background: '#2563eb', color: 'white', padding: '20px 40px', borderRadius: '12px', 
            fontSize: '1.1rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 10px 20px -10px rgba(37, 99, 235, 0.5)'
          }}
        >
          Join Program Now <ArrowRight size={20} />
        </Link>
      </section>

      {/* Key Benefits */}
      <section style={{ padding: '80px 20px', background: '#0f172a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <div className="benefit-card">
            <div className="icon-box"><DollarSign size={24} color="#3b82f6" /></div>
            <h3>30% Recurring Commission</h3>
            <p>Don't just get paid once. Earn every single month for as long as your referrals stay subscribed.</p>
          </div>

          <div className="benefit-card">
            <div className="icon-box"><BarChart3 size={24} color="#3b82f6" /></div>
            <h3>Real-time Analytics</h3>
            <p>Access your personal dashboard to track clicks, conversions, and pending payouts in real-time.</p>
          </div>

          <div className="benefit-card">
            <div className="icon-box"><ShieldCheck size={24} color="#3b82f6" /></div>
            <h3>60-Day Cookie Window</h3>
            <p>We use long-term cookies. If they click your link and buy within 60 days, the commission is yours.</p>
          </div>

        </div>
      </section>

      {/* Simple 3-Step Process */}
      <section style={{ padding: '100px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '60px' }}>How it works</h2>
        
        <div className="steps-container">
          <div className="step-item">
            <span className="step-circle">1</span>
            <div>
              <h4>Sign Up</h4>
              <p>Register via Lemon Squeezy. It takes less than 2 minutes to get approved.</p>
            </div>
          </div>

          <div className="step-item">
            <span className="step-circle">2</span>
            <div>
              <h4>Spread the word</h4>
              <p>Use your unique link on YouTube, TikTok, Blogs, or Twitter to showcase GenTone's power.</p>
            </div>
          </div>

          <div className="step-item">
            <span className="step-circle">3</span>
            <div>
              <h4>Get Paid</h4>
              <p>Commissions are paid out automatically every month directly to your account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <footer style={{ padding: '100px 20px', textAlign: 'center', borderTop: '1px solid #1e293b', background: 'linear-gradient(to bottom, #020617, #0f172a)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Ready to grow with GenTone?</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Start earning from the first day.</p>
        <Link href={signupLink} target="_blank" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Become an Affiliate today <Zap size={20} fill="#3b82f6" />
        </Link>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .benefit-card { background: #020617; padding: 40px; border-radius: 20px; border: 1px solid #1e293b; transition: all 0.3s ease; }
        .benefit-card:hover { border-color: #3b82f6; transform: translateY(-8px); box-shadow: 0 20px 40px -20px rgba(59, 130, 246, 0.3); }
        .benefit-card h3 { margin: 20px 0 12px 0; font-size: 1.4rem; font-weight: bold; }
        .benefit-card p { color: #94a3b8; line-height: 1.6; font-size: 1rem; margin: 0; }
        .icon-box { background: rgba(59, 130, 246, 0.1); width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        
        .steps-container { display: flex; flex-direction: column; gap: 40px; }
        .step-item { display: flex; gap: 24px; align-items: center; background: #0f172a; padding: 25px; border-radius: 16px; border: 1px solid #1e293b; }
        .step-circle { background: #3b82f6; color: white; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0; font-size: 1.2rem; }
        .step-item h4 { margin: 0 0 4px 0; font-size: 1.3rem; font-weight: bold; }
        .step-item p { color: #94a3b8; margin: 0; font-size: 1.1rem; }

        @media (max-width: 768px) {
          nav { padding: 20px; }
          .step-item { flex-direction: column; text-align: center; }
        }
      `}} />
    </div>
  );
}