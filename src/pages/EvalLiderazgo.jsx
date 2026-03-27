import { useState } from 'react'

const PERIODOS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025']
const LABELS = ['', 'Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo']
const SCALE_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#0d9488' }
const STORAGE_KEY = 'pns-liderazgo-v1'

const SECTIONS = [
  {
    id: 'departamento',
    name: 'Liderazgo del Departamento',
    icon: '👥',
    color: '#0d9488',
    desc: 'Evalúa el liderazgo inmediato de tu equipo — supervisores y director de BI.',
    ref: 'Bass & Avolio MLQ (1995) · Kouzes & Posner LPI (2017) · Edmondson (1999)',
    questions: [
      'Mi líder directo comunica expectativas claras y medibles.',
      'Mi líder me brinda retroalimentación útil y oportuna para mi desarrollo.',
      'Mi líder reconoce mis contribuciones de manera justa y consistente.',
      'Mi líder me apoya activamente en mi desarrollo profesional.',
      'Mi líder toma decisiones con integridad y transparencia.',
      'Mi líder crea un ambiente donde me siento seguro/a para expresarme y aportar.',
      'Mi líder gestiona el cambio de manera efectiva y con comunicación clara.',
      'Mi líder conecta nuestro trabajo diario con la estrategia organizacional.',
    ],
  },
  {
    id: 'compania',
    name: 'Liderazgo Ejecutivo de la Compañía',
    icon: '🏢',
    color: '#7c3aed',
    desc: 'Evalúa la percepción del liderazgo ejecutivo general de la organización.',
    ref: 'Kouzes & Posner (2017) · Heifetz (1994) · Covey — Speed of Trust (2006) · Gallup Q12',
    questions: [
      'El liderazgo ejecutivo demuestra integridad y congruencia entre lo que dice y hace.',
      'Confío en la dirección estratégica que la organización está tomando.',
      'El liderazgo ejecutivo se preocupa genuinamente por el bienestar de los empleados.',
      'El liderazgo ejecutivo comunica la visión de manera clara y motivadora.',
      'Las decisiones importantes se toman de manera transparente y justa.',
      'La organización invierte genuinamente en el desarrollo del talento.',
    ],
  },
]

function loadResponses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveResponse(entry) {
  const all = loadResponses()
  all.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 50)))
}

export default function EvalLiderazgo({ adminMode }) {
  const [periodo, setPeriodo] = useState('Q2 2026')
  const [anonimo, setAnonimo] = useState(true)
  const [respondent, setRespondent] = useState('')
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [view, setView] = useState('form')
  const [responses, setResponses] = useState(loadResponses)

  const totalQ = SECTIONS.reduce((a, s) => a + s.questions.length, 0)
  const answered = Object.keys(answers).length
  const allDone = answered === totalQ

  const setAnswer = (sectionId, qIdx, val) =>
    setAnswers(prev => ({ ...prev, [`${sectionId}_${qIdx}`]: val }))

  const sectionAvg = (section) => {
    const vals = section.questions.map((_, i) => answers[`${section.id}_${i}`]).filter(Boolean)
    return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null
  }

  const handleSubmit = () => {
    if (!allDone) { alert('Completa todas las preguntas antes de enviar.'); return }
    const sectionScores = {}
    SECTIONS.forEach(s => { sectionScores[s.id] = sectionAvg(s) })
    const overall = +(Object.values(sectionScores).reduce((a, b) => a + b, 0) / SECTIONS.length).toFixed(2)
    const entry = {
      id: Date.now(), periodo,
      timestamp: new Date().toISOString(),
      respondent: anonimo ? 'Anónimo' : (respondent || 'Sin nombre'),
      answers, sectionScores, overall,
    }
    saveResponse(entry)
    setResponses(loadResponses())
    setSubmitted(true)
    setView('results')
  }

  const handleReset = () => { setAnswers({}); setSubmitted(false); setView('form') }

  const periodResponses = responses.filter(r => r.periodo === periodo)
  const aggScores = SECTIONS.reduce((acc, s) => {
    const vals = periodResponses.map(r => r.sectionScores[s.id]).filter(Boolean)
    acc[s.id] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null
    return acc
  }, {})

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 80px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>🧭 Evaluación de Liderazgo</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
          Evaluación en dos niveles: liderazgo del departamento y liderazgo ejecutivo de la compañía.
          Basado en Bass & Avolio MLQ, Kouzes & Posner LPI y Gallup Q12.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>Período</div>
          <select value={periodo} onChange={e => setPeriodo(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, fontWeight: 600, background: 'white' }}>
            {PERIODOS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['form', 'results'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '8px 18px', borderRadius: 8, border: '1.5px solid',
              borderColor: view === v ? '#7c3aed' : '#e2e8f0',
              background: view === v ? '#7c3aed' : 'white',
              color: view === v ? 'white' : '#64748b',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              {v === 'form' ? '📝 Completar' : '📊 Resultados'}
            </button>
          ))}
        </div>
      </div>

      {view === 'form' && (
        <>
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', marginBottom: 20, border: '1px solid #e2e8f0', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}>
              <input type="checkbox" checked={anonimo} onChange={e => setAnonimo(e.target.checked)} />
              Enviar de forma anónima
            </label>
            {!anonimo && (
              <input value={respondent} onChange={e => setRespondent(e.target.value)}
                placeholder="Tu nombre (opcional)"
                style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, flex: 1, minWidth: 200 }} />
            )}
            <div style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8' }}>{answered}/{totalQ} respondidas</div>
          </div>

          {SECTIONS.map(section => (
            <div key={section.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ background: `${section.color}12`, borderLeft: `4px solid ${section.color}`, padding: '14px 20px' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{section.icon} {section.name}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{section.desc}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>Base científica: {section.ref}</div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {section.questions.map((q, qi) => {
                  const key = `${section.id}_${qi}`
                  const val = answers[key]
                  return (
                    <div key={qi} style={{ marginBottom: qi < section.questions.length - 1 ? 20 : 0 }}>
                      <div style={{ fontSize: 13, color: '#1e293b', marginBottom: 10, lineHeight: 1.5, fontWeight: 500 }}>
                        {qi + 1}. {q}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setAnswer(section.id, qi, n)} title={LABELS[n]}
                            style={{
                              padding: '7px 14px', borderRadius: 8, border: '1.5px solid',
                              borderColor: val === n ? SCALE_COLORS[n] : '#e2e8f0',
                              background: val === n ? SCALE_COLORS[n] : 'white',
                              color: val === n ? 'white' : '#64748b',
                              fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', minWidth: 40,
                            }}>{n}</button>
                        ))}
                        {val && <span style={{ fontSize: 12, color: SCALE_COLORS[val], fontWeight: 600, marginLeft: 4 }}>{LABELS[val]}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <button onClick={handleSubmit} disabled={!allDone} style={{
            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
            background: allDone ? '#7c3aed' : '#e2e8f0',
            color: allDone ? 'white' : '#94a3b8',
            fontWeight: 800, fontSize: 15, cursor: allDone ? 'pointer' : 'not-allowed',
          }}>
            {allDone ? '✅ Enviar evaluación de liderazgo' : `Faltan ${totalQ - answered} pregunta(s)`}
          </button>
        </>
      )}

      {view === 'results' && (
        <>
          {submitted && (
            <div style={{ background: '#f3e8ff', border: '1.5px solid #c4b5fd', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontWeight: 700, color: '#6b21a8' }}>¡Evaluación enviada!</div>
                <div style={{ fontSize: 13, color: '#7c3aed' }}>Guardada para el período {periodo}.</div>
              </div>
              <button onClick={handleReset} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, border: '1.5px solid #c4b5fd', background: 'white', color: '#6b21a8', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                Nueva evaluación
              </button>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: 14, padding: '20px 24px', border: '1px solid #e2e8f0', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>Resultados — {periodo}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{periodResponses.length} respuesta(s) en este período</div>
            {SECTIONS.map(section => {
              const avg = aggScores[section.id]
              const pct = avg ? (avg / 5) * 100 : 0
              const color = avg >= 4 ? '#0d9488' : avg >= 3 ? '#d97706' : '#dc2626'
              return (
                <div key={section.id} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{section.icon} {section.name}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: avg ? color : '#94a3b8' }}>{avg ? avg.toFixed(1) : '—'} / 5</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 6, background: '#f1f5f9', overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 6, background: avg ? color : '#e2e8f0', transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>
                    {avg >= 4.5 ? '🌟 Liderazgo ejemplar' : avg >= 3.5 ? '✅ Liderazgo efectivo con oportunidades' : avg >= 2.5 ? '⚠️ Mejora recomendada' : avg ? '🔴 Brechas significativas' : 'Sin datos este período'}
                  </div>
                  {periodResponses.length > 0 && (
                    <div style={{ paddingLeft: 12, borderLeft: '3px solid #f1f5f9' }}>
                      {section.questions.map((q, qi) => {
                        const qVals = periodResponses.map(r => r.answers[`${section.id}_${qi}`]).filter(Boolean)
                        const qAvg = qVals.length ? +(qVals.reduce((a, b) => a + b, 0) / qVals.length).toFixed(1) : null
                        const qColor = qAvg >= 4 ? '#0d9488' : qAvg >= 3 ? '#d97706' : '#dc2626'
                        return (
                          <div key={qi} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', marginBottom: 6, gap: 8 }}>
                            <span style={{ flex: 1, lineHeight: 1.4 }}>{q}</span>
                            <span style={{ fontWeight: 700, color: qAvg ? qColor : '#cbd5e1', flexShrink: 0 }}>{qAvg ?? '—'}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {adminMode && periodResponses.length > 0 && (
            <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>📋 Respuestas individuales (Admin)</div>
              {periodResponses.map(r => (
                <div key={r.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{r.respondent}</span>
                    <span style={{ color: '#94a3b8' }}>{new Date(r.timestamp).toLocaleDateString('es-PR')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                    {SECTIONS.map(s => (
                      <span key={s.id} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: '#f1f5f9', color: '#475569' }}>
                        {s.icon} {r.sectionScores[s.id]?.toFixed(1)}
                      </span>
                    ))}
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: '#ede9fe', color: '#6b21a8', fontWeight: 700 }}>
                      Promedio: {r.overall}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
