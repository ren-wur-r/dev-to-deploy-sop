# hotfix/*

Emergency fix branch for P0/P1 production issues. Branches from `main`, merges back to `main`.

## Naming

```
hotfix/<TASK-ID>-<short-description>
```

Examples:
- `hotfix/SOP-003-fix-critical-auth-bypass`
- `hotfix/SOP-099-fix-payment-crash`

## Rules

- Branch from `main` (not develop)
- MR to `main`, title must include `[HOTFIX]`
- Code Review can be simplified: 1 reviewer + Verbal Approval (formal review done after)
- Security Scan and Health Check CANNOT be skipped
- After merge, MIS creates a patch tag (e.g. `v1.2.4`)
- Must cherry-pick back to `develop` and `staging` after merge

## Flow

```
main --> hotfix/SOP-003-xxx --> MR [HOTFIX] to main --> tag v1.2.4 --> deploy
                                                    --> cherry-pick to develop
                                                    --> cherry-pick to staging
```

## Post-mortem

- 24hr deadline to submit incident report
- Must include: timeline, root cause, fix, prevention measures
