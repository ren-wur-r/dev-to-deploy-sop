# main

Production branch. Reflects the current live release.

## Rules

- Direct push is prohibited
- All changes come through MR from `staging` (normal) or `hotfix/*` (emergency)
- Requires at least 1 reviewer approval
- MIS creates release tag (e.g. `v1.2.3`) after merge
- Only MIS can approve and execute production deployment

## Flow

```
staging --> MR --> main --> tag v1.2.3 --> Production Pipeline --> MIS approve --> deploy
```

## Branches in this repo

| Branch | Purpose | Branches from | Merges to |
|--------|---------|---------------|-----------|
| `main` | Production | - | - |
| `staging` | Stage / UAT | `develop` | `main` |
| `develop` | Dev integration | - | `staging` |
| `feature/*` | New features | `develop` | `develop` |
| `bugfix/*` | Non-urgent fixes | `develop` | `develop` |
| `hotfix/*` | P0/P1 emergency | `main` | `main` + cherry-pick to develop & staging |

Each branch has a `BRANCH.md` explaining its purpose and rules. Switch to any branch to read it.
