// Vercel Serverless Function – Gemini proxy
// Node.js runtime (CommonJS-compatible via Vercel's wrapper)

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

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      detail: 'Add GEMINI_API_KEY to Vercel Environment Variables and redeploy.'
    })
  }

  let body = req.body
  // Vercel usually parses JSON automatically; guard in case it doesn't
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }
  }

  const { message, history = [] } = body || {}
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' })

  // Build Gemini contents array from history + current message
  const contents = []
  for (const turn of history) {
    if (turn.role === 'user' || turn.role === 'model') {
      contents.push({ role: turn.role, parts: [{ text: turn.text }] })
    }
  }
  contents.push({ role: 'user', parts: [{ text: message.trim() }] })

  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  let geminiRes
  try {
    geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 900,
          topP: 0.9,
        },
      }),
    })
  } catch (networkErr) {
    console.error('Gemini fetch failed:', networkErr)
    return res.status(502).json({ error: 'Could not reach Gemini API', detail: networkErr.message })
  }

  let data
  try {
    data = await geminiRes.json()
  } catch {
    return res.status(502).json({ error: 'Gemini returned non-JSON response', status: geminiRes.status })
  }

  if (!geminiRes.ok) {
    console.error('Gemini API error:', data)
    return res.status(502).json({ error: 'Gemini API error', detail: data?.error?.message || geminiRes.status })
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    console.error('Unexpected Gemini shape:', JSON.stringify(data))
    return res.status(502).json({ error: 'Empty response from Gemini', raw: data })
  }

  return res.status(200).json({ text })
}
