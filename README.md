# BCCS Dev-to-Deploy SOP

v1.1 | March 2026

---

## Branch: `staging` — Stage / UAT

Stage and UAT environment branch. Merge to this branch triggers automatic deployment to Stage. Used for integration testing, security scanning, and acceptance testing.

測試與驗收環境分支。合併至此分支自動觸發 Stage 部署，用於整合測試、資安掃描與驗收。

### Rules / 規則

- Direct push is prohibited / 禁止直接 push
- Requires at least 1 reviewer approval / 至少 1 位 Reviewer 核准
- Merge triggers auto-deploy to Stage / 合併觸發自動部署至 Stage
- Must pass Health Check after deployment / 部署後須通過 Health Check

### Flow / 流程

```
develop --> MR --> staging --> auto-deploy --> UAT --> MR --> main
```

### Gate / 檢核項目

All must pass before proceeding to pentest / 以下全數通過才能進入滲透測試：

1. CI Pipeline green / CI 全綠
2. Code Review approved / Code Review 核准
3. Image pushed to Registry / Image 推送成功
4. Stage deployed + Health Check / 部署 + 健康檢查通過
5. Security Scan: 0 Critical/High / 安全掃描無高風險弱點
6. UAT sign-off / 驗收簽核
