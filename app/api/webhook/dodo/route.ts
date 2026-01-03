
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Webhook recebido para GenTone:", JSON.stringify(body, null, 2));

    const eventType = body.type;
    const data = body.data;

    if (eventType === "payment.success") {
      const externalUserId = data.metadata?.user_id; 
      const transactionId = data.transaction_id;
      const creditsToAdd = Number(data.metadata?.credits) || 0;

      if (!externalUserId) {
        return NextResponse.json({ error: "No user_id in metadata" }, { status: 400 });
      }

      const client = await clientPromise;
      const db = client.db("gentone");

      // ALTERAÇÃO CRÍTICA: Mudamos de "users" para "profiles" como está no seu Atlas
      const result = await db.collection("profiles").updateOne(
        { 
          userId: externalUserId, 
          processedOrders: { $ne: transactionId } 
        },
        { 
          $inc: { credits: creditsToAdd },
          $push: { processedOrders: transactionId as any },
          $set: { 
            plan: creditsToAdd === 15 ? "Starter" : creditsToAdd === 60 ? "Pro" : "Elite",
            isPro: true,
            lastPayment: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        console.warn(`⚠️ Utilizador ${externalUserId} não encontrado na coleção profiles.`);
        return NextResponse.json({ error: "User not found in profiles" }, { status: 404 });
      }

      console.log(`✅ Sucesso! ${creditsToAdd} créditos adicionados ao profile ${externalUserId}`);
      return NextResponse.json({ message: "Credits added to profile" });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (err: any) {
    console.error("❌ Erro no Webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}