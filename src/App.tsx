import { useState } from 'react'
import './App.css'
import Pipeline from './components/Pipeline'
import DetailPanel from './components/DetailPanel'
import SidePanel from './components/SidePanel'
import { stages } from './data/stages'

type PanelId = 'rules' | 'pain' | 'appendix' | null

export default function App() {
  const [activeStage, setActiveStage] = useState(0)
  const [activePanel, setActivePanel] = useState<PanelId>(null)

  const handlePipelineClick = (index: number) => {
    setActiveStage(index)
  }

  const handlePanelToggle = (panel: PanelId) => {
    setActivePanel(panel)
  }

  const handlePanelClose = () => {
    setActivePanel(null)
  }

  return (
    <>
      <SidePanel
        activePanel={activePanel}
        onToggle={handlePanelToggle}
        onClose={handlePanelClose}
      />

      <div className="wrap">
        <h1>BCCS Dev-to-Deploy SOP</h1>
        <div className="sub">v1.1 | March 2026</div>

        <Pipeline activeIndex={activeStage} onClick={handlePipelineClick} />

        <DetailPanel key={activeStage} stage={stages[activeStage]} />

        <div className="foot">BCCS Dev-to-Deploy SOP v1.1 | March 2026</div>
      </div>
    </>
  )
}
