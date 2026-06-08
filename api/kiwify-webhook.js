// api/kiwify-webhook.js
const https = require("https");

const FIREBASE_URL = "https://ironcut-21d-default-rtdb.firebaseio.com";

async function firebasePut(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = https.request(
      {
        hostname: "ironcut-21d-default-rtdb.firebaseio.com",
        path: path + ".json",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(d));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;

    // Loga o payload completo no Firebase para debug
    await firebasePut("/logs/ultimo_webhook", {
      timestamp: new Date().toISOString(),
      payload: payload,
    });

    // Kiwify envia o email em diferentes lugares dependendo da versão
    const email =
      payload?.Customer?.email ||
      payload?.customer?.email ||
      payload?.buyer?.email ||
      payload?.data?.customer?.email ||
      payload?.data?.buyer?.email ||
      payload?.email ||
      null;

    // Status pode vir em vários formatos
    const status =
      payload?.status ||
      payload?.payment_status ||
      payload?.order_status ||
      payload?.data?.status ||
      null;

    // Loga email e status encontrados
    await firebasePut("/logs/ultimo_processado", {
      timestamp: new Date().toISOString(),
      email_encontrado: email,
      status_encontrado: status,
      chaves_payload: Object.keys(payload || {}),
    });

    if (!email) {
      return res.status(200).json({ ok: false, message: "Email não encontrado", chaves: Object.keys(payload || {}) });
    }

    const chave = email.replace(/\./g, "_").replace(/@/g, "__at__");

    if (["paid", "approved", "complete", "waiting_payment"].includes(status?.toLowerCase())) {
      await firebasePut(`/compradores/${chave}`, {
        email,
        dataCompra: new Date().toISOString(),
        status: "ativo",
        produto: payload?.Product?.name || payload?.product?.name || payload?.data?.product?.name || "IRONCUT 21D",
        pedido: payload?.order_id || payload?.id || "",
      });
      return res.status(200).json({ ok: true, message: "Acesso liberado", email });
    }

    if (["refunded", "chargeback", "cancelled"].includes(status?.toLowerCase())) {
      await firebasePut(`/compradores/${chave}`, {
        email,
        status: "inativo",
        motivoBloqueio: status,
        dataAtualizacao: new Date().toISOString(),
      });
      return res.status(200).json({ ok: true, message: "Acesso bloqueado", email });
    }

    return res.status(200).json({ ok: true, message: "Status não processado: " + status });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
}
