export type Badge = string

export type StepDetail = {
  sections: { heading: string; items: string[] }[]
  autoTable?: { type: string; who: string; how: string }[]
  notes?: string[]
}

export type Step = {
  title: string
  badges: Badge[]
  desc?: string
  detail?: StepDetail
}

export type Branch = {
  name: string
  color: string
  env: string
  desc: string
}

export type CommitType = {
  type: string
  desc: string
  example: string
}

export type DockerStep = {
  num: number
  title: string
  desc: string
  code: string
}

export type DockerOverviewItem = {
  label: string
  sub: string
}

export type ImageNamingRow = {
  branch: string
  tag: string
  example: string
}

export type TableColumn = {
  key: string
  label: string
}

export type TableRow = Record<string, string | JSXChild>

export type JSXChild = {
  type: 'badge'
  value: string[]
} | {
  type: 'sev'
  level: 'c' | 'h' | 'm' | 'l'
  label: string
} | {
  type: 'mono'
  value: string
} | {
  type: 'text'
  value: string
}

export type Tab = {
  id: string
  label: string
  content: TabContent
}

export type TabContent =
  | { kind: 'steps'; steps: Step[] }
  | { kind: 'git'; branches: Branch[]; commitTypes: CommitType[] }
  | { kind: 'docker'; overview: DockerOverviewItem[]; steps: DockerStep[]; imageName: string; imageNaming: ImageNamingRow[] }
  | { kind: 'deliverables'; columns: string[]; rows: DeliverableRow[] }
  | { kind: 'ci-table'; columns: string[]; rows: CIRow[] }
  | { kind: 'stage-checklist'; columns: string[]; rows: ChecklistRow[] }
  | { kind: 'pentest-flow'; phases: PentestPhase[]; steps: Step[] }
  | { kind: 'owasp'; columns: string[]; rows: OWASPRow[] }
  | { kind: 'severity'; columns: string[]; rows: SeverityRow[] }
  | { kind: 'pentest-checklist'; columns: string[]; rows: ChecklistRow[] }
  | { kind: 'prod-flow'; precondition: string; steps: Step[] }
  | { kind: 'prod-checklist'; columns: string[]; rows: ChecklistRow[] }
  | { kind: 'rollback'; triggers: string[]; steps: Step[]; note: string }
  | { kind: 'hotfix'; note: string; steps: Step[]; columns: string[]; rows: HotfixRow[] }

export type DeliverableRow = {
  num: string
  item: string
  desc: string
  owner: string[]
}

export type CIRow = {
  num: string
  stage: string
  content: string
  gate: string
  failure: string
}

export type ChecklistRow = {
  num: string
  item: string
  owner: string[]
  standard: string
}

export type PentestPhase = {
  phase: string
  name: string
  owner: string
}

export type OWASPRow = {
  num: string
  category: string
  content: string
  tools: string
}

export type SeverityRow = {
  level: string
  sevType: 'c' | 'h' | 'm' | 'l'
  definition: string
  deadline: string
  impact: string
}

export type HotfixRow = {
  item: string
  normal: string
  hotfix: string
}

export type Stage = {
  id: string
  title: string
  owner: string[]
  note?: string
  tabs?: Tab[]
  singleContent?: TabContent
}

export const stages: Stage[] = [
  {
    id: 'dev',
    title: '開發階段',
    owner: ['RD'],
    tabs: [
      {
        id: 'flow',
        label: '流程',
        content: {
          kind: 'steps',
          steps: [
            { title: '需求分析與系統設計', badges: ['RD'], desc: '產出系統設計文件' },
            { title: '程式碼撰寫 + 單元測試', badges: ['RD'], desc: '覆蓋率 >= 80%' },
            { title: '撰寫 Dockerfile', badges: ['RD'], desc: '遵循 Docker 打包標準' },
            { title: '本地測試', badges: ['RD'], desc: 'docker build 成功、基本功能測試通過' },
            { title: 'Commit + Push', badges: ['RD'], desc: 'Conventional Commits 格式，Push 到 feature/* 分支' },
            { title: '發起 Merge Request', badges: ['RD'], desc: 'feature/* → develop，填寫 MR 模板，指派 Reviewer' },
          ],
        },
      },
      {
        id: 'git',
        label: 'Git 策略',
        content: {
          kind: 'git',
          branches: [
            { name: 'main', color: '#c00', env: 'Production', desc: '禁止直接 push / RD 負責合併與建 Tag / Tag 觸發 CI build Image' },
            { name: 'staging', color: '#090', env: 'Stage', desc: '禁止直接 push / Merge 自動部署至 Stage' },
            { name: 'develop', color: '#06c', env: 'Dev', desc: '允許 push（建議 MR）/ Push 自動建置 Dev Image' },
            { name: 'feature/*', color: '#777', env: '本地', desc: '命名：feature/JIRA-123-desc / 完成後 MR to develop' },
            { name: 'hotfix/*', color: '#777', env: 'Prod', desc: '從 main 建立 / MR to main / cherry-pick 回 develop + staging' },
          ],
          commitTypes: [
            { type: 'feat', desc: '新增功能。影響 MINOR 版本號。', example: 'feat(auth): add OAuth2 login with Google' },
            { type: 'fix', desc: '修復 Bug。影響 PATCH 版本號。', example: 'fix(api): resolve null pointer in user endpoint' },
            { type: 'docs', desc: '文檔更新（README、API 文件等），不影響程式碼執行。', example: 'docs(readme): update deployment instructions' },
            { type: 'style', desc: '程式碼格式化，與邏輯無關（縮排、逗號等）。', example: 'style(css): fix indentation in dashboard' },
            { type: 'refactor', desc: '改善程式結構或優化，未新增功能也沒修正 Bug。', example: 'refactor(db): simplify query builder' },
            { type: 'test', desc: '測試檔案的新增或修改。', example: 'test(auth): add login failure test cases' },
            { type: 'chore', desc: '雜項工作（工具設定、依賴更新等）。', example: 'chore(deps): upgrade express to v5' },
            { type: 'build', desc: '編譯或打包相關的修改（webpack、rollup 等）。', example: 'build(webpack): update output config' },
            { type: 'ci', desc: 'CI/CD 腳本或流程的更動。', example: 'ci(pipeline): add security scan stage' },
            { type: 'perf', desc: '提升執行效能的修改。', example: 'perf(query): optimize user search with index' },
            { type: 'revert', desc: '回退某次提交。', example: 'revert: revert feat(auth) add OAuth2 login' },
          ],
        },
      },
      {
        id: 'docker',
        label: 'Docker 標準',
        content: {
          kind: 'docker',
          overview: [
            { label: '1. Base Image', sub: '鎖定版本' },
            { label: '2. Multi-stage', sub: '分離 Build/Run' },
            { label: '3. Non-root', sub: '最小權限' },
            { label: '4. Ignore', sub: '.dockerignore' },
            { label: '5. 1 Process', sub: '一容器一行程' },
            { label: '6. Health', sub: 'HEALTHCHECK' },
            { label: '7. Secrets', sub: '環境變數注入' },
          ],
          steps: [
            {
              num: 1,
              title: '選擇 Base Image 並鎖定版本',
              desc: '使用官方 Image，禁止 :latest',
              code: 'FROM node:20-alpine AS build\nFROM python:3.12-slim AS build',
            },
            {
              num: 2,
              title: 'Multi-stage Build',
              desc: 'Build Stage 與 Runtime Stage 分離，縮小最終 Image',
              code: 'FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runtime\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nCOPY --from=build /app/node_modules ./node_modules',
            },
            {
              num: 3,
              title: '建立非 root 使用者',
              desc: '避免容器內擁有過高權限',
              code: 'RUN addgroup -S appgroup && adduser -S appuser -G appgroup\nUSER appuser',
            },
            {
              num: 4,
              title: '設定 .dockerignore',
              desc: '排除不必要檔案，減少 build context',
              code: 'node_modules\n.git\n*.env\n.env.*\ndist\n.vscode\n*.md',
            },
            {
              num: 5,
              title: '一容器一行程',
              desc: 'One Process Per Container，便於監控與水平擴展',
              code: 'CMD ["node", "dist/server.js"]\n\n# 不要在一個容器裡同時跑 app + db + nginx',
            },
            {
              num: 6,
              title: '設定 HEALTHCHECK',
              desc: '讓部署系統判斷容器是否正常運作',
              code: 'HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\\n  CMD curl -f http://localhost:3000/health || exit 1',
            },
            {
              num: 7,
              title: '敏感資訊透過環境變數注入',
              desc: '密碼、API Key 絕不寫進 Dockerfile 或 Image',
              code: '# Dockerfile 裡用 ENV 宣告預設值（非敏感）\nENV NODE_ENV=production\nENV PORT=3000\n\n# 敏感值在 docker-compose 或部署時注入\n# docker run -e DB_PASSWORD=xxx',
            },
          ],
          imageName: 'registry.company.com/<project>/<service>:<version>',
          imageNaming: [
            { branch: 'develop', tag: ':dev-<sha>', example: ':dev-abc1234' },
            { branch: 'staging', tag: ':staging-<sha>', example: ':staging-def5678' },
            { branch: 'main', tag: ':v<semver>', example: ':v1.2.3' },
          ],
        },
      },
      {
        id: 'deliverables',
        label: '交付物',
        content: {
          kind: 'deliverables',
          columns: ['#', '交付物', '說明', '負責'],
          rows: [
            { num: '1', item: 'Docker Image', desc: '通過 CI 建置並推至 Registry', owner: ['RD'] },
            { num: '2', item: 'docker-compose.yml', desc: '部署配置檔', owner: ['RD', 'MIS'] },
            { num: '3', item: '環境變數清單', desc: '所有需設定的環境變數', owner: ['RD'] },
            { num: '4', item: 'DB Migration', desc: '資料庫結構變更腳本（如有）', owner: ['RD'] },
            { num: '5', item: 'CHANGELOG', desc: '本次變更記錄', owner: ['RD'] },
            { num: '6', item: 'Rollback 計畫', desc: '回滾步驟與判斷條件', owner: ['RD', 'MIS'] },
          ],
        },
      },
    ],
  },
  {
    id: 'ci',
    title: 'CI Pipeline',
    owner: ['自動化'],
    singleContent: {
      kind: 'ci-table',
      columns: ['#', '階段', '內容', 'Gate', '失敗'],
      rows: [
        { num: '1', stage: 'Lint', content: 'ESLint / Pylint', gate: '0 Error', failure: '阻斷，RD 修復' },
        { num: '2', stage: 'Unit Test', content: '測試 + 覆蓋率', gate: '>= 80%', failure: '阻斷，RD 修復' },
        { num: '3', stage: 'Build', content: 'Docker Image 建置', gate: '成功', failure: '阻斷，RD 修復' },
        { num: '4', stage: 'Security Scan', content: 'SAST + CVE', gate: '無 Critical / High', failure: '阻斷，RD 修復' },
        { num: '5', stage: 'Push Image', content: '推至 Registry', gate: '成功', failure: '重試 / 通知 MIS' },
        { num: '6', stage: 'Code Review', content: 'Reviewer 審查', gate: '至少 1 人核准', failure: '退回 RD' },
      ],
    },
  },
  {
    id: 'stage',
    title: 'Stage 部署',
    owner: ['MIS', 'RD'],
    tabs: [
      {
        id: 'flow',
        label: '流程',
        content: {
          kind: 'steps',
          steps: [
            { title: 'develop → staging MR', badges: ['RD'], desc: '確認 CHANGELOG 更新，Reviewer 核准後合併' },
            { title: '自動部署', badges: ['自動'], desc: 'Build → Push → Deploy → Health Check（失敗自動回滾）' },
            { title: 'DAST 掃描', badges: ['MIS'], desc: '獨立 Scan Domain 執行動態安全掃描（如需要）' },
            {
              title: 'UAT 驗收', badges: ['RD'], desc: '功能驗證，通過後簽署 Sign-off',
              detail: {
                sections: [
                  { heading: '核心功能', items: ['登入 / 登出正常', '會員註冊流程完整', '會員資料編輯可儲存', '密碼重設信件可收到'] },
                  { heading: 'API', items: ['GET /api/users 回傳正確', 'POST /api/users 建立成功', '錯誤情境回傳正確 HTTP status'] },
                  { heading: '權限', items: ['一般使用者無法存取 /admin', '未登入無法存取受保護頁面'] },
                  { heading: '相容性', items: ['Chrome 正常', '手機版面正常'] },
                  { heading: '本次變更特定項目', items: ['依 CHANGELOG 逐項驗證'] },
                ],
                autoTable: [
                  { type: 'API 功能正確性', who: 'Claude Code', how: '自動寫測試 + 執行' },
                  { type: '權限控制', who: 'Claude Code', how: '自動測試各角色存取' },
                  { type: '表單流程', who: 'Claude Code', how: 'Playwright 自動操作' },
                  { type: '畫面 / UX', who: 'RD', how: '人眼確認' },
                  { type: '效能', who: 'Claude Code', how: 'k6 / Lighthouse' },
                ],
                notes: [
                  'Claude Code 可自動讀取 CHANGELOG / MR 描述，產生測試案例並執行',
                  'Stage 環境需可從開發機存取',
                  '畫面相關驗收仍需 RD 人眼確認',
                ],
              },
            },
          ],
        },
      },
      {
        id: 'checklist',
        label: '檢核清單',
        content: {
          kind: 'stage-checklist',
          columns: ['#', '項目', '負責', '標準'],
          rows: [
            { num: '1', item: 'CI Pipeline 全綠', owner: ['RD'], standard: '0 Error' },
            { num: '2', item: 'Code Review 核准', owner: ['Reviewer'], standard: 'Approved' },
            { num: '3', item: 'Image 推至 Registry', owner: ['自動'], standard: '可查詢' },
            { num: '4', item: 'Stage 部署 + Health Check', owner: ['自動'], standard: 'HTTP 200' },
            { num: '5', item: 'Security Scan 無 Critical/High', owner: ['自動'], standard: '附於 MR' },
            { num: '6', item: 'UAT 驗收通過', owner: ['RD'], standard: '簽核' },
          ],
        },
      },
    ],
  },
  {
    id: 'pentest',
    title: '滲透測試',
    owner: ['技服', 'MIS', 'RD'],
    note: '必須在快照保護下的隔離環境中執行。測試完成後還原至乾淨狀態。絕不可在正式環境操作。',
    tabs: [
      {
        id: 'flow',
        label: '流程',
        content: {
          kind: 'pentest-flow',
          phases: [
            { phase: 'Phase 1', name: '環境準備', owner: 'MIS' },
            { phase: 'Phase 2', name: '測試執行', owner: '技服' },
            { phase: 'Phase 3', name: '弱點修復', owner: 'RD' },
            { phase: 'Phase 4', name: '環境還原', owner: 'MIS' },
          ],
          steps: [
            { title: '環境快照', badges: ['MIS'], desc: 'VM 快照 + DB 備份 + Volume 備份，記錄快照 ID' },
            { title: '開通存取權限', badges: ['MIS'], desc: '技服存取測試環境（HTTP/API/SSH），嚴禁開通正式環境' },
            { title: '測試計畫確認', badges: ['技服', 'RD'], desc: '技服提供計畫書，RD 審閱補充風險點' },
            { title: '執行滲透測試', badges: ['技服'], desc: 'OWASP Top 10 + DDoS 模擬，弱點即時記錄' },
            { title: '弱點報告', badges: ['技服'], desc: '3 個工作天內產出，依嚴重度分級' },
            { title: '修復與複測', badges: ['RD', '技服'], desc: 'Critical > High 優先修復，重跑 CI，技服複測。重複直到無 Critical/High' },
            { title: '環境還原', badges: ['MIS'], desc: '快照還原、驗證服務正常、回收技服存取權限' },
          ],
        },
      },
      {
        id: 'owasp',
        label: 'OWASP 項目',
        content: {
          kind: 'owasp',
          columns: ['#', '類別', '內容', '工具'],
          rows: [
            { num: '1', category: 'Injection', content: 'SQL / NoSQL / OS Command', tools: 'SQLMap, Burp' },
            { num: '2', category: '認證與授權', content: '暴力破解、Session 劫持、權限提升', tools: 'Hydra, Burp' },
            { num: '3', category: 'XSS / CSRF', content: 'Reflected / Stored XSS、CSRF', tools: 'OWASP ZAP' },
            { num: '4', category: 'API 安全', content: '未授權存取、Rate Limit、參數篡改', tools: 'Postman, Burp' },
            { num: '5', category: '服務韌性', content: 'DDoS、連線池耗盡', tools: 'k6, Locust' },
            { num: '6', category: '組態安全', content: '資訊外洩、錯誤訊息揭露', tools: 'Nikto, Nmap' },
            { num: '7', category: '資料保護', content: 'TLS 驗證、明文儲存', tools: 'testssl.sh' },
          ],
        },
      },
      {
        id: 'severity',
        label: '弱點分級',
        content: {
          kind: 'severity',
          columns: ['等級', '定義', '修復期限', '上線影響'],
          rows: [
            { level: 'CRITICAL', sevType: 'c', definition: '可遠端執行任意程式碼或取得完整控制權', deadline: '24hr', impact: '阻斷上線' },
            { level: 'HIGH', sevType: 'h', definition: '可竊取敏感資料或繞過認證', deadline: '3 天', impact: '阻斷上線' },
            { level: 'MEDIUM', sevType: 'm', definition: '可利用但需特定條件或影響有限', deadline: '2 週', impact: '可上線，須追蹤' },
            { level: 'LOW', sevType: 'l', definition: '風險極低或最佳實踐建議', deadline: '技術債', impact: '不影響' },
          ],
        },
      },
      {
        id: 'checklist',
        label: '檢核清單',
        content: {
          kind: 'pentest-checklist',
          columns: ['#', '項目', '負責', '標準'],
          rows: [
            { num: '1', item: '環境快照已建立', owner: ['MIS'], standard: '快照 ID 已記錄' },
            { num: '2', item: '技服存取權限已開通', owner: ['MIS'], standard: '權限清單確認' },
            { num: '3', item: '測試計畫已由 RD 審閱', owner: ['技服', 'RD'], standard: '計畫書簽核' },
            { num: '4', item: 'OWASP Top 10 全項目完成', owner: ['技服'], standard: '記錄完整' },
            { num: '5', item: 'DDoS / 壓力測試完成', owner: ['技服'], standard: '報告產出' },
            { num: '6', item: '滲透測試報告已產出', owner: ['技服'], standard: '3 工作天內' },
            { num: '7', item: 'Critical / High 已全數修復', owner: ['RD'], standard: 'Re-test 通過' },
            { num: '8', item: '技服複測確認關閉', owner: ['技服'], standard: '複測報告' },
            { num: '9', item: '環境快照已還原', owner: ['MIS'], standard: '還原確認單' },
            { num: '10', item: '還原後 Health Check 通過', owner: ['MIS'], standard: 'HTTP 200' },
            { num: '11', item: '技服存取權限已回收', owner: ['MIS'], standard: '權限關閉' },
          ],
        },
      },
    ],
  },
  {
    id: 'prod',
    title: 'Production',
    owner: ['MIS'],
    note: 'Production 部署僅限 MIS 操作。RD 負責建 Tag 並產出交付物，MIS 在 K8s / VM 上執行部署。',
    tabs: [
      {
        id: 'flow',
        label: '流程',
        content: {
          kind: 'prod-flow',
          precondition: '前置條件：Stage 檢核全通過 / 滲透測試無 Critical+High / UAT Sign-off / DB Migration 已驗證 / Rollback 計畫已確認',
          steps: [
            { title: 'RD 合併 MR 至 main 並建立 Release Tag', badges: ['RD'], desc: 'MR 附：Stage 結果、滲透測試報告、Rollback 計畫。合併後建 Tag（v1.2.3）' },
            { title: 'CI 自動建置正式版 Image', badges: ['自動'], desc: 'Tag 觸發 Pipeline：Re-build → Re-scan → Push Image :v1.2.3 至 Registry' },
            { title: 'RD 交付部署物給 MIS', badges: ['RD'], desc: '提供：Image tag、YAML、環境變數清單、DB Migration Script、Rollback 計畫' },
            { title: 'MIS 執行部署', badges: ['MIS'], desc: '在 K8s / VM 上拉 Image、設定環境變數、執行 DB Migration、部署、Health Check' },
            { title: '部署後驗證 30 分鐘', badges: ['RD', 'MIS'], desc: 'RD 功能驗證，MIS 監控 CPU / Memory / Error Rate' },
          ],
        },
      },
      {
        id: 'checklist',
        label: '檢核清單',
        content: {
          kind: 'prod-checklist',
          columns: ['#', '項目', '負責', '標準'],
          rows: [
            { num: '1', item: 'Stage 檢核全通過', owner: ['RD'], standard: '見 Stage 清單' },
            { num: '2', item: '滲透測試無 Critical/High', owner: ['技服'], standard: '見 Pentest 清單' },
            { num: '3', item: 'UAT Sign-off', owner: ['RD'], standard: '簽核' },
            { num: '4', item: 'Rollback 計畫已撰寫', owner: ['RD'], standard: '含回滾步驟與 DB Script' },
            { num: '5', item: 'DB Migration 已在 Stage 驗證', owner: ['RD'], standard: '無報錯' },
            { num: '6', item: '資料庫已備份', owner: ['MIS'], standard: '可驗證' },
            { num: '7', item: '部署時段確認', owner: ['MIS'], standard: '避開尖峰' },
            { num: '8', item: 'CI Re-build + Re-scan（Tag 觸發）', owner: ['自動'], standard: '0 Critical/High' },
            { num: '9', item: 'RD 交付部署物給 MIS', owner: ['RD'], standard: 'Image tag + YAML + 環境變數 + Rollback' },
            { num: '10', item: 'Health Check', owner: ['自動'], standard: 'HTTP 200' },
            { num: '11', item: '功能驗證通過', owner: ['RD'], standard: '核心路徑正常' },
            { num: '12', item: '監控 30 分鐘無異常', owner: ['MIS', 'RD'], standard: '無 Alert' },
          ],
        },
      },
      {
        id: 'rollback',
        label: 'Rollback',
        content: {
          kind: 'rollback',
          triggers: [
            'Health Check 持續失敗超過 3 分鐘',
            'Error Rate 超過基線 5 倍',
            'P0/P1 使用者回報問題',
            '部署後 30 分鐘內監控異常',
          ],
          steps: [
            { title: 'MIS 判斷回滾', badges: ['MIS'], desc: '通知 RD' },
            { title: '回滾至前一穩定版本', badges: ['MIS'], desc: '' },
            { title: 'DB Migration 回滾', badges: ['RD', 'MIS'], desc: 'RD 提供 Script，MIS 執行' },
            { title: '驗證回滾成功', badges: ['MIS'], desc: 'Health Check + 監控恢復' },
            { title: '事故報告', badges: ['RD'], desc: '24hr 內完成 Post-mortem' },
          ],
          note: 'DB Migration 必須設計為可逆的。無法安全回滾的操作（如 DROP COLUMN）須在部署計畫中標注。',
        },
      },
      {
        id: 'hotfix',
        label: 'Hotfix',
        content: {
          kind: 'hotfix',
          note: 'Security Scan 與 Health Check 不可跳過。Code Review 可簡化為 1 人 + Verbal Approve。',
          steps: [
            { title: '從 main 建 hotfix/*', badges: ['RD'], desc: '' },
            { title: '修復 + 測試', badges: ['RD'], desc: '' },
            { title: 'MR to main [HOTFIX]', badges: ['RD'], desc: '1 人快速審核，合併後建 Patch Tag（v1.2.4）' },
            { title: 'CI 自動建置 + RD 交付部署物', badges: ['RD'], desc: 'Image tag + YAML 交給 MIS' },
            { title: 'MIS 執行部署', badges: ['MIS'], desc: '在 K8s / VM 上部署，驗證 Health Check' },
            { title: 'Cherry-pick 回 develop + staging', badges: ['RD'], desc: '24hr 內完成 Post-mortem' },
          ],
          columns: ['項目', '正常流程', 'Hotfix'],
          rows: [
            { item: '分支', normal: 'develop → staging → main', hotfix: 'main → hotfix/* → main' },
            { item: 'Code Review', normal: '至少 1 人 + CI 全綠', hotfix: '1 人（可 Verbal + 事後補審）' },
            { item: 'Security Scan', normal: '必須通過', hotfix: '必須通過（不可跳過）' },
            { item: 'UAT', normal: 'RD 簽核', hotfix: '可事後補簽' },
            { item: '事後', normal: '無', hotfix: '24hr Post-mortem + Cherry-pick' },
          ],
        },
      },
    ],
  },
]

export const pipelineItems = stages.map((s) => ({
  id: s.id,
  label: s.title,
  sub: s.owner.join(' + '),
}))
