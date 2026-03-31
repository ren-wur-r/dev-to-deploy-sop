# BCCS Dev-to-Deploy SOP

v1.1 | March 2026

---

## Branch: `hotfix/*` — Emergency Production Fix

Emergency fix branch for P0/P1 production issues. Branches from `main`, merges back to `main`.

緊急修復分支，用於 P0/P1 正式環境問題。從 main 建立，合併回 main。

### Naming / 命名

```
hotfix/<PROJECT-TASKID>-<short-description>
```

Examples / 範例：
- `hotfix/SOC-003-fix-critical-auth-bypass`
- `hotfix/PMS-099-fix-payment-crash`

### Rules / 規則

- Branch from `main` (not develop) / 從 main 建立（不是 develop）
- MR to `main`, title must include `[HOTFIX]` / MR 標題須標記 [HOTFIX]
- Code Review simplified: 1 reviewer + Verbal Approval / Code Review 可簡化：1 人 + 口頭核准
- Security Scan and Health Check CANNOT be skipped / 安全掃描與健康檢查不可跳過
- MIS creates patch tag after merge (e.g. `v1.2.4`) / MIS 合併後建立 Patch Tag
- Must cherry-pick back to `develop` and `staging` / 須 cherry-pick 回 develop 與 staging

### Flow / 流程

```
main --> hotfix/SOC-003-xxx --> MR [HOTFIX] to main --> tag v1.2.4 --> deploy
                                                    --> cherry-pick to develop
                                                    --> cherry-pick to staging
```

### Post-mortem / 事故報告

- 24hr deadline / 24 小時內提交
- Include: timeline, root cause, fix, prevention / 包含：時間線、根本原因、修復、預防措施
