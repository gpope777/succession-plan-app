import { useState, useMemo } from 'react'

const TYPE_LABEL = { desempeno: 'Desempeño', potencial: 'Potencial' }
const TYPE_COLOR = { desempeno: '#1455a0', potencial: '#4a42b0' }
const TYPE_BG    = { desempeno: '#e4eef9', potencial: '#eceafb' }

const STATUS_COLOR = {
  'Listo ahora':   { bg: '#d1fae5', color: '#0d7a5a' },
  'Listo pronto':  { bg: '#faebd4', color: '#b06a10' },
  'En desarrollo': { bg: '#e4eef9', color: '#1455a0' },
}

const COLOR_MAP = {
  teal: 'var(--teal)', purple: 'var(--purple)',
  amber: 'var(--amber)', blue: 'var(--blue)', coral: 'var(--coral)',
}

function NineBoxMini({ perf, pot }) {
  const colors = [
    '#dcfce7','#dcfce7','#bbf7d0',
    '#ffedd5','#d1fae5','#d1fae5',
    '#fee2e2','#ffedd5','#fef9c3',
  ]
  const cells = []
  for (let row = 2; row >= 0; row--) {
    for (let col = 0; col < 3; col++) {
      const qi = (2 - row) * 3 + col
      const perfZone = perf >= 4 ? 2 : perf >= 3 ? 1 : 0
      const potZone  = pot  >= 4 ? 2 : pot  >= 3 ? 1 : 0
      const isOccupied = perfZone === col && potZone === row
      cells.push(
        <div key={`${row}-${col}`} style={{
          width: 16, height: 16, borderRadius: 3,
          background: colors[qi],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          outline: isOccupied ? '2px solid #f59e0b' : 'none',
          outlineOffset: 1,
        }}>
          {isOccupied && (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
          )}
        </div>
      )
    }
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,16px)', gap: 2 }}>
      {cells}
    </div>
  )
}

export default function HistorialEval({ data, onTabChange, onSelectCollab }) {
  const { collaborators } = data
  const [filterCollab, setFilterCollab] = useState('all')
  const [filterType,   setFilterType]   = useState('all')
  const [filterFrom,   setFilterFrom]   = useState('')
  const [filterTo,     setFilterTo]     = useState('')
  const [expanded,     setExpanded]     = useState(null)

  const allEvals = useMemo(() => {
    const list = []
    collaborators.forEach(c => {
      ;(c.evaluationHistory || []).forEach(ev => {
        list.push({
          ...ev,
          collabId: c.id,
          collabCode: c.code,
          collabPosition: c.currentPosition,
          collabColor: c.colorCode,
        })
      })
    })
    return list.sort((a, b) => b.date.localeCompare(a.date))
  }, [collaborators])

  const filtered = useMemo(() => allEvals.filter(ev => {
    if (filterCollab !== 'all' && ev.collabId !== filterCollab) return false
    if (filterType   !== 'all' && ev.type !== filterType)       return false
    if (filterFrom && ev.date < filterFrom) return false
    if (filterTo   && ev.date > filterTo)   return false
    return true
  }), [allEvals, filterCollab, filterType, filterFrom, filterTo])

  const goToProfile = (collabId) => {
    onSelectCollab?.(collabId)
    onTabChange?.('talent')
  }

  return (
    <div className="page">
      <div className="page-inner">

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
            📋 Historial de Evaluaciones
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
            Registro cronológico de todas las evaluaciones guardadas. Filtra por colaborador, tipo o rango de fechas.
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white', border: '1px solid var(--border)', borderRadius: 10,
          padding: '16px 20px', marginBottom: 20,
          display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
          boxShadow: '0 1px 4px rgba(0,0,0,.04)',
        }}>
          <div style={{ flex: '1 1 160px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .6 }}>Colaborador</div>
            <select
              value={filterCollab}
              onChange={e => setFilterCollab(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, background: 'var(--gray-1)', color: 'var(--text)', cursor: 'pointer' }}
            >
              <option value="all">Todos</option>
              {collaborators.map(c => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1 1 130px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .6 }}>Tipo</div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, background: 'var(--gray-1)', color: 'var(--text)', cursor: 'pointer' }}
            >
              <option value="all">Todos</option>
              <option value="desempeno">Desempeño</option>
              <option value="potencial">Potencial</option>
            </select>
          </div>

          <div style={{ flex: '1 1 130px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .6 }}>Desde</div>
            <input
              type="date" value={filterFrom}
              onChange={e => setFilterFrom(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, background: 'var(--gray-1)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ flex: '1 1 130px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .6 }}>Hasta</div>
            <input
              type="date" value={filterTo}
              onChange={e => setFilterTo(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, background: 'var(--gray-1)', color: 'var(--text)' }}
            />
          </div>

          {(filterCollab !== 'all' || filterType !== 'all' || filterFrom || filterTo) && (
            <button
              onClick={() => { setFilterCollab('all'); setFilterType('all'); setFilterFrom(''); setFilterTo('') }}
              style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--gray-1)', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', alignSelf: 'flex-end' }}
            >
              ✕ Limpiar
            </button>
          )}

          <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            {filtered.length} evaluaci{filtered.length === 1 ? 'ón' : 'ones'}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            background: 'white', border: '1px solid var(--border)', borderRadius: 10,
            padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              {allEvals.length === 0 ? 'Aún no hay evaluaciones guardadas' : 'No hay resultados para este filtro'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {allEvals.length === 0
                ? 'Ve a Marco de Evaluación y guarda la primera evaluación de un colaborador.'
                : 'Ajusta los filtros para ver evaluaciones.'}
            </div>
          </div>
        )}

        {/* Timeline */}
        {filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((ev) => {
              const isOpen   = expanded === ev.id
              const sc       = STATUS_COLOR[ev.readinessStatus] || { bg: '#e4eef9', color: '#1455a0' }
              const avatarBg = COLOR_MAP[ev.collabColor] || 'var(--teal)'
              const typeColor = TYPE_COLOR[ev.type] || '#1455a0'
              const typeBg    = TYPE_BG[ev.type]    || '#e4eef9'

              return (
                <div
                  key={ev.id}
                  style={{
                    background: 'white', border: '1px solid var(--border)',
                    borderRadius: 10, overflow: 'hidden',
                    boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,.07)' : '0 1px 3px rgba(0,0,0,.04)',
                    transition: 'box-shadow .15s',
                  }}
                >
                  {/* Row header */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : ev.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, background: avatarBg, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: 12,
                    }}>
                      {ev.collabId}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{ev.collabCode}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.collabPosition}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: typeBg, color: typeColor }}>
                        {TYPE_LABEL[ev.type] || ev.type}
                      </span>
                      {ev.readinessStatus && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: sc.bg, color: sc.color }}>
                          {ev.readinessStatus}
                        </span>
                      )}
                      {ev.period && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{ev.period}</span>
                      )}
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', minWidth: 76, textAlign: 'right' }}>
                        {ev.date}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                      <NineBoxMini perf={ev.nineBox?.performance || 3} pot={ev.nineBox?.potential || 3} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {[
                        { val: ev.nineBox?.performance, label: 'Desemp.' },
                        { val: ev.nineBox?.potential,   label: 'Potenc.' },
                        { val: ev.readinessPercentage != null ? `${ev.readinessPercentage}%` : null, label: 'Readiness', accent: true },
                      ].map(({ val, label, accent }) => (
                        <div key={label} style={{ textAlign: 'center', minWidth: 44 }}>
                          <div style={{ fontSize: 17, fontWeight: 700, color: accent ? 'var(--teal)' : 'var(--navy)', lineHeight: 1 }}>{val ?? '—'}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                      ▾
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '16px 18px', background: 'var(--gray-1)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>

                        {ev.idpTotal > 0 && (
                          <div style={{ background: 'white', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 8 }}>
                              IDP al momento
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, height: 6, background: 'var(--gray-3)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%',
                                  width: `${Math.round((ev.idpDone / ev.idpTotal) * 100)}%`,
                                  background: 'var(--teal)', borderRadius: 3,
                                }} />
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', flexShrink: 0 }}>
                                {ev.idpDone}/{ev.idpTotal}
                              </div>
                            </div>
                          </div>
                        )}

                        {ev.rubricScores?.scores && Object.keys(ev.rubricScores.scores).length > 0 && (
                          <div style={{ background: 'white', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--border)', gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 10 }}>
                              Puntajes de desempeño
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {Object.entries(ev.rubricScores.scores).map(([dim, score]) => (
                                <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gray-1)', borderRadius: 6, padding: '5px 10px' }}>
                                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{dim.replace(/_/g, ' ')}</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{score}/5</div>
                                </div>
                              ))}
                              {ev.rubricScores.weightedAvg != null && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e4eef9', borderRadius: 6, padding: '5px 10px' }}>
                                  <div style={{ fontSize: 12, color: '#1455a0', fontWeight: 600 }}>Promedio pond.</div>
                                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1455a0' }}>
                                    {Number(ev.rubricScores.weightedAvg).toFixed(2)}
                                  </div>
                                </div>
                              )}
                            </div>
                            {ev.rubricScores.notes && (
                              <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
                                "{ev.rubricScores.notes}"
                              </div>
                            )}
                          </div>
                        )}

                        {ev.potentialScores?.scores && Object.keys(ev.potentialScores.scores).length > 0 && (
                          <div style={{ background: 'white', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--border)', gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 10 }}>
                              Puntajes de potencial
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {Object.entries(ev.potentialScores.scores).map(([dim, score]) => (
                                <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gray-1)', borderRadius: 6, padding: '5px 10px' }}>
                                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{dim.replace(/_/g, ' ')}</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{score}/5</div>
                                </div>
                              ))}
                              {ev.potentialScores.weightedAvg != null && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eceafb', borderRadius: 6, padding: '5px 10px' }}>
                                  <div style={{ fontSize: 12, color: '#4a42b0', fontWeight: 600 }}>Promedio pond.</div>
                                  <div style={{ fontSize: 13, fontWeight: 800, color: '#4a42b0' }}>
                                    {Number(ev.potentialScores.weightedAvg).toFixed(2)}
                                  </div>
                                </div>
                              )}
                            </div>
                            {ev.potentialScores.notes && (
                              <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
                                "{ev.potentialScores.notes}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => goToProfile(ev.collabId)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '8px 16px', borderRadius: 7, border: 'none',
                          background: 'var(--navy)', color: 'white',
                          fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        👤 Ver perfil de {ev.collabCode} →
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
