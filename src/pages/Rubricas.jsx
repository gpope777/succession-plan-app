import { useState, useMemo } from 'react'

// ─── Rubric Data ───────────────────────────────────────────────────────────────

const PERFORMANCE_DIMS = [
  {
    id: 'liderazgo',
    name: 'Liderazgo de Personas',
    weight: 0.30,
    weightLabel: '30%',
    icon: '👥',
    heatmapKey: 'Liderazgo de personas',
    description: 'Capacidad de motivar, desarrollar y guiar a otros hacia resultados colectivos.',
    anchors: [
      null,
      'No demuestra habilidades de liderazgo; necesita dirección constante; no motiva ni orienta a otros.',
      'Liderazgo incipiente; guía informalmente en ocasiones pero sin consistencia ni impacto sostenido.',
      'Guía al equipo con efectividad en situaciones rutinarias; brinda feedback constructivo; cumple expectativas del rol.',
      'Desarrolla activamente a su equipo; maneja conflictos con madurez; inspira alto desempeño de forma consistente.',
      'Modelo de liderazgo organizacional; crea líderes futuros; inspira visión compartida; impacto transformador en la cultura.',
    ],
  },
  {
    id: 'gestion',
    name: 'Gestión de Proyectos y Flujo Operativo',
    weight: 0.20,
    weightLabel: '20%',
    icon: '📋',
    heatmapKey: 'Gestión de proyectos y flujo operativo',
    description: 'Planificación, ejecución y seguimiento de proyectos con eficiencia operativa.',
    anchors: [
      null,
      'No gestiona proyectos de forma estructurada; incumple plazos con frecuencia; sin visibilidad de prioridades.',
      'Gestiona proyectos simples; pierde seguimiento en proyectos complejos; requiere supervisión constante.',
      'Gestiona múltiples proyectos con efectividad; entrega a tiempo; comunica avances de forma proactiva.',
      'Optimiza flujos operativos; anticipa cuellos de botella; gestiona recursos con eficiencia y excelencia.',
      'Diseña sistemas de gestión escalables; mejora procesos del departamento; referente de excelencia operativa.',
    ],
  },
  {
    id: 'tecnico',
    name: 'Capacidad Técnico-Analítica (BI/Stats)',
    weight: 0.20,
    weightLabel: '20%',
    icon: '📊',
    heatmapKey: 'Capacidad técnico-analítica (BI/Stats)',
    description: 'Dominio de herramientas de BI, SQL, estadística y análisis de datos.',
    anchors: [
      null,
      'Conocimiento técnico mínimo; depende de otros para análisis básicos; no usa herramientas BI con autonomía.',
      'Domina herramientas básicas; ejecuta análisis descriptivos simples; necesita orientación para tareas complejas.',
      'Domina SQL, Power BI y estadística aplicada; entrega análisis de calidad con mínima supervisión.',
      'Análisis avanzado (predictivo, multivariado); data storytelling efectivo; referente técnico del equipo.',
      'Innovación técnica continua; diseña arquitecturas analíticas; integra IA; define estándares del departamento.',
    ],
  },
  {
    id: 'comunicacion',
    name: 'Comunicación e Influencia',
    weight: 0.15,
    weightLabel: '15%',
    icon: '🗣️',
    heatmapKey: 'Comunicación e influencia',
    description: 'Claridad de comunicación oral y escrita, adaptación a audiencias y capacidad de influir.',
    anchors: [
      null,
      'Comunicación poco clara; no adapta mensajes a la audiencia; baja influencia interpersonal.',
      'Comunica adecuadamente en su área pero con dificultad en escenarios de alta visibilidad o presentaciones formales.',
      'Comunica hallazgos con claridad a distintas audiencias; influye positivamente en su equipo y pares.',
      'Presentaciones ejecutivas de alto impacto; data storytelling efectivo; influye más allá de su departamento.',
      'Comunicador organizacional de referencia; alinea narrativas estratégicas; influye a nivel C-Level y board.',
    ],
  },
  {
    id: 'cumplimiento',
    name: 'Cumplimiento y Estandarización (SOPs/HIPAA)',
    weight: 0.15,
    weightLabel: '15%',
    icon: '✅',
    heatmapKey: 'Cumplimiento y estandarización (HIPAA/SOPs)',
    description: 'Adhesión a SOPs, regulaciones HIPAA/FWA y estándares de calidad de datos.',
    anchors: [
      null,
      'Frecuentes desviaciones de SOPs; incumplimiento de regulaciones HIPAA; riesgo activo de compliance.',
      'Conoce las normas pero comete errores ocasionales; requiere recordatorios para seguir protocolos.',
      'Cumple consistentemente con SOPs e HIPAA; documenta adecuadamente; sin hallazgos en auditorías.',
      'Promueve cultura de compliance en el equipo; mejora SOPs existentes; modelo de responsabilidad regulatoria.',
      'Arquitecto del sistema de compliance; crea marcos de governance; cero tolerancia a riesgos regulatorios.',
    ],
  },
]

const POTENTIAL_DIMS = [
  {
    id: 'agilidad',
    name: 'Agilidad de Aprendizaje',
    weight: 0.40,
    weightLabel: '40%',
    icon: '⚡',
    description: 'Velocidad y profundidad con la que absorbe nuevos conocimientos y los aplica en contextos inéditos.',
    anchors: [
      null,
      'Aprende lentamente; resiste nuevas formas de trabajo; no busca feedback ni desarrollo de forma activa.',
      'Aprende a ritmo estándar cuando se le exige; abierto al feedback pero no lo busca proactivamente.',
      'Aprende con rapidez; busca activamente nuevos conocimientos; aplica lo aprendido con efectividad.',
      'Aprende excepcionalmente rápido en contextos nuevos; lidera su propio desarrollo; comparte aprendizajes con el equipo.',
      'Aprende a velocidad exponencial; anticipa habilidades futuras; crea culturas de aprendizaje continuo.',
    ],
  },
  {
    id: 'aspiracion',
    name: 'Aspiración y Motivación de Crecer',
    weight: 0.30,
    weightLabel: '30%',
    icon: '🎯',
    description: 'Motivación intrínseca para asumir mayor responsabilidad y avanzar en su trayectoria profesional.',
    anchors: [
      null,
      'Sin evidencia de ambición de crecimiento; cómodo en el status quo; no expresa interés en mayor responsabilidad.',
      'Interés en crecer cuando se le menciona, pero sin iniciativa propia ni acciones concretas de desarrollo.',
      'Aspiraciones claras de crecimiento; toma iniciativa en su desarrollo; comunica metas de carrera activamente.',
      'Alta motivación intrínseca; busca retos y mayor responsabilidad voluntariamente; impulsa a otros a crecer.',
      'Visión de carrera transformadora; impulsa el crecimiento del departamento; referente de ambición y propósito.',
    ],
  },
  {
    id: 'cognitivo',
    name: 'Complejidad Cognitiva y Visión Sistémica',
    weight: 0.30,
    weightLabel: '30%',
    icon: '🧠',
    description: 'Capacidad de pensar estratégicamente, conectar sistemas complejos y anticipar consecuencias de segundo orden.',
    anchors: [
      null,
      'Pensamiento concreto y limitado; dificultad para ver más allá de su tarea inmediata; no conecta impactos sistémicos.',
      'Comprende conexiones directas entre su trabajo y el equipo; limitado en pensamiento estratégico a largo plazo.',
      'Piensa sistémicamente; conecta su trabajo con objetivos organizacionales; anticipa consecuencias de segundo orden.',
      'Visión estratégica clara; diseña soluciones con impacto a largo plazo; ve patrones donde otros ven eventos aislados.',
      'Pensamiento de orden superior; diseña sistemas complejos; anticipa tendencias del sector y alinea la estrategia.',
    ],
  },
]

const EXTRA_DIMS = [
  {
    id: 'digital',
    name: 'Competencia Digital e IA',
    icon: '🤖',
    heatmapKey: 'Competencia digital e IA',
    description: 'Adopción e integración de IA, herramientas digitales y tecnologías emergentes en el trabajo diario.',
    anchors: [
      null,
      'No utiliza herramientas digitales avanzadas; resistencia activa a la IA; limitado a Excel básico.',
      'Familiaridad básica con herramientas digitales; conocimiento superficial de IA sin aplicación práctica.',
      'Utiliza herramientas BI y IA generativa en su trabajo diario; acelera análisis con IA (AI User).',
      'Diseña flujos donde la IA amplifica la capacidad del equipo; integra IA con criterio estratégico (AI Integrator).',
      'Define visión de IA del departamento; governance de datos, roadmap de adopción y ROI (AI Strategist).',
    ],
  },
  {
    id: 'dominio',
    name: 'Conocimiento del Dominio de Salud (PR)',
    icon: '🏥',
    heatmapKey: 'Conocimiento del dominio de salud (PR)',
    description: 'Profundidad en operaciones de salud en Puerto Rico: HIPAA, ICD-10, revenue cycle, claims y compliance.',
    anchors: [
      null,
      'Conocimiento mínimo del sector salud; sin familiaridad con HIPAA, ICD-10, claims o revenue cycle.',
      'Comprensión básica del sector; conoce conceptos generales pero sin aplicación práctica en operaciones.',
      'Dominio sólido de procesos de salud en PR; maneja HIPAA, claims y revenue cycle con autonomía.',
      'Experto reconocido en dominio de salud; fuente de referencia para compliance y operaciones clínicas.',
      'Autoridad máxima en el dominio; contribuye a política organizacional de salud; profundidad en todo el ciclo clínico-financiero.',
    ],
  },
]

const SCORE_LABELS = { 1: 'Inicial', 2: 'En desarrollo', 3: 'Competente', 4: 'Avanzado', 5: 'Experto' }
const SCORE_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#0d9488' }
const SCORE_BG    = { 1: '#fef2f2', 2: '#fff7ed', 3: '#fefce8', 4: '#f0fdf4', 5: '#f0fdfa' }

function calcPerfScore(scores) {
  let total = 0, wSum = 0
  PERFORMANCE_DIMS.forEach(d => {
    if (scores[d.id]) { total += scores[d.id] * d.weight; wSum += d.weight }
  })
  return wSum > 0 ? total / wSum : 0
}

function calcPotScore(scores) {
  let total = 0, wSum = 0
  POTENTIAL_DIMS.forEach(d => {
    if (scores[d.id]) { total += scores[d.id] * d.weight; wSum += d.weight }
  })
  return wSum > 0 ? total / wSum : 0
}

function calcReadiness(perf, pot) {
  if (!perf || !pot) return null
  return Math.round((perf / 5) * 60 + (pot / 5) * 40) * 100 / 100
}

function getReadinessStatus(pct) {
  if (pct >= 70) return 'Listo ahora'
  if (pct >= 45) return 'Listo pronto'
  return 'Listo futuro'
}

function getNineBoxLabel(perf, pot) {
  const px = perf > 4.0 ? 3 : perf >= 2.5 ? 2 : 1
  const py = pot  > 3.8 ? 3 : pot  >= 2.5 ? 2 : 1
  const labels = {
    '1-1': 'Nuevo en el puesto',   '2-1': 'Futuro profesional',  '3-1': 'Profesional enfocado',
    '1-2': 'Profesional eficaz',   '2-2': 'Profesional confiable','3-2': 'Estrella futura',
    '1-3': 'Diamante en bruto',    '2-3': 'Estrella en desarrollo','3-3': 'Empleado 5 estrellas ⭐',
  }
  return labels[`${py}-${px}`] || '—'
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ScoreSelector({ value, onChange, anchors, compact = false }) {
  const [hovered, setHovered] = useState(null)
  const display = hovered || value

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1,
              padding: compact ? '8px 0' : '10px 0',
              border: '2px solid',
              borderColor: value === s ? SCORE_COLORS[s] : hovered === s ? SCORE_COLORS[s] + '88' : '#e2e8f0',
              borderRadius: 8,
              background: value === s ? SCORE_COLORS[s] : hovered === s ? SCORE_BG[s] : 'white',
              color: value === s ? 'white' : hovered === s ? SCORE_COLORS[s] : '#64748b',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div style={{
        background: display ? SCORE_BG[display] : '#f8fafc',
        border: `1px solid ${display ? SCORE_COLORS[display] + '44' : '#e2e8f0'}`,
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
        color: '#475569',
        minHeight: 42,
        lineHeight: 1.55,
        transition: 'all 0.15s',
      }}>
        {display ? (
          <>
            <strong style={{ color: SCORE_COLORS[display] }}>
              {s => s}Nivel {display} — {SCORE_LABELS[display]}:
            </strong>{' '}
            {anchors[display]}
          </>
        ) : (
          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
            Selecciona un nivel para ver el indicador conductual
          </span>
        )}
      </div>
    </div>
  )
}

function DimCard({ dim, scores, onScore, sectionColor }) {
  const score = scores[dim.id]
  const contribution = score ? (score * dim.weight).toFixed(2) : '—'
  return (
    <div style={{
      background: 'white',
      border: `1px solid ${score ? SCORE_COLORS[score] + '44' : '#e2e8f0'}`,
      borderRadius: 12,
      padding: '20px 22px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{dim.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{dim.name}</span>
            <span style={{
              background: sectionColor + '22',
              color: sectionColor,
              borderRadius: 20,
              padding: '2px 9px',
              fontSize: 12,
              fontWeight: 700,
            }}>{dim.weightLabel}</span>
            {score && (
              <span style={{
                background: SCORE_COLORS[score],
                color: 'white',
                borderRadius: 20,
                padding: '2px 9px',
                fontSize: 12,
                fontWeight: 700,
              }}>
                {SCORE_LABELS[score]}
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>{dim.description}</p>
        </div>
        {dim.weight && (
          <div style={{ textAlign: 'right', minWidth: 52 }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Aporte</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: score ? SCORE_COLORS[score] : '#cbd5e1' }}>
              {contribution}
            </div>
          </div>
        )}
      </div>
      <ScoreSelector
        value={score}
        onChange={v => onScore(dim.id, v)}
        anchors={dim.anchors}
      />
    </div>
  )
}

function ScoreRing({ score, max = 5, label, color }) {
  const pct = score ? (score / max) * 100 : 0
  const r = 38
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={50} cy={50} r={r} fill="none" stroke="#f1f5f9" strokeWidth={10} />
        <circle
          cx={50} cy={50} r={r}
          fill="none"
          stroke={score ? color : '#e2e8f0'}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
      </svg>
      <div style={{ marginTop: -60, marginBottom: 42, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: score ? color : '#cbd5e1' }}>
          {score ? score.toFixed(1) : '—'}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>/ 5.0</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{label}</div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Rubricas({ data, updateCollaborator, updateHeatmap, adminMode }) {
  const [selectedId, setSelectedId] = useState(data.collaborators[0]?.id || null)
  const [perfScores, setPerfScores]   = useState({})
  const [potScores, setPotScores]     = useState({})
  const [extraScores, setExtraScores] = useState({})
  const [period, setPeriod]           = useState('Q2 2026')
  const [notes, setNotes]             = useState('')
  const [saved, setSaved]             = useState(false)

  const collab = data.collaborators.find(c => c.id === selectedId)

  // Load existing rubric scores when collaborator changes
  const loadCollabScores = (c) => {
    const rs = c?.rubricScores || {}
    setPerfScores(rs.performance || {})
    setPotScores(rs.potential || {})
    setExtraScores(rs.extra || {})
    setPeriod(rs.period || 'Q2 2026')
    setNotes(rs.notes || '')
    setSaved(false)
  }

  const handleSelectCollab = (id) => {
    setSelectedId(id)
    const c = data.collaborators.find(x => x.id === id)
    loadCollabScores(c)
  }

  // Live calculations
  const perfScore = useMemo(() => calcPerfScore(perfScores), [perfScores])
  const potScore  = useMemo(() => calcPotScore(potScores),   [potScores])
  const allPerfFilled = PERFORMANCE_DIMS.every(d => perfScores[d.id])
  const allPotFilled  = POTENTIAL_DIMS.every(d => potScores[d.id])
  const allExtraFilled = EXTRA_DIMS.every(d => extraScores[d.id])

  const readinessPct = allPerfFilled && allPotFilled
    ? Math.round(calcReadiness(perfScore, potScore) * 100)
    : null

  const totalDims = PERFORMANCE_DIMS.length + POTENTIAL_DIMS.length + EXTRA_DIMS.length
  const filledDims =
    Object.values(perfScores).filter(Boolean).length +
    Object.values(potScores).filter(Boolean).length +
    Object.values(extraScores).filter(Boolean).length
  const progressPct = Math.round((filledDims / totalDims) * 100)

  const handleSave = () => {
    if (!collab) return
    if (!allPerfFilled || !allPotFilled || !allExtraFilled) {
      alert('Por favor completa todas las dimensiones antes de guardar.')
      return
    }

    const newNineBoxPerf = Math.round(perfScore)
    const newNineBoxPot  = Math.round(potScore)
    const newReadiness   = readinessPct

    // Update collaborator profile
    updateCollaborator(collab.id, {
      nineBox: { performance: newNineBoxPerf, potential: newNineBoxPot },
      readinessPercentage: newReadiness,
      readinessStatus: getReadinessStatus(newReadiness),
      rubricScores: {
        performance: perfScores,
        potential: potScores,
        extra: extraScores,
        period,
        notes,
        lastEvaluated: new Date().toISOString().split('T')[0],
        perfScore: +perfScore.toFixed(2),
        potScore:  +potScore.toFixed(2),
      },
    })

    // Update heatmap
    const heatmapMap = {}
    PERFORMANCE_DIMS.forEach(d => { if (d.heatmapKey) heatmapMap[d.heatmapKey] = perfScores[d.id] })
    EXTRA_DIMS.forEach(d => { if (d.heatmapKey) heatmapMap[d.heatmapKey] = extraScores[d.id] })

    const newHeatmap = data.heatmap.map(row => {
      if (heatmapMap[row.dimension] !== undefined) {
        return { ...row, [collab.id]: heatmapMap[row.dimension] }
      }
      return row
    })
    updateHeatmap(newHeatmap)

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const colorSections = { perf: '#0d9488', pot: '#7c3aed', extra: '#2563eb' }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          📐 Rúbricas de Evaluación
        </h1>
        <p style={{ marginTop: 6, fontSize: 15, color: '#64748b' }}>
          Evalúa el desempeño y potencial de cada colaborador por dimensión. Los resultados actualizan automáticamente el perfil, la matriz 9-Box y el heatmap de competencias.
        </p>
      </div>

      {/* Collaborator Selector */}
      <div style={{
        background: 'white',
        borderRadius: 14,
        padding: '18px 22px',
        marginBottom: 22,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Seleccionar colaborador
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {data.collaborators.map(c => (
            <button
              key={c.id}
              onClick={() => handleSelectCollab(c.id)}
              style={{
                padding: '9px 20px',
                borderRadius: 24,
                border: '2px solid',
                borderColor: selectedId === c.id ? '#0d9488' : '#e2e8f0',
                background: selectedId === c.id ? '#0d9488' : 'white',
                color: selectedId === c.id ? 'white' : '#475569',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {c.code}
              {c.rubricScores && (
                <span style={{
                  marginLeft: 7,
                  background: selectedId === c.id ? 'rgba(255,255,255,0.3)' : '#dcfce7',
                  color: selectedId === c.id ? 'white' : '#16a34a',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontSize: 11,
                  fontWeight: 700,
                }}>✓</span>
              )}
            </button>
          ))}
        </div>
        {collab && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>
            <strong style={{ color: '#1e293b' }}>{collab.currentPosition}</strong>
            {collab.rubricScores?.lastEvaluated && (
              <span style={{ marginLeft: 12, color: '#94a3b8' }}>
                Última evaluación: {collab.rubricScores.lastEvaluated} — {collab.rubricScores.period}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {collab && (
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '14px 22px',
          marginBottom: 22,
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>
            Progreso de evaluación
          </div>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 8 }}>
            <div style={{
              width: `${progressPct}%`,
              height: '100%',
              borderRadius: 99,
              background: progressPct === 100 ? '#0d9488' : '#7c3aed',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: progressPct === 100 ? '#0d9488' : '#7c3aed', whiteSpace: 'nowrap' }}>
            {filledDims} / {totalDims} dimensiones
          </div>
        </div>
      )}

      {collab && (
        <>
          {/* ── Section 1: Performance ─────────────────────────────────────── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: '2px solid #f0fdfa',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#0d9488',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 16,
              }}>P</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>
                  Evaluación de Desempeño
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  5 dimensiones ponderadas · Alimenta el eje X de la Matriz 9-Box
                </div>
              </div>
              {allPerfFilled && (
                <div style={{
                  marginLeft: 'auto',
                  background: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  borderRadius: 10,
                  padding: '6px 16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0d9488' }}>{perfScore.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: '#5eead4' }}>Score /5.0</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PERFORMANCE_DIMS.map(dim => (
                <DimCard
                  key={dim.id}
                  dim={dim}
                  scores={perfScores}
                  onScore={(id, v) => setPerfScores(p => ({ ...p, [id]: v }))}
                  sectionColor="#0d9488"
                />
              ))}
            </div>
          </div>

          {/* ── Section 2: Potential ───────────────────────────────────────── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: '2px solid #f5f3ff',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 16,
              }}>Π</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>
                  Evaluación de Potencial
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  3 dimensiones ponderadas · Alimenta el eje Y de la Matriz 9-Box
                </div>
              </div>
              {allPotFilled && (
                <div style={{
                  marginLeft: 'auto',
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  borderRadius: 10,
                  padding: '6px 16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed' }}>{potScore.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: '#a78bfa' }}>Score /5.0</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {POTENTIAL_DIMS.map(dim => (
                <DimCard
                  key={dim.id}
                  dim={dim}
                  scores={potScores}
                  onScore={(id, v) => setPotScores(p => ({ ...p, [id]: v }))}
                  sectionColor="#7c3aed"
                />
              ))}
            </div>
          </div>

          {/* ── Section 3: Extra Heatmap Dims ─────────────────────────────── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: '2px solid #eff6ff',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 14,
              }}>🔥</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>
                  Dimensiones Complementarias
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Alimentan las filas restantes del Heatmap de Competencias
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {EXTRA_DIMS.map(dim => (
                <DimCard
                  key={dim.id}
                  dim={dim}
                  scores={extraScores}
                  onScore={(id, v) => setExtraScores(p => ({ ...p, [id]: v }))}
                  sectionColor="#2563eb"
                />
              ))}
            </div>
          </div>

          {/* ── Summary Panel ─────────────────────────────────────────────── */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '24px 28px',
            marginBottom: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 20 }}>
              📊 Resumen de Evaluación
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 20 }}>
              <ScoreRing score={allPerfFilled ? perfScore : null} label="Desempeño" color="#0d9488" />
              <ScoreRing score={allPotFilled  ? potScore  : null} label="Potencial"  color="#7c3aed" />
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 100, height: 100,
                  borderRadius: '50%',
                  background: readinessPct ? `conic-gradient(#f59e0b ${readinessPct}%, #f1f5f9 0)` : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 8,
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%', background: 'white',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: readinessPct ? '#f59e0b' : '#cbd5e1' }}>
                      {readinessPct ? readinessPct + '%' : '—'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Readiness</div>
                {readinessPct && (
                  <div style={{
                    marginTop: 6,
                    background: readinessPct >= 70 ? '#dcfce7' : readinessPct >= 45 ? '#fef9c3' : '#fee2e2',
                    color: readinessPct >= 70 ? '#16a34a' : readinessPct >= 45 ? '#ca8a04' : '#dc2626',
                    borderRadius: 20,
                    padding: '3px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    {getReadinessStatus(readinessPct)}
                  </div>
                )}
              </div>
            </div>

            {allPerfFilled && allPotFilled && (
              <div style={{
                background: '#f8fafc',
                borderRadius: 10,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>Posición 9-Box calculada</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                    {getNineBoxLabel(perfScore, potScore)}
                  </div>
                </div>
                <div style={{ width: 1, height: 36, background: '#e2e8f0' }} />
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>Score de Desempeño</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0d9488' }}>{perfScore.toFixed(2)} / 5.0</div>
                </div>
                <div style={{ width: 1, height: 36, background: '#e2e8f0' }} />
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>Score de Potencial</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#7c3aed' }}>{potScore.toFixed(2)} / 5.0</div>
                </div>
                <div style={{ width: 1, height: 36, background: '#e2e8f0' }} />
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>Valores 9-Box</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#475569' }}>
                    Perf: {Math.round(perfScore)} · Pot: {Math.round(potScore)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Metadata & Save ───────────────────────────────────────────── */}
          <div style={{
            background: 'white',
            borderRadius: 14,
            padding: '22px 26px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#475569', marginBottom: 16 }}>
              Detalles de la evaluación
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
                  Período
                </label>
                <input
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                  placeholder="ej. Q2 2026"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ flex: '3 1 300px' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
                  Notas del evaluador (opcional)
                </label>
                <input
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Observaciones, contexto adicional, acciones de seguimiento..."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                onClick={handleSave}
                disabled={!allPerfFilled || !allPotFilled || !allExtraFilled}
                style={{
                  padding: '12px 32px',
                  borderRadius: 10,
                  border: 'none',
                  background: (!allPerfFilled || !allPotFilled || !allExtraFilled)
                    ? '#e2e8f0'
                    : saved ? '#16a34a' : '#0d9488',
                  color: (!allPerfFilled || !allPotFilled || !allExtraFilled) ? '#94a3b8' : 'white',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: (!allPerfFilled || !allPotFilled || !allExtraFilled) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {saved ? '✓ Evaluación guardada' : '💾 Guardar evaluación'}
              </button>

              {(!allPerfFilled || !allPotFilled || !allExtraFilled) && (
                <span style={{ fontSize: 13, color: '#f59e0b' }}>
                  ⚠️ Completa las {totalDims - filledDims} dimensión{totalDims - filledDims !== 1 ? 'es' : ''} restante{totalDims - filledDims !== 1 ? 's' : ''} para guardar
                </span>
              )}

              {saved && (
                <span style={{ fontSize: 13, color: '#16a34a' }}>
                  Perfil de {collab.code} actualizado — 9-Box y heatmap sincronizados
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
