/* =====================================================
   PRADO SPORTS AI v9 — Proxy seguro para Claude AI
   
   Este arquivo fica na Vercel e protege sua chave Anthropic.
   A chave NUNCA aparece no frontend (app.js).
   
   Variável obrigatória na Vercel:
   ANTHROPIC_API_KEY = sk-ant-...
===================================================== */

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS — permite o app chamar este endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY não configurada na Vercel');
    return res.status(500).json({ error: 'Chave da IA não configurada. Configure ANTHROPIC_API_KEY na Vercel.' });
  }

  try {
    const body = req.body;

    // Força o modelo correto e limita tokens para controlar custo
    const payload = {
      model: body.model || 'claude-sonnet-4-6',
      max_tokens: Math.min(body.max_tokens || 1000, 1500),
      system: body.system || 'Você é o Prado IA, analista de futebol e apostas esportivas. Responda em português brasileiro.',
      messages: body.messages || []
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({
        error: data?.error?.message || `Erro da API: ${response.status}`
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy Claude error:', err);
    return res.status(500).json({ error: 'Erro interno no proxy da IA: ' + err.message });
  }
}
