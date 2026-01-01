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

    // A ALTERAÇÃO PEDIDA: Foco em Roteiro Cinematográfico (Cenas, Narrador, Descrições)
    const systemInstruction = `
      You are an elite Creative Director and Screenwriter. 
      Your task is to write high-end video scripts with a cinematic structure.

      FORMATTING RULES:
      1. Use [Scene: Description] to describe the setting, lighting, and visuals.
      2. Use [Cut to: Description] for camera transitions.
      3. Identify the speaker as "Narrator (tone description):" followed by the dialogue in quotes.
      4. LANGUAGE: Detect the language of the topic and write 100% in that language.
      5. TONE: Strictly follow the tone: ${formData.tone}.
      6. No meta-talk. Start directly with the first [Scene].
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
            content: `Write a cinematic video script about: "${formData.topic}". 
            Audience: ${formData.targetAudience}. 
            Duration: ${formData.duration}.` 
          }
        ],
        temperature: 0.7, 
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
        content: content,
        createdAt: new Date(),
        metadata: { 
            tone: formData.tone, 
            duration: formData.duration,
            targetAudience: formData.targetAudience 
        }
      }),
      db.collection("profiles").updateOne(
        { userId: userId },
        { $inc: { credits: -1 } }
      )
    ]);

    revalidatePath("/dashboard");
    return { success: true, content };

  } catch (error: any) {
    console.error("LOG GENTONE [Generation Error]:", error.message);
    return { success: false, error: error.message || "Failed to generate script." };
  }
}