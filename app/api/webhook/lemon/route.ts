import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Validar a Assinatura (Segurança Máxima)
    const rawBody = await req.text();
    const hmac = crypto.createHmac(
      "sha256",
      process.env.LEMON_SQUEEZY_WEBHOOK_SECRET! // Tu defines esta chave no painel do Lemon e no .env
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
    const orderId = body.data.id; // ID único da ordem

    // 2. Só processamos se o evento for de ordem criada
    if (eventName === "order_created") {
      const client = await clientPromise;
      const db = client.db("gentone");

      // 3. Mapeamento de Variant IDs (Substitui pelos IDs reais do teu painel Lemon Squeezy)
      const creditMapping: { [key: string]: number } = {
        "555001": 10,  // Starter
        "555002": 50,  // Pro ($29)
        "555003": 200, // Elite
      };

      const creditsToAdd = creditMapping[variantId] || 0;

      if (creditsToAdd > 0) {
        // 4. Atualização Atómica e Anti-Duplicação
        // Usamos o orderId para garantir que não processamos a mesma compra duas vezes
        const result = await db.collection("users").updateOne(
          { 
            email: userEmail, 
            processedOrders: { $ne: orderId } // Só atualiza se o orderId não estiver na lista
          },
          { 
            $inc: { credits: creditsToAdd },
            $push: { processedOrders: orderId as never } // Regista a ordem como processada
          }
        );

        if (result.modifiedCount === 0) {
          console.log(`Order ${orderId} already processed or user not found.`);
        }
      }
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}