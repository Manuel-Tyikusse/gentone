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
      return { success: false, error: "Insufficient credits. Please upgrade." };
    }

    // SYSTEM PROMPT REESTRUTURADO: Estilo Roteiro de Produção (Cinematográfico)
    const systemInstruction = `
      You are a world-class Cinematographer and Scriptwriter. 
      Your task is to write a PROFESSIONAL VIDEO SCRIPT.

      STRICT COMMANDS:
      1. NO FAKE IMAGES: Never use tags like "[Image of...]" or "[Infographic...]".
      2. FORMAT: Use only [Scene: Description], [Cut to: Description], and "Narrator:".
      3. CINEMATIC STYLE: Describe the lighting, camera movement, and environment inside the [Scene] tags.
      4. NARRATION: Write the dialogue in a smooth, professional, and immersive way, just like a luxury brand commercial.
      5. LANGUAGE: Write 100% in the language of the topic: "${formData.topic}".
      6. TONE: Strictly adhere to the ${formData.tone} tone.
      
      STRUCTURE EXAMPLE:
      [Scene: A dark office, only lit by the glow of a computer screen. Slow zoom into the user's tired eyes.]
      Narrator (Sophisticated): "Success isn't about working harder. It's about working where it matters."
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
            content: `Create a professional cinematic video script. 
            TOPIC: "${formData.topic}"
            AUDIENCE: ${formData.targetAudience}
            DURATION: ${formData.duration}` 
          }
        ],
        temperature: 0.65, // Menos "aleatoriedade" para seguir o formato à risca
        max_tokens: 2000,
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