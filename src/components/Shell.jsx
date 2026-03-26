import { useRef } from 'react'
import { exportJSON, importJSON, exportFullPDF, exportDocx } from '../utils/exports'

export default function Shell({ meta, adminMode, onAdminToggle, data, onImport }) {
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
        <div className="logo-text">Provider Network Solutions</div>
        <div className="logo-sub">Puerto Rico</div>
      </div>
      <div className="shell-div"/>
      <div className="shell-title">Plan de Sucesión — {meta.department}</div>
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
      </div>
    </div>
  )
}
