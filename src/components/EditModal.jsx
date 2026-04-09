import { useState } from 'react'

export default function EditModal({ collab, onSave, onClose }) {
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
              <input className="form-input" value={g.detail || ''} onChange={e => updateGap(i, 'detail', e.target.value)} placeholder="Detalle..." />
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
