import styles from './Footer.module.css';
import { Video, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import Link from 'next/link'; // Importante para navegação interna no Next.js

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand and Social Media */}
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <div style={{ backgroundColor: '#2563eb', padding: '6px', borderRadius: '6px', display: 'flex' }}>
              <Video size={18} color="white" />
            </div>
            <span>GenTone</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#94a3b8' }}>
            Transforming your ideas into professional video scripts in seconds with AI power.
          </p>
          <div className={styles.socialIcons}>
            <Link href="https://instagram.com/gentoneai" className={styles.socialLink} target="_blank"><Instagram size={20} /></Link>
            <Link href="https://facebook.com/profile.php?id=61585573574868" className={styles.socialLink} target="_blank"><Facebook size={20} /></Link>
            <Link href="https://twitter.com" className={styles.socialLink} target="_blank"><Twitter size={20} /></Link>
            <Link href="https://wa.me/244933269713" className={styles.socialLink} target="_blank"><MessageCircle size={20} /></Link>
          </div>
        </div>

        {/* Support Links */}
        <div>
          <h4 className={styles.columnTitle}>Support</h4>
          <ul className={styles.linkList}>
            <li><Link href="/help" className={styles.link}>Help Center</Link></li>
            <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
            <li><Link href="mailto:support@gentone.com" className={styles.link}>Support Email</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className={styles.columnTitle}>Legal</h4>
          <ul className={styles.linkList}>
            {/* Estes links agora apontam para as páginas que criámos */}
            <li><Link href="/terms" className={styles.link}>Terms of Service</Link></li>
            <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
            <li><Link href="/cookies" className={styles.link}>Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© 2025 GenTone. All rights reserved. Built for creators.</p>
      </div>
    </footer>
  );
}