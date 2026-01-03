// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import crypto from "crypto";

// export async function POST(req: Request) {
//   try {
//     const rawBody = await req.text();
    
//     // 1. Validar a Assinatura do Dodo Payments
//     // O Dodo envia a assinatura no cabeçalho 'x-dodo-signature'
//     const signature = req.headers.get("x-dodo-signature");
//     const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

//     if (!signature || !webhookSecret) {
//       return NextResponse.json({ error: "Missing signature or secret" }, { status: 401 });
//     }

//     const hmac = crypto.createHmac("sha256", webhookSecret);
//     const digest = hmac.update(rawBody).digest("hex");

//     if (signature !== digest) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//     }

//     const body = JSON.parse(rawBody);
//     const eventType = body.type; // Ex: 'payment.success'
    
//     // No Dodo, os dados principais estão em body.data
//     const data = body.data;
//     const userEmail = data.customer.email;
//     const productId = data.product_id; 
//     const transactionId = data.transaction_id; // ID único para evitar duplicados

//     // 2. Processar apenas pagamentos bem-sucedidos
//     if (eventType === "payment.success") {
//       const client = await clientPromise;
//       const db = client.db("gentone");

//       // 3. Mapeamento com os IDs do Dodo Payments
//       // Substitua os números abaixo pelos IDs que aparecem no seu painel Dodo (ex: pdt_...)
//       const creditMapping: { [key: string]: { credits: number; name: string } } = {
//         "pdt_starter_id": { credits: 15, name: "Starter" },
//         "pdt_pro_id": { credits: 60, name: "Pro Creator" },
//         "pdt_elite_id": { credits: 200, name: "Elite Agency" },
//       };

//       const planInfo = creditMapping[productId];

//       if (planInfo) {
//         // 4. Atualização no MongoDB com Anti-Duplicação
//         const result = await db.collection("users").updateOne(
//           { 
//             email: userEmail, 
//             processedOrders: { $ne: transactionId } 
//           },
//           { 
//             $inc: { credits: planInfo.credits },
//             $push: { processedOrders: transactionId as never },
//             $set: { 
//               plan: planInfo.name,
//               lastBillingDate: new Date(),
//               isPro: true 
//             }
//           }
//         );

//         if (result.matchedCount === 0) {
//           console.warn(`⚠️ Webhook: Utilizador ${userEmail} não encontrado ou transação já processada.`);
//         } else {
//           console.log(`✅ Sucesso: ${planInfo.credits} créditos adicionados a ${userEmail}`);
//         }
//       }
//     }

//     return NextResponse.json({ message: "Webhook processed successfully" });
//   } catch (err: any) {
//     console.error("❌ Webhook Error:", err.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log("📦 Webhook recebido:", JSON.stringify(body, null, 2));

    const eventType = body.type;
    const data = body.data;

    if (eventType === "payment.success") {
      // Agora buscamos o userId que virá nos metadados do checkout
      const externalUserId = data.metadata?.user_id; 
      const transactionId = data.transaction_id;
      
      // Captura os créditos configurados no Metadata (ex: 15, 60, 200)
      const creditsToAdd = Number(data.metadata?.credits) || 0;

      if (!externalUserId) {
        console.error("❌ Erro: user_id não encontrado nos metadados do webhook.");
        return NextResponse.json({ error: "No user_id in metadata" }, { status: 400 });
      }

      if (creditsToAdd > 0) {
        const client = await clientPromise;
        const db = client.db("gentone");

        const result = await db.collection("users").updateOne(
          { 
            // BUSCA PELO CAMPO userId DO SEU BANCO DE DADOS
            userId: externalUserId,
            processedOrders: { $ne: transactionId } 
          },
          { 
            $inc: { credits: creditsToAdd },
            $push: { processedOrders: transactionId as any },
            $set: { 
              // Define o nome do plano baseado nos créditos comprados
              plan: creditsToAdd === 15 ? "Starter" : creditsToAdd === 60 ? "Pro Creator" : "Elite Agency",
              lastBillingDate: new Date(),
              isPro: true 
            }
          }
        );

        if (result.matchedCount === 0) {
          console.warn(`⚠️ Utilizador com userId ${externalUserId} não encontrado no banco.`);
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`✅ Sucesso! ${creditsToAdd} créditos adicionados ao userId: ${externalUserId}`);
        return NextResponse.json({ message: "Credits added" });
      }
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (err: any) {
    console.error("❌ Erro no Webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}