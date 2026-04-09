import { useState, useEffect } from 'react'
import { exportPDF, exportDocx } from '../utils/exports'
import EditModal from '../components/EditModal'

const COLOR_MAP = { teal: 'var(--teal)', purple: 'var(--purple)', amber: 'var(--amber)', blue: 'var(--blue)', coral: 'var(--coral)' }
const STATUS_CYCLE = { pending: 'inprogress', inprogress: 'done', done: 'pending' }
const STATUS_LABEL = { pending: '○', inprogress: '◔', done: '✓' }

function getNineBoxProfile(perf, pot) {
  const p = perf >= 4 ? 'high' : perf >= 3 ? 'mid' : 'low'
  const q = pot  >= 4 ? 'high' : pot  >= 3 ? 'mid' : 'low'
  const map = {
    'high-high': { label: 'Estrella',              icon: '🌟', desc: 'Alto desempeño y alto potencial. Candidato prioritario para roles de liderazgo y sucesión.', color: '#15803d', bg: '#bbf7d0', border: '#4ade80' },
    'high-mid':  { label: 'Empleado Confiable',    icon: '🔒', desc: 'Alto desempeño con potencial moderado. Pilar fundamental del equipo y garante de la continuidad.', color: '#0d7a5a', bg: '#d1fae5', border: '#34d399' },
    'high-low':  { label: 'Experto Técnico',       icon: '🏆', desc: 'Alto desempeño sostenido. Su experiencia especializada es un activo crítico del departamento.', color: '#a16207', bg: '#fef9c3', border: '#fde047' },
    'mid-high':  { label: 'Estrella Futura',       icon: '🚀', desc: 'Alto potencial en desarrollo. Inversión estratégica de mediano plazo con alto retorno esperado.', color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
    'mid-mid':   { label: 'Empleado Sólido',       icon: '✅', desc: 'Desempeño y potencial consistentes. Contribuye de manera estable y confiable al equipo.', color: '#0d7a5a', bg: '#d1fae5', border: '#34d399' },
    'mid-low':   { label: 'Profesional Estable',   icon: '📊', desc: 'Desempeño aceptable con potencial limitado actualmente. Rol definido y valor operativo claro.', color: '#c2410c', bg: '#ffedd5', border: '#fb923c' },
    'low-high':  { label: 'Diamante en Bruto',     icon: '💎', desc: 'Alto potencial con desempeño aún bajo. Requiere coaching enfocado y oportunidades de desarrollo.', color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
    'low-mid':   { label: 'En Desarrollo',         icon: '⚠️', desc: 'Desempeño por debajo de lo esperado. Requiere plan de mejora activo y seguimiento cercano.', color: '#ea580c', bg: '#ffedd5', border: '#fb923c' },
    'low-low':   { label: 'Atención Requerida',    icon: '🔴', desc: 'Bajo desempeño y potencial limitado en el rol actual. Intervención inmediata necesaria.', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  }
  return map[`${p}-${q}`] || map['mid-mid']
}

// Maps a score (1-5) to a grid dot position (pixel center within the 266px grid)
function getDotPos(perf, pot) {
  const col       = Math.round(perf / 1.25) - 1          // 0-indexed left→right
  const renderRow = 4 - (Math.round(pot / 1.25) - 1)     // 0-indexed top→bottom
  return { left: col * 54 + 25, top: renderRow * 54 + 25 }
}

// History dot colors by age (index 0 = oldest visible)
const HIST_COLORS = ['#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8']

function NineBox({ perf, pot, history = [], onDotClick }) {
  const [tooltip, setTooltip] = useState(null) // { snap, x, y }

  const colors = [
    '#dcfce7','#dcfce7','#bbf7d0',
    '#ffedd5','#d1fae5','#d1fae5',
    '#fee2e2','#ffedd5','#fef9c3',
  ]
  const cells = []
  for (let row = 4; row >= 0; row--) {
    for (let col = 0; col < 5; col++) {
      const r  = Math.round(row / 4 * 4)
      const c  = Math.round(col / 4 * 4)
      const qr = Math.floor(r / 2)
      const qc = Math.floor(c / 2)
      const qi = (2 - Math.min(qr, 2)) * 3 + Math.min(qc, 2)
      cells.push(
        <div
          key={`${row}-${col}`}
          className="ninebox-cell"
          style={{ background: colors[qi] }}
        />
      )
    }
  }

  const currentPos = getDotPos(perf, pot)
  // Show at most last 4 historical snapshots (excluding the most recent which is "current")
  const histSlice = history.slice(-5, -1)

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>
        Matriz 9-Box
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', textAlign: 'center' }}>Potencial Alto</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', textAlign: 'center' }}>Bajo</div>
        </div>
        <div style={{ flex: 1 }}>
          {/* Grid + overlay dots */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div className="ninebox-grid">{cells}</div>

            {/* Historical dots (older → more transparent, smaller) */}
            {histSlice.map((snap, i) => {
              if (!snap.nineBox) return null
              const pos   = getDotPos(snap.nineBox.performance, snap.nineBox.potential)
              const color = HIST_COLORS[Math.min(i, HIST_COLORS.length - 1)]
              return (
                <div
                  key={snap.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDotClick?.(snap)
                  }}
                  onMouseEnter={() => setTooltip({ snap, pos })}
                  onMouseLeave={() => setTooltip(null)}
                  title={`${snap.date}  ·  Desemp. ${snap.nineBox.performance}  ·  Potenc. ${snap.nineBox.potential}`}
                  style={{
                    position: 'absolute',
                    left: pos.left, top: pos.top,
                    transform: 'translate(-50%, -50%)',
                    width: 14, height: 14, borderRadius: '50%',
                    background: color,
                    border: '2px solid white',
                    boxShadow: `0 1px 4px rgba(0,0,0,.25)`,
                    cursor: onDotClick ? 'pointer' : 'default',
                    zIndex: 1,
                    opacity: 0.55 + (i / histSlice.length) * 0.35,
                    transition: 'transform .15s, opacity .15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.4)'; e.currentTarget.style.opacity = '1'; setTooltip({ snap, pos }) }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%,-50%)'; e.currentTarget.style.opacity = String(0.55 + (i / histSlice.length) * 0.35); setTooltip(null) }}
                />
              )
            })}

            {/* Current evaluation dot */}
            <div
              style={{
                position: 'absolute',
                left: currentPos.left, top: currentPos.top,
                transform: 'translate(-50%, -50%)',
                width: 22, height: 22, borderRadius: '50%',
                background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                border: '3px solid white',
                boxShadow: '0 0 10px rgba(251,191,36,.9), 0 0 20px rgba(251,191,36,.4)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />

            {/* Tooltip */}
            {tooltip && (
              <div style={{
                position: 'absolute',
                left: tooltip.pos.left + 14,
                top: tooltip.pos.top - 38,
                background: 'var(--navy)', color: 'white',
                borderRadius: 7, padding: '5px 10px',
                fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,.3)',
              }}>
                📅 {tooltip.snap.date}
                <span style={{ margin: '0 6px', opacity: .5 }}>·</span>
                D:{tooltip.snap.nineBox.performance} P:{tooltip.snap.nineBox.potential}
                {onDotClick && <span style={{ display: 'block', fontSize: 10, opacity: .7, marginTop: 2 }}>Clic para ver historial</span>}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Desempeño Bajo</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Alto</div>
          </div>

          {/* Legend */}
          {histSlice.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(135deg,#fde047,#f59e0b)', border: '2px solid white', boxShadow: '0 0 6px rgba(251,191,36,.7)', flexShrink: 0 }} />
                Evaluación actual
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', border: '2px solid white', flexShrink: 0 }} />
                Evaluaciones anteriores
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default function TalentCard({ data, adminMode, updateCollaborator, selectedCollab, onTabChange }) {
  const [selected, setSelected] = useState(selectedCollab || data.collaborators[0]?.id)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (selectedCollab) setSelected(selectedCollab)
  }, [selectedCollab])

  const collab = data.collaborators.find(c => c.id === selected) || data.collaborators[0]
  if (!collab) return null

  const color = COLOR_MAP[collab.colorCode] || 'var(--teal)'
  const doneCount = collab.idp.flatMap(p => p.actions).filter(a => a.status === 'done').length
  const totalCount = collab.idp.flatMap(p => p.actions).length

  const toggleStatus = (phaseIdx, actionIdx) => {
    const updated = JSON.parse(JSON.stringify(collab))
    const a = updated.idp[phaseIdx].actions[actionIdx]
    a.status = STATUS_CYCLE[a.status]
    updateCollaborator(collab.id, { idp: updated.idp })
  }

  return (
    <div className="page">
      <div className="page-inner">

        {/* Selector */}
        <div className="collab-selector">
          {data.collaborators.map(c => (
            <button
              key={c.id}
              className={`collab-btn ${selected === c.id ? 'active' : ''}`}
              onClick={() => setSelected(c.id)}
            >
              {c.code}
            </button>
          ))}
          {adminMode && (
            <button className="btn btn-admin btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setEditing(true)}>
              ✏️ Editar {collab.code}
            </button>
          )}
        </div>

        {/* Card header */}
        <div className="tc-header" id="tc-export">
          <div className="tc-avatar" style={{ background: color }}>{collab.id}</div>
          <div style={{ flex: 1 }}>
            <div className="tc-name">{collab.code}</div>
            <div className="tc-role">{collab.currentPosition}</div>
            <div className="tc-meta">
              <span className={`chip chip-${collab.readinessStatus === 'Listo ahora' ? 'teal' : collab.readinessStatus === 'Listo pronto' ? 'amber' : 'blue'}`}>
                {collab.readinessStatus}
              </span>
              <span className="chip chip-purple">→ {collab.targetPosition}</span>
              <span className="chip chip-coral">{collab.timelineMonths}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>{collab.readinessPercentage}%</div>
              <div style={{ fontSize: 12, color: 'var(--gray-4)' }}>Readiness</div>
            </div>
            <div className="readiness-bar-bg" style={{ width: 100 }}>
              <div className="readiness-bar-fill" style={{ width: `${collab.readinessPercentage}%`, background: color }} />
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => exportDocx(data, collab.id)}
            >↓ Word</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18 }}>
          <div>
            {/* Fortalezas */}
            <div className="sec-lbl">Fortalezas</div>
            <div className="card card-p" style={{ marginBottom: 18 }}>
              {collab.strengths.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, fontSize: 14, color: 'var(--text-muted)' }}>
                  <div style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</div>
                  {s}
                </div>
              ))}
            </div>

            {/* Brechas */}
            <div className="sec-lbl">Brechas de competencias</div>
            <div className="card" style={{ marginBottom: 18, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 14px', fontWeight: 600, fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Brecha</th>
                    <th style={{ textAlign: 'left', padding: '8px 14px', fontWeight: 600, fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Detalle</th>
                    <th style={{ textAlign: 'center', padding: '8px 14px', fontWeight: 600, fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severidad</th>
                  </tr>
                </thead>
                <tbody>
                  {collab.gaps.map((g, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '9px 14px', fontWeight: 500 }}>{g.name}</td>
                      <td style={{ padding: '9px 14px', color: 'var(--text-muted)' }}>{g.detail}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                        <span className={`sev sev-${g.severity}`}>{g.severity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* IDP */}
            <div className="sec-lbl">Plan de Desarrollo Individual — {doneCount}/{totalCount} completado</div>
            {collab.idp.map((phase, pi) => (
              <div key={pi} className="phase-card">
                <div className="phase-header">
                  <div className="phase-num">{phase.phase}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Fase {phase.phase}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{phase.duration}</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {phase.actions.filter(a => a.status === 'done').length}/{phase.actions.length} completadas
                  </div>
                </div>
                <div className="phase-body">
                  {phase.actions.map((a, ai) => (
                    <div key={ai} className="phase-action">
                      <div
                        className={`status-dot status-${a.status}`}
                        onClick={() => toggleStatus(pi, ai)}
                        title="Clic para cambiar estado"
                      >
                        {a.status === 'done' ? '✓' : a.status === 'inprogress' ? '◔' : ''}
                      </div>
                      <div style={{ flex: 1, textDecoration: a.status === 'done' ? 'line-through' : 'none', color: a.status === 'done' ? 'var(--text-muted)' : 'var(--text)' }}>
                        {a.text}
                      </div>
                      <div style={{ fontSize: 12, color: a.status === 'done' ? 'var(--teal)' : a.status === 'inprogress' ? 'var(--amber)' : 'var(--gray-4)' }}>
                        {a.status === 'done' ? 'Completado' : a.status === 'inprogress' ? 'En progreso' : 'Pendiente'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Historial de evaluaciones */}
            {(collab.evaluationHistory?.length || 0) > 0 && (
              <>
                <div className="sec-lbl" style={{ marginTop: 24 }}>
                  Historial de evaluaciones — {collab.evaluationHistory.length} registro{collab.evaluationHistory.length !== 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
                  {[...collab.evaluationHistory].reverse().map((ev, i) => {
                    const isLatest = i === 0
                    const typeColor = ev.type === 'potencial' ? '#4a42b0' : '#1455a0'
                    const typeBg    = ev.type === 'potencial' ? '#eceafb' : '#e4eef9'
                    const typeLabel = ev.type === 'potencial' ? 'Potencial' : 'Desempeño'
                    return (
                      <div key={ev.id} style={{
                        background: isLatest ? 'white' : 'var(--gray-1)',
                        border: `1px solid ${isLatest ? 'var(--border)' : 'var(--border)'}`,
                        borderRadius: 9,
                        padding: '11px 14px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        boxShadow: isLatest ? '0 1px 4px rgba(0,0,0,.06)' : 'none',
                      }}>
                        <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 44 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{ev.date.slice(5)}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{ev.date.slice(0,4)}</div>
                        </div>
                        <div style={{ width: 1, height: 30, background: 'var(--border)', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: typeBg, color: typeColor, flexShrink: 0 }}>
                          {typeLabel}
                        </span>
                        <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>{ev.nineBox?.performance ?? '—'}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Desemp.</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>{ev.nineBox?.potential ?? '—'}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Potenc.</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal)', lineHeight: 1 }}>{ev.readinessPercentage != null ? `${ev.readinessPercentage}%` : '—'}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Readiness</div>
                          </div>
                          {ev.idpTotal > 0 && (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>{ev.idpDone}/{ev.idpTotal}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>IDP</div>
                            </div>
                          )}
                        </div>
                        {isLatest && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#e6f5ef', color: '#0d7a5a', flexShrink: 0 }}>
                            Última
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <button
                  onClick={() => onTabChange?.('historial')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4,
                    padding: '7px 14px', borderRadius: 7,
                    border: '1px solid var(--border)', background: 'white',
                    color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  📋 Ver historial completo →
                </button>
              </>
            )}
          </div>

          {/* 9-Box sidebar */}
          <div style={{ paddingTop: 2 }}>
            <div className="card card-p" style={{ width: 370, padding: '20px 24px' }}>
              <NineBox
                perf={collab.nineBox.performance}
                pot={collab.nineBox.potential}
                history={collab.evaluationHistory || []}
                onDotClick={() => onTabChange?.('historial')}
              />

              {/* Scores */}
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--gray-1)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>{collab.nineBox.performance}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Desempeño</div>
                </div>
                <div style={{ background: 'var(--gray-1)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>{collab.nineBox.potential}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Potencial</div>
                </div>
              </div>

              {/* Profile label */}
              {(() => {
                const profile = getNineBoxProfile(collab.nineBox.performance, collab.nineBox.potential)
                return (
                  <div style={{
                    marginTop: 12,
                    background: profile.bg,
                    border: `1.5px solid ${profile.border}`,
                    borderRadius: 10,
                    padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: profile.color, marginBottom: 4 }}>
                      {profile.icon} {profile.label}
                    </div>
                    <div style={{ fontSize: 12, color: profile.color, lineHeight: 1.55, opacity: 0.85 }}>
                      {profile.desc}
                    </div>
                  </div>
                )
              })()}

              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                Escala 1–5 · Editar en IDP para actualizar
              </div>
            </div>
          </div>
        </div>

      </div>
      {editing && (
        <EditModal
          collab={collab}
          onSave={updateCollaborator}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}
