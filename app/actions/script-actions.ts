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
    const profile = await db.collection("profiles").findOneAndUpdate(
      { userId: userId },
      { $setOnInsert: { userId: userId, credits: 10, createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );
    return { success: true, credits: profile ? profile.credits : 10 };
  } catch (error: any) {
    return { success: false, error: "Database error." };
  }
}

export async function generateScriptAction(formData: { 
  topic: string, 
  tone: string, 
  duration: string, 
  targetAudience: string,
  platform: string
}) {
  const { userId } = await auth();
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!userId) return { success: false, error: "Session expired." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");
    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) return { success: false, error: "No credits." };

    // GENTONE ENGINE V9 - THE "ELITE CREATOR" PROTOCOL
    const systemInstruction = `
      [STRICT ROLE]: You are a High-End Social Media Strategist. You write for PROFESSIONAL ADULT INFLUENCERS.
      
      [LANGUAGE RULE]: 
      - The user topic is: "${formData.topic}". 
      - You MUST write 100% of the output (Visuals, Audio, Titles, Tags) in the SAME language as the topic. 
      - If the topic is Portuguese, NEVER use English words like "Quick Cut" or "Text Overlay" in the final output. Use "Corte Rápido" and "Texto na Tela".

      [CONTENT PROTOCOL]:
      1. NARRATOR: The narrator is ALWAYS an expert adult (Creator/Influencer). 
      2. TOPIC HANDLING: If the topic is about kids, the narrator is an ADULT teaching parents or showing a premium lifestyle. NEVER have a kid as the main narrator.
      3. NO CHILDISH STUFF: BANNED: "sad face", "happy face", "magic", "aventura", "amiguinhos", "baby talk". 
      4. VIRAL STRUCTURE: 
         - 0s-3s: AGGRESSIVE HOOK. (e.g., "Pare de fazer isso!" or "O segredo profissional para...")
         - Visuals: Change every 1.5 seconds.
      5. TECHNICAL VALUE: Use real data (measurements, professional gear, elite techniques).

      [OUTPUT FORMAT EXAMPLE (in the topic's language)]:
      [00:00 - 00:03]
      [Visual]: Descrição detalhada da cena.
      [Áudio]: Fala exata do narrador.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { 
            role: "user", 
            content: `Gera um roteiro viral para ${formData.platform}. 
            TEMA: "${formData.topic}"
            PÚBLICO: ${formData.targetAudience}
            TOM: ${formData.tone}
            DURAÇÃO: ${formData.duration}.
            
            REGRAS FINAIS: Escreve TUDO em Português. O narrador é um especialista adulto. O roteiro deve ser dinâmico e profissional. Sem falas infantis.` 
          }
        ],
        temperature: 0.5, // Equilíbrio entre criatividade viral e obediência
        max_tokens: 3500,
      })
    });

    if (!response.ok) throw new Error("Groq API Failure");
    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    await Promise.all([
      db.collection("scripts").insertOne({ userId, title: formData.topic, content: content.trim(), createdAt: new Date(), metadata: formData }),
      db.collection("profiles").updateOne({ userId }, { $inc: { credits: -1 } })
    ]);

    revalidatePath("/dashboard");
    return { success: true, content: content.trim() };
  } catch (error: any) {
    return { success: false, error: "Falha na geração." };
  }
}