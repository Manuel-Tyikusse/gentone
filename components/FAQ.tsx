"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do the credits work?",
      answer: "GenTone works on a pay-as-you-go basis. 1 credit = 1 complete script generation. When you buy a pack, those credits are added to your account and never expire as long as your account is active."
    },
    {
      question: "Do I really have commercial rights to the scripts?",
      answer: "Yes! Once a script is generated, you own the content. You can use it for monetized YouTube channels, client work, or paid advertisements without any additional fees."
    },
    {
      question: "Which languages does GenTone support?",
      answer: "Our AI is natively multilingual. It automatically detects the language of your topic and generates the script in that same language. It works perfectly with Portuguese, English, French, Spanish, German, and many others."
    },
    {
      question: "Can I cancel a subscription?",
      answer: "There's nothing to cancel! GenTone is not a subscription service. You only pay when you need more credits, meaning no surprise charges on your credit card."
    },
    {
      question: "How long are the generated scripts?",
      answer: "You can choose the duration! Whether you need a quick 30-second script for TikTok/Reels or a detailed 20-minute script for a long-form YouTube documentary, our AI adjusts the depth and pacing accordingly."
    },
    {
      question: "Is the payment secure?",
      answer: "Absolutely. All payments are processed by Dodo Payments, a world leader in secure software payments. We never store or even see your credit card information."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" style={{ padding: '100px 20px', background: '#020617', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Frequently Asked Questions</h2>
          <p style={{ color: '#94a3b8' }}>Everything you need to know about GenTone.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              onClick={() => toggle(i)}
              style={{ 
                background: '#0f172a', 
                borderRadius: '16px', 
                border: '1px solid #1e293b', 
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                padding: '20px 25px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                <span style={{ color: openIndex === i ? '#3b82f6' : 'white' }}>{faq.question}</span>
                {openIndex === i ? <ChevronUp size={20} color="#3b82f6" /> : <ChevronDown size={20} color="#64748b" />}
              </div>
              
              <div style={{ 
                maxHeight: openIndex === i ? '200px' : '0',
                opacity: openIndex === i ? 1 : 0,
                padding: openIndex === i ? '0 25px 25px 25px' : '0 25px',
                color: '#94a3b8',
                lineHeight: '1.6',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}