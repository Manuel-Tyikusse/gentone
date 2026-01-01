"use server"

import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");
    const collection = db.collection("profiles");

    const profile = await collection.findOneAndUpdate(
      { userId: userId },
      { $setOnInsert: { userId: userId, credits: 10, createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );

    return { 
      success: true, 
      credits: profile ? profile.credits : 10 
    };
  } catch (error: any) {
    console.error("LOG GENTONE [MongoDB Error]:", error.message);
    return { success: false, error: "Database connection failed." };
  }
}

/**
 * Agora recebe 'platform' para adaptar o estilo de edição e narrativa.
 */
export async function generateScriptAction(formData: { 
  topic: string, 
  tone: string, 
  duration: string, 
  targetAudience: string,
  platform: string // EX: TikTok, YouTube, Instagram, Snapchat, LinkedIn
}) {
  const { userId } = await auth();
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!userId) return { success: false, error: "Sessão expirada." };
  if (!GROQ_API_KEY) return { success: false, error: "Erro de configuração da API." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");

    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) {
      return { success: false, error: "Créditos insuficientes!" };
    }

    // SYSTEM PROMPT: PLATFORM-AWARE CONTENT ENGINE
    const systemInstruction = `
      You are GenTone, a Multi-Platform Scriptwriting Expert.
      Your mission is to adapt the script style to the specific requirements of the platform: ${formData.platform}.

      PLATFORM ADAPTATION RULES:
      - TikTok/Reels: Extreme retention, fast cuts, trending hooks, focus on "visual loops" and on-screen text overlays.
      - YouTube (Long): Storytelling, deep educational value, chapter-based structure, "subscribe" calls at the right moments.
      - YouTube Shorts: Vertical focus, fast-paced, direct to the point.
      - Snapchat: Raw, authentic, high-speed visual changes, interactive prompts.
      - LinkedIn: Professional authority, clear structure, focus on business value.

      STRICT QUALITY PROTOCOL:
      1. LANGUAGE: 100% in the language of the topic: "${formData.topic}". Including [Visual] and [Audio] tags.
      2. NO FILLERS: Write REAL dialogue and descriptions. Never say "The narrator explains". Write the explanation.
      3. SAFETY: No dangerous acts. Focus on professional, safe demonstrations.
      4. FORMAT: [Visual]: / [Audio]: with timestamped segments.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${GROQ_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { 
            role: "user", 
            content: `Gera um roteiro profissional para a plataforma ${formData.platform}.
            TEMA: "${formData.topic}"
            PÚBLICO: ${formData.targetAudience}
            TOM: ${formData.tone}
            DURAÇÃO: ${formData.duration}.
            Instrução: Escreve o roteiro completo com falas reais e descrições visuais no idioma do tema.` 
          }
        ],
        temperature: 0.5,
        max_tokens: 3800,
      })
    });

    if (!response.ok) throw new Error("Erro na API da Groq");

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) throw new Error("A IA devolveu um conteúdo vazio.");

    await Promise.all([
      db.collection("scripts").insertOne({
        userId: userId,
        title: formData.topic,
        content: content.trim(),
        createdAt: new Date(),
        metadata: formData // Agora inclui a plataforma automaticamente
      }),
      db.collection("profiles").updateOne(
        { userId: userId },
        { $inc: { credits: -1 } }
      )
    ]);

    revalidatePath("/dashboard");
    return { success: true, content: content.trim() };

  } catch (error: any) {
    console.error("LOG GENTONE Error:", error.message);
    return { success: false, error: "Erro ao gerar roteiro. Tenta novamente." };
  }
}