export type RuleItem = {
  title: string
  desc: string
}

export type PainSubItem = {
  title: string
  desc: string
}

export type PainSection = {
  heading: string
  items: PainSubItem[]
}

export type SopSolutionItem = {
  title: string
  desc: string
}

export type LegacyNewItem = {
  heading: string
  items: string[]
  note?: string
}

export type PainPointSection =
  | { kind: 'items'; heading: string; items: PainSubItem[] }
  | { kind: 'solutions'; heading: string; solutions: SopSolutionItem[] }
  | { kind: 'legacy-new'; heading: string; legacy: LegacyNewItem; newSys: LegacyNewItem }

export type NetworkRow = {
  item: string
  standard: string
}

export type RdNetworkRow = {
  item: string
  example: string
}

export type MonitoringRow = {
  category: string
  metric: string
  threshold: string
  oncall: string[]
}

export type BackupRow = {
  type: string
  frequency: string
  retention: string
  sla: string
}

export type PortRow = {
  system: string
  env: string
  port: string
  assignedBy: string
}

export type AppendixSection =
  | { kind: 'network'; heading: string; note: string; rows: NetworkRow[]; rdHeading: string; rdRows: RdNetworkRow[] }
  | { kind: 'monitoring'; heading: string; rows: MonitoringRow[] }
  | { kind: 'backup'; heading: string; rows: BackupRow[] }
  | { kind: 'legacy-new'; heading: string; legacy: LegacyNewItem; newSys: LegacyNewItem }
  | { kind: 'port-mgmt'; heading: string; note: string; rules: string[]; rows: PortRow[] }

export const rulesData: RuleItem[] = [
  {
    title: 'Production 部署僅限 MIS',
    desc: 'RD 可發起請求，不可直接操作正式環境',
  },
  {
    title: '滲透測試未通過前禁止上線',
    desc: '所有 Critical / High 弱點必須修復並通過複測',
  },
  {
    title: 'Critical / High 弱點必須上線前修復',
    desc: 'Critical 24hr / High 3 天內修復',
  },
  {
    title: '每次部署須附 Rollback 計畫',
    desc: '經 MIS 確認後方可執行部署',
  },
  {
    title: '禁止 Force Push 至保護分支',
    desc: 'main / staging / develop 禁止 Force Push',
  },
  {
    title: 'DB Migration 必須可逆',
    desc: '無法回滾的操作須在部署計畫中標注',
  },
]

export const painPointsData: PainPointSection[] = [
  {
    kind: 'items',
    heading: '一、部署模式',
    items: [
      { title: '1. 強迫性停機更新', desc: 'IIS 環境需停機才能覆蓋更新，無法高可用' },
      { title: '2. 手動複製貼上', desc: 'RD 打包交 MIS 手動覆蓋，非自動化，極易出錯' },
      { title: '3. 缺乏配置標準化', desc: '無統一打包規範，設定檔位置不明，MIS 需猜測' },
      { title: '4. 環境混雜', desc: '多系統 + DB 擠同一台 VM，資源競爭，缺乏隔離' },
    ],
  },
  {
    kind: 'items',
    heading: '二、維運與管理',
    items: [
      { title: '5. 備份還原效能差', desc: '全機 VM 快照，還原 6-8 小時，無法滿足 SLA' },
      { title: '6. 架構堆疊（俄羅斯套娃）', desc: 'VM → 系統 → Docker → Container，層級過多，除錯困難' },
      { title: '7. 資安流程倒置', desc: '上線後才滲透測試，在正式環境測試' },
      { title: '8. 溝通斷層', desc: 'MIS/RD 流程理解不足，未申請憑證、任意改環境' },
    ],
  },
  {
    kind: 'solutions',
    heading: '三、SOP 解決方向',
    solutions: [
      { title: '標準化交付物', desc: 'RD 提供統一格式，MIS 不再猜' },
      { title: '流程階段化 + 檢核清單', desc: '做完才能往下走' },
      { title: '資安前移 Shift Left', desc: 'CI 就掃描，不再上線後才測' },
      { title: '角色權責明確', desc: '每步標示誰做誰審' },
      { title: '滾動更新取代停機', desc: '新系統不中斷服務' },
      { title: '備份策略改善', desc: 'DB+Config 備份，還原 <= 1hr' },
    ],
  },
  {
    kind: 'legacy-new',
    heading: '四、新舊系統處置',
    legacy: {
      heading: '舊系統 — 維持現狀',
      items: ['不強行容器化或遷移', 'MIS 建立備份還原 SOP', '任何變更仍須走 MR 流程', '以穩定為優先'],
      note: 'Weiyao 建議',
    },
    newSys: {
      heading: '新系統 — 強制標準化',
      items: ['一律走 CI/CD 流程', '統一交付格式（依架構決定）', 'DB 與應用分離', '逐步轉型，避免雙軌擴大'],
    },
  },
]

export const appendixData: AppendixSection[] = [
  {
    kind: 'network',
    heading: '網路需求標準',
    note: '新專案應遵循的網路標準（舊系統維持現狀）',
    rows: [
      { item: '對外 Port', standard: '僅 80/443，HTTP 重導 HTTPS' },
      { item: 'DB 存取', standard: '僅內網，嚴禁外網' },
      { item: 'SSH', standard: '僅 MIS IP，Key-based Auth' },
      { item: 'CI/CD', standard: 'Outbound 443 to GitHub' },
      { item: 'Stage', standard: '僅內網，滲透測試臨時開通' },
      { item: '環境隔離', standard: 'Dev/Stage/Prod 不共用 VM' },
      { item: 'DB 分離', standard: '新專案禁止 DB 與應用同機' },
    ],
    rdHeading: '新專案上線前 RD 須提供',
    rdRows: [
      { item: '應用 Port', example: '3000 / 8080' },
      { item: 'DB 類型 + Port', example: 'PostgreSQL :5432' },
      { item: '外部 API', example: 'api.google.com:443' },
      { item: 'SSL 憑證', example: 'app.company.com' },
      { item: '防火牆規則', example: '限公司 IP 存取 /admin' },
    ],
  },
  {
    kind: 'monitoring',
    heading: '監控指標與告警',
    rows: [
      { category: '基礎設施', metric: 'CPU/Mem/Disk', threshold: '> 85% / 5min', oncall: ['MIS'] },
      { category: '應用層', metric: '5xx Rate', threshold: '> 1% / 3min', oncall: ['RD'] },
      { category: '應用層', metric: 'Latency P99', threshold: '> 2s / 5min', oncall: ['RD'] },
      { category: '容器', metric: 'Restart', threshold: '> 3 / 10min', oncall: ['MIS', 'RD'] },
      { category: 'DB', metric: 'Pool / Slow', threshold: '> 80% / > 5s', oncall: ['MIS', 'RD'] },
    ],
  },
  {
    kind: 'backup',
    heading: '備份策略',
    rows: [
      { type: 'DB 全量', frequency: '每日 2:00', retention: '30 天', sla: '<= 1hr' },
      { type: 'DB 增量', frequency: '每 6hr', retention: '7 天', sla: '<= 30min' },
      { type: 'Config', frequency: '每次變更', retention: '無限期', sla: '即時' },
      { type: 'Volume', frequency: '每日', retention: '14 天', sla: '<= 1hr' },
    ],
  },
  {
    kind: 'legacy-new',
    heading: '新舊系統處置',
    legacy: {
      heading: '舊系統 — 維持現狀',
      items: ['不強行容器化或遷移', 'MIS 建立備份還原 SOP', '任何變更仍須走 MR 流程', '以穩定為優先'],
      note: 'Weiyao 建議',
    },
    newSys: {
      heading: '新系統 — 強制標準化',
      items: ['一律走 CI/CD 流程', '統一交付格式（依架構決定）', 'DB 與應用分離', '逐步轉型，避免雙軌擴大'],
    },
  },
  {
    kind: 'port-mgmt',
    heading: 'Port 號管理',
    note: '系統越來越多，部署在同一環境時需統一管理 Port 號，避免衝突。',
    rules: [
      'Port 號由 MIS 統一配發，RD 不可自行指定',
      'RD 提交新專案時須填寫 Port 需求申請，由 MIS 分配',
      'MIS 維護一份 Port 對照表，記錄每個系統在各環境的 Port',
      '對外服務統一走 80/443，內部 Port 透過 Reverse Proxy 轉發',
      'Port 對照表更新後須通知所有相關人員',
    ],
    rows: [
      { system: 'SOC Web', env: 'Staging', port: '（由 MIS 分配）', assignedBy: 'MIS' },
      { system: 'SOC Web', env: 'Production', port: '（由 MIS 分配）', assignedBy: 'MIS' },
      { system: '報表系統', env: 'Staging', port: '（由 MIS 分配）', assignedBy: 'MIS' },
      { system: '報表系統', env: 'Production', port: '（由 MIS 分配）', assignedBy: 'MIS' },
      { system: '弱點掃描', env: 'Staging', port: '（由 MIS 分配）', assignedBy: 'MIS' },
      { system: '弱點掃描', env: 'Production', port: '（由 MIS 分配）', assignedBy: 'MIS' },
    ],
  },
]
