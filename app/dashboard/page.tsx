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
import { Loader2, Sparkles, AlertCircle, History, Zap, Menu, X, Video } from "lucide-react"; 
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>("Free Plan"); // Estado para armazenar o nome do plano
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (isLoaded && isSignedIn) {
        const res = await getUserProfile();
        if (res.success) {
          setCredits(res.credits);
          // Atualiza o plano com o valor real do MongoDB (ex: "Starter", "Pro")
          if (res.plan) setPlan(res.plan); 
        }
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
    setStatusMessage("GenTone is crafting your professional script...");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      topic: formData.get("topic") as string,
      tone: formData.get("tone") as string,
      duration: formData.get("duration") as string,
      targetAudience: formData.get("targetAudience") as string,
      platform: formData.get("platform") as string 
    };

    try {
      const res = await generateScriptAction(data);
      if (res.success && res.content) {
        setScript(res.content);
        setStatusMessage(""); 
        const profile = await getUserProfile();
        if (profile.success) {
          setCredits(profile.credits);
          if (profile.plan) setPlan(profile.plan);
        }
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
    <div className="dashboard-layout">
      
      {/* Mobile Header */}
      <header className="mobile-header">
        <span className="logo-text">GenTone</span>
        <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar-container ${isSidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-inner">
          <div className="sidebar-top">
            <h2 className="sidebar-logo">GenTone</h2>
            
            <nav className="nav-links">
              <div className="credits-display">
                <span className="label">AVAILABLE CREDITS</span>
                <span className="value">{credits ?? '0'}</span>
                <Link href="/dashboard/pricing" className="btn-upgrade">
                  <Zap size={14} fill="currentColor" /> Upgrade Plan
                </Link>
              </div>

              <Link href="/dashboard/history" className="nav-item">
                <History size={18} /> <span>Generation History</span>
              </Link>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <div className="profile-card">
              <UserButton afterSignOutUrl="/" />
              <div className="profile-info">
                <p className="profile-name">{user?.firstName || "Creator"}</p>
                {/* ALTERAÇÃO AQUI: Agora exibe o plano vindo do banco de dados */}
                <p className="profile-status">{plan}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          
          <div className="header-section">
            <h1 className="welcome-title">Welcome back, {user?.firstName || "Creator"}! 👋</h1>
            <p className="welcome-subtitle">Let's create something viral today.</p>
          </div>
          
          <form onSubmit={handleGenerate} className="main-form">
            <div className="form-header-row">
              <h2 className="form-header">Script Configuration</h2>
              <div className="badge-platform"><Video size={14} /> AI Engine v2.0</div>
            </div>
            
            <div className="form-grid">
              <div className="field full-width">
                <label>Video Topic / Idea</label>
                <input name="topic" required placeholder="Ex: 5 ways to sell your SaaS with AI" />
              </div>

              <div className="field">
                <label>Target Audience</label>
                <input name="targetAudience" required placeholder="Ex: Tech entrepreneurs" />
              </div>

              <div className="field">
                <label>Platform</label>
                <select name="platform" required>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="YouTube Long Form">YouTube (Long Video)</option>
                  <option value="Snapchat">Snapchat</option>
                  <option value="LinkedIn Video">LinkedIn</option>
                </select>
              </div>

              <div className="field">
                <label>Tone of Voice</label>
                <select name="tone" required>
                  <optgroup label="Popular">
                    <option value="High Energy">High Energy / Viral</option>
                    <option value="Professional">Professional</option>
                    <option value="Motivational">Motivational</option>
                  </optgroup>
                  <optgroup label="Creative">
                    <option value="Funny">Funny & Witty</option>
                    <option value="Dramatic">Intense & Dramatic</option>
                    <option value="Storytelling">Narrative</option>
                  </optgroup>
                  <optgroup label="Business">
                    <option value="Persuasive">Sales / Persuasive</option>
                    <option value="Luxury">Elegant / Luxury</option>
                    <option value="Minimalist">Clean & Direct</option>
                  </optgroup>
                </select>
              </div>

              <div className="field">
                <label>Estimated Duration</label>
                <select name="duration" required>
                  <option value="15-30 seconds">Short (15-30s)</option>
                  <option value="60 seconds">Standard (60s)</option>
                  <option value="2-3 minutes">Medium (2-3m)</option>
                  <option value="5 minutes">Long (5m)</option>
                  <option value="10 minutes">Deep Dive (10m+)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || hasNoCredits} 
              className="btn-generate"
              style={{ background: hasNoCredits ? '#1e293b' : '#2563eb' }}
            >
              {loading ? <Loader2 className="animate-spin" /> : hasNoCredits ? "No Credits Left" : <><Sparkles size={18}/> Craft My Script</>}
            </button>
          </form>

          {statusMessage && (
            <div className={`alert-box ${hasNoCredits ? 'alert-error' : ''}`}>
              <AlertCircle size={18} /> <span>{statusMessage}</span>
              {hasNoCredits && <Link href="/dashboard/pricing" className="get-credits-link">Upgrade Now</Link>}
            </div>
          )}

          {script && (
            <div className="script-output">
              <div className="output-header">
                <h3>✨ Your GenTone Script:</h3>
                <CopyButton text={script} />
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{script}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --sidebar-width: 280px;
          --bg-main: #020617;
          --bg-card: #0f172a;
          --accent: #2563eb;
          --border: #1e293b;
        }

        .dashboard-layout { display: flex; height: 100vh; width: 100vw; background: var(--bg-main); color: white; font-family: 'Inter', sans-serif; overflow: hidden; }

        /* SIDEBAR */
        .sidebar-container { width: var(--sidebar-width); border-right: 1px solid var(--border); flex-shrink: 0; background: var(--bg-main); z-index: 100; }
        .sidebar-inner { display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 24px; }
        .sidebar-logo { color: #3b82f6; font-size: 1.5rem; font-weight: bold; margin-bottom: 30px; }
        .credits-display { background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        .credits-display .label { font-size: 0.65rem; color: #60a5fa; font-weight: 800; letter-spacing: 0.05em; }
        .credits-display .value { font-size: 2rem; font-weight: bold; display: block; margin: 5px 0 12px 0; }
        .btn-upgrade { background: var(--accent); color: white; text-decoration: none; padding: 10px; border-radius: 8px; font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .btn-upgrade:hover { opacity: 0.9; transform: translateY(-1px); }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; color: #cbd5e1; text-decoration: none; font-size: 0.9rem; }
        .profile-card { display: flex; align-items: center; gap: 12px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 16px; }
        .profile-info { overflow: hidden; }
        .profile-name { font-size: 0.85rem; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-status { font-size: 0.7rem; color: #64748b; margin: 0; }

        /* MAIN CONTENT */
        .main-content { flex: 1; overflow-y: auto; padding: 60px 40px; background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.05), transparent); }
        .content-container { max-width: 850px; margin: 0 auto; }
        .welcome-title { font-size: 2.2rem; font-weight: 800; margin-bottom: 10px; }
        .welcome-subtitle { color: #94a3b8; font-size: 1.1rem; margin-bottom: 40px; }

        .main-form { background: var(--bg-card); border: 1px solid var(--border); padding: 35px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .form-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .form-header { font-size: 1.2rem; color: #f1f5f9; font-weight: 600; margin: 0; }
        .badge-platform { background: rgba(37, 99, 235, 0.1); color: #60a5fa; padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 6px; border: 1px solid rgba(37, 99, 235, 0.2); }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .full-width { grid-column: span 2; }

        .field label { display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }
        .field input, .field select { width: 100%; background: var(--bg-main); border: 1px solid var(--border); padding: 14px; border-radius: 12px; color: white; font-size: 0.95rem; transition: 0.2s; }
        .field input:focus, .field select:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }

        .btn-generate { width: 100%; color: white; border: none; padding: 18px; border-radius: 12px; font-size: 1rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: 0.2s; }
        .btn-generate:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }

        .alert-box { margin-top: 25px; padding: 16px 20px; background: var(--border); border-radius: 12px; display: flex; align-items: center; gap: 12px; font-size: 0.9rem; }
        .alert-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        .get-credits-link { margin-left: auto; font-weight: bold; color: #ef4444; text-decoration: none; }

        .script-output { margin-top: 40px; background: var(--bg-card); padding: 30px; border-radius: 24px; border: 1px solid var(--accent); animation: fadeIn 0.5s ease; }
        .output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .markdown-body { background: var(--bg-main); padding: 25px; border-radius: 16px; line-height: 1.7; color: #e2e8f0; border: 1px solid var(--border); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .mobile-header { display: none; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }
        @media (max-width: 768px) {
          .dashboard-layout { flex-direction: column; }
          .sidebar-container { position: fixed; left: 0; top: 60px; height: calc(100vh - 60px); width: 100%; transform: translateX(-100%); transition: transform 0.3s ease; }
          .sidebar-container.show { transform: translateX(0); }
          .mobile-header { display: flex; height: 60px; padding: 0 20px; align-items: center; justify-content: space-between; background: var(--bg-card); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 110; }
          .main-content { padding: 30px 20px; }
        }
      `}} />
    </div>
  );
}