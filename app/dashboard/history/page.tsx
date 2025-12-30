import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { ArrowLeft, Clock, MessageSquareText } from "lucide-react";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clientPromise;
  const db = client.db("gentone");
  
  const scriptsData = await db.collection("scripts")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  const scripts = scriptsData.map(doc => ({
    id: doc._id.toString(),
    title: doc.title || "Untitled Script",
    content: doc.content || "",
    createdAt: doc.createdAt
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white', fontFamily: 'sans-serif', padding: '50px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '50px' }}>
          <Link href="/dashboard" style={{ 
            color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', 
            fontSize: '0.9rem', marginBottom: '15px'
          }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Script History</h1>
          <p style={{ color: '#94a3b8', marginTop: '5px' }}>Review and manage your previously generated scripts.</p>
        </div>

        {/* Script List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {scripts.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', background: '#0f172a', borderRadius: '20px', border: '1px dashed #334155' }}>
              <p style={{ color: '#64748b' }}>No scripts found in your history.</p>
            </div>
          ) : (
            scripts.map((s) => (
              <div key={s.id} style={{ 
                background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', overflow: 'hidden'
              }}>
                {/* Card Top */}
                <div style={{ 
                  padding: '20px 25px', borderBottom: '1px solid #1e293b', display: 'flex', 
                  justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                      <MessageSquareText size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f1f5f9' }}>{s.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                        <Clock size={12} /> {new Date(s.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                  <CopyButton text={s.content} />
                </div>
                
                {/* Card Content */}
                <div style={{ padding: '25px' }}>
                  <div className="custom-scrollbar" style={{ 
                    color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7', 
                    maxHeight: '180px', overflowY: 'auto', paddingRight: '10px'
                  }}>
                    {s.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}