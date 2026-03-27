const TABS = [
  { id: 'home',       label: 'Resumen del Plan',      icon: 'H'  },
  { id: 'valores',     label: 'Guía de Valores',        icon: 'V'  },
  { id: 'rubricas',   label: 'Rúbricas',              icon: '📐' },
  { id: 'talentcard', label: 'Talent Card',            icon: 'TC' },
  { id: 'talent',     label: 'Perfiles & IDP',         icon: 'PP' },
  { id: 'banca',      label: 'Banca de Talento',       icon: 'BT' },
  { id: 'calidad',    label: 'Análisis de Calidad',    icon: 'CA' },
  { id: 'feedback',   label: 'Buzón de Feedback',      icon: '📬' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="tab-bar">
      {TABS.map(t => (
        <div
          key={t.id}
          className={`tab ${activeTab === t.id ? 'active' : ''}`}
          onClick={() => onTabChange(t.id)}
        >
          <div className="tab-icon">{t.icon}</div>
          {t.label}
        </div>
      ))}
    </div>
  )
}
