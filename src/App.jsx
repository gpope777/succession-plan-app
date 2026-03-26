import { useState } from 'react'
import { useData } from './hooks/useData'
import Shell from './components/Shell'
import TabBar from './components/TabBar'
import StatusBar from './components/StatusBar'
import Home from './pages/Home'
import Valores from './pages/Valores'
import Marco from './pages/Marco'
import HPO from './pages/HPO'
import TalentCard from './pages/TalentCard'
import TalentCardForm from './pages/TalentCardForm'
import BancaTalento from './pages/BancaTalento'
import Calidad from './pages/Calidad'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [adminMode, setAdminMode] = useState(false)
  const { data, updateCollaborator, addCollaborator, importData, resetData } = useData()

  const pageProps = { data, adminMode, updateCollaborator, addCollaborator, onTabChange: setActiveTab }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':    return <Home    {...pageProps} />
      case 'valores': return <Valores {...pageProps} />
      case 'marco':   return <Marco   {...pageProps} />
      case 'hpo':     return <HPO     {...pageProps} />
      case 'talentcard': return <TalentCardForm {...pageProps} />
      case 'talent':     return <TalentCard {...pageProps} />
      case 'banca':   return <BancaTalento {...pageProps} />
      case 'calidad': return <Calidad {...pageProps} />
      default:        return <Home    {...pageProps} />
    }
  }

  return (
    <div className="app-layout">
      <Shell
        meta={data.meta}
        adminMode={adminMode}
        onAdminToggle={() => setAdminMode(a => !a)}
        data={data}
        onImport={importData}
        onReset={resetData}
      />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="content-area">
        {renderPage()}
      </div>
      <StatusBar data={data} adminMode={adminMode} />
    </div>
  )
}
