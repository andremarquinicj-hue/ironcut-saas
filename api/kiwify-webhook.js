// api/kiwify-webhook.js
const https = require("https");

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

    // Kiwify envia tudo dentro de "order"
    const order = payload?.order || payload;

    const email = order?.Customer?.email || order?.customer?.email || null;
    const status = order?.order_status || order?.status || null;
    const nome = order?.Customer?.full_name || order?.Customer?.first_name || "";
    const produto = order?.Product?.product_name || "IRONCUT 21D";
    const pedido = order?.order_id || "";

    if (!email) {
      return res.status(200).json({ ok: false, message: "Email não encontrado" });
    }

    const chave = email.replace(/\./g, "_").replace(/@/g, "__at__");

    if (["paid", "approved", "complete"].includes(status?.toLowerCase())) {
      await firebasePut(`/compradores/${chave}`, {
        email,
        nome,
        dataCompra: new Date().toISOString(),
        status: "ativo",
        produto,
        pedido,
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
