import { useState } from 'react'
import { useData } from './hooks/useData'
import Shell from './components/Shell'
import TabBar, { GROUPS } from './components/TabBar'
import DeptBar from './components/DeptBar'
import StatusBar from './components/StatusBar'
import Home from './pages/Home'
import Valores from './pages/Valores'
import TalentCard from './pages/TalentCard'
import TalentCardForm from './pages/TalentCardForm'
import Rubricas from './pages/Rubricas'
import FeedbackBox from './pages/FeedbackBox'
import BancaTalento from './pages/BancaTalento'
import Calidad from './pages/Calidad'
import ClimaLaboral from './pages/ClimaLaboral'
import EvalLiderazgo from './pages/EvalLiderazgo'
import Desarrollo from './pages/Desarrollo'
import Guia from './pages/Guia'
import PlanGeneral from './pages/PlanGeneral'
import Referencias   from './pages/Referencias'
import HistorialEval from './pages/HistorialEval'
import ROI          from './pages/ROI'
import BaseDatos    from './pages/BaseDatos'

// Flat ordered list of all tabs (derived from GROUPS)
const TAB_ORDER = GROUPS.flatMap(g => g.tabs)

export default function App() {
  const [activeTab,      setActiveTab]      = useState('home')
  const [adminMode,      setAdminMode]      = useState(false)
  const [activeDeptView, setActiveDeptView] = useState('bi')
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [guiaOpen,       setGuiaOpen]       = useState(false)

  const {
    departments, activeDeptId, setActiveDeptId,
    deptDataMap, addDepartment, renameDepartment, deleteDepartment,
    pendingDelete, undoDelete, confirmDelete,
    data, updateCollaborator, addCollaborator, updateHeatmap,
    updateRubricEvaluation, importData, resetData,
  } = useData()

  const handleDeptChange = (deptId) => {
    setActiveDeptView(deptId)
    if (deptId !== 'general') {
      setActiveDeptId(deptId)
      // stay on same tab group when switching depts
    }
  }

  const pageProps = {
    data, adminMode, updateCollaborator, addCollaborator,
    updateHeatmap, updateRubricEvaluation,
    selectedCollab,
    onSelectCollab: setSelectedCollab,
    onTabChange: setActiveTab,
  }

  const renderPage = () => {
    if (activeDeptView === 'general') {
      return (
        <PlanGeneral
          departments={departments}
          deptDataMap={deptDataMap}
          onDeptChange={handleDeptChange}
        />
      )
    }
    switch (activeTab) {
      case 'home':       return <Home         {...pageProps} />
      case 'valores':    return <Valores       {...pageProps} />
      case 'rubricas':   return <Rubricas      {...pageProps} />
      case 'talentcard': return <TalentCardForm {...pageProps} />
      case 'talent':     return <TalentCard    {...pageProps} />
      case 'banca':      return <BancaTalento  {...pageProps} />
      case 'calidad':    return <Calidad       {...pageProps} />
      case 'clima':      return <ClimaLaboral  {...pageProps} />
      case 'liderazgo':  return <EvalLiderazgo {...pageProps} />
      case 'desarrollo': return <Desarrollo    {...pageProps} />
      case 'feedback':    return <FeedbackBox   {...pageProps} />
      case 'historial':   return <HistorialEval  {...pageProps} />
      case 'roi':         return <ROI />
      case 'basedatos':   return <BaseDatos {...pageProps} />
      case 'referencias': return <Referencias />
      default:            return <Home          {...pageProps} />
    }
  }

  const activeDept = departments.find(d => d.id === activeDeptId)

  return (
    <div className="app-layout">
      <Shell
        meta={data.meta}
        deptName={activeDept?.name}
        adminMode={adminMode}
        onAdminToggle={() => setAdminMode(a => !a)}
        data={data}
        onImport={importData}
        onReset={resetData}
        onGuiaOpen={() => setGuiaOpen(true)}
      />
      <DeptBar
        departments={departments}
        activeDeptId={activeDeptView}
        onDeptChange={handleDeptChange}
        onAddDept={addDepartment}
        onRenameDept={renameDepartment}
        onDeleteDept={deleteDepartment}
        adminMode={adminMode}
      />
      {activeDeptView !== 'general' && (
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      <div className="content-area">
        <div className="page">
          {renderPage()}
        </div>
        {activeDeptView !== 'general' && (
          <NextTabButton
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
      <StatusBar data={data} adminMode={adminMode} />

      {/* Undo toast */}
      {pendingDelete && (
        <UndoToast dept={pendingDelete.dept} onUndo={undoDelete} onDismiss={confirmDelete} />
      )}

      {/* Guía de Uso slide-over panel */}
      {guiaOpen && (
        <>
          <div
            onClick={() => setGuiaOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
              zIndex: 1000, backdropFilter: 'blur(2px)',
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(680px, 95vw)',
            background: 'white', zIndex: 1001, overflowY: 'auto',
            boxShadow: '-8px 0 40px rgba(0,0,0,.2)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid #e2e8f0',
              background: 'var(--navy)', color: 'white', flexShrink: 0,
            }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>📖 Guía de Uso del Portal</div>
              <button
                onClick={() => setGuiaOpen(false)}
                style={{
                  background: 'rgba(255,255,255,.1)', border: 'none', color: 'white',
                  borderRadius: 8, width: 34, height: 34, fontSize: 16, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Guia />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function NextTabButton({ activeTab, onTabChange }) {
  const currentIndex = TAB_ORDER.findIndex(t => t.id === activeTab)
  if (currentIndex === -1) return null

  const isLast = currentIndex === TAB_ORDER.length - 1
  const next   = isLast ? null : TAB_ORDER[currentIndex + 1]

  const handleClick = () => {
    if (next) onTabChange(next.id)
  }

  return (
    <button
      onClick={isLast ? undefined : handleClick}
      title={isLast ? 'Plan completado' : `Ir a: ${next.label}`}
      style={{
        position: 'absolute',
        bottom: 28,
        right: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '11px 22px',
        borderRadius: 10,
        border: 'none',
        cursor: isLast ? 'default' : 'pointer',
        background: isLast
          ? 'linear-gradient(135deg, #1D9E75 0%, #0d7a5a 100%)'
          : 'linear-gradient(135deg, #1455a0 0%, #0d3d7a 100%)',
        color: 'white',
        fontSize: 13.5,
        fontWeight: 700,
        letterSpacing: .2,
        boxShadow: isLast
          ? '0 4px 16px rgba(29,158,117,.45)'
          : '0 4px 16px rgba(20,85,160,.40)',
        transition: 'opacity .15s, box-shadow .15s, transform .15s',
        zIndex: 200,
        fontFamily: 'Inter, sans-serif',
      }}
      onMouseEnter={e => {
        if (!isLast) {
          e.currentTarget.style.opacity = '.88'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(20,85,160,.50)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = isLast
          ? '0 4px 16px rgba(29,158,117,.45)'
          : '0 4px 16px rgba(20,85,160,.40)'
      }}
    >
      {isLast ? (
        <>
          <span style={{ fontSize: 15 }}>✓</span>
          Plan completado
        </>
      ) : (
        <>
          {next.label}
          <span style={{ fontSize: 16, opacity: .85 }}>→</span>
        </>
      )}
    </button>
  )
}

function UndoToast({ dept, onUndo, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--navy)', color: 'white', borderRadius: 12,
      padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,.35)', zIndex: 9999,
      animation: 'slideUp .25s ease',
      fontSize: 14, whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 18 }}>{dept.icon}</span>
      <span>Departamento <strong>"{dept.name}"</strong> eliminado</span>
      <button
        onClick={onUndo}
        style={{
          background: 'var(--teal)', color: 'white', border: 'none',
          borderRadius: 8, padding: '7px 16px', fontWeight: 700,
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ↩ Deshacer
      </button>
      <button
        onClick={onDismiss}
        title="Descartar"
        style={{
          background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', border: 'none',
          borderRadius: 6, width: 28, height: 28, fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >✕</button>
    </div>
  )
}
