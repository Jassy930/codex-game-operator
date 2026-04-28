# Codex Game Operator v6 - Max Autonomy Fixed

高权限游戏主理人 Agent 项目骨架。

## 启动

```bash
git init
chmod +x scripts/*.sh ops/*.sh
SLEEP_SECONDS=60 ./scripts/codex-operator-loop.sh
```

## 前置配置

```bash
gh auth login
vercel login
git remote add origin <your_repo_url>
git push -u origin main
```
