import { useState } from 'react'
import type {
  Stage,
  Tab,
  TabContent,
  Step,
  StepDetail,
  Branch,
  CommitType,
  DockerStep,
  DeliverableRow,
  CIRow,
  ChecklistRow,
  OWASPRow,
  SeverityRow,
  HotfixRow,
} from '../data/stages'

type Props = {
  stage: Stage
}

function Badge({ label }: { label: string }) {
  return <span className="b">{label}</span>
}

function StepDetailPanel({ detail }: { detail: StepDetail }) {
  return (
    <div className="step-detail-panel">
      {detail.sections.map((sec) => (
        <div key={sec.heading} style={{ marginBottom: 12 }}>
          <strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>{sec.heading}</strong>
          <ul style={{ listStyle: 'none', margin: 0, fontSize: 12, color: '#666' }}>
            {sec.items.map((item) => (
              <li key={item} style={{ padding: '2px 0 2px 12px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>-</span> {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {detail.autoTable && (
        <div style={{ marginTop: 16 }}>
          <strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>自動化驗收分工</strong>
          <table className="tbl">
            <thead><tr><th>驗收類型</th><th>執行者</th><th>方式</th></tr></thead>
            <tbody>
              {detail.autoTable.map((row) => (
                <tr key={row.type}>
                  <td>{row.type}</td>
                  <td><span className="b">{row.who}</span></td>
                  <td>{row.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {detail.notes && (
        <div className="note" style={{ marginTop: 12 }}>
          {detail.notes.map((n, i) => (
            <div key={i} style={{ fontSize: 12, color: '#666', padding: '2px 0' }}>{n}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function StepFlow({ steps }: { steps: Step[] }) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  return (
    <div className="steps">
      {steps.map((step, i) => (
        <div className="st" key={i}>
          {i < steps.length - 1 && <div className="st-line" />}
          <div>
            <h4>
              {step.title}
              {step.badges.map((b) => (
                <Badge key={b} label={b} />
              ))}
              {step.detail && (
                <span
                  className="step-example-btn"
                  onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                >
                  {expandedStep === i ? '收合' : '查看範例'}
                </span>
              )}
            </h4>
            {step.desc && <p>{step.desc}</p>}
            {step.detail && expandedStep === i && (
              <StepDetailPanel detail={step.detail} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function GitTab({ branches, commitTypes }: { branches: Branch[]; commitTypes: CommitType[] }) {
  const [activeTip, setActiveTip] = useState<CommitType | null>(null)

  const handleCommitClick = (ct: CommitType, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveTip(activeTip?.type === ct.type ? null : ct)
  }

  const handleDocClick = () => {
    setActiveTip(null)
  }

  return (
    <div onClick={handleDocClick}>
      <div className="branch-container">
        {branches.map((br) => (
          <div className="br" key={br.name}>
            <div className="br-dot" style={{ background: br.color }} />
            <div className="br-name">{br.name}</div>
            <div className="br-env">{br.env}</div>
            <div>{br.desc}</div>
          </div>
        ))}
      </div>

      <h4 className="git-sub-heading">Commit 規範</h4>
      <div className="code">{'<type>(<scope>): <description>'}</div>
      <p className="git-hint">點擊 type 查看說明，點擊其他地方關閉</p>

      <div className="commit-types-row">
        {commitTypes.map((ct) => (
          <span
            key={ct.type}
            className={`commit-type${activeTip?.type === ct.type ? ' active' : ''}`}
            onClick={(e) => handleCommitClick(ct, e)}
          >
            {ct.type}
          </span>
        ))}
      </div>

      {activeTip && (
        <div className="tip-box" onClick={(e) => e.stopPropagation()}>
          <div className="tip-type">{activeTip.type}</div>
          <div className="tip-desc">{activeTip.desc}</div>
          <div className="tip-ex">{activeTip.example}</div>
        </div>
      )}
    </div>
  )
}

function DockerTab({
  overview,
  steps,
  imageName,
  imageNaming,
}: {
  overview: { label: string; sub: string }[]
  steps: DockerStep[]
  imageName: string
  imageNaming: { branch: string; tag: string; example: string }[]
}) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const toggle = (num: number) => {
    setExpanded(expanded === num ? null : num)
  }

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
        Dockerfile 撰寫標準 — 點擊各步驟查看範例
      </p>

      <div className="docker-overview">
        {overview.map((item) => (
          <div className="docker-overview-card" key={item.label}>
            <h4>{item.label}</h4>
            <p>{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="docker-steps">
        {steps.map((step, i) => (
          <div key={step.num}>
            <div
              className={`docker-step${expanded === step.num ? ' expanded' : ''}`}
              onClick={() => toggle(step.num)}
            >
              <div className="docker-step-head">
                <span className="docker-step-num">{step.num}</span>
                <span className="docker-step-title">{step.title}</span>
                <span className="docker-step-hint">點擊展開</span>
              </div>
              {expanded === step.num && (
                <div className="docker-step-body">
                  <p>{step.desc}</p>
                  <div className="code">{step.code}</div>
                </div>
              )}
            </div>
            {i < steps.length - 1 && <div className="docker-arrow">|</div>}
          </div>
        ))}
      </div>

      <h4 style={{ fontSize: '13px', margin: '20px 0 6px' }}>Image 命名規則</h4>
      <div className="code">{imageName}</div>
      <table className="tbl" style={{ marginTop: '8px' }}>
        <thead>
          <tr>
            <th>分支</th>
            <th>Tag</th>
            <th>範例</th>
          </tr>
        </thead>
        <tbody>
          {imageNaming.map((row) => (
            <tr key={row.branch}>
              <td>{row.branch}</td>
              <td className="mono">{row.tag}</td>
              <td className="mono">{row.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DeliverablesTab({ columns, rows }: { columns: string[]; rows: DeliverableRow[] }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.num}>
            <td>{row.num}</td>
            <td>{row.item}</td>
            <td>{row.desc}</td>
            <td>
              {row.owner.map((o) => (
                <Badge key={o} label={o} />
              ))}{' '}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CITableTab({ columns, rows }: { columns: string[]; rows: CIRow[] }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.num}>
            <td>{row.num}</td>
            <td>{row.stage}</td>
            <td>{row.content}</td>
            <td>{row.gate}</td>
            <td>{row.failure}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ChecklistTab({ columns, rows }: { columns: string[]; rows: ChecklistRow[] }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.num}>
            <td>{row.num}</td>
            <td>{row.item}</td>
            <td>
              {row.owner.map((o) => (
                <Badge key={o} label={o} />
              ))}{' '}
            </td>
            <td>{row.standard}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PentestFlowTab({
  phases,
  steps,
}: {
  phases: { phase: string; name: string; owner: string }[]
  steps: Step[]
}) {
  return (
    <div>
      <div className="pentest-phases">
        {phases.map((p) => (
          <div className="pentest-phase-card" key={p.phase}>
            <h4>{p.phase}</h4>
            <p>{p.name}</p>
            <Badge label={p.owner} />
          </div>
        ))}
      </div>
      <StepFlow steps={steps} />
    </div>
  )
}

function OWASPTab({ columns, rows }: { columns: string[]; rows: OWASPRow[] }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.num}>
            <td>{row.num}</td>
            <td>{row.category}</td>
            <td>{row.content}</td>
            <td className="mono">{row.tools}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SeverityTab({ columns, rows }: { columns: string[]; rows: SeverityRow[] }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.level}>
            <td>
              <span className={`sev sev-${row.sevType}`}>{row.level}</span>
            </td>
            <td>{row.definition}</td>
            <td>{row.deadline}</td>
            <td>{row.impact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ProdFlowTab({ precondition, steps }: { precondition: string; steps: Step[] }) {
  return (
    <div>
      <p className="prod-precondition">
        <strong>前置條件：</strong>
        {precondition.replace('前置條件：', '')}
      </p>
      <StepFlow steps={steps} />
    </div>
  )
}

function RollbackTab({ triggers, steps, note }: { triggers: string[]; steps: Step[]; note: string }) {
  return (
    <div>
      <h4 style={{ fontSize: '13px', marginBottom: '12px' }}>觸發條件 — 以下任一成立即啟動</h4>
      <div className="rollback-triggers">
        {triggers.map((t) => (
          <div className="card" key={t}>
            <p>{t}</p>
          </div>
        ))}
      </div>
      <StepFlow steps={steps} />
      <div className="note">
        <strong>DB Migration 必須設計為可逆的。</strong>
        {note.replace('DB Migration 必須設計為可逆的。', '')}
      </div>
    </div>
  )
}

function HotfixTab({
  note,
  steps,
  columns,
  rows,
}: {
  note: string
  steps: Step[]
  columns: string[]
  rows: HotfixRow[]
}) {
  return (
    <div>
      <div className="note hotfix-note">
        <strong>Security Scan 與 Health Check 不可跳過。</strong>
        {note.replace('Security Scan 與 Health Check 不可跳過。', '')}
      </div>
      <div style={{ marginTop: '16px' }}>
        <StepFlow steps={steps} />
      </div>
      <table className="tbl" style={{ marginTop: '16px' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.item}>
              <td>{row.item}</td>
              <td>{row.normal}</td>
              <td>
                {row.item === 'Security Scan' ? <strong>{row.hotfix}</strong> : row.hotfix}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderContent(content: TabContent) {
  switch (content.kind) {
    case 'steps':
      return <StepFlow steps={content.steps} />
    case 'git':
      return <GitTab branches={content.branches} commitTypes={content.commitTypes} />
    case 'docker':
      return (
        <DockerTab
          overview={content.overview}
          steps={content.steps}
          imageName={content.imageName}
          imageNaming={content.imageNaming}
        />
      )
    case 'deliverables':
      return <DeliverablesTab columns={content.columns} rows={content.rows} />
    case 'ci-table':
      return (
        <>
          <CITableTab columns={content.columns} rows={content.rows} />
          <div className="note">
            <strong>禁止</strong> Force Push 至 main / staging / develop。CI 未全綠禁止合併。
          </div>
        </>
      )
    case 'stage-checklist':
      return <ChecklistTab columns={content.columns} rows={content.rows} />
    case 'pentest-flow':
      return <PentestFlowTab phases={content.phases} steps={content.steps} />
    case 'owasp':
      return <OWASPTab columns={content.columns} rows={content.rows} />
    case 'severity':
      return <SeverityTab columns={content.columns} rows={content.rows} />
    case 'pentest-checklist':
      return <ChecklistTab columns={content.columns} rows={content.rows} />
    case 'prod-flow':
      return <ProdFlowTab precondition={content.precondition} steps={content.steps} />
    case 'prod-checklist':
      return <ChecklistTab columns={content.columns} rows={content.rows} />
    case 'rollback':
      return <RollbackTab triggers={content.triggers} steps={content.steps} note={content.note} />
    case 'hotfix':
      return (
        <HotfixTab
          note={content.note}
          steps={content.steps}
          columns={content.columns}
          rows={content.rows}
        />
      )
    default:
      return null
  }
}

function TabbedDetail({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <div className="tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            className={`tab${activeTab === i ? ' on' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div key={tab.id} className={`tc${activeTab === i ? ' on' : ''}`}>
          {renderContent(tab.content)}
        </div>
      ))}
    </>
  )
}

export default function DetailPanel({ stage }: Props) {
  return (
    <div className="detail open">
      <div className="detail-inner">
        <div className="detail-title">
          {stage.title}{' '}
          <span style={{ display: 'flex', gap: '4px' }}>
            {stage.owner.map((o) => (
              <Badge key={o} label={o} />
            ))}
          </span>
        </div>

        {stage.note && (
          <div className="note" style={{ marginTop: 0, marginBottom: '16px' }}>
            <strong>{stage.note.split('。')[0]}。</strong>
            {stage.note.split('。').slice(1).join('。')}
          </div>
        )}

        {stage.tabs ? (
          <TabbedDetail tabs={stage.tabs} />
        ) : stage.singleContent ? (
          renderContent(stage.singleContent)
        ) : null}
      </div>
    </div>
  )
}
