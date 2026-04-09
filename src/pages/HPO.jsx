export default function HPO() {
  const hpoPillars = [
    { title: 'Liderazgo de calidad', body: 'Los líderes son el motor del HPO. Actúan con integridad, decisión y orientación a resultados. En BI, esto significa sucesores que modelen accountability, data governance y comunicación ejecutiva.', color: 'var(--teal)' },
    { title: 'Apertura y orientación a la acción', body: 'Las organizaciones HPO crean diálogo abierto y toman decisiones rápidas basadas en evidencia. El pipeline de BI debe producir líderes que eliminen silos de información y aceleren ciclos de decisión.', color: 'var(--purple)' },
    { title: 'Enfoque en el largo plazo', body: 'HPO invierte en personas más allá del corto plazo. El Plan de Sucesión es evidencia directa de este pilar: desarrollar talento hoy para necesidades organizacionales a 2-5 años.', color: 'var(--amber)' },
    { title: 'Mejora continua y renovación', body: 'Los HPO cuestionan el status quo sistemáticamente. En BI, esto se traduce en adopción de IA, actualización de metodologías analíticas y ciclos de revisión trimestrales del plan.', color: 'var(--blue)' },
    { title: 'Calidad de los procesos', body: 'Los procesos HPO son estandarizados, medibles y auditables. Las Talent Cards, el 9-Box y las rúbricas conductuales convierten evaluaciones subjetivas en métricas replicables.', color: 'var(--coral)' },
  ]

  const dataDrivenPillars = [
    { label: 'Democratización del dato', desc: 'Todos los colaboradores de BI tienen acceso a datos confiables para tomar decisiones en su ámbito.' },
    { label: 'Calidad e integridad del dato', desc: 'Los datos son precisos, completos y gobernados. La confiabilidad analítica es responsabilidad del equipo.' },
    { label: 'Capacidad analítica avanzada', desc: 'El departamento evoluciona de reporting reactivo a analítica predictiva e IA generativa.' },
    { label: 'Cultura de datos', desc: 'Las decisiones se toman con evidencia, no con intuición. Se documenta el "por qué" detrás de cada análisis.' },
    { label: 'Liderazgo data-literate', desc: 'Los líderes de la organización interpretan dashboards, hacen preguntas basadas en datos y exigen evidencia cuantitativa.' },
    { label: 'IA como acelerador estratégico', desc: 'La IA no reemplaza al equipo de BI — amplifica su capacidad. Los sucesores deben dominar IA para escalar impacto.' },
  ]

  const maturityLevels = [
    { level: 1, name: 'Reporting reactivo', desc: 'Se responde a solicitudes ad hoc. No hay proceso proactivo.', status: 'past' },
    { level: 2, name: 'Reporting estandarizado', desc: 'Dashboards regulares, KPIs definidos. Proceso consistente.', status: 'current' },
    { level: 3, name: 'Analítica explicativa', desc: 'Se diagnostica el "por qué" detrás de los datos.', status: 'target' },
    { level: 4, name: 'Analítica predictiva', desc: 'Se anticipa lo que ocurrirá. Machine learning aplicado.', status: 'future' },
    { level: 5, name: 'Analítica prescriptiva + IA', desc: 'La IA recomienda acciones. El equipo diseña e interpreta.', status: 'future' },
  ]

  return (
    <div className="page">
      <div className="page-inner">

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>HPO & Data-Driven Organization</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 680 }}>
            El Plan de Sucesión de BI está diseñado para construir una organización de alto desempeño (HPO) data-driven.
            Basado en el modelo HPO de André de Waal (2012), los 5 pilares organizan el desarrollo del talento en la organización.
          </div>
        </div>

        {/* HPO Pillars */}
        <div className="sec-lbl">Los 5 pilares HPO aplicados a BI</div>
        {hpoPillars.map((p, i) => (
          <div key={i} className="card card-p" style={{ marginBottom: 10, borderLeft: `4px solid ${p.color}` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: p.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{p.body}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Data-Driven */}
        <div className="sec-lbl" style={{ marginTop: 20 }}>Pilares data-driven para el pipeline de BI</div>
        <div className="grid-3" style={{ marginBottom: 22 }}>
          {dataDrivenPillars.map((p, i) => (
            <div key={i} className="card card-p" style={{ borderTop: '3px solid var(--teal)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5, color: 'var(--navy)' }}>{p.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Maturity */}
        <div className="sec-lbl">Curva de madurez analítica — ¿Dónde estamos y hacia dónde vamos?</div>
        <div className="card" style={{ overflow: 'hidden', marginBottom: 22 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--navy)' }}>
                {['Nivel', 'Etapa', 'Descripción', 'Estado'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {maturityLevels.map(m => (
                <tr key={m.level} style={{ borderBottom: '1px solid var(--border)', background: m.status === 'current' ? 'var(--teal-light)' : 'transparent' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: m.status === 'current' ? 'var(--accent)' : 'var(--text-muted)' }}>{m.level}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '10px 14px', fontSize: 14, color: 'var(--text-muted)' }}>{m.desc}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {m.status === 'current' && <span className="chip chip-teal">Situación actual</span>}
                    {m.status === 'target'  && <span className="chip chip-amber">Meta 12–18 m.</span>}
                    {m.status === 'future'  && <span className="chip chip-blue">Horizonte futuro</span>}
                    {m.status === 'past'    && <span className="chip" style={{ background: 'var(--gray-2)', color: 'var(--text-muted)' }}>Superado</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* IA como eje transversal */}
        <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 10 }}>
            IA como eje transversal del plan de sucesión
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { level: 'Analista', role: 'AI User', desc: 'Usa herramientas de IA para acelerar análisis, generar visualizaciones y documentar hallazgos. Copilot, ChatGPT, Power BI AI features.', color: 'var(--blue)' },
              { level: 'Supervisor / Unit Lead', role: 'AI Integrator', desc: 'Diseña flujos de trabajo donde la IA amplifica la capacidad del equipo. Define cuándo y cómo usar IA con criterio estratégico.', color: 'var(--teal)' },
              { level: 'Director de BI', role: 'AI Strategist', desc: 'Define la visión de IA del departamento: governance, ética de datos, roadmap de adopción, ROI de herramientas. Decisiones de inversión.', color: '#7C3AED' },
            ].map(a => (
              <div key={a.level} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '18px 20px', border: `1px solid rgba(255,255,255,.08)` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: a.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{a.level}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 8 }}>{a.role}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-4)', lineHeight: 1.7 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
