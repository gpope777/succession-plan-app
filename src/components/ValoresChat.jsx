import { useState, useRef, useEffect } from 'react'
import { KB, SUGGESTED } from '../data/valoresKB'

// ─── Matching Engine ─────────────────────────────────────────────────────────────

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOP_WORDS = new Set([
  'el','la','los','las','un','una','unos','unas','de','del','al',
  'en','con','por','para','que','es','son','se','me','te','le',
  'lo','y','o','a','como','que','hay','si','no','su','sus','mi',
  'mas','pero','cuando','donde','cual','quien','esto','eso',
  'como','sobre','entre','hasta','desde','muy','tan','cada',
])

function extractKeywords(text) {
  return normalize(text)
    .split(' ')
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

function scoreEntry(entry, userKeywords) {
  let score = 0
  const normTriggers = entry.triggers.map(t => normalize(t))
  const normTitle    = normalize(entry.title)
  const normResponse = normalize(entry.response.slice(0, 300))

  for (const kw of userKeywords) {
    // Exact trigger match (highest value)
    for (const trigger of normTriggers) {
      if (trigger === kw) score += 10
      else if (trigger.includes(kw) || kw.includes(trigger)) score += 5
      else if (trigger.split(' ').some(w => w === kw)) score += 3
    }
    // Title match
    if (normTitle.includes(kw)) score += 4
    // Response preview match
    if (normResponse.includes(kw)) score += 1
  }

  // Bonus: full phrase match
  const inputFull = userKeywords.join(' ')
  for (const trigger of normTriggers) {
    if (trigger.includes(inputFull) && inputFull.length > 4) score += 15
  }

  return score
}

function findMatch(userInput) {
  const keywords = extractKeywords(userInput)
  if (keywords.length === 0) return null

  let best = null
  let bestScore = 0

  for (const entry of KB) {
    const s = scoreEntry(entry, keywords)
    if (s > bestScore) { bestScore = s; best = entry }
  }

  return bestScore >= 3 ? best : null
}

function buildResponse(entry) {
  return {
    type: 'bot',
    title: entry.title,
    authors: entry.authors,
    text: entry.response,
    id: Date.now() + Math.random(),
  }
}

const FALLBACKS = [
  'Puedo ayudarte con temas como seguridad psicológica, mentalidad de crecimiento, liderazgo, motivación, feedback, comunicación efectiva, bienestar y más. ¿Sobre cuál te gustaría aprender?',
  'No encontré una coincidencia exacta para eso. Prueba preguntar sobre un valor específico o un concepto como "engagement", "burnout", "confianza" o "innovación".',
  'Puedo consultar mi base de conocimiento científica sobre: Edmondson, Dweck, Hackman, Pink, Covey, Amabile, Seligman, Lencioni y muchos más. ¿Qué quieres explorar?',
]
let fallbackIdx = 0

// ─── Message Renderer ─────────────────────────────────────────────────────────────
function BotMessage({ msg }) {
  const paragraphs = msg.text.split('\n\n').filter(Boolean)

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px 16px 16px 4px',
      padding: '16px 18px',
      maxWidth: '92%',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
    }}>
      {msg.title && (
        <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>
          {msg.title}
        </div>
      )}
      {msg.authors && (
        <div style={{
          fontSize: 11, color: '#7c3aed', fontWeight: 600,
          marginBottom: 12, fontStyle: 'italic',
        }}>
          📚 {msg.authors}
        </div>
      )}
      {paragraphs.map((para, i) => {
        // Render bold **text**
        const rendered = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        if (para.startsWith('• ') || para.startsWith('- ')) {
          const items = para.split('\n').filter(Boolean)
          return (
            <ul key={i} style={{ margin: '8px 0', paddingLeft: 18, listStyle: 'none' }}>
              {items.map((item, j) => (
                <li key={j} style={{ fontSize: 13, color: '#374151', marginBottom: 5, lineHeight: 1.55, display: 'flex', gap: 6 }}>
                  <span style={{ color: '#0d9488', flexShrink: 0 }}>▸</span>
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/^[•\-]\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: '8px 0' }}
            dangerouslySetInnerHTML={{ __html: rendered }} />
        )
      })}
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

// ─── Main Chat Component ──────────────────────────────────────────────────────────
export default function ValoresChat() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      id: 'welcome',
      title: '👋 Hola, soy tu asistente de valores organizacionales',
      authors: 'Base de conocimiento: Edmondson · Dweck · Hackman · Pink · Covey · Amabile · Seligman · Lencioni y más',
      text: 'Puedo ayudarte a entender cómo la ciencia explica los valores que guían nuestro equipo y qué dice la investigación sobre comportamiento organizacional.\n\nPuedes preguntarme sobre seguridad psicológica, mentalidad de crecimiento, liderazgo, motivación, feedback, bienestar, comunicación efectiva y mucho más. ¿Qué quieres explorar hoy?',
    },
  ])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)
  const [shown,    setShown]    = useState([])
  const messagesEnd = useRef(null)
  const inputRef    = useRef(null)

  // Pick 4 random suggested questions on open
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

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { type: 'user', text: text.trim(), id: Date.now() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)

    // Simulate thinking delay (400-900ms)
    const delay = 400 + Math.random() * 500
    setTimeout(() => {
      const match = findMatch(text)
      let botMsg
      if (match) {
        botMsg = buildResponse(match)
      } else {
        botMsg = {
          type: 'bot',
          id: Date.now() + 1,
          text: FALLBACKS[fallbackIdx % FALLBACKS.length],
        }
        fallbackIdx++
      }
      setMessages(m => [...m, botMsg])
      setTyping(false)
      // Refresh suggestions
      setShown([...SUGGESTED].sort(() => Math.random() - 0.5).slice(0, 4))
    }, delay)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const pendingCount = messages.filter(m => m.type === 'user').length

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
          {pendingCount > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 0,
              width: 18, height: 18, borderRadius: '50%',
              background: '#ef4444', color: 'white',
              fontSize: 10, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{pendingCount > 9 ? '9+' : pendingCount}</span>
          )}
        </button>
      )}

      {/* ── Chat Panel ───────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 400, height: 580,
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
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🧠</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>
                Asistente de Valores
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
                Literatura científica · Siempre disponible · Sin costo
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
                  {q.length > 45 ? q.slice(0, 43) + '…' : q}
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
                fontSize: 13, fontFamily: 'Inter, sans-serif',
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
                color: 'white', fontSize: 16, cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
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
