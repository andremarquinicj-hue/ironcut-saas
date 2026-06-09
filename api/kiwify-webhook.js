// api/kiwify-webhook.js
const https = require("https");

const RESEND_API_KEY = "re_SiVnNfkk_3YQXkrAeLMnByaMZhTFX6nuU";
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

async function enviarEmail(para, nome) {
  const primeiroNome = nome.split(" ")[0] || "Aluno";

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bem-vindo ao IRONCUT 21D</title>
</head>
<body style="margin:0;padding:0;background:#050F0F;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- WRAPPER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050F0F;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td align="center" style="padding:40px 40px 32px;background:#080E0E;border:1px solid rgba(0,255,209,0.15);border-bottom:none;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,0.3);">PROTOCOLO DE ELITE</p>
            <h1 style="margin:0;font-size:36px;font-weight:900;letter-spacing:6px;color:#fff;">IRON<span style="color:#00FFD1;">CUT</span></h1>
            <p style="margin:8px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(0,255,209,0.6);">21 DIAS — TRANSFORMAÇÃO CORPORAL COM IA</p>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td style="background:#080E0E;border-left:1px solid rgba(0,255,209,0.15);border-right:1px solid rgba(0,255,209,0.15);padding:0 40px 40px;">
            
            <!-- Badge -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:28px;">
                  <span style="display:inline-block;background:rgba(0,255,209,0.08);border:1px solid rgba(0,255,209,0.25);padding:8px 20px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#00FFD1;">✓ COMPRA CONFIRMADA</span>
                </td>
              </tr>
            </table>

            <!-- Título -->
            <h2 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#fff;line-height:1.2;">Olá, ${primeiroNome}! 🔥<br>Sua transformação começa agora.</h2>
            <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.8;">Você tomou a decisão mais importante. O IRONCUT 21D está pronto para você — treino, dieta e acompanhamento com IA, tudo personalizado para o seu perfil.</p>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="height:1px;background:linear-gradient(to right,transparent,rgba(0,255,209,0.4),transparent);"></td>
              </tr>
            </table>

            <!-- PASSO A PASSO -->
            <p style="margin:0 0 20px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);">SEU PASSO A PASSO</p>

            <!-- Step 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-left:3px solid #00FFD1;">
              <tr>
                <td style="padding:18px 20px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:16px;vertical-align:top;">
                        <span style="display:inline-block;font-size:22px;font-weight:900;color:rgba(0,255,209,0.25);font-family:Georgia,serif;">01</span>
                      </td>
                      <td style="vertical-align:top;">
                        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">Acesse a Página de Boas-vindas</p>
                        <p style="margin:0 0 10px;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">Baixe o Protocolo IRONCUT e todos os seus bônus exclusivos.</p>
                        <a href="https://appironcut.com/ironcut-obrigado.html" style="display:inline-block;background:rgba(0,255,209,0.1);border:1px solid rgba(0,255,209,0.3);color:#00FFD1;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:8px 16px;text-decoration:none;">ACESSAR DOWNLOADS →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Step 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-left:3px solid rgba(0,255,209,0.4);">
              <tr>
                <td style="padding:18px 20px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:16px;vertical-align:top;">
                        <span style="display:inline-block;font-size:22px;font-weight:900;color:rgba(0,255,209,0.25);font-family:Georgia,serif;">02</span>
                      </td>
                      <td style="vertical-align:top;">
                        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">Crie sua Conta no App IRONCUT</p>
                        <p style="margin:0 0 10px;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">Acesse o app, clique em "Começar Agora" e use o mesmo e-mail desta compra para criar sua conta.</p>
                        <a href="https://appironcut.com" style="display:inline-block;background:rgba(0,255,209,0.1);border:1px solid rgba(0,255,209,0.3);color:#00FFD1;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:8px 16px;text-decoration:none;">ABRIR O APP →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Step 3 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-left:3px solid rgba(0,255,209,0.25);">
              <tr>
                <td style="padding:18px 20px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:16px;vertical-align:top;">
                        <span style="display:inline-block;font-size:22px;font-weight:900;color:rgba(0,255,209,0.25);font-family:Georgia,serif;">03</span>
                      </td>
                      <td style="vertical-align:top;">
                        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">Faça seu Diagnóstico Inicial</p>
                        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">Responda o onboarding de 6 etapas (leva menos de 3 minutos) e a IA vai montar seu plano personalizado de treino e dieta.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Step 4 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-left:3px solid rgba(0,255,209,0.15);">
              <tr>
                <td style="padding:18px 20px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:16px;vertical-align:top;">
                        <span style="display:inline-block;font-size:22px;font-weight:900;color:rgba(0,255,209,0.25);font-family:Georgia,serif;">04</span>
                      </td>
                      <td style="vertical-align:top;">
                        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">Comece o Protocolo de 21 Dias</p>
                        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">Siga o plano diário, registre seu peso, marque seus check-ins e acompanhe sua evolução em tempo real no dashboard.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA PRINCIPAL -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td align="center">
                  <a href="https://appironcut.com" style="display:inline-block;background:#00FFD1;color:#050F0F;font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:18px 48px;text-decoration:none;">ACESSAR MEU PROTOCOLO →</a>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="height:1px;background:linear-gradient(to right,transparent,rgba(0,255,209,0.4),transparent);"></td>
              </tr>
            </table>

            <!-- BÔNUS -->
            <p style="margin:0 0 16px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);">SEUS BÔNUS INCLUÍDOS</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);">📋 &nbsp;<strong style="color:#fff;">Protocolo IRONCUT 21 Dias</strong> — Guia completo em PDF</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);">🥗 &nbsp;<strong style="color:#fff;">Receitas Fitness</strong> — 30 receitas práticas e proteicas</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);">💊 &nbsp;<strong style="color:#fff;">Guia Definitivo da Creatina</strong> — Tudo sobre suplementação</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);">⚡ &nbsp;<strong style="color:#fff;">Treino 15 Minutos</strong> — Para dias corridos</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);">🧠 &nbsp;<strong style="color:#fff;">Mentalidade Blindada</strong> — Foco e consistência</td>
              </tr>
            </table>

            <!-- Quote -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,255,209,0.04);border:1px solid rgba(0,255,209,0.1);margin-bottom:0;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0;font-size:16px;font-weight:800;letter-spacing:1px;color:rgba(255,255,255,0.6);line-height:1.3;">"A DISCIPLINA DE HOJE É O<br><span style="color:#00FFD1;">ORGULHO DE AMANHÃ."</span></p>
                  <p style="margin:8px 0 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.2);">IRONCUT Protocol</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#040A0A;border:1px solid rgba(0,255,209,0.1);border-top:none;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.25);">Dúvidas? Entre em contato: <a href="mailto:ironcut21D@outlook.com" style="color:#00FFD1;text-decoration:none;">ironcut21D@outlook.com</a></p>
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">© 2026 IRONCUT 21D — Todos os direitos reservados.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      from: "IRONCUT 21D <noreply@appironcut.com>",
      to: [para],
      subject: "✅ Acesso liberado — Seu Protocolo IRONCUT 21D está pronto!",
      html,
    });

    const req = https.request(
      {
        hostname: "api.resend.com",
        path: "/emails",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
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

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;
    const order = payload?.order || payload;

    const email = order?.Customer?.email || order?.customer?.email || null;
    const status = order?.order_status || order?.status || null;
    const nome = order?.Customer?.full_name || order?.Customer?.first_name || "Aluno";
    const produto = order?.Product?.product_name || "IRONCUT 21D";
    const pedido = order?.order_id || "";

    if (!email) {
      return res.status(200).json({ ok: false, message: "Email nao encontrado" });
    }

    const chave = email.replace(/\./g, "_").replace(/@/g, "__at__");

    if (["paid", "approved", "complete"].includes(status?.toLowerCase())) {
      // Salva no Firebase
      await firebasePut(`/compradores/${chave}`, {
        email, nome,
        dataCompra: new Date().toISOString(),
        status: "ativo",
        produto, pedido,
      });

      // Envia email de boas-vindas
      await enviarEmail(email, nome);

      return res.status(200).json({ ok: true, message: "Acesso liberado + email enviado", email });
    }

    if (["refunded", "chargeback", "cancelled"].includes(status?.toLowerCase())) {
      await firebasePut(`/compradores/${chave}`, {
        email, status: "inativo",
        motivoBloqueio: status,
        dataAtualizacao: new Date().toISOString(),
      });
      return res.status(200).json({ ok: true, message: "Acesso bloqueado", email });
    }

    return res.status(200).json({ ok: true, message: "Status nao processado: " + status });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: String(err.message) });
  }
};
