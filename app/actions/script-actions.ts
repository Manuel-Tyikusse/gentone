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

    // SYSTEM PROMPT: ADAPTIVE CONTENT ENGINE (Short & Long Form)
    const systemInstruction = `
      You are GenTone, a Senior Content Strategist for YouTube, TikTok, and Instagram.
      You create high-quality scripts tailored to the user's specific duration and audience.

      CORE ARCHITECTURE:
      1. DURATION COMPLIANCE: If the duration is long (e.g., 5-10 min), structure the script with "Chapters" and "Acts". If short (under 60s), focus on "High-Speed Retention".
      2. TONE ALIGNMENT: Use a professional, expert-level tone tailored to "${formData.tone}". Never be "childish" unless the audience is specifically young children, but even then, maintain professional production values.
      3. VISUAL DICTIONARY: Use [Visual] for cinematography/action and [Audio] for speech. Include [B-Roll], [Graphic Overlay], and [Sound Effect] cues.
      4. SCRIPT QUALITY: Avoid repetitive scenes. Ensure the narrative flows logically from Hook -> Content -> Call to Action.
      5. LANGUAGE: Write 100% in the language of the topic: "${formData.topic}".
      6. NO RESTRICTIONS: Do not lecture the user about duration limits. Just fulfill the requested time: ${formData.duration}.
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
            content: `Create a full, detailed script.
            TOPIC: "${formData.topic}"
            AUDIENCE: ${formData.targetAudience}
            TONE: ${formData.tone}
            REQUESTED DURATION: ${formData.duration}` 
          }
        ],
        temperature: 0.7, // Um pouco mais de "espaço" para scripts longos e criativos
        max_tokens: 3000, // Aumentado para suportar scripts de 5-10 minutos
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Groq API Failure");
    }

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
    return { success: false, error: "Falha ao gerar roteiro. Tenta novamente." };
  }
}