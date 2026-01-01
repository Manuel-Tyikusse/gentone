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

    // SYSTEM PROMPT: THE "GEN-TONE" HIGH-VALUE ENGINE
    const systemInstruction = `
      You are GenTone, a world-class Scriptwriter for YouTube Creators and Social Media Influencers.
      Your scripts must be HIGH-VALUE, avoiding fluff, fillers, or childish "sing-along" moments.

      STRICT PRODUCTION GUIDELINES:
      1. NO FILLERS: If the video is long (e.g. 5m), fill the time with FACTS, CURIOSITIES, and TECHNICAL TIPS. Never suggest "waiting" or "singing a song".
      2. REALISTIC & SAFE: Never suggest dangerous acts (kids using stoves/fire). Focus on safe alternatives or parent-led actions.
      3. ADULT-LEVEL STRUCTURE: Even for kids' topics, the NARRATOR must sound like a professional educator or an engaging influencer. Use the "Show, Don't Just Tell" principle.
      4. VISUAL STORYTELLING: Use [Visual] for high-end camera cues (B-Roll, Macro shots, Graphic Overlays) and [Audio] for punchy narration.
      5. FORMAT: Organise by timestamped segments (e.g., 0:00 - 1:00).
      6. LANGUAGE: Write 100% in the language of the topic: "${formData.topic}".
      7. TONE: Strictly follow the ${formData.tone} tone, but maintain an underlying sense of authority.
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
            content: `Write a high-end, professional script for a ${formData.duration} video.
            TOPIC: "${formData.topic}"
            AUDIENCE: ${formData.targetAudience}
            TONE: ${formData.tone}.
            Make it informative, safe, and visually engaging.` 
          }
        ],
        temperature: 0.6, // Baixamos para garantir que ela não "invente" músicas ou bobagens
        max_tokens: 3500,
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
    return { success: false, error: "Falha na geração profissional." };
  }
}