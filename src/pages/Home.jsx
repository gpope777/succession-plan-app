export default function Home({ data, onTabChange }) {
  const { meta, collaborators } = data
  const readyNow    = collaborators.filter(c => c.readinessStatus === 'Listo ahora').length
  const readySoon   = collaborators.filter(c => c.readinessStatus === 'Listo pronto').length
  const closestTime = collaborators.sort((a,b) => a.readinessPercentage - b.readinessPercentage)[0]?.timelineMonths || '—'
  const pct = meta.qualityScore

  const STEPS = [
    { num: 1, icon: '🎯', color: '#1D9E75', light: '#e6f5ef', title: 'Puestos críticos',         body: 'Se mapean los roles cuya vacante generaría mayor impacto. Cada puesto tiene un perfil de éxito con competencias técnicas y conductuales.' },
    { num: 2, icon: '📊', color: '#4a42b0', light: '#eceafb', title: 'Evaluación del talento',   body: 'Talent Card, rúbricas conductuales y la matriz 9-Box evalúan desempeño actual y potencial. Puntuaciones objetivas y comparables.' },
    { num: 3, icon: '🔍', color: '#b06a10', light: '#faebd4', title: 'Análisis de brechas',      body: 'Se identifican las competencias que cada colaborador necesita para el siguiente puesto, priorizadas por urgencia.' },
    { num: 4, icon: '📈', color: '#1455a0', light: '#e4eef9', title: 'Desarrollo y seguimiento', body: 'Cada sucesor tiene un IDP de 3 fases con acciones medibles. Revisión trimestral.' },
  ]

  const BENEFITS = [
    { icon: '⚡', color: '#1D9E75', light: '#e6f5ef', title: 'Continuidad operacional',      body: 'Ante una vacante inesperada existe un sucesor identificado. El departamento no se paraliza esperando contratar externamente.',     stat: 'Cubre vacantes 30–50% más rápido · SHRM 2022' },
    { icon: '❤️', color: '#4a42b0', light: '#eceafb', title: 'Retención del talento',         body: 'Los colaboradores con plan de crecimiento claro ven un futuro en la organización, reduciendo la rotación voluntaria.',              stat: '30% más engagement · Gallup 2020' },
    { icon: '⚖️', color: '#b06a10', light: '#faebd4', title: 'Decisiones sin sesgo',          body: 'Las rúbricas y el 9-Box convierten criterios subjetivos en métricas objetivas. Los ascensos se basan en evidencia.',               stat: 'Mayor validez y justicia percibida · Aguinis 2019' },
    { icon: '🏆', color: '#1455a0', light: '#e4eef9', title: 'Cultura HPO',                   body: 'El proceso comunica que la organización invierte en su gente de forma sistemática, generando un ciclo virtuoso.',                   stat: 'Alineado a objetivos HPO y data-driven' },
    { icon: '🧠', color: '#8e3818', light: '#fae8e3', title: 'Transferencia de conocimiento', body: 'El conocimiento crítico — RAF analytics, revenue cycle, data governance — se documenta activamente.',                              stat: 'Reduce dependencia de individuos clave' },
    { icon: '🤖', color: '#0d7a5a', light: '#d0ede4', title: 'Preparación para IA',           body: 'El plan integra competencia en IA como eje transversal. Los sucesores liderarán la transformación analítica.',                     stat: 'Competencia #1 en demanda · WEF 2025' },
  ]

  const DOCS = [
    { id: 'valores',    icon: '🧭', color: '#1D9E75', title: 'Marco de Valores',        desc: 'Conductas observables e indicadores para evaluar alineación cultural.' },
    { id: 'rubricas',   icon: '📐', color: '#0d7a5a', title: 'Marco de Evaluación',     desc: 'Criterios conductuales por dimensión de desempeño y potencial.' },
    { id: 'talent',     icon: '👤', color: '#4a42b0', title: 'Perfiles del Equipo',     desc: 'Evaluación individual con 9-Box, brechas y plan de desarrollo.' },
    { id: 'calidad',    icon: '📊', color: '#1455a0', title: 'Tablero Estratégico',     desc: 'Vista ejecutiva del pipeline: heatmap, métricas y recomendaciones.' },
    { id: 'desarrollo', icon: '📈', color: '#b06a10', title: 'Centro de Desarrollo',    desc: 'Seguimiento de IDPs, alertas activas y acciones del manager.' },
    { id: 'feedback',   icon: '💬', color: '#8e3818', title: 'Buzón de Feedback',       desc: 'Canal de comunicación anónimo o identificado para el equipo.' },
  ]

  const PIPELINE_NODES = [
    { code: 'A1·A3', label: 'Analista de Datos', sub: 'A1 · A2 · A3', chip: '18–36 m.', chipBg: '#faebd4', chipColor: '#b06a10', color: '#1455a0' },
    { code: 'A3',    label: 'Analista Senior / Líder Técnico', sub: 'A3 · (propuesto)', chip: '12–18 m.', chipBg: '#e6f5ef', chipColor: '#0d7a5a', color: '#8e3818' },
    { code: 'UL',    label: 'Supervisor / Unit Lead BI', sub: 'Unit Lead actual', chip: 'Listo pronto', chipBg: '#e6f5ef', chipColor: '#0d7a5a', color: '#1D9E75' },
    { code: 'DIR',   label: 'Director de Business Intelligence', sub: 'Vacante por cubrir', chip: 'Urgente', chipBg: '#fce8e8', chipColor: '#9a2929', color: '#0d1b2a' },
  ]

  return (
    <div className="page">
      <div className="page-inner">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(140deg, #0d1b2a 0%, #132f46 60%, #0d2a3d 100%)',
          borderRadius: 14, padding: '36px 40px',
          marginBottom: 28,
          boxShadow: '0 6px 24px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.08)',
          border: '1px solid rgba(255,255,255,.04)',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#43b891', marginBottom: 10, opacity: .85 }}>
              People Operations · Documento Confidencial
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: -.6, lineHeight: 1.15, marginBottom: 12 }}>
              Plan de Sucesión<br/>
              <span style={{ color: '#43b891' }}>{meta.department}</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.58)', lineHeight: 1.78, maxWidth: 520 }}>
              Sistema estructurado para identificar, desarrollar y preparar talento interno del departamento de BI,
              garantizando continuidad operacional, liderazgo sostenible y crecimiento alineado a los valores y metas
              estratégicas de la organización.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { n: collaborators.length, l: 'Colaboradores' },
                { n: meta.criticalPositions, l: 'Puestos críticos' },
                { n: readySoon, l: 'Listos pronto' },
                { n: closestTime, l: 'Sucesor más cercano', accent: true },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 8, padding: '11px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.accent ? '#43b891' : 'white', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.48)', marginTop: 3, fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10"/>
                <circle cx="55" cy="55" r="48" fill="none" stroke="#1D9E75" strokeWidth="10"
                  strokeDasharray={`${(pct/100)*301.6} 301.6`}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                  style={{ transition: 'stroke-dasharray .8s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1 }}>{pct}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>/ 100</div>
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8, color: '#43b891', opacity: .85 }}>Índice de calidad</div>
          </div>
        </div>

        {/* ── Ciclo del plan — visual step flow ─────────────────────────── */}
        <div className="sec-lbl">Ciclo del plan de sucesión</div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: 28, position: 'relative' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
              {/* Step card */}
              <div style={{
                flex: 1, background: 'white', border: `1px solid ${s.color}30`,
                borderRadius: 10, overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,.05)',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Colored top band */}
                <div style={{ background: s.color, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0, border: '1.5px solid rgba(255,255,255,.5)' }}>
                    {s.num}
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding: '14px 16px', flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 6, lineHeight: 1.2 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>{s.body}</div>
                </div>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div style={{ width: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9h10M10 5l4 4-4 4" stroke="#c8d0d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Pipeline visual ───────────────────────────────────────────── */}
        <div className="sec-lbl">Trayectoria de carrera — {meta.department}</div>
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '24px 28px', marginBottom: 28, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 22, letterSpacing: .1 }}>Ruta de progresión interna estructurada</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {PIPELINE_NODES.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  {/* Circle */}
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: n.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800,
                    boxShadow: `0 4px 14px ${n.color}50`,
                    border: '3px solid white',
                    outline: `2px solid ${n.color}40`,
                    flexShrink: 0,
                  }}>{n.code}</div>
                  {/* Role name */}
                  <div style={{ fontSize: 11.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.3, color: 'var(--text)', maxWidth: 110 }}>{n.label}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textAlign: 'center' }}>{n.sub}</div>
                  {/* Chip */}
                  <div style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: n.chipBg, color: n.chipColor, fontFamily: 'DM Mono, monospace' }}>
                    {n.chip}
                  </div>
                </div>
                {/* Arrow */}
                {i < PIPELINE_NODES.length - 1 && (
                  <div style={{ width: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 44 }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M5 11h12M13 6l6 5-6 5" stroke="#c8d0d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Beneficios ────────────────────────────────────────────────── */}
        <div className="sec-lbl">Beneficios clave para el liderazgo</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
              {/* Icon header */}
              <div style={{ background: b.light, padding: '18px 18px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${b.color}20` }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, boxShadow: `0 3px 10px ${b.color}40` }}>
                  {b.icon}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: b.color, lineHeight: 1.25 }}>{b.title}</div>
              </div>
              {/* Content */}
              <div style={{ padding: '12px 18px 14px' }}>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 10 }}>{b.body}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: b.color, paddingTop: 8, borderTop: `1px solid ${b.color}18`, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ opacity: .6 }}>◆</span> {b.stat}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Documentos ───────────────────────────────────────────────── */}
        <div className="sec-lbl">Módulos del plan — haz clic para abrir</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {DOCS.map(d => (
            <div
              key={d.id}
              onClick={() => onTabChange(d.id)}
              style={{
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 10, cursor: 'pointer',
                overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.05)',
                transition: 'box-shadow .18s, transform .18s',
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.05)'; e.currentTarget.style.transform = 'none'; }}
            >
              {/* Icon block */}
              <div style={{
                width: 46, height: 46, borderRadius: 10, flexShrink: 0,
                background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, boxShadow: `0 3px 10px ${d.color}45`,
              }}>{d.icon}</div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{d.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>{d.desc}</div>
              </div>
              {/* Arrow */}
              <div style={{ flexShrink: 0, color: d.color, fontSize: 16, fontWeight: 700, opacity: .6 }}>›</div>
            </div>
          ))}
        </div>

        {/* ── Footer meta ──────────────────────────────────────────────── */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>Revisión:</strong> Trimestral &nbsp;·&nbsp;
            <strong style={{ color: 'var(--text)' }}>Próxima:</strong> {meta.nextReview} &nbsp;·&nbsp;
            <strong style={{ color: 'var(--text)' }}>Responsable:</strong> {meta.responsible}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text-muted)' }}>Documento confidencial · {meta.period}</div>
        </div>

      </div>
    </div>
  )
}
