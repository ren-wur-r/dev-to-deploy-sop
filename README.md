# BCCS Dev-to-Deploy SOP

v1.2 | April 2026

---

## Branch: `main` — Production

Production branch. Reflects the current live release.

正式環境分支。反映目前線上運行的版本。

### Rules / 規則

- Direct push is prohibited / 禁止直接 push
- Changes come through MR from `staging` or `hotfix/*` / 變更透過 staging 或 hotfix MR 進入
- Requires at least 1 reviewer approval / 至少 1 位 Reviewer 核准
- MIS creates release tag after merge (e.g. `v1.2.3`) / MIS 合併後建立版本 Tag
- Only MIS can approve production deployment / 僅 MIS 可核准正式部署

### Branch Strategy / 分支策略

| Branch | Purpose / 用途 | From / 從哪來 | To / 合併到 |
|--------|---------------|--------------|------------|
| `main` | Production / 正式環境 | - | - |
| `staging` | Stage + UAT / 測試驗收 | `develop` | `main` |
| `develop` | Dev integration / 開發整合 | - | `staging` |
| `feature/*` | New feature / 新功能開發 | `develop` | `develop` |
| `bugfix/*` | Bug fix / 非緊急修復 | `develop` | `develop` |
| `hotfix/*` | Emergency fix / 緊急修復 | `main` | `main` + cherry-pick |
