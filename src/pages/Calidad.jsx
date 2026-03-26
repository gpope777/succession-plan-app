const HEAT_COLOR = (v) => {
  if (v === null || v === undefined) return { bg: '#f0f0f0', text: '#999', label: 'N/A' }
  if (v >= 5) return { bg: '#0f6e56', text: 'white', label: '5' }
  if (v >= 4) return { bg: '#1D9E75', text: 'white', label: String(v) }
  if (v >= 3) return { bg: '#BA7517', text: 'white', label: String(v) }
  if (v >= 2) return { bg: '#993C1D', text: 'white', label: String(v) }
  return { bg: '#A32D2D', text: 'white', label: String(v) }
}

const COLLABS = ['UL', 'A1', 'A2', 'A3', 'MB']

export default function Calidad({ data }) {
  const { collaborators, heatmap, recommendations, meta } = data
  const readyNow    = collaborators.filter(c => c.readinessStatus === 'Listo ahora').length
  const readySoon   = collaborators.filter(c => c.readinessStatus === 'Listo pronto').length
  const readyFuture = collaborators.filter(c => c.readinessStatus === 'Listo futuro').length
  const critGaps    = collaborators.reduce((sum, c) => sum + c.gaps.filter(g => g.severity === 'Crítica').length, 0)
  const pct = meta.qualityScore

  const collabById = {}
  collaborators.forEach(c => { collabById[c.id] = c })

  return (
    <div className="page">
      <div className="page-inner">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>Análisis de Calidad del Pipeline</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>Vista ejecutiva — {meta.period}</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 22 }}>
          {[
            { n: collaborators.length, label: 'Colaboradores', color: 'var(--navy)' },
            { n: readyNow,    label: 'Listos ahora',  color: 'var(--teal)' },
            { n: readySoon,   label: 'Listos pronto', color: 'var(--amber)' },
            { n: readyFuture, label: 'Listos futuro', color: 'var(--blue)' },
            { n: critGaps,    label: 'Brechas críticas totales', color: 'var(--red)' },
          ].map((k, i) => (
            <div key={i} className="card card-p" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: k.color }}>{k.n}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Quality Verdict */}
        <div className="sec-lbl">Veredicto de calidad</div>
        <div className="card card-p" style={{ marginBottom: 22, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: `conic-gradient(var(--teal) 0% ${pct}%, var(--gray-2) ${pct}% 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <div style={{ position: 'absolute', width: 76, height: 76, borderRadius: '50%', background: 'white' }} />
              <div style={{ position: 'relative', fontSize: 28, fontWeight: 700, color: 'var(--navy)' }}>{pct}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginTop: 8 }}>/ 100</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>Banca en desarrollo</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              El departamento cuenta con talento identificado y en desarrollo, pero ningún colaborador está listo hoy para asumir
              el rol de Director o Supervisor de forma inmediata. <strong style={{ color: 'var(--navy)' }}>UL es la candidata más preparada</strong> y
              sigue siendo la prioridad número uno del pipeline. La brecha universal de IA es la mayor vulnerabilidad estratégica del equipo.
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="sec-lbl">Heatmap de competencias</div>
        <div className="card" style={{ marginBottom: 22, overflow: 'hidden' }}>
          <table className="heatmap-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', minWidth: 220 }}>Dimensión</th>
                {COLLABS.map(id => (
                  <th key={id} style={{ minWidth: 70 }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{id}</div>
                    <div style={{ fontWeight: 400, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {collabById[id]?.code?.replace('Colaborador ', '') || id}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 14, fontWeight: 500, paddingRight: 20 }}>{row.dimension}</td>
                  {COLLABS.map(id => {
                    const v = row[id]
                    const { bg, text, label } = HEAT_COLOR(v)
                    return (
                      <td key={id} style={{ textAlign: 'center' }}>
                        <span className="heatmap-cell" style={{ background: bg, color: text }}>{label}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '10px 16px', background: 'var(--gray-1)', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Escala:</div>
            {[
              { v: 5, bg: '#0f6e56', text: 'white', label: '5 — Excepcional' },
              { v: 4, bg: '#1D9E75', text: 'white', label: '4 — Alto' },
              { v: 3, bg: '#BA7517', text: 'white', label: '3 — Moderado' },
              { v: 2, bg: '#993C1D', text: 'white', label: '2 — En desarrollo' },
              { v: 1, bg: '#A32D2D', text: 'white', label: '1 — Brecha crítica' },
            ].map(s => (
              <div key={s.v} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: s.bg, flexShrink: 0 }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Table */}
        <div className="sec-lbl">Pipeline — resumen por colaborador</div>
        <div className="card" style={{ marginBottom: 22, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--border)' }}>
                {['Colaborador', 'Puesto actual', 'Puesto objetivo', 'Activos', 'Brechas críticas', 'Readiness', 'Timeline'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...collaborators].sort((a, b) => a.priority - b.priority).map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{c.code}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c.currentPosition}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c.targetPosition}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c.strengths.slice(0, 2).join(', ')}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {c.gaps.filter(g => g.severity === 'Crítica').slice(0, 2).map((g, i) => (
                      <div key={i} style={{ color: 'var(--red)', fontSize: 12 }}>· {g.name}</div>
                    ))}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className={`chip chip-${c.readinessStatus === 'Listo ahora' ? 'teal' : c.readinessStatus === 'Listo pronto' ? 'amber' : 'blue'}`}>
                      {c.readinessStatus}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                    {c.timelineMonths}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations */}
        <div className="sec-lbl">Recomendaciones estratégicas</div>
        {recommendations.map(r => (
          <div key={r.priority} className="card card-p" style={{ marginBottom: 10, borderLeft: `4px solid var(--${r.color})`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `var(--${r.color})`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {r.priority}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{r.detail}</div>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
