import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-dodo-signature");
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

    // 1. Validação de Assinatura (Segurança Total)
    if (!signature || !webhookSecret) {
      console.error("❌ Falta assinatura ou secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = hmac.update(rawBody).digest("hex");

    if (signature !== digest) {
      console.error("❌ Assinatura inválida");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const eventType = body.type;
    const data = body.data;

    // 2. Processar apenas pagamentos bem-sucedidos
    if (eventType === "payment.success") {
      // Capturamos o userId que você configurou no link do checkout (metadata[user_id])
      const externalUserId = data.metadata?.user_id;
      const transactionId = data.transaction_id;
      
      // Capturamos os créditos diretamente do Metadata do Dodo
      const creditsToAdd = Number(data.metadata?.credits) || 0;

      if (!externalUserId) {
        console.error("⚠️ Webhook ignorado: user_id não encontrado no metadata.");
        return NextResponse.json({ error: "No user_id provided" }, { status: 400 });
      }

      const client = await clientPromise;
      const db = client.db("gentone");

      // 3. Atualização no MongoDB (Coleção 'profiles')
      const result = await db.collection("profiles").updateOne(
        { 
          userId: externalUserId, 
          processedOrders: { $ne: transactionId } // Anti-duplicação
        },
        { 
          $inc: { credits: creditsToAdd },
          $push: { processedOrders: transactionId as any },
          $set: { 
            // Define o nome do plano com base nos créditos comprados
            plan: creditsToAdd === 15 ? "Starter" : creditsToAdd === 60 ? "Pro" : "Elite",
            lastBillingDate: new Date(),
            isPro: true 
          }
        }
      );

      if (result.matchedCount === 0) {
        console.warn(`⚠️ Utilizador ${externalUserId} não encontrado ou pedido já processado.`);
        return NextResponse.json({ message: "User not found or duplicate" }, { status: 404 });
      }

      console.log(`✅ Sucesso: ${creditsToAdd} créditos e plano atualizados para ${externalUserId}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}