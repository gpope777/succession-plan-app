// Vercel Serverless Function — proxy to Gemini API
// API key stays 100% server-side, never exposed to the browser

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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured. Add GEMINI_API_KEY to Vercel environment variables.' })
  }

  const { message, history = [] } = req.body
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' })

  // Build conversation history for Gemini (alternating user/model)
  const contents = []

  // Add prior conversation turns
  for (const turn of history) {
    if (turn.role === 'user' || turn.role === 'model') {
      contents.push({ role: turn.role, parts: [{ text: turn.text }] })
    }
  }

  // Add current user message
  contents.push({ role: 'user', parts: [{ text: message }] })

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 900,
            topP: 0.9,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini API error:', err)
      return res.status(502).json({ error: 'Error communicating with AI service', detail: err })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('Unexpected Gemini response shape:', JSON.stringify(data))
      return res.status(502).json({ error: 'Unexpected response from AI service' })
    }

    return res.status(200).json({ text })

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
