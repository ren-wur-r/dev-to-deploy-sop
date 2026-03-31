import { useState } from 'react'
import { painPointsData, appendixData } from '../data/panels'
import type { PainPointSection, AppendixSection } from '../data/panels'

type PanelId = 'rules' | 'pain' | 'appendix' | null

type Props = {
  activePanel: PanelId
  onToggle: (panel: PanelId) => void
  onClose: () => void
}

function CollapsibleSection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="sp-section">
      <div
        className={`sp-head${open ? ' sp-open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {heading}
        <span className="sp-arrow">&#9654;</span>
      </div>
      {open && <div className="sp-body open">{children}</div>}
    </div>
  )
}


function PainSection({ section }: { section: PainPointSection }) {
  if (section.kind === 'items') {
    return (
      <CollapsibleSection heading={section.heading}>
        {section.items.map((item) => (
          <div className="pain-item" key={item.title}>
            <div className="pain-item-title">{item.title}</div>
            <div className="pain-item-desc">{item.desc}</div>
          </div>
        ))}
      </CollapsibleSection>
    )
  }

  if (section.kind === 'solutions') {
    return (
      <CollapsibleSection heading={section.heading}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {section.solutions.map((s) => (
            <div
              key={s.title}
              style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}
            >
              <strong style={{ color: '#222' }}>{s.title}</strong> — {s.desc}
            </div>
          ))}
        </div>
      </CollapsibleSection>
    )
  }

  if (section.kind === 'legacy-new') {
    return (
      <CollapsibleSection heading={section.heading}>
        <div className="legacy-new-section">
          <div className="legacy-new-title">{section.legacy.heading}</div>
          <ul className="legacy-new-list">
            {section.legacy.items.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          {section.legacy.note && (
            <p className="legacy-new-note">{section.legacy.note}</p>
          )}
        </div>
        <div className="legacy-new-section">
          <div className="legacy-new-title">{section.newSys.heading}</div>
          <ul className="legacy-new-list">
            {section.newSys.items.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </CollapsibleSection>
    )
  }

  return null
}

function PainPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="rules-panel open" id="painPanel">
      <div className="rules-panel-header">
        <h3>現況痛點</h3>
        <button className="rules-panel-close" onClick={onClose}>
          x
        </button>
      </div>
      <div style={{ overflowY: 'auto', padding: 0 }}>
        {painPointsData.map((section) => (
          <PainSection key={section.heading} section={section} />
        ))}
      </div>
    </div>
  )
}

function AppendixSectionComponent({ section }: { section: AppendixSection }) {
  if (section.kind === 'network') {
    return (
      <CollapsibleSection heading={section.heading}>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
          {section.note}
        </p>
        <table className="tbl">
          <thead>
            <tr>
              <th>項目</th>
              <th>標準</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.item}>
                <td>{row.item}</td>
                <td>{row.standard}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '12px', fontWeight: 600, margin: '12px 0 6px' }}>
          {section.rdHeading}
        </p>
        <table className="tbl">
          <thead>
            <tr>
              <th>項目</th>
              <th>範例</th>
            </tr>
          </thead>
          <tbody>
            {section.rdRows.map((row) => (
              <tr key={row.item}>
                <td>{row.item}</td>
                <td className="mono">{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>
    )
  }

  if (section.kind === 'monitoring') {
    return (
      <CollapsibleSection heading={section.heading}>
        <table className="tbl">
          <thead>
            <tr>
              <th>類別</th>
              <th>指標</th>
              <th>閾值</th>
              <th>On-Call</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr key={i}>
                <td>{row.category}</td>
                <td>{row.metric}</td>
                <td>{row.threshold}</td>
                <td>
                  {row.oncall.map((o) => (
                    <span key={o} className="b" style={{ marginRight: '2px' }}>
                      {o}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>
    )
  }

  if (section.kind === 'backup') {
    return (
      <CollapsibleSection heading={section.heading}>
        <table className="tbl">
          <thead>
            <tr>
              <th>類型</th>
              <th>頻率</th>
              <th>保留</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.type}>
                <td>{row.type}</td>
                <td>{row.frequency}</td>
                <td>{row.retention}</td>
                <td className="mono">{row.sla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>
    )
  }

  if (section.kind === 'legacy-new') {
    return (
      <CollapsibleSection heading={section.heading}>
        <div className="legacy-new-section">
          <div className="legacy-new-title">{section.legacy.heading}</div>
          <ul className="legacy-new-list">
            {section.legacy.items.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          {section.legacy.note && (
            <p className="legacy-new-note">{section.legacy.note}</p>
          )}
        </div>
        <div className="legacy-new-section" style={{ marginTop: '12px' }}>
          <div className="legacy-new-title">{section.newSys.heading}</div>
          <ul className="legacy-new-list">
            {section.newSys.items.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </CollapsibleSection>
    )
  }

  return null
}

function AppendixPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="rules-panel open" id="appendixPanel">
      <div className="rules-panel-header">
        <h3>大原則</h3>
        <button className="rules-panel-close" onClick={onClose}>
          x
        </button>
      </div>
      <div style={{ overflowY: 'auto', padding: 0 }}>
        {appendixData.map((section) => (
          <AppendixSectionComponent key={section.heading} section={section} />
        ))}
      </div>
    </div>
  )
}

export default function SidePanel({ activePanel, onToggle, onClose }: Props) {
  return (
    <>
      <div className="side-toggles">
        <div
          className="side-toggle"
          onClick={() => onToggle(activePanel === 'appendix' ? null : 'appendix')}
        >
          大原則
        </div>
        <div
          className="side-toggle"
          onClick={() => onToggle(activePanel === 'pain' ? null : 'pain')}
        >
          現況痛點
        </div>
      </div>

      <div
        className={`rules-overlay${activePanel !== null ? ' open' : ''}`}
        onClick={onClose}
      />

      {activePanel === 'pain' && <PainPanel onClose={onClose} />}
      {activePanel === 'appendix' && <AppendixPanel onClose={onClose} />}
    </>
  )
}
