import { useRef } from 'react'
import { exportJSON, importJSON, exportFullPDF, exportDocx } from '../utils/exports'

export default function Shell({ meta, deptName, adminMode, onAdminToggle, data, onImport, onReset, onGuiaOpen }) {
  const fileRef = useRef()

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) importJSON(file, onImport)
    e.target.value = ''
  }

  return (
    <div className="shell">
      <div className="logo-ring">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5">
          <circle cx="12" cy="12" r="8"/>
          <path d="M8 12h8M12 8l4 4-4 4"/>
        </svg>
      </div>
      <div>
        <div className="logo-text">Plan de Sucesión</div>
      </div>
      <div className="shell-div"/>
      <div className="shell-title">Plan de Sucesión {deptName ? `— ${deptName}` : ''}</div>
      <div className="shell-badge">{meta.period}</div>

      <div className="shell-actions">
        <button className={`btn btn-admin ${adminMode ? 'active' : ''}`} onClick={onAdminToggle}>
          {adminMode ? '✏️ Modo HR activo' : '⚙️ Modo HR'}
        </button>
        <div className="shell-div"/>
        <button className="btn btn-ghost" onClick={() => exportJSON(data)} title="Exportar datos como JSON">
          ↓ JSON
        </button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        <button className="btn btn-ghost" onClick={() => fileRef.current.click()} title="Importar datos desde JSON">
          ↑ Importar
        </button>
        <button className="btn btn-ghost" onClick={() => exportFullPDF(data)} title="Exportar plan completo como PDF">
          ↓ PDF
        </button>
        <button className="btn btn-ghost" onClick={() => exportDocx(data)} title="Exportar plan completo como Word">
          ↓ Word
        </button>
        {onReset && (
          <button className="btn btn-ghost" onClick={onReset} title="Resetear datos del departamento activo" style={{ color: '#fca5a5' }}>
            ⚠️ Reset
          </button>
        )}
        <div className="shell-div"/>
        <button
          className="btn btn-ghost"
          onClick={onGuiaOpen}
          title="Guía de uso del portal"
          style={{ fontWeight: 700, fontSize: 15, padding: '6px 12px', borderRadius: '50%', minWidth: 34, minHeight: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >?</button>
      </div>
    </div>
  )
}
