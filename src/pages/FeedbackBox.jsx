import { useState, useEffect } from 'react'

const STORAGE_KEY   = 'pns-feedback-v1'
const CONFIG_KEY    = 'pns-feedback-config-v1'
const EVAL_KEY      = 'pns-process-evals-v1'

const CATEGORIES = [
  { id: 'positivo',   label: 'Situación positiva',     icon: '🌟', color: '#16a34a', bg: '#dcfce7', desc: 'Algo que va bien, un logro, un reconocimiento' },
  { id: 'mejora',     label: 'Área de mejora',          icon: '⚠️', color: '#ca8a04', bg: '#fef9c3', desc: 'Una situación que podría mejorar en el equipo o proceso' },
  { id: 'sugerencia', label: 'Sugerencia',              icon: '💡', color: '#2563eb', bg: '#eff6ff', desc: 'Una idea o propuesta para el equipo o la organización' },
  { id: 'personal',   label: 'Situación personal',      icon: '🤝', color: '#7c3aed', bg: '#f5f3ff', desc: 'Algo que afecta tu bienestar, carga de trabajo o desarrollo' },
  { id: 'otro',       label: 'Otro',                    icon: '📝', color: '#475569', bg: '#f8fafc', desc: 'Cualquier otro tema que quieras comunicar' },
]

// ─── Process Evaluation questions ───────────────────────────────────────────
const EVAL_QUESTIONS = [
  { id: 'clarity',     label: '¿Qué tan claro está tu plan de desarrollo individual?',              max: 5 },
  { id: 'fairness',    label: '¿Sientes que el proceso de evaluación es justo y transparente?',     max: 5 },
  { id: 'support',     label: '¿Tu manager te brinda apoyo activo en el proceso?',                  max: 5 },
  { id: 'platform',    label: '¿Qué tan útil es esta plataforma para tu desarrollo?',               max: 5 },
  { id: 'growth',      label: '¿Sientes que el plan está contribuyendo a tu crecimiento real?',     max: 5 },
]

const SCORE_LABELS = { 1: 'Muy bajo', 2: 'Bajo', 3: 'Regular', 4: 'Bueno', 5: 'Excelente' }
const NPS_COLOR    = s => s >= 9 ? '#16a34a' : s >= 7 ? '#ca8a04' : '#dc2626'

function loadFeedback()  { try { return JSON.parse(localStorage.getItem(STORAGE_KEY))  || [] } catch { return [] } }
function loadConfig()    { try { return JSON.parse(localStorage.getItem(CONFIG_KEY))   || {} } catch { return {} } }
function loadEvals()     { try { return JSON.parse(localStorage.getItem(EVAL_KEY))     || [] } catch { return [] } }
function saveFeedback(f) { localStorage.setItem(STORAGE_KEY, JSON.stringify(f)) }
function saveConfig(c)   { localStorage.setItem(CONFIG_KEY,  JSON.stringify(c)) }
function saveEvals(e)    { localStorage.setItem(EVAL_KEY,    JSON.stringify(e)) }

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso)
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'Justo ahora'
  if (mins < 60)  return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `Hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `Hace ${days} día${days !== 1 ? 's' : ''}`
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ value, onChange, max = 5 }) {
  const [hov, setHov] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onMouseEnter={() => setHov(n)}
          onMouseLeave={() => setHov(0)}
          onClick={() => onChange(n)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            fontSize: 26, lineHeight: 1,
            filter: n <= (hov || value) ? 'none' : 'grayscale(1) opacity(0.3)',
            transform: n <= (hov || value) ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.12s',
          }}
        >⭐</button>
      ))}
      {value > 0 && (
        <span style={{ fontSize: 13, color: '#64748b', marginLeft: 4 }}>
          {SCORE_LABELS[value]}
        </span>
      )}
    </div>
  )
}

// ─── NPS Selector ────────────────────────────────────────────────────────────
function NpsSelector({ value, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {Array.from({ length: 11 }, (_, i) => i).map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 40, height: 40, borderRadius: 8, border: '2px solid',
              borderColor: value === n ? NPS_COLOR(n) : '#e2e8f0',
              background: value === n ? NPS_COLOR(n) : 'white',
              color: value === n ? 'white' : '#374151',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >{n}</button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 12, color: '#dc2626' }}>0 = Definitivamente no</span>
        <span style={{ fontSize: 12, color: '#16a34a' }}>10 = Definitivamente sí</span>
      </div>
    </div>
  )
}

// ─── Admin Config Panel ─────────────────────────────────────────────────────
function ConfigPanel({ config, onSave }) {
  const [draft, setDraft] = useState(config)

  return (
    <div style={{
      background: '#1a2e3b', borderRadius: 14, padding: '22px 26px',
      marginBottom: 24, color: 'white',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 20 }}>⚙️</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Configuración de correo electrónico</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Visible solo en modo HR. Configura aquí a dónde llega el feedback anónimo.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ flex: '2 1 320px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
            Formspree Endpoint URL
          </label>
          <input
            value={draft.formspreeUrl || ''}
            onChange={e => setDraft(d => ({ ...d, formspreeUrl: e.target.value }))}
            placeholder="https://formspree.io/f/XXXXXXXX"
            style={{
              width: '100%', padding: '9px 13px', borderRadius: 8,
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)', color: 'white',
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>
            Crea una cuenta gratis en{' '}
            <a href="https://formspree.io" target="_blank" rel="noreferrer" style={{ color: '#5eead4' }}>formspree.io</a>
            {' '}→ New Form → copia el endpoint.
          </div>
        </div>

        <div style={{ flex: '1 1 220px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
            Correo de notificación
          </label>
          <input
            value={draft.notifEmail || ''}
            onChange={e => setDraft(d => ({ ...d, notifEmail: e.target.value }))}
            placeholder="hr@pnspr.com"
            style={{
              width: '100%', padding: '9px 13px', borderRadius: 8,
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)', color: 'white',
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => { saveConfig(draft); onSave(draft) }}
          style={{
            padding: '9px 22px', borderRadius: 8, border: 'none',
            background: '#0d9488', color: 'white', fontWeight: 700,
            fontSize: 14, cursor: 'pointer',
          }}
        >
          Guardar configuración
        </button>
        {draft.formspreeUrl
          ? <span style={{ fontSize: 13, color: '#5eead4' }}>✓ Correo configurado</span>
          : <span style={{ fontSize: 13, color: '#f59e0b' }}>⚠ Sin configurar — solo guardado local</span>}
      </div>
    </div>
  )
}

// ─── Feedback Card (admin view) ─────────────────────────────────────────────
function FeedbackCard({ item, onMarkReviewed, onDelete }) {
  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[4]
  return (
    <div style={{
      background: 'white', borderRadius: 12, padding: '16px 20px',
      border: `1.5px solid ${item.status === 'reviewed' ? '#e2e8f0' : cat.color + '44'}`,
      opacity: item.status === 'reviewed' ? 0.7 : 1,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: cat.bg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 18, flexShrink: 0,
        }}>{cat.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ background: cat.bg, color: cat.color, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{cat.label}</span>
            <span style={{
              background: item.anonymous ? '#f5f3ff' : '#eff6ff',
              color: item.anonymous ? '#7c3aed' : '#2563eb',
              borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600,
            }}>{item.anonymous ? '🕵️ Anónimo' : `👤 ${item.role || 'Identificado'}`}</span>
            {item.status === 'reviewed' && (
              <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>✓ Revisado</span>
            )}
            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{timeAgo(item.timestamp)}</span>
          </div>
          {item.subject && (
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 6 }}>{item.subject}</div>
          )}
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{item.message}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
        {item.status !== 'reviewed' && (
          <button onClick={() => onMarkReviewed(item.id)} style={{
            padding: '6px 14px', borderRadius: 8, border: 'none',
            background: '#dcfce7', color: '#16a34a', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>✓ Marcar revisado</button>
        )}
        <button onClick={() => onDelete(item.id)} style={{
          padding: '6px 14px', borderRadius: 8, border: '1px solid #fee2e2',
          background: 'white', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>🗑 Eliminar</button>
      </div>
    </div>
  )
}

// ─── Process Evaluation Form ─────────────────────────────────────────────────
function ProcessEvalForm({ onSubmit }) {
  const [scores,    setScores]    = useState({})
  const [nps,       setNps]       = useState(null)
  const [comment,   setComment]   = useState('')
  const [role,      setRole]      = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = () => {
    const missing = EVAL_QUESTIONS.filter(q => !scores[q.id])
    if (missing.length) { setError(`Responde todas las preguntas (faltan ${missing.length}).`); return }
    if (nps === null)   { setError('Indica tu NPS (escala 0–10).'); return }
    setError('')

    onSubmit({
      id: genId(),
      timestamp: new Date().toISOString(),
      anonymous,
      role: anonymous ? null : role,
      scores,
      nps,
      comment: comment.trim(),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 14, padding: '32px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#16a34a' }}>¡Gracias por tu evaluación!</div>
        <div style={{ fontSize: 14, color: '#4ade80', marginTop: 6 }}>
          Tu opinión ayuda a mejorar el proceso de sucesión para todo el equipo.
          {anonymous && ' Tu identidad permanece completamente anónima.'}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 6 }}>
        📊 Evaluación del proceso
      </div>
      <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 22px' }}>
        ¿Cómo está funcionando el plan de sucesión? Tus respuestas son completamente anónimas y ayudan al equipo de liderazgo a mejorar el proceso.
      </p>

      {/* Anonymous toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: anonymous ? '#f5f3ff' : '#eff6ff',
        borderRadius: 12, padding: '12px 16px', marginBottom: 24,
        border: `1.5px solid ${anonymous ? '#ddd6fe' : '#bfdbfe'}`,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: anonymous ? '#7c3aed' : '#2563eb' }}>
            {anonymous ? '🕵️ Evaluación anónima' : '👤 Evaluación identificada'}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {anonymous ? 'Tu identidad no se registrará.' : 'Tu rol será incluido en la respuesta.'}
          </div>
        </div>
        <button
          onClick={() => setAnonymous(a => !a)}
          style={{
            padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: anonymous ? '#7c3aed' : '#2563eb',
            color: 'white', fontWeight: 700, fontSize: 12,
          }}
        >{anonymous ? 'Cambiar a identificado' : 'Cambiar a anónimo'}</button>
      </div>

      {!anonymous && (
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Tu rol</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{ padding: '9px 13px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, background: 'white', color: '#1e293b', outline: 'none', cursor: 'pointer', minWidth: 240 }}
          >
            <option value="">Selecciona tu rol…</option>
            <option value="Analista de Datos">Analista de Datos</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Medical Biller">Medical Biller</option>
            <option value="Unit Lead">Unit Lead</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      )}

      {/* Likert questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 28 }}>
        {EVAL_QUESTIONS.map((q, i) => (
          <div key={q.id}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 10 }}>
              <span style={{ color: '#94a3b8', marginRight: 8 }}>{i + 1}.</span>{q.label}
            </div>
            <StarRating value={scores[q.id] || 0} onChange={v => setScores(s => ({ ...s, [q.id]: v }))} />
          </div>
        ))}
      </div>

      {/* NPS */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 10 }}>
          <span style={{ color: '#94a3b8', marginRight: 8 }}>{EVAL_QUESTIONS.length + 1}.</span>
          ¿Recomendarías este proceso de plan de sucesión a otros departamentos de la organización?
        </div>
        <NpsSelector value={nps} onChange={setNps} />
      </div>

      {/* Open comment */}
      <div style={{ marginBottom: 22 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
          <span style={{ color: '#94a3b8', marginRight: 8 }}>{EVAL_QUESTIONS.length + 2}.</span>
          ¿Qué mejorarías del proceso o de la plataforma? <span style={{ fontWeight: 400, color: '#94a3b8' }}>(opcional)</span>
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Escribe aquí cualquier sugerencia, crítica constructiva o comentario sobre el plan de sucesión..."
          rows={4}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1.5px solid #e2e8f0', fontSize: 14,
            outline: 'none', resize: 'vertical', lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = '#0d9488'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 14 }}>
          ⚠ {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 32px', borderRadius: 10, border: 'none',
          background: '#0d9488', color: 'white', fontWeight: 700,
          fontSize: 15, cursor: 'pointer',
        }}
      >
        {anonymous ? '🕵️ Enviar evaluación anónima' : '📤 Enviar evaluación'}
      </button>
    </div>
  )
}

// ─── Admin Eval Dashboard ─────────────────────────────────────────────────────
function EvalDashboard({ evals, onDelete }) {
  if (evals.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: 14, padding: '48px 28px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Sin evaluaciones aún</div>
        <div style={{ fontSize: 14 }}>Las evaluaciones enviadas por el equipo aparecerán aquí.</div>
      </div>
    )
  }

  // Compute averages
  const avg = {}
  EVAL_QUESTIONS.forEach(q => {
    const vals = evals.map(e => e.scores?.[q.id]).filter(Boolean)
    avg[q.id] = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  })
  const npsScores   = evals.map(e => e.nps).filter(n => n !== null && n !== undefined)
  const promoters   = npsScores.filter(n => n >= 9).length
  const passives    = npsScores.filter(n => n >= 7 && n < 9).length
  const detractors  = npsScores.filter(n => n < 7).length
  const npsScore    = npsScores.length ? Math.round(((promoters - detractors) / npsScores.length) * 100) : null
  const avgNps      = npsScores.length ? (npsScores.reduce((a, b) => a + b, 0) / npsScores.length).toFixed(1) : null
  const overallAvg  = Object.values(avg).filter(Boolean)
  const overallScore = overallAvg.length ? (overallAvg.reduce((a, b) => a + b, 0) / overallAvg.length).toFixed(1) : null

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#0d9488' }}>{evals.length}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Evaluaciones recibidas</div>
        </div>
        {overallScore && (
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: overallScore >= 4 ? '#16a34a' : overallScore >= 3 ? '#ca8a04' : '#dc2626' }}>
              {overallScore}<span style={{ fontSize: 16 }}>/5</span>
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Puntaje promedio</div>
          </div>
        )}
        {npsScore !== null && (
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: npsScore >= 50 ? '#16a34a' : npsScore >= 0 ? '#ca8a04' : '#dc2626' }}>
              {npsScore > 0 ? '+' : ''}{npsScore}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>NPS del proceso</div>
          </div>
        )}
        {avgNps && (
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb' }}>{avgNps}<span style={{ fontSize: 16 }}>/10</span></div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>NPS promedio</div>
          </div>
        )}
      </div>

      {/* NPS breakdown */}
      {npsScores.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 14 }}>Distribución NPS</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Promotores (9–10)', count: promoters, color: '#16a34a', bg: '#dcfce7' },
              { label: 'Pasivos (7–8)',     count: passives,  color: '#ca8a04', bg: '#fef9c3' },
              { label: 'Detractores (0–6)', count: detractors,color: '#dc2626', bg: '#fee2e2' },
            ].map(g => (
              <div key={g.label} style={{ flex: 1, background: g.bg, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: g.color }}>{g.count}</div>
                <div style={{ fontSize: 12, color: g.color, fontWeight: 600 }}>{g.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-question averages */}
      <div style={{ background: 'white', borderRadius: 12, padding: '20px 22px', border: '1px solid #e2e8f0', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 16 }}>Promedios por pregunta</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {EVAL_QUESTIONS.map(q => {
            const score = avg[q.id]
            const pct   = (score / 5) * 100
            return (
              <div key={q.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#374151', flex: 1, marginRight: 12 }}>{q.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: score >= 4 ? '#16a34a' : score >= 3 ? '#ca8a04' : '#dc2626', flexShrink: 0 }}>
                    {score.toFixed(1)}/5
                  </span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4, transition: 'width 0.4s',
                    width: `${pct}%`,
                    background: score >= 4 ? '#16a34a' : score >= 3 ? '#f59e0b' : '#ef4444',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Individual responses */}
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 12 }}>
        Respuestas individuales ({evals.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...evals].reverse().map(e => (
          <div key={e.id} style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{
                background: e.anonymous ? '#f5f3ff' : '#eff6ff',
                color: e.anonymous ? '#7c3aed' : '#2563eb',
                borderRadius: 20, padding: '3px 11px', fontSize: 12, fontWeight: 600,
              }}>{e.anonymous ? '🕵️ Anónimo' : `👤 ${e.role || 'Identificado'}`}</span>
              {e.nps !== null && e.nps !== undefined && (
                <span style={{
                  background: e.nps >= 9 ? '#dcfce7' : e.nps >= 7 ? '#fef9c3' : '#fee2e2',
                  color: NPS_COLOR(e.nps),
                  borderRadius: 20, padding: '3px 11px', fontSize: 12, fontWeight: 700,
                }}>NPS: {e.nps}/10</span>
              )}
              <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{timeAgo(e.timestamp)}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: e.comment ? 12 : 0 }}>
              {EVAL_QUESTIONS.map(q => (
                <div key={q.id} style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3, lineHeight: 1.3 }}>{q.label.slice(0, 40)}…</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                    {'⭐'.repeat(e.scores?.[q.id] || 0)}
                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>{e.scores?.[q.id]}/5</span>
                  </div>
                </div>
              ))}
            </div>
            {e.comment && (
              <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#374151', borderLeft: '3px solid #16a34a', fontStyle: 'italic', marginTop: 8 }}>
                "{e.comment}"
              </div>
            )}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
              <button onClick={() => onDelete(e.id)} style={{
                padding: '5px 12px', borderRadius: 8, border: '1px solid #fee2e2',
                background: 'white', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>🗑 Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function FeedbackBox({ adminMode, data }) {
  const [feedback, setFeedback] = useState(loadFeedback)
  const [config,   setConfig]   = useState(loadConfig)
  const [evals,    setEvals]    = useState(loadEvals)
  const [section,  setSection]  = useState('buzon')   // 'buzon' | 'eval'

  // Buzón form state
  const [anonymous,   setAnonymous] = useState(true)
  const [role,        setRole]      = useState('')
  const [category,    setCategory]  = useState('')
  const [subject,     setSubject]   = useState('')
  const [message,     setMessage]   = useState('')
  const [sending,     setSending]   = useState(false)
  const [submitted,   setSubmitted] = useState(false)
  const [error,       setError]     = useState('')

  // Admin filter
  const [filter, setFilter] = useState('all')

  const pendingCount = feedback.filter(f => f.status !== 'reviewed').length

  const handleSubmit = async () => {
    if (!category) { setError('Selecciona una categoría.'); return }
    if (!message.trim()) { setError('Escribe un mensaje antes de enviar.'); return }
    setError('')
    setSending(true)

    const entry = {
      id:        genId(),
      timestamp: new Date().toISOString(),
      anonymous,
      role:      anonymous ? null : role,
      category,
      subject:   subject.trim(),
      message:   message.trim(),
      status:    'pending',
      emailSent: false,
    }

    if (config.formspreeUrl) {
      try {
        const res = await fetch(config.formspreeUrl, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: `[Feedback Plan Sucesión] ${anonymous ? 'Anónimo' : role} — ${CATEGORIES.find(c => c.id === category)?.label}`,
            Tipo:      CATEGORIES.find(c => c.id === category)?.label,
            Anónimo:   anonymous ? 'Sí' : `No — ${role}`,
            Asunto:    subject || '(sin asunto)',
            Mensaje:   message,
            Enviado:   new Date().toLocaleString('es-PR'),
          }),
        })
        if (res.ok) entry.emailSent = true
      } catch { /* fail silently */ }
    }

    const updated = [entry, ...feedback]
    setFeedback(updated)
    saveFeedback(updated)
    setSending(false)
    setSubmitted(true)
    setCategory(''); setSubject(''); setMessage(''); setRole('')
    setTimeout(() => setSubmitted(false), 5000)
  }

  const markReviewed = (id) => {
    const updated = feedback.map(f => f.id === id ? { ...f, status: 'reviewed' } : f)
    setFeedback(updated)
    saveFeedback(updated)
  }

  const deleteFeedback = (id) => {
    if (!window.confirm('¿Eliminar este feedback? Esta acción no se puede deshacer.')) return
    const updated = feedback.filter(f => f.id !== id)
    setFeedback(updated)
    saveFeedback(updated)
  }

  const submitEval = (entry) => {
    const updated = [entry, ...evals]
    setEvals(updated)
    saveEvals(updated)
  }

  const deleteEval = (id) => {
    if (!window.confirm('¿Eliminar esta evaluación? Esta acción no se puede deshacer.')) return
    const updated = evals.filter(e => e.id !== id)
    setEvals(updated)
    saveEvals(updated)
  }

  const filtered = filter === 'all'     ? feedback
    : filter === 'pending'  ? feedback.filter(f => f.status !== 'reviewed')
    : filter === 'reviewed' ? feedback.filter(f => f.status === 'reviewed')
    : feedback.filter(f => f.category === filter)

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 20px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
          💬 Buzón de Feedback
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#64748b' }}>
          Espacio para comunicar situaciones al equipo de liderazgo y evaluar el proceso del plan de sucesión.
        </p>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: '#f1f5f9', borderRadius: 12, padding: 4 }}>
        {[
          { id: 'buzon', label: '💬 Buzón de Feedback', badge: pendingCount > 0 && adminMode ? pendingCount : null },
          { id: 'eval',  label: '📊 Evaluación del Plan', badge: evals.length > 0 && adminMode ? evals.length : null },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSection(tab.id)}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: section === tab.id ? 'white' : 'transparent',
              color: section === tab.id ? '#0f172a' : '#64748b',
              fontWeight: section === tab.id ? 700 : 500,
              fontSize: 14, transition: 'all 0.15s',
              boxShadow: section === tab.id ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {tab.label}
            {tab.badge && (
              <span style={{ background: '#ef4444', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══ BUZÓN DE FEEDBACK ══════════════════════════════════════════════ */}
      {section === 'buzon' && (
        <>
          {adminMode && <ConfigPanel config={config} onSave={setConfig} />}

          {/* Submission form */}
          <div style={{
            background: 'white', borderRadius: 16, padding: '28px',
            marginBottom: 28, border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 20 }}>
              ✍️ Enviar feedback
            </div>

            {/* Anonymous toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: anonymous ? '#f5f3ff' : '#eff6ff',
              borderRadius: 12, padding: '14px 18px', marginBottom: 22,
              border: `1.5px solid ${anonymous ? '#ddd6fe' : '#bfdbfe'}`,
              transition: 'all 0.2s',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: anonymous ? '#7c3aed' : '#2563eb' }}>
                  {anonymous ? '🕵️ Modo anónimo activado' : '👤 Enviando como identificado'}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                  {anonymous
                    ? 'Tu identidad NO se registrará en ningún momento.'
                    : 'Tu rol será incluido en el feedback.'}
                </div>
              </div>
              <button
                onClick={() => setAnonymous(a => !a)}
                style={{
                  padding: '9px 20px', borderRadius: 24, border: 'none', cursor: 'pointer',
                  background: anonymous ? '#7c3aed' : '#2563eb',
                  color: 'white', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap',
                }}
              >{anonymous ? 'Cambiar a identificado' : 'Cambiar a anónimo'}</button>
            </div>

            {!anonymous && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>
                  Tu rol en el departamento
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ width: '100%', maxWidth: 280, padding: '10px 13px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, background: 'white', color: '#1e293b', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">Selecciona tu rol…</option>
                  <option value="Analista de Datos">Analista de Datos</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Medical Biller">Medical Biller</option>
                  <option value="Unit Lead">Unit Lead</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 9 }}>
                Categoría <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    title={cat.desc}
                    style={{
                      padding: '10px 16px', borderRadius: 24,
                      border: `2px solid ${category === cat.id ? cat.color : '#e2e8f0'}`,
                      background: category === cat.id ? cat.bg : 'white',
                      color: category === cat.id ? cat.color : '#64748b',
                      fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >{cat.icon} {cat.label}</button>
                ))}
              </div>
              {category && (
                <div style={{ marginTop: 8, fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
                  {CATEGORIES.find(c => c.id === category)?.desc}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>
                Asunto (opcional)
              </label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Resumen breve de tu mensaje..."
                maxLength={100}
                style={{ width: '100%', padding: '10px 13px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>
                Mensaje <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={anonymous ? 'Escribe tu feedback aquí. Es completamente anónimo...' : 'Describe tu situación, idea o sugerencia...'}
                rows={6}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>{message.length} caracteres</div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 16 }}>⚠ {error}</div>
            )}

            {submitted ? (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12, padding: '18px 22px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#16a34a' }}>Feedback enviado con éxito</div>
                <div style={{ fontSize: 14, color: '#4ade80', marginTop: 4 }}>
                  {config.formspreeUrl ? 'Guardado y enviado al correo de liderazgo.' : 'Guardado. El equipo de HR lo revisará en la plataforma.'}
                  {anonymous && ' Tu identidad permanece completamente anónima.'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{
                    padding: '12px 32px', borderRadius: 10, border: 'none',
                    background: sending ? '#94a3b8' : '#0d9488',
                    color: 'white', fontWeight: 700, fontSize: 15,
                    cursor: sending ? 'not-allowed' : 'pointer',
                  }}
                >{sending ? '⏳ Enviando...' : anonymous ? '🕵️ Enviar anónimamente' : '📤 Enviar feedback'}</button>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>
                  {config.formspreeUrl
                    ? `📧 Se enviará a ${config.notifEmail || 'el correo configurado'}`
                    : '💾 Solo guardado local — configura correo en modo HR'}
                </div>
              </div>
            )}
          </div>

          {/* Admin: inbox */}
          {adminMode && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>📥 Feedback recibido</div>
                {pendingCount > 0 && (
                  <span style={{ background: '#fef2f2', color: '#ef4444', borderRadius: 20, padding: '3px 12px', fontSize: 13, fontWeight: 700 }}>
                    {pendingCount} sin revisar
                  </span>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['all', 'pending', 'reviewed', ...CATEGORIES.map(c => c.id)].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        border: '1.5px solid', borderColor: filter === f ? '#0d9488' : '#e2e8f0',
                        background: filter === f ? '#0d9488' : 'white',
                        color: filter === f ? 'white' : '#64748b', cursor: 'pointer',
                      }}
                    >
                      {f === 'all' ? `Todo (${feedback.length})`
                        : f === 'pending' ? `Sin revisar (${feedback.filter(x => x.status !== 'reviewed').length})`
                        : f === 'reviewed' ? 'Revisados'
                        : CATEGORIES.find(c => c.id === f)?.icon + ' ' + CATEGORIES.find(c => c.id === f)?.label}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 14, padding: '48px 28px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                    {filter === 'all' ? 'Aún no hay feedback' : 'Sin resultados para este filtro'}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {filter === 'all' ? 'Cuando los colaboradores envíen feedback aparecerá aquí.' : 'Prueba otro filtro.'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filtered.map(item => (
                    <FeedbackCard key={item.id} item={item} onMarkReviewed={markReviewed} onDelete={deleteFeedback} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!adminMode && feedback.length > 0 && (
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', fontSize: 14, color: '#64748b', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
              <div>
                <strong style={{ color: '#1e293b' }}>Tu feedback es confidencial.</strong>{' '}
                Los mensajes anónimos no contienen ningún identificador personal. Solo el equipo de People Operations tiene acceso.
              </div>
            </div>
          )}
        </>
      )}

      {/* ══ EVALUACIÓN DEL PLAN ════════════════════════════════════════════ */}
      {section === 'eval' && (
        <>
          {!adminMode && (
            <ProcessEvalForm onSubmit={submitEval} />
          )}
          {adminMode && (
            <>
              <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', marginBottom: 24, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 28 }}>📊</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Panel de Evaluaciones — Modo HR</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    Vista consolidada de todas las evaluaciones del proceso recibidas. Los colaboradores en modo normal ven solo el formulario.
                  </div>
                </div>
              </div>
              <EvalDashboard evals={evals} onDelete={deleteEval} />
            </>
          )}
        </>
      )}

    </div>
  )
}
