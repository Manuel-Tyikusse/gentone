import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: 'var(--bg-page)' // Usa a tua cor de fundo do CSS
    }}>
      <SignIn />
    </div>
  );
}