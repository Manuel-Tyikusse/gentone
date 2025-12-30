import Link from 'next/link';

export default function HelpCenter() {
  const categories = [
    {
      title: "Getting Started",
      articles: [
        { q: "How to generate your first script?", a: "Go to your Dashboard, enter a topic, select a tone and duration, and click 'Generate'. It's that simple!" },
        { q: "What are credits?", a: "Credits are the currency of GenTone. 1 credit = 1 script generation. You start with 10 free credits." }
      ]
    },
    {
      title: "Credits & Payments",
      articles: [
        { q: "Do my credits expire?", a: "No. Once purchased or earned, your credits stay in your account forever until you use them." },
        { q: "Is the payment secure?", a: "Yes, all payments are handled by Lemon Squeezy with bank-grade encryption." }
      ]
    },
    {
      title: "Technical Questions",
      articles: [
        { q: "Which languages are supported?", a: "GenTone is multilingual. It automatically detects and writes in the language you provide in the topic." },
        { q: "Can I edit my scripts?", a: "Yes! You can copy the script to your clipboard and edit it in any text editor or directly in your video software." }
      ]
    }
  ];

  return (
    <main style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Help Center</h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Everything you need to know about GenTone.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ background: '#0f172a', padding: '25px', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <h2 style={{ color: '#3b82f6', fontSize: '1.2rem', marginBottom: '20px' }}>{cat.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cat.articles.map((art, j) => (
                  <div key={j}>
                    <h4 style={{ fontSize: '1rem', color: '#f1f5f9', marginBottom: '5px' }}>{art.q}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.5' }}>{art.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center', padding: '40px', borderTop: '1px solid #1e293b' }}>
          <p>Still have questions?</p>
          <Link href="/contact" style={{ 
            display: 'inline-block', marginTop: '15px', padding: '12px 25px', 
            background: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' 
          }}>
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}