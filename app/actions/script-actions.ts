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

    // GENTONE ENGINE V8 - THE VIRAL RETENTION SYSTEM
    const systemInstruction = `
      You are GenTone, an Expert in Short-Form Viral Content (TikTok, Reels, Shorts).
      Your goal is to stop the scroll in 0.5 seconds.

      TIKTOK VIRAL RULES:
      1. THE HOOK: Start with a "Pattern Interrupt". Example: "Stop making coffee like this!" or "The 1% coffee secret". NEVER start with "Hello" or "Today we will".
      2. VISUAL VELOCITY: Describe fast cuts [Quick Cut], [Zoom In], [Fast Motion], and [Text Overlays]. Something must change visually every 1.5 seconds.
      3. NARRATION STYLE: High energy, punchy, and "no-fluff". Use short sentences. 
      4. SHOW, DON'T TELL: Use cinematic B-Roll descriptions (e.g., [Macro shot of steam], [POV pouring]).
      5. LANGUAGE: Write 100% in the language of the topic: "${formData.topic}". 
      6. NO BORING TRANSITIONS: No "Next", no "Step 1". Use seamless transitions like "Now do this" or "Here is the trick".
      
      CONTRAINTS: Avoid "manual-style" boring scripts. If it looks like a documentary, it failed. It must look like a viral TikTok.
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
            content: `Create a VIRAL ${formData.platform} script. 
            Topic: "${formData.topic}"
            Target Audience: ${formData.targetAudience}
            Tone: ${formData.tone}
            Duration: ${formData.duration}.
            
            STRICT: Use fast-paced TikTok editing style. Start with a killer hook. No boring intros.` 
          }
        ],
        temperature: 0.6, // Increased slightly to allow for more energetic and "viral" phrasing
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