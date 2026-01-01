// "use server"

// import clientPromise from "@/lib/mongodb";
// import { auth } from "@clerk/nextjs/server";

// /**
//  * Esta função liga-se ao MongoDB e obtém (ou cria) o perfil do utilizador.
//  * No MongoDB, não precisas de criar tabelas antes; ele cria tudo sozinho!
//  */
// export async function getUserProfile() {
//   const { userId } = await auth();

//   if (!userId) {
//     return { success: false, error: "Não autenticado." };
//   }

//   try {
//     const client = await clientPromise;
//     const db = client.db("gentone");
//     const collection = db.collection("profiles");

//     // O comando findOneAndUpdate faz tudo: procura o user. 
//     // Se não existir (upsert: true), cria com 10 créditos.
//     const result = await collection.findOneAndUpdate(
//       { userId: userId },
//       { $setOnInsert: { userId: userId, credits: 10, createdAt: new Date() } },
//       { upsert: true, returnDocument: 'after' }
//     );

//     // No MongoDB, o resultado vem num objeto 'value' ou diretamente no documento
//     const profile = result; 

//     console.log("LOG GENTONE (Mongo): Créditos carregados para", userId, ":", profile?.credits);
    
//     return { 
//       success: true, 
//       credits: profile?.credits ?? 10 
//     };

//   } catch (error: any) {
//     console.error("LOG GENTONE: Erro no MongoDB:", error.message);
//     return { success: false, error: "Erro na base de dados." };
//   }
// }

// /**
//  * Gera o roteiro e desconta créditos no MongoDB.
//  */
// export async function generateScriptAction(formData: { 
//   topic: string, 
//   tone: string, 
//   duration: string, 
//   targetAudience: string 
// }) {
//   const { userId } = await auth();
//   const GROQ_API_KEY = process.env.GROQ_API_KEY;

//   if (!userId) return { success: false, error: "Sessão expirada." };

//   try {
//     const client = await clientPromise;
//     const db = client.db("gentone");

//     // 1. Verificar créditos
//     const profile = await db.collection("profiles").findOne({ userId: userId });

//     if (!profile || profile.credits <= 0) {
//       return { success: false, error: "Créditos insuficientes." };
//     }

//     // 2. Chamada à IA (Groq)
//     const prompt = `Cria um roteiro para: ${formData.topic}. Tom: ${formData.tone}. Público: ${formData.targetAudience}.`;
    
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { 
//         "Authorization": `Bearer ${GROQ_API_KEY}`, 
//         "Content-Type": "application/json" 
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [{ role: "user", content: prompt }],
//       })
//     });

//     const aiData = await response.json();
//     const content = aiData.choices[0]?.message?.content;

//     // 3. Gravar histórico e descontar crédito
//     await db.collection("scripts").insertOne({
//       userId: userId,
//       title: formData.topic,
//       content: content,
//       createdAt: new Date()
//     });

//     await db.collection("profiles").updateOne(
//       { userId: userId },
//       { $inc: { credits: -1 } }
//     );

//     return { success: true, content };

//   } catch (error: any) {
//     console.error("LOG GENTONE: Erro na geração:", error.message);
//     return { success: false, error: "Falha ao gerar roteiro." };
//   }
// }

// "use server"

// import clientPromise from "@/lib/mongodb";
// import { auth } from "@clerk/nextjs/server";

// export async function getUserProfile() {
//   const { userId } = await auth();
//   if (!userId) return { success: false, error: "Não autenticado." };

//   try {
//     const client = await clientPromise;
//     const db = client.db("gentone");
//     const collection = db.collection("profiles");

//     const result = await collection.findOneAndUpdate(
//       { userId: userId },
//       { $setOnInsert: { userId: userId, credits: 10, createdAt: new Date() } },
//       { upsert: true, returnDocument: 'after' }
//     );

//     const profile = result; 
//     return { success: true, credits: profile?.credits ?? 10 };
//   } catch (error: any) {
//     console.error("LOG GENTONE: Erro no MongoDB:", error.message);
//     return { success: false, error: "Erro na base de dados." };
//   }
// }

// export async function generateScriptAction(formData: { 
//   topic: string, 
//   tone: string, 
//   duration: string, 
//   targetAudience: string 
// }) {
//   const { userId } = await auth();
//   const GROQ_API_KEY = process.env.GROQ_API_KEY;

//   if (!userId) return { success: false, error: "Sessão expirada." };

//   try {
//     const client = await clientPromise;
//     const db = client.db("gentone");

//     // 1. Verificar créditos
//     const profile = await db.collection("profiles").findOne({ userId: userId });
//     if (!profile || profile.credits <= 0) {
//       return { success: false, error: "Créditos insuficientes." };
//     }

//     // 2. Chamada à IA (Groq)
//     const prompt = `Cria um roteiro para: ${formData.topic}. Tom: ${formData.tone}. Duração estimada: ${formData.duration}. Público: ${formData.targetAudience}.`;
    
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { 
//         "Authorization": `Bearer ${GROQ_API_KEY}`, 
//         "Content-Type": "application/json" 
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [{ role: "user", content: prompt }],
//       })
//     });

//     if (!response.ok) throw new Error("Falha na API da Groq");

//     const aiData = await response.json();
//     const content = aiData.choices[0]?.message?.content;

//     if (!content) throw new Error("A IA devolveu um conteúdo vazio.");

//     // 3. Gravar histórico e descontar crédito (Operações em conjunto)
//     await Promise.all([
//       db.collection("scripts").insertOne({
//         userId: userId,
//         title: formData.topic,
//         content: content,
//         createdAt: new Date(),
//         metadata: { tone: formData.tone, duration: formData.duration }
//       }),
//       db.collection("profiles").updateOne(
//         { userId: userId },
//         { $inc: { credits: -1 } }
//       )
//     ]);

//     return { success: true, content };

//   } catch (error: any) {
//     console.error("LOG GENTONE: Erro na geração:", error.message);
//     return { success: false, error: error.message || "Falha ao gerar roteiro." };
//   }
// }
// "use server"

// import clientPromise from "@/lib/mongodb";
// import { auth } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";

// export async function getUserProfile() {
//   const { userId } = await auth();
//   if (!userId) return { success: false, error: "Not authenticated." };

//   try {
//     const client = await clientPromise;
//     const db = client.db("gentone");
//     const collection = db.collection("profiles");

//     // Lógica de Upsert melhorada para garantir o retorno do documento
//     const profile = await collection.findOneAndUpdate(
//       { userId: userId },
//       { $setOnInsert: { userId: userId, credits: 10, createdAt: new Date() } },
//       { upsert: true, returnDocument: 'after' }
//     );

//     return { 
//       success: true, 
//       credits: profile ? profile.credits : 10 
//     };
//   } catch (error: any) {
//     console.error("LOG GENTONE [MongoDB Error]:", error.message);
//     return { success: false, error: "Database connection failed." };
//   }
// }

// export async function generateScriptAction(formData: { 
//   topic: string, 
//   tone: string, 
//   duration: string, 
//   targetAudience: string 
// }) {
//   const { userId } = await auth();
//   const GROQ_API_KEY = process.env.GROQ_API_KEY;

//   if (!userId) return { success: false, error: "Session expired." };
//   if (!GROQ_API_KEY) return { success: false, error: "AI API Key missing." };

//   try {
//     const client = await clientPromise;
//     const db = client.db("gentone");

//     // 1. Verificar créditos
//     const profile = await db.collection("profiles").findOne({ userId: userId });
//     if (!profile || profile.credits <= 0) {
//       return { success: false, error: "Insufficient credits. Please upgrade." };
//     }

//     // 2. Chamada à IA (Groq) - Versão Ultra Poliglota
//     const systemInstruction = `
//       You are GenTone, a global AI scriptwriter. 
      
//       CRITICAL RULE: 
//       1. DETECT the language of the user's TOPIC.
//       2. RESPOND entirely in that detected language.
      
//       EXAMPLES:
//       - Topic: "Como fazer café" -> Response: "Aqui está o seu roteiro... (Portuguese)"
//       - Topic: "How to make coffee" -> Response: "Here is your script... (English)"
//       - Topic: "Comment faire du café" -> Response: "Voici votre script... (French)"
      
//       SCRIPT DATA:
//       - Tone: ${formData.tone}
//       - Duration: ${formData.duration}
//       - Target Audience: ${formData.targetAudience}
//     `;

//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { 
//         "Authorization": `Bearer ${GROQ_API_KEY}`, 
//         "Content-Type": "application/json" 
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           { role: "system", content: systemInstruction },
//           { role: "user", content: `Write a script about: "${formData.topic}"` } // Instrução em Inglês para neutralizar
//         ],
//         temperature: 0.3, // BAIXAMOS a temperatura para ela ser mais obediente às regras
//       })
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error?.message || "Groq API Failure");
//     }

//     const aiData = await response.json();
//     const content = aiData.choices[0]?.message?.content;

//     if (!content) throw new Error("AI returned empty content.");

//     // 3. Gravar histórico e descontar crédito
//     await Promise.all([
//       db.collection("scripts").insertOne({
//         userId: userId,
//         title: formData.topic,
//         content: content,
//         createdAt: new Date(),
//         metadata: { 
//             tone: formData.tone, 
//             duration: formData.duration,
//             targetAudience: formData.targetAudience 
//         }
//       }),
//       db.collection("profiles").updateOne(
//         { userId: userId },
//         { $inc: { credits: -1 } }
//       )
//     ]);

//     // Forçar o Next.js a atualizar os dados do Dashboard
//     revalidatePath("/dashboard");

//     return { success: true, content };

//   } catch (error: any) {
//     console.error("LOG GENTONE [Generation Error]:", error.message);
//     return { success: false, error: error.message || "Failed to generate script." };
//   }
// }
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
    const collection = db.collection("profiles"); // Mantive a tua coleção original

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

    // SYSTEM PROMPT ALTERADO PARA ALTA PERFORMANCE (O QUE PEDISTE)
    const systemInstruction = `
      You are GenTone, an elite Viral Scriptwriter for social media. Your scripts are designed to stop the scroll and maximize retention.
      
      CORE DIRECTIVES:
      1. LANGUAGE: Write 100% in the language of the topic: "${formData.topic}".
      2. HOOK: Start with a "Pattern Interrupt". No greetings, no introductions. Start with a result, a shock, or a pain point.
      3. STRUCTURE: Use short, punchy sentences. Add [Visual Cues] for the creator in brackets.
      4. TONE: Strictly use the ${formData.tone} tone.
      5. CTA: Use a direct, high-energy Call to Action.
      6. OUTPUT: Markdown only. No meta-comments.
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
            content: `Write a high-retention script.
            TOPIC: "${formData.topic}"
            AUDIENCE: ${formData.targetAudience}
            DURATION: ${formData.duration}` 
          }
        ],
        temperature: 0.85,
        max_tokens: 1500,
      })
    });

    if (!response.ok) throw new Error("Groq API Failure");

    const aiData = await response.json();
    let content = aiData.choices[0]?.message?.content;

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