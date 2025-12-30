import styles from './Hero.module.css';
import { Sparkles, PlayCircle, ArrowRight } from 'lucide-react';
import Link from "next/link";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Badge de Tecnologia */}
      <div className={styles.badge}>
        <Sparkles size={14} style={{ color: '#3b82f6' }} />
        <span>Next-Gen Llama 3.3 Intelligence</span>
      </div>

      {/* Título Principal (Impactante) */}
      <h1 className={styles.title}>
        From Idea to Full Script <br />
        <span style={{ 
          background: 'linear-gradient(to right, #64748b, #3b82f6)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          In Under 5 Seconds
        </span>
      </h1>

      {/* Subtítulo (Focado no Valor) */}
      <p className={styles.subtitle}>
        The elite AI scriptwriter for creators who value their time. 
        High-retention scripts for YouTube, TikTok, and Instagram in any language.
      </p>

      {/* Botões de Ação */}
      <div className={styles.actions}>
        <Link href="/sign-up" style={{ textDecoration: 'none' }}>
          <button className={styles.primaryBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Start Creating Free <ArrowRight size={18} />
          </button>
        </Link>
        
        <Link href="#demo" style={{ textDecoration: 'none' }}>
          <button className={styles.secondaryBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlayCircle size={18} /> Watch Demo
          </button>
        </Link>
      </div>

      {/* Micro-Copy de Confiança */}
      <p style={{ marginTop: '20px', color: '#475569', fontSize: '0.85rem' }}>
        🎁 <strong>10 Free Credits</strong> included upon sign up. No credit card required.
      </p>
    </section>
  );
}