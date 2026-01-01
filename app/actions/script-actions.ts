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
      return { success: false, error: "Créditos insuficientes. Faz upgrade para continuar!" };
    }

    // PROMPT DE ALTA RETENÇÃO (Focado em TikTok, Reels e Shorts)
    const systemInstruction = `
      You are GenTone, the world's #1 Scriptwriter for short-form viral content (TikTok, Reels, Shorts).
      Your goal is to create scripts that are easy to film at home but impossible to stop watching.

      STRICT RULES:
      1. THE HOOK (0-3s): Start with a "Pattern Interrupt". No greetings. Use a shocking fact, a direct benefit, or a specific problem.
      2. VISUALS: Suggest only realistic actions for a creator with a phone (e.g., [Pointing at text], [Looking at camera], [Showing screen], [Fast transition]). 
      3. AUDIO/SPEECH: Write exactly how people talk. Short, punchy, and conversational.
      4. LANGUAGE: You MUST write 100% in the language of the topic: "${formData.topic}".
      5. FORMAT: 
         [Visual]: Description of what happens on screen.
         [Audio]: The exact words to be spoken.
      6. TONE: Strictly follow the ${formData.tone} tone.
      7. NO META-TALK: Start the script directly.
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
            content: `Write a viral script about: "${formData.topic}". 
            Target Audience: ${formData.targetAudience}. 
            Duration: ${formData.duration}.` 
          }
        ],
        temperature: 0.75, // Equilíbrio perfeito entre criatividade e estrutura
        max_tokens: 1500,
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Groq API Failure");
    }

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) throw new Error("AI returned empty content.");

    // Gravar e descontar crédito
    await Promise.all([
      db.collection("scripts").insertOne({
        userId: userId,
        title: formData.topic,
        content: content.trim(),
        createdAt: new Date(),
        metadata: { 
            tone: formData.tone, 
            duration: formData.duration,
            targetAudience: formData.targetAudience 
        }
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
    return { success: false, error: "Falha ao gerar o roteiro. Tenta novamente." };
  }
}