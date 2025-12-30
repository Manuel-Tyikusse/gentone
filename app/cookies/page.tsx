export default function CookiesPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', color: '#1a1a1a', minHeight: '100vh', padding: '80px 20px', fontFamily: 'serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.8', textAlign: 'justify' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', borderBottom: '3px solid #1a1a1a', paddingBottom: '20px', marginBottom: '10px' }}>Cookie Policy</h1>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '40px' }}>Last Updated: December 21, 2025 | Version 1.0.2</p>

        <section>
          <p>
            This Cookie Policy explains how <strong>GenTone</strong> ("Company", "we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website at gentone.ink. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>1. What are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information. 
            Cookies set by the website owner are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies".
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>2. Why we use Cookies</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Services to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our online properties.
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>3. Types of Cookies we use</h2>
          
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>A. Strictly Necessary Cookies (Authentication)</h3>
            <p>
              These cookies are strictly necessary to provide you with services available through our Website. We use <strong>Clerk</strong> for user authentication. Clerk sets cookies to securely identify your session and ensure that only you can access your private dashboard and script history.
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>B. Functional & Payment Cookies</h3>
            <p>
              These cookies are used to enhance the performance and functionality of our Website but are non-essential to its use. However, without these cookies, certain functionality like payments via <strong>Lemon Squeezy</strong> may become unavailable. These cookies help track your checkout progress and prevent fraudulent transactions.
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>C. Security & Analytics</h3>
            <p>
              We use security cookies to help identify and prevent potential security risks. For example, we use these cookies to store your session information to prevent others from changing your password without your username and password.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>4. Third-Party Cookies on GenTone</h2>
          <p>In addition to our own cookies, the following third parties may place cookies on your computer:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>Clerk:</strong> For session management and secure login (clerk.com).</li>
            <li><strong>Lemon Squeezy:</strong> For processing payments and VAT compliance (lemonsqueezy.com).</li>
            <li><strong>Vercel:</strong> For traffic analysis and platform stability (vercel.com).</li>
          </ul>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>5. How can I control Cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website (like the Dashboard) will be restricted.
          </p>
          <p style={{ marginTop: '10px' }}>
            To learn more about how to manage cookies on popular browsers:
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li>Google Chrome</li>
            <li>Internet Explorer / Edge</li>
            <li>Firefox</li>
            <li>Safari</li>
          </ul>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>6. Updates to this Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please, therefore, re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>
        </section>

        <footer style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#999', fontSize: '0.9rem' }}>
          <p>For further information on our cookie usage, please contact us at compliance@gentone.ink</p>
        </footer>
      </div>
    </main>
  );
}