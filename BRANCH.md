# develop

Development integration branch.

All feature branches merge here first. This is where individual work gets integrated before going to Stage.

## Rules

- Allow direct push (but MR is recommended)
- Push triggers automatic Dev Image build
- All feature/* and bugfix/* branches merge here via MR

## Flow

```
feature/JIRA-123-desc --> MR --> develop --> MR --> staging
```

## Who

- RD: push code, create MR
- Reviewer: approve MR
