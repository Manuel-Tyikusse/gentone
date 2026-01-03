"use server";

import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

// Interface para evitar erros de tipagem no Deploy
interface UserProfileResponse {
  success: boolean;
  credits: number;
  plan: string;
  error?: string;
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    // CORREÇÃO CRÍTICA: auth() agora é assíncrono nas versões recentes do Clerk
    const { userId } = await auth(); 
    
    if (!userId) {
      return { success: false, credits: 0, plan: "Free Plan", error: "Not authenticated" };
    }

    const client = await clientPromise;
    const db = client.db("gentone");

    // Procura na coleção 'profiles' conforme visto no teu MongoDB
    const profile = await db.collection("profiles").findOne({ userId });

    if (!profile) {
      return { success: false, credits: 0, plan: "Free Plan", error: "Profile not found" };
    }

    return {
      success: true,
      credits: profile.credits ?? 0,
      // Se o campo plan não existir no banco, envia "Free Plan"
      plan: profile.plan || "Free Plan"
    };
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return { success: false, credits: 0, plan: "Free Plan", error: error.message };
  }
}

// Exemplo da tua função de geração (deve descontar créditos)
export async function generateScriptAction(data: any) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clientPromise;
    const db = client.db("gentone");

    // Lógica para descontar crédito...
    await db.collection("profiles").updateOne(
      { userId },
      { $inc: { credits: -1 } }
    );

    return { success: true, content: "O teu guião viral está pronto..." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}