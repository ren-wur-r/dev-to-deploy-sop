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
            { name: 'main', color: '#c00', env: 'Production', desc: '禁止直接 push / RD 負責合併與建 Tag（版本號由 RD 提供）/ Tag 觸發 CI build Image' },
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
            { branch: 'develop', tag: ':dev-v<semver>-<sha>', example: ':dev-v1.2.3-abc1234' },
            { branch: 'staging', tag: ':staging-v<semver>-<sha>', example: ':staging-v1.2.3-def5678' },
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
            { num: '5', item: 'Volume 路徑清單', desc: '列出所有 Volume 的用途、掛載路徑、負責人（如有變更須標注）', owner: ['RD'] },
            { num: '6', item: 'CHANGELOG', desc: '本次變更記錄', owner: ['RD'] },
            { num: '7', item: 'Rollback 計畫', desc: '回滾步驟與判斷條件', owner: ['RD', 'MIS'] },
          ],
        },
      },
      {
        id: 'volume-migration',
        label: 'Volume + Migration',
        content: {
          kind: 'steps',
          steps: [
            {
              title: 'Volume 與自動部署的關係', badges: ['RD', 'MIS'],
              desc: 'Docker Image 不包含 Volume 內容，自動部署只更新程式碼，Volume 需另外處理',
              detail: {
                sections: [
                  { heading: '核心觀念', items: [
                    'Volume 負責「資料不消失」-- 容器重建時掛載的資料還在',
                    'Migration 負責「結構更新」-- 透過 SQL 指令修改 DB schema',
                    '把 migration script 打包到 Image 裡 ≠ script 被執行了，還需要觸發機制',
                    '上傳檔案類的 Volume 跟部署無關，各環境各自維護，部署不會也不應該動它',
                  ]},
                  { heading: 'Volume 分類', items: [
                    '自訂 Volume：上傳檔案（圖檔、簡報）、SSL 憑證 -- 各環境獨立維護，不在自動部署範圍',
                    '預設 Volume：DB 數據檔 -- Named Volume 掛載，容器重建不影響，schema 變更透過 Migration 處理',
                  ]},
                ],
              },
            },
            {
              title: 'DB Migration 自動化方案比較', badges: ['RD'],
              desc: '三種方案適用不同環境，建議 Dev 用 Entrypoint、Staging/Prod 用 Pipeline step',
              detail: {
                sections: [
                  { heading: '方案 A：Entrypoint（Dev 環境推薦）', items: [
                    '容器啟動時先執行 migration，成功後才啟動應用',
                    '最簡單，Dev 只有一個容器實例不會有 Race Condition',
                    'RD push 後容器重建自動跑，不需人工介入',
                  ]},
                  { heading: '方案 B：CI/CD Pipeline step（Staging / Prod 推薦）', items: [
                    '在 GitHub Actions workflow 裡部署前先跑 migration',
                    '最安全：migration 失敗就不會繼續部署，不會推半成品上去',
                    'MIS 可在 Pipeline log 確認 migration 結果',
                    '前提：Runner 必須能連到目標環境的 DB',
                  ]},
                  { heading: '方案 C：一次性容器', items: [
                    'docker-compose 裡定義專門跑 migration 的 service，跑完自動退出',
                    '職責分離最乾淨，但設定較複雜',
                    '需管理容器啟動順序（depends_on + healthcheck）',
                  ]},
                ],
                autoTable: [
                  { type: '方案', who: '適用環境', how: '觸發方式' },
                  { type: 'A. Entrypoint', who: 'Dev', how: '容器啟動時自動執行 migration 再啟動應用' },
                  { type: 'B. Pipeline step', who: 'Staging / Prod', how: 'GitHub Actions 部署前先跑 migration，失敗則中斷' },
                  { type: 'C. 一次性容器', who: '皆可（複雜度較高）', how: 'docker-compose 定義獨立 migration service' },
                ],
                notes: [
                  '所有方案的前提：migration script 必須是冪等的（跑過的不重複跑），主流工具皆內建此機制',
                  'Runner 必須能連到目標環境的 DB（MIS 需確保網路可達 + DB 帳號權限）',
                ],
              },
            },
            {
              title: '.NET (Entity Framework Core) 範例', badges: ['RD'],
              desc: '適用 .NET 後端專案',
              detail: {
                sections: [
                  { heading: 'Entrypoint 做法（Dev）', items: [
                    '在 Program.cs 應用啟動時加入：var db = scope.ServiceProvider.GetRequiredService<AppDbContext>(); db.Database.Migrate();',
                    '每次容器啟動自動檢查並執行未套用的 migration',
                  ]},
                  { heading: 'Pipeline 做法（Staging / Prod）', items: [
                    'GitHub Actions step: dotnet ef database update --project ./src/MyApp --connection "$DB_CONNECTION_STRING"',
                    'DB 連線字串存在 GitHub Secrets，由 MIS 設定',
                  ]},
                ],
              },
            },
            {
              title: 'Node.js (Prisma) 範例', badges: ['RD'],
              desc: '適用 Node.js + Prisma 後端專案',
              detail: {
                sections: [
                  { heading: 'Entrypoint 做法（Dev）', items: [
                    'Dockerfile CMD: sh -c "npx prisma migrate deploy && node dist/server.js"',
                    'prisma migrate deploy 只執行尚未套用的 migration',
                  ]},
                  { heading: 'Pipeline 做法（Staging / Prod）', items: [
                    'GitHub Actions step: npx prisma migrate deploy',
                    'DATABASE_URL 存在 GitHub Secrets，由 MIS 設定',
                  ]},
                ],
              },
            },
            {
              title: 'Node.js (TypeORM) 範例', badges: ['RD'],
              desc: '適用 Node.js + TypeORM 後端專案',
              detail: {
                sections: [
                  { heading: 'Entrypoint 做法（Dev）', items: [
                    'Dockerfile CMD: sh -c "npx typeorm migration:run -d dist/data-source.js && node dist/server.js"',
                  ]},
                  { heading: 'Pipeline 做法（Staging / Prod）', items: [
                    'GitHub Actions step: npx typeorm migration:run -d dist/data-source.js',
                    'DATABASE_URL 存在 GitHub Secrets，由 MIS 設定',
                  ]},
                ],
              },
            },
            {
              title: 'Volume 管理職責', badges: ['RD', 'MIS'],
              desc: '各類 Volume 的負責人與處理方式',
              detail: {
                sections: [],
                autoTable: [
                  { type: 'Volume 類型', who: '誰定義', how: '誰建立/維護' },
                  { type: 'DB 數據（Named Volume）', who: 'RD（docker-compose.yml）', how: 'MIS（首次建立 + 備份策略）' },
                  { type: 'DB Migration', who: 'RD（撰寫 migration script）', how: '自動（Entrypoint 或 Pipeline 執行）' },
                  { type: '上傳檔案（圖檔、簡報）', who: 'RD（定義掛載路徑）', how: 'MIS（建立目錄 + 備份），內容由使用者產生' },
                  { type: 'SSL 憑證', who: 'MIS', how: 'MIS（掛載於 Reverse Proxy，不放應用容器）' },
                ],
                notes: [
                  '上傳檔案類 Volume 若某次部署需更新（如換一批圖檔），須列在交付物清單由指定人員手動處理',
                  '各環境的 Volume 內容各自維護，如同被 .gitignore 的環境檔',
                  'RD 交付物清單需標注本次部署是否有 Volume 相關變更',
                ],
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'dev-ci',
    title: 'Dev + CI',
    owner: ['RD', '自動化'],
    note: 'RD 自由推版，CI Pipeline 自動執行。開發完能馬上測試為最高原則。',
    tabs: [
      {
        id: 'dev-flow',
        label: '流程',
        content: {
          kind: 'steps',
          steps: [
            { title: 'RD push to develop', badges: ['RD'], desc: '開發分支不受限制，RD 可自由推版' },
            { title: 'CI Pipeline 自動執行', badges: ['自動'], desc: 'Lint → Unit Test → Build → Security Scan → Push Image（全自動）' },
            { title: 'Runner 自動部署到 Dev 環境', badges: ['自動'], desc: 'Pipeline 通過後自動部署 + DB Migration + Health Check' },
            { title: 'RD 即時測試驗證', badges: ['RD'], desc: '在 Dev 環境即時驗證功能，發現問題直接改 → 再 push → 自動更新' },
          ],
        },
      },
      {
        id: 'dev-pipeline',
        label: 'Pipeline 階段',
        content: {
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
        id: 'dev-runner',
        label: '執行環境',
        content: {
          kind: 'steps',
          steps: [
            {
              title: 'Self-hosted Runner', badges: ['MIS', 'RD'],
              desc: '內網 VM 安裝 GitHub Actions Runner，主動向 GitHub poll 任務，不需開 inbound port',
              detail: {
                sections: [
                  { heading: '運作方式', items: [
                    'RD push code 到 GitHub',
                    'GitHub Actions 產生 job',
                    '內網 Runner 主動 poll 取得 job（Outbound 443）',
                    'Runner 在內網執行：build / test / migrate / deploy',
                    '結果回報到 GitHub Actions 頁面',
                  ]},
                  { heading: 'MIS 負責', items: [
                    '準備一台內網 VM 安裝 Runner（最低 2CPU / 4GB RAM）',
                    '安裝 Docker（Runner 需要用來 build Image）',
                    '確保 VM 可 outbound 到 github.com:443',
                    '確保 VM 可存取內網的 Dev / Stage 環境',
                    '維護 Runner 服務運行',
                  ]},
                  { heading: 'RD 負責', items: [
                    '撰寫 .github/workflows/*.yml 定義 Pipeline',
                    '在 workflow 中指定 runs-on: self-hosted',
                    'DB Migration 腳本納入 Pipeline 步驟',
                    '環境變數透過 GitHub Secrets 或 .env 管理',
                  ]},
                ],
                autoTable: [
                  { type: 'Runner 安裝', who: 'MIS', how: '在內網 VM 執行 GitHub 提供的安裝腳本' },
                  { type: 'Runner 註冊', who: 'MIS', how: '將 Runner 註冊到 GitHub repo 或 org' },
                  { type: 'Workflow 撰寫', who: 'RD', how: '定義 CI/CD Pipeline YAML' },
                  { type: 'Pipeline 維護', who: 'RD', how: '新增 / 修改 Pipeline 步驟' },
                  { type: 'Runner 維運', who: 'MIS', how: '確保 Runner 服務持續運行、更新版本' },
                ],
                notes: [
                  '內網不需開 inbound port，Runner 主動向外 poll',
                  'GitHub Actions 免費額度對 Self-hosted Runner 不計費',
                ],
              },
            },
          ],
        },
      },
      {
        id: 'dev-auto-mis',
        label: 'MIS 設置',
        content: {
          kind: 'steps',
          steps: [
            {
              title: '目標：讓 RD push code 後自動更新 Dev 環境', badges: ['MIS'],
              desc: '以下是 MIS 需要完成的一次性設置，設置完成後 RD 即可享有 push-to-deploy 自動化',
              detail: {
                sections: [
                  { heading: '現況痛點', items: [
                    '前端：RD 手動 npm run build，再遠端替換 IIS 站台目錄的檔案',
                    '後端：RD 開 Visual Studio 使用「發布」功能，手動部署到遠端 IIS',
                    '流程耗時且容易出錯，每次改動都要重複操作',
                  ]},
                ],
              },
            },
            {
              title: 'Step 1：安裝 Self-hosted Runner', badges: ['MIS'],
              desc: '在 Dev 環境 VM 上安裝 GitHub Actions Runner 服務',
              detail: {
                sections: [
                  { heading: '什麼是 Runner', items: [
                    'Runner 是一支安裝在內網 VM 上的背景服務程式（Windows Service）',
                    '它會主動向 GitHub poll 取得 CI/CD 任務，不需開 inbound port',
                    'RD push code 後，Runner 自動抓取任務並在 VM 上執行 build + deploy',
                  ]},
                  { heading: '安裝步驟', items: [
                    '進入 GitHub repo → Settings → Actions → Runners → New self-hosted runner',
                    'GitHub 會產生一組專屬安裝指令與 token',
                    '在 Dev VM 上建立目錄：mkdir C:\\actions-runner',
                    '下載 Runner 安裝包（GitHub 頁面提供下載連結）',
                    '執行 config.cmd --url https://github.com/org/repo --token XXXXX',
                    '安裝為 Windows Service：svc.cmd install && svc.cmd start',
                  ]},
                  { heading: '驗證', items: [
                    '安裝完成後在 GitHub repo → Settings → Actions → Runners 可看到 Runner 狀態為 Idle',
                    'Runner 會自動保持連線，有任務時自動執行',
                  ]},
                ],
              },
            },
            {
              title: 'Step 2：安裝專案所需 SDK', badges: ['MIS'],
              desc: '在 Runner VM 上安裝前端/後端專案需要的開發工具',
              detail: {
                sections: [
                  { heading: '前端專案', items: [
                    '安裝 Node.js（版本由 RD 指定，如 v20 LTS）',
                    '驗證：node -v && npm -v',
                  ]},
                  { heading: '後端 .NET 專案', items: [
                    '安裝 .NET SDK（版本由 RD 指定，如 .NET 8）',
                    '驗證：dotnet --version',
                  ]},
                  { heading: '部署工具', items: [
                    '安裝 Web Deploy (MSDeploy)（後端 .NET 專案部署使用，建議安裝）',
                    '或使用 robocopy（Windows 內建，無需額外安裝）',
                  ]},
                ],
              },
            },
            {
              title: 'Step 3：設定權限與 IIS', badges: ['MIS'],
              desc: '確保 Runner 服務帳號有權限操作 IIS 站台',
              detail: {
                sections: [
                  { heading: '權限設定', items: [
                    'Runner Windows Service 帳號需對 IIS 站台目錄有寫入權限',
                    '若使用 MSDeploy：需要 App Pool 的停止/啟動權限',
                    '建議 Runner 直接安裝在 Dev VM 上，省去遠端部署的複雜度',
                  ]},
                  { heading: 'IIS 站台確認', items: [
                    '確認各站台的實體路徑（如 C:\\inetpub\\wwwroot\\app-name）',
                    '確認 App Pool 設定（.NET CLR 版本、Pipeline Mode）',
                    '確認 Binding（hostname、port）',
                    '可選：啟用 Application Initialization 以支援 Overlapped Recycling（零停機更新）',
                  ]},
                ],
              },
            },
            {
              title: 'Step 4：網路確認', badges: ['MIS'],
              desc: '確保 Runner VM 的網路連線正常',
              detail: {
                sections: [
                  { heading: '必要條件', items: [
                    'VM 可 outbound 到 github.com:443（Runner poll 用）',
                    'VM 可存取 IIS 站台目錄（本機或內網共用路徑）',
                    '不需開任何 inbound port',
                  ]},
                ],
              },
            },
          ],
        },
      },
      {
        id: 'dev-auto-rd',
        label: 'RD Workflow',
        content: {
          kind: 'steps',
          steps: [
            {
              title: '前端自動部署流程（IIS 靜態站台）', badges: ['RD', '自動'],
              desc: 'RD 撰寫 GitHub Actions Workflow，push 後自動 build 並部署到 IIS',
              detail: {
                sections: [
                  { heading: 'Workflow 自動執行步驟', items: [
                    'Runner checkout 程式碼',
                    '執行 npm ci && npm run build 產出打包檔',
                    '使用 robocopy 將 dist/ 同步到 IIS 站台實體路徑（如 C:\\inetpub\\wwwroot\\app）',
                    'IIS Application Pool 自動偵測檔案變更並 recycle（無需手動停機）',
                  ]},
                  { heading: 'RD 需撰寫', items: [
                    '在 repo 建立 .github/workflows/dev-deploy.yml',
                    '指定 trigger：on push to develop',
                    '指定 runs-on: self-hosted',
                    '定義 build step 與 deploy step',
                  ]},
                ],
              },
            },
            {
              title: '後端自動部署流程（.NET + IIS）', badges: ['RD', '自動'],
              desc: 'RD 撰寫 Workflow，push 後自動 dotnet publish 並部署到 IIS，取代 Visual Studio 手動發布',
              detail: {
                sections: [
                  { heading: 'Workflow 自動執行步驟', items: [
                    'Runner checkout 程式碼',
                    '執行 dotnet publish -c Release -o ./publish',
                    '使用 MSDeploy 或 robocopy 將 publish/ 部署到 IIS 站台目錄',
                    '若使用 MSDeploy：可自動停止/啟動 App Pool，確保檔案不被鎖定',
                    'Health Check 驗證部署成功',
                  ]},
                  { heading: 'RD 需撰寫', items: [
                    '在 repo 建立 .github/workflows/dev-deploy.yml',
                    '指定 trigger：on push to develop',
                    '指定 runs-on: self-hosted',
                    '定義 dotnet publish step 與 deploy step',
                    '環境變數透過 GitHub Secrets 管理',
                  ]},
                ],
              },
            },
            {
              title: '設定完成後的日常流程', badges: ['RD'],
              desc: 'MIS 設置完成後，RD 的日常只需要 push code',
              detail: {
                sections: [
                  { heading: '日常操作', items: [
                    'RD 在 feature/* 分支開發完成',
                    'MR 合併到 develop（或直接 push to develop）',
                    'GitHub Actions 自動觸發 → Runner 自動 build → 自動部署到 Dev IIS',
                    'RD 直接在 Dev 環境驗證，不需做任何部署操作',
                  ]},
                ],
                notes: [
                  'IIS 不需要移除，問題在於手動流程而非 IIS 本身',
                  'IIS 支援 Overlapped Recycling，檔案更新後自動 recycle，不需停機',
                  '未來新系統可評估改用 Docker 容器化部署',
                ],
              },
            },
          ],
        },
      },
      {
        id: 'dev-deploy-notes',
        label: '部署注意事項',
        content: {
          kind: 'steps',
          steps: [
            {
              title: 'DB Migration：script 在 app 容器，DB 在 db 容器', badges: ['RD'],
              desc: 'CI build 的是 app Image，DB 用官方 Image（postgres/mysql/mssql）不需自己 build',
              detail: {
                sections: [
                  { heading: '運作原理', items: [
                    'app 容器與 db 容器是分開的（一容器一行程原則）',
                    'Migration script 打包在 app Image 裡，但透過 DB 連線去執行 SQL 修改 schema',
                    '跟用 SSMS / pgAdmin 連資料庫下 ALTER TABLE 一樣，只是改成程式自動執行',
                    '這是業界標準做法，RD 工作量不增加，只需在啟動指令加一行',
                  ]},
                  { heading: '各環境建議方案', items: [
                    'Dev：Entrypoint -- 容器啟動時自動跑 migration 再啟動應用，最簡單',
                    'Staging / Prod：Pipeline step -- 部署前先跑 migration，失敗就不繼續部署，最安全',
                  ]},
                ],
              },
            },
            {
              title: '環境變數 / Secrets 變更', badges: ['RD', 'MIS'],
              desc: '自動部署只更新程式碼，不會自動同步環境變數',
              detail: {
                sections: [
                  { heading: '問題', items: [
                    '新版本新增了環境變數，但伺服器上的 .env 或 GitHub Secrets 沒同步更新',
                    '部署後應用啟動但功能異常（缺少必要的設定值）',
                  ]},
                  { heading: '解法', items: [
                    'RD 交付時須附「環境變數異動清單」，標注新增/修改/刪除的變數',
                    'MIS 收到後手動更新對應環境的設定',
                    '交付物清單已包含「環境變數清單」項目',
                  ]},
                ],
              },
            },
            {
              title: 'Volume 內容變更（上傳檔案、憑證等）', badges: ['RD', 'MIS'],
              desc: '上傳檔案類 Volume 不在自動部署範圍，各環境各自維護',
              detail: {
                sections: [
                  { heading: '問題', items: [
                    'Volume 掛載的檔案（使用者上傳的圖檔、SSL 憑證等）不在 Image 裡也不在 Git 裡',
                    '如同被 .gitignore 的環境檔，各環境必須各自維護',
                    '自動部署不會也不應該去動這些檔案',
                  ]},
                  { heading: '解法', items: [
                    '部署時不需處理 -- Volume 掛載設定好後，容器重建不影響已有檔案',
                    '若某次部署確實需要更新 Volume 檔案（如換一批圖檔），須列在交付物清單由指定人員手動處理',
                    'SSL 憑證放在 Reverse Proxy（Nginx），不放應用容器，由 MIS 管理',
                  ]},
                ],
              },
            },
            {
              title: '容器啟動順序', badges: ['RD'],
              desc: 'app 容器起來了但 DB 還沒 ready，造成連線失敗',
              detail: {
                sections: [
                  { heading: '問題', items: [
                    'docker-compose up 時 app 比 db 先啟動完成',
                    'app 嘗試連 DB 但 DB 還在初始化，連線失敗',
                  ]},
                  { heading: '解法', items: [
                    'docker-compose.yml 設定 depends_on + condition: service_healthy',
                    'DB 容器設定 healthcheck（如 pg_isready），確認 DB ready 後 app 才啟動',
                    'app 端也建議實作連線重試（retry），雙重保護',
                  ]},
                ],
              },
            },
            {
              title: '舊容器關閉 / 使用者中斷', badges: ['RD', 'MIS'],
              desc: '部署時舊容器還在處理請求就被殺掉',
              detail: {
                sections: [
                  { heading: '問題', items: [
                    '使用者正在操作時部署新版，舊容器被強制關閉，使用者看到錯誤',
                  ]},
                  { heading: '解法', items: [
                    'docker-compose.yml 設定 stop_grace_period（如 30s），讓舊容器有時間處理完手上的請求',
                    'IIS 環境：啟用 Overlapped Recycling，新 process 啟動完成後才關舊的',
                  ]},
                ],
              },
            },
            {
              title: '磁碟空間：舊 Image 堆積', badges: ['MIS'],
              desc: '每次 build 產生新 Image，不清理會塞滿磁碟',
              detail: {
                sections: [
                  { heading: '問題', items: [
                    '每次 CI build 都會產生新的 Docker Image',
                    '舊 Image 不刪除會持續佔用磁碟空間',
                  ]},
                  { heading: '解法', items: [
                    'Pipeline 最後加一步 docker image prune -f 清理未使用的 Image',
                    '或設定排程定期執行 docker system prune',
                    'MIS 監控磁碟使用率，超過 85% 告警',
                  ]},
                ],
              },
            },
            {
              title: 'Health Check 要驗實際功能', badges: ['RD'],
              desc: 'HTTP 200 不代表服務真的正常',
              detail: {
                sections: [
                  { heading: '問題', items: [
                    '容器啟動了、HTTP 回 200，但 DB 連不上或快取沒初始化',
                    '表面上部署成功，實際上功能異常',
                  ]},
                  { heading: '解法', items: [
                    'Health Check endpoint 不只回 200，要實際驗證：DB 連線正常、關鍵 API 可回應',
                    'docker-compose.yml 的 healthcheck 使用這個 endpoint',
                    'Pipeline 部署後也用這個 endpoint 驗證',
                  ]},
                ],
              },
            },
            {
              title: 'IIS 特有問題：檔案鎖定與 web.config', badges: ['MIS'],
              desc: '僅適用 IIS 環境（非 Docker）的注意事項',
              detail: {
                sections: [
                  { heading: '檔案鎖定', items: [
                    '.NET 的 DLL 正在執行時無法覆蓋',
                    '解法：MSDeploy 會自動處理 App Pool 停止/啟動，或 Pipeline 先停 App Pool 再部署',
                  ]},
                  { heading: 'web.config 覆蓋', items: [
                    '各環境的 web.config 設定不同（DB 連線字串、API URL 等）',
                    '自動部署時不能直接覆蓋，否則會用到錯誤的設定',
                    '解法：web.config 加入 .gitignore，改用環境變數或 appsettings.{env}.json 管理差異',
                  ]},
                ],
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'staging-deploy',
    title: 'Staging 部署',
    owner: ['MIS'],
    note: 'Staging 部署僅限 MIS 操作。RD 不可自行部署 Staging，部署權限鎖定由 MIS 負責。',
    tabs: [
      {
        id: 'staging-deploy-flow',
        label: '流程',
        content: {
          kind: 'steps',
          steps: [
            { title: 'RD 交付打包檔給 MIS', badges: ['RD'], desc: 'Image + YAML + 環境變數清單 + DB Migration Script + 版本號' },
            { title: 'MIS 確認版本號與交付物', badges: ['MIS'], desc: '核對 RD 提供的版本號與 Image tag 是否一致' },
            { title: 'MIS 在 Staging 執行部署', badges: ['MIS'], desc: 'MIS 實際執行一次部署流程，確認無問題後才會以相同流程推上 Production' },
            { title: 'DB Migration 執行', badges: ['MIS'], desc: '依 RD 提供的 Migration Script 執行資料庫變更' },
            { title: 'Health Check', badges: ['MIS'], desc: '部署後驗證服務正常啟動' },
          ],
        },
      },
      {
        id: 'staging-env',
        label: '環境說明',
        content: {
          kind: 'steps',
          steps: [
            {
              title: '環境定位與比較', badges: ['MIS'],
              desc: '各環境的定位、部署規則與權限',
              detail: {
                autoTable: [
                  { type: 'Dev', who: 'RD 自由推版', how: 'push to develop 自動部署，開發測試用' },
                  { type: 'Staging', who: 'MIS 部署', how: 'RD 交付打包檔，MIS 執行部署，配置與 Prod 一致' },
                  { type: 'Production', who: 'MIS 部署', how: 'RD 送申請，MIS 審核後以與 Staging 相同流程部署' },
                  { type: '滲透測試環境', who: 'MIS 建立', how: '比照 Staging 規格切出臨時環境，測試完成後刪除' },
                  { type: 'Demo（規劃中）', who: 'RD', how: 'UI Demo 環境，讓各部門查看開發進度與介面' },
                ],
                sections: [
                  { heading: 'Staging 重點原則', items: [
                    '配置與流程必須與 Production 一致',
                    'RD 不可自行部署 Staging，所有部署由 MIS 執行',
                    'MIS 先在 Staging 驗證部署流程無問題，才以相同流程推上 Production',
                    'Staging DB 定期由 Production 備份還原，確保測試結果與正式環境一致（需評估各專案效益）',
                    '合規要求：Production 資料庫的客戶敏感資料須去識別化後才可還原至 Staging，須規劃自動去識別化腳本',
                  ]},
                  { heading: '滲透測試環境', items: [
                    '為避免干擾 Staging 上的一般功能測試',
                    '需比照 Staging 規格另切專用臨時環境',
                    '測試或掃描完成後即可刪除',
                  ]},
                ],
                notes: [],
              },
            },
          ],
        },
      },
      {
        id: 'staging-deploy-checklist',
        label: '檢核清單',
        content: {
          kind: 'stage-checklist',
          columns: ['#', '項目', '負責', '標準'],
          rows: [
            { num: '1', item: 'CI Pipeline 全綠', owner: ['RD'], standard: '0 Error' },
            { num: '2', item: 'Code Review 核准', owner: ['Reviewer'], standard: 'Approved' },
            { num: '3', item: 'Image 推至 Registry', owner: ['自動'], standard: '可查詢' },
            { num: '4', item: 'MIS 確認版本號一致', owner: ['MIS'], standard: 'RD 提供版本號與 Image tag 吻合' },
            { num: '5', item: 'MIS 在 Staging 部署成功', owner: ['MIS'], standard: '部署流程無異常' },
            { num: '6', item: 'Health Check 通過', owner: ['MIS'], standard: 'HTTP 200' },
            { num: '7', item: 'Security Scan 無 Critical/High', owner: ['自動'], standard: '附於 MR' },
            { num: '8', item: 'Staging DB 資料與 Prod 同步（含去識別化）', owner: ['MIS'], standard: '定期執行、敏感資料已去識別化' },
          ],
        },
      },
    ],
  },
  {
    id: 'staging-qa',
    title: 'Staging 驗收',
    owner: ['RD'],
    note: 'RD 在 Staging 進行功能測試與 UAT 驗收。驗收通過後簽署 Sign-off，作為上 Production 的前置條件。',
    tabs: [
      {
        id: 'staging-qa-flow',
        label: '流程',
        content: {
          kind: 'steps',
          steps: [
            { title: 'RD 進行功能測試', badges: ['RD'], desc: '在 Staging 進行實際操作測試，驗證核心功能正常',
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
                  'RD 在 Staging 僅負責測試與驗收，不可自行部署',
                  'Claude Code 可自動讀取 CHANGELOG 產生測試案例',
                ],
              },
            },
            { title: 'UAT 驗收', badges: ['RD'], desc: '最終畫面驗收，確認 UI/UX 符合需求' },
            { title: 'UAT Sign-off', badges: ['RD'], desc: '驗收通過後簽署 Sign-off，作為上 Production 的必要條件' },
          ],
        },
      },
      {
        id: 'staging-qa-checklist',
        label: '檢核清單',
        content: {
          kind: 'stage-checklist',
          columns: ['#', '項目', '負責', '標準'],
          rows: [
            { num: '1', item: 'RD 功能測試通過', owner: ['RD'], standard: '核心功能正常' },
            { num: '2', item: 'CHANGELOG 逐項驗證完成', owner: ['RD'], standard: '全部通過' },
            { num: '3', item: 'UAT 驗收通過', owner: ['RD'], standard: '簽核' },
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
            { title: '弱點報告', badges: ['技服'], desc: '產出滲透測試報告，依嚴重度分級' },
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
            { title: 'RD 合併 MR 至 main 並建立 Release Tag', badges: ['RD'], desc: 'MR 附：Stage 結果、滲透測試報告、Rollback 計畫。合併後建 Tag（v1.2.3）。版本號由 RD 提供，MIS 部署時透過版本號二次確認是否與 RD 指定一致' },
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
