import { useState, useMemo, useRef } from 'react'
import { exportEvaluacionesCSV, exportEvaluacionesJSON } from '../utils/exports'

// ─── Dimension Definitions ────────────────────────────────────────────────────

const PERF_DIMS = [
  { id: 'liderazgo',    code: 'A', name: 'Liderazgo de Personas',                 weightLabel: '30%' },
  { id: 'gestion',      code: 'B', name: 'Gestión de Proyectos y Flujo Operativo', weightLabel: '20%' },
  { id: 'comunicacion', code: 'C', name: 'Comunicación e Influencia',              weightLabel: '15%' },
  { id: 'tecnico',      code: 'D', name: 'Capacidad Técnico-Analítica',            weightLabel: '20%' },
  { id: 'cumplimiento', code: 'E', name: 'Cumplimiento y Estandarización',         weightLabel: '15%' },
]

const POT_DIMS = [
  { id: 'aprendizaje', code: 'P1', name: 'Agilidad de Aprendizaje',    weightLabel: '40%' },
  { id: 'pensamiento', code: 'P2', name: 'Complejidad de Pensamiento', weightLabel: '30%' },
  { id: 'impulso',     code: 'P3', name: 'Impulso y Aspiración',       weightLabel: '30%' },
]

const SCORE_COLORS = {
  1: { bg: '#FCEBEB', text: '#A32D2D', border: '#e8aaaa' },
  2: { bg: '#FAEEDA', text: '#BA7517', border: '#e8cc8a' },
  3: { bg: '#FFFBE6', text: '#8a7014', border: '#e8d87a' },
  4: { bg: '#E1F5EE', text: '#0f6e56', border: '#7DCFB0' },
  5: { bg: '#d0f0e4', text: '#0a4d3d', border: '#5dc4a0' },
}

// ─── Reusable chips ───────────────────────────────────────────────────────────

function ScoreChip({ value }) {
  if (value == null) return <span style={{ color: '#c8cdd0', fontSize: 12 }}>—</span>
  const c = SCORE_COLORS[value] || SCORE_COLORS[3]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 12,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      fontWeight: 700, fontSize: 12, fontFamily: 'DM Mono, monospace', letterSpacing: 0.5,
    }}>
      {value}
    </span>
  )
}

function AvgChip({ value }) {
  if (value == null) return <span style={{ color: '#c8cdd0', fontSize: 12 }}>—</span>
  const c = SCORE_COLORS[Math.round(value)] || SCORE_COLORS[3]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 12,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      fontWeight: 800, fontSize: 13, fontFamily: 'DM Mono, monospace',
    }}>
      {Number(value).toFixed(2)}
    </span>
  )
}

function StatusChip({ status }) {
  const map = {
    'Listo ahora':  { bg: '#E1F5EE', color: '#0f6e56', border: '#7DCFB0' },
    'Listo pronto': { bg: '#FAEEDA', color: '#BA7517', border: '#e8cc8a' },
    'Listo futuro': { bg: '#FCEBEB', color: '#A32D2D', border: '#e8aaaa' },
  }
  const s = map[status] || { bg: '#EEF0F2', color: '#5a6b74', border: '#d4d8db' }
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 12,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

// ─── Column group config ──────────────────────────────────────────────────────

const COL_GROUPS = [
  { key: 'estado',    label: 'Estado',      bg: '#e6f1fb', color: '#185FA5', cols: 4 },
  { key: 'desempeno', label: 'Desempeño',   bg: '#e1f5ee', color: '#0f6e56', cols: 7 },
  { key: 'potencial', label: 'Potencial',   bg: '#eeecfb', color: '#534AB7', cols: 5 },
  { key: 'nineBox',   label: '9-Box',       bg: '#faeeda', color: '#BA7517', cols: 2 },
  { key: 'calor',     label: 'Mapa Calor',  bg: '#faece7', color: '#993C1D', cols: null },
  { key: 'idp',       label: 'IDP',         bg: '#f7f8f9', color: '#1a2e3b', cols: 3 },
]

// ─── Styles helpers ───────────────────────────────────────────────────────────

const TH_BASE = {
  padding: '5px 10px', fontSize: 11, fontWeight: 700,
  borderBottom: '1px solid rgba(0,0,0,.08)', borderRight: '1px solid rgba(0,0,0,.06)',
  textAlign: 'center', letterSpacing: 0.4, textTransform: 'uppercase',
  position: 'sticky', top: 0, zIndex: 2, whiteSpace: 'nowrap',
}

const TD_BASE = {
  padding: '8px 10px', fontSize: 12,
  borderBottom: '1px solid #eef0f2', borderRight: '1px solid #f7f8f9',
  verticalAlign: 'middle', textAlign: 'center', whiteSpace: 'nowrap',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BaseDatos({ data, adminMode, updateCollaborator, updateHeatmap }) {
  const { collaborators, heatmap } = data
  const importRef = useRef(null)

  const [visible, setVisible] = useState({
    estado: true, desempeno: true, potencial: true,
    nineBox: true, calor: true, idp: true,
  })
  const [filterCollab, setFilterCollab] = useState('todos')
  const [sortKey, setSortKey]           = useState('priority')
  const [importMsg, setImportMsg]       = useState(null)

  const toggle = (key) => setVisible(prev => ({ ...prev, [key]: !prev[key] }))

  // ─── Sorted / filtered rows ───────────────────────────────────────────────

  const displayed = useMemo(() => {
    let list = filterCollab === 'todos'
      ? [...collaborators]
      : collaborators.filter(c => c.id === filterCollab)

    list.sort((a, b) => {
      if (sortKey === 'priority')    return a.priority - b.priority
      if (sortKey === 'readiness')   return b.readinessPercentage - a.readinessPercentage
      if (sortKey === 'perfAvg') {
        const av = (c) => c.rubricScores?.weightedAvg ?? -1
        return av(b) - av(a)
      }
      if (sortKey === 'potAvg') {
        const av = (c) => c.potentialScores?.weightedAvg ?? -1
        return av(b) - av(a)
      }
      return 0
    })
    return list
  }, [collaborators, filterCollab, sortKey])

  // ─── Summary stats ────────────────────────────────────────────────────────

  const evalCount = collaborators.filter(c => c.rubricScores?.weightedAvg).length
  const potCount  = collaborators.filter(c => c.potentialScores?.weightedAvg).length
  const avgPerf   = evalCount
    ? (collaborators.reduce((s, c) => s + (c.rubricScores?.weightedAvg || 0), 0) / evalCount).toFixed(2)
    : null
  const avgPot    = potCount
    ? (collaborators.reduce((s, c) => s + (c.potentialScores?.weightedAvg || 0), 0) / potCount).toFixed(2)
    : null

  // ─── Import handler ───────────────────────────────────────────────────────

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (parsed._tipo !== 'evaluaciones-pns-pr' || !Array.isArray(parsed.evaluaciones)) {
          setImportMsg({ ok: false, text: 'Archivo inválido. Debe ser una exportación de evaluaciones PNS-PR.' })
          return
        }
        let updated = 0
        parsed.evaluaciones.forEach(entry => {
          const existing = collaborators.find(c => c.id === entry.id)
          if (!existing) return
          const updates = {}
          if (entry.rubricScores) {
            updates.rubricScores = entry.rubricScores
            if (entry.rubricScores.weightedAvg) {
              const pct = Math.round((entry.rubricScores.weightedAvg / 5) * 100)
              updates.readinessPercentage = pct
              updates.readinessStatus = pct >= 70 ? 'Listo ahora' : pct >= 45 ? 'Listo pronto' : 'Listo futuro'
              const perfBox = Math.max(1, Math.min(5, Math.round(entry.rubricScores.weightedAvg)))
              updates.nineBox = { ...existing.nineBox, performance: perfBox }
            }
          }
          if (entry.potentialScores) {
            updates.potentialScores = entry.potentialScores
            if (entry.potentialScores.weightedAvg) {
              const potBox = Math.max(1, Math.min(5, Math.round(entry.potentialScores.weightedAvg)))
              updates.nineBox = { ...(updates.nineBox ?? existing.nineBox), potential: potBox }
            }
          }
          if (Object.keys(updates).length > 0) {
            updateCollaborator(entry.id, updates)
            updated++
          }
        })
        if (parsed.heatmap && Array.isArray(parsed.heatmap)) {
          updateHeatmap(parsed.heatmap)
        }
        setImportMsg({ ok: true, text: `✓ ${updated} colaborador(es) actualizado(s) correctamente.` })
        setTimeout(() => setImportMsg(null), 5000)
      } catch {
        setImportMsg({ ok: false, text: 'Error: archivo JSON inválido o corrupto.' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', marginBottom: 3 }}>
            Base de Datos de Evaluaciones
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Matriz completa · rúbricas de desempeño y potencial, 9-Box, mapa de calor e IDP por colaborador
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-white btn-sm" onClick={() => exportEvaluacionesCSV(data)}>
            📊 Exportar CSV
          </button>
          <button className="btn btn-white btn-sm" onClick={() => exportEvaluacionesJSON(data)}>
            💾 Exportar JSON
          </button>
          {adminMode && (
            <>
              <button
                className="btn btn-sm"
                style={{ background: 'var(--purple)', color: 'white' }}
                onClick={() => importRef.current?.click()}
              >
                📥 Importar JSON
              </button>
              <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </>
          )}
        </div>
      </div>

      {/* Import feedback */}
      {importMsg && (
        <div style={{
          marginBottom: 14, padding: '8px 14px', borderRadius: 8,
          background: importMsg.ok ? '#E1F5EE' : '#FCEBEB',
          color: importMsg.ok ? '#0f6e56' : '#A32D2D',
          border: `1px solid ${importMsg.ok ? '#7DCFB0' : '#e8aaaa'}`,
          fontSize: 13, fontWeight: 500,
        }}>
          {importMsg.text}
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {[
          { label: 'Colaboradores', value: collaborators.length, color: 'var(--navy)' },
          { label: 'Eval. Desempeño', value: `${evalCount}/${collaborators.length}`, color: 'var(--teal)' },
          { label: 'Eval. Potencial', value: `${potCount}/${collaborators.length}`, color: 'var(--purple)' },
          { label: 'Prom. Desempeño', value: avgPerf ? `${avgPerf}/5` : '—', color: 'var(--teal)' },
          { label: 'Prom. Potencial', value: avgPot  ? `${avgPot}/5`  : '—', color: 'var(--purple)' },
          { label: 'Listos ahora', value: collaborators.filter(c => c.readinessStatus === 'Listo ahora').length, color: '#0f6e56' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'white', borderRadius: 10, padding: '11px 18px',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', minWidth: 120,
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{card.label}</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Controls bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Colaborador:</span>
          <select
            value={filterCollab}
            onChange={e => setFilterCollab(e.target.value)}
            style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, background: 'white', color: 'var(--text)' }}
          >
            <option value="todos">Todos</option>
            {collaborators.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Ordenar:</span>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
            style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 12, background: 'white', color: 'var(--text)' }}
          >
            <option value="priority">Prioridad</option>
            <option value="readiness">Readiness %</option>
            <option value="perfAvg">Promedio Desempeño</option>
            <option value="potAvg">Promedio Potencial</option>
          </select>
        </div>

        {/* Column toggles */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center', marginLeft: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Columnas:</span>
          {COL_GROUPS.map(g => (
            <button
              key={g.key}
              onClick={() => toggle(g.key)}
              style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${visible[g.key] ? g.color : '#d4d8db'}`,
                background: visible[g.key] ? g.bg : 'white',
                color: visible[g.key] ? g.color : 'var(--text-muted)',
                transition: 'all .15s',
              }}
            >
              {visible[g.key] ? '✓' : '○'} {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'white', borderRadius: 12,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
        overflow: 'auto', maxHeight: 'calc(100vh - 380px)',
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
          <thead>
            {/* ── Group header row ── */}
            <tr>
              <th rowSpan={2} style={{
                ...TH_BASE, textAlign: 'left', padding: '10px 14px',
                minWidth: 170, position: 'sticky', left: 0, zIndex: 5,
                background: 'var(--navy)', color: 'white', fontSize: 12,
                verticalAlign: 'middle', top: 0,
              }}>
                Colaborador
              </th>
              {visible.estado && (
                <th colSpan={4} style={{ ...TH_BASE, background: '#e6f1fb', color: '#185FA5' }}>
                  Estado Readiness
                </th>
              )}
              {visible.desempeno && (
                <th colSpan={7} style={{ ...TH_BASE, background: '#e1f5ee', color: '#0f6e56' }}>
                  Rúbricas — Desempeño
                </th>
              )}
              {visible.potencial && (
                <th colSpan={5} style={{ ...TH_BASE, background: '#eeecfb', color: '#534AB7' }}>
                  Rúbricas — Potencial
                </th>
              )}
              {visible.nineBox && (
                <th colSpan={2} style={{ ...TH_BASE, background: '#faeeda', color: '#BA7517' }}>
                  9-Box
                </th>
              )}
              {visible.calor && (
                <th colSpan={heatmap.length} style={{ ...TH_BASE, background: '#faece7', color: '#993C1D' }}>
                  Mapa de Calor
                </th>
              )}
              {visible.idp && (
                <th colSpan={3} style={{ ...TH_BASE, background: '#f7f8f9', color: '#1a2e3b' }}>
                  IDP
                </th>
              )}
            </tr>

            {/* ── Sub-header row ── */}
            <tr>
              {visible.estado && <>
                <th style={{ ...TH_BASE, background: '#EEF6FB', color: '#185FA5', top: 28 }}>Estado</th>
                <th style={{ ...TH_BASE, background: '#EEF6FB', color: '#185FA5', top: 28 }}>%</th>
                <th style={{ ...TH_BASE, background: '#EEF6FB', color: '#185FA5', top: 28 }}>Timeline</th>
                <th style={{ ...TH_BASE, background: '#EEF6FB', color: '#185FA5', top: 28 }}>Puesto Objetivo</th>
              </>}
              {visible.desempeno && <>
                {PERF_DIMS.map(d => (
                  <th key={d.id} style={{ ...TH_BASE, background: '#EDF9F4', color: '#0f6e56', top: 28 }} title={d.name}>
                    {d.code} <span style={{ opacity: 0.65 }}>({d.weightLabel})</span>
                  </th>
                ))}
                <th style={{ ...TH_BASE, background: '#EDF9F4', color: '#0f6e56', top: 28 }}>Avg</th>
                <th style={{ ...TH_BASE, background: '#EDF9F4', color: '#0f6e56', top: 28 }}>Rol</th>
              </>}
              {visible.potencial && <>
                {POT_DIMS.map(d => (
                  <th key={d.id} style={{ ...TH_BASE, background: '#F4F3FD', color: '#534AB7', top: 28 }} title={d.name}>
                    {d.code} <span style={{ opacity: 0.65 }}>({d.weightLabel})</span>
                  </th>
                ))}
                <th style={{ ...TH_BASE, background: '#F4F3FD', color: '#534AB7', top: 28 }}>Avg</th>
                <th style={{ ...TH_BASE, background: '#F4F3FD', color: '#534AB7', top: 28 }}>Fecha</th>
              </>}
              {visible.nineBox && <>
                <th style={{ ...TH_BASE, background: '#FDF3E3', color: '#BA7517', top: 28 }}>Desemp.</th>
                <th style={{ ...TH_BASE, background: '#FDF3E3', color: '#BA7517', top: 28 }}>Potenc.</th>
              </>}
              {visible.calor && heatmap.map(row => (
                <th
                  key={row.dimension}
                  style={{ ...TH_BASE, background: '#FDF1ED', color: '#993C1D', top: 28, maxWidth: 90 }}
                  title={row.dimension}
                >
                  {row.dimension.length > 16 ? row.dimension.slice(0, 15) + '…' : row.dimension}
                </th>
              ))}
              {visible.idp && <>
                <th style={{ ...TH_BASE, background: '#F7F8F9', color: '#1a2e3b', top: 28 }}>Total</th>
                <th style={{ ...TH_BASE, background: '#F7F8F9', color: '#1a2e3b', top: 28 }}>Hechas</th>
                <th style={{ ...TH_BASE, background: '#F7F8F9', color: '#1a2e3b', top: 28 }}>Progreso</th>
              </>}
            </tr>
          </thead>

          <tbody>
            {displayed.map((c, idx) => {
              const rs = c.rubricScores
              const ps = c.potentialScores
              const allActions = c.idp?.flatMap(p => p.actions) || []
              const done = allActions.filter(a => a.status === 'done').length
              const idpPct = allActions.length > 0 ? Math.round((done / allActions.length) * 100) : 0
              const rowBg = idx % 2 === 0 ? 'white' : '#fafbfb'

              return (
                <tr key={c.id} style={{ background: rowBg }}>
                  {/* Sticky name cell */}
                  <td style={{
                    ...TD_BASE, textAlign: 'left',
                    position: 'sticky', left: 0, background: rowBg,
                    zIndex: 1, borderRight: '2px solid var(--border)', minWidth: 170,
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 12 }}>{c.code}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                      P{c.priority} · {c.currentPosition.split('—')[0].trim()}
                    </div>
                  </td>

                  {/* Estado */}
                  {visible.estado && <>
                    <td style={TD_BASE}><StatusChip status={c.readinessStatus} /></td>
                    <td style={TD_BASE}>
                      <span style={{
                        fontWeight: 700, fontSize: 13,
                        color: c.readinessPercentage >= 70 ? '#0f6e56' : c.readinessPercentage >= 45 ? '#BA7517' : '#A32D2D',
                      }}>
                        {c.readinessPercentage}%
                      </span>
                    </td>
                    <td style={{ ...TD_BASE, fontSize: 11, color: 'var(--text-muted)' }}>{c.timelineMonths}</td>
                    <td style={{ ...TD_BASE, textAlign: 'left', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 11, color: 'var(--text-muted)' }}>
                      {c.targetPosition}
                    </td>
                  </>}

                  {/* Desempeño */}
                  {visible.desempeno && <>
                    {PERF_DIMS.map(d => (
                      <td key={d.id} style={TD_BASE}>
                        <ScoreChip value={rs?.scores?.[d.id] ?? null} />
                      </td>
                    ))}
                    <td style={TD_BASE}><AvgChip value={rs?.weightedAvg ?? null} /></td>
                    <td style={{ ...TD_BASE, fontSize: 11, color: 'var(--text-muted)' }}>{rs?.targetRole || '—'}</td>
                  </>}

                  {/* Potencial */}
                  {visible.potencial && <>
                    {POT_DIMS.map(d => (
                      <td key={d.id} style={TD_BASE}>
                        <ScoreChip value={ps?.scores?.[d.id] ?? null} />
                      </td>
                    ))}
                    <td style={TD_BASE}><AvgChip value={ps?.weightedAvg ?? null} /></td>
                    <td style={{ ...TD_BASE, fontSize: 10, color: 'var(--text-muted)' }}>{ps?.lastEvaluated || '—'}</td>
                  </>}

                  {/* 9-Box */}
                  {visible.nineBox && <>
                    <td style={TD_BASE}><ScoreChip value={c.nineBox?.performance ?? null} /></td>
                    <td style={TD_BASE}><ScoreChip value={c.nineBox?.potential ?? null} /></td>
                  </>}

                  {/* Mapa de calor */}
                  {visible.calor && heatmap.map(row => (
                    <td key={row.dimension} style={TD_BASE}>
                      <ScoreChip value={row[c.id] ?? null} />
                    </td>
                  ))}

                  {/* IDP */}
                  {visible.idp && <>
                    <td style={TD_BASE}>{allActions.length}</td>
                    <td style={TD_BASE}>{done}</td>
                    <td style={TD_BASE}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                        <div style={{ width: 44, height: 5, background: '#eef0f2', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            width: `${idpPct}%`, height: '100%', borderRadius: 4,
                            background: idpPct === 100 ? '#1D9E75' : idpPct > 0 ? '#534AB7' : '#d4d8db',
                          }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 28 }}>{idpPct}%</span>
                      </div>
                    </td>
                  </>}
                </tr>
              )
            })}
          </tbody>
        </table>

        {displayed.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            No hay colaboradores que mostrar.
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {displayed.length} colaborador(es) · {data.meta.period} · {data.meta.organization}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Escala: 1 Inicial · 2 Funcional · 3 Competente · 4 Avanzado · 5 Excelencia · — Sin evaluar
        </p>
      </div>
    </div>
  )
}
