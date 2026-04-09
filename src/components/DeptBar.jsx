import { useState } from 'react'

const ICONS = ['📊','💼','🏥','⚙️','🧾','📋','🧑‍💻','🏢','🔬','📈','💰','🤝']

export default function DeptBar({ departments, activeDeptId, onDeptChange, onAddDept, onRenameDept, onDeleteDept, adminMode }) {
  const [adding,    setAdding]    = useState(false)
  const [newName,   setNewName]   = useState('')
  const [newIcon,   setNewIcon]   = useState('🏢')
  const [renaming,  setRenaming]  = useState(null) // dept id being renamed
  const [renameVal, setRenameVal] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    onAddDept(newName.trim(), newIcon)
    setNewName(''); setNewIcon('🏢'); setAdding(false)
  }

  const handleRename = (id) => {
    if (!renameVal.trim()) { setRenaming(null); return }
    onRenameDept(id, renameVal.trim())
    setRenaming(null)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4, padding: '0 16px',
      background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,.08)',
      height: 44, flexShrink: 0, overflowX: 'auto',
    }}>
      {/* Plan General */}
      <button
        onClick={() => onDeptChange('general')}
        style={{
          padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
          background: activeDeptId === 'general' ? 'rgba(255,255,255,.15)' : 'transparent',
          color: activeDeptId === 'general' ? 'white' : 'rgba(255,255,255,.55)',
          transition: 'all .15s',
        }}
      >
        🗂️ Plan General
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', flexShrink: 0, margin: '0 4px' }} />

      {/* Department tabs */}
      {departments.map(dept => (
        <div key={dept.id} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {renaming === dept.id ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                autoFocus
                value={renameVal}
                onChange={e => setRenameVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(dept.id); if (e.key === 'Escape') setRenaming(null) }}
                style={{ fontSize: 12, padding: '3px 8px', borderRadius: 5, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)', color: 'white', width: 140, outline: 'none' }}
              />
              <button onClick={() => handleRename(dept.id)} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer' }}>✓</button>
              <button onClick={() => setRenaming(null)} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, border: 'none', background: 'rgba(255,255,255,.15)', color: 'white', cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onDeptChange(dept.id)}
                style={{
                  padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                  background: activeDeptId === dept.id ? 'rgba(255,255,255,.15)' : 'transparent',
                  color: activeDeptId === dept.id ? 'white' : 'rgba(255,255,255,.55)',
                  transition: 'all .15s',
                }}
              >
                {dept.icon} {dept.name}
              </button>
              {adminMode && activeDeptId === dept.id && (
                <div style={{ display: 'flex', gap: 2 }}>
                  <button
                    onClick={() => { setRenaming(dept.id); setRenameVal(dept.name) }}
                    title="Renombrar"
                    style={{ fontSize: 11, padding: '2px 5px', borderRadius: 4, border: 'none', background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', cursor: 'pointer' }}
                  >✏️</button>
                  {dept.id !== 'bi' && (
                    <button
                      onClick={() => onDeleteDept(dept.id)}
                      title="Eliminar departamento"
                      style={{ fontSize: 11, padding: '2px 5px', borderRadius: 4, border: 'none', background: 'rgba(239,68,68,.2)', color: '#fca5a5', cursor: 'pointer' }}
                    >🗑</button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* Add department */}
      {adminMode && !adding && (
        <button
          onClick={() => setAdding(true)}
          style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px dashed rgba(255,255,255,.3)', background: 'transparent', color: 'rgba(255,255,255,.5)', whiteSpace: 'nowrap', marginLeft: 4, transition: 'all .15s' }}
        >
          + Nuevo departamento
        </button>
      )}

      {adding && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          <select
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
            style={{ fontSize: 16, padding: '3px 6px', borderRadius: 5, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)', color: 'white', cursor: 'pointer' }}
          >
            {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setNewName('') } }}
            placeholder="Nombre del departamento..."
            style={{ fontSize: 12, padding: '4px 10px', borderRadius: 5, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)', color: 'white', outline: 'none', width: 200 }}
          />
          <button onClick={handleAdd} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 5, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Agregar</button>
          <button onClick={() => { setAdding(false); setNewName('') }} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 5, border: 'none', background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', cursor: 'pointer' }}>Cancelar</button>
        </div>
      )}
    </div>
  )
}
