// api/kiwify-webhook.js
// Recebe o webhook da Kiwify após cada compra aprovada
// e salva o email do comprador na coleção "compradores" do Firebase

const https = require("https");

// Firebase REST API — sem SDK necessário
const FIREBASE_URL = "https://ironcut-21d-default-rtdb.firebaseio.com";
const FIREBASE_KEY = process.env.FIREBASE_SECRET; // Service Account ou DB Secret

async function salvarComprador(email, dados) {
  // Sanitiza o email para usar como chave no Firebase (sem pontos e @)
  const chave = email.replace(/\./g, "_").replace(/@/g, "__at__");

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      email,
      dataCompra: new Date().toISOString(),
      status: "ativo",
      produto: dados.product_name || "IRONCUT 21D",
      pedido: dados.order_id || "",
    });

    const url = new URL(`${FIREBASE_URL}/compradores/${chave}.json${FIREBASE_KEY ? `?auth=${FIREBASE_KEY}` : ""}`);

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;

    // Kiwify envia status "paid" para compras aprovadas
    // e "refunded" para reembolsos
    const status = payload?.status || payload?.payment_status;
    const email =
      payload?.Customer?.email ||
      payload?.customer?.email ||
      payload?.email;

    if (!email) {
      return res.status(400).json({ error: "Email não encontrado no payload" });
    }

    if (status === "paid" || status === "approved" || status === "complete") {
      // Compra aprovada — libera acesso
      await salvarComprador(email, payload);
      console.log(`✅ Comprador liberado: ${email}`);
      return res.status(200).json({ ok: true, message: "Acesso liberado", email });
    }

    if (status === "refunded" || status === "chargeback") {
      // Reembolso — bloqueia acesso
      const chave = email.replace(/\./g, "_").replace(/@/g, "__at__");
      const fbUrl = `${FIREBASE_URL}/compradores/${chave}.json${FIREBASE_KEY ? `?auth=${FIREBASE_KEY}` : ""}`;
      // Atualiza status para inativo
      await fetch(fbUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inativo", motivoBloqueio: status }),
      });
      console.log(`🚫 Acesso bloqueado (reembolso): ${email}`);
      return res.status(200).json({ ok: true, message: "Acesso bloqueado" });
    }

    // Outro status — ignora
    return res.status(200).json({ ok: true, message: "Status ignorado: " + status });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}
