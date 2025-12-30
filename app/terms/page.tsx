export default function TermsPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', color: '#1a1a1a', minHeight: '100vh', padding: '80px 20px', fontFamily: 'serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.8', textAlign: 'justify' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', borderBottom: '3px solid #1a1a1a', paddingBottom: '20px', marginBottom: '10px' }}>Terms of Service</h1>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '40px' }}>Effective Date: December 21, 2025 | Version 1.0.4</p>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>1. Contractual Relationship</h2>
          <p>
            These Terms of Service ("Terms") govern the access or use by you, an individual, from within any country in the world of applications, websites, content, products, and services made available by <strong>GenTone</strong>. 
            PLEASE READ THESE TERMS CAREFULLY BEFORE ACCESSING OR USING THE SERVICES. Your access and use of the Services constitute your agreement to be bound by these Terms, which establish a contractual relationship between you and GenTone.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>2. The Services</h2>
          <p>
            GenTone provides a specialized platform utilizing advanced Artificial Intelligence (AI) and Large Language Models (LLMs) to facilitate the creation of narrative structures and scripts for digital content. 
            <strong> Limitation of AI Output:</strong> You acknowledge that AI-generated content can occasionally be inaccurate, biased, or produce offensive material. GenTone does not represent or warrant that the scripts generated will be free of errors, copyright-infringement-free by nature of the LLM training, or suitable for any specific purpose.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>3. User Accounts and Eligibility</h2>
          <p>
            In order to use most aspects of the Services, you must register for and maintain an active personal user Services account ("Account"). You must be at least 18 years of age, or the age of legal majority in your jurisdiction, to obtain an Account. 
            Account registration requires you to submit to GenTone certain personal information via Clerk (third-party authentication provider). You are responsible for all activity that occurs under your Account.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>4. Credits and Financial Terms</h2>
          <p>
            GenTone operates on a non-subscription, credit-based model. 
            <strong>4.1 Credits:</strong> Credits are digital units that grant you access to a specific number of AI generations. Credits have no monetary value and do not constitute personal property. 
            <strong>4.2 Non-Refundable Policy:</strong> Due to the immediate consumption of resources (API costs) upon script generation, all credit purchases via Lemon Squeezy are final and non-refundable. 
            <strong>4.3 Expiration:</strong> Unless otherwise stated at the time of purchase, credits do not expire as long as your account remains active. However, GenTone reserves the right to cancel unused credits if an account is inactive for more than 12 consecutive months.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>5. User Conduct and Restrictions</h2>
          <p>
            You agree not to use the Service to:
            <ul>
              <li>Generate content that promotes illegal activities, violence, or hate speech.</li>
              <li>Attempt to "jailbreak" or reverse-engineer the prompt engineering logic of GenTone.</li>
              <li>Automate the Service using bots, scrapers, or any unauthorized software.</li>
              <li>Infringe upon the intellectual property rights of third parties.</li>
            </ul>
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>6. Intellectual Property & Commercial License</h2>
          <p>
            Subject to your compliance with these Terms, GenTone grants you a limited, non-exclusive, non-sublicensable, revocable, non-transferable license to use the generated scripts for your personal or commercial projects. 
            You represent and warrant that you will perform your own due diligence regarding the uniqueness and legality of the generated content before publishing or monetizing it.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>7. Disclaimers; Limitation of Liability</h2>
          <p>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." GENTONE DISCLAIMS ALL REPRESENTATIONS AND WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, NOT EXPRESSLY SET OUT IN THESE TERMS. 
            GENTONE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR PROPERTY DAMAGE RELATED TO, IN CONNECTION WITH, OR OTHERWISE RESULTING FROM ANY USE OF THE SERVICES.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>8. Governing Law</h2>
          <p>
            Except as otherwise set forth in these Terms, these Terms shall be exclusively governed by and construed in accordance with the laws of the jurisdiction in which GenTone's principal founder operates, without regard to its conflict of law principles.
          </p>
        </section>

        <footer style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#999', fontSize: '0.9rem' }}>
          <p>For any questions regarding these Terms, please contact support@gentone.ink</p>
        </footer>
      </div>
    </main>
  );
}