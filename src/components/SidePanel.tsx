import { useState } from 'react'
import { painPointsData, appendixData } from '../data/panels'
import type { PainPointSection, AppendixSection } from '../data/panels'

type PanelId = 'rules' | 'pain' | 'appendix' | 'flowchart' | null

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

  if (section.kind === 'port-mgmt') {
    return (
      <CollapsibleSection heading={section.heading}>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>{section.note}</p>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>管理規則</div>
        <ul style={{ listStyle: 'none', margin: '0 0 12px', fontSize: 12, color: '#666' }}>
          {section.rules.map((rule) => (
            <li key={rule} style={{ padding: '3px 0 3px 14px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>{rule}
            </li>
          ))}
        </ul>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Port 對照表（範例）</div>
        <table className="tbl">
          <thead><tr><th>系統</th><th>環境</th><th>Port</th><th>配發</th></tr></thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr key={i}>
                <td>{row.system}</td>
                <td>{row.env}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{row.port}</td>
                <td><span className="b">{row.assignedBy}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>
    )
  }

  return null
}

type FAQ = {
  q: string
  a: string
}

const faqs: FAQ[] = [
  { q: 'DB 是官方 Image，app 的 migration 怎麼改 DB？', a: 'app 容器透過 DB 連線執行 SQL 指令修改 schema，跟用 SSMS 連 DB 一樣。一容器一行程不影響，業界標準做法。' },
  { q: 'Migration script 打包在 Image 裡就會自動跑嗎？', a: '不會。需要觸發機制：Dev 用 Entrypoint（容器啟動自動跑），Staging/Prod 用 Pipeline step（部署前先跑，失敗不繼續）。' },
  { q: 'Volume 內容變更時自動部署改不到？', a: 'DB schema 變更透過 Migration 處理（可自動化）。上傳檔案類 Volume 各環境各自維護，不在自動部署範圍，有變更須列交付物。' },
  { q: '環境變數新增了但伺服器沒更新？', a: 'RD 交付時附「環境變數異動清單」，MIS 手動更新。自動部署不會同步 .env。' },
  { q: 'IIS 需要停機才能更新嗎？', a: '不需要。IIS 支援 Overlapped Recycling。用 MSDeploy 或 robocopy 部署，App Pool 自動 recycle。' },
  { q: '.NET DLL 被鎖定無法覆蓋？', a: 'MSDeploy 會自動處理 App Pool 停止/啟動。或在 Pipeline 先停 App Pool 再部署再啟動。' },
  { q: 'web.config 被覆蓋怎麼辦？', a: 'web.config 加入 .gitignore，改用環境變數或 appsettings.{env}.json 管理各環境差異。' },
  { q: '舊 Docker Image 會塞滿磁碟嗎？', a: 'Pipeline 最後加 docker image prune -f 清理。MIS 監控磁碟使用率 > 85% 告警。' },
  { q: 'Health Check 回 200 就代表正常嗎？', a: '不夠。HC endpoint 要驗 DB 連線 + 關鍵 API 可回應，不只是回 200。' },
  { q: 'Runner 是什麼？', a: '安裝在內網 VM 上的背景服務，主動向 GitHub poll CI/CD 任務。MIS 安裝一次，之後 RD push 就自動跑。不需開 inbound port。' },
]

function FAQPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="rules-panel open">
      <div className="rules-panel-header">
        <h3>常見問題</h3>
        <button className="rules-panel-close" onClick={onClose}>x</button>
      </div>
      <div style={{ overflowY: 'auto', padding: '0 20px' }}>
        {faqs.map((faq) => (
          <div key={faq.q} className="flow-faq">
            <div className="flow-faq-q">{faq.q}</div>
            <div className="flow-faq-a">{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AppendixPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="rules-panel open" id="appendixPanel">
      <div className="rules-panel-header">
        <h3>關鍵規則</h3>
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
          onClick={() => onToggle(activePanel === 'flowchart' ? null : 'flowchart')}
        >
          常見問題
        </div>
        <div
          className="side-toggle"
          onClick={() => onToggle(activePanel === 'appendix' ? null : 'appendix')}
        >
          關鍵規則
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
      {activePanel === 'flowchart' && <FAQPanel onClose={onClose} />}
    </>
  )
}
