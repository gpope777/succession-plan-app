export default function StatusBar({ data, adminMode }) {
  const readyNow  = data.collaborators.filter(c => c.readinessStatus === 'Listo ahora').length
  const readySoon = data.collaborators.filter(c => c.readinessStatus === 'Listo pronto').length

  return (
    <div className="status-bar">
      <div className="si"><div className="sdot" style={{ background: 'var(--teal)' }} />Plan de Sucesión activo</div>
      <div className="si"><div className="sdot" style={{ background: 'var(--amber)' }} />{data.collaborators.length} colaboradores evaluados</div>
      {readyNow > 0 && <div className="si"><div className="sdot" style={{ background: 'var(--teal)' }} />{readyNow} listo(s) ahora</div>}
      <div className="si"><div className="sdot" style={{ background: 'var(--blue)' }} />Próxima revisión: {data.meta.nextReview}</div>
      {adminMode && <div className="si"><div className="sdot" style={{ background: 'var(--purple)' }} />Modo HR activo</div>}
      <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>
        People Operations · Confidencial
      </div>
    </div>
  )
}
