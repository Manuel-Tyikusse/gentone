"use server"

import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Obtém ou cria o perfil do utilizador na coleção "profiles".
 */
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
 * Gera roteiros virais profissionais (TikTok/Reels/Shorts).
 * Focado em retenção, segurança e linguagem de marketing.
 */
export async function generateScriptAction(formData: { 
  topic: string, 
  tone: string, 
  duration: string, 
  targetAudience: string 
}) {
  const { userId } = await auth();
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!userId) return { success: false, error: "Session expired." };
  if (!GROQ_API_KEY) return { success: false, error: "AI API Key missing." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");

    // Verifica créditos
    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) {
      return { success: false, error: "Créditos insuficientes! Faz upgrade para continuar." };
    }

    // SYSTEM PROMPT DE ELITE - GenTone Viral Engine
    const systemInstruction = `
      You are GenTone, an Elite Viral Scriptwriter for Social Media (TikTok, Reels, YouTube Shorts).
      Your mission is to turn any topic into a professional, high-retention video script.

      STRICT CONTENT PROTOCOLS:
      1. THE HOOK (0-3s): Start with a "Pattern Interrupt". Never say "Hello". Use a provocative question, a bold claim, or a shocking result.
      2. PROFESSIONAL NARRATION: Write for a Content Creator addressing an audience. Use punchy, high-energy marketing language. Avoid "baby talk" or childish tones, even for family topics.
      3. SAFETY & LOGISTICS: Never suggest dangerous acts. Only suggest visuals a creator can film in a home studio (e.g., [Visual]: Close-up of hands, [Visual]: Pointing to text, [Visual]: Showing screen).
      4. VIRAL STRUCTURE: 
         - Hook (Attention)
         - Core Value/Tips (Retention)
         - Strong CTA (Engagement/Conversion)
      5. FORMAT: Use [Visual]: and [Audio]: for every scene.
      6. LANGUAGE: Write 100% in the language of the topic: "${formData.topic}".
      7. TONE: Strictly follow the requested tone: "${formData.tone}".
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
            content: `Create a professional viral script about: "${formData.topic}". 
            Target Audience: ${formData.targetAudience}. 
            Estimated Duration: ${formData.duration}.` 
          }
        ],
        temperature: 0.65, // Reduzido para maior precisão e menos alucinação
        max_tokens: 1600,
      })
    });

    if (!response.ok) throw new Error("Groq API Failure");

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) throw new Error("AI returned empty content.");

    // Gravação e desconto de crédito (Atomic Operation)
    await Promise.all([
      db.collection("scripts").insertOne({
        userId: userId,
        title: formData.topic,
        content: content.trim(),
        createdAt: new Date(),
        metadata: formData
      }),
      db.collection("profiles").updateOne(
        { userId: userId },
        { $inc: { credits: -1 } }
      )
    ]);

    revalidatePath("/dashboard");
    return { success: true, content: content.trim() };

  } catch (error: any) {
    console.error("LOG GENTONE [Generation Error]:", error.message);
    return { success: false, error: "Falha na geração. Tenta novamente em instantes." };
  }
}