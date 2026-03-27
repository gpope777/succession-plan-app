import { useState, useRef, useEffect } from 'react'

// ─── Suggested starter questions ─────────────────────────────────────────────
const SUGGESTED = [
  '¿Qué dice la ciencia sobre la seguridad psicológica en equipos?',
  '¿Cómo desarrollar una mentalidad de crecimiento en el equipo?',
  '¿Qué motiva realmente a las personas en el trabajo?',
  '¿Cómo construir confianza dentro de un equipo?',
  '¿Qué dice la investigación sobre el liderazgo efectivo?',
  '¿Cómo dar feedback que realmente genere cambio?',
  '¿Qué es el bienestar organizacional y cómo se mide?',
  '¿Cómo prevenir el burnout en equipos de alto rendimiento?',
  '¿Qué diferencia a los equipos de alto desempeño?',
  '¿Cómo fomentar la innovación y creatividad en el trabajo?',
  '¿Qué dice Lencioni sobre las disfunciones de equipo?',
  '¿Cómo crear una cultura organizacional sólida?',
  '¿Qué es la teoría de la autodeterminación de Deci y Ryan?',
  '¿Cómo manejar conversaciones difíciles en el trabajo?',
  '¿Qué dice Project Aristotle sobre equipos efectivos?',
]

// ─── Message Renderer ─────────────────────────────────────────────────────────
function BotMessage({ msg }) {
  // Convert **bold** markdown and render paragraphs / bullet lists
  const renderParagraph = (para, i) => {
    const html = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    if (para.match(/^[•\-\*]\s/m)) {
      const items = para.split('\n').filter(Boolean)
      return (
        <ul key={i} style={{ margin: '8px 0', paddingLeft: 18, listStyle: 'none' }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 13, color: '#374151', marginBottom: 5, lineHeight: 1.55, display: 'flex', gap: 6 }}>
              <span style={{ color: '#0d9488', flexShrink: 0 }}>▸</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/^[•\-\*]\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            </li>
          ))}
        </ul>
      )
    }
    return (
      <p key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: '7px 0' }}
        dangerouslySetInnerHTML={{ __html: html }} />
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px 16px 16px 4px',
      padding: '16px 18px',
      maxWidth: '92%',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
    }}>
      {msg.error
        ? <p style={{ fontSize: 13, color: '#ef4444', margin: 0 }}>{msg.text}</p>
        : msg.text.split('\n\n').filter(Boolean).map(renderParagraph)
      }
    </div>
  )
}

function UserMessage({ msg }) {
  return (
    <div style={{
      background: '#0d9488',
      color: 'white',
      borderRadius: '16px 16px 4px 16px',
      padding: '12px 16px',
      maxWidth: '80%',
      alignSelf: 'flex-end',
      fontSize: 14,
      lineHeight: 1.5,
    }}>
      {msg.text}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{
      background: 'white', borderRadius: '16px 16px 16px 4px',
      padding: '14px 18px', maxWidth: '80px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      display: 'flex', gap: 5, alignItems: 'center',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#0d9488', opacity: 0.5,
          animation: `bounce 1.2s ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ─── Main Chat Component ───────────────────────────────────────────────────────
export default function ValoresChat() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      id: 'welcome',
      text: 'Hola 👋 Soy tu asistente de valores y comportamiento organizacional.\n\nPuedo ayudarte a entender qué dice la ciencia sobre liderazgo, seguridad psicológica, motivación, feedback, bienestar, cultura, confianza, innovación y mucho más.\n\n¿Qué quieres explorar hoy?',
    },
  ])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)
  const [shown,    setShown]    = useState([])
  // Conversation history for multi-turn context (Gemini format)
  const historyRef  = useRef([])
  const messagesEnd = useRef(null)
  const inputRef    = useRef(null)

  useEffect(() => {
    if (open && shown.length === 0) {
      const shuffled = [...SUGGESTED].sort(() => Math.random() - 0.5).slice(0, 4)
      setShown(shuffled)
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text) => {
    if (!text.trim() || typing) return

    const userMsg = { type: 'user', text: text.trim(), id: Date.now() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)

    // Snapshot history BEFORE adding current turn
    const historySnapshot = [...historyRef.current]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: historySnapshot,
        }),
      })

      // Try to parse JSON regardless of status code so we get the real error
      let data
      try { data = await res.json() } catch { data = null }

      if (!res.ok || data?.error) {
        const msg = data?.error || `HTTP ${res.status}`
        const detail = data?.detail ? ` (${data.detail})` : ''
        throw new Error(msg + detail)
      }

      if (!data?.text) throw new Error('empty response')

      // Add to conversation history for future turns
      historyRef.current = [
        ...historySnapshot,
        { role: 'user',  text: text.trim() },
        { role: 'model', text: data.text },
      ]

      setMessages(m => [...m, {
        type: 'bot',
        id: Date.now() + 1,
        text: data.text,
      }])

    } catch (err) {
      console.error('Chat error:', err.message)
      const lower = err.message.toLowerCase()
      let userMsg
      if (lower.includes('api key') || lower.includes('not configured')) {
        userMsg = '⚙️ El asistente aún no está configurado. Agrega GEMINI_API_KEY en Vercel → Settings → Environment Variables y haz Redeploy.'
      } else if (lower.includes('fetch') || lower.includes('networkerror') || lower.includes('failed to fetch')) {
        userMsg = '⚠️ No se pudo alcanzar el servidor. Verifica que el sitio esté desplegado en Vercel (no en localhost).'
      } else {
        userMsg = `⚠️ Error: ${err.message}`
      }
      setMessages(m => [...m, {
        type: 'bot',
        id: Date.now() + 1,
        error: true,
        text: userMsg,
      }])
    } finally {
      setTyping(false)
      setShown([...SUGGESTED].sort(() => Math.random() - 0.5).slice(0, 4))
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Float Button ─────────────────────────────────────────────── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 28, right: 28,
            width: 58, height: 58, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d9488, #7c3aed)',
            border: 'none', boxShadow: '0 4px 20px rgba(13,148,136,0.45)',
            cursor: 'pointer', fontSize: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          title="Asistente de valores organizacionales"
        >
          💬
        </button>
      )}

      {/* ── Chat Panel ───────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 420, height: 600,
          background: '#f8fafc',
          borderRadius: 20,
          boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden',
          animation: 'slideUp 0.25s ease',
          border: '1px solid #e2e8f0',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0d9488, #7c3aed)',
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>🧠</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>
                Asistente de Valores
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>
                IA · Literatura científica organizacional
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: 'white', borderRadius: 8, padding: '5px 9px',
                cursor: 'pointer', fontSize: 16, fontWeight: 700,
              }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.type === 'bot'
                  ? <BotMessage msg={msg} />
                  : <UserMessage msg={msg} />}
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Suggested questions */}
          {shown.length > 0 && !typing && (
            <div style={{
              padding: '8px 14px 4px', flexShrink: 0,
              borderTop: '1px solid #f1f5f9',
              display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {shown.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '5px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    border: '1.5px solid #e2e8f0',
                    background: 'white', color: '#475569',
                    cursor: 'pointer', transition: 'all 0.15s',
                    lineHeight: 1.3, textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.color = '#0d9488' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569' }}
                >
                  {q.length > 48 ? q.slice(0, 46) + '…' : q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 14px 14px', flexShrink: 0,
            borderTop: '1px solid #e2e8f0', background: 'white',
            display: 'flex', gap: 8, alignItems: 'flex-end',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Pregunta sobre valores, liderazgo, motivación..."
              rows={1}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid #e2e8f0',
                borderRadius: 12, padding: '10px 13px',
                fontSize: 13, fontFamily: 'inherit',
                outline: 'none', lineHeight: 1.5,
                maxHeight: 90, overflowY: 'auto',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#0d9488'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              style={{
                width: 38, height: 38, borderRadius: 12, border: 'none',
                background: input.trim() && !typing ? '#0d9488' : '#e2e8f0',
                color: 'white', fontSize: 16,
                cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.15s',
              }}
            >➤</button>
          </div>
        </div>
      )}
    </>
  )
}
