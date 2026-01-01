"use server"

import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  // Corrigido: auth() precisa de await no Clerk mais recente
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
    console.error("GENTONE DB ERROR:", error.message);
    return { success: false, error: "Database connection failed." };
  }
}

export async function generateScriptAction(formData: { 
  topic: string, 
  tone: string, 
  duration: string, 
  targetAudience: string,
  platform: string
}) {
  // Corrigido: auth() precisa de await
  const { userId } = await auth();
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!userId) return { success: false, error: "Session expired." };
  if (!GROQ_API_KEY) return { success: false, error: "AI API Key missing." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");

    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) {
      return { success: false, error: "Insufficient credits!" };
    }

    // GENTONE V10.1 - THE GLOBAL ELITE PROTOCOL
    const systemInstruction = `
      [ROLE]: You are GenTone, a world-class Viral Content Strategist for professional creators.
      
      [LANGUAGE MIRRORING - CRITICAL]: 
      1. DETECT the language of the user's topic: "${formData.topic}".
      2. RESPOND 100% in that exact language. 
      3. All tags like [Visual], [Audio], and timeframes MUST be in the detected language.
      4. NEVER translate to Portuguese if the input is in English or another language.

      [STRICT PERSONA RULES]:
      - NARRATOR: Always a professional, high-authority adult influencer. 
      - BANNED: Never use "Young chefs", "magic", "fun adventure", "amiguinhos", or "baby talk". 
      - FORMAT: High-retention style for ${formData.platform}. 
      - HOOK: Start with an aggressive, professional hook. No "Hello" or "Welcome".
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
            content: `Generate a viral script for ${formData.platform}.
            TOPIC: "${formData.topic}"
            AUDIENCE: ${formData.targetAudience}
            TONE: ${formData.tone}
            DURATION: ${formData.duration}.
            
            REMINDER: Respond 100% in the detected language of the topic. Zero childishness.` 
          }
        ],
        temperature: 0.4,
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
    console.error("GENTONE GEN ERROR:", error.message);
    return { success: false, error: "Failed to generate script. Please try again." };
  }
}