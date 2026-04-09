export const GROUPS = [
  {
    id: 'resumen',
    label: 'Panel Principal',
    icon: '🏠',
    tabs: [{ id: 'home', label: 'Panel Principal', icon: '🏠' }],
  },
  {
    id: 'evaluacion',
    label: 'Área de Evaluación',
    icon: '👥',
    tabs: [
      { id: 'talentcard', label: 'Nueva Talent Card',         icon: '➕' },
      { id: 'rubricas',   label: 'Marco de Evaluación',      icon: '📐' },
      { id: 'talent',     label: 'Perfiles del Equipo',      icon: '👤' },
      { id: 'historial',  label: 'Historial de Evaluaciones', icon: '📋' },
    ],
  },
  {
    id: 'diagnostico',
    label: 'Análisis del Pipeline',
    icon: '📊',
    tabs: [
      { id: 'desarrollo', label: 'Centro de Desarrollo', icon: '📈' },
      { id: 'calidad',    label: 'Tablero Estratégico',  icon: '📊' },
      { id: 'basedatos',  label: 'Base de Datos',        icon: '🗄️' },
      { id: 'roi',        label: 'ROI del Plan',         icon: '💰' },
    ],
  },
  {
    id: 'cultura',
    label: 'Salud Organizacional',
    icon: '❤️',
    tabs: [
      { id: 'valores',   label: 'Marco de Valores',        icon: '🧭' },
      { id: 'clima',     label: 'Evaluación de Clima',     icon: '🌡️' },
      { id: 'liderazgo', label: 'Evaluación de Liderazgo', icon: '⭐' },
    ],
  },
  {
    id: 'feedback',
    label: 'Buzón de Feedback',
    icon: '💬',
    tabs: [{ id: 'feedback', label: 'Buzón de Feedback', icon: '💬' }],
  },
  {
    id: 'referencias',
    label: 'Referencias',
    icon: '📚',
    tabs: [{ id: 'referencias', label: 'Referencias', icon: '📚' }],
  },
]

export default function TabBar({ activeTab, onTabChange }) {
  const activeGroup = GROUPS.find(g => g.tabs.some(t => t.id === activeTab)) || GROUPS[0]

  return (
    <>
      {/* ── Level 1: Groups ── */}
      <div className="tab-bar">
        {GROUPS.map(g => (
          <div
            key={g.id}
            className={`tab ${activeGroup.id === g.id ? 'active' : ''}`}
            onClick={() => onTabChange(g.tabs[0].id)}
          >
            <div className="tab-icon">{g.icon}</div>
            {g.label}
          </div>
        ))}
      </div>

      {/* ── Level 2: Sub-tabs (only when group has multiple tabs) ── */}
      {activeGroup.tabs.length > 1 && (
        <div className="sub-tab-bar">
          {activeGroup.tabs.map(t => (
            <div
              key={t.id}
              className={`sub-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => onTabChange(t.id)}
            >
              <div className="sub-tab-icon">{t.icon}</div>
              {t.label}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
