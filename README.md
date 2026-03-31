# BCCS Dev-to-Deploy SOP

v1.1 | March 2026

---

## Branch: `feature/*` — New Feature Development

Feature development branch. One branch per feature or task.

功能開發分支。每個功能或任務建立一個分支。

### Naming / 命名

```
feature/<PROJECT-TASKID>-<short-description>
```

Examples / 範例：
- `feature/SOC-001-add-login-page`
- `feature/PMS-015-refactor-auth-module`
- `feature/SCAN-042-dashboard-api`

### Rules / 規則

- Branch from `develop` / 從 develop 建立
- One feature per branch / 一個分支一個功能
- Follow Conventional Commits / 遵循 Conventional Commits 格式
- When done, create MR to `develop` / 完成後發 MR 至 develop

### Flow / 流程

```
develop --> feature/SOC-001-xxx --> commits --> MR to develop
```

### Commit Examples / 範例 Commit

```
feat(auth): add login page layout
feat(auth): implement form validation
test(auth): add login form unit tests
fix(auth): resolve password field not clearing on error
```

### Who / 負責人

- RD: create branch, develop, push, create MR / RD：建立分支、開發、推送、發起 MR
- Reviewer: review and approve MR / Reviewer：審查並核准 MR
