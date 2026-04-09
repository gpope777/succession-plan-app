const COLOR_CYCLE = ['var(--teal)', 'var(--blue)', 'var(--purple)', 'var(--amber)', 'var(--coral)']

function idpPct(collabs) {
  const all  = collabs.flatMap(c => c.idp?.flatMap(p => p.actions) || [])
  const done = all.filter(a => a.status === 'done').length
  return all.length ? Math.round(done / all.length * 100) : 0
}

function riskLevel(collabs) {
  if (!collabs.length) return { label: 'Sin datos', color: 'var(--text-muted)', bg: 'var(--bg)' }
  const pct = idpPct(collabs)
  const critGaps = collabs.flatMap(c => c.gaps?.filter(g => g.severity === 'Crítica') || []).length
  if (pct === 0 && collabs.length > 0) return { label: 'Sin iniciar', color: '#ef4444', bg: '#fef2f2' }
  if (critGaps > collabs.length * 2) return { label: 'Riesgo alto', color: '#f97316', bg: '#fff7ed' }
  if (pct >= 50) return { label: 'En buen camino', color: 'var(--teal)', bg: 'var(--teal-light)' }
  return { label: 'En progreso', color: 'var(--amber)', bg: 'var(--amber-light)' }
}

export default function PlanGeneral({ departments, deptDataMap, onDeptChange }) {
  const depts = departments.map((dept, i) => {
    const data    = deptDataMap[dept.id] || { collaborators: [], meta: {} }
    const collabs = data.collaborators || []
    const color   = COLOR_CYCLE[i % COLOR_CYCLE.length]
    const pct     = idpPct(collabs)
    const risk    = riskLevel(collabs)
    const readyNow   = collabs.filter(c => c.readinessStatus === 'Listo ahora').length
    const readySoon  = collabs.filter(c => c.readinessStatus === 'Listo pronto').length
    const critGaps   = collabs.flatMap(c => c.gaps?.filter(g => g.severity === 'Crítica') || []).length
    const doneActs   = collabs.flatMap(c => c.idp?.flatMap(p => p.actions.filter(a => a.status === 'done')) || []).length
    const totalActs  = collabs.flatMap(c => c.idp?.flatMap(p => p.actions) || []).length
    return { dept, data, collabs, color, pct, risk, readyNow, readySoon, critGaps, doneActs, totalActs }
  })

  // global totals
  const totalCollabs   = depts.reduce((s, d) => s + d.collabs.length, 0)
  const totalReadyNow  = depts.reduce((s, d) => s + d.readyNow, 0)
  const totalCritGaps  = depts.reduce((s, d) => s + d.critGaps, 0)
  const totalDoneActs  = depts.reduce((s, d) => s + d.doneActs, 0)
  const totalActs      = depts.reduce((s, d) => s + d.totalActs, 0)
  const globalPct      = totalActs ? Math.round(totalDoneActs / totalActs * 100) : 0

  return (
    <div className="page">
      <div className="page-inner">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>Plan General de Sucesión</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>
            La Organización · Visión consolidada de {departments.length} departamento{departments.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Global KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Departamentos',      value: departments.length, color: 'var(--navy)',   sub: 'en el plan' },
            { label: 'Colaboradores',      value: totalCollabs,       color: 'var(--blue)',   sub: 'en pipeline' },
            { label: 'Listos ahora',        value: totalReadyNow,      color: 'var(--teal)',   sub: 'para sucesión' },
            { label: 'Progreso global IDP', value: `${globalPct}%`,    color: 'var(--purple)', sub: 'acciones completadas' },
            { label: 'Brechas críticas',   value: totalCritGaps,      color: '#ef4444',       sub: 'pendientes de atender' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginTop: 2 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Global progress bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Progreso global de IDPs — todos los departamentos</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--teal)' }}>{globalPct}%</span>
          </div>
          <div className="readiness-bar-bg" style={{ height: 10, borderRadius: 6, marginBottom: 14 }}>
            <div className="readiness-bar-fill" style={{ width: `${globalPct}%`, background: 'var(--teal)', height: 10, borderRadius: 6 }} />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {depts.map(d => (
              <div key={d.dept.id} style={{ flex: '1 1 140px', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{d.dept.icon} {d.dept.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.pct}%</span>
                </div>
                <div className="readiness-bar-bg" style={{ height: 5, borderRadius: 4 }}>
                  <div className="readiness-bar-fill" style={{ width: `${d.pct}%`, background: d.color, height: 5, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.doneActs}/{d.totalActs} acciones</div>
              </div>
            ))}
          </div>
        </div>

        {/* Department cards */}
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 14 }}>
          Estado por departamento
        </div>

        {depts.length === 0 && (
          <div className="card card-p" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay departamentos configurados. Activa el Modo HR y usa "+ Nuevo departamento" para agregar uno.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, marginBottom: 28 }}>
          {depts.map(d => (
            <div
              key={d.dept.id}
              className="card"
              style={{ borderLeft: `4px solid ${d.color}`, cursor: 'pointer', transition: 'box-shadow .15s' }}
              onClick={() => onDeptChange(d.dept.id)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              {/* Dept header */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: d.color + '20', border: `2px solid ${d.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {d.dept.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{d.dept.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {d.data.meta?.period || 'Sin período definido'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: d.color }}>{d.pct}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>IDP</div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, borderBottom: '1px solid var(--border)' }}>
                {[
                  { v: d.collabs.length, l: 'Colaboradores' },
                  { v: d.readyNow,       l: 'Listos ahora' },
                  { v: d.readySoon,      l: 'Listos pronto' },
                  { v: d.critGaps,       l: 'Brechas críticas' },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar + risk + CTA */}
              <div style={{ padding: '12px 18px' }}>
                <div className="readiness-bar-bg" style={{ height: 6, borderRadius: 4, marginBottom: 10 }}>
                  <div className="readiness-bar-fill" style={{ width: `${d.pct}%`, background: d.color, height: 6, borderRadius: 4 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, background: d.risk.bg, color: d.risk.color, borderRadius: 6, padding: '3px 10px' }}>{d.risk.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {d.collabs.length === 0 ? 'Sin colaboradores aún' : `${d.doneActs}/${d.totalActs} acciones`}
                  </span>
                  <span style={{ fontSize: 12, color: d.color, fontWeight: 700 }}>Ver → </span>
                </div>
              </div>

              {/* Collaborator mini-list */}
              {d.collabs.length > 0 && (
                <div style={{ padding: '0 18px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Pipeline</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {d.collabs.slice(0, 5).map(c => {
                      const cPct = (() => {
                        const all = c.idp?.flatMap(p => p.actions) || []
                        return all.length ? Math.round(all.filter(a => a.status === 'done').length / all.length * 100) : 0
                      })()
                      return (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '4px 8px' }}>
                          <div style={{ width: 22, height: 22, borderRadius: 6, background: d.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{c.id}</div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--navy)' }}>{c.code || `Colab. ${c.id}`}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{cPct}% IDP</div>
                          </div>
                        </div>
                      )
                    })}
                    {d.collabs.length > 5 && (
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: 'var(--text-muted)', padding: '0 4px' }}>+{d.collabs.length - 5} más</div>
                    )}
                  </div>
                </div>
              )}

              {d.collabs.length === 0 && (
                <div style={{ padding: '0 18px 16px', fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                  Sin colaboradores — haz clic para agregar
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cross-dept readiness summary */}
        {totalCollabs > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 14 }}>
              Distribución de Readiness — todos los departamentos
            </div>
            <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Listo ahora',   color: 'var(--teal)',   count: depts.reduce((s, d) => s + d.readyNow, 0) },
                  { label: 'Listo pronto',  color: 'var(--amber)',  count: depts.reduce((s, d) => s + d.readySoon, 0) },
                  { label: 'Listo futuro',  color: 'var(--blue)',   count: depts.reduce((s, d) => s + d.collabs.filter(c => c.readinessStatus === 'Listo futuro').length, 0) },
                ].map(r => {
                  const pct = totalCollabs ? Math.round(r.count / totalCollabs * 100) : 0
                  return (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{r.count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({pct}%)</span></span>
                      </div>
                      <div className="readiness-bar-bg" style={{ height: 8, borderRadius: 4 }}>
                        <div className="readiness-bar-fill" style={{ width: `${pct}%`, background: r.color, height: 8, borderRadius: 4 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
