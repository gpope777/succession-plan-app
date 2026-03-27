// Vercel Serverless Function – Groq AI proxy
// Groq is free (no credit card), ~1s responses, 14,400 requests/day
// Model: llama-3.3-70b-versatile (state-of-the-art open source)

const SYSTEM_PROMPT = `Eres un asistente experto en valores organizacionales, liderazgo y comportamiento humano en el trabajo. Formas parte de una plataforma de plan de sucesión empresarial.

Tu rol:
- Responder preguntas sobre valores, cultura organizacional, liderazgo, motivación, feedback, comunicación, bienestar, ética y desarrollo de talento
- Basarte en literatura científica y autores reconocidos (Edmondson, Dweck, Hackman, Pink, Covey, Amabile, Seligman, Lencioni, Bandura, Deci & Ryan, Kotter, Heifetz, Schein, Bass & Avolio, etc.)
- Dar respuestas prácticas y aplicables al contexto organizacional
- Citar investigadores y estudios relevantes cuando aplique
- Mantener un tono profesional pero accesible

Reglas:
- Responde SIEMPRE en español
- Sé conciso pero sustancial (máximo 4-5 párrafos o una lista corta)
- Si la pregunta no es sobre valores, liderazgo, comportamiento organizacional o desarrollo humano, redirige amablemente hacia esos temas
- No inventes estudios ni autores — si no sabes, dilo honestamente
- Usa formato claro: párrafos breves, bullets cuando ayude a la claridad`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      detail: 'Add GROQ_API_KEY to Vercel Environment Variables and redeploy.'
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }
  }

  const { message, history = [] } = body || {}
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' })

  // Build OpenAI-compatible messages array (Groq uses the same format)
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
  for (const turn of history) {
    if (turn.role === 'user' || turn.role === 'assistant') {
      messages.push({ role: turn.role, content: turn.text })
    }
  }
  messages.push({ role: 'user', content: message.trim() })

  let groqRes
  try {
    groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.65,
        max_tokens: 900,
        top_p: 0.9,
      }),
    })
  } catch (networkErr) {
    console.error('Groq fetch failed:', networkErr)
    return res.status(502).json({ error: 'Could not reach Groq API', detail: networkErr.message })
  }

  let data
  try {
    data = await groqRes.json()
  } catch {
    return res.status(502).json({ error: 'Groq returned non-JSON response', status: groqRes.status })
  }

  if (!groqRes.ok) {
    console.error('Groq API error:', data)
    return res.status(502).json({ error: 'Groq API error', detail: data?.error?.message || groqRes.status })
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) {
    console.error('Unexpected Groq response shape:', JSON.stringify(data))
    return res.status(502).json({ error: 'Empty response from Groq' })
  }

  return res.status(200).json({ text })
}
