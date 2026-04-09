import { useState } from 'react'

const PERIODOS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025']

const DIMS = [
  {
    id: 'involucramiento',
    name: 'Involucramiento y Participación',
    icon: '🤝',
    color: '#0d9488',
    ref: 'Denison (1990) · Hackman (2002)',
    questions: [
      'Los miembros del equipo tienen voz en las decisiones que afectan su trabajo.',
      'La colaboración entre colegas es una práctica cotidiana en el departamento.',
      'Se nos alienta a tomar iniciativa y proponer mejoras.',
      'El conocimiento y las habilidades se comparten libremente entre el equipo.',
    ],
  },
  {
    id: 'comunicacion',
    name: 'Comunicación y Transparencia',
    icon: '📢',
    color: '#7c3aed',
    ref: 'Gibb (1961) · Kouzes & Posner (2017)',
    questions: [
      'Recibimos información clara y oportuna sobre los objetivos y resultados del departamento.',
      'El liderazgo comunica las razones detrás de las decisiones importantes.',
      'La comunicación entre niveles jerárquicos es abierta y sin filtros.',
      'Los errores y aprendizajes se comparten abiertamente, sin cultura de culpa.',
    ],
  },
  {
    id: 'seguridad',
    name: 'Seguridad Psicológica',
    icon: '🛡️',
    color: '#2563eb',
    ref: 'Edmondson (1999) · Project Aristotle — Google (2016)',
    questions: [
      'Me siento cómodo/a expresando ideas o preocupaciones sin miedo a consecuencias negativas.',
      'Los errores son tratados como oportunidades de aprendizaje, no como fracasos.',
      'Se acepta el disenso constructivo y las perspectivas diferentes.',
      'Las personas se sienten valoradas por quienes son, no solo por lo que producen.',
    ],
  },
  {
    id: 'resultados',
    name: 'Orientación a Resultados y Mejora',
    icon: '📈',
    color: '#d97706',
    ref: 'De Waal HPO (2012) · Kaizen · Senge (1990)',
    questions: [
      'Nos enfocamos en resultados medibles, no solo en actividades.',
      'Existe una cultura de mejora continua donde constantemente buscamos hacerlo mejor.',
      'Los datos y la evidencia guían nuestras decisiones.',
      'Se celebran los logros y se aprende sistemáticamente de los fracasos.',
    ],
  },
  {
    id: 'mision',
    name: 'Misión, Valores y Propósito',
    icon: '🎯',
    color: '#dc2626',
    ref: 'Denison (1990) · Seligman PERMA (2011)',
    questions: [
      'Tengo claro cómo mi trabajo contribuye a la misión de la organización.',
      'Los valores organizacionales se viven en el día a día, no solo se proclaman.',
      'Existe un sentido genuino de propósito más allá del trabajo transaccional.',
      'La organización cumple sus compromisos con los colaboradores.',
    ],
  },
]

const LABELS = ['', 'Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo']
const SCALE_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#0d9488' }
const STORAGE_KEY = 'pns-clima-v1'

function loadResponses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveResponse(entry) {
  const all = loadResponses()
  all.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 50)))
}

export default function ClimaLaboral({ adminMode }) {
  const [periodo, setPeriodo] = useState('Q2 2026')
  const [anonimo, setAnonimo] = useState(true)
  const [respondent, setRespondent] = useState('')
  const [answers, setAnswers] = useState({})
  const [notes, setNotes] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [view, setView] = useState('form')
  const [responses, setResponses] = useState(loadResponses)

  const totalQ = DIMS.reduce((a, d) => a + d.questions.length, 0)
  const answered = Object.keys(answers).length
  const allDone = answered === totalQ

  const setAnswer = (dimId, qIdx, val) =>
    setAnswers(prev => ({ ...prev, [`${dimId}_${qIdx}`]: val }))
  const setNote = (dimId, val) =>
    setNotes(prev => ({ ...prev, [dimId]: val }))

  const dimAvg = (dim) => {
    const vals = dim.questions.map((_, i) => answers[`${dim.id}_${i}`]).filter(Boolean)
    return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null
  }

  const handleSubmit = () => {
    if (!allDone) { alert('Completa todas las preguntas antes de enviar.'); return }
    const dimScores = {}
    DIMS.forEach(d => { dimScores[d.id] = dimAvg(d) })
    const overall = +(Object.values(dimScores).reduce((a, b) => a + b, 0) / DIMS.length).toFixed(2)
    const entry = {
      id: Date.now(), periodo,
      timestamp: new Date().toISOString(),
      respondent: anonimo ? 'Anónimo' : (respondent || 'Sin nombre'),
      answers, notes, dimScores, overall,
    }
    saveResponse(entry)
    setResponses(loadResponses())
    setSubmitted(true)
    setView('results')
  }

  const handleReset = () => { setAnswers({}); setNotes({}); setSubmitted(false); setView('form') }

  const periodResponses = responses.filter(r => r.periodo === periodo)
  const aggScores = DIMS.reduce((acc, d) => {
    const vals = periodResponses.map(r => r.dimScores[d.id]).filter(Boolean)
    acc[d.id] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null
    return acc
  }, {})

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 80px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>🌡️ Evaluación de Clima</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
          Instrumento basado en el modelo Denison, Seguridad Psicológica (Edmondson, 1999) y pilares HPO.
          Identifica fortalezas y áreas de mejora en la cultura del departamento.
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
              borderColor: view === v ? '#0d9488' : '#e2e8f0',
              background: view === v ? '#0d9488' : 'white',
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

          {DIMS.map(dim => (
            <div key={dim.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ background: `${dim.color}12`, borderLeft: `4px solid ${dim.color}`, padding: '14px 20px' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{dim.icon} {dim.name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>Base científica: {dim.ref}</div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {dim.questions.map((q, qi) => {
                  const key = `${dim.id}_${qi}`
                  const val = answers[key]
                  return (
                    <div key={qi} style={{ marginBottom: qi < dim.questions.length - 1 ? 20 : 0 }}>
                      <div style={{ fontSize: 13, color: '#1e293b', marginBottom: 10, lineHeight: 1.5, fontWeight: 500 }}>
                        {qi + 1}. {q}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setAnswer(dim.id, qi, n)} title={LABELS[n]}
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
                <div style={{ marginTop: 14 }}>
                  <textarea value={notes[dim.id] || ''} onChange={e => setNote(dim.id, e.target.value)}
                    placeholder={`Observaciones sobre ${dim.name.toLowerCase()} (opcional)...`}
                    rows={2}
                    style={{ width: '100%', boxSizing: 'border-box', borderRadius: 8, border: '1.5px solid #e2e8f0', padding: '8px 12px', fontSize: 12, fontFamily: 'inherit', resize: 'vertical', color: '#475569' }} />
                </div>
              </div>
            </div>
          ))}

          <button onClick={handleSubmit} disabled={!allDone} style={{
            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
            background: allDone ? '#0d9488' : '#e2e8f0',
            color: allDone ? 'white' : '#94a3b8',
            fontWeight: 800, fontSize: 15, cursor: allDone ? 'pointer' : 'not-allowed',
          }}>
            {allDone ? '✅ Enviar evaluación de clima' : `Faltan ${totalQ - answered} pregunta(s)`}
          </button>
        </>
      )}

      {view === 'results' && (
        <>
          {submitted && (
            <div style={{ background: '#d1fae5', border: '1.5px solid #6ee7b7', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontWeight: 700, color: '#065f46' }}>¡Evaluación enviada!</div>
                <div style={{ fontSize: 13, color: '#047857' }}>Guardada para el período {periodo}.</div>
              </div>
              <button onClick={handleReset} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, border: '1.5px solid #6ee7b7', background: 'white', color: '#065f46', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                Nueva evaluación
              </button>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: 14, padding: '20px 24px', border: '1px solid #e2e8f0', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>Resultados — {periodo}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{periodResponses.length} respuesta(s) en este período</div>
            {DIMS.map(dim => {
              const avg = aggScores[dim.id]
              const pct = avg ? (avg / 5) * 100 : 0
              const color = avg >= 4 ? '#0d9488' : avg >= 3 ? '#d97706' : '#dc2626'
              return (
                <div key={dim.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{dim.icon} {dim.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: avg ? color : '#94a3b8' }}>{avg ? avg.toFixed(1) : '—'} / 5</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 5, background: avg ? color : '#e2e8f0', transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                    {avg >= 4.5 ? 'Fortaleza cultural destacada' : avg >= 3.5 ? 'Área sólida con oportunidades' : avg >= 2.5 ? 'Área de mejora identificada' : avg ? 'Área crítica — atención prioritaria' : 'Sin datos este período'}
                  </div>
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
                    {DIMS.map(d => (
                      <span key={d.id} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: '#f1f5f9', color: '#475569' }}>
                        {d.icon} {r.dimScores[d.id]?.toFixed(1)}
                      </span>
                    ))}
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>
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
