export default function Home({ data, onTabChange }) {
  const { meta, collaborators } = data
  const readyNow    = collaborators.filter(c => c.readinessStatus === 'Listo ahora').length
  const readySoon   = collaborators.filter(c => c.readinessStatus === 'Listo pronto').length
  const closestTime = collaborators.sort((a,b) => a.readinessPercentage - b.readinessPercentage)[0]?.timelineMonths || '—'
  const pct = meta.qualityScore
  const deg = Math.round((pct / 100) * 360)

  return (
    <div className="page">
      <div className="page-inner">

        {/* Hero */}
        <div className="hero">
          <div>
            <div className="hero-eye">People Operations · Documento confidencial</div>
            <div className="hero-h1">Plan de Sucesión<br/>{meta.department}</div>
            <div className="hero-p">
              Sistema estructurado para identificar, desarrollar y preparar talento interno del departamento de BI,
              garantizando continuidad operacional, liderazgo sostenible y crecimiento alineado a los valores y metas
              estratégicas de PNS-PR.
            </div>
            <div className="hero-stats">
              <div className="hs"><div className="hs-n">{collaborators.length}</div><div className="hs-l">Colaboradores</div></div>
              <div className="hs"><div className="hs-n">{meta.criticalPositions}</div><div className="hs-l">Puestos críticos</div></div>
              <div className="hs"><div className="hs-n">{readySoon}</div><div className="hs-l">Listos pronto</div></div>
              <div className="hs"><div className="hs-n" style={{ color: 'var(--teal-mid)' }}>{closestTime}</div><div className="hs-l">Sucesor más cercano</div></div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div
              className="qring"
              style={{
                background: `conic-gradient(var(--teal) 0% ${pct}%, rgba(255,255,255,.1) ${pct}% 100%)`
              }}
            >
              <div className="qring-n">{pct}</div>
            </div>
            <div className="qring-l">Índice de calidad</div>
          </div>
        </div>

        {/* Qué es */}
        <div className="sec-lbl">¿Qué es este plan y cómo funciona?</div>
        <div className="grid-2" style={{ marginBottom: 22 }}>
          {[
            { num: 1, color: 'var(--teal)',   title: 'Puestos críticos',        body: 'Se mapean los roles cuya vacante generaría mayor impacto. Cada puesto tiene un perfil de éxito con competencias técnicas y conductuales.' },
            { num: 2, color: 'var(--purple)', title: 'Evaluación del talento',  body: 'Talent Card, rúbricas conductuales y la matriz 9-Box evalúan desempeño actual y potencial. Puntuaciones objetivas y comparables.' },
            { num: 3, color: 'var(--amber)',  title: 'Análisis de brechas',     body: 'Se identifican las competencias que cada colaborador necesita para el siguiente puesto, priorizadas por urgencia.' },
            { num: 4, color: 'var(--blue)',   title: 'Desarrollo y seguimiento', body: 'Cada sucesor tiene un IDP de 3 fases con acciones medibles. Revisión trimestral.' },
          ].map(c => (
            <div key={c.num} className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{c.num}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{c.body}</div>
            </div>
          ))}
        </div>

        {/* Beneficios */}
        <div className="sec-lbl">Beneficios clave para el liderazgo</div>
        <div className="grid-3" style={{ marginBottom: 22 }}>
          {[
            { color: 'var(--teal)',   title: 'Continuidad operacional',     body: 'Ante una vacante inesperada existe un sucesor identificado. El departamento no se paraliza esperando contratar externamente.',      stat: 'Cubre vacantes 30–50% más rápido · SHRM 2022',       sc: 'var(--accent)' },
            { color: 'var(--purple)', title: 'Retención del talento',        body: 'Los colaboradores con plan de crecimiento claro ven un futuro en la organización, reduciendo la rotación voluntaria.',               stat: '30% más engagement · Gallup 2020',                    sc: 'var(--purple)' },
            { color: 'var(--amber)',  title: 'Decisiones sin sesgo',         body: 'Las rúbricas y el 9-Box convierten criterios subjetivos en métricas objetivas. Los ascensos se basan en evidencia.',                  stat: 'Mayor validez y justicia percibida · Aguinis 2019',   sc: 'var(--amber)' },
            { color: 'var(--blue)',   title: 'Cultura HPO',                  body: 'El proceso comunica que PNS-PR invierte en su gente de forma sistemática, generando un ciclo virtuoso.',                              stat: 'Alineado a objetivos HPO y data-driven',              sc: 'var(--blue)' },
            { color: 'var(--coral)',  title: 'Transferencia de conocimiento', body: 'El conocimiento crítico — RAF analytics, revenue cycle, data governance — se documenta activamente.',                                stat: 'Reduce dependencia de individuos clave',              sc: 'var(--coral)' },
            { color: 'var(--teal)',   title: 'Preparación para IA',          body: 'El plan integra competencia en IA como eje transversal. Los sucesores liderarán la transformación analítica.',                        stat: 'Competencia #1 en demanda · WEF 2025',                sc: 'var(--accent)' },
          ].map((b, i) => (
            <div key={i} className="card" style={{ borderTop: `3px solid ${b.color}`, padding: '18px 20px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{b.body}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 7, paddingTop: 7, borderTop: '1px solid var(--border)', color: b.sc }}>{b.stat}</div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="sec-lbl">Pipeline de desarrollo del departamento</div>
        <div className="pipe-wrap" style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Trayectoria de carrera estructurada — {meta.department}</div>
          <div className="pipe-track">
            <div className="pn">
              <div className="pn-circle" style={{ background: 'var(--blue)' }}>A1·A2</div>
              <div className="pn-role">Analista de Datos</div>
              <div className="pn-who">A1 · A2 · A3</div>
              <div className="pn-chip" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>18–36 m.</div>
            </div>
            <div className="parrow">→</div>
            <div className="pn">
              <div className="pn-circle" style={{ background: 'var(--coral)' }}>A3</div>
              <div className="pn-role">Analista Senior / Líder Técnico</div>
              <div className="pn-who">A3 · (propuesto)</div>
              <div className="pn-chip" style={{ background: 'var(--teal-light)', color: 'var(--accent)' }}>12–18 m.</div>
            </div>
            <div className="parrow">→</div>
            <div className="pn">
              <div className="pn-circle" style={{ background: 'var(--teal)' }}>UL</div>
              <div className="pn-role">Supervisor / Unit Lead BI</div>
              <div className="pn-who">Unit Lead actual</div>
              <div className="pn-chip" style={{ background: 'var(--teal-light)', color: 'var(--accent)' }}>Listo pronto</div>
            </div>
            <div className="parrow">→</div>
            <div className="pn">
              <div className="pn-circle" style={{ background: 'var(--navy)' }}>DIR</div>
              <div className="pn-role">Director de Business Intelligence</div>
              <div className="pn-who">Vacante por cubrir</div>
              <div className="pn-chip" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>Urgente</div>
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="sec-lbl">Documentos del plan — haz clic para abrir</div>
        <div className="grid-6" style={{ marginBottom: 20 }}>
          {[
            { id: 'valores', icon: 'V',  color: 'var(--teal)',   title: 'Guía de Valores',        desc: 'Conductas observables e indicadores para evaluar alineación cultural.' },
            { id: 'marco',   icon: 'MC', color: 'var(--navy)',   title: 'Marco de Competencias',  desc: 'Definiciones PNS, modelo de competencias y preguntas STAR.' },
            { id: 'hpo',     icon: 'HP', color: '#7C3AED',       title: 'HPO & Data-Driven',      desc: 'Modelo HPO de De Waal, pilares data-driven e IA como acelerador.' },
            { id: 'talent',  icon: 'TC', color: 'var(--purple)', title: 'Talent Card',            desc: 'Evaluación individual con checklist, 9-Box y plan de sucesión.' },
            { id: 'banca',   icon: 'BT', color: 'var(--amber)',  title: 'Banca de Talento',       desc: 'Perfiles, brechas y planes de desarrollo de los colaboradores.' },
            { id: 'calidad', icon: 'CA', color: 'var(--blue)',   title: 'Análisis de Calidad',    desc: 'Vista ejecutiva del pipeline: heatmap, métricas y recomendaciones.' },
          ].map(d => (
            <div
              key={d.id}
              className="card card-hover"
              style={{ borderTop: `3px solid ${d.color}`, padding: 14, cursor: 'pointer' }}
              onClick={() => onTabChange(d.id)}
            >
              <div style={{ width: 34, height: 34, borderRadius: 7, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 9 }}>{d.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{d.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{d.desc}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: d.color }}>Abrir →</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>Revisión:</strong> Trimestral &nbsp;·&nbsp;
            <strong style={{ color: 'var(--text)' }}>Próxima:</strong> {meta.nextReview} &nbsp;·&nbsp;
            <strong style={{ color: 'var(--text)' }}>Responsable:</strong> {meta.responsible}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>Documento confidencial · PNS-PR · {meta.period}</div>
        </div>

      </div>
    </div>
  )
}
