import { useState } from 'react'
import EditModal from '../components/EditModal'

// ─── constants ───────────────────────────────────────────────────────────────
const STATUS_CYCLE = { pending: 'inprogress', inprogress: 'done', done: 'pending' }

// ─── Universal 9-Box component ───────────────────────────────────────────────
const CELL_CFG = [
  // Row 0 = high potential (top), cols left→right = low/mid/high performance
  { bg: '#fef9c3', border: '#ca8a04', label: 'Diamante en Bruto'  },
  { bg: '#dcfce7', border: '#16a34a', label: 'Estrella Futura'    },
  { bg: '#bbf7d0', border: '#15803d', label: '⭐ Estrella'        },
  // Row 1 = mid potential
  { bg: '#ffedd5', border: '#ea580c', label: 'En Desarrollo'      },
  { bg: '#fef9c3', border: '#ca8a04', label: 'Empleado Sólido'    },
  { bg: '#d1fae5', border: '#34d399', label: 'Empleado Confiable' },
  // Row 2 = low potential (bottom)
  { bg: '#fee2e2', border: '#dc2626', label: '⚠️ Atención'       },
  { bg: '#ffedd5', border: '#f97316', label: 'Profesional Estable'},
  { bg: '#fef9c3', border: '#eab308', label: 'Experto Técnico'    },
]

// Map score 1-5 to % position within the grid
const scoreToX = p => ((p - 1) / 4) * 100
const scoreToY = p => (1 - (p - 1) / 4) * 100

// Spread overlapping dots so none are hidden
function computeSpread(collaborators) {
  const RADIUS = 7   // spread radius in % grid units
  const PAD    = 3   // keep dots at least this far from edge
  const clamp  = v  => Math.max(PAD, Math.min(100 - PAD, v))

  // Group by exact (performance, potential) position
  const groups = {}
  collaborators.forEach(c => {
    const key = `${c.nineBox.performance},${c.nineBox.potential}`
    if (!groups[key]) groups[key] = []
    groups[key].push(c)
  })

  const pos = {}
  Object.values(groups).forEach(group => {
    const cx = scoreToX(group[0].nineBox.performance)
    const cy = scoreToY(group[0].nineBox.potential)
    if (group.length === 1) {
      pos[group[0].id] = { x: clamp(cx), y: clamp(cy) }
    } else {
      // Arrange in a circle around the base position
      group.forEach((c, i) => {
        const angle = (i / group.length) * 2 * Math.PI - Math.PI / 2
        pos[c.id] = {
          x: clamp(cx + Math.cos(angle) * RADIUS),
          y: clamp(cy + Math.sin(angle) * RADIUS),
        }
      })
    }
  })
  return pos
}

function UniversalNineBox({ collaborators, adminMode, onDotClick, onArchiveAll }) {
  const [hovered, setHovered] = useState(null)
  const spread = computeSpread(collaborators)

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
        {/* Potential label (vertical) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, flexShrink: 0 }}>
          <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>Potencial</span>
        </div>

        {/* Main grid area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 9-box grid + dots container */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '55%' }}>
            <div style={{ position: 'absolute', inset: 0 }}>

              {/* 3×3 background cells */}
              <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', borderRadius: 12, overflow: 'hidden', border: '2px solid rgba(0,0,0,.1)' }}>
                {CELL_CFG.map((cell, i) => (
                  <div key={i} style={{
                    background: cell.bg,
                    borderRight: i % 3 < 2 ? `1px solid ${cell.border}50` : 'none',
                    borderBottom: Math.floor(i / 3) < 2 ? `1px solid ${cell.border}50` : 'none',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                    padding: '5px 8px',
                  }}>
                    <span style={{ fontSize: 10, color: 'rgba(0,0,0,.28)', fontWeight: 600, textAlign: 'right', lineHeight: 1.2 }}>{cell.label}</span>
                  </div>
                ))}
              </div>

              {/* SVG overlay: dashed lines from historical → current */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 6 }}>
                <defs>
                  <marker id="nb-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="rgba(0,0,0,.35)" />
                  </marker>
                </defs>
                {collaborators.map(c => {
                  const hist = c.nineBoxHistory || []
                  if (!hist.length) return null
                  const last = hist[hist.length - 1]
                  const hx = scoreToX(last.performance), hy = scoreToY(last.potential)
                  const cx = scoreToX(c.nineBox.performance), cy = scoreToY(c.nineBox.potential)
                  if (Math.abs(hx - cx) < 1 && Math.abs(hy - cy) < 1) return null
                  const color = { teal: '#14b8a6', purple: '#8b5cf6', amber: '#f59e0b', blue: '#3b82f6', coral: '#ef4444' }[c.colorCode] || '#14b8a6'
                  return (
                    <line key={c.id}
                      x1={`${hx}%`} y1={`${hy}%`} x2={`${cx}%`} y2={`${cy}%`}
                      stroke={color} strokeWidth="1.8" strokeDasharray="5 3"
                      opacity="0.55" markerEnd="url(#nb-arrow)"
                    />
                  )
                })}
              </svg>

              {/* Historical (gray) dots */}
              {collaborators.map(c =>
                (c.nineBoxHistory || []).map((hist, hi) => (
                  <div key={`h-${c.id}-${hi}`} style={{
                    position: 'absolute',
                    left: `${scoreToX(hist.performance)}%`,
                    top: `${scoreToY(hist.potential)}%`,
                    transform: 'translate(-50%,-50%)',
                    zIndex: 7, pointerEvents: 'none',
                  }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#94a3b8', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 8, opacity: .65, boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}>{c.id}</div>
                    {hist.date && <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'rgba(0,0,0,.45)', whiteSpace: 'nowrap', marginTop: 2, fontWeight: 600, background: 'rgba(255,255,255,.8)', borderRadius: 3, padding: '1px 4px' }}>{hist.date}</div>}
                  </div>
                ))
              )}

              {/* Current collaborator dots */}
              {collaborators.map(c => {
                const pct = c.readinessPercentage ?? 0
                const rdColor = pct <= 25
                  ? { bg: '#ef4444', glow: 'rgba(239,68,68,.45)',  label: '0–25%'  }
                  : pct <= 50
                  ? { bg: '#f97316', glow: 'rgba(249,115,22,.45)', label: '26–50%' }
                  : pct <= 75
                  ? { bg: '#4ade80', glow: 'rgba(74,222,128,.45)', label: '51–75%' }
                  : { bg: '#16a34a', glow: 'rgba(22,163,74,.6)',   label: '76–100%' }
                const isHigh = pct > 75
                const isHov  = hovered === c.id
                const sp     = spread[c.id] || { x: scoreToX(c.nineBox.performance), y: scoreToY(c.nineBox.potential) }
                const tipAbove = sp.y > 22
                return (
                  <div key={c.id} style={{
                    position: 'absolute',
                    left: `${sp.x}%`,
                    top:  `${sp.y}%`,
                    transform: 'translate(-50%,-50%)',
                    zIndex: 10, cursor: 'pointer',
                  }}
                    onMouseEnter={() => setHovered(c.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onDotClick(c.id)}
                  >
                    {/* Tooltip */}
                    {isHov && (
                      <div style={{
                        position: 'absolute',
                        ...(tipAbove ? { bottom: 'calc(100% + 10px)' } : { top: 'calc(100% + 10px)' }),
                        left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--navy)', color: 'white',
                        borderRadius: 10, padding: '10px 14px',
                        zIndex: 30, minWidth: 210, pointerEvents: 'none',
                        boxShadow: '0 6px 24px rgba(0,0,0,.3)',
                      }}>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.code}</div>
                        <div style={{ fontSize: 12, opacity: .8 }}>Desempeño: {c.nineBox.performance}/5 · Potencial: {c.nineBox.potential}/5</div>
                        <div style={{ fontSize: 12, opacity: .75, marginTop: 2 }}>{c.currentPosition} → {c.targetPosition}</div>
                        <div style={{ fontSize: 12, marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: rdColor.bg, flexShrink: 0 }} />
                          <span style={{ fontWeight: 700 }}>Readiness: {pct}%</span>
                        </div>
                        {c.lastEvaluated
                          ? <div style={{ fontSize: 11, opacity: .6, marginTop: 5, borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 5 }}>Última evaluación: {c.lastEvaluated}</div>
                          : <div style={{ fontSize: 11, opacity: .45, marginTop: 5, borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 5, fontStyle: 'italic' }}>Sin fecha de evaluación registrada</div>}
                        <div style={{ fontSize: 11, opacity: .5, marginTop: 3, fontStyle: 'italic' }}>Clic para ver perfil completo →</div>
                      </div>
                    )}

                    {/* Glow ring for high-readiness */}
                    {isHigh && (
                      <div style={{
                        position: 'absolute', inset: -6, borderRadius: '50%',
                        background: `radial-gradient(circle, ${rdColor.glow} 0%, transparent 70%)`,
                        animation: 'readiness-pulse 2s ease-in-out infinite',
                        pointerEvents: 'none',
                      }} />
                    )}

                    {/* Dot */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: rdColor.bg,
                      border: '2.5px solid white',
                      boxShadow: isHov
                        ? `0 0 0 4px ${rdColor.glow}, 0 6px 18px rgba(0,0,0,.25)`
                        : isHigh
                        ? `0 0 10px 3px ${rdColor.glow}, 0 2px 8px rgba(0,0,0,.2)`
                        : '0 2px 8px rgba(0,0,0,.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: 11,
                      transition: 'all .15s',
                      transform: isHov ? 'scale(1.25)' : 'scale(1)',
                    }}>{c.id}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* X axis labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>← Bajo</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>Desempeño</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Alto →</span>
          </div>
        </div>
      </div>

      {/* Legend + archive button */}
      <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, flexShrink: 0 }}>Readiness:</span>
          {[
            { bg: '#ef4444', glow: 'rgba(239,68,68,.4)',  label: '0 – 25%',   sub: 'Crítico'      },
            { bg: '#f97316', glow: 'rgba(249,115,22,.4)', label: '26 – 50%',  sub: 'En desarrollo' },
            { bg: '#4ade80', glow: 'rgba(74,222,128,.4)', label: '51 – 75%',  sub: 'Avanzando'    },
            { bg: '#16a34a', glow: 'rgba(22,163,74,.5)',  label: '76 – 100%', sub: 'Listo ✦',  glow_ring: true },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ position: 'relative', width: 16, height: 16, flexShrink: 0 }}>
                {item.glow_ring && (
                  <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)` }} />
                )}
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', background: item.bg,
                  boxShadow: item.glow_ring ? `0 0 6px 2px ${item.glow}` : 'none',
                  position: 'relative',
                }} />
              </div>
              <span><strong>{item.label}</strong> <span style={{ fontSize: 11 }}>{item.sub}</span></span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#94a3b8', opacity: .65, flexShrink: 0 }} />
            Evaluación anterior
          </div>
          {adminMode && (
            <button onClick={onArchiveAll} style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📸 Archivar posición actual de todos
            </button>
          )}
        </div>
        {/* Collaborator index */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, flexShrink: 0 }}>Colaboradores:</span>
          {collaborators.map(c => {
            const pct = c.readinessPercentage ?? 0
            const bg  = pct <= 25 ? '#ef4444' : pct <= 50 ? '#f97316' : pct <= 75 ? '#4ade80' : '#16a34a'
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: bg, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9, fontWeight: 800, flexShrink: 0 }}>{c.id}</div>
                <span>{c.code}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: bg }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
// ─── Pipeline de Sucesión (embedded below 9-Box) ─────────────────────────────
function ReadinessBadge({ status }) {
  const map = { 'Listo ahora': 'teal', 'Listo pronto': 'amber', 'Listo futuro': 'blue' }
  return <span className={`chip chip-${map[status] || 'blue'}`}>{status}</span>
}

function PipelineSection({ data, adminMode, updateCollaborator, onTabChange, onSelectCollab }) {
  const [editingId, setEditingId] = useState(null)
  const editingCollab = editingId ? data.collaborators.find(c => c.id === editingId) : null
  const sorted = [...data.collaborators].sort((a, b) => a.priority - b.priority)
  const clrMap = { teal: 'var(--teal)', purple: 'var(--purple)', amber: 'var(--amber)', blue: 'var(--blue)', coral: 'var(--coral)' }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>Pipeline de Sucesión</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{data.collaborators.length} colaboradores · Ordenados por prioridad</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Listos ahora',  status: 'Listo ahora',  color: 'var(--teal)' },
            { label: 'Listos pronto', status: 'Listo pronto', color: 'var(--amber)' },
            { label: 'Listos futuro', status: 'Listo futuro', color: 'var(--blue)' },
          ].map(({ label, status, color }) => (
            <div key={status} className="card card-p" style={{ textAlign: 'center', padding: '7px 12px' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color }}>{data.collaborators.filter(c => c.readinessStatus === status).length}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {sorted.map(c => {
        const color = clrMap[c.colorCode] || 'var(--teal)'
        const critGaps = c.gaps.filter(g => g.severity === 'Crítica')
        const doneCount = c.idp.flatMap(p => p.actions).filter(a => a.status === 'done').length
        const totalCount = c.idp.flatMap(p => p.actions).length
        const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

        return (
          <div key={c.id} className="banca-card" style={{ marginBottom: 16 }}>
            <div className="banca-card-header">
              <div className="banca-avatar" style={{ background: color }}>{c.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{c.code}</span>
                  {adminMode && (
                    <button
                      onClick={() => setEditingId(c.id)}
                      style={{ fontSize: 11, fontWeight: 600, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}
                    >✏️ Editar</button>
                  )}
                  <ReadinessBadge status={c.readinessStatus} />
                  <span className="chip chip-purple">→ {c.targetPosition}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.timelineMonths}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{c.currentPosition}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.department}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color }}>{c.readinessPercentage}%</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Readiness</div>
                <div className="readiness-bar-bg" style={{ width: 80, marginTop: 4 }}>
                  <div className="readiness-bar-fill" style={{ width: `${c.readinessPercentage}%`, background: color }} />
                </div>
              </div>
            </div>

            <div className="banca-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Fortalezas clave</div>
                  {c.strengths.slice(0, 3).map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span>{s}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>
                    Brechas críticas <span style={{ color: 'var(--red)', fontWeight: 700 }}>({critGaps.length})</span>
                  </div>
                  {critGaps.slice(0, 3).map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0 }}>!</span>{g.name}
                    </div>
                  ))}
                  {c.gaps.filter(g => g.severity === 'Alta').slice(0, 1).map((g, i) => (
                    <div key={`alta-${i}`} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--amber)', fontWeight: 700, flexShrink: 0 }}>▲</span>{g.name}
                    </div>
                  ))}
                </div>
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
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prioridad #{c.priority}</div>
              {onTabChange && (
                <button className="btn btn-white btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { if (onSelectCollab) onSelectCollab(c.id); onTabChange('talent') }}>
                  Ver Talent Card →
                </button>
              )}
            </div>
          </div>
        )
      })}

      {editingCollab && (
        <EditModal collab={editingCollab} onSave={updateCollaborator} onClose={() => setEditingId(null)} />
      )}
    </>
  )
}

const STATUS_LABEL = { pending: 'Pendiente', inprogress: 'En progreso', done: 'Completado' }

const COLOR_MAP = {
  teal: 'var(--teal)', purple: 'var(--purple)',
  amber: 'var(--amber)', blue: 'var(--blue)', coral: 'var(--coral)',
}
const PHASE_COLORS = ['var(--teal)', 'var(--purple)', 'var(--amber)']
const PHASE_LIGHT  = ['var(--teal-light)', 'rgba(139,92,246,.12)', 'var(--amber-light)']

const MGR_ACTIONS = {
  UL: [
    { id: 'ul-m1', text: 'Aprobar presupuesto para certificación Power BI avanzado' },
    { id: 'ul-m2', text: 'Aprobar presupuesto para certificación PMP / formación Agile' },
    { id: 'ul-m3', text: 'Coordinar mentoría ejecutiva con COO/CFO (Fase 2)' },
    { id: 'ul-m4', text: 'Gestionar acceso a presentaciones del board' },
    { id: 'ul-m5', text: 'Organizar shadowing con Director de Operaciones (Fase 3)' },
  ],
  A1: [
    { id: 'a1-m1', text: 'Facilitar acceso a plataforma ML (Coursera o Udacity)' },
    { id: 'a1-m2', text: 'Asignar proyecto de análisis de alto impacto para liderazgo' },
    { id: 'a1-m3', text: 'Coordinar mentoría formal con Colaborador UL' },
    { id: 'a1-m4', text: 'Evaluar opciones de apoyo para estudios universitarios' },
  ],
  A2: [
    { id: 'a2-m1', text: 'Facilitar acceso a recursos SQL gratuitos (DataLemur, modo.com)' },
    { id: 'a2-m2', text: 'Definir formalmente el track especializado BI financiero' },
    { id: 'a2-m3', text: 'Proponer rol BI financiero formal a People Operations' },
  ],
  A3: [
    { id: 'a3-m1', text: 'Gestionar inscripción a certificación Power BI oficial' },
    { id: 'a3-m2', text: 'Coordinar presentaciones de RAF/claims a liderazgo senior' },
    { id: 'a3-m3', text: 'Asignar formalmente rol de mentor hacia Colaborador A2' },
    { id: 'a3-m4', text: 'Definir proyecto de analítica financiera de alto impacto (Fase 3)' },
  ],
  MB: [
    { id: 'mb-m1', text: 'Formalizar título SME en la estructura organizacional' },
    { id: 'mb-m2', text: 'Crear y aprobar protocolo de consulta con equipo BI' },
    { id: 'mb-m3', text: 'Asignar tiempo protegido para documentación de SOPs' },
    { id: 'mb-m4', text: 'Aprobar certificación IA aplicada a revenue cycle (Fase 3)' },
  ],
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function getPhaseStatus(phase, allPhases, phaseIdx) {
  const done = phase.actions.filter(a => a.status === 'done').length
  if (done === phase.actions.length && phase.actions.length > 0) return 'completed'
  if (done > 0) return 'in-progress'
  if (phaseIdx === 0) return 'ready'
  const prev = allPhases[phaseIdx - 1]
  if (prev.actions.filter(a => a.status === 'done').length === prev.actions.length && prev.actions.length > 0) return 'ready'
  return 'locked'
}

function idpPct(c) {
  const all = c.idp.flatMap(p => p.actions)
  if (!all.length) return 0
  return Math.round((all.filter(a => a.status === 'done').length / all.length) * 100)
}

function getRisk(c) {
  const pct  = idpPct(c)
  const crit = c.gaps.filter(g => g.severity === 'Crítica').length
  if (pct === 0)                         return { level: 'critical', label: 'Sin iniciar',   color: '#ef4444', bg: '#fef2f2' }
  if (pct < 25 && crit >= 2)             return { level: 'high',     label: 'Riesgo alto',   color: '#f97316', bg: '#fff7ed' }
  if (pct < 50)                          return { level: 'medium',   label: 'En progreso',   color: 'var(--amber)', bg: 'var(--amber-light)' }
  if (pct >= 75)                         return { level: 'great',    label: 'Adelantado',    color: 'var(--teal)',  bg: 'var(--teal-light)' }
  return                                        { level: 'ok',       label: 'En curso',      color: 'var(--blue)', bg: 'rgba(59,130,246,.1)' }
}

function generateAlerts(collaborators) {
  const alerts = []
  const order  = { critical: 0, high: 1, warning: 2, info: 3, success: 4 }

  collaborators.forEach(c => {
    const pct  = idpPct(c)
    const crit = c.gaps.filter(g => g.severity === 'Crítica')

    if (pct === 0)
      alerts.push({ severity: 'critical', collab: c.id, colorCode: c.colorCode,
        title: `${c.code} — Plan sin iniciar`,
        body: `Ninguna acción del IDP ha sido completada. ${crit.length} brechas críticas sin atender.`,
        action: 'Activar Fase 1 esta semana' })

    if (pct > 0 && pct < 20 && crit.length >= 2)
      alerts.push({ severity: 'high', collab: c.id, colorCode: c.colorCode,
        title: `${c.code} — Progreso muy bajo (${pct}%)`,
        body: `Solo el ${pct}% completado con ${crit.length} brechas críticas abiertas: ${crit.slice(0,2).map(g => g.name).join(' · ')}.`,
        action: 'Revisar obstáculos y remover bloqueos' })

    if (pct > c.readinessPercentage + 20)
      alerts.push({ severity: 'info', collab: c.id, colorCode: c.colorCode,
        title: `${c.code} — Recalibrar Readiness`,
        body: `IDP al ${pct}% pero el Readiness sigue en ${c.readinessPercentage}%. El avance real supera el perfil registrado.`,
        action: 'Actualizar Readiness % en Talent Card' })

    const iaGap = c.gaps.find(g => /ia|machine|generativa/i.test(g.name))
    const iaAct = c.idp.flatMap(p => p.actions).find(a => /ia|generativa/i.test(a.text))
    if (iaGap && iaAct && iaAct.status === 'pending')
      alerts.push({ severity: 'warning', collab: c.id, colorCode: c.colorCode,
        title: `${c.code} — Brecha de IA sin atender`,
        body: `La competencia en IA es estratégica (WEF 2025). La brecha está identificada pero la formación sigue pendiente.`,
        action: 'Priorizar certificación IA en el próximo sprint' })

    if (pct >= 60)
      alerts.push({ severity: 'success', collab: c.id, colorCode: c.colorCode,
        title: `${c.code} — Buen progreso`,
        body: `${pct}% del IDP completado. En ruta hacia ${c.targetPosition} en ${c.timelineMonths}.`,
        action: 'Continuar apoyo y preparar siguiente fase' })
  })

  return alerts.sort((a, b) => order[a.severity] - order[b.severity])
}

function get3090(collaborators) {
  const now = [], d60 = [], d90 = []
  collaborators.forEach(c => {
    const clr = COLOR_MAP[c.colorCode] || 'var(--teal)'
    c.idp.forEach((phase, pi) => {
      const st = getPhaseStatus(phase, c.idp, pi)
      if (st === 'locked') return
      phase.actions.forEach((action, ai) => {
        if (action.status === 'done') return
        const item = { c, pi, ai, action, clr }
        if (pi === 0) now.push(item)
        else if (pi === 1) d60.push(item)
        else d90.push(item)
      })
    })
  })
  return { now, d60, d90 }
}

// ─── action state dot (shared across all views) ──────────────────────────────
function ActionDot({ status, color, size = 17 }) {
  if (status === 'done') return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0, background: color, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
      <span style={{ fontSize: size * 0.65, color: 'white', fontWeight: 800, lineHeight: 1 }}>✓</span>
    </div>
  )
  if (status === 'inprogress') return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0, background: color + '22', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
      <span style={{ fontSize: size * 0.6, color: color, fontWeight: 800, lineHeight: 1 }}>◔</span>
    </div>
  )
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0, background: 'transparent', border: '2px solid var(--border)', transition: 'all .15s' }} />
  )
}

function actionTextStyle(status) {
  if (status === 'done')       return { textDecoration: 'line-through', color: 'var(--text-muted)', opacity: .6 }
  if (status === 'inprogress') return { color: 'var(--text)', fontStyle: 'italic' }
  return { color: 'var(--text)' }
}

// ─── small ui pieces ─────────────────────────────────────────────────────────
const SEV_CFG = {
  critical: { color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', icon: '🔴', label: 'Crítico'   },
  high:     { color: '#f97316', bg: '#fff7ed', border: '#fdba74', icon: '🟠', label: 'Alto'      },
  warning:  { color: '#eab308', bg: '#fefce8', border: '#fde047', icon: '🟡', label: 'Atención'  },
  info:     { color: 'var(--blue)', bg: 'rgba(59,130,246,.08)', border: 'rgba(59,130,246,.3)', icon: '🔵', label: 'Info' },
  success:  { color: 'var(--teal)', bg: 'var(--teal-light)', border: 'rgba(20,184,166,.3)', icon: '🟢', label: 'OK'   },
}

function AlertCard({ alert }) {
  const s = SEV_CFG[alert.severity]
  return (
    <div style={{ border: `1.5px solid ${s.border}`, borderRadius: 10, background: s.bg, padding: '14px 18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 15 }}>{s.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>· {alert.title}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8 }}>{alert.body}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: .5 }}>Acción recomendada:</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{alert.action}</span>
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────
export default function Desarrollo({ data, adminMode, updateCollaborator, onTabChange, onSelectCollab }) {
  const [view,    setView]    = useState('9box')
  const [selC,    setSelC]    = useState('all')
  const [editEv,  setEditEv]  = useState({})    // { 'cid-pi-ai': string }   draft evidence
  const [savedEv, setSavedEv] = useState({})    // { 'cid-pi-ai': string }   saved evidence (local)

  const visible = selC === 'all' ? data.collaborators : data.collaborators.filter(c => c.id === selC)
  const allActions  = data.collaborators.flatMap(c => c.idp.flatMap(p => p.actions))
  const doneActions = allActions.filter(a => a.status === 'done')
  const teamPct     = allActions.length ? Math.round(doneActions.length / allActions.length * 100) : 0
  const alerts      = generateAlerts(data.collaborators)
  const critAlerts  = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length
  const buckets     = get3090(data.collaborators)

  // ── toggle IDP action — 3 estados: pending → inprogress → done → pending ──
  const toggleAction = (cid, pi, ai) => {
    if (!adminMode) return
    const collab  = data.collaborators.find(c => c.id === cid)
    const cur     = collab.idp[pi].actions[ai].status
    const next    = STATUS_CYCLE[cur] || 'pending'
    const newIdp  = collab.idp.map((ph, pii) =>
      pii !== pi ? ph : {
        ...ph,
        actions: ph.actions.map((a, aii) =>
          aii !== ai ? a : { ...a, status: next }
        ),
      }
    )
    updateCollaborator(cid, { idp: newIdp })
  }

  // ── toggle manager action ──
  const toggleMgr = (cid, actionId) => {
    if (!adminMode) return
    const collab  = data.collaborators.find(c => c.id === cid)
    const current = collab.mgrStatus || {}
    updateCollaborator(cid, { mgrStatus: { ...current, [actionId]: current[actionId] === 'done' ? 'pending' : 'done' } })
  }

  // ── evidence — persiste en el colaborador vía updateCollaborator ──
  const evKey  = (cid, pi, ai) => `${pi}-${ai}`
  const getEv  = (c, pi, ai) => (c.idpEvidence || {})[evKey(c.id, pi, ai)] || ''
  const saveEv = (cid, pi, ai) => {
    const k   = evKey(cid, pi, ai)
    const val = editEv[`${cid}-${k}`] || ''
    const collab = data.collaborators.find(c => c.id === cid)
    updateCollaborator(cid, { idpEvidence: { ...(collab.idpEvidence || {}), [k]: val } })
    setEditEv(p => { const n = { ...p }; delete n[`${cid}-${k}`]; return n })
  }
  const deleteEv = (cid, pi, ai) => {
    const k = evKey(cid, pi, ai)
    const collab = data.collaborators.find(c => c.id === cid)
    const ev = { ...(collab.idpEvidence || {}) }
    delete ev[k]
    updateCollaborator(cid, { idpEvidence: ev })
  }

  // ── archive all collaborators' current 9-Box position to history ──
  const archiveAllNineBox = () => {
    if (!adminMode) return
    const today = new Date().toISOString().split('T')[0]
    data.collaborators.forEach(c => {
      updateCollaborator(c.id, {
        nineBoxHistory: [
          ...(c.nineBoxHistory || []),
          { performance: c.nineBox.performance, potential: c.nineBox.potential, date: today },
        ],
        lastEvaluated: today,
      })
    })
  }

  // ── navigate to collaborator profile ──
  const handleDotClick = (collabId) => {
    if (onSelectCollab) onSelectCollab(collabId)
    if (onTabChange) onTabChange('talent')
  }

  const VIEWS = [
    { id: '9box',     label: '9-Box Universal',   icon: '🎯' },
    { id: 'resumen',  label: 'Tracker IDP',        icon: '📊' },
    { id: 'alertas',  label: `Alertas ${critAlerts > 0 ? `(${critAlerts})` : ''}`, icon: '🔴' },
    { id: 'plan',     label: '30 · 60 · 90 días',  icon: '📅' },
    { id: 'manager',  label: 'Para el Manager',    icon: '👔' },
  ]

  // ─────────────────────────────────────────────────────────────────────────
  //  VIEW: RESUMEN
  // ─────────────────────────────────────────────────────────────────────────
  const renderResumen = () => (
    <>
      {/* Risk strip */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 18, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginRight: 4 }}>Estado del equipo:</span>
        {data.collaborators.map(c => {
          const risk = getRisk(c)
          const pct  = idpPct(c)
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: risk.bg, border: `1px solid ${risk.color}30`, borderRadius: 8, padding: '5px 12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: risk.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>Colab. {c.id}</span>
              <span style={{ fontSize: 12, color: risk.color, fontWeight: 600 }}>{risk.label}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pct}%</span>
            </div>
          )
        })}
        {critAlerts > 0 && (
          <div
            onClick={() => setView('alertas')}
            style={{ marginLeft: 'auto', cursor: 'pointer', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 7, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span style={{ fontSize: 12 }}>🔴</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>{critAlerts} alerta{critAlerts > 1 ? 's' : ''} crítica{critAlerts > 1 ? 's' : ''}</span>
            <span style={{ fontSize: 11, color: '#ef4444' }}>→ ver</span>
          </div>
        )}
      </div>

      {/* Overall progress */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Progreso global del equipo</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)' }}>{teamPct}%</span>
        </div>
        <div className="readiness-bar-bg" style={{ height: 8, borderRadius: 6, marginBottom: 14 }}>
          <div className="readiness-bar-fill" style={{ width: `${teamPct}%`, background: 'var(--teal)', height: 8, borderRadius: 6, transition: 'width .4s' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {data.collaborators.map(c => {
            const pct = idpPct(c)
            const clr = COLOR_MAP[c.colorCode] || 'var(--teal)'
            const done = c.idp.flatMap(p => p.actions).filter(a => a.status === 'done').length
            const total = c.idp.flatMap(p => p.actions).length
            return (
              <div key={c.id} style={{ flex: '1 1 110px', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Colab. {c.id}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: clr }}>{pct}%</span>
                </div>
                <div className="readiness-bar-bg" style={{ height: 5, borderRadius: 4 }}>
                  <div className="readiness-bar-fill" style={{ width: `${pct}%`, background: clr, height: 5, borderRadius: 4, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{done}/{total} acciones</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...data.collaborators.map(c => c.id)].map(id => {
          const c   = data.collaborators.find(x => x.id === id)
          const clr = c ? (COLOR_MAP[c.colorCode] || 'var(--teal)') : 'var(--teal)'
          const active = selC === id
          return (
            <button key={id} onClick={() => setSelC(id)} style={{
              padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: `1.5px solid ${active ? clr : 'var(--border)'}`,
              background: active ? clr : 'white', color: active ? 'white' : 'var(--text-muted)',
              transition: 'all .15s',
            }}>
              {id === 'all' ? 'Todos' : `Colab. ${id}`}
            </button>
          )
        })}
      </div>

      {/* IDP cards */}
      {visible.map(c => {
        const clr   = COLOR_MAP[c.colorCode] || 'var(--teal)'
        const pct   = idpPct(c)
        const done  = c.idp.flatMap(p => p.actions).filter(a => a.status === 'done').length
        const total = c.idp.flatMap(p => p.actions).length
        const risk  = getRisk(c)
        return (
          <div key={c.id} className="card" style={{ marginBottom: 20, borderLeft: `4px solid ${clr}` }}>
            {/* header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: clr, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{c.id}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{c.code}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  {c.currentPosition} <span style={{ color: clr, fontWeight: 700 }}>→</span> {c.targetPosition}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, background: risk.bg, color: risk.color, border: `1px solid ${risk.color}40`, borderRadius: 6, padding: '3px 8px' }}>{risk.label}</span>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: `conic-gradient(${clr} 0% ${pct}%, rgba(0,0,0,.07) ${pct}% 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: clr }}>{pct}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{done}/{total}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>acciones</div>
                </div>
              </div>
            </div>

            {/* phases */}
            <div style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
              {c.idp.map((phase, pi) => {
                const st      = getPhaseStatus(phase, c.idp, pi)
                const pd      = phase.actions.filter(a => a.status === 'done').length
                const ppct    = phase.actions.length ? Math.round(pd / phase.actions.length * 100) : 0
                const pClr    = PHASE_COLORS[pi] || 'var(--teal)'
                const pLgt    = PHASE_LIGHT[pi]  || 'var(--teal-light)'
                const complete = st === 'completed'
                const locked   = st === 'locked'
                return (
                  <div key={pi} style={{
                    borderRadius: 10, overflow: 'hidden',
                    border: `1.5px solid ${complete ? pClr : 'var(--border)'}`,
                    background: complete ? pLgt : 'var(--bg)',
                    opacity: locked ? .55 : 1,
                  }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: complete ? pClr : 'var(--border)', color: complete ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {complete ? '✓' : phase.phase}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>Fase {phase.phase}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{phase.duration}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: pClr }}>{ppct}%</span>
                    </div>
                    <div style={{ padding: '8px 14px' }}>
                      <div className="readiness-bar-bg" style={{ height: 3, borderRadius: 3, marginBottom: 10 }}>
                        <div className="readiness-bar-fill" style={{ width: `${ppct}%`, background: pClr, height: 3, borderRadius: 3 }} />
                      </div>
                      {phase.actions.map((action, ai) => (
                        <div key={ai} onClick={() => toggleAction(c.id, pi, ai)} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, cursor: adminMode ? 'pointer' : 'default', userSelect: 'none' }}
                          title={adminMode ? `Click: ${STATUS_LABEL[STATUS_CYCLE[action.status] || 'pending']}` : ''}>
                          <div style={{ marginTop: 2 }}>
                            <ActionDot status={action.status} color={pClr} size={16} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 12.5, lineHeight: 1.5, ...actionTextStyle(action.status) }}>{action.text}</span>
                            {action.status === 'inprogress' && (
                              <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: 'var(--amber)', background: 'var(--amber-light)', borderRadius: 4, padding: '1px 5px' }}>En progreso</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {locked && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>🔒 Completa la fase anterior para desbloquear</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      {!adminMode && (
        <div style={{ background: 'var(--bg)', border: '1px dashed var(--border)', borderRadius: 8, padding: '12px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          💡 Activa el <strong>Modo Admin</strong> para marcar acciones como completadas
        </div>
      )}
    </>
  )

  // ─────────────────────────────────────────────────────────────────────────
  //  VIEW: ALERTAS & RIESGO
  // ─────────────────────────────────────────────────────────────────────────
  const renderAlertas = () => {
    const counts = { critical: 0, high: 0, warning: 0, info: 0, success: 0 }
    alerts.forEach(a => counts[a.severity]++)
    return (
      <>
        {/* Summary strip */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
          {Object.entries(SEV_CFG).map(([k, s]) => (
            <div key={k} style={{ flex: '1 1 100px', background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{counts[k]}</div>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Las alertas se generan automáticamente basadas en el progreso del IDP, las brechas identificadas y el Readiness % de cada colaborador.
        </div>

        {alerts.length === 0 && (
          <div className="card card-p" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            ✅ Sin alertas activas — todos los planes están en buen estado.
          </div>
        )}

        {Object.entries(SEV_CFG).map(([sev, cfg]) => {
          const group = alerts.filter(a => a.severity === sev)
          if (!group.length) return null
          return (
            <div key={sev} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: cfg.color, marginBottom: 10 }}>
                {cfg.icon} {cfg.label} · {group.length} alerta{group.length > 1 ? 's' : ''}
              </div>
              {group.map((a, i) => <AlertCard key={i} alert={a} />)}
            </div>
          )
        })}
      </>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  VIEW: 30 · 60 · 90 días
  // ─────────────────────────────────────────────────────────────────────────
  const renderPlan = () => {
    const cols = [
      { key: 'now', label: 'Próximos 30 días',   sub: 'Fase 1 activa — acciones inmediatas',   color: '#ef4444', bg: '#fef2f2', items: buckets.now   },
      { key: 'd60', label: 'Próximos 31–60 días', sub: 'Fase 2 — desarrollo y exposición',      color: '#f97316', bg: '#fff7ed', items: buckets.d60   },
      { key: 'd90', label: 'Próximos 61–90 días', sub: 'Fase 3 — liderazgo y consolidación',    color: 'var(--blue)', bg: 'rgba(59,130,246,.07)', items: buckets.d90 },
    ]
    return (
      <>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
          Vista de <strong>prioridad de acciones</strong> basada en la fase actual de cada colaborador.
          Los ítems de cada columna son las acciones pendientes ordenadas por urgencia de implementación.
          {adminMode && <span style={{ color: 'var(--amber)', fontWeight: 600 }}> · Modo Admin activo — haz clic en las acciones para marcarlas.</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {cols.map(col => (
            <div key={col.key}>
              <div style={{ background: col.bg, border: `2px solid ${col.color}30`, borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: col.color }}>{col.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{col.sub}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: col.color, marginTop: 6 }}>{col.items.length} acción{col.items.length !== 1 ? 'es' : ''} pendiente{col.items.length !== 1 ? 's' : ''}</div>
              </div>

              {col.items.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>✅ Sin acciones pendientes</div>
              )}

              {col.items.map(({ c, pi, ai, action, clr }, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleAction(c.id, pi, ai)}
                  style={{ background: 'white', border: '1px solid var(--border)', borderLeft: `3px solid ${clr}`, borderRadius: 8, padding: '10px 14px', marginBottom: 10, cursor: adminMode ? 'pointer' : 'default', transition: 'box-shadow .15s' }}
                  title={adminMode ? `Click: ${STATUS_LABEL[STATUS_CYCLE[action.status] || 'pending']}` : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ marginTop: 2 }}>
                      <ActionDot status={action.status} color={clr} size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, lineHeight: 1.5, ...actionTextStyle(action.status) }}>
                        {action.text}
                        {action.status === 'inprogress' && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: 'var(--amber)', background: 'var(--amber-light)', borderRadius: 4, padding: '1px 5px' }}>En progreso</span>}
                      </div>
                      <div style={{ marginTop: 5, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, background: clr + '20', color: clr, borderRadius: 4, padding: '1px 6px' }}>Colab. {c.id}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg)', borderRadius: 4, padding: '1px 6px' }}>Fase {pi + 1} · {c.idp[pi].duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Quarterly calendar */}
        <div className="sec-lbl" style={{ marginTop: 28 }}>Calendario de revisiones</div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          {[
            { q: 'Q2 2026', date: 'Abril – Junio 2026', next: true,  items: ['Revisar progreso IDP de todos los colaboradores', 'Actualizar readiness percentages', 'Identificar acciones vencidas o bloqueadas', 'Ajustar timelines según avance real'] },
            { q: 'Q3 2026', date: 'Julio – Septiembre 2026', next: false, items: ['Evaluación formal Talent Card', 'Actualizar 9-Box scores', 'Revisar brecha de IA en todo el equipo', 'Planificar Fase 2 para candidatos adelantados'] },
            { q: 'Q4 2026', date: 'Octubre – Diciembre 2026', next: false, items: ['Evaluación anual de sucesión', 'Recalibrar pipeline completo', 'Presentar progreso a liderazgo senior', 'Definir plan 2027'] },
            { q: 'Q1 2027', date: 'Enero – Marzo 2027', next: false, items: ['Revisión estratégica del plan completo', 'Incorporar nuevos colaboradores si aplica', 'Evaluar candidatos que completen Fase 3', 'Actualizar puestos críticos si hay cambios organizacionales'] },
          ].map((r, i) => (
            <div key={i} className="card card-p" style={{ borderLeft: `3px solid ${r.next ? 'var(--teal)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`chip ${r.next ? 'chip-teal' : 'chip-blue'}`}>{r.q}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</span>
                {r.next && <span className="chip chip-amber" style={{ marginLeft: 'auto' }}>Próxima</span>}
              </div>
              {r.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: 7, fontSize: 13, color: 'var(--text-muted)', marginBottom: 5 }}>
                  <span style={{ color: r.next ? 'var(--teal)' : 'var(--border)', fontWeight: 700 }}>·</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  VIEW: PARA EL MANAGER
  // ─────────────────────────────────────────────────────────────────────────
  const renderManager = () => (
    <>
      <div style={{ background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 22, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--navy)' }}>Esta sección es para el manager / liderazgo.</strong><br/>
        Las acciones del IDP describen lo que el <em>colaborador</em> debe hacer. Esta vista muestra lo que <em>People Operations y liderazgo</em> necesitan gestionar para habilitar el desarrollo de cada persona.
        {adminMode
          ? <span style={{ color: 'var(--amber)', fontWeight: 600 }}> · Modo Admin activo — puedes marcar acciones y dejar evidencia.</span>
          : <span> · Activa el <strong>Modo Admin</strong> para marcar acciones completadas y agregar evidencia.</span>}
      </div>

      {data.collaborators.map(c => {
        const clr      = COLOR_MAP[c.colorCode] || 'var(--teal)'
        const mgrItems = MGR_ACTIONS[c.id] || []
        const mgrSt    = c.mgrStatus || {}
        const mgrDone  = mgrItems.filter(a => mgrSt[a.id] === 'done').length
        const doneIdp  = c.idp.flatMap(p => p.actions).filter(a => a.status === 'done')

        return (
          <div key={c.id} className="card" style={{ marginBottom: 22, borderLeft: `4px solid ${clr}` }}>
            {/* header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: clr, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>{c.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{c.code}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.currentPosition} → {c.targetPosition}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: clr }}>{mgrDone}/{mgrItems.length}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>acciones mgr</div>
              </div>
            </div>

            <div style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Manager actions */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12 }}>
                  Acciones del Manager
                </div>
                {mgrItems.map(item => {
                  const done = mgrSt[item.id] === 'done'
                  return (
                    <div key={item.id} onClick={() => toggleMgr(c.id, item.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, cursor: adminMode ? 'pointer' : 'default', userSelect: 'none' }}>
                      <div style={{ width: 17, height: 17, borderRadius: 5, flexShrink: 0, marginTop: 1, border: `2px solid ${done ? clr : 'var(--border)'}`, background: done ? clr : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                        {done && <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: done ? 'var(--text-muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', opacity: done ? .65 : 1 }}>{item.text}</span>
                    </div>
                  )
                })}
              </div>

              {/* Evidence log — ALL actions */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12 }}>
                  Log de Evidencias &amp; Notas
                </div>
                {c.idp.map((phase, pi) =>
                  phase.actions.map((action, ai) => {
                    const k      = evKey(c.id, pi, ai)
                    const draftK = `${c.id}-${k}`
                    const saved  = getEv(c, pi, ai)
                    const pClr   = PHASE_COLORS[pi] || 'var(--teal)'
                    const statusBadge = action.status === 'done'
                      ? { label: '✓ Completado', color: 'var(--teal)',  bg: 'var(--teal-light)' }
                      : action.status === 'inprogress'
                        ? { label: '◔ En progreso', color: 'var(--amber)', bg: 'var(--amber-light)' }
                        : { label: '○ Pendiente',   color: 'var(--text-muted)', bg: 'var(--bg)' }
                    return (
                      <div key={k} style={{ marginBottom: 12, background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', border: `1px solid ${action.status === 'done' ? pClr + '50' : 'var(--border)'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: pClr }}>Fase {pi + 1} · {phase.duration}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: statusBadge.color, background: statusBadge.bg, borderRadius: 4, padding: '1px 6px' }}>{statusBadge.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 8, lineHeight: 1.5, ...actionTextStyle(action.status) }}>{action.text}</div>
                        {saved ? (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)', background: 'white', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', lineHeight: 1.5 }}>
                              📎 {saved}
                            </div>
                            {adminMode && (
                              <button onClick={() => deleteEv(c.id, pi, ai)} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>✕</button>
                            )}
                          </div>
                        ) : adminMode ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input
                              value={editEv[draftK] || ''}
                              onChange={e => setEditEv(p => ({ ...p, [draftK]: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter' && editEv[draftK]) saveEv(c.id, pi, ai) }}
                              placeholder={action.status === 'done' ? 'Evidencia: certificado, fecha, link…' : action.status === 'inprogress' ? 'Nota de progreso: qué se está haciendo…' : 'Nota anticipada: contexto, acuerdos previos…'}
                              style={{ flex: 1, fontSize: 12, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', outline: 'none', color: 'var(--text)', background: 'white' }}
                            />
                            <button
                              onClick={() => saveEv(c.id, pi, ai)}
                              disabled={!editEv[draftK]}
                              style={{ fontSize: 12, fontWeight: 600, background: clr, color: 'white', border: 'none', borderRadius: 6, padding: '0 12px', cursor: editEv[draftK] ? 'pointer' : 'not-allowed', opacity: editEv[draftK] ? 1 : .5, whiteSpace: 'nowrap' }}
                            >Guardar</button>
                          </div>
                        ) : (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin notas registradas</div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="page">
      <div className="page-inner">

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>Centro de Desarrollo</div>
              <span style={{ fontSize: 11, fontWeight: 600, background: 'var(--teal-light)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,.3)', borderRadius: 6, padding: '3px 8px' }}>
                🔗 Sincronizado con Perfiles del Equipo
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
              {adminMode && <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Modo HR · Clic = Pendiente → En progreso → Completado · </span>}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>
              {doneActions.length}/{allActions.length} acciones · {teamPct}% progreso del equipo ·{' '}
              {critAlerts > 0
                ? <span style={{ color: '#ef4444', fontWeight: 600 }}>{critAlerts} alerta{critAlerts > 1 ? 's' : ''} crítica{critAlerts > 1 ? 's' : ''}</span>
                : <span style={{ color: 'var(--teal)', fontWeight: 600 }}>sin alertas críticas</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ l: doneActions.length, t: 'Completadas', c: 'var(--teal)' }, { l: allActions.length - doneActions.length, t: 'Pendientes', c: 'var(--amber)' }, { l: alerts.length, t: 'Alertas', c: '#ef4444' }].map(s => (
              <div key={s.t} className="card" style={{ textAlign: 'center', padding: '8px 14px', minWidth: 68 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.l}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal nav */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: 'var(--bg)', borderRadius: 10, padding: 4, width: 'fit-content', flexWrap: 'wrap' }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: view === v.id ? 'white' : 'transparent',
              color: view === v.id ? 'var(--navy)' : 'var(--text-muted)',
              boxShadow: view === v.id ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
              transition: 'all .15s',
            }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {view === '9box'     && (
          <>
            <div className="card card-p">
              <UniversalNineBox
                collaborators={data.collaborators}
                adminMode={adminMode}
                onDotClick={handleDotClick}
                onArchiveAll={archiveAllNineBox}
              />
            </div>
            <PipelineSection
              data={data}
              adminMode={adminMode}
              updateCollaborator={updateCollaborator}
              onTabChange={onTabChange}
              onSelectCollab={onSelectCollab}
            />
          </>
        )}
        {view === 'resumen'  && renderResumen()}
        {view === 'alertas'  && renderAlertas()}
        {view === 'plan'     && renderPlan()}
        {view === 'manager'  && renderManager()}

      </div>
    </div>
  )
}
