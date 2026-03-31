# bugfix/*

Bug fix branch. Same rules as feature/*, but for fixing non-critical bugs found during development or testing.

## Naming

```
bugfix/<TASK-ID>-<short-description>
```

Examples:
- `bugfix/SOP-002-fix-session-timeout`
- `bugfix/SOP-033-fix-csv-export-encoding`

## Rules

- Branch from `develop`
- Follow Conventional Commits (use `fix` type)
- When done, create MR to `develop`

## Flow

```
develop --> bugfix/SOP-002-xxx --> commits --> MR to develop
```

## Note

This is for non-urgent bugs. For P0/P1 production issues, use `hotfix/*` branch (branches from `main`).
