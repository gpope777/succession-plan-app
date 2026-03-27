import { useState } from 'react'

// ─── Role progression data ────────────────────────────────────────────────────
const ROLES = [
  {
    level: 'Analista',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    focus: 'Precisión técnica y entrega de valor analítico',
    aiRole: 'AI User',
    aiDesc: 'Usa IA para acelerar análisis, generar visualizaciones y documentar hallazgos.',
    hpoFocus: 'Calidad de procesos',
    hpoDesc: 'Estandariza su trabajo, mantiene datos íntegros y entrega a tiempo.',
    readinessTarget: '70–80%',
    keyBehaviors: [
      'Entrega análisis precisos y bien documentados',
      'Comunica hallazgos con claridad a sus pares',
      'Adopta herramientas nuevas con disposición',
      'Solicita retroalimentación para mejorar',
    ],
  },
  {
    level: 'Supervisor / Unit Lead',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    focus: 'Coordinar equipos, desarrollar talento y acelerar decisiones',
    aiRole: 'AI Integrator',
    aiDesc: 'Diseña flujos donde la IA amplifica la capacidad del equipo. Decide cuándo y cómo usarla.',
    hpoFocus: 'Apertura y orientación a la acción',
    hpoDesc: 'Elimina silos, crea diálogo y toma decisiones rápidas basadas en evidencia.',
    readinessTarget: '60–75%',
    keyBehaviors: [
      'Desarrolla las capacidades de su equipo activamente',
      'Facilita decisiones basadas en datos, no en intuición',
      'Resuelve conflictos con datos y diálogo abierto',
      'Comunica resultados a nivel ejecutivo con impacto',
    ],
  },
  {
    level: 'Director de BI',
    color: '#0D9488',
    bg: '#F0FDFA',
    border: '#99F6E4',
    focus: 'Visión estratégica, governance y crecimiento organizacional',
    aiRole: 'AI Strategist',
    aiDesc: 'Define la visión de IA del departamento: governance, ética, roadmap y ROI de herramientas.',
    hpoFocus: 'Liderazgo de calidad',
    hpoDesc: 'Actúa con integridad, modela accountability y orienta al equipo hacia resultados de largo plazo.',
    readinessTarget: '85–100%',
    keyBehaviors: [
      'Articula y defiende la visión data-driven ante la organización',
      'Atrae, retiene y desarrolla talento de alto potencial',
      'Gestiona recursos, riesgos y prioridades estratégicamente',
      'Construye alianzas transversales en toda la empresa',
    ],
  },
]

// ─── HPO Pillars (condensed) ──────────────────────────────────────────────────
const HPO_PILLARS = [
  { icon: '🎯', title: 'Liderazgo de calidad', desc: 'Líderes íntegros, decisivos y orientados a resultados. Modelan accountability y comunicación ejecutiva.' },
  { icon: '💬', title: 'Apertura y acción', desc: 'Diálogo abierto, decisiones rápidas basadas en evidencia. Sin silos de información.' },
  { icon: '📅', title: 'Visión de largo plazo', desc: 'Inversión en personas más allá del trimestre. El plan de sucesión es la evidencia directa.' },
  { icon: '🔄', title: 'Mejora continua', desc: 'Cuestionar el status quo sistemáticamente. Adopción de IA y revisiones trimestrales del plan.' },
  { icon: '📊', title: 'Procesos medibles', desc: 'Evaluaciones estandarizadas y auditables. Las Talent Cards y rúbricas convierten lo subjetivo en métrica.' },
]

// ─── Red flags ────────────────────────────────────────────────────────────────
const RED_FLAGS = [
  'Evita compartir datos o conocimiento con el equipo',
  'Externaliza errores o los oculta',
  'Resiste el cambio o nuevas herramientas sin argumento técnico',
  'No busca retroalimentación ni desarrollo por iniciativa propia',
  'Comunicación inconsistente, tardía o sesgada',
  'Toma decisiones que comprometen la integridad de los datos',
  'Prioriza visibilidad personal sobre el resultado del equipo',
  'No puede articular el impacto de su trabajo en el negocio',
]

// ─── Component helpers ────────────────────────────────────────────────────────
function RoleCard({ r }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: `1.5px solid ${r.border}`,
      borderRadius: 14, overflow: 'hidden',
      background: 'white',
    }}>
      {/* Header */}
      <div style={{ background: r.bg, padding: '16px 20px', borderBottom: `1px solid ${r.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: r.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
          {r.level}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>{r.focus}</div>
      </div>

      {/* Core metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #f1f5f9' }}>
        {[
          { lbl: 'Rol con IA', val: r.aiRole },
          { lbl: 'Pilar HPO', val: r.hpoFocus },
          { lbl: 'Readiness meta', val: r.readinessTarget },
        ].map(m => (
          <div key={m.lbl} style={{ padding: '12px 14px', borderRight: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{m.lbl}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Expandable detail */}
      <div style={{ padding: '0 20px' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', fontSize: 13, fontWeight: 600, color: r.color,
          }}
        >
          <span>Ver comportamientos clave</span>
          <span style={{ fontSize: 16, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
        </button>

        {open && (
          <div style={{ paddingBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
              {r.keyBehaviors.map((b, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  fontSize: 12, color: '#475569', lineHeight: 1.5,
                  background: r.bg, borderRadius: 8, padding: '8px 10px',
                }}>
                  <span style={{ color: r.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
                  {b}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', background: '#f8fafc', borderRadius: 8, padding: '10px 12px', lineHeight: 1.6 }}>
              <strong>IA:</strong> {r.aiDesc}<br />
              <strong>HPO:</strong> {r.hpoDesc}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CompCard({ c, type }) {
  const [open, setOpen] = useState(false)
  const accent = type === 'behavioral' ? '#2563EB' : '#0D9488'
  const bg     = type === 'behavioral' ? '#EFF6FF' : '#F0FDFA'

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: 'white', marginBottom: 8 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', textAlign: 'left',
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: accent, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 12, flexShrink: 0,
        }}>{c.id}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{c.description}</div>
        </div>
        <span style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '14px 16px', background }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { lbl: 'Analista', val: c.analyst,    color: '#2563EB' },
              { lbl: 'Supervisor', val: c.supervisor, color: '#D97706' },
              { lbl: 'Director',  val: c.director,   color: '#0D9488' },
            ].map(l => (
              <div key={l.lbl} style={{ background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: l.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{l.lbl}</div>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.55 }}>{l.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function EstandaresTalento({ data }) {
  const { competencies = [] } = data
  const [activeSection, setActiveSection] = useState('roles')

  const behavioral = competencies.filter(c => c.category === 'behavioral')
  const technical  = competencies.filter(c => c.category === 'technical')

  const sections = [
    { id: 'roles',         label: 'Progresión de roles' },
    { id: 'conductuales',  label: 'Competencias conductuales' },
    { id: 'tecnicas',      label: 'Competencias técnicas' },
    { id: 'hpo',           label: 'Perfil HPO' },
    { id: 'alertas',       label: 'Señales de alerta' },
  ]

  return (
    <div className="page">
      <div className="page-inner">

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
            Estándares de Talento
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 680 }}>
            Marco de referencia integrado para evaluaciones de sucesión. Define qué se espera en cada nivel de carrera —
            competencias conductuales y técnicas, perfil de liderazgo HPO, rol con IA y señales de alerta cultural.
          </div>
        </div>

        {/* Section nav pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: activeSection === s.id ? 'none' : '1.5px solid #e2e8f0',
                background: activeSection === s.id ? 'var(--navy)' : 'white',
                color: activeSection === s.id ? 'white' : '#475569',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >{s.label}</button>
          ))}
        </div>

        {/* ── Progresión de roles ────────────────────────────────────── */}
        {activeSection === 'roles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 4 }}>
              Cada nivel de carrera exige un perfil distinto de competencias, relación con la IA y contribución al modelo HPO.
              Expande cada tarjeta para ver los comportamientos clave esperados.
            </div>
            {ROLES.map(r => <RoleCard key={r.level} r={r} />)}

            {/* Maturity table */}
            <div style={{ marginTop: 8 }}>
              <div className="sec-lbl">Curva de madurez analítica del departamento</div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--navy)' }}>
                      {['Nivel', 'Etapa', 'Descripción', 'Estado'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { level: 1, name: 'Reporting reactivo',       desc: 'Se responde a solicitudes ad hoc. Sin proceso proactivo.',       status: 'past' },
                      { level: 2, name: 'Reporting estandarizado',   desc: 'Dashboards regulares, KPIs definidos. Proceso consistente.',    status: 'current' },
                      { level: 3, name: 'Analítica explicativa',     desc: 'Se diagnostica el "por qué" detrás de los datos.',              status: 'target' },
                      { level: 4, name: 'Analítica predictiva',      desc: 'Se anticipa lo que ocurrirá. Machine learning aplicado.',       status: 'future' },
                      { level: 5, name: 'Analítica prescriptiva + IA', desc: 'La IA recomienda acciones. El equipo diseña e interpreta.',  status: 'future' },
                    ].map(m => (
                      <tr key={m.level} style={{ borderBottom: '1px solid var(--border)', background: m.status === 'current' ? '#F0FDFA' : 'transparent' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: m.status === 'current' ? '#0D9488' : '#94a3b8' }}>{m.level}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600, fontSize: 13 }}>{m.name}</td>
                        <td style={{ padding: '10px 14px', fontSize: 13, color: '#64748b' }}>{m.desc}</td>
                        <td style={{ padding: '10px 14px' }}>
                          {m.status === 'current' && <span className="chip chip-teal">Situación actual</span>}
                          {m.status === 'target'  && <span className="chip chip-amber">Meta 12–18 m.</span>}
                          {m.status === 'future'  && <span className="chip chip-blue">Horizonte futuro</span>}
                          {m.status === 'past'    && <span className="chip" style={{ background: '#f1f5f9', color: '#94a3b8' }}>Superado</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Competencias conductuales ──────────────────────────────── */}
        {activeSection === 'conductuales' && (
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
              Las competencias conductuales definen <strong>cómo</strong> se trabaja, no solo qué se produce.
              Son el predictor más fuerte del potencial de liderazgo a largo plazo.
              Cada competencia se evalúa en las Rúbricas y alimenta el 9-Box.
            </div>
            {behavioral.length > 0
              ? behavioral.map(c => <CompCard key={c.id} c={c} type="behavioral" />)
              : <div style={{ color: '#94a3b8', fontSize: 14, padding: 20, textAlign: 'center' }}>No hay competencias conductuales cargadas en los datos.</div>
            }
          </div>
        )}

        {/* ── Competencias técnicas ──────────────────────────────────── */}
        {activeSection === 'tecnicas' && (
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
              Las competencias técnicas estratégicas definen el dominio disciplinar requerido para cada rol.
              A diferencia de habilidades técnicas operacionales, estas son las capacidades que diferencian
              a un colaborador de alto impacto en un departamento de BI data-driven.
            </div>
            {technical.length > 0
              ? technical.map(c => <CompCard key={c.id} c={c} type="technical" />)
              : <div style={{ color: '#94a3b8', fontSize: 14, padding: 20, textAlign: 'center' }}>No hay competencias técnicas cargadas en los datos.</div>
            }
          </div>
        )}

        {/* ── Perfil HPO ─────────────────────────────────────────────── */}
        {activeSection === 'hpo' && (
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>
              Basado en el modelo HPO de André de Waal (2012). Un sucesor de BI debe contribuir a los 5 pilares
              de una organización de alto desempeño, no solo desempeñarse bien en su rol individual.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {HPO_PILLARS.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: 12, padding: '16px 18px',
                  borderLeft: '4px solid var(--navy)',
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>
                      {i + 1}. {p.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* IA axis */}
            <div className="sec-lbl">IA como competencia transversal obligatoria</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {ROLES.map(r => (
                <div key={r.level} style={{
                  background: 'var(--navy)', borderRadius: 12, padding: '18px 20px',
                  border: `2px solid ${r.color}`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: r.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{r.level}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 8 }}>{r.aiRole}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>{r.aiDesc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Señales de alerta ──────────────────────────────────────── */}
        {activeSection === 'alertas' && (
          <div>
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12,
              padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
              <div style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.7 }}>
                <strong>Riesgo estratégico:</strong> Un sucesor con alto desempeño técnico pero bajo ajuste cultural
                representa un riesgo real para la continuidad del departamento. Estas señales deben documentarse
                durante el proceso de evaluación y discutirse en el comité de sucesión antes de cualquier decisión.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {RED_FLAGS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: 'white', border: '1.5px solid #FECACA',
                  borderRadius: 10, padding: '12px 14px',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#FEE2E2', color: '#DC2626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 12, flexShrink: 0, marginTop: 1,
                  }}>!</div>
                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#14532D', marginBottom: 8 }}>✅ Señales positivas de ajuste cultural</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  'Comparte conocimiento proactivamente',
                  'Asume responsabilidad por sus errores',
                  'Propone mejoras sin que se lo pidan',
                  'Busca retroalimentación y actúa sobre ella',
                  'Comunica con transparencia y a tiempo',
                  'Toma decisiones con datos y las defiende',
                  'Prioriza el resultado del equipo sobre el individual',
                  'Puede explicar el impacto de su trabajo en el negocio',
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#166534', lineHeight: 1.5 }}>
                    <span style={{ color: '#16A34A', flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✓</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
