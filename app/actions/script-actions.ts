"use server"

import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  const { userId } = auth();
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
  const { userId } = auth();
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!userId) return { success: false, error: "Session expired." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");
    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) return { success: false, error: "No credits." };

    // GENTONE ENGINE V10 - THE GLOBAL MIRROR PROTOCOL
    const systemInstruction = `
      [ROLE]: You are GenTone, a Senior Viral Strategist for professional creators.
      
      [LANGUAGE MIRROR RULE]: 
      1. IDENTIFY the language of the user's topic: "${formData.topic}".
      2. You MUST write the ENTIRE script (Visuals, Audio, Timeframes, and Tags) in that EXACT language.
      3. If the topic is in English, all tags must be [Visual] / [Audio].
      4. If the topic is in Portuguese, all tags must be [Visual] / [Áudio].
      5. NEVER translate the script to Portuguese if the user input is in English or another language.

      [CONTENT PROTOCOL]:
      - NARRATOR: Always an adult expert/influencer. NEVER a child.
      - STYLE: High-retention, fast-paced (TikTok/Reels style). 
      - NO CHILDISH CONTENT: Banned words: "magic", "aventura", "amiguinhos", "cooking with kids", "sad/happy faces".
      - STRUCTURE: Aggressive hook in the first 3 seconds. Visual change every 2 seconds.
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
            content: `Generate a professional ${formData.platform} script.
            TOPIC: "${formData.topic}"
            AUDIENCE: ${formData.targetAudience}
            TONE: ${formData.tone}
            DURATION: ${formData.duration}.
            
            STRICT: Respond 100% in the language of the topic provided. Do not use Portuguese if the topic is in another language. Maintain an elite professional tone.` 
          }
        ],
        temperature: 0.4,
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
    return { success: false, error: "Generation failed." };
  }
}