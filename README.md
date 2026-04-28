# Codex Game Operator v6 - Max Autonomy Fixed

高权限游戏主理人 Agent 项目骨架。

## 当前游戏

《星核工坊》是一个浏览器端数值增长放置游戏。玩家点击星核获得能量，连击推进过载奖励，购买升级提升点击产能、自动产能、总产能和过载奖励，主操作区会显示点击、过载、购买结果和目标完成提示。100K 后星图计划会提供中后段项目目标，星图总览会显示完成数、下一段、奖励和航线预告，项目列表会标记当前航段；点亮星图后会出现谐振校准过载成长线，航线策略会延伸出点火航校、巡航航校和均衡校准三段策略专精目标，500K 后继续展开深空航段，1.5M 后进入星门远征，2M 后布置外环信标，2.75M 后建设彗尾船坞，3.5M 后校准引力航标，4.5M 后建立暗流观测站；未完成项目会进入目标条并直接显示奖励，升级区会高亮当前目标推荐项，回到页面时可看到离线收益回收提示。

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

## 部署

主分支 push 会通过 `.github/workflows/pages.yml` 构建并部署 GitHub Pages：

https://jassy930.github.io/codex-game-operator/

备用 Vercel 版本：

https://dist-kblvoc9qq-wangf930-2746s-projects.vercel.app

部署前必须通过：

```bash
npm install
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
