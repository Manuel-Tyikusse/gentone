import styles from './Navbar.module.css';
import { Video } from 'lucide-react';
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.iconBox}>
          <Video size={20} color="white" />
        </div>
        <span>GenTone</span>
      </div>

      <div className={styles.links}>
        <a href="#features" className={styles.link}>Features</a>
        <a href="#pricing" className={styles.link}>Pricing</a>
        
        {/* Novos botões de Autenticação visual */}
        <Link href="/sign-in">
          <button className={styles.signInBtn}>Sign In</button>
        </Link>

        <Link href="/sign-up">
          <button className={styles.signUpBtn}>Get Started</button>
        </Link>
      </div>
    </nav>
  );
}