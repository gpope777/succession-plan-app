export default function Marco({ data }) {
  const { competencies } = data

  const behavioral = competencies.filter(c => c.category === 'behavioral')
  const technical  = competencies.filter(c => c.category === 'technical')

  return (
    <div className="page">
      <div className="page-inner">

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>Marco de Competencias PNS-PR</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 680 }}>
            El marco define las competencias esperadas en tres niveles: Analista, Supervisor y Director. Sirve como base para
            las evaluaciones de sucesión, los IDPs y las entrevistas STAR. Cada competencia está anclada a un valor organizacional.
          </div>
        </div>

        {/* Competencias conductuales */}
        <div className="sec-lbl">Competencias conductuales</div>
        {behavioral.map(c => (
          <div key={c.id} className="comp-card">
            <div className="comp-header">
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {c.id}
              </div>
              <div>
                <div className="comp-name">{c.name}</div>
                <div className="comp-cat">Conductual · Relacionado a: {c.relatedValue}</div>
              </div>
            </div>
            <div className="comp-body">
              <div className="comp-desc">{c.description}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div className="comp-level" style={{ background: 'var(--blue-light)' }}>
                  <div className="comp-level-label" style={{ color: 'var(--blue)' }}>Analista</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.analyst}</div>
                </div>
                <div className="comp-level" style={{ background: 'var(--amber-light)' }}>
                  <div className="comp-level-label" style={{ color: 'var(--amber)' }}>Supervisor</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.supervisor}</div>
                </div>
                <div className="comp-level" style={{ background: 'var(--teal-light)' }}>
                  <div className="comp-level-label" style={{ color: 'var(--accent)' }}>Director</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.director}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Competencias técnicas */}
        <div className="sec-lbl" style={{ marginTop: 20 }}>Competencias técnicas estratégicas</div>
        {technical.map(c => (
          <div key={c.id} className="comp-card">
            <div className="comp-header">
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {c.id}
              </div>
              <div>
                <div className="comp-name">{c.name}</div>
                <div className="comp-cat">Técnica estratégica · {c.relatedValue}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="chip chip-teal">Competencia 2025</span>
              </div>
            </div>
            <div className="comp-body">
              <div className="comp-desc">{c.description}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div className="comp-level" style={{ background: 'var(--blue-light)' }}>
                  <div className="comp-level-label" style={{ color: 'var(--blue)' }}>Analista</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.analyst}</div>
                </div>
                <div className="comp-level" style={{ background: 'var(--amber-light)' }}>
                  <div className="comp-level-label" style={{ color: 'var(--amber)' }}>Supervisor</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.supervisor}</div>
                </div>
                <div className="comp-level" style={{ background: 'var(--teal-light)' }}>
                  <div className="comp-level-label" style={{ color: 'var(--accent)' }}>Director</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.director}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Ajuste cultural */}
        <div className="sec-lbl" style={{ marginTop: 20 }}>Ajuste cultural — señales de alerta</div>
        <div className="card card-p">
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
            Un sucesor con alto desempeño técnico pero bajo ajuste cultural representa un riesgo estratégico.
            Estas son las señales de bajo ajuste que deben documentarse durante el proceso de evaluación:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              'Evita compartir datos o conocimiento con el equipo',
              'Externaliza los errores o los oculta',
              'Resiste el cambio o nuevas herramientas (especialmente IA)',
              'No busca retroalimentación ni desarrollo por iniciativa propia',
              'Comunicación inconsistente, tardía o sesgada',
              'Toma decisiones que comprometen la integridad de los datos',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--text-muted)', alignItems: 'baseline', background: 'var(--red-light)', borderRadius: 7, padding: '8px 12px' }}>
                <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0 }}>!</span>
                {s}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
