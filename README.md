# BCCS Dev-to-Deploy SOP

v1.1 | March 2026

---

## Branch: `bugfix/*` — Bug Fix

Bug fix branch. Same rules as feature/*, but for fixing non-critical bugs found during development or testing.

非緊急 Bug 修復分支。規則與 feature/* 相同，用於修復開發或測試階段發現的問題。

### Naming / 命名

```
bugfix/<PROJECT-TASKID>-<short-description>
```

Examples / 範例：
- `bugfix/SOC-002-fix-session-timeout`
- `bugfix/PMS-033-fix-csv-export-encoding`

### Rules / 規則

- Branch from `develop` / 從 develop 建立
- Follow Conventional Commits (use `fix` type) / 使用 fix 類型
- When done, create MR to `develop` / 完成後發 MR 至 develop

### Flow / 流程

```
develop --> bugfix/SOC-002-xxx --> commits --> MR to develop
```

### Note / 注意

This is for non-urgent bugs. For P0/P1 production issues, use `hotfix/*` (branches from `main`).

此分支用於非緊急 Bug。P0/P1 正式環境問題請使用 `hotfix/*`（從 main 建立）。
