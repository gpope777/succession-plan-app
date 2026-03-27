import { useState } from 'react'
import { exportPDF, exportDocx } from '../utils/exports'

const COLOR_MAP = { teal: 'var(--teal)', purple: 'var(--purple)', amber: 'var(--amber)', blue: 'var(--blue)', coral: 'var(--coral)' }
const STATUS_CYCLE = { pending: 'inprogress', inprogress: 'done', done: 'pending' }
const STATUS_LABEL = { pending: '○', inprogress: '◔', done: '✓' }

function getNineBoxProfile(perf, pot) {
  const p = perf >= 4 ? 'high' : perf >= 3 ? 'mid' : 'low'
  const q = pot  >= 4 ? 'high' : pot  >= 3 ? 'mid' : 'low'
  const map = {
    'high-high': { label: 'Estrella',              icon: '🌟', desc: 'Alto desempeño y alto potencial. Candidato prioritario para roles de liderazgo y sucesión.', color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
    'high-mid':  { label: 'Empleado Confiable',    icon: '🔒', desc: 'Alto desempeño con potencial moderado. Pilar fundamental del equipo y garante de la continuidad.', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
    'high-low':  { label: 'Experto Técnico',       icon: '🏆', desc: 'Alto desempeño sostenido. Su experiencia especializada es un activo crítico del departamento.', color: '#1e3a5f', bg: '#e0f2fe', border: '#7dd3fc' },
    'mid-high':  { label: 'Estrella Futura',       icon: '🚀', desc: 'Alto potencial en desarrollo. Inversión estratégica de mediano plazo con alto retorno esperado.', color: '#6b21a8', bg: '#f3e8ff', border: '#c4b5fd' },
    'mid-mid':   { label: 'Empleado Sólido',       icon: '✅', desc: 'Desempeño y potencial consistentes. Contribuye de manera estable y confiable al equipo.', color: '#92400e', bg: '#fef3c7', border: '#fcd34d' },
    'mid-low':   { label: 'Profesional Estable',   icon: '📊', desc: 'Desempeño aceptable con potencial limitado actualmente. Rol definido y valor operativo claro.', color: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
    'low-high':  { label: 'Diamante en Bruto',     icon: '💎', desc: 'Alto potencial con desempeño aún bajo. Requiere coaching enfocado y oportunidades de desarrollo.', color: '#7c3aed', bg: '#ede9fe', border: '#a78bfa' },
    'low-mid':   { label: 'En Desarrollo',         icon: '⚠️', desc: 'Desempeño por debajo de lo esperado. Requiere plan de mejora activo y seguimiento cercano.', color: '#b45309', bg: '#fff7ed', border: '#fbbf24' },
    'low-low':   { label: 'Atención Requerida',    icon: '🔴', desc: 'Bajo desempeño y potencial limitado en el rol actual. Intervención inmediata necesaria.', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  }
  return map[`${p}-${q}`] || map['mid-mid']
}

function NineBox({ perf, pot }) {
  const colors = [
    '#d6dada','#c5d4f5','#1D9E75',
    '#f5e8d0','#5DCAA5','#1D9E75',
    '#FCEBEB','#f5e8d0','#1a2e3b',
  ]
  const cells = []
  for (let row = 4; row >= 0; row--) {
    for (let col = 0; col < 5; col++) {
      const r = Math.round(row / 4 * 4)
      const c = Math.round(col / 4 * 4)
      const qr = Math.floor(r / 2)
      const qc = Math.floor(c / 2)
      const qi = (2 - Math.min(qr, 2)) * 3 + Math.min(qc, 2)
      const isOccupied = Math.round(perf / 1.25) - 1 === col && Math.round(pot / 1.25) - 1 === (4 - row)
      cells.push(
        <div
          key={`${row}-${col}`}
          className={`ninebox-cell ${isOccupied ? 'occupied' : ''}`}
          style={{ background: colors[qi] }}
        >
          {isOccupied && (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #fde047, #f59e0b)',
              border: '3px solid white',
              boxShadow: '0 0 10px rgba(251,191,36,0.9), 0 0 20px rgba(251,191,36,0.5)',
              flexShrink: 0,
            }} />
          )}
        </div>
      )
    }
  }
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>Matriz 9-Box</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', textAlign: 'center' }}>Potencial Alto</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', textAlign: 'center' }}>Bajo</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="ninebox-grid">{cells}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Desempeño Bajo</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Alto</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditModal({ collab, onSave, onClose }) {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(collab)))

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const setNineBox = (field, value) => setForm(f => ({ ...f, nineBox: { ...f.nineBox, [field]: Number(value) } }))

  const addStrength = () => set('strengths', [...form.strengths, ''])
  const updateStrength = (i, v) => set('strengths', form.strengths.map((s, idx) => idx === i ? v : s))
  const removeStrength = (i) => set('strengths', form.strengths.filter((_, idx) => idx !== i))

  const addGap = () => set('gaps', [...form.gaps, { name: '', detail: '', severity: 'Media' }])
  const updateGap = (i, field, v) => set('gaps', form.gaps.map((g, idx) => idx === i ? { ...g, [field]: v } : g))
  const removeGap = (i) => set('gaps', form.gaps.filter((_, idx) => idx !== i))

  const addAction = (phaseIdx) => {
    const idp = JSON.parse(JSON.stringify(form.idp))
    idp[phaseIdx].actions.push({ text: '', status: 'pending' })
    set('idp', idp)
  }
  const updateAction = (pi, ai, field, v) => {
    const idp = JSON.parse(JSON.stringify(form.idp))
    idp[pi].actions[ai] = { ...idp[pi].actions[ai], [field]: v }
    set('idp', idp)
  }
  const removeAction = (pi, ai) => {
    const idp = JSON.parse(JSON.stringify(form.idp))
    idp[pi].actions = idp[pi].actions.filter((_, idx) => idx !== ai)
    set('idp', idp)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div style={{ fontWeight: 700, fontSize: 16 }}>Editar — {form.code}</div>
          <button className="btn btn-white btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">

          <div className="form-row">
            <div>
              <label className="form-label">Código / Nombre</label>
              <input className="form-input" value={form.code} onChange={e => set('code', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Departamento / Especialidad</label>
              <input className="form-input" value={form.department} onChange={e => set('department', e.target.value)} />
            </div>
          </div>

          <div className="form-full">
            <label className="form-label">Puesto actual</label>
            <input className="form-input" value={form.currentPosition} onChange={e => set('currentPosition', e.target.value)} />
          </div>

          <div className="form-full">
            <label className="form-label">Puesto objetivo</label>
            <input className="form-input" value={form.targetPosition} onChange={e => set('targetPosition', e.target.value)} />
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Readiness</label>
              <select className="form-select" value={form.readinessStatus} onChange={e => set('readinessStatus', e.target.value)}>
                <option>Listo ahora</option>
                <option>Listo pronto</option>
                <option>Listo futuro</option>
              </select>
            </div>
            <div>
              <label className="form-label">% Listo (0–100)</label>
              <input className="form-input" type="number" min="0" max="100" value={form.readinessPercentage} onChange={e => set('readinessPercentage', Number(e.target.value))} />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Timeline estimado</label>
              <input className="form-input" value={form.timelineMonths} onChange={e => set('timelineMonths', e.target.value)} placeholder="Ej: 12–18 meses" />
            </div>
            <div>
              <label className="form-label">Prioridad (1 = más alta)</label>
              <input className="form-input" type="number" min="1" max="10" value={form.priority} onChange={e => set('priority', Number(e.target.value))} />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Desempeño 9-Box (1–5)</label>
              <input className="form-input" type="number" min="1" max="5" value={form.nineBox.performance} onChange={e => setNineBox('performance', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Potencial 9-Box (1–5)</label>
              <input className="form-input" type="number" min="1" max="5" value={form.nineBox.potential} onChange={e => setNineBox('potential', e.target.value)} />
            </div>
          </div>

          {/* Strengths */}
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, marginTop: 4 }}>Fortalezas</div>
          {form.strengths.map((s, i) => (
            <div key={i} className="list-item">
              <input className="form-input list-item-main" value={s} onChange={e => updateStrength(i, e.target.value)} placeholder="Fortaleza..." style={{ margin: 0, padding: '4px 8px' }} />
              <button className="btn-remove" onClick={() => removeStrength(i)}>×</button>
            </div>
          ))}
          <button className="btn-add" onClick={addStrength}>+ Agregar fortaleza</button>

          {/* Gaps */}
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, marginTop: 16 }}>Brechas de competencias</div>
          {form.gaps.map((g, i) => (
            <div key={i} className="list-item" style={{ flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 6, width: '100%', alignItems: 'center' }}>
                <input className="form-input" value={g.name} onChange={e => updateGap(i, 'name', e.target.value)} placeholder="Nombre de la brecha..." style={{ flex: 2 }} />
                <select className="form-select" value={g.severity} onChange={e => updateGap(i, 'severity', e.target.value)} style={{ flex: 1 }}>
                  <option>Crítica</option>
                  <option>Alta</option>
                  <option>Media</option>
                </select>
                <button className="btn-remove" onClick={() => removeGap(i)}>×</button>
              </div>
              <input className="form-input" value={g.detail} onChange={e => updateGap(i, 'detail', e.target.value)} placeholder="Detalle..." />
            </div>
          ))}
          <button className="btn-add" onClick={addGap}>+ Agregar brecha</button>

          {/* IDP */}
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, marginTop: 16 }}>Plan de Desarrollo Individual (IDP)</div>
          {form.idp.map((phase, pi) => (
            <div key={pi} className="phase-card" style={{ marginBottom: 10 }}>
              <div className="phase-header">
                <div className="phase-num">{phase.phase}</div>
                <input className="form-input" value={phase.duration} onChange={e => {
                  const idp = JSON.parse(JSON.stringify(form.idp))
                  idp[pi].duration = e.target.value
                  set('idp', idp)
                }} style={{ flex: 1 }} placeholder="Duración..." />
              </div>
              <div className="phase-body">
                {phase.actions.map((a, ai) => (
                  <div key={ai} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <select
                      className="form-select"
                      value={a.status}
                      onChange={e => updateAction(pi, ai, 'status', e.target.value)}
                      style={{ width: 100, flex: 'none' }}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="inprogress">En progreso</option>
                      <option value="done">Completado</option>
                    </select>
                    <input className="form-input" value={a.text} onChange={e => updateAction(pi, ai, 'text', e.target.value)} placeholder="Acción..." style={{ flex: 1 }} />
                    <button className="btn-remove" onClick={() => removeAction(pi, ai)}>×</button>
                  </div>
                ))}
                <button className="btn-add" onClick={() => addAction(pi)}>+ Agregar acción</button>
              </div>
            </div>
          ))}

        </div>
        <div className="modal-footer">
          <button className="btn btn-white" onClick={onClose}>Cancelar</button>
          <button className="btn btn-teal" onClick={() => { onSave(form.id, form); onClose() }}>Guardar cambios</button>
        </div>
      </div>
    </div>
  )
}

export default function TalentCard({ data, adminMode, updateCollaborator }) {
  const [selected, setSelected] = useState(data.collaborators[0]?.id)
  const [editing, setEditing] = useState(false)

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
          </div>

          {/* 9-Box sidebar */}
          <div style={{ paddingTop: 2 }}>
            <div className="card card-p" style={{ width: 370, padding: '20px 24px' }}>
              <NineBox perf={collab.nineBox.performance} pot={collab.nineBox.potential} />

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
