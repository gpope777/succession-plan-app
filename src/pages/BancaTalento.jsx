const COLOR_MAP = { teal: 'var(--teal)', purple: 'var(--purple)', amber: 'var(--amber)', blue: 'var(--blue)', coral: 'var(--coral)' }

function ReadinessBadge({ status }) {
  const map = { 'Listo ahora': 'teal', 'Listo pronto': 'amber', 'Listo futuro': 'blue' }
  return <span className={`chip chip-${map[status] || 'blue'}`}>{status}</span>
}

export default function BancaTalento({ data, adminMode, onTabChange }) {
  const sorted = [...data.collaborators].sort((a, b) => a.priority - b.priority)

  return (
    <div className="page">
      <div className="page-inner">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>Banca de Talento</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>{data.collaborators.length} colaboradores evaluados · Ordenados por prioridad de desarrollo</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="card card-p" style={{ textAlign: 'center', padding: '8px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--teal)' }}>{data.collaborators.filter(c => c.readinessStatus === 'Listo ahora').length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Listos ahora</div>
            </div>
            <div className="card card-p" style={{ textAlign: 'center', padding: '8px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)' }}>{data.collaborators.filter(c => c.readinessStatus === 'Listo pronto').length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Listos pronto</div>
            </div>
            <div className="card card-p" style={{ textAlign: 'center', padding: '8px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue)' }}>{data.collaborators.filter(c => c.readinessStatus === 'Listo futuro').length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Listos futuro</div>
            </div>
          </div>
        </div>

        {sorted.map(c => {
          const color = COLOR_MAP[c.colorCode] || 'var(--teal)'
          const critGaps = c.gaps.filter(g => g.severity === 'Crítica')
          const doneCount = c.idp.flatMap(p => p.actions).filter(a => a.status === 'done').length
          const totalCount = c.idp.flatMap(p => p.actions).length
          const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

          return (
            <div key={c.id} className="banca-card" style={{ marginBottom: 20 }}>
              <div className="banca-card-header">
                <div className="banca-avatar" style={{ background: color }}>{c.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{c.code}</span>
                    <ReadinessBadge status={c.readinessStatus} />
                    <span className="chip chip-purple">→ {c.targetPosition}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.timelineMonths}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{c.currentPosition}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.department}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: color }}>{c.readinessPercentage}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Readiness</div>
                  <div className="readiness-bar-bg" style={{ width: 80, marginTop: 4 }}>
                    <div className="readiness-bar-fill" style={{ width: `${c.readinessPercentage}%`, background: color }} />
                  </div>
                </div>
              </div>

              <div className="banca-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

                  {/* Fortalezas */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Fortalezas clave</div>
                    {c.strengths.slice(0, 3).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                        <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span>{s}
                      </div>
                    ))}
                  </div>

                  {/* Brechas críticas */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>
                      Brechas críticas <span style={{ color: 'var(--red)', fontWeight: 700 }}>({critGaps.length})</span>
                    </div>
                    {critGaps.slice(0, 3).map((g, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, alignItems: 'baseline' }}>
                        <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0 }}>!</span>{g.name}
                      </div>
                    ))}
                    {c.gaps.filter(g => g.severity === 'Alta').slice(0, 1).map((g, i) => (
                      <div key={`alta-${i}`} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, alignItems: 'baseline' }}>
                        <span style={{ color: 'var(--amber)', fontWeight: 700, flexShrink: 0 }}>▲</span>{g.name}
                      </div>
                    ))}
                  </div>

                  {/* IDP Progress */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>
                      IDP — {doneCount}/{totalCount} completado
                    </div>
                    <div className="readiness-bar-bg" style={{ marginBottom: 10 }}>
                      <div className="readiness-bar-fill" style={{ width: `${pct}%`, background: 'var(--teal)' }} />
                    </div>
                    {c.idp.map(phase => (
                      <div key={phase.phase} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, fontSize: 13 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{phase.phase}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{phase.duration}</div>
                        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
                          {phase.actions.filter(a => a.status === 'done').length}/{phase.actions.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="banca-card-footer">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600 }}>9-Box:</span>
                  Desempeño {c.nineBox.performance}/5 · Potencial {c.nineBox.potential}/5
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Prioridad #{c.priority}
                </div>
                {onTabChange && (
                  <button
                    className="btn btn-white btn-sm"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => onTabChange && onTabChange('talent')}
                  >
                    Ver Talent Card →
                  </button>
                )}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
