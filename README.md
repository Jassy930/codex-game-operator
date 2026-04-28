# Codex Game Operator v6 - Max Autonomy Fixed

高权限游戏主理人 Agent 项目骨架。

## 当前游戏

《星核工坊》是一个浏览器端数值增长放置游戏。玩家点击星核获得能量，购买升级提升点击产能和自动产能。

## 本地运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm test
npm run build
```

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
