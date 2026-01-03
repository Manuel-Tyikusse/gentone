import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import * as crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-dodo-signature");
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

    // 1. Validação de Segurança (HMAC SHA256)
    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = hmac.update(rawBody).digest("hex");

    if (signature !== digest) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // 2. Processar Pagamento Bem-sucedido
    if (body.type === "payment.success") {
      const data = body.data;
      const externalUserId = data.metadata?.user_id; // ID do Clerk vindo do checkout
      const transactionId = data.transaction_id;
      const creditsToAdd = Number(data.metadata?.credits) || 0;

      if (!externalUserId) {
        return NextResponse.json({ error: "No user_id in metadata" }, { status: 400 });
      }

      const client = await clientPromise;
      const db = client.db("gentone");

      // 3. Atualizar Coleção 'profiles'
      await db.collection("profiles").updateOne(
        { 
          userId: externalUserId, 
          processedOrders: { $ne: transactionId } // Evita duplicados
        },
        { 
          $inc: { credits: creditsToAdd },
          $push: { processedOrders: transactionId as any },
          $set: { 
            // Define o nome do plano com base na compra
            plan: creditsToAdd === 15 ? "Starter" : creditsToAdd === 60 ? "Pro" : "Elite",
            isPro: true,
            lastPayment: new Date()
          }
        }
      );

      console.log(`✅ Créditos adicionados ao utilizador: ${externalUserId}`);
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}