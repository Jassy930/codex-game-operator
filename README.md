# Codex Game Operator v6 - Max Autonomy Fixed

高权限游戏主理人 Agent 项目骨架。

## 当前游戏

《星核工坊》是一个浏览器端数值增长放置游戏。玩家点击星核获得能量，连击推进过载奖励，购买升级提升点击产能、自动产能、总产能和过载奖励，主操作区会显示点击、过载、购买结果和目标完成提示。100K 后星图计划会提供中后段项目目标，星图总览会显示完成数、下一段、奖励、目标分轨、阶段导航、章节目标、章节奖励、奖励进度、奖励目标、里程碑、航线焦点、航线构成和航线预告，目标分轨会同时标出下一个累计航段和下一个升级航段，阶段导航会把 49 段拆成首段星图、专精校准、深空基建、远航长尾四个阶段，并显示本阶段还剩几段和下一阶段名称，里程碑会标出当前章节终点和终局航点，章节奖励会按章节汇总总产能、点击、自动和过载奖励数量，奖励目标会按四条成长线标出下一条未完成奖励航段；项目列表会标记当前航段；点亮星图后会出现谐振校准过载成长线，航线策略会延伸出点火航校、巡航航校和均衡校准三段策略专精目标。星图路线目前扩展到 49 段，覆盖 500K 后深空航段、1.5M 后星门远征、2M 后外环信标，并一路延伸到 320M 后辉潮巡航环、420M 后星澜汇流庭、550M 后穹海棱镜、720M 后极光谱站、950M 后银翼曙环、1.2B 后晨星方舟、1.6B 后星潮谐振庭、2.1B 后星辉远港、2.8B 后辉翼巡航港、3.7B 后星穹导航塔、4.9B 后星瀑谐振门、6.5B 后星焰引航环、8.6B 后星冕远航港和 11.4B 后曜冕星门；未完成项目会进入目标条并直接显示奖励，升级区会高亮当前目标推荐项，回到页面时可看到离线收益回收提示。

## 本地运行

```bash
bun install
bun run dev
```

## 验证

```bash
bun run test
bun run build
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
bun install
bun run test
bun run build
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
