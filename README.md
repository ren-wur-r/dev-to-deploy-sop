# BCCS Dev-to-Deploy SOP

v1.1 | March 2026

---

## Branch: `develop` — Development Integration

Development integration branch. All feature and bugfix branches merge here first before going to Stage.

開發整合分支。所有 feature 和 bugfix 分支先合併到這裡，再推到 Stage。

### Rules / 規則

- Allow direct push (MR recommended) / 允許直接 push（建議走 MR）
- Push triggers automatic Dev Image build / Push 自動觸發 Dev Image 建置
- All `feature/*` and `bugfix/*` branches merge here via MR / 所有功能與修復分支透過 MR 合併至此

### Flow / 流程

```
feature/JIRA-123-desc --> MR --> develop --> MR --> staging
```

### Who / 負責人

- RD: push code, create MR / RD：推送程式碼、發起 MR
- Reviewer: review and approve MR / Reviewer：審查並核准 MR
