// "use client";

// import { useState, useEffect } from "react";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { getUserProfile, generateScriptAction } from "@/app/actions/script-actions";
// import { Loader2, Sparkles, Users, type LucideIcon } from "lucide-react";
// import ReactMarkdown from 'react-markdown';

// export default function DashboardPage() {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [credits, setCredits] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [script, setScript] = useState("");

//   useEffect(() => {
//     async function loadData() {
//       if (isLoaded && isSignedIn) {
//         const res = await getUserProfile();
//         if (res.success) setCredits(res.credits);
//       }
//     }
//     loadData();
//   }, [isLoaded, isSignedIn]);

//   async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData(e.currentTarget);
    
//     const data = {
//       topic: formData.get("topic") as string,
//       tone: formData.get("tone") as string,
//       duration: formData.get("duration") as string,
//       targetAudience: formData.get("targetAudience") as string // Adicionado!
//     };

//     const res = await generateScriptAction(data);
//     if (res.success) {
//       setScript(res.content || "");
//       const profile = await getUserProfile();
//       if (profile.success) setCredits(profile.credits);
//     }
//     setLoading(false);
//   }

//   if (!isLoaded) return <div style={{padding: '40px', color: 'white'}}>Iniciando GenTone...</div>;

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: 'white', fontFamily: 'sans-serif' }}>
      
//       {/* Sidebar Lateral */}
//       <aside style={{ width: '260px', borderRight: '1px solid #1e293b', padding: '30px', display: 'flex', flexDirection: 'column' }}>
//         <h2 style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px' }}>GenTone</h2>
//         <UserButton afterSignOutUrl="/" />
//         <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
//           <p style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 'bold', textTransform: 'uppercase' }}>Créditos</p>
//           <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{credits ?? '...'}</p>
//         </div>
//       </aside>

//       {/* Área Principal */}
//       <main style={{ flex: 1, padding: '50px', overflowY: 'auto' }}>
//         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//           <div style={{ marginBottom: '40px' }}>
//             <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Olá, {user?.firstName}!</h1>
//             <p style={{ color: '#94a3b8' }}>Preencha os detalhes abaixo para criar o seu roteiro.</p>
//           </div>

//           <form onSubmit={handleGenerate} style={{ background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
            
//             {/* Tema */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Tema do Vídeo</label>
//               <input 
//                 name="topic" 
//                 required 
//                 placeholder="Ex: 5 dicas para crescer no Instagram"
//                 style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white', outline: 'none' }}
//               />
//             </div>

//             {/* Público Alvo - ADICIONADO AQUI */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Público Alvo</label>
//               <input 
//                 name="targetAudience" 
//                 required 
//                 placeholder="Ex: Empreendedores iniciantes, Estudantes, Cozinheiros..."
//                 style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white', outline: 'none' }}
//               />
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Tom de Voz</label>
//                 <select name="tone" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white' }}>
//                   <option value="Profissional">Profissional</option>
//                   <option value="Engraçado">Engraçado</option>
//                   <option value="Informativo">Informativo</option>
//                   <option value="Persuasivo">Persuasivo</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>Duração Estimada</label>
//                 <select name="duration" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white' }}>
//                   <option value="60 segundos">60 segundos (Shorts/Reels)</option>
//                   <option value="5 minutos">5 minutos</option>
//                   <option value="10 minutos">10 minutos</option>
//                 </select>
//               </div>
//             </div>

//             <button 
//               type="submit" 
//               disabled={loading || (credits !== null && credits <= 0)}
//               style={{ 
//                 width: '100%', padding: '16px', background: '#2563eb', color: 'white', 
//                 borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
//                 opacity: loading ? 0.7 : 1
//               }}
//             >
//               {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} /> : <><Sparkles size={18} /> Gerar Roteiro Profissional</>}
//             </button>
//           </form>

//           {/* Resultado da IA */}
//           {script && (
//             <div style={{ marginTop: '40px', background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #3b82f6' }}>
//               <h3 style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <Sparkles size={20} /> Roteiro Gerado pelo GenTone:
//               </h3>
//               <div style={{ lineHeight: '1.6', color: '#e2e8f0' }}>
//                 <ReactMarkdown>{script}</ReactMarkdown>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <style jsx global>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { getUserProfile, generateScriptAction } from "@/app/actions/script-actions";
// import { Loader2, Sparkles, AlertCircle } from "lucide-react";
// import ReactMarkdown from 'react-markdown';


// export default function DashboardPage() {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [credits, setCredits] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [script, setScript] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");

//   useEffect(() => {
//     async function loadData() {
//       if (isLoaded && isSignedIn) {
//         const res = await getUserProfile();
//         if (res.success) setCredits(res.credits);
//       }
//     }
//     loadData();
//   }, [isLoaded, isSignedIn]);

//   async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);
//     setScript("");
//     setStatusMessage("A ligar à IA da Groq...");

//     const formData = new FormData(e.currentTarget);
//     const data = {
//       topic: formData.get("topic") as string,
//       tone: formData.get("tone") as string,
//       duration: formData.get("duration") as string,
//       targetAudience: formData.get("targetAudience") as string
//     };

//     try {
//       const res = await generateScriptAction(data);
      
//       if (res.success && res.content) {
//         setScript(res.content);
//         setStatusMessage(""); // Limpa a mensagem de espera
        
//         // Atualiza os créditos após gerar
//         const profile = await getUserProfile();
//         if (profile.success) setCredits(profile.credits);
//       } else {
//         // Se a IA der erro, mostramos aqui
//         setStatusMessage(`Erro: ${res.error || "A IA não conseguiu gerar o texto"}`);
//       }
//     } catch (err) {
//       setStatusMessage("Erro de rede: Certifica-te que o servidor está a correr.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!isLoaded) return <div style={{padding: '40px', color: 'white'}}>A carregar GenTone...</div>;

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: 'white', fontFamily: 'sans-serif' }}>
      
//       {/* Sidebar */}
//       <aside style={{ width: '260px', borderRight: '1px solid #1e293b', padding: '30px' }}>
//         <h2 style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px' }}>GenTone</h2>
//         <UserButton afterSignOutUrl="/" />
//         <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
//           <p style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Créditos Disponíveis</p>
//           <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{credits ?? '...'}</p>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main style={{ flex: 1, padding: '50px', overflowY: 'auto' }}>
//         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
//           <form onSubmit={handleGenerate} style={{ background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
//             <h2 style={{marginBottom: '20px'}}>Novo Roteiro</h2>
            
//             <input name="topic" required placeholder="Sobre o que é o vídeo?" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white' }} />
//             <input name="targetAudience" required placeholder="Para quem é o vídeo? (Ex: Estudantes)" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white' }} />
            
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//               <select name="tone" style={{ padding: '12px', borderRadius: '8px', background: '#020617', color: 'white', border: '1px solid #334155' }}>
//                 <option value="Profissional">👔 Profissional</option>
//                 <option value="Engraçado">😂 Engraçado</option>
//                 <option value="Informativo">💡 Informativo</option>
//               </select>
//               <select name="duration" style={{ padding: '12px', borderRadius: '8px', background: '#020617', color: 'white', border: '1px solid #334155' }}>
//                 <option value="60 segundos">📱 60 segundos</option>
//                 <option value="5 minutos">🎥 5 minutos</option>
//               </select>
//             </div>

//             <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
//               {loading ? <Loader2 style={{animation: 'spin 1s linear infinite'}} /> : <><Sparkles size={18}/> Gerar Roteiro</>}
//             </button>
//           </form>

//           {/* Mensagem de Espera ou Erro */}
//           {statusMessage && !script && (
//             <div style={{ marginTop: '20px', padding: '15px', background: '#1e293b', borderRadius: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <AlertCircle size={18} /> {statusMessage}
//             </div>
//           )}

//           {/* ONDE O ROTEIRO APARECE */}
//           {script && (
//             <div style={{ marginTop: '40px', background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #3b82f6', lineHeight: '1.6' }}>
//               <h3 style={{ color: '#60a5fa', marginBottom: '20px', fontWeight: 'bold' }}>✨ Roteiro Gerado:</h3>
//               <div style={{ color: '#e2e8f0' }}>
//                 <ReactMarkdown>{script}</ReactMarkdown>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <style jsx global>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { getUserProfile, generateScriptAction } from "@/app/actions/script-actions";
// import { Loader2, Sparkles, AlertCircle, History } from "lucide-react"; 
// import ReactMarkdown from 'react-markdown';
// import Link from "next/link";
// import CopyButton from "@/components/CopyButton"; // IMPORTADO AQUI

// export default function DashboardPage() {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [credits, setCredits] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [script, setScript] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");

//   useEffect(() => {
//     async function loadData() {
//       if (isLoaded && isSignedIn) {
//         const res = await getUserProfile();
//         if (res.success) setCredits(res.credits);
//       }
//     }
//     loadData();
//   }, [isLoaded, isSignedIn]);

//   async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);
//     setScript("");
//     setStatusMessage("Connecting to AI...");

//     const formData = new FormData(e.currentTarget);
//     const data = {
//       topic: formData.get("topic") as string,
//       tone: formData.get("tone") as string,
//       duration: formData.get("duration") as string,
//       targetAudience: formData.get("targetAudience") as string
//     };

//     try {
//       const res = await generateScriptAction(data);
//       if (res.success && res.content) {
//         setScript(res.content);
//         setStatusMessage(""); 
//         const profile = await getUserProfile();
//         if (profile.success) setCredits(profile.credits);
//       } else {
//         setStatusMessage(`Erro: ${res.error || "Could not generate the text"}`);
//       }
//     } catch (err) {
//       setStatusMessage("Network Error: Check your internet connection.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!isLoaded) return <div style={{padding: '40px', color: 'white'}}>Loading GenTone...</div>;

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: 'white', fontFamily: 'sans-serif' }}>
      
//       {/* Sidebar */}
//       <aside style={{ width: '260px', borderRight: '1px solid #1e293b', padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
//         <h2 style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>GenTone</h2>
        
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//           <UserButton afterSignOutUrl="/" />
//           <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Active Account</span>
//         </div>

//         <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
//             <p style={{ fontSize: '0.7rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Credits</p>
//             <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>{credits ?? '0'}</p>
//           </div>

//           <Link href="/dashboard/history" style={{ 
//             display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', textDecoration: 'none',
//             padding: '12px', borderRadius: '10px', background: '#0f172a', fontSize: '0.9rem', transition: '0.2s', border: '1px solid #1e293b'
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
//           onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
//           >
//             <History size={18} color="#60a5fa" />
//             Historic
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main style={{ flex: 1, padding: '50px', overflowY: 'auto' }}>
//         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
//           <div style={{ marginBottom: '40px' }}>
//             <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
//               Olá, {user?.firstName || "Criador"}! 👋
//             </h1>
//             <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
//               What do you whish to create today?
//             </p>
//           </div>
          
//           <form onSubmit={handleGenerate} style={{ background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
//             <h2 style={{marginBottom: '20px', fontSize: '1.2rem', color: '#f1f5f9'}}>Lets Create</h2>
//             <p style={{ color: '#94a3b8' }}>Fill out all the details below to generate the script.</p>
//             <input name="topic" required placeholder="What is the video about?" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white' }} />
//             <input name="targetAudience" required placeholder="Who is the video for? (Eg: Students)" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: 'white' }} />
            
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//               <select name="tone" style={{ padding: '12px', borderRadius: '8px', background: '#020617', color: 'white', border: '1px solid #334155' }}>
//                 <option value="Profissional">👔 Profissional</option>
//                 <option value="Funny">😂 Funny</option>
//                 <option value="Informative">💡 Informative</option>
//               </select>
//               <select name="duration" style={{ padding: '12px', borderRadius: '8px', background: '#020617', color: 'white', border: '1px solid #334155' }}>
//                 <option value="30 seconds">📱 30 seconds</option>
//                 <option value="60 seconds">🎥 60 seconds</option>
//                 <option value="1,5 minutes">📱 1,5 minutes</option>
//                 <option value="2 minutes">🎥 2 minutes</option>
//                 <option value="2,5 minutes">📱 2,5 minutes</option>
//                 <option value="3 minutes">🎥 3 minutes</option>
//                 <option value=" 5 minutes">📱 5 minutes</option>
//                 <option value="10 minutes">🎥 10 minutes</option>
//                 <option value="15 minutes">📱 15 minutes</option>
//                 <option value="20 minutes">🎥 20 minutes</option>
//                 <option value="25 minutes">📱 25 minutes</option>
//                 <option value="30 minutes">🎥 30 minutes</option>
//               </select>
//             </div>
//             <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
//               {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18}/> Gerar Roteiro</>}
//             </button>
//           </form>

//           {statusMessage && !script && (
//             <div style={{ marginTop: '20px', padding: '15px', background: '#1e293b', borderRadius: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <AlertCircle size={18} /> {statusMessage}
//             </div>
//           )}

//           {/* ÁREA DO ROTEIRO COM BOTÃO DE COPIAR */}
//           {script && (
//             <div style={{ marginTop: '40px', background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #3b82f6', lineHeight: '1.6' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                 <h3 style={{ color: '#60a5fa', fontWeight: 'bold', margin: 0 }}>✨ Roteiro Gerado:</h3>
//                 <CopyButton text={script} /> {/* ADICIONADO AQUI */}
//               </div>
              
//               <div style={{ color: '#e2e8f0', background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
//                 <ReactMarkdown>{script}</ReactMarkdown>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <style jsx global>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         .animate-spin { animation: spin 1s linear infinite; }
//       `}</style>
//     </div>
//   );

"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { getUserProfile, generateScriptAction } from "@/app/actions/script-actions";
import { Loader2, Sparkles, AlertCircle, History, Zap, Menu, X } from "lucide-react"; 
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Para mobile menu

  useEffect(() => {
    async function loadData() {
      if (isLoaded && isSignedIn) {
        const res = await getUserProfile();
        if (res.success) setCredits(res.credits);
      }
    }
    loadData();
  }, [isLoaded, isSignedIn]);

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (credits !== null && credits <= 0) {
      setStatusMessage("You have no credits left. Please upgrade your plan.");
      return;
    }
    setLoading(true);
    setScript("");
    setStatusMessage("Connecting to GenTone AI...");
    const formData = new FormData(e.currentTarget);
    const data = {
      topic: formData.get("topic") as string,
      tone: formData.get("tone") as string,
      duration: formData.get("duration") as string,
      targetAudience: formData.get("targetAudience") as string
    };
    try {
      const res = await generateScriptAction(data);
      if (res.success && res.content) {
        setScript(res.content);
        setStatusMessage(""); 
        const profile = await getUserProfile();
        if (profile.success) setCredits(profile.credits);
      } else {
        setStatusMessage(`Error: ${res.error || "Could not generate the text"}`);
      }
    } catch (err) {
      setStatusMessage("Network Error: Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) return <div style={{padding: '40px', color: 'white'}}>Loading GenTone...</div>;
  const hasNoCredits = credits !== null && credits <= 0;

  return (
    <div className="dashboard-container">
      
      {/* Mobile Header (Apenas visível em telemóveis) */}
      <div className="mobile-header">
        <h2 style={{ color: '#3b82f6', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>GenTone</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 className="sidebar-logo">GenTone</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <UserButton afterSignOutUrl="/" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 'bold' }}>{user?.firstName || "Creator"}</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{credits !== null && credits > 10 ? "Pro Plan" : "Free Plan"}</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <p style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em', margin: 0 }}>Available Credits</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', margin: '4px 0' }}>{credits ?? '0'}</p>
            
            <Link href="/dashboard/pricing" style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '10px', padding: '10px', background: '#2563eb', borderRadius: '8px',
              color: 'white', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold'
            }}>
              <Zap size={14} fill="currentColor" /> Upgrade
            </Link>
          </div>

          <Link href="/dashboard/history" style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', textDecoration: 'none',
            padding: '12px', borderRadius: '10px', background: '#0f172a', fontSize: '0.9rem', border: '1px solid #1e293b'
          }}>
            <History size={18} color="#60a5fa" /> History
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="welcome-section">
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 'bold', marginBottom: '8px' }}>
              Welcome, {user?.firstName || "Creator"}! 👋
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>
              What kind of magic are we scripting today?
            </p>
          </div>
          
          <form onSubmit={handleGenerate} className="glass-form">
            <h2 style={{marginBottom: '20px', fontSize: '1.1rem', color: '#f1f5f9'}}>Script Configuration</h2>
            
            <div className="input-group">
              <label>Video Topic</label>
              <input name="topic" required placeholder="Ex: 5 healthy habits for morning routines" />
            </div>

            <div className="input-group">
              <label>Target Audience</label>
              <input name="targetAudience" required placeholder="Ex: Busy professionals..." />
            </div>
            
            <div className="input-group">
              <label>Tone of Voice</label>
              <select name="tone">
                <optgroup label="Standard & Professional" style={{ background: '#0f172a' }}>
                  <option value="Professional">👔 Professional & Formal</option>
                  <option value="Conversational">💬 Conversational (Friendly)</option>
                  <option value="Informative">💡 Clear & Informative</option>
                  <option value="Authoritative">⚖️ Authoritative & Expert</option>
                </optgroup>
                <optgroup label="Engagement & Hype" style={{ background: '#0f172a' }}>
                  <option value="High Energy">🔥 High Energy / Hype</option>
                  <option value="Motivational">🚀 Motivational & Inspiring</option>
                  <option value="Persuasive">🎯 Sales & Persuasive (VSL)</option>
                  <option value="Urgent">🚨 Urgent / Breaking News</option>
                  <option value="Trendy">✨ Gen-Z / Trendy Slang</option>
                </optgroup>
                <optgroup label="Entertainment & Storytelling" style={{ background: '#0f172a' }}>
                  <option value="Funny">😂 Funny & Humorous</option>
                  <option value="Storytelling">📖 Narrative Storytelling</option>
                  <option value="Dramatic">🎭 Intense & Dramatic</option>
                  <option value="Suspenseful">🕵️‍♂️ Mystery & Suspense</option>
                  <option value="Sarcastic">😏 Sarcastic & Witty</option>
                </optgroup>
                <optgroup label="Premium & Niche" style={{ background: '#0f172a' }}>
                  <option value="Luxury">💎 Elegant & Luxury</option>
                  <option value="Minimalist">☁️ Clean & Minimalist</option>
                  <option value="Educational">🎓 Academic & Deep Dive</option>
                  <option value="Direct">⚡ Direct & No-Nonsense</option>
                </optgroup>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: '25px' }}>
              <label>Duration</label>
              <select name="duration">
                <option value="30 seconds">📱 30 seconds</option>
                <option value="60 seconds">🎥 60 seconds</option>
                <option value="2 minutes">🎥 2 minutes</option>
                <option value="5 minutes">🎥 5 minutes</option>
                <option value="10 minutes">🎥 10 minutes</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading || hasNoCredits} 
              className="generate-btn"
              style={{ background: hasNoCredits ? '#1e293b' : '#2563eb', cursor: hasNoCredits ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <Loader2 className="spin" /> : hasNoCredits ? "No Credits Left" : <><Sparkles size={18}/> Generate Script</>}
            </button>
          </form>

          {statusMessage && (
            <div className={`status-box ${hasNoCredits ? 'error' : ''}`}>
              <AlertCircle size={18} /> {statusMessage}
              {hasNoCredits && <Link href="/dashboard/pricing" style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: 'auto' }}>Get Credits</Link>}
            </div>
          )}

          {script && (
            <div className="script-result">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ color: '#60a5fa', fontWeight: 'bold', margin: 0, fontSize: '1rem' }}>✨ Generated Script:</h3>
                <CopyButton text={script} />
              </div>
              <div className="markdown-container">
                <ReactMarkdown>{script}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ESTILOS RESPONSIVOS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container { display: flex; min-height: 100vh; background: #020617; color: white; font-family: sans-serif; }
        .sidebar { width: 280px; border-right: 1px solid #1e293b; padding: 30px; display: flex; flexDirection: column; gap: 25px; transition: 0.3s; background: #020617; z-index: 100; }
        .sidebar-logo { color: #3b82f6; font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; }
        .main-content { flex: 1; padding: 40px; overflow-y: auto; width: 100%; }
        .mobile-header { display: none; padding: 15px 20px; border-bottom: 1px solid #1e293b; align-items: center; justify-content: space-between; background: #0f172a; position: sticky; top: 0; z-index: 110; }
        
        .glass-form { background: #0f172a; padding: 30px; border-radius: 16px; border: 1px solid #1e293b; }
        .input-group { margin-bottom: 15px; }
        .input-group label { font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px; }
        .input-group input, .input-group select { width: 100%; padding: 12px; border-radius: 8px; background: #020617; border: 1px solid #334155; color: white; font-size: 16px; }
        
        .generate-btn { width: 100%; padding: 16px; color: white; border-radius: 8px; border: none; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s; }
        .generate-btn:hover { opacity: 0.9; }
        
        .status-box { margin-top: 20px; padding: 15px; background: #1e293b; border-radius: 8px; color: #94a3b8; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
        .status-box.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        
        .script-result { marginTop: 40px; background: #0f172a; padding: clamp(15px, 4vw, 30px); border-radius: 16px; border: 1px solid #3b82f6; }
        .markdown-container { color: #e2e8f0; background: #020617; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; overflow-x: auto; }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* MEDIA QUERIES PARA MOBILE */
        @media (max-width: 768px) {
          .dashboard-container { flex-direction: column; }
          .sidebar { 
            position: fixed; left: -100%; top: 56px; height: calc(100vh - 56px); 
            width: 100%; border: none; padding: 20px;
          }
          .sidebar.open { left: 0; }
          .sidebar-logo { display: none; }
          .mobile-header { display: flex; }
          .main-content { padding: 20px; }
          .welcome-section { margin-bottom: 30px; }
          .glass-form { padding: 20px; }
        }
      `}} />
    </div>
  );
}