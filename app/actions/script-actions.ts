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
 * Gera roteiros virais de alta retenção (Short-form content expert).
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

    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) {
      return { success: false, error: "Créditos insuficientes!" };
    }

    // SYSTEM PROMPT: SHORT-FORM RETENTION ENGINE
    const systemInstruction = `
      You are GenTone, a Viral Growth Expert for TikTok, Reels, and Shorts. 
      You don't write "stories" or "educational content"; you write "Retention Machines".

      STRICT SCRIPTWRITING RULES:
      1. REAL-WORLD TIMING: The entire script MUST be under 60 seconds. Each scene is 3-5s max.
      2. THE "KILLER" HOOK: Start with a result, a shock, or a curiosity gap. No greetings. 
      3. PROFESSIONAL CREATOR TONE: Write for a pro influencer. No "baby talk", no "childish voices", even for family topics. Use punchy, high-energy language.
      4. VISUAL DYNAMICS: Use only home-studio friendly cues: [Quick Cut], [Text Overlay], [POV], [Point to screen].
      5. FORMAT: 
         Scene 1 (0-3s) - [Visual]: / [Audio]:
         Scene 2 (3-10s) - [Visual]: / [Audio]: 
         (Continue with precise timing up to the requested duration).
      6. SAFETY: Absolute zero tolerance for dangerous acts (e.g., kids near boiling water).
      7. LANGUAGE: Write 100% in the language of the topic: "${formData.topic}".
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
            content: `Topic: "${formData.topic}". Tone: ${formData.tone}. Audience: ${formData.targetAudience}. Duration: ${formData.duration}.` 
          }
        ],
        temperature: 0.6, // Foco total na estrutura e regras
        max_tokens: 1200,
      })
    });

    if (!response.ok) throw new Error("Groq API Failure");

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) throw new Error("AI returned empty content.");

    // Gravar histórico e descontar crédito
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
    console.error("LOG GENTONE Error:", error.message);
    return { success: false, error: "Falha ao gerar roteiro profissional." };
  }
}