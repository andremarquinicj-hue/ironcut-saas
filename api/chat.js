export default async function handler(req, res) {
  // A variável no servidor NÃO precisa de REACT_APP_
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key não configurada" });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
