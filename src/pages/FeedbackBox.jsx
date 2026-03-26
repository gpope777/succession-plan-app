import { useState, useEffect } from 'react'

const STORAGE_KEY   = 'pns-feedback-v1'
const CONFIG_KEY    = 'pns-feedback-config-v1'

const CATEGORIES = [
  { id: 'positivo',   label: 'Situación positiva',     icon: '🌟', color: '#16a34a', bg: '#dcfce7', desc: 'Algo que va bien, un logro, un reconocimiento' },
  { id: 'mejora',     label: 'Área de mejora',          icon: '⚠️', color: '#ca8a04', bg: '#fef9c3', desc: 'Una situación que podría mejorar en el equipo o proceso' },
  { id: 'sugerencia', label: 'Sugerencia',              icon: '💡', color: '#2563eb', bg: '#eff6ff', desc: 'Una idea o propuesta para el equipo o la organización' },
  { id: 'personal',   label: 'Situación personal',      icon: '🤝', color: '#7c3aed', bg: '#f5f3ff', desc: 'Algo que afecta tu bienestar, carga de trabajo o desarrollo' },
  { id: 'otro',       label: 'Otro',                    icon: '📝', color: '#475569', bg: '#f8fafc', desc: 'Cualquier otro tema que quieras comunicar' },
]

function loadFeedback()  { try { return JSON.parse(localStorage.getItem(STORAGE_KEY))  || [] } catch { return [] } }
function loadConfig()    { try { return JSON.parse(localStorage.getItem(CONFIG_KEY))   || {} } catch { return {} } }
function saveFeedback(f) { localStorage.setItem(STORAGE_KEY, JSON.stringify(f)) }
function saveConfig(c)   { localStorage.setItem(CONFIG_KEY,  JSON.stringify(c)) }

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

// ─── Admin Config Panel ─────────────────────────────────────────────────────────
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
        {/* Formspree endpoint */}
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
            {' '}→ New Form → copia el endpoint. El feedback llegará al email que registres allí.
          </div>
        </div>

        {/* Notification email (display only) */}
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
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>
            Solo para referencia interna. El correo real se configura en Formspree.
          </div>
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
        {draft.formspreeUrl && (
          <span style={{ fontSize: 13, color: '#5eead4' }}>✓ Correo configurado — el feedback anónimo se enviará automáticamente</span>
        )}
        {!draft.formspreeUrl && (
          <span style={{ fontSize: 13, color: '#f59e0b' }}>⚠ Sin configurar — el feedback solo se guardará localmente</span>
        )}
      </div>
    </div>
  )
}

// ─── Feedback Card (admin view) ─────────────────────────────────────────────────
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
            <span style={{
              background: cat.bg, color: cat.color,
              borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700,
            }}>{cat.label}</span>
            <span style={{
              background: item.anonymous ? '#f5f3ff' : '#eff6ff',
              color: item.anonymous ? '#7c3aed' : '#2563eb',
              borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600,
            }}>{item.anonymous ? '🕵️ Anónimo' : `👤 ${item.role || 'Identificado'}`}</span>
            {item.status === 'reviewed' && (
              <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                ✓ Revisado
              </span>
            )}
            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{timeAgo(item.timestamp)}</span>
          </div>
          {item.subject && (
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 6 }}>
              {item.subject}
            </div>
          )}
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
            {item.message}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
        {item.status !== 'reviewed' && (
          <button onClick={() => onMarkReviewed(item.id)} style={{
            padding: '6px 14px', borderRadius: 8, border: 'none',
            background: '#dcfce7', color: '#16a34a',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>✓ Marcar revisado</button>
        )}
        <button onClick={() => onDelete(item.id)} style={{
          padding: '6px 14px', borderRadius: 8,
          border: '1px solid #fee2e2', background: 'white',
          color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>🗑 Eliminar</button>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function FeedbackBox({ adminMode, data }) {
  const [feedback, setFeedback]     = useState(loadFeedback)
  const [config,   setConfig]       = useState(loadConfig)

  // Form state
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

    // Try sending via Formspree
    if (config.formspreeUrl) {
      try {
        const res = await fetch(config.formspreeUrl, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: `[PNS-PR Feedback] ${anonymous ? 'Anónimo' : role} — ${CATEGORIES.find(c => c.id === category)?.label}`,
            Tipo:      CATEGORIES.find(c => c.id === category)?.label,
            Anónimo:   anonymous ? 'Sí' : `No — ${role}`,
            Asunto:    subject || '(sin asunto)',
            Mensaje:   message,
            Enviado:   new Date().toLocaleString('es-PR'),
          }),
        })
        if (res.ok) entry.emailSent = true
      } catch {
        // fail silently — still save locally
      }
    }

    const updated = [entry, ...feedback]
    setFeedback(updated)
    saveFeedback(updated)
    setSending(false)
    setSubmitted(true)

    // Reset form
    setCategory('')
    setSubject('')
    setMessage('')
    setRole('')
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

  const filtered = filter === 'all'      ? feedback
    : filter === 'pending'   ? feedback.filter(f => f.status !== 'reviewed')
    : filter === 'reviewed'  ? feedback.filter(f => f.status === 'reviewed')
    : feedback.filter(f => f.category === filter)

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 20px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
          📬 Buzón de Feedback
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#64748b' }}>
          Espacio seguro para comunicar situaciones, ideas y sugerencias al equipo de liderazgo. Puedes elegir enviarlo de forma anónima — tu identidad nunca será registrada.
        </p>
      </div>

      {/* Admin config */}
      {adminMode && (
        <ConfigPanel config={config} onSave={setConfig} />
      )}

      {/* ── SUBMISSION FORM ─────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '28px 28px',
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
                ? 'Tu identidad NO se registrará en ningún momento. El feedback llega directamente a liderazgo sin trazabilidad.'
                : 'Tu rol será incluido en el feedback. Útil para seguimientos directos con HR.'}
            </div>
          </div>
          <button
            onClick={() => setAnonymous(a => !a)}
            style={{
              padding: '9px 20px', borderRadius: 24, border: 'none', cursor: 'pointer',
              background: anonymous ? '#7c3aed' : '#2563eb',
              color: 'white', fontWeight: 700, fontSize: 13,
              whiteSpace: 'nowrap', transition: 'background 0.2s',
            }}
          >
            {anonymous ? 'Cambiar a identificado' : 'Cambiar a anónimo'}
          </button>
        </div>

        {/* Role (if not anonymous) */}
        {!anonymous && (
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>
              Tu rol en el departamento
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{
                width: '100%', maxWidth: 280, padding: '10px 13px', borderRadius: 8,
                border: '1.5px solid #e2e8f0', fontSize: 14,
                background: 'white', color: '#1e293b', outline: 'none', cursor: 'pointer',
              }}
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

        {/* Category */}
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
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          {category && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
              {CATEGORIES.find(c => c.id === category)?.desc}
            </div>
          )}
        </div>

        {/* Subject */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>
            Asunto (opcional)
          </label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Resumen breve de tu mensaje..."
            maxLength={100}
            style={{
              width: '100%', padding: '10px 13px', borderRadius: 8,
              border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none',
              boxSizing: 'border-box', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Message */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>
            Mensaje <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={
              anonymous
                ? 'Escribe tu feedback aquí. Recuerda que es completamente anónimo — no incluyas tu nombre si deseas mantener el anonimato...'
                : 'Describe tu situación, idea o sugerencia con el mayor detalle posible...'
            }
            rows={6}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 8,
              border: '1.5px solid #e2e8f0', fontSize: 14,
              outline: 'none', resize: 'vertical', lineHeight: 1.6,
              fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>
            {message.length} caracteres
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
            padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 16,
          }}>⚠ {error}</div>
        )}

        {/* Submit */}
        {submitted ? (
          <div style={{
            background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12,
            padding: '18px 22px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#16a34a' }}>
              Feedback enviado con éxito
            </div>
            <div style={{ fontSize: 14, color: '#4ade80', marginTop: 4 }}>
              {config.formspreeUrl
                ? 'Tu mensaje fue guardado localmente y enviado al correo de liderazgo.'
                : 'Tu mensaje fue guardado. El equipo de HR lo revisará en la plataforma.'}
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
                cursor: sending ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
              }}
            >
              {sending ? '⏳ Enviando...' : anonymous ? '🕵️ Enviar anónimamente' : '📤 Enviar feedback'}
            </button>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              {config.formspreeUrl
                ? `📧 Se enviará a ${config.notifEmail || 'el correo configurado'}`
                : '💾 Se guardará localmente — configura el correo en modo HR para envío automático'}
            </div>
          </div>
        )}
      </div>

      {/* ── ADMIN: FEEDBACK VIEWER ───────────────────────────────────── */}
      {adminMode && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap',
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>
              📥 Feedback recibido
            </div>
            {pendingCount > 0 && (
              <span style={{
                background: '#fef2f2', color: '#ef4444',
                borderRadius: 20, padding: '3px 12px', fontSize: 13, fontWeight: 700,
              }}>{pendingCount} sin revisar</span>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', 'pending', 'reviewed', ...CATEGORIES.map(c => c.id)].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    border: '1.5px solid',
                    borderColor: filter === f ? '#0d9488' : '#e2e8f0',
                    background: filter === f ? '#0d9488' : 'white',
                    color: filter === f ? 'white' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.15s',
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
            <div style={{
              background: 'white', borderRadius: 14, padding: '48px 28px',
              textAlign: 'center', border: '1px solid #e2e8f0', color: '#94a3b8',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                {filter === 'all' ? 'Aún no hay feedback' : 'Sin resultados para este filtro'}
              </div>
              <div style={{ fontSize: 14 }}>
                {filter === 'all'
                  ? 'Cuando los colaboradores envíen feedback aparecerá aquí.'
                  : 'Prueba otro filtro.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(item => (
                <FeedbackCard
                  key={item.id}
                  item={item}
                  onMarkReviewed={markReviewed}
                  onDelete={deleteFeedback}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Non-admin: privacy note */}
      {!adminMode && feedback.length > 0 && (
        <div style={{
          background: '#f8fafc', borderRadius: 12, padding: '16px 20px',
          border: '1px solid #e2e8f0', fontSize: 14, color: '#64748b',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
          <div>
            <strong style={{ color: '#1e293b' }}>Tu feedback es confidencial.</strong>{' '}
            Los mensajes anónimos no contienen ningún identificador personal.
            Solo el equipo de liderazgo de People Operations tiene acceso al contenido.
          </div>
        </div>
      )}
    </div>
  )
}
