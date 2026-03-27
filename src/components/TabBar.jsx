const GROUPS = [
  {
    id: 'resumen',
    label: 'Resumen',
    icon: '🏠',
    tabs: [{ id: 'home', label: 'Resumen del Plan', icon: 'H' }],
  },
  {
    id: 'evaluacion',
    label: 'Evaluación',
    icon: '📋',
    tabs: [
      { id: 'talentcard', label: 'Talent Card',    icon: 'TC' },
      { id: 'rubricas',   label: 'Rúbricas',       icon: '📐' },
      { id: 'talent',     label: 'Perfiles & IDP', icon: 'PP' },
    ],
  },
  {
    id: 'diagnostico',
    label: 'Diagnóstico',
    icon: '🔍',
    tabs: [
      { id: 'banca',   label: 'Banca de Talento',    icon: 'BT' },
      { id: 'calidad', label: 'Análisis de Calidad', icon: 'CA' },
    ],
  },
  {
    id: 'cultura',
    label: 'Cultura & Valores',
    icon: '🧭',
    tabs: [{ id: 'valores', label: 'Guía de Valores', icon: 'V' }],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: '📬',
    tabs: [{ id: 'feedback', label: 'Buzón de Feedback', icon: '📬' }],
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
