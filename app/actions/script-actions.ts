"use server";

import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

// 1. Interface para garantir que o TypeScript não bloqueie o Deploy
interface UserProfileResponse {
  success: boolean;
  credits: number;
  plan: string;
  error?: string;
}

// 2. Função para procurar o perfil do utilizador no MongoDB
export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const { userId } = auth();
    if (!userId) {
      return { success: false, credits: 0, plan: "Free Plan", error: "Not authenticated" };
    }

    const client = await clientPromise;
    const db = client.db("gentone");

    // Procura na coleção 'profiles' que confirmamos estar no teu Atlas
    const profile = await db.collection("profiles").findOne({ userId });

    if (!profile) {
      return { success: false, credits: 0, plan: "Free Plan", error: "Profile not found" };
    }

    return {
      success: true,
      credits: profile.credits ?? 0,
      // Se o campo plan ainda não existir, devolve "Free Plan" por padrão
      plan: profile.plan || "Free Plan"
    };
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return { success: false, credits: 0, plan: "Free Plan", error: error.message };
  }
}

// 3. Função para gerar o script (Exemplo de estrutura para GenTone)
export async function generateScriptAction(data: { 
  topic: string; 
  tone: string; 
  duration: string; 
  targetAudience: string;
  platform: string;
}) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clientPromise;
    const db = client.db("gentone");

    // Verificar se tem créditos antes de gerar
    const profile = await db.collection("profiles").findOne({ userId });
    if (!profile || (profile.credits ?? 0) <= 0) {
      return { success: false, error: "No credits left" };
    }

    // AQUI IRIA A TUA LÓGICA DA OPENAI / IA
    // Exemplo de resposta simulada:
    const mockContent = `### GenTone Script for ${data.platform}\n**Topic:** ${data.topic}\n**Tone:** ${data.tone}\n\n[Scene 1]: Hook the audience...`;

    // Descontar 1 crédito após geração bem-sucedida
    await db.collection("profiles").updateOne(
      { userId },
      { $inc: { credits: -1 } }
    );

    return { success: true, content: mockContent };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}