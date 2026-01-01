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

    return { success: true, credits: profile ? profile.credits : 10 };
  } catch (error: any) {
    console.error("GENTONE LOG:", error.message);
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
  const { userId } = await auth();
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!userId) return { success: false, error: "Session expired." };
  if (!GROQ_API_KEY) return { success: false, error: "API Key missing." };

  try {
    const client = await clientPromise;
    const db = client.db("gentone");

    const profile = await db.collection("profiles").findOne({ userId: userId });
    if (!profile || profile.credits <= 0) return { success: false, error: "No credits." };

    // GENTONE ENGINE V7 - THE "ANTI-INFANTILIZATION" SHIELD
    const systemInstruction = `
      You are GenTone, an Elite Content Agency AI. You write for professional YouTubers and Influencers.
      
      STRICT ARCHITECTURE:
      1. NO CHILDISH PERSONAS: Never use "Young Chefs", "Kids", "Magic", or "Dancing". 
      2. NARRATOR: The narrator is an AUTHORITY, a Master of the Craft. Use a professional and sleek tone.
      3. HIGH-SPEED RETENTION: No long intros. Start with a result or a professional hook.
      4. VALUE-DRIVEN: Provide specific measurements (grams, temperature, seconds).
      5. SAFETY: Never suggest children doing things alone. Frame it as a "Professional Guide".
      6. LANGUAGE: Detect the topic language and respond 100% in that language (including tags).
      
      PROHIBITED WORDS: "Young chefs", "Smiling faces", "Magic", "Let's learn together", "Fun recipes".
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
            content: `Generate a HIGH-END script for ${formData.platform}.
            Topic: "${formData.topic}"
            Audience: ${formData.targetAudience}
            Tone: ${formData.tone}
            Duration: ${formData.duration}.
            
            STRICT: Be professional. NO BABY TALK. Focus on expert tips and cinematic visuals.` 
          }
        ],
        temperature: 0.2, // Lowest possible to force absolute obedience
        max_tokens: 3800,
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