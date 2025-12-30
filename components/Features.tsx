import styles from './Features.module.css';
import { Zap, Target, Clock, Globe, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Features() {
  const data = [
    { 
      icon: <Zap color="#3b82f6" />, 
      title: "Lightning Performance", 
      desc: "Powered by Llama 3.3 & Groq, get professional scripts in under 5 seconds. Speed is our DNA." 
    },
    { 
      icon: <Globe color="#3b82f6" />, 
      title: "Native Multilingual", 
      desc: "Input your ideas in any language. GenTone detects and generates scripts in Portuguese, French, Spanish, and more." 
    },
    { 
      icon: <Target color="#3b82f6" />, 
      title: "Audience Precision", 
      desc: "Tailor your content for Gen Z, corporate executives, or students with our deep audience targeting." 
    },
    { 
      icon: <MessageSquare color="#3b82f6" />, 
      title: "15+ Tones of Voice", 
      desc: "From 'Professional' to 'Sarcastic' or 'Luxury'. Every script matches your brand's unique personality." 
    },
    { 
      icon: <Clock color="#3b82f6" />, 
      title: "Flexible Formats", 
      desc: "Seamlessly create 30-second TikTok hooks or 30-minute deep-dive YouTube documentaries." 
    },
    { 
      icon: <ShieldCheck color="#3b82f6" />, 
      title: "Commercial Rights", 
      desc: "You own every word. All generated scripts include a commercial license for monetization and ads." 
    }
  ];

  return (
    <section id="features" className={styles.section} style={{ padding: '100px 20px', background: '#020617' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ 
          fontSize: '2.8rem', 
          fontWeight: 'bold', 
          color: 'white',
          marginBottom: '15px' 
        }}>
          Engineered for Modern Creators
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          Stop wasting hours on drafts. GenTone combines the world's fastest AI with expert copywriting frameworks.
        </p>
      </div>

      <div className={styles.grid}>
        {data.map((item, i) => (
          <div key={i} className={styles.card} style={{
            background: '#0f172a',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid #1e293b',
            transition: '0.3s'
          }}>
            <div className={styles.iconWrapper} style={{ 
              marginBottom: '20px',
              background: 'rgba(59, 130, 246, 0.1)',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}>
              {item.icon}
            </div>
            <h3 className={styles.cardTitle} style={{ color: 'white', fontSize: '1.3rem', marginBottom: '12px' }}>
              {item.title}
            </h3>
            <p className={styles.cardDesc} style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}