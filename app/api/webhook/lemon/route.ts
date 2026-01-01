import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Validar a Assinatura (Segurança contra invasores)
    const rawBody = await req.text();
    const hmac = crypto.createHmac(
      "sha256",
      process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!
    );
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(req.headers.get("x-signature") || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const eventName = body.meta.event_name;
    const userEmail = body.data.attributes.user_email;
    const variantId = body.data.attributes.variant_id.toString();
    const orderId = body.data.id; // ID único da transação

    // 2. Processar eventos de pagamento (Ordem criada ou Subscrição ativada)
    if (eventName === "order_created" || eventName === "subscription_created") {
      const client = await clientPromise;
      const db = client.db("gentone");

      // 3. Mapeamento com os teus IDs REAIS
      const creditMapping: { [key: string]: { credits: number; name: string } } = {
        "1183115": { credits: 15, name: "Starter" },
        "1183117": { credits: 50, name: "Pro" },
        "1183119": { credits: 200, name: "Elite" },
      };

      const planInfo = creditMapping[variantId];

      if (planInfo) {
        // 4. Atualização no MongoDB com Anti-Duplicação (usando processedOrders)
        const result = await db.collection("users").updateOne(
          { 
            email: userEmail, 
            processedOrders: { $ne: orderId } // Garante que não processamos o mesmo pagamento 2 vezes
          },
          { 
            $inc: { credits: planInfo.credits },
            $push: { processedOrders: orderId as never },
            $set: { 
              plan: planInfo.name,
              lastBillingDate: new Date(),
              isPro: true 
            }
          }
        );

        if (result.matchedCount === 0) {
          console.warn(`⚠️ Webhook: Utilizador ${userEmail} não encontrado no banco de dados.`);
        } else {
          console.log(`✅ Sucesso: ${planInfo.credits} créditos adicionados a ${userEmail}`);
        }
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}