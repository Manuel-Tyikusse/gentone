export default function PrivacyPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', color: '#1a1a1a', minHeight: '100vh', padding: '80px 20px', fontFamily: 'serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.8', textAlign: 'justify' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', borderBottom: '3px solid #1a1a1a', paddingBottom: '20px', marginBottom: '10px' }}>Privacy Policy</h1>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '40px' }}>Last Updated: December 21, 2025 | Version 1.1.0</p>

        <section>
          <p>
            At <strong>GenTone</strong> ("we", "our", or "us"), accessible from gentone.ink, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GenTone and how we use it. 
            This policy applies to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in GenTone.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>1. Data Collection and Sources</h2>
          <p>
            We collect information in several ways to provide and improve our AI scripting services:
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>Account Information:</strong> When you register via <strong>Clerk</strong>, we collect your unique user ID, full name, and email address.</li>
            <li><strong>Input Data:</strong> We store the topics, target audiences, and configurations you provide to generate scripts.</li>
            <li><strong>Technical Data:</strong> Our servers automatically log your IP address, browser type, device information, and timestamps of access via standard log files.</li>
            <li><strong>Transaction Data:</strong> All financial transactions are processed by <strong>Lemon Squeezy</strong>. We receive confirmation of payment but never handle or store raw credit card data or bank details.</li>
          </ul>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li>To provide, operate, and maintain the GenTone platform.</li>
            <li>To manage your credit balance and script history.</li>
            <li>To process and send scripts to the <strong>Groq API</strong> for generation (your prompts are shared with the AI model but are not used for training, according to our enterprise agreements).</li>
            <li>To communicate with you, including customer service and product updates.</li>
            <li>To detect and prevent fraudulent transactions or unauthorized access.</li>
          </ul>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>3. Data Storage and Retention</h2>
          <p>
            Your data is securely stored using <strong>MongoDB Atlas</strong> cloud infrastructure. We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. 
            If you choose to delete your account, all associated scripts and personal identifiers will be permanently purged from our active databases within 30 days, except where retention is required by law.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>4. GDPR Data Protection Rights (EU Users)</h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization.</li>
          </ul>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>5. Third-Party Service Providers</h2>
          <p>
            For the GenTone ecosystem to function, we share specific data with trusted third parties:
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Provider</th>
                <th style={{ padding: '10px' }}>Purpose</th>
                <th style={{ padding: '10px' }}>Privacy Link</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>Clerk</td>
                <td style={{ padding: '10px' }}>Authentication & Profile</td>
                <td style={{ padding: '10px' }}>clerk.com/privacy</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>Lemon Squeezy</td>
                <td style={{ padding: '10px' }}>Billing & VAT Compliance</td>
                <td style={{ padding: '10px' }}>lemonsqueezy.com/privacy</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>Groq</td>
                <td style={{ padding: '10px' }}>AI Script Generation</td>
                <td style={{ padding: '10px' }}>groq.com/privacy</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>MongoDB Atlas</td>
                <td style={{ padding: '10px' }}>Database Hosting</td>
                <td style={{ padding: '10px' }}>mongodb.com/privacy</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>6. Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. 
            We strive to use commercially acceptable means to protect your Personal Data, including SSL encryption and restricted database access.
          </p>
        </section>

        <footer style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#999', fontSize: '0.9rem' }}>
          <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our Data Protection Officer at privacy@gentone.ink</p>
        </footer>
      </div>
    </main>
  );
}