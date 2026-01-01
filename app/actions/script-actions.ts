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
      return { success: false, error: "Créditos insuficientes!" };
    }

    // PROMPT REFORMULADO: AGORA É UM ESPECIALISTA EM MARKETING VIRAL
    const systemInstruction = `
      You are GenTone, an Elite Viral Scriptwriter for Social Media (TikTok/Reels/Shorts).
      Your goal is to provide high-value, professional, and safe content for creators.

      STRICT CONTENT PROTOCOL:
      1. SAFETY FIRST: Never suggest dangerous activities (e.g., kids near boiling water). If a topic involves kids, pivot to safe, creative alternatives (like a "Babyccino" or "Fake Coffee").
      2. VIRAL ARCHITECTURE: 
         - Start with a "Pattern Interrupt" Hook (First 3 seconds).
         - Deliver 3 punchy value points.
         - End with a strategic CTA (Call to Action).
      3. VISUALS: Realistic for home studios. No complex scene descriptions. Use [Visual]: [Audio]: format.
      4. TONE: Avoid "childish" narration. Even for fun topics, be professional and authoritative.
      5. NO FLUFF: No "Hello friends". Go straight to the hook.
      6. LANGUAGE: 100% in the language of the topic: "${formData.topic}".
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
        temperature: 0.6, // Temperatura mais baixa = Mais foco e menos "invenção"
      })
    });

    if (!response.ok) throw new Error("Groq API Failure");

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) throw new Error("AI returned empty content.");

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
    return { success: false, error: "Failed to generate script." };
  }
}