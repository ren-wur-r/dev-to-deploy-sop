# staging

Stage / UAT environment branch.

Merge to this branch triggers automatic deployment to Stage environment. Used for integration testing, security scanning, and UAT acceptance.

## Rules

- Direct push is prohibited
- Requires at least 1 reviewer approval
- Merge triggers auto-deploy to Stage environment
- Must pass Health Check after deployment

## Flow

```
develop --> MR --> staging --> auto-deploy to Stage --> UAT --> MR --> main
```

## Who

- RD: create MR from develop, execute UAT
- MIS: manage Stage environment, DAST scanning
- Reviewer: approve MR

## Gate

All items must pass before proceeding to pentest:
1. CI Pipeline green (Lint / Test / Build / Scan)
2. Code Review approved
3. Image pushed to Registry
4. Stage deployed + Health Check passed
5. Security Scan: 0 Critical / High
6. UAT sign-off
