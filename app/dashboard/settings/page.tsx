"use client";

import styles from "../dashboard.module.css";
import { LayoutDashboard, History, Settings } from "lucide-react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <h2 className={styles.sidebarLogo}>ScriptAI</h2>
          <nav className={styles.sidebarNav}>
            <Link href="/dashboard" className={styles.navItem}>
              <LayoutDashboard size={20}/> <span>Gerador</span>
            </Link>
            <Link href="/dashboard/history" className={styles.navItem}>
              <History size={20}/> <span>Histórico</span>
            </Link>
            <Link href="/dashboard/settings" className={styles.navItemActive}>
              <Settings size={20}/> <span>Definições</span>
            </Link>
          </nav>
        </div>

        <div className={styles.sidebarFooter} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
          <UserButton afterSignOutUrl="/" />
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{user?.firstName || "Utilizador"}</span>
            <span style={{ fontSize: '11px', opacity: 0.6 }}>Plano Free</span>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header>
          <h1 className={styles.title}>Definições</h1>
          <p className={styles.subtitle}>Gerencie sua conta e preferências de uso.</p>
        </header>
        <div className={styles.card}>
          <p>Configurações de perfil e créditos.</p>
        </div>
      </main>
    </div>
  );
}