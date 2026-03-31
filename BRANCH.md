# feature/*

Feature development branch. One branch per feature or task.

## Naming

```
feature/<TASK-ID>-<short-description>
```

Examples:
- `feature/SOP-001-add-login-page`
- `feature/SOP-015-refactor-auth-module`
- `feature/SOP-042-dashboard-api`

## Rules

- Branch from `develop`
- One feature per branch
- Follow Conventional Commits for all commits
- When done, create MR to `develop` and assign reviewer

## Flow

```
develop --> feature/SOP-001-xxx --> commits --> MR to develop
```

## Commit examples on this branch

```
feat(auth): add login page layout
feat(auth): implement form validation
test(auth): add login form unit tests
fix(auth): resolve password field not clearing on error
```

## Who

- RD: create branch, develop, push, create MR
- Reviewer: review and approve MR
