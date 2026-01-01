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
 * Generates professional scripts with high-retention logic.
 * The system prompt is in English for maximum AI precision.
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

    // GENTONE HYPER-RETENTION V4 - SYSTEM RULES IN ENGLISH
    const systemInstruction = `
      You are GenTone, a world-class Viral Growth Strategist. You write high-converting scripts for pro influencers.

      CORE PRINCIPLES:
      1. NO INFANTILIZATION: Never write "childish" scripts, even if the topic is for kids. The creator is an ADULT expert. No "singing", no "cooking hats", no "hello friends".
      2. PLATFORM SPECIFIC: 
         - TikTok/Reels/Shorts: Extreme retention. Start with an AGGRESSIVE hook (shocking result, secret revealed, or curiosity gap). Visual changes every 2 seconds.
         - YouTube Long-form: Deep value. Use timestamped chapters. Replace fillers with facts, science, and elite tips.
      3. VISUALS: Use pro-level descriptions: [Quick Cut], [Macro Shot], [Text Overlay: "THE SECRET"], [B-Roll: Cinematic steam].
      4. AUDIO: Punchy, high-energy, and professional. Write the exact words the narrator says. Do NOT say "narrator explains", actually write the expert explanation.
      5. SAFETY: Zero tolerance for danger. If children are involved, it must be parent-led or use safe alternatives.
      6. LANGUAGE COMPLIANCE: You MUST write the ENTIRE script (including Visual/Audio tags) in the detected language of the topic: "${formData.topic}". 
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
            content: `Generate a professional ${formData.platform} script.
            Topic: "${formData.topic}"
            Tone: ${formData.tone}
            Target Audience: ${formData.targetAudience}
            Duration: ${formData.duration}.
            
            Important: Ensure the hook is extremely strong. Avoid any "baby talk". Everything must be in the language of the topic.` 
          }
        ],
        temperature: 0.45, // Lower temperature for stricter adherence to instructions.
        max_tokens: 3800,
      })
    });

    if (!response.ok) throw new Error("Groq API Request Failed");

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) throw new Error("AI returned empty content.");

    // Atomic update: Record script and decrease credits
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
    console.error("GENTONE LOG [Generation Error]:", error.message);
    return { success: false, error: "Failed to generate professional script." };
  }
}