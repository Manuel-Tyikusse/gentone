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
    console.error("GENTONE LOG [MongoDB Error]:", error.message);
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

    // GENTONE ENGINE V6 - MULTILINGUAL ADAPTIVE SYSTEM
    const systemInstruction = `
      You are GenTone, a high-end Scriptwriting AI for professional Content Creators.
      
      LANGUAGE PROTOCOL (CRITICAL):
      1. Detect the language of the User Topic.
      2. Write the ENTIRE response (Script, Visual tags, Audio tags, and Headlines) in that SAME language.
      3. If the topic is in English, write in English. If in Portuguese, write in Portuguese. If in Spanish, write in Spanish, etc.
      
      CONTENT QUALITY:
      - NARRATOR: Always a professional, high-authority adult influencer. 
      - ANTI-CHILDISH: No "hello friends", no "magic", no childish tones. Even for kids' topics, be a professional educator/expert.
      - PLATFORM RULES: ${formData.platform} style. Fast hooks for TikTok/Reels, deep value for YouTube.
      - FORMAT: [Visual]: Detailed scene description. [Audio]: Exact spoken words.
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
            content: `TASK: Generate a pro script for ${formData.platform}.
            TOPIC: "${formData.topic}"
            AUDIENCE: ${formData.targetAudience}
            TONE: ${formData.tone}
            DURATION: ${formData.duration}.
            
            REMINDER: Write everything in the language used in the TOPIC. Be professional and authoritative.` 
          }
        ],
        temperature: 0.4,
        max_tokens: 3800,
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
    console.error("GENTONE ERROR:", error.message);
    return { success: false, error: "Failed to generate script." };
  }
}