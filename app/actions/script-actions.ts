"use server"

import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Gets or creates the user profile in MongoDB.
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
    console.error("GENTONE LOG [MongoDB Error]:", error.message);
    return { success: false, error: "Database connection failed." };
  }
}

/**
 * GENTONE ENGINE V5 - PROFESSIONAL PERSPECTIVE LOCK
 * Generates viral scripts focused on high-end production and retention.
 */
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
  if (!GROQ_API_KEY) return { success: false, error: "AI API Key missing." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");

    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) {
      return { success: false, error: "Insufficient credits!" };
    }

    // SYSTEM INSTRUCTION - FOCUS ON PROFESSIONAL INFLUENCER PERSPECTIVE
    const systemInstruction = `
      You are GenTone, a Senior Content Strategist for Elite Creators. 
      Your mission is to produce scripts that look and sound like high-end professional productions.

      STRICT PERSPECTIVE RULES:
      1. NARRATOR IDENTITY: The Narrator is ALWAYS a professional, charismatic adult creator/influencer. NEVER write from a child's perspective or use "baby talk".
      2. TARGET AUDIENCE FOCUS: If the topic involves kids, address the parents or adult creators. Treat the subject with sophistication.
      3. REJECTION LIST (BANNED CONTENT): 
         - No "Hello friends/amiguinhos".
         - No "Science adventures" or "Magic".
         - No "Waiting for the magic to happen".
         - No generic or childish introductions.
      4. PLATFORM LOGIC:
         - TikTok/Reels: Start with an AGGRESSIVE HOOK (e.g., "You've been lied to about X" or "Stop doing Y"). Fast cuts every 2 seconds.
         - YouTube: Deep technical value, authoritative storytelling, and timestamped chapters.
      5. VISUALS: Use professional cues like [Cinematic B-Roll], [Macro Shot], [Dynamic Text Overlay], [Quick Cut].
      6. LANGUAGE: All output (including tags like [Visual] and [Audio]) must be 100% in Portuguese.
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
            content: `Create a professional script for ${formData.platform}.
            Topic: "${formData.topic}"
            Target Audience: ${formData.targetAudience}
            Tone: ${formData.tone}
            Duration: ${formData.duration}.
            
            REMINDER: The narrator is a pro influencer. Zero childishness. High-energy and authority only.` 
          }
        ],
        temperature: 0.3, // Lowered for maximum instruction following and zero "creative hallucinations"
        max_tokens: 3800,
      })
    });

    if (!response.ok) throw new Error("Groq API Failure");

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) throw new Error("AI returned empty content.");

    // Update DB and credits
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
    console.error("GENTONE ERROR:", error.message);
    return { success: false, error: "Failed to generate high-end script." };
  }
}