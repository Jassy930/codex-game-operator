# Decision

## 2026-05-01 Product decision：远航对照条当前路线宽栏

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 22:21 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经把当前路线置顶，并降低非当前路线权重，但桌面端仍使用协同/绕行双列宽度。当前路线虽然排在第一槽，身份、阶段、动作、收益、资源和进度短标仍被压在半宽槽里，玩家在 20M 后执行当前路线时还要读很多被压缩的短标。

本轮决策：

- 新增“远航对照条当前路线宽栏”。
- `src/styles.css` 在 `.far-dispatch-branch-choice-summary` 存在 `.is-active-route` 时切换为单列宽栏，让置顶后的当前路线获得完整横向空间；非当前路线继续保留在下方并沿用降噪与悬停恢复。
- `tests/game.test.js` 增加静态断言，覆盖 active-route 宽栏选择器。
- 该改动只调整远航路线对照条布局和测试，不新增可见文字、不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 22:21 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-summary:has(.far-dispatch-branch-choice-summary-item.is-active-route)` 和 `grid-template-columns: minmax(0, 1fr)`。
- `tests/game.test.js` 覆盖远航对照条当前路线宽栏静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 active-route 宽栏选择器和单列 grid。
- 发布验证已通过：提交 `31e1809` 已推送到 `origin/main`；GitHub Pages workflow `25218149182` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 active-route 宽栏选择器和 `grid-template-columns: minmax(0, 1fr)`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前路线宽栏、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T14:30:16Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359771571`。
- 已回复 GitHub Issue #4，说明本轮用当前路线宽栏降低半宽短标压缩和文字密度压力，issue 保持 open，更新时间为 2026-05-01T14:31:15Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359776593`。
- 回复后同步 GitHub Issues：2026-05-01 22:31 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 22:31 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` / `ROBOT` 相关变量名，当前目录、`/home/jassy/glm` 和用户目录两层内未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #6 和 #4，以及当前远航路线对照条实现复盘。

## 2026-05-01 Product decision：远航对照条当前路线置顶

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 22:09 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经突出当前路线、降低非当前路线权重，并在当前路线内强化身份、阶段、下一步动作、本步收益、资源取向、资源代价、回航结果、资源符号和迷你进度轨。但当当前路线是绕行时，它仍位于对照条第二个槽位，玩家需要先扫过协同槽再看到当前绕行路线。

本轮决策：

- 新增“远航对照条当前路线置顶”。
- `src/app.js` 在渲染路线对照条时，复制 `branchChoices` 并按 `choice.active` 排序，让本轮已选协同/绕行路线优先显示；没有当前路线时保持原有协同/绕行顺序。
- `tests/game.test.js` 增加静态断言，覆盖 `orderedChoices`、`active` 优先排序和对照条渲染绑定。
- 该改动只调整远航路线对照条展示顺序和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 22:09 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 包含 `orderedChoices` 与 `Number(Boolean(b.active)) - Number(Boolean(a.active))` 排序。
- `tests/game.test.js` 覆盖远航对照条当前路线置顶静态绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `orderedChoices` 与 active 优先排序。
- 发布验证已通过：提交 `f4a7a91` 已推送到 `origin/main`；GitHub Pages workflow `25217599903` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `orderedChoices` 与 active 优先排序。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前路线置顶、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T14:15:02Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359703564`。
- 已回复 GitHub Issue #4，说明本轮用当前路线置顶降低文字扫视压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T14:15:03Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359703567`。
- 回复后同步 GitHub Issues：2026-05-01 22:15 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 22:15 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` / `ROBOT` 相关变量名，当前目录、`/home/jassy/glm` 和用户目录两层内未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #6 和 #4，以及当前远航路线对照条实现复盘。

## 2026-05-01 Product decision：远航对照条非当前路线降噪

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 21:52 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经把当前路线身份、阶段、动作、收益路径、第二步按钮、本步收益、资源取向、资源代价、回航结果、资源符号和迷你进度轨都纳入扫视层，但非当前路线仍保持接近同等视觉权重。玩家选定协同或绕行后，仍需要在当前路线和另一条备选路线之间做视觉筛选。

本轮决策：

- 新增“远航对照条非当前路线降噪”。
- `src/styles.css` 在路线对照条存在 `.is-active-route` 时，轻度降低非当前路线的透明度和饱和度，并在悬停时恢复可读性。
- `tests/game.test.js` 增加静态断言，覆盖 `:has(.is-active-route)` 非当前路线降噪选择器与悬停恢复。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 21:52 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线存在时的非当前路线降噪选择器和悬停恢复。
- `tests/game.test.js` 覆盖远航对照条非当前路线降噪静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `far-dispatch-branch-choice-summary:has(.far-dispatch-branch-choice-summary-item.is-active-route)` 和 `filter: saturate(0.72)`。
- 发布验证已通过：提交 `0961de8` 已推送到 `origin/main`；GitHub Pages workflow `25217086952` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含非当前路线降噪选择器、`filter: saturate(0.72)` 和悬停恢复 `filter: saturate(0.94)`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条非当前路线降噪、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T14:00:56Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359638830`。
- 已回复 GitHub Issue #4，说明本轮用非当前路线降噪降低文字筛选压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T14:00:56Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359638840`。
- 回复后同步 GitHub Issues：2026-05-01 22:01 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 22:01 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` / `ROBOT` 相关变量名，当前目录、`/home/jassy/glm` 和用户目录两层内未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #6 和 #4，以及当前远航路线对照条实现复盘。

## 2026-05-01 Product decision：远航对照条当前资源符号锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 21:34 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经突出当前路线身份、阶段、下一步动作、收益路径、第二步按钮、本步收益、资源取向、资源代价、回航结果和迷你进度轨，但左侧资源符号仍和非当前路线同权重。玩家能读到 `保当前` / `推累计` 和 `无消耗` / `消耗当前`，但当前路线左侧“保留当前资源 / 投送累计航段”的图形信号还不够强。

本轮决策：

- 新增“远航对照条当前资源符号锚点”。
- `src/app.js` 把 `choice.routeResourceText` 纳入路线对照槽 `title`，让悬停标题保留资源语义。
- `src/styles.css` 只强化 `.far-dispatch-branch-choice-summary-item.is-active-route` 内的 `is-current` / `is-progress` 资源符号：协同符号更亮、绕行投送箭头更强，不新增可见文字。
- `tests/game.test.js` 增加静态断言，覆盖当前路线资源符号锚点样式绑定与 `routeResourceText` 标题语义。
- 该改动只调整远航路线对照条展示层和可访问辅助语义，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 21:34 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 在路线对照槽标题中包含 `choice.routeResourceText`。
- `src/styles.css` 包含当前路线 `is-current` / `is-progress` 资源符号选择器。
- `tests/game.test.js` 覆盖远航对照条当前资源符号锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `choice.routeResourceText`、当前路线资源符号选择器和 `transform-origin: center`。
- 发布验证已通过：提交 `2a988e5` 已推送到 `origin/main`；GitHub Pages workflow `25216542669` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `choice.routeResourceText`，线上 `src/styles.css` 已确认包含当前路线资源符号锚点样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前资源符号锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T13:45:59Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359574572`。
- 已回复 GitHub Issue #4，说明本轮用当前资源符号锚点降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T13:46:18Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359575917`。
- 回复后同步 GitHub Issues：2026-05-01 21:46 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 21:46 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` / `ROBOT` 相关变量名，当前目录、`/home/jassy/glm` 和用户目录两层内未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #6 和 #4，以及当前远航路线对照条实现复盘。

## 2026-05-01 Product decision：点火连击读数命中跳闪

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 21:18 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮处理 #5“点火按钮太薄弱、增加点击反馈和点击欲望”。

当前最大问题：点火按钮已经有按住即时反冲、按住压光、落点特效、收益浮层、蓄能轨、连击点、中心标签、外层轮廓和下一击预告命中反馈，但按钮下方的 `连击 0` / `稳定` 读数仍只在文字上更新。玩家点火后可以看到按钮本体反馈，却还需要从静态读数里确认本次连击与过载状态是否已经更新。

本轮决策：

- 新增“点火连击读数命中跳闪”。
- `src/styles.css` 复用现有 `.core-button.is-pulsing` 与 `.core-button.is-overload-impact` 短时状态：普通命中时让 `#comboValue` 播放短促读数跳闪；过载命中时让 `#comboValue` 和 `#pulseValue` 播放更强读数跳闪。
- `tests/game.test.js` 增加静态断言，覆盖普通/过载读数选择器与两套 keyframes。
- 该改动只调整点火按钮相邻读数展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 21:18 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `coreComboReadoutHit`、`coreComboReadoutOverloadHit`、普通命中 `#comboValue` 选择器和过载命中 `#comboValue` / `#pulseValue` 选择器。
- `tests/game.test.js` 覆盖点火连击读数命中跳闪静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `coreComboReadoutHit`、`coreComboReadoutOverloadHit`、普通命中 `#comboValue` 选择器和过载命中 `#comboValue` / `#pulseValue` 选择器。
- 发布验证已通过：提交 `82e5ca5` 已推送到 `origin/main`；GitHub Pages workflow `25215991193` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含点火连击读数命中跳闪样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火连击读数命中跳闪、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T13:27:56Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4359494970`。
- 回复后同步 GitHub Issues：2026-05-01 21:28 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 21:29 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` / `ROBOT` 相关变量名，当前目录、`/home/jassy/glm` 和用户目录两层内未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #5 和当前点火按钮实现复盘。

## 2026-05-01 Product decision：远航对照条当前路线身份锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 21:02 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经突出当前路线边栏、推进节点、当前动作、本步收益、资源代价、回航结果、阶段、取向、收益路径和第二步按钮，但当前路线首行身份短标 `协同 · 当前路线` 或 `绕行 · 当前路线` 仍和普通路线身份同权重。玩家能看到当前路线内的各个锚点，却仍可能先从边栏、第二步按钮或颜色反推这条当前路线到底是协同还是绕行。

本轮决策：

- 新增“远航对照条当前路线身份锚点”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route strong` 增加静态胶囊边框、轻量背景和内描边，并给当前绕行路线提供单独颜色。
- `tests/game.test.js` 增加静态断言，覆盖当前路线身份短标样式绑定。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 21:02 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线身份短标选择器和当前绕行路线覆盖。
- `tests/game.test.js` 覆盖远航路线对照条当前路线身份锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含当前路线身份短标选择器和当前绕行路线覆盖。
- 发布验证已通过：提交 `519d3ab` 已推送到 `origin/main`；GitHub Pages workflow `25215454541` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含当前路线身份锚点样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前路线身份锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T13:11:18Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359420801`。
- 已回复 GitHub Issue #4，说明本轮用当前路线身份锚点降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T13:11:38Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359422086`。
- 回复后同步 GitHub Issues：2026-05-01 21:11 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 21:11 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和 `/home/jassy/glm` 相关上级目录未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #6 和 #4，以及当前远航路线对照条实现复盘。

## 2026-05-01 Product decision：远航对照条当前第二步按钮锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 20:51 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经突出当前路线、推进节点、当前动作、本步收益、资源代价、回航结果、阶段、取向和收益路径，但当前路线里的第二步按钮短标 `2 谐振脉冲` 或 `2 巡航回收` 仍和非当前路线同权重。玩家在执行当前路线时可以看到完整收益路径，却仍需要把这条路线实际要点的分支按钮从普通短标里重新扫一遍。

本轮决策：

- 新增“远航对照条当前第二步按钮锚点”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-step` 增加静态胶囊边框、轻量背景和内描边，并给当前绕行路线提供单独颜色。
- `tests/game.test.js` 增加静态断言，覆盖当前路线第二步按钮短标样式绑定。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 20:51 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线第二步按钮短标选择器和当前绕行路线覆盖。
- `tests/game.test.js` 覆盖远航路线对照条当前第二步按钮锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含当前路线第二步按钮短标选择器和当前绕行路线覆盖。
- 发布验证已通过：提交 `69e6e63` 已推送到 `origin/main`；GitHub Pages workflow `25215019125` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含当前第二步按钮锚点样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前第二步按钮锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:56:15Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359364332`。
- 已回复 GitHub Issue #4，说明本轮用当前第二步按钮锚点降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:56:33Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359365461`。
- 回复后同步 GitHub Issues：2026-05-01 20:56 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 20:57 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内未发现 `.env*` 文件，用户目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #6 和 #4，以及当前远航路线对照条实现复盘。

## 2026-05-01 Product decision：远航对照条当前收益路径锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 20:35 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经突出当前路线、推进节点、当前动作、本步收益、资源代价、回航结果、阶段和取向，但三步收益路径 `校准/补给/闭环` 或 `校准/投送/闭环` 仍和非当前路线同权重。玩家在执行当前路线时可以看到本步收益，但仍需要把三步收益落点从普通短标里重新扫一遍。

本轮决策：

- 新增“远航对照条当前收益路径锚点”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-reward` 增加静态胶囊边框、轻量背景和内描边，并给当前绕行路线提供单独颜色。
- `tests/game.test.js` 增加静态断言，覆盖当前路线收益路径短标样式绑定。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 20:35 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线收益路径短标选择器和当前绕行路线覆盖。
- `tests/game.test.js` 覆盖远航路线对照条当前收益路径锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含当前路线收益路径短标选择器和当前绕行路线覆盖。
- 发布验证已通过：提交 `71e5009` 已推送到 `origin/main`；GitHub Pages workflow `25214646103` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含当前收益路径锚点样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前收益路径锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:43:32Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359317668`。
- 已回复 GitHub Issue #4，说明本轮用当前收益路径锚点降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:43:45Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359318435`。
- 回复后同步 GitHub Issues：2026-05-01 20:43 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 20:44 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内未发现 `.env*` 文件，用户目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。
- 本轮未新增外部网页调研；依据来自真实 GitHub 反馈 #6 和 #4，以及当前远航路线对照条实现复盘。

## 2026-05-01 Product decision：远航对照条当前取向锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 20:23 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经有当前路线边栏、推进脉冲、当前动作亮环、当前收益亮点、当前资源代价锚点、当前回航结果锚点和当前阶段锚点，但当前路线里的取向短标 `保当前` / `推累计` 仍和普通路线同权重。玩家扫当前路线时可以看到阶段、动作、收益、代价和结果，但还需要从代价或路线类型反推“这条路线现在是在保当前资源还是推累计航段”。

本轮决策：

- 新增“远航对照条当前取向锚点”。
- `src/app.js` 给 `.far-dispatch-branch-choice-summary-intent` 补充 `is-preserve` / `is-advance` 状态类，复用现有 `routeIntentKind`，不新增文本字段。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-intent` 增加胶囊边框、轻量背景和内描边，并为 `is-advance` 提供推进累计航段的高亮颜色。
- `tests/game.test.js` 增加静态断言，覆盖当前路线取向短标状态类与样式绑定。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 20:23 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 为路线对照条取向短标渲染 `is-preserve` / `is-advance` 状态类。
- `src/styles.css` 包含当前路线取向短标选择器和 `is-advance` 推累计颜色覆盖。
- `tests/game.test.js` 覆盖远航路线对照条当前取向锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含当前路线取向短标状态类、`is-preserve` 和 `is-advance` 选择器。
- 发布验证已通过：提交 `eb70d99` 已推送到 `origin/main`；GitHub Pages workflow `25214271008` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `far-dispatch-branch-choice-summary-intent is-`，线上 `src/styles.css` 已确认包含 `is-preserve` / `is-advance` 和当前路线取向锚点样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前取向锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:30:08Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359267819`。
- 已回复 GitHub Issue #4，说明本轮用当前取向锚点降低资源目的反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:30:09Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359267861`。
- 回复后同步 GitHub Issues：2026-05-01 20:30 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 20:30 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级三层内未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条当前阶段锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 20:07 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经有当前路线边栏、推进脉冲、当前动作亮环、当前收益亮点、当前资源代价锚点和当前回航结果锚点，但当前阶段短标仍和普通路线同权重。玩家在 1/3 分支、2/3 回航或整备阶段扫当前路线时，需要先确认“这条当前路线处于哪一步”，否则仍可能先读动作、收益和结果，再回头确认阶段。

本轮决策：

- 新增“远航对照条当前阶段锚点”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-phase` 增加胶囊边框、轻量背景和内描边。
- `tests/game.test.js` 增加静态断言，覆盖当前路线阶段短标选择器。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 20:07 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线阶段短标选择器。
- `tests/game.test.js` 覆盖远航路线对照条当前阶段锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含当前路线阶段短标选择器。
- 发布验证已通过：提交 `b35c99c` 已推送到 `origin/main`；GitHub Pages workflow `25213861449` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含当前路线阶段短标选择器。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前阶段锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:14:59Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359213222`。
- 已回复 GitHub Issue #4，说明本轮用当前阶段锚点降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:15:15Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359216076`。
- 回复后同步 GitHub Issues：2026-05-01 20:15 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 20:15 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、上级目录和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条当前资源代价锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 19:55 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经有当前路线边栏、推进脉冲、当前动作亮环、当前收益亮点和当前回航结果锚点，但当前路线里的资源代价短标仍和普通路线同权重。玩家执行绕行路线时需要直接看到“消耗当前”，否则容易只扫到动作、收益和回航结果，忽略这条路线的资源取舍。

本轮决策：

- 新增“远航对照条当前资源代价锚点”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-cost` 增加胶囊边框、轻量背景和内描边。
- `src/styles.css` 为 `.far-dispatch-branch-choice-summary-cost.is-spend` 提供当前路线下的消耗态颜色，突出绕行消耗当前资源。
- `tests/game.test.js` 增加静态断言，覆盖当前路线资源代价短标选择器和消耗态选择器。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 19:55 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线资源代价短标选择器和 `is-spend` 消耗态覆盖。
- `tests/game.test.js` 覆盖远航路线对照条当前资源代价锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含当前路线资源代价短标选择器。
- 发布验证已通过：提交 `9659341` 已推送到 `origin/main`；GitHub Pages workflow `25213527872` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含当前路线资源代价短标选择器和 `.far-dispatch-branch-choice-summary-cost.is-spend` 消耗态样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前资源代价锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:01:45Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359174346`。
- 已回复 GitHub Issue #4，说明本轮用当前资源代价锚点降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T12:01:44Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359174300`。
- 回复后同步 GitHub Issues：2026-05-01 20:01 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 20:02 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录上级四层内未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条当前回航结果锚点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 19:42 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经有当前路线边栏、推进脉冲、当前动作亮环和当前收益亮点，但回航结果短标仍和普通路线同权重。玩家在执行协同/绕行路线时，可以看到现在按哪里和本步收益，却还需要再读第三行才能确认这条当前路线最终触发远航突破还是绕行突破。

本轮决策：

- 新增“远航对照条当前回航结果锚点”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-result` 增加胶囊边框、轻量背景和内描边，让当前路线的回航结果在不增加文字的情况下更容易扫到。
- `tests/game.test.js` 增加静态断言，覆盖当前路线回航结果短标选择器。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 19:42 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线回航结果短标选择器。
- `tests/game.test.js` 覆盖远航路线对照条当前回航结果锚点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含当前路线回航结果短标选择器。
- 发布验证已通过：提交 `898e682` 已推送到 `origin/main`；GitHub Pages workflow `25213180367` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含当前路线回航结果锚点样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前回航结果锚点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:48:06Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359133624`。
- 已回复 GitHub Issue #4，说明本轮用当前回航结果锚点降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:48:07Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359133675`。
- 回复后同步 GitHub Issues：2026-05-01 19:48 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 19:48 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、上级目录和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条当前收益亮点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 19:28 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经有下一步动作信标、当前路线边栏、当前路线推进脉冲和当前动作亮环，但当前路线里的“本步 +X%”收益短标仍像普通说明。玩家在协同/绕行、稳航/改道之间执行当前路线时，需要把“现在按哪里”和“这一步给什么收益”一起扫到，继续加长文字会恶化 #4。

本轮决策：

- 新增“远航对照条当前收益亮点”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-payoff` 增加胶囊边框、轻量背景和 `farDispatchSummaryActivePayoffGlow` 饱和度呼吸。
- `src/styles.css` 将该动效纳入 `prefers-reduced-motion: reduce` 兜底，减少动效敏感风险。
- `tests/game.test.js` 增加静态断言，覆盖当前路线本步收益短标选择器、关键帧和降动效兜底。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 19:28 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线本步收益短标选择器、`farDispatchSummaryActivePayoffGlow` 和 `prefers-reduced-motion: reduce` 兜底。
- `tests/game.test.js` 覆盖远航路线对照条当前收益亮点静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `farDispatchSummaryActivePayoffGlow`、当前路线本步收益短标选择器和 `prefers-reduced-motion` 兜底。
- 发布验证已通过：提交 `2243983` 已推送到 `origin/main`；GitHub Pages workflow `25212855224` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `farDispatchSummaryActivePayoffGlow`、当前路线本步收益短标选择器和 `prefers-reduced-motion` 兜底。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前收益亮点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:35:28Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359096370`。
- 已回复 GitHub Issue #4，说明本轮用当前收益亮点降低收益反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:35:47Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359097226`。
- 回复后同步 GitHub Issues：2026-05-01 19:35 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 19:35 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、上级目录和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条当前动作亮环

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 19:14 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经有下一步动作信标、当前路线边栏和当前路线推进脉冲，但当前路线中的下一步动作胶囊本身仍和普通路线动作胶囊接近。玩家在 2/3 回航、整备或绕行整备阶段需要先看到“当前路线里现在该按哪个动作”，继续追加说明文字会加重 #4 的文字密度问题。

本轮决策：

- 新增“远航对照条当前动作亮环”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route .far-dispatch-branch-choice-summary-action:not(.is-idle)` 增加亮环、轻量背景和 `farDispatchSummaryActiveActionGlow` 饱和度呼吸。
- `src/styles.css` 将该动效纳入 `prefers-reduced-motion: reduce` 兜底，减少动效敏感风险。
- `tests/game.test.js` 增加静态断言，覆盖当前路线动作亮环选择器、关键帧和降动效兜底。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 19:14 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含当前路线动作胶囊选择器、`farDispatchSummaryActiveActionGlow` 和 `prefers-reduced-motion: reduce` 兜底。
- `tests/game.test.js` 覆盖远航路线对照条当前动作亮环静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `farDispatchSummaryActiveActionGlow`、当前路线动作胶囊选择器和 `prefers-reduced-motion` 兜底。
- 发布验证已通过：提交 `322879f` 已推送到 `origin/main`；GitHub Pages workflow `25212484417` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `choice.active ? " is-active-route" : ""`，线上 `src/styles.css` 已确认包含 `farDispatchSummaryActiveActionGlow`、当前路线动作胶囊选择器和 `prefers-reduced-motion` 兜底。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前动作亮环、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:20:48Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359052301`。
- 已回复 GitHub Issue #4，说明本轮用当前动作亮环降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:21:04Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359053156`。
- 回复后同步 GitHub Issues：2026-05-01 19:21 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 19:21 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、上级目录和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条当前路线推进脉冲

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 19:00 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经有下一步动作信标和当前路线边栏，但当前路线底部 1/2/3 进度轨仍是静态填充。玩家在 2/3 回航或整备阶段需要快速确认“这条路线正在推进、下一步节点在哪里”，继续追加文字会恶化 #4 的文字密度问题。

本轮决策：

- 新增“远航对照条当前路线推进脉冲”。
- `src/styles.css` 仅对 `.far-dispatch-branch-choice-summary-item.is-active-route` 内的迷你进度轨启用推进扫光，并让当前路线的下一步节点轻量脉冲。
- `src/styles.css` 增加 `farDispatchSummaryActiveRouteSweep`、`farDispatchSummaryNextNodePulse` 和 `prefers-reduced-motion: reduce` 兜底，减少动效敏感风险。
- `tests/game.test.js` 增加静态断言，覆盖当前路线进度轨动效、下一步节点脉冲、关键帧和降动效兜底。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 19:00 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `farDispatchSummaryActiveRouteSweep`、`farDispatchSummaryNextNodePulse`、当前路线进度轨选择器和 `prefers-reduced-motion: reduce` 兜底。
- `tests/game.test.js` 覆盖远航路线对照条当前路线推进脉冲静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `farDispatchSummaryActiveRouteSweep`、`farDispatchSummaryNextNodePulse`、`prefers-reduced-motion` 和 `is-active-route` 进度轨样式。
- 发布验证已通过：提交 `8af1365` 已推送到 `origin/main`；GitHub Pages workflow `25212155107` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `choice.active ? " is-active-route" : ""`，线上 `src/styles.css` 已确认包含 `farDispatchSummaryActiveRouteSweep`、`farDispatchSummaryNextNodePulse`、`prefers-reduced-motion` 和当前路线进度轨样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航对照条当前路线推进脉冲、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:07:57Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4359012796`。
- 已回复 GitHub Issue #4，说明本轮用当前路线推进脉冲降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T11:07:57Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4359012797`。
- 回复后同步 GitHub Issues：2026-05-01 19:08 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 19:08 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条当前路线边栏

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 18:48 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮继续处理 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集。

当前最大问题：远航路线对照条已经能显示下一步按钮短标、动作信标、本步收益、资源取向、代价、回航结果和 1/2/3 进度轨，但玩家在选定协同或绕行之后，仍需要从“本轮已选”“2/3 回航”“下一步 3 目标”等多个短标里确认哪一条是当前路线。当前路线需要一个不增加文字的视觉锚点。

本轮决策：

- 新增“远航对照条当前路线边栏”。
- `src/app.js` 在路线对照条 item 上根据 `choice.active` 追加 `is-active-route`。
- `src/styles.css` 给 `.far-dispatch-branch-choice-summary-item.is-active-route` 增加金色边框、轻量背景和左侧双色边栏，帮助玩家在协同/绕行两槽中先扫到本轮已选路线。
- `tests/game.test.js` 增加静态断言，覆盖 active 路线类名派生、当前路线伪元素和样式绑定。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 18:48 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 包含 `choice.active ? " is-active-route" : ""`。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-summary-item::before`、`.far-dispatch-branch-choice-summary-item.is-active-route` 和 `.far-dispatch-branch-choice-summary-item.is-active-route::before`。
- `tests/game.test.js` 覆盖远航路线对照条当前路线边栏静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `is-active-route`、`.far-dispatch-branch-choice-summary-item::before` 和 `.far-dispatch-branch-choice-summary-item.is-active-route::before`。
- 发布验证已通过：提交 `e717da9` 已推送到 `origin/main`；GitHub Pages workflow `25211817392` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `choice.active ? " is-active-route" : ""`，线上 `src/styles.css` 已确认包含 `.far-dispatch-branch-choice-summary-item::before`、`.far-dispatch-branch-choice-summary-item.is-active-route` 和 `.far-dispatch-branch-choice-summary-item.is-active-route::before`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航路线对照条当前路线边栏、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T10:55:11Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4358972853`。
- 已回复 GitHub Issue #4，说明本轮用当前路线边栏降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T10:55:12Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4358973031`。
- 回复后同步 GitHub Issues：2026-05-01 18:55 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 18:55 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级三层内未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航对照条下一步动作信标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 18:35 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；本轮回到 #6“后半段玩法无聊、只有不停目标”和 #4“界面文字密集、需要更好看”的交集，继续优化 20M 后远航调度的路线扫视。

当前最大问题：远航路线对照条已经显示路线徽标、当前步、下一步按钮短标、收益短标、第二步指令、本步收益、路线取向、资源代价、回航结果和 1/2/3 迷你进度轨，但“下一步 1/2/3 <指令名>”仍只是同权重文字。玩家在协同/绕行两条路线间扫视时，最需要先看到哪一项是当前可执行动作，而不是继续读完整短标组合。

本轮决策：

- 新增“远航对照条下一步动作信标”。
- `src/styles.css` 让 `.far-dispatch-branch-choice-summary-action` 呈现胶囊式动作短标，并在非 `is-idle` 状态下通过 `::before` 播放 `farDispatchSummaryActionBeacon` 呼吸信标。
- `src/styles.css` 分别强化目标/分支/回航、整备和绕行分支动作的颜色，但不新增可见文字。
- `tests/game.test.js` 增加静态断言，覆盖动作信标伪元素、非 idle 动画、idle 隐藏和关键帧。
- 该改动只调整远航路线对照条展示层和测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 18:35 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-summary-action::before`、`.far-dispatch-branch-choice-summary-action:not(.is-idle)::before`、`animation: farDispatchSummaryActionBeacon 1200ms ease-in-out infinite`、`.far-dispatch-branch-choice-summary-action.is-idle::before` 和 `@keyframes farDispatchSummaryActionBeacon`。
- `tests/game.test.js` 覆盖远航路线对照条下一步动作信标静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `farDispatchSummaryActionBeacon`、`.far-dispatch-branch-choice-summary-action::before` 和 `.far-dispatch-branch-choice-summary-action:not(.is-idle)::before`。
- 发布验证已通过：提交 `ba12376` 已推送到 `origin/main`；GitHub Pages workflow `25211495534` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `farDispatchSummaryActionBeacon`、`.far-dispatch-branch-choice-summary-action::before` 和 `.far-dispatch-branch-choice-summary-action:not(.is-idle)::before`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #6，说明远航路线对照条下一步动作信标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T10:41:55Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4358935150`。
- 已回复 GitHub Issue #4，说明本轮用动作信标降低文字反推压力、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T10:42:12Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4358936026`。
- 回复后同步 GitHub Issues：2026-05-01 18:42 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。

## 2026-05-01 Product decision：点火下一击预告命中跳闪

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 18:19 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有按住反冲、按住压光、落点热区、落点闪光、涟漪、火花束、收益浮层跟随落点、蓄能轨命中闪烁、连击点命中跳闪、星核裂纹、蓄能外弧、中心标签和外层轮廓命中反馈。按钮本体反馈已经很密，但按钮下方“下一击 +X / 触发过载”的预告在点击后只更新文案，没有同步给一次命中确认；连续点击时，玩家还可以更直接感知“这次点击已经推进到下一击预告”。

本轮决策：

- 新增“点火下一击预告命中跳闪”。
- `src/styles.css` 复用 `.core-button.is-pulsing:not(.is-overload-impact) + .core-reward-hint`，普通命中时让下一击预告播放 `coreRewardHintHit`。
- `src/styles.css` 复用 `.core-button.is-overload-impact + .core-reward-hint`，过载命中时让下一击预告播放更强的 `coreRewardHintOverloadHit`。
- `tests/game.test.js` 增加静态断言，覆盖普通/过载下一击预告命中动效选择器和关键帧。
- 该改动只调整点火按钮相邻展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 18:19 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.core-button.is-pulsing:not(.is-overload-impact) + .core-reward-hint`、`coreRewardHintHit 360ms ease-out`、`.core-button.is-overload-impact + .core-reward-hint`、`coreRewardHintOverloadHit 520ms ease-out` 和对应 `@keyframes`。
- `tests/game.test.js` 覆盖点火下一击预告普通/过载命中跳闪静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `coreRewardHintHit`、`coreRewardHintOverloadHit`、`.core-button.is-pulsing:not(.is-overload-impact) + .core-reward-hint` 和 `.core-button.is-overload-impact + .core-reward-hint`。
- 发布验证已通过：提交 `f6d959c` 已推送到 `origin/main`；GitHub Pages workflow `25211106472` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `coreRewardHintHit`、`coreRewardHintOverloadHit`、`.core-button.is-pulsing:not(.is-overload-impact) + .core-reward-hint` 和 `.core-button.is-overload-impact + .core-reward-hint`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火下一击预告命中跳闪、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T10:27:05Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358883905`。
- 回复后同步 GitHub Issues：2026-05-01 18:27 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 18:27 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、父级和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火外层轮廓命中亮闪

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 18:05 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有按住反冲、按住压光、落点热区、落点闪光、涟漪、火花束、收益浮层跟随落点、蓄能轨命中闪烁、连击点命中跳闪、星核裂纹、蓄能外弧、中心标签普通/过载命中反馈、音效和触感。普通点击和过载点击的局部落点、中心标签和轨道确认已经很密，但按钮外层蓄能轮廓在松手命中瞬间仍主要保持持续旋转态，可以补一次短促亮闪，把“整颗星核被点燃”的命中确认落到按钮本体外轮廓。

本轮决策：

- 新增“点火外层轮廓命中亮闪”。
- `src/styles.css` 复用 `.core-button.is-pulsing:not(.is-overload-impact)::before`，在普通命中时保留 `coreCharge` 旋转并叠加 `coreShellHitFlash`。
- `src/styles.css` 复用 `.core-button.is-overload-impact::before`，在过载命中时保留 `coreCharge` 旋转并叠加更强的 `coreShellOverloadFlash`。
- `tests/game.test.js` 增加静态断言，覆盖普通/过载外层轮廓命中动效选择器和关键帧。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 18:05 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.core-button.is-pulsing:not(.is-overload-impact)::before`、`coreShellHitFlash 360ms ease-out`、`.core-button.is-overload-impact::before`、`coreShellOverloadFlash 520ms ease-out` 和对应 `@keyframes`。
- `tests/game.test.js` 覆盖点火外层轮廓普通/过载命中亮闪静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `coreShellHitFlash`、`coreShellOverloadFlash`、`.core-button.is-pulsing:not(.is-overload-impact)::before` 和 `.core-button.is-overload-impact::before`。
- 发布验证已通过：提交 `f0cc032` 已推送到 `origin/main`；GitHub Pages workflow `25210782717` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `coreShellHitFlash`、`coreShellOverloadFlash`、`.core-button.is-pulsing:not(.is-overload-impact)::before` 和 `.core-button.is-overload-impact::before`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火外层轮廓命中亮闪、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T10:14:06Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358845864`。
- 回复后同步 GitHub Issues：2026-05-01 18:14 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 18:14 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、父级和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火中心标签命中亮脉冲

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 17:52 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有按住反冲、按住压光、落点热区、落点闪光、涟漪、火花束、收益浮层跟随落点、蓄能轨命中闪烁、连击点命中跳闪、星核裂纹、蓄能外弧、过载中心标签闪爆、音效和触感。第 8 次过载命中已经会把中心标签覆盖成“过载”，但普通命中时中心“点火”标签仍主要依赖按住态和外围特效，松手命中瞬间中心确认还可以更直接。

本轮决策：

- 新增“点火中心标签命中亮脉冲”。
- `src/styles.css` 让 `.core-button.is-pulsing:not(.is-overload-impact) .core-label` 在普通命中时短促变亮并播放 `coreLabelHitFlash`。
- `tests/game.test.js` 增加静态断言，覆盖普通命中中心标签状态和关键帧。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 17:52 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.core-button.is-pulsing:not(.is-overload-impact) .core-label`、`coreLabelHitFlash 360ms ease-out` 和 `@keyframes coreLabelHitFlash`。
- `tests/game.test.js` 覆盖点火中心标签普通命中亮脉冲静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `.core-button.is-pulsing:not(.is-overload-impact) .core-label`、`coreLabelHitFlash 360ms ease-out` 和 `@keyframes coreLabelHitFlash`。
- 发布验证已通过：提交 `1e4b896` 已推送到 `origin/main`；GitHub Pages workflow `25210404767` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `.core-button.is-pulsing:not(.is-overload-impact) .core-label`、`coreLabelHitFlash 360ms ease-out` 和 `@keyframes coreLabelHitFlash`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火中心标签命中亮脉冲、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T09:59:44Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358800418`。
- 回复后同步 GitHub Issues：2026-05-01 17:59 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 17:59 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、父级和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火过载中心标签闪爆

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 17:38 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有按住反冲、按住压光、落点热区、落点闪光、涟漪、火花束、收益浮层跟随落点、蓄能轨命中闪烁、连击点命中跳闪、星核裂纹、蓄能外弧、音效和触感。过载命中时外层、落点、轨道和浮层反馈已经很强，但中心标签仍保持“点火”，没有在命中瞬间确认“这一击就是过载”。

本轮决策：

- 新增“点火过载中心标签闪爆”。
- `src/styles.css` 复用现有 `.core-button.is-overload-impact` 短时状态，让中心 `.core-label` 在过载命中时短暂覆盖显示“过载”，并播放 `coreLabelOverloadFlash`。
- `tests/game.test.js` 增加静态断言，覆盖中心标签过载状态、伪元素文案和关键帧。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 17:38 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.core-button.is-overload-impact .core-label`、`.core-button.is-overload-impact .core-label::after`、`content: "过载"` 和 `coreLabelOverloadFlash`。
- `tests/game.test.js` 覆盖点火过载中心标签闪爆静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `.core-button.is-overload-impact .core-label`、`content: "过载"` 和 `coreLabelOverloadFlash`。
- 发布验证已通过：提交 `2a55cb7` 已推送到 `origin/main`；GitHub Pages workflow `25210084481` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `.core-button.is-overload-impact .core-label`、`content: "过载"` 和 `coreLabelOverloadFlash`。
- 已回复 GitHub Issue #5，说明点火过载中心标签闪爆、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T09:47:20Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358760758`。
- 回复后同步 GitHub Issues：2026-05-01 17:47 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 17:47 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、父级和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火收益浮层跟随落点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 17:24 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有 pointerdown 即时反冲、按住压光、按住落点热区、点击后的落点闪光、涟漪、火花束、蓄能轨命中闪烁、连击点命中跳闪、星核蓄能裂纹、蓄能外弧、音效和触感。现有 `+X` 收益浮层仍固定从按钮上方中心冒出；实际点击落点已经被落点光效和反冲使用，但收益文字没有跟随同一坐标，局部命中与收益确认之间还差一层直接关联。

本轮决策：

- 新增“点火收益浮层跟随落点”。
- `src/app.js` 在 `positionCoreImpact` 中复用点击坐标，给 `coreGainPop` 写入 `--core-gain-x` 和 `--core-gain-y`；键盘触发继续回退按钮中心。
- `src/styles.css` 让 `.core-gain-pop` 用 `clamp()` 按落点附近定位，避免浮层贴边溢出按钮范围。
- `tests/game.test.js` 增加静态断言，覆盖收益浮层坐标变量和样式约束。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 17:24 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 包含 `--core-gain-x` 和 `--core-gain-y` 写入。
- `src/styles.css` 包含 `.core-gain-pop` 的 `--core-gain-x`、`--core-gain-y`、`left: clamp(...)` 和 `top: clamp(...)`。
- `tests/game.test.js` 覆盖点火收益浮层跟随落点静态绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `--core-gain-x`、`--core-gain-y` 和收益浮层 `clamp()` 定位样式。
- 发布验证已通过：提交 `ca4a159` 已推送到 `origin/main`；GitHub Pages workflow `25209680551` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `--core-gain-x` 和 `--core-gain-y`，线上 `src/styles.css` 已确认包含收益浮层 `clamp()` 定位样式。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火收益浮层跟随落点、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T09:32:06Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358710702`。
- 回复后同步 GitHub Issues：2026-05-01 17:32 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 17:32 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录、父级和用户目录未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火连击点命中跳闪

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 17:09 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有 pointerdown 即时反冲、按住压光、按住落点热区、点击后的落点闪光、涟漪、火花束、收益浮层、星核蓄能裂纹、蓄能外弧、环形蓄能轨命中闪烁、音效和触感。上一轮让环形蓄能轨确认“本次命中推动蓄能”，但按钮内 8 格连击轨仍只是在整体填充和节点状态上变化；每次点击具体点亮了哪一格，还可以用一次短促跳闪直接确认。

本轮决策：

- 新增“点火连击点命中跳闪”。
- `src/app.js` 在点火后用 `getComboStatus(state)` 获取本次 `comboStep`，由 `highlightCoreComboHit` 只给本次命中的连击点添加 `is-hit`。
- `src/styles.css` 让 `.core-combo-dot.is-hit` 播放 `coreComboDotHit`，普通命中时短促放大发光。
- `src/styles.css` 让 `.core-combo-track.is-overload-hit .core-combo-dot.is-hit` 播放 `coreComboDotOverloadHit`，第 8 格过载命中时使用更强跳闪。
- `tests/game.test.js` 增加静态断言，覆盖本次命中点 class、普通/过载动画和关键帧。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 17:09 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 包含 `comboStep: comboStatus.step`、`highlightCoreComboHit` 和 `is-hit` 命中点清理。
- `src/styles.css` 包含 `.core-combo-dot.is-hit`、`coreComboDotHit`、`.core-combo-track.is-overload-hit .core-combo-dot.is-hit` 和 `coreComboDotOverloadHit`。
- `tests/game.test.js` 覆盖点火连击点命中跳闪静态绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `comboStep: comboStatus.step`、`highlightCoreComboHit`、`.core-combo-dot.is-hit`、`coreComboDotHit` 和 `coreComboDotOverloadHit`。
- 发布验证已通过：提交 `a836fdf` 已推送到 `origin/main`；GitHub Pages workflow `25209354933` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `comboStep: comboStatus.step`、`highlightCoreComboHit` 和 `is-hit`，线上 `src/styles.css` 已确认包含 `.core-combo-dot.is-hit`、`coreComboDotHit` 和 `coreComboDotOverloadHit`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火连击点命中跳闪、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T09:18:37Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358669795`。
- 回复后同步 GitHub Issues：2026-05-01 17:18 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 17:18 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火蓄能轨命中闪烁

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 16:51 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有 pointerdown 即时反冲、按住压光、按住落点热区、点击后的落点闪光、涟漪、火花束、收益浮层、星核蓄能裂纹、蓄能外弧、环形蓄能轨、音效和触感。上一轮让按住期间接触点更明确，但松手后“这次点击推进了蓄能轨”的瞬时确认仍主要依赖连击轨和冲击波；环形蓄能轨本身可以在每次命中时给一个短促回光，让玩家把点击和蓄能推进更直接地关联起来。

本轮决策：

- 新增“点火蓄能轨命中闪烁”。
- `src/styles.css` 让 `.core-button.is-pulsing .core-charge-ring` 播放 `coreChargeRingHit`，普通点击时蓄能轨短促亮起并外扩。
- `src/styles.css` 让 `.core-button.is-overload-impact .core-charge-ring` 播放 `coreChargeRingOverloadHit`，过载命中时使用更亮、更大的蓄能轨余辉。
- `tests/game.test.js` 增加静态断言，覆盖普通命中、过载命中和两个关键帧。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 16:51 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.core-button.is-pulsing .core-charge-ring`、`coreChargeRingHit`、`.core-button.is-overload-impact .core-charge-ring` 和 `coreChargeRingOverloadHit`。
- `tests/game.test.js` 覆盖点火蓄能轨命中闪烁静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `.core-button.is-pulsing .core-charge-ring`、`coreChargeRingHit`、`.core-button.is-overload-impact .core-charge-ring` 和 `coreChargeRingOverloadHit`。
- 发布验证已通过：提交 `90c9c99` 已推送到 `origin/main`；GitHub Pages workflow `25208876617` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `.core-button.is-pulsing .core-charge-ring`、`coreChargeRingHit`、`.core-button.is-overload-impact .core-charge-ring` 和 `coreChargeRingOverloadHit`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火蓄能轨命中闪烁、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T09:01:11Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358608276`。
- 回复后同步 GitHub Issues：2026-05-01 17:01 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：2026-05-01 17:04 CST 运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火按住落点热区

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 16:41 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有 pointerdown 即时反冲、按住压光、落点闪光、落点涟漪、落点火花束、音效、触感、连击轨、星核蓄能裂纹和蓄能外弧。但按住期间实际落点层仍主要等待 click 后才播放完整闪光/涟漪/火花；玩家手指压住时，局部接触点还可以更早被点亮。

本轮决策：

- 新增“点火按住落点热区”。
- `src/styles.css` 让 `.core-button.is-pressing .core-impact-point` 在 pointerdown 坐标处持续显示局部光斑。
- `src/styles.css` 让 `.core-button.is-pressing .core-impact-ripple` 在按住期间显示较小的落点能量环。
- `src/styles.css` 让 `.core-button.is-pressing .core-impact-sparks` 显示低透明短火花，和松手后的完整火花动画区分。
- `tests/game.test.js` 增加静态断言，覆盖按住态落点光斑、落点环和短火花样式。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 16:41 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.core-button.is-pressing .core-impact-point`、`.core-button.is-pressing .core-impact-ripple` 和 `.core-button.is-pressing .core-impact-sparks`。
- `tests/game.test.js` 覆盖点火按住落点热区静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `.core-button.is-pressing .core-impact-point`、`.core-button.is-pressing .core-impact-ripple`、`.core-button.is-pressing .core-impact-sparks` 和 `rotate(18deg)`。
- 发布验证已通过：提交 `6abf432` 已推送到 `origin/main`；GitHub Pages workflow `25208513646` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `.core-button.is-pressing .core-impact-point`、`.core-button.is-pressing .core-impact-ripple`、`.core-button.is-pressing .core-impact-sparks` 和 `rotate(18deg)`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火按住落点热区、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T08:47:06Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358562813`。
- 回复后同步 GitHub Issues：2026-05-01 16:47 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火按住压光

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 16:25 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有按住即时反冲、按压反冲、落点闪光、落点涟漪、落点火花束、音效、触感、连击轨、星核蓄能裂纹和蓄能外弧。上一轮解决了 pointerdown 坐标滞后，但按住期间星核本体、外弧和中心标签仍主要沿用普通态，玩家手指或鼠标压住时缺少持续的“被压亮”状态。

本轮决策：

- 新增“点火按住压光”。
- `src/styles.css` 让 `.core-button.is-pressing .core-surge-orbit` 提高透明度、加重光晕并缩短动画周期，让按住态外弧更像正在蓄能。
- `src/styles.css` 让 `.core-button.is-pressing .core-label` 压缩并切换更亮中心光，让按钮中心在按住期间有明确下压状态。
- `src/styles.css` 让 `.core-button.is-pressing .core-art` 增强星核本体滤镜，补足按住期间的持续视觉反馈。
- `tests/game.test.js` 增加静态断言，覆盖按住外弧、中心标签和星核本体样式。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 16:25 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.core-button.is-pressing .core-surge-orbit`、`.core-button.is-pressing .core-label` 和 `.core-button.is-pressing .core-art`。
- `tests/game.test.js` 覆盖点火按住压光静态样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `.core-button.is-pressing .core-surge-orbit`、`animation-duration: 1100ms`、`.core-button.is-pressing .core-label` 和 `.core-button.is-pressing .core-art`。
- 发布验证已通过：提交 `bd8d4b6` 已推送到 `origin/main`；GitHub Pages workflow `25208217600` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `.core-button.is-pressing .core-surge-orbit`、`animation-duration: 1100ms`、`.core-button.is-pressing .core-label` 和 `.core-button.is-pressing .core-art`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火按住压光、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T08:35:43Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358523129`。
- 回复后同步 GitHub Issues：2026-05-01 16:35 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级三层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火按住即时反冲

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 16:11 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍是最新更新的开放反馈，继续围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”做 Product decision。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、环形蓄能轨、阶段光环、过载倒计时徽标、落点闪光、落点涟漪、落点火花束、音效、触感反馈、连击轨连续填充、星核蓄能裂纹、蓄能外弧和点击后的方向性反冲。但反冲坐标主要在 click 动画阶段更新；鼠标或触屏刚按下时，`:active` 仍可能复用上一次点击落点，按下瞬间的触感不够直接。

本轮决策：

- 新增“点火按住即时反冲”。
- `src/app.js` 在 `pointerdown` 阶段调用 `positionCoreImpact`，提前写入当前落点坐标和反冲变量，并给主按钮添加 `is-pressing`；`pointerup`、`pointercancel`、`pointerleave`、`blur` 清理按住态。
- 键盘 Enter / Space 触发时进入中心按住态，继续保持键盘触发落点回退到按钮中心。
- `positionCoreImpact` 识别 `PointerEvent.pointerType`，允许 pointerdown 即使 `detail` 为 0 也使用指针坐标；键盘事件仍回退中心。
- `src/styles.css` 让 `.core-button.is-pressing` 复用现有反冲 transform，并在按住时压缩外层光环；同时给点火按钮设置 `touch-action: manipulation`，降低移动端点击延迟。
- `tests/game.test.js` 增加静态断言，覆盖 pointerdown/keyup 绑定、`is-pressing` class、PointerEvent 坐标识别和样式绑定。
- 该改动只调整点火按钮交互展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 16:11 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 包含 `pointerdown` 按住态、`is-pressing` 清理、键盘中心回退和 `PointerEvent.pointerType` 坐标识别。
- `src/styles.css` 包含 `.core-button.is-pressing`、`.core-button.is-pressing::before` 和 `touch-action: manipulation`。
- `tests/game.test.js` 覆盖点火按住即时反冲静态绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `pointerdown`、`is-pressing`、`PointerEvent.pointerType` 识别和 `touch-action: manipulation`。
- 发布验证已通过：提交 `4ac7aeb` 已推送到 `origin/main`；GitHub Pages workflow `25207824604` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含 `pointerdown`、`is-pressing`、`PointerEvent.pointerType` 识别和 `touch-action: manipulation`。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火按住即时反冲、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T08:19:45Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358477849`。
- 回复后同步 GitHub Issues：2026-05-01 16:19 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火按压反冲

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 15:54 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，且是最新更新的反馈 issue，因此本轮继续进入 Product decision。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、环形蓄能轨、阶段光环、过载倒计时徽标、落点闪光、落点涟漪、落点火花束、音效、触感反馈、连击轨连续填充、星核蓄能裂纹和蓄能外弧。按钮视觉层已经很丰富，但按下按钮本体时仍主要是居中缩放，实际点击位置没有带动按钮产生方向性反冲，鼠标或触屏点击的“按下去”触感还可以更明确。

本轮决策：

- 新增“点火按压反冲”。
- `src/app.js` 在 `positionCoreImpact` 中复用点击坐标，给主按钮写入 `--core-recoil-x` 和 `--core-recoil-y`；键盘触发或无指针事件时回退到按钮中心，反冲归零。
- `src/styles.css` 让 `core-button.is-pulsing` 使用 `translate(var(--core-recoil-x), var(--core-recoil-y)) scale(0.97)`，让按钮按压方向跟随实际落点。
- `tests/game.test.js` 增加静态断言，覆盖反冲 CSS 变量、运行期写入和按压 transform。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 15:54 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 在 `positionCoreImpact` 写入 `--core-recoil-x` 和 `--core-recoil-y`，并继续同步 `--core-impact-x` / `--core-impact-y`。
- `src/styles.css` 包含 `--core-recoil-x`、`--core-recoil-y` 和反冲 transform。
- `tests/game.test.js` 覆盖点火按压反冲静态绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `--core-recoil-x`、`--core-recoil-y` 和反冲 transform。
- 发布验证已通过：提交 `43772f0` 已推送到 `origin/main`；GitHub Pages workflow `25207404681` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含 `--core-recoil-x`、`--core-recoil-y` 和反冲 transform。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火按压反冲、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T08:03:24Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358428508`。
- 回复后同步 GitHub Issues：2026-05-01 16:03 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火落点火花束

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 15:40 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，且更新时间晚于 #6 / #4，因此本轮继续进入 Product decision。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、环形蓄能轨、阶段光环、过载倒计时徽标、落点闪光、落点涟漪、音效、触感反馈、连击轨连续填充、星核蓄能裂纹和蓄能外弧。上一轮落点涟漪补上了“扩散环”，但点击落点还缺少短促的放射火花，让按下瞬间更像能量被击穿。

本轮决策：

- 新增“点火落点火花束”。
- `index.html` 在主点火按钮中新增 `coreImpactSparks` / `core-impact-sparks` 视觉层。
- `src/app.js` 让 `positionCoreImpact` 同步把 `--core-impact-x` / `--core-impact-y` 写入落点闪光、落点涟漪和落点火花束，并让 `animateCore` 同步触发普通/过载火花状态。
- `src/styles.css` 增加 `core-impact-sparks` 普通态、过载态和 `coreImpactSparks` 动画，在点击坐标处播放短促放射火花。
- `tests/game.test.js` 增加静态断言，覆盖火花束 DOM、运行期 class 绑定和样式动画。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 15:40 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `coreImpactSparks` 和 `core-impact-sparks`。
- `src/app.js` 在 `animateCore` 触发 `coreImpactSparks` 的 `is-showing` / `is-overload-impact`，并在 `positionCoreImpact` 同步写入 `--core-impact-x` / `--core-impact-y`。
- `src/styles.css` 包含 `.core-impact-sparks`、过载态样式和 `coreImpactSparks` 动画。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `coreImpactSparks`、`core-impact-sparks` 和 `coreImpactSparks`。
- 发布验证已通过：提交 `fb10258` 已推送到 `origin/main`；GitHub Pages workflow `25207016246` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `index.html`、`src/app.js` 和 `src/styles.css` 已确认包含 `coreImpactSparks`、`core-impact-sparks` 和 `coreImpactSparks` 动画。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火落点火花束、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T07:48:21Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358383999`。
- 回复后同步 GitHub Issues：2026-05-01 15:48 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火落点涟漪

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 15:25 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，且更新时间晚于 #6 / #4，因此本轮继续进入 Product decision。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、环形蓄能轨、阶段光环、过载倒计时徽标、落点闪光、音效、触感反馈、连击轨连续填充、星核蓄能裂纹和蓄能外弧，但点击落点只有亮点闪光。玩家连续点击时，按钮仍可以在实际点击位置补一层局部扩散反馈，让“按下位置被点燃”的触发感更明确。

本轮决策：

- 新增“点火落点涟漪”。
- `index.html` 在主点火按钮中新增 `coreImpactRipple` / `core-impact-ripple` 视觉层。
- `src/app.js` 让 `positionCoreImpact` 同步把 `--core-impact-x` / `--core-impact-y` 写入落点闪光和落点涟漪，并让 `animateCore` 同步触发普通/过载涟漪状态。
- `src/styles.css` 增加 `core-impact-ripple` 普通态、过载态和 `coreImpactRipple` 动画，在点击坐标处播放局部能量环。
- `tests/game.test.js` 增加静态断言，覆盖涟漪 DOM、运行期 class 绑定和样式动画。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 15:25 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `coreImpactRipple` 和 `core-impact-ripple`。
- `src/app.js` 在 `animateCore` 触发 `coreImpactRipple` 的 `is-showing` / `is-overload-impact`，并在 `positionCoreImpact` 同步写入 `--core-impact-x` / `--core-impact-y`。
- `src/styles.css` 包含 `.core-impact-ripple`、过载态样式和 `coreImpactRipple` 动画。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `core-impact-ripple`、`coreImpactRipple` 和 `--core-impact-x`。
- 发布验证已通过：提交 `5757365` 已推送到 `origin/main`；GitHub Pages workflow `25206676299` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `index.html`、`src/app.js` 和 `src/styles.css` 已确认包含 `coreImpactRipple`、`core-impact-ripple`、`--core-impact-x` 和 `coreImpactRipple` 动画。workflow 继续出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明点火落点涟漪、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T07:35:15Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358346550`。
- 回复后同步 GitHub Issues：2026-05-01 15:35 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火蓄能外弧

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 15:09 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，因此本轮继续进入 Product decision。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、环形蓄能轨、阶段光环、过载倒计时徽标、落点闪光、音效、触感反馈、连击轨连续填充和星核蓄能裂纹，但按钮主体外层仍缺少一个随连击推进持续变化的旋转能量轮廓。玩家连续点击时，按钮内部裂纹和底部连击轨已经能反馈进度，外层轮廓还可以更直接地表现“越点越快、越接近过载”。

本轮决策：

- 新增“点火蓄能外弧”。
- `index.html` 在主点火按钮中新增 `core-surge-orbit` 视觉层。
- `src/app.js` 在 `renderCoreFeedback` 中根据现有 `combo.progress` 写入 `--core-surge-opacity`、`--core-surge-scale` 和 `--core-surge-speed`，过载命中时按满蓄能状态处理。
- `src/styles.css` 让外弧随连击进度提高透明度、放大并加快旋转；过载前一击和过载命中时切换更强颜色与爆发动画。
- `tests/game.test.js` 增加静态断言，覆盖外弧 DOM、运行期 CSS 变量和样式绑定。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 15:09 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `core-surge-orbit`。
- `src/app.js` 在 `renderCoreFeedback` 写入 `--core-surge-opacity`、`--core-surge-scale` 和 `--core-surge-speed`。
- `src/styles.css` 包含 `.core-surge-orbit`、过载前一击和过载命中的外弧状态，以及 `coreSurgeOrbit` / `coreSurgeBurst` 动画。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `core-surge-orbit`、`--core-surge-opacity`、`coreSurgeOrbit` 和 `coreSurgeBurst`。
- 发布验证已通过：提交 `629d429` 已推送到 `origin/main`；GitHub Pages workflow `25206249194` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `index.html`、`src/app.js` 和 `src/styles.css` 已确认包含 `core-surge-orbit`、`--core-surge-opacity`、`--core-surge-scale`、`--core-surge-speed`、`coreSurgeOrbit` 和 `coreSurgeBurst`。
- 已回复 GitHub Issue #5，说明点火蓄能外弧、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T07:18:32Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358299019`。
- 回复后同步 GitHub Issues：2026-05-01 15:18 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火星核蓄能裂纹

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 14:53 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，因此本轮继续进入 Product decision。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、环形蓄能轨、阶段光环、过载倒计时徽标、落点闪光、音效、触感反馈和连击轨连续填充，但星核 SVG 本体仍主要是固定图形。连续点击时，按钮主体内部还缺少随蓄能进度逐步显现的视觉变化。

本轮决策：

- 新增“点火星核蓄能裂纹”。
- `index.html` 在主点火按钮的星核 SVG 内新增 `core-veins` / `core-vein-*` 纹路。
- `src/app.js` 在 `renderCoreFeedback` 中根据现有 `combo.progress` 写入 `--core-vein-opacity` 和 `--core-vein-dash-offset`，过载命中时按满蓄能状态处理。
- `src/styles.css` 让星核纹路随连击进度显现，并在过载前一击和过载命中时使用脉动/爆发动画。
- `tests/game.test.js` 增加静态断言，覆盖星核纹路 DOM、运行期 CSS 变量和样式绑定。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 14:53 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `core-veins` 和四条 `core-vein` 星核纹路。
- `src/app.js` 在 `renderCoreFeedback` 写入 `--core-vein-opacity` 和 `--core-vein-dash-offset`。
- `src/styles.css` 包含 `.core-vein`、过载前一击和过载命中的纹路状态，以及 `coreVeinPulse` / `coreVeinBurst` 动画。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `core-veins`、`--core-vein-opacity`、`--core-vein-dash-offset`、`coreVeinPulse` 和 `coreVeinBurst`。
- 发布验证已通过：提交 `83eecf7` 已推送到 `origin/main`；GitHub Pages workflow `25205870214` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `index.html`、`src/app.js` 和 `src/styles.css` 已确认包含 `core-veins`、`--core-vein-opacity`、`--core-vein-dash-offset`、`coreVeinPulse` 和 `coreVeinBurst`。workflow 仍出现 Node.js 20 actions 弃用提醒，未影响本次部署。
- 已回复 GitHub Issue #5，说明星核蓄能裂纹、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T07:02:22Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358252682`。
- 回复后同步 GitHub Issues：2026-05-01 15:02 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：点火连击轨进度填充

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 14:37 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 与 #4 已连续多轮处理并等待复测，#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，因此本轮进入 Product decision 并处理点火按钮的连续点击反馈。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、环形蓄能轨、阶段光环、过载倒计时徽标、落点闪光、音效和触感反馈，但按钮内 8 格连击轨仍主要是离散小点。玩家每次点击后的“蓄能被推进了一段”还可以更直接地落在同一条轨道里，降低只靠小点状态和按钮外文字判断进度的成本。

本轮决策：

- 新增“点火连击轨进度填充”。
- `src/app.js` 在 `renderCoreComboTrack` 中根据现有 `combo.progress` 写入 `--core-combo-progress`。
- `src/styles.css` 用 `.core-combo-track::before` 渲染连续填充轨，并在过载前一击和过载命中时切换更强填充色。
- `tests/game.test.js` 增加静态断言，覆盖运行期 CSS 变量绑定和填充轨样式。
- 该改动只调整点火按钮展示层和测试，不新增收益、不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令、远航调度、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 14:37 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 在 `renderCoreComboTrack` 写入 `--core-combo-progress`。
- `src/styles.css` 包含 `.core-combo-track::before`、过载前一击和过载命中的填充轨状态。
- `tests/game.test.js` 覆盖点火连击轨进度填充静态绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `--core-combo-progress`、`.core-combo-track::before` 和过载状态填充轨样式。
- 发布验证已通过：提交 `07bdf1d` 已推送到 `origin/main`；GitHub Pages workflow `25205510783` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 已确认包含 `--core-combo-progress` 和 `Math.round(combo.progress * 100) + "%"`，线上 `src/styles.css` 已确认包含 `.core-combo-track::before`、过载前一击和过载命中的填充轨样式。
- GitHub Actions 本轮出现 Node.js 20 actions 弃用提醒，来源为 `actions/checkout@v4`、`actions/setup-node@v4`、`actions/upload-artifact@v4` 等 action 运行时提示；该提醒未影响本次 build、test 或 Pages deploy 成功状态，后续可单独规划 workflow 运行时升级。
- 已回复 GitHub Issue #5，说明点火连击轨连续填充、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T06:48:06Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/5#issuecomment-4358208477`。
- 回复后同步 GitHub Issues：2026-05-01 14:48 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条下一步按钮短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 14:18 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图形化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经显示 1/2/3 进度节点和第二步按钮，但动作短标仍是“下一步 目标 / 选协同 / 回目标 / 整备”。玩家扫对照条时还需要再把动作语义映射到具体按钮名。

本轮决策：

- 新增“远航路线对照条下一步按钮短标”。
- `src/game.js` 让 `routeActionText` 复用 `routeCommandLabels`，直接输出 `下一步 1 点火齐射`、`下一步 2 谐振脉冲`、`下一步 3 点火齐射` 或具体整备指令名。
- `tests/game.test.js` 更新远航调度状态断言，覆盖起手、分支、回航和绕行整备状态的下一步按钮短标。
- 该改动只调整展示派生和可访问汇总文本，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 14:18 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 的 `buildFarRouteDispatchBranchRouteAction` 从 `routeCommandLabels` 派生步骤号和指令名。
- `tests/game.test.js` 覆盖 `下一步 1 点火齐射`、`下一步 2 谐振脉冲`、`下一步 3 点火齐射` 和 `下一步 绕行整备 巡航回收`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `下一步 1 `、`下一步 2 `、`下一步 3 ` 和 `下一步 绕行整备` 派生逻辑。
- 发布验证已通过：提交 `228d4ba` 已推送到 `origin/main`；GitHub Pages workflow `25205067424` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js` 已确认包含 `下一步 1 `、`下一步 2 `、`下一步 3 ` 和 `下一步 绕行整备` 派生逻辑。
- 已回复 GitHub Issue #6，说明路线对照条下一步按钮短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T06:29:01Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4358153873`。
- 已回复 GitHub Issue #4，说明本轮把下一步按钮名压到路线对照条，降低路线微图、指令串和展开明细之间的对照成本，issue 保持 open，更新时间为 2026-05-01T06:29:21Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4358154779`。
- 回复后同步 GitHub Issues：2026-05-01 14:29 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条进度步号与状态语义

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 14:06 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图形化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经有 1/2/3 迷你进度轨，但轨道节点仍只是小圆点；上一轮指令串已经显示 1/2/3 步号和状态语义，玩家扫对照条时仍需要把无编号节点和路线微图、指令串短槽重新对应。

本轮决策：

- 新增“远航路线对照条进度步号与状态语义”。
- `src/app.js` 让 `far-dispatch-branch-choice-summary-progress` 复用现有 `routeStepLabels`、`routeNodeStates` 和 `routeCommandLabels`，写入 `role="img"`、`aria-label`、`title` 与节点 `data-step-label`，表达 `1 目标 · 点火齐射 · 下一步` 这类完整语义。
- `src/styles.css` 通过 `.far-dispatch-branch-choice-summary-progress-node::before` 显示 1/2/3，并放大迷你节点，避免对照条底部进度轨只靠颜色判断。
- `tests/game.test.js` 增加静态断言，覆盖对照条进度语义、步号来源和 CSS `data-step-label` 渲染。
- 该改动只调整展示层和可访问语义，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 14:06 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 的路线对照条迷你进度轨包含 `role="img"`、“路线对照进度”可访问汇总、节点 `data-step-label` 和节点悬停标题。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-summary-progress-node::before` 和 `content: attr(data-step-label)`。
- `tests/game.test.js` 覆盖路线对照条进度步号与状态语义。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `路线对照进度`、`.far-dispatch-branch-choice-summary-progress-node::before` 和 `content: attr(data-step-label)`。
- 发布验证已通过：提交 `361e396` 已推送到 `origin/main`；GitHub Pages workflow `25204696469` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含路线对照进度语义、步号绑定和步号样式。
- 已回复 GitHub Issue #6，说明路线对照条迷你进度轨步号与状态语义、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T06:13:37Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4358109281`。
- 已回复 GitHub Issue #4，说明本轮把 1/2/3 步号压到路线对照条迷你进度轨，降低对照条、路线微图和路线指令串之间的对应成本，issue 保持 open，更新时间为 2026-05-01T06:13:37Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4358109282`。
- 回复后同步 GitHub Issues：2026-05-01 14:13 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。

## 2026-05-01 Product decision：远航路线指令串步号与状态语义

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 13:50 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图形化依据，因此本轮继续进入 Product decision。

当前最大问题：上一轮已经让 `目标 -> 分支 -> 回目标` 指令串显示已完成、下一步和待推进状态，但短槽本身仍只显示指令名。玩家在路线微图、路线对照条和指令串之间扫视时，还需要把 1/2/3 步号、目标/分支/回目标含义和当前状态分散对应。

本轮决策：

- 新增“远航路线指令串步号与状态语义”。
- `src/app.js` 在 `far-dispatch-branch-choice-route-command-step` 上复用现有 `routeStepLabels` 和 `routeNodeStates`，为三段短槽写入 `data-step-label`、`title` 和 `aria-label`，表达 `1 目标 · 点火齐射 · 下一步` 这类完整语义。
- `src/styles.css` 通过 `far-dispatch-branch-choice-route-command-step::before` 显示 1/2/3 固定步号，让实际指令顺序和路线微图、路线对照条的三步轨保持同屏一致。
- `tests/game.test.js` 增加静态断言，覆盖步号 DOM 绑定、状态语义 helper 和 CSS `data-step-label` 渲染。
- 该改动只调整展示层和可访问语义，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 13:50 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 的路线指令串短槽包含 `data-step-label`、`aria-label`、`title` 和“路线指令状态”汇总。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-route-command-step::before` 和 `content: attr(data-step-label)`。
- `tests/game.test.js` 覆盖路线指令串步号与状态语义。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `路线指令状态`、`data-step-label`、`.far-dispatch-branch-choice-route-command-step::before` 和 `content: attr(data-step-label)`。
- 发布验证已通过：提交 `227fe32` 已推送到 `origin/main`；GitHub Pages workflow `25204350010` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含路线指令状态、步号绑定和步号样式。
- 已回复 GitHub Issue #6，说明路线指令串步号与状态语义、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T05:59:33Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4358067282`。
- 已回复 GitHub Issue #4，说明本轮用 1/2/3 步号和可访问状态降低路线微图、对照条和实际按钮名之间的对应成本，issue 保持 open，更新时间为 2026-05-01T05:59:33Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4358067278`。
- 回复后同步 GitHub Issues：2026-05-01 13:59 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。

## 2026-05-01 Product decision：远航路线指令串当前步高亮

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 13:37 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图形化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行卡片已经有路线微图、路线对照条和 `目标 -> 分支 -> 回目标` 指令串，但指令串本身仍是三段静态短槽。玩家在 1/3 分支、2/3 回航或完成态复看时，还需要把上方微图节点高亮和下方实际按钮名再次对应。

本轮决策：

- 新增“远航路线指令串当前步高亮”。
- `src/app.js` 在渲染 `far-dispatch-branch-choice-route-command-step` 时复用现有 `routeNodeStates`，为目标、分支、回目标三段短槽追加 `is-next`、`is-done` 或 `is-waiting`。
- `src/styles.css` 为路线指令串短槽增加已完成、下一步和待推进状态样式，让实际按钮顺序直接跟随当前路线阶段高亮。
- `tests/game.test.js` 增加静态断言，覆盖 DOM 状态类绑定和 CSS 状态样式。
- 该改动只调整展示层，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 13:37 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 的路线指令串短槽复用 `getFarDispatchBranchChoiceRouteNodeState(choice, step)`。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-route-command-step.is-done`、`.is-next` 和 `.is-waiting`。
- `tests/game.test.js` 覆盖路线指令串状态类绑定和样式。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `far-dispatch-branch-choice-route-command-step is-`、`getFarDispatchBranchChoiceRouteNodeState(choice, step)`、`.far-dispatch-branch-choice-route-command-step.is-done`、`.is-next` 和 `.is-waiting`。
- 发布验证已通过：提交 `8177ff3` 已推送到 `origin/main`；GitHub Pages workflow `25203987786` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含路线指令串状态类与样式。
- 已回复 GitHub Issue #6，说明路线指令串当前步高亮、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T05:43:59Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4358024523`。
- 已回复 GitHub Issue #4，说明本轮用目标/分支/回目标短槽状态高亮降低文字密度，issue 保持 open，更新时间为 2026-05-01T05:44:48Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4358025256`。
- 回复后同步 GitHub Issues：2026-05-01 13:44 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级四层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条小屏布局

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 13:20 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经改成分组布局，但小屏下 `@media (max-width: 820px)` 只处理主布局、状态栏、指令区和筛选区，协同/绕行两个对照槽仍保持双列并排。玩家在窄屏复测 20M 后分支时，路线身份、阶段、下一步、收益、代价和回航结果仍可能被压缩到过短列宽，削弱上一轮分组布局的价值。

本轮决策：

- 新增“远航路线对照条小屏布局”。
- `src/styles.css` 在现有 820px 响应式断点下，把 `far-dispatch-branch-choice-summary` 改为单列。
- `far-dispatch-branch-choice-summary-item` 在小屏下改为 18px 图形列 + 3 个弹性文本列，并用命名网格区域分四层展示：路线身份/下一步/第二步、当前阶段/收益落点/本步收益、资源取向/代价/回航结果、1/2/3 迷你进度轨。
- 该改动不隐藏任何短标；完整语义仍保留在 `branchChoiceSummaryText`、卡片标题、路线微图、路线指令串、路线判断、路线反馈和折叠明细中。
- 该改动只调整 CSS 响应式布局和静态测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 13:20 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 在 `@media (max-width: 820px)` 中把路线对照条改为单列，并覆盖小屏命名网格区域。
- `tests/game.test.js` 覆盖小屏单列布局和小屏命名网格区域。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `@media (max-width: 820px)`、`far-dispatch-branch-choice-summary`、`glyph label action step`、`glyph phase reward payoff`、`glyph intent cost result` 和 `progress progress progress progress`。
- 发布验证已通过：提交 `7bfd0a8` 已推送到 `origin/main`；GitHub Pages workflow `25203679110` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `@media (max-width: 820px)`、`far-dispatch-branch-choice-summary` 和小屏命名网格区域。
- 已回复 GitHub Issue #6，说明路线对照条小屏布局、验证结果、Pages 部署和窄屏复测问题，issue 保持 open，更新时间为 2026-05-01T05:31:00Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4357989552`。
- 已回复 GitHub Issue #4，说明本轮把窄屏协同/绕行对照槽从双列改为单列以降低文字密度，issue 保持 open，更新时间为 2026-05-01T05:31:00Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4357989550`。
- 回复后同步 GitHub Issues：2026-05-01 13:31 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级三层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条分组布局

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 13:14 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经能显示当前阶段、下一步动作、收益落点、第二步按钮、本步收益、资源取向、当前资源代价、回航结果和 1/2/3 迷你进度轨，但单个对照槽仍把大量短标压在一行十列里。继续追加新短标会恶化 #4 的“密密麻麻文字”问题，因此本轮优先整理既有信息层级。

本轮决策：

- 新增“远航路线对照条分组布局”。
- `src/styles.css` 将 `far-dispatch-branch-choice-summary-item` 从单行十列改为命名网格区域：第一行路线身份/阶段/动作/第二步，第二行收益落点/本步收益/资源取向/代价，第三行回航结果，第四行 1/2/3 迷你进度轨。
- `tests/game.test.js` 增加静态断言，覆盖 `grid-template-areas` 和各短标 `grid-area` 绑定，避免后续改回不可扫视的单行挤压。
- 该改动只调整展示层和静态测试，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 13:14 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含路线对照条命名网格区域和 `glyph / label / phase / action / step / reward / payoff / intent / cost / result / progress` 区域绑定。
- `tests/game.test.js` 覆盖对照条分组布局静态 CSS 绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `grid-template-areas` 和 `far-dispatch-branch-choice-summary-item` 分组布局。
- 发布验证已通过：提交 `95188d4` 已推送到 `origin/main`；GitHub Pages workflow `25203272078` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含 `grid-template-areas`、`far-dispatch-branch-choice-summary-item` 和 `grid-area: progress`。
- 已回复 GitHub Issue #6，说明本轮路线对照条分组布局、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T05:13:32Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4357940878`。
- 已回复 GitHub Issue #4，说明本轮把路线对照条从一行挤压改为分组网格以降低文字密度，issue 保持 open，更新时间为 2026-05-01T05:13:50Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4357941648`。
- 回复后同步 GitHub Issues：2026-05-01 13:14 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级三层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条本步收益短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 12:45 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经能显示当前阶段、下一步动作、收益落点、第二步按钮、资源取向、当前资源代价、回航结果和 1/2/3 迷你进度轨，但玩家比较协同/绕行时仍要回到卡片收益对照，才能看到本步即时收益差异。

本轮决策：

- 新增“远航路线对照条本步收益短标”。
- `src/game.js` 复用现有远航分支奖励常量和航段契合/稳航/改道判断派生 `routePayoffSummaryText`，协同首推可显示 `本步 +13%`，绕行建档可显示 `本步 +4%`。
- `branchChoiceSummaryText` 和 `branchChoiceText` 纳入 `routePayoffSummaryText`，保持可访问语义与视觉短标一致。
- `src/app.js` 在 `far-dispatch-branch-choice-summary-item` 中渲染 `far-dispatch-branch-choice-summary-payoff`，放在第二步短标后、资源取向前。
- `src/styles.css` 调整对照条列宽，并给协同/绕行本步收益短标提供不同强调色。
- 该短标只改变展示层，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 12:45 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routePayoffSummaryText`，并覆盖协同 `本步 +13%` 与绕行 `本步 +4%`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-summary-payoff`，并把本步收益短标纳入对照槽标题。
- `src/styles.css` 包含对照条本步收益短标和绕行状态色。
- `tests/game.test.js` 覆盖本步收益短标派生、可访问汇总、静态 DOM 和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routePayoffSummaryText`、`far-dispatch-branch-choice-summary-payoff`、`本步 +13%` 和 `本步 +4%`。
- 发布验证已通过：提交 `fbbc2fa` 已推送到 `origin/main`；GitHub Pages workflow `25202874610` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routePayoffSummaryText` 与 `far-dispatch-branch-choice-summary-payoff`。
- 已回复 GitHub Issue #6，说明本轮路线对照条本步收益短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T04:56:26Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4357893255`。
- 已回复 GitHub Issue #4，说明本轮把本步收益短标压到协同/绕行对照槽，issue 保持 open，更新时间为 2026-05-01T04:56:43Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4357894389`。
- 回复后同步 GitHub Issues：2026-05-01 12:56 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条收益短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 12:25 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经能显示当前阶段、下一步动作、第二步按钮、资源取向、当前资源代价、回航结果和 1/2/3 迷你进度轨，但三步回报落点仍主要在路线微图、收益对照和折叠明细中。玩家扫协同/绕行对照槽时，还缺少一枚直接说明“校准、补给/投送、闭环”的短标。

本轮决策：

- 新增“远航路线对照条收益短标”。
- `src/game.js` 从现有 `routeRewardLabels` 派生 `routeRewardSummaryText`，协同显示 `校准/补给/闭环`，绕行显示 `校准/投送/闭环`。
- `branchChoiceSummaryText` 和 `branchChoiceText` 纳入 `routeRewardSummaryText`，保持可访问语义与视觉短标一致。
- `src/app.js` 在 `far-dispatch-branch-choice-summary-item` 中渲染 `far-dispatch-branch-choice-summary-reward`，放在下一步短标与第二步短标之间。
- `src/styles.css` 调整对照条列宽，并给协同/绕行收益短标提供不同强调色。
- 该短标只改变展示层，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 12:25 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeRewardSummaryText`，并覆盖协同 `校准/补给/闭环` 与绕行 `校准/投送/闭环`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-summary-reward`，并把收益短标纳入对照槽标题。
- `src/styles.css` 包含对照条收益短标和绕行状态色。
- `tests/game.test.js` 覆盖收益短标派生、可访问汇总、静态 DOM 和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeRewardSummaryText`、`far-dispatch-branch-choice-summary-reward`、`校准/补给/闭环` 和 `校准/投送/闭环`。
- 发布验证已通过：提交 `1c82faf` 已推送到 `origin/main`；GitHub Pages workflow `25202413152` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeRewardSummaryText` 与 `far-dispatch-branch-choice-summary-reward`。
- 已回复 GitHub Issue #6，说明本轮路线对照条收益短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T04:37:01Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4357836373`。
- 已回复 GitHub Issue #4，说明本轮把三步收益落点压到协同/绕行对照槽，issue 保持 open，更新时间为 2026-05-01T04:37:17Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4357837144`。
- 回复后同步 GitHub Issues：2026-05-01 12:37 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级三层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条下一步短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 12:08 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经能显示当前阶段、第二步按钮、资源取向、当前资源代价、回航结果和 1/2/3 迷你进度轨，但玩家仍需要把 `0/3 起手`、`1/3 分支`、`2/3 回航` 或 `3/3 完成` 翻译成“现在该按目标、选协同/绕行、回目标还是整备”。对照槽还缺一枚直接表达当前操作的短标。

本轮决策：

- 新增“远航路线对照条下一步短标”。
- `src/game.js` 从现有 `routeNodeStates`、当前分支态势和是否本轮路线派生 `routeActionKind` / `routeActionText`，覆盖 `下一步 目标`、`下一步 选协同`、`下一步 选绕行`、`下一步 回目标`、`下一步 整备`、`下一步 绕行整备` 和 `待选`。
- `branchChoiceSummaryText` 和 `branchChoiceText` 纳入 `routeActionText`，保持可访问语义与视觉短标一致。
- `src/app.js` 在 `far-dispatch-branch-choice-summary-item` 中渲染 `far-dispatch-branch-choice-summary-action`，放在当前步短标与第二步短标之间。
- `src/styles.css` 调整对照条列宽，并给目标、分支、回目标、整备、待选状态提供短标状态色。
- 该短标只改变展示层，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 12:08 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeActionKind` / `routeActionText`，并覆盖起手、分支选择、回目标、完成整备和非当前路线待选。
- `src/app.js` 渲染 `far-dispatch-branch-choice-summary-action`，并把下一步短标纳入对照槽标题。
- `src/styles.css` 包含对照条下一步短标、回目标/整备/待选状态色。
- `tests/game.test.js` 覆盖下一步短标派生、可访问汇总、静态 DOM 和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeActionText`、`far-dispatch-branch-choice-summary-action`、`下一步 目标` 和 `下一步 选协同`。
- 发布验证已通过：提交 `556ce96` 已推送到 `origin/main`；GitHub Pages workflow `25202009731` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeActionText`、`far-dispatch-branch-choice-summary-action`、`下一步 目标` 和 `下一步 选协同`。
- 已回复 GitHub Issue #6，说明本轮路线对照条下一步短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T04:19:33Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4357779766`。
- 已回复 GitHub Issue #4，说明本轮把下一步动作压到协同/绕行对照槽，issue 保持 open，更新时间为 2026-05-01T04:19:46Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4357780331`。
- 回复后同步 GitHub Issues：2026-05-01 12:19 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条迷你进度条

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 11:54 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经能在同一行显示当前步短标、第二步按钮、路线取向、当前资源代价和回航结果，但阶段仍主要靠文字短标识别。玩家扫协同/绕行对照槽时，还缺少一个不展开卡片、不下看路线微图也能判断 1/2/3 推进位置的图形锚点。

本轮决策：

- 新增“远航路线对照条迷你进度条”。
- 复用现有 `routeProgressPercent` 和 `routeNodeStates`，在每个协同/绕行对照槽底部渲染 1/2/3 三点进度。
- `src/app.js` 新增 `renderFarDispatchBranchChoiceSummaryProgress()`，只负责对照槽内的展示节点，不改变 `branchChoiceSummaryText` 的可访问语义。
- `src/styles.css` 给协同/绕行对照槽提供迷你轨道、已完成、下一步和待推进节点样式。
- 该进度条只改变展示层，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 11:54 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 渲染 `far-dispatch-branch-choice-summary-progress`，并通过 `--summary-route-progress` 绑定现有路线推进百分比。
- `src/styles.css` 包含对照条迷你进度轨、协同/绕行填充色、已完成节点和下一步节点样式。
- `tests/game.test.js` 覆盖迷你进度 DOM、CSS 和 `routeNodeStates` 绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `far-dispatch-branch-choice-summary-progress`、`--summary-route-progress` 和迷你进度节点样式。
- 发布验证已通过：提交 `f913566` 已推送到 `origin/main`；GitHub Pages workflow `25201606066` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含 `far-dispatch-branch-choice-summary-progress`、`--summary-route-progress` 和迷你进度节点样式。
- 已回复 GitHub Issue #6，说明本轮路线对照条迷你进度条、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T04:02:12Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4357734130`。
- 已回复 GitHub Issue #4，说明本轮把 1/2/3 迷你进度轨压到协同/绕行对照槽，issue 保持 open，更新时间为 2026-05-01T04:02:29Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4357734869`。
- 回复后同步 GitHub Issues：2026-05-01 12:02 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级三层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条当前步短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 11:36 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经能并排显示路线徽标、第二步按钮名、路线取向、当前资源代价和回航结果，但它还没有显示当前路线阶段。玩家在进入 20M 后分支区时，仍需要下看路线微图或路线步骤，才能判断当前是 `0/3 起手`、`1/3 分支`、`2/3 回航` 还是 `3/3 完成`。

本轮决策：

- 新增“远航路线对照条当前步短标”。
- 复用现有 `routePhaseText`，把 `0/3 起手` / `1/3 分支` / `2/3 回航` / `3/3 完成` / `未选` 纳入 `branchChoiceSummaryText`。
- `src/app.js` 在 `far-dispatch-branch-choice-summary-item` 中渲染 `far-dispatch-branch-choice-summary-phase`，放在路线徽标和第二步短标之间。
- `src/styles.css` 调整对照条列宽，并给当前步短标提供分支、回航、完成状态色。
- 该短标只复用现有路线阶段派生，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 11:36 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 的 `branchChoiceSummaryText` 纳入 `routePhaseText`，覆盖 `协同 首推 · 0/3 起手 · 2 谐振脉冲` 与 `绕行 建档 · 0/3 起手 · 2 巡航回收`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-summary-phase`，并把当前步短标纳入对照槽标题。
- `src/styles.css` 包含对照条当前步短标、分支/回航状态色和完成状态色。
- `tests/game.test.js` 覆盖当前步短标进入路线对照文本、静态 DOM 和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routePhaseText`、`far-dispatch-branch-choice-summary-phase` 和 `路线对照：`。
- 发布验证已通过：提交 `86befd0` 已推送到 `origin/main`；GitHub Pages workflow `25201201533` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routePhaseText` 与 `far-dispatch-branch-choice-summary-phase`。
- 已回复 GitHub Issue #6，说明本轮路线对照条当前步短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T03:44:54Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/6#issuecomment-4357689119`。
- 已回复 GitHub Issue #4，说明本轮把当前阶段压到协同/绕行对照槽以减少逐张读卡片、下看路线微图和展开明细的依赖，issue 保持 open，更新时间为 2026-05-01T03:44:54Z；评论地址：`https://github.com/Jassy930/codex-game-operator/issues/4#issuecomment-4357689127`。
- 回复后同步 GitHub Issues：2026-05-01 11:45 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条第二步短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 11:19 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：路线对照条已经能并排比较协同/绕行的路线徽标、取向、当前资源代价和回航结果，但还没有在同一条里显示“第二步到底按哪枚指令”。玩家仍需要向下扫路线指令串或卡片标题，才能把协同/绕行和实际按钮名对应起来。

本轮决策：

- 新增“远航路线对照条第二步短标”。
- `branchChoices` 派生 `routeBranchStepText`，例如 `2 谐振脉冲` / `2 巡航回收`。
- `branchChoiceSummaryText` 纳入第二步短标，形成 `协同 首推 · 2 谐振脉冲 · 保当前 · 无消耗 · 远航突破`。
- `src/app.js` 在 `far-dispatch-branch-choice-summary-item` 中渲染 `far-dispatch-branch-choice-summary-step`，放在路线徽标和取向之间。
- `src/styles.css` 给协同/绕行第二步短标提供不同状态色，并调整对照条列宽避免挤压。
- 该短标只从现有分支指令名派生，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 11:19 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeBranchStepText`，覆盖 `2 谐振脉冲` 与 `2 巡航回收`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-summary-step`，并把它纳入对照条标题。
- `src/styles.css` 包含对照条第二步短标与绕行状态色。
- `tests/game.test.js` 覆盖第二步短标派生、可访问汇总、静态 DOM 和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeBranchStepText`、`far-dispatch-branch-choice-summary-step` 和 `路线对照：`。
- 发布验证已通过：提交 `e731345` 已推送到 `origin/main`；GitHub Pages workflow `25200839578` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeBranchStepText` 与 `far-dispatch-branch-choice-summary-step`。
- 已回复 GitHub Issue #6，说明本轮第二步短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T03:30:09Z。
- 已回复 GitHub Issue #4，说明本轮把第二步按钮名压到对照槽以减少逐张读卡片和展开明细的依赖，issue 保持 open，更新时间为 2026-05-01T03:30:37Z。
- 回复后同步 GitHub Issues：2026-05-01 11:30 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线对照条

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 11:00 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行分支卡片已经有路线微图、当前步、收益、资源流向、代价、取向、回航结果和指令串，但对比两条路线仍需要分别扫两张卡。玩家在目标后做选择时，最先需要的是“哪条是首推/建档、保当前还是推累计、是否消耗当前、回航结果是什么”的并排结论。

本轮决策：

- 新增“远航路线对照条”。
- `getFarRouteDispatch()` 派生 `branchChoiceSummaryText`，汇总协同/绕行的路线徽标、取向、代价和回航结果。
- `src/app.js` 在协同/绕行卡片上方渲染 `far-dispatch-branch-choice-summary`，用两个固定视觉槽并排展示协同与绕行；每槽包含资源图形、路线徽标、取向、代价和回航结果。
- `src/styles.css` 为协同/绕行、推荐、改道、无消耗/消耗当前、远航突破/绕行突破提供紧凑状态样式。
- 该对照条只从现有 `branchChoices` 派生，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 11:00 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `branchChoiceSummaryText`，覆盖 `协同 首推 · 保当前 · 无消耗 · 远航突破 / 绕行 建档 · 推累计 · 消耗当前 · 绕行突破`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-summary`、`far-dispatch-branch-choice-summary-item`、`far-dispatch-branch-choice-summary-glyph`、`summary-cost` 和 `summary-result`。
- `src/styles.css` 包含路线对照条双槽布局、资源图形、推荐/改道强调、无消耗/消耗当前和回航结果状态色。
- `tests/game.test.js` 覆盖路线对照条派生、静态 DOM 和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `branchChoiceSummaryText`、`far-dispatch-branch-choice-summary` 和 `路线对照：`。
- 发布验证已通过：提交 `1568715` 已推送到 `origin/main`；GitHub Pages workflow `25200447363` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `branchChoiceSummaryText`、`far-dispatch-branch-choice-summary` 与路线对照条样式。
- 已回复 GitHub Issue #6，说明本轮路线对照条、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T03:12:56Z。
- 已回复 GitHub Issue #4，说明本轮用并排视觉槽降低逐张读卡片和展开明细的依赖，issue 保持 open，更新时间为 2026-05-01T03:13:10Z。
- 回复后同步 GitHub Issues：2026-05-01 11:13 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线指令串

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 10:41 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行卡片已经显示路线微图、当前阶段、收益点、资源流向、代价、路线取向和回航结果，但玩家仍需要从路线预案、路线下一步或按钮标记里拼出实际按键顺序。微图有 1/2/3 节点，却没有把“目标指令 -> 分支指令 -> 回目标指令”直接放到卡片首屏。

本轮决策：

- 新增“远航路线指令串”。
- `branchChoices` 派生 `routeCommandLabels` / `routeCommandText`，按当前目标指令、协同/绕行分支指令、回目标指令形成三段路线。
- `src/app.js` 在协同/绕行分支卡片中渲染 `far-dispatch-branch-choice-route-command`，用三个固定短槽显示例如 `点火齐射 -> 谐振脉冲 -> 点火齐射`。
- `src/styles.css` 用紧凑三列指令槽和箭头展示路线指令串，绕行分支的第二步使用绕行色；完整语义同步纳入 `branchChoiceText` 和卡片标题。
- 该指令串只从现有目标指令与分支指令派生，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 10:41 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeCommandLabels` / `routeCommandText`，覆盖协同 `点火齐射 -> 谐振脉冲 -> 点火齐射` 与绕行 `点火齐射 -> 巡航回收 -> 点火齐射`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-route-command`、`far-dispatch-branch-choice-route-command-step` 和 `far-dispatch-branch-choice-route-command-arrow`。
- `src/styles.css` 包含路线指令串三列短槽、起点/分支/回目标样式和绕行分支第二步状态色。
- `tests/game.test.js` 覆盖路线指令串派生、可访问汇总、静态 DOM 和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeCommandLabels`、`routeCommandText`、`far-dispatch-branch-choice-route-command` 和 `路线指令：`。
- 发布验证已通过：提交 `a104162` 已推送到 `origin/main`；GitHub Pages workflow `25200017907` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeCommandLabels`、`routeCommandText`、`far-dispatch-branch-choice-route-command` 与路线指令串样式。
- 已回复 GitHub Issue #6，说明本轮路线指令串、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T02:55:02Z。
- 已回复 GitHub Issue #4，说明本轮把实际按钮顺序压到协同/绕行卡片首屏以减少展开说明依赖，issue 保持 open，更新时间为 2026-05-01T02:55:22Z。
- 回复后同步 GitHub Issues：2026-05-01 10:55 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线回航结果短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 10:25 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行卡片已经显示路线微图、当前步、收益点、资源流向、代价和路线取向，但默认折叠“路线明细”后，玩家仍需要展开才能确认回目标后主要触发的是普通远航突破还是绕行突破。

本轮决策：

- 新增“远航路线回航结果短标”。
- `branchChoices` 派生 `routeReturnKind` / `routeReturnText`，协同路线显示 `远航突破`，绕行路线显示 `绕行突破`。
- `src/app.js` 在默认折叠的 `路线明细` summary 上显示 `路线明细 · 远航突破/绕行突破`，并给 details 写入 `is-return-far/is-return-detour`。
- `src/styles.css` 为两类回航结果摘要提供不同强调色；完整语义同步纳入 `branchChoiceText` 与卡片标题。
- 该短标只从现有路线类型派生，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 10:25 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeReturnKind` / `routeReturnText`，覆盖协同 `far:远航突破` 与绕行 `detour:绕行突破`。
- `src/app.js` 在路线明细 summary 中渲染回航结果短标，并写入 `is-return-far/is-return-detour`。
- `src/styles.css` 包含回航结果 summary 状态色。
- `tests/game.test.js` 覆盖回航结果短标派生、静态 DOM 绑定和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeReturnKind`、`routeReturnText`、`路线明细 · `、`远航突破` 和 `绕行突破`。
- 发布验证已通过：提交 `08f8682` 已推送到 `origin/main`；GitHub Pages workflow `25199540920` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeReturnKind`、`routeReturnText`、`路线明细 · `、`远航突破`、`绕行突破` 与 `is-return-far/is-return-detour`。
- 已回复 GitHub Issue #6，说明本轮路线回航结果短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T02:35:18Z。
- 已回复 GitHub Issue #4，说明本轮把回航结果压到默认折叠的路线明细摘要以减少展开依赖，issue 保持 open，更新时间为 2026-05-01T02:35:19Z。
- 回复后同步 GitHub Issues：2026-05-01 10:35 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线取向短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 10:07 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行卡片已经显示路线代价、资源流向、收益点、当前阶段和路线微图，但首行只直接告诉玩家“无消耗/消耗当前”。玩家要判断两条路线的最终取向，仍需要把首行代价、微图资源流向和展开明细合并阅读。

本轮决策：

- 新增“远航路线取向短标”。
- `branchChoices` 派生 `routeIntentKind` / `routeIntentText`，协同路线显示 `保当前`，绕行路线显示 `推累计`。
- `src/app.js` 在协同/绕行分支卡片首行渲染 `far-dispatch-branch-choice-intent is-preserve/is-advance`，与路线代价短标并列。
- `src/styles.css` 为保当前与推累计提供独立短标样式；完整语义同步纳入 `branchChoiceText` 与卡片标题。
- 该短标只从现有路线类型派生，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 10:07 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeIntentKind` / `routeIntentText`，覆盖协同 `preserve:保当前` 与绕行 `advance:推累计`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-intent is-preserve/is-advance`。
- `src/styles.css` 包含路线取向短标样式和 preserve/advance 状态色。
- `tests/game.test.js` 覆盖取向短标派生、静态 DOM 绑定和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeIntentKind`、`routeIntentText`、`far-dispatch-branch-choice-intent`、`保当前` 和 `推累计`。
- 发布验证已通过：提交 `494d1e8` 已推送到 `origin/main`；GitHub Pages workflow `25199120944` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeIntentText`、`far-dispatch-branch-choice-intent`、`保当前` 和 `推累计`。
- 已回复 GitHub Issue #6，说明本轮路线取向短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T02:17:53Z。
- 已回复 GitHub Issue #4，说明本轮把路线目的压到协同/绕行卡片首行短标以减少展开明细依赖，issue 保持 open，更新时间为 2026-05-01T02:18:05Z。
- 回复后同步 GitHub Issues：2026-05-01 10:18 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线代价短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 09:49 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行路线微图已经显示路线阶段、收益落点、资源流向和路线状态，但“绕行会消耗当前资源、协同不消耗当前资源”仍主要藏在绕行投送文案、收益对照和展开明细里。玩家能看到 `当前+` 与 `当前->累计` 后，还需要更快判断哪条路线有当前资源代价。

本轮决策：

- 新增“远航路线代价短标”。
- `branchChoices` 派生 `routeCostKind` / `routeCostText`，协同路线显示 `无消耗`，绕行路线显示 `消耗当前`。
- `src/app.js` 在协同/绕行分支卡片首行渲染 `far-dispatch-branch-choice-cost is-safe/is-spend`，让代价和首推/稳航/改道徽标同层可扫视。
- `src/styles.css` 为无消耗与消耗当前提供独立短标样式；完整语义同步纳入 `branchChoiceText` 与卡片标题。
- 该短标只从现有路线类型派生，不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 09:49 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeCostKind` / `routeCostText`，覆盖协同 `safe:无消耗` 与绕行 `spend:消耗当前`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-cost is-safe/is-spend`。
- `src/styles.css` 包含路线代价短标样式和 safe/spend 状态色。
- `tests/game.test.js` 覆盖代价短标派生、静态 DOM 绑定和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeCostKind`、`routeCostText`、`far-dispatch-branch-choice-cost` 和 `消耗当前`。
- 发布验证已通过：提交 `9e3c1fd` 已推送到 `origin/main`；GitHub Pages workflow `25198713363` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeCostText`、`far-dispatch-branch-choice-cost`、`无消耗` 和 `消耗当前`。
- 已回复 GitHub Issue #6，说明本轮路线代价短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T02:02:07Z。
- 已回复 GitHub Issue #4，说明本轮把当前资源代价压到协同/绕行卡片首行短标以减少展开明细依赖，issue 保持 open，更新时间为 2026-05-01T02:02:08Z。
- 回复后同步 GitHub Issues：2026-05-01 10:02 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线资源流向短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 09:32 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行路线微图已经显示路线阶段、推进、收益点和路线状态，但“协同补当前资源、绕行把当前资源投送到累计航段”的资源流向仍主要依赖资源取向图形、卡片说明和展开明细。玩家能看到三步回报后，还需要更快区分两条路线到底在处理哪类资源。

本轮决策：

- 新增“远航路线资源流向短标”。
- `branchChoices` 派生 `routeFlowKind` / `routeFlowText`，协同路线显示 `当前+`，绕行路线显示 `当前->累计`。
- `src/app.js` 在路线微图内渲染 `far-dispatch-branch-choice-route-flow`，并给路线容器追加 `is-route-flow-*` class。
- `src/styles.css` 在路线微图右上角固定显示资源流向短标，协同使用当前资源色，绕行使用投送色。
- 该短标只从现有路线类型派生，是 `caption`、资源取向符号和收益明细的视觉摘要；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 09:32 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeFlowKind` / `routeFlowText`，覆盖协同 `current:当前+` 与绕行 `progress:当前->累计`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-route-flow is-current/is-progress`。
- `src/styles.css` 包含路线资源流向短标样式和 current/progress 状态色。
- `tests/game.test.js` 覆盖资源流向短标派生、静态 DOM 绑定和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeFlowKind`、`routeFlowText`、`far-dispatch-branch-choice-route-flow` 和 `当前->累计`。
- 发布验证已通过：提交 `20f6a4e` 已推送到 `origin/main`；GitHub Pages workflow `25198229407` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeFlowText`、`far-dispatch-branch-choice-route-flow` 和 `当前->累计`。
- 已回复 GitHub Issue #6，说明本轮路线资源流向短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T01:43:01Z。
- 已回复 GitHub Issue #4，说明本轮把协同/绕行的资源方向压到路线微图上以减少文字对照，issue 保持 open，更新时间为 2026-05-01T01:43:21Z。
- 回复后同步 GitHub Issues：2026-05-01 09:43 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线收益短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 09:13 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行路线微图已经显示路线形态、资源取向、节点状态、步号、方向、推进填充、当前步短标和图例；但“目标、分支、回目标各自对应什么回报”仍主要藏在折叠的路线明细、收益对照和按钮收益徽标里。玩家能看懂路线阶段后，下一步需要更快扫到三步路线的收益落点。

本轮决策：

- 新增“远航路线收益短标”。
- `branchChoices` 派生 `routeRewardLabels` / `routeRewardText`，协同路线显示 `校准 -> 补给 -> 闭环`，绕行路线显示 `校准 -> 投送 -> 闭环`。
- `src/app.js` 在路线微图的起点、分支点、回目标点下方渲染 `far-dispatch-branch-choice-route-reward`。
- `src/styles.css` 提升路线微图高度并为起点、分支点、回目标点收益短标提供固定位置；绕行分支的“投送”使用绕行色。
- 完整语义同步纳入 `branchChoiceText` 和卡片标题；路线微图继续 `aria-hidden="true"`，不替代路线步骤、按钮标记、路线反馈和展开明细。
- 本轮只调整派生展示、DOM、CSS 和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 09:13 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeRewardLabels` / `routeRewardText`，覆盖协同 `校准/补给/闭环` 与绕行 `校准/投送/闭环`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-route-reward is-start/is-branch/is-return`。
- `src/styles.css` 包含路线收益短标样式和绕行分支色。
- `tests/game.test.js` 覆盖收益短标派生、静态 DOM 绑定和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeRewardLabels`、`routeRewardText`、`far-dispatch-branch-choice-route-reward` 和 `收益点`。
- 发布验证已通过：提交 `751676d` 已推送到 `origin/main`；GitHub Pages workflow `25197761782` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeRewardLabels`、`routeRewardText` 与 `far-dispatch-branch-choice-route-reward`。
- 已回复 GitHub Issue #6，说明本轮路线收益短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T01:25:51Z。
- 已回复 GitHub Issue #4，说明本轮把收益落点压到路线微图节点下方以减少收益对照和路线明细阅读，issue 保持 open，更新时间为 2026-05-01T01:25:51Z。
- 回复后同步 GitHub Issues：2026-05-01 09:26 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线当前步短标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 08:54 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化依据，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行路线微图已经有路线形态、资源取向、状态标记、步骤高亮、1/2/3 序号、方向箭头、图例、默认折叠明细和轨道推进填充；但玩家仍需要把节点状态、0/50/100 填充和路线步骤合起来判断“当前是起手、分支、回航、完成还是未选”。

本轮决策：

- 新增“远航路线当前步短标”。
- `branchChoices` 从现有 `routeNodeStates` 派生 `routePhaseKind` / `routePhaseText`，覆盖 `0/3 起手`、`1/3 分支`、`2/3 回航`、`3/3 完成` 和 `未选`。
- `src/app.js` 在路线微图内渲染 `far-dispatch-branch-choice-route-phase`，并将阶段 class 写入路线容器。
- `src/styles.css` 用小型文本短标显示当前步，避免再新增长说明；完整语义同步纳入 `branchChoiceText` 和卡片标题。
- 本轮只调整派生展示、DOM、CSS 和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 08:54 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routePhaseKind` / `routePhaseText`，覆盖 0/3、1/3、2/3、3/3 和未选路线。
- `src/app.js` 渲染 `far-dispatch-branch-choice-route-phase` 与 `is-route-phase-*`。
- `src/styles.css` 包含当前步短标和 start/branch/return/complete 状态样式。
- `tests/game.test.js` 覆盖阶段派生、静态 DOM 绑定和样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routePhaseKind`、`routePhaseText`、`far-dispatch-branch-choice-route-phase` 和 `is-route-phase-*`。
- 发布验证已通过：提交 `a65be08` 已推送到 `origin/main`；GitHub Pages workflow `25197262320` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routePhaseKind`、`routePhaseText` 与 `far-dispatch-branch-choice-route-phase`。
- 已回复 GitHub Issue #6，说明本轮路线当前步短标、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T01:07:02Z。
- 已回复 GitHub Issue #4，说明本轮用当前步短标继续降低 20M 后路线卡片对文字步骤、节点颜色和展开明细的依赖，issue 保持 open，更新时间为 2026-05-01T01:07:18Z。
- 回复后同步 GitHub Issues：2026-05-01 09:07 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，当前目录和父级两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线微图推进填充

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 08:41 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化主反馈，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行分支卡片已经有路线微图、资源取向、状态标记、步骤高亮、1/2/3 序号、方向箭头、图例和默认折叠明细；但路线轨道本身仍只表达连接关系。玩家能看到哪个节点是下一步，却还不能直接从轨道填充判断路线已经推进到 0/3、1/3 还是 2/3。

本轮决策：

- 新增“远航路线微图推进填充”。
- `branchChoices` 从现有 `routeNodeStates` 派生 `routeProgressPercent`，按未起步 0%、选择分支阶段 50%、回目标/完成阶段 100% 展示路线轨道填充。
- `src/app.js` 将推进百分比写入 `--branch-route-progress`，`src/styles.css` 用协同/绕行各自轨道色渲染填充段。
- 推进填充仍 `aria-hidden="true"`，可访问语义继续保留在 `branchChoiceText`、路线步骤、按钮路线标记、路线反馈、卡片标题和展开明细中。
- 本轮只调整派生展示、DOM style、CSS 和静态/逻辑测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 08:41 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/game.js` 派生 `routeProgressPercent`，覆盖 0/3 为 0、1/3 为 50、当前回航路线为 100、未选路线为 0。
- `src/app.js` 渲染 `--branch-route-progress`，并对异常值做 0-100 限制。
- `src/styles.css` 使用 `--branch-route-line-fill`、`--branch-route-line-track` 和 `--branch-route-progress` 生成路线轨道填充。
- `tests/game.test.js` 覆盖推进百分比派生、静态 DOM style 绑定和样式变量。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeProgressPercent`、`buildFarRouteDispatchBranchRouteProgressPercent` 和 `--branch-route-progress`。
- 发布验证已通过：提交 `c34de0b` 已推送到 `origin/main`；GitHub Pages workflow `25196762979` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `routeProgressPercent` 与 `--branch-route-progress`。
- 已回复 GitHub Issue #6，说明本轮路线微图推进填充、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T00:48:55Z。
- 已回复 GitHub Issue #4，说明本轮用轨道推进填充继续降低 20M 后路线阶段对文字步骤的依赖，issue 保持 open，更新时间为 2026-05-01T00:49:05Z。
- 回复后同步 GitHub Issues：2026-05-01 08:49 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，父目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线微图图例

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 08:18 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化主反馈，因此本轮继续进入 Product decision。

当前最大问题：协同/绕行分支卡片已经具备路线微图、资源取向、路线状态、步骤高亮、1/2/3 序号、方向箭头和默认折叠明细；但 1/2/3 的含义仍散落在路线步骤、按钮徽标和展开明细里。玩家第一次看到路线微图时，还需要把数字节点和“目标 -> 分支 -> 回目标”自行对应。

本轮决策：

- 新增“远航路线微图图例”。
- 在协同/绕行分支卡片上方渲染一行紧凑图例：`1 目标`、`2 分支`、`3 回目标`。
- 图例只在 `branchChoices` 存在时出现，跨两张分支卡片显示；分支卡片本身仍保留首行、路线微图、指令名、路线判断、推荐原因和默认关闭的 `路线明细`。
- 图例 `aria-hidden="true"`，可访问语义继续保留在 `branchChoiceText`、路线步骤、按钮路线标记、路线反馈、卡片标题和展开明细中。
- 本轮只调整 DOM、CSS 和静态测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 08:18 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 渲染 `renderFarDispatchBranchChoiceLegend()`、`far-dispatch-branch-choice-legend` 和 `far-dispatch-branch-choice-legend-item`，并将 1/2/3 写入 `data-step-label`。
- `src/styles.css` 包含图例跨栏、三段紧凑项和 `data-step-label` 小圆点样式。
- `tests/game.test.js` 覆盖远航路线微图图例的静态 DOM 与样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `far-dispatch-branch-choice-legend` 和 `far-dispatch-branch-choice-legend-item`。
- 发布验证已通过：功能提交 `807faf0` 与部署记录提交 `cf9bef4` 已推送到 `origin/main`；GitHub Pages workflow `25196163126` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含远航路线微图图例相关代码和样式。
- 已回复 GitHub Issue #6，说明本轮路线微图图例、验证结果、Pages 部署和复测问题，issue 保持 open，更新时间为 2026-05-01T00:28:12Z。
- 已回复 GitHub Issue #4，说明本轮用一行图例继续降低 20M 后分支卡片对路线步骤和展开明细的依赖，issue 保持 open，更新时间为 2026-05-01T00:28:28Z。
- 回复后同步 GitHub Issues：2026-05-01 08:28 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，父目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线明细折叠

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 07:59 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是界面文字密度和图片化主反馈，因此本轮继续进入 Product decision。

当前最大问题：前序远航分支卡片已经补齐路线微图、资源取向、状态标记、步骤高亮、1/2/3 序号和方向箭头，但每张协同/绕行卡片仍同时展开路线目标、下一步、后续回航、收益对照和说明文字。玩家能先扫到图形，但仍会在同一张卡里看到多行次级文本。

本轮决策：

- 新增“远航路线明细折叠”。
- 协同/绕行分支卡片默认保留卡片首行、路线微图、指令名、路线判断和推荐原因。
- 路线目标、路线下一步、后续回航、收益对照和资源/奖励说明收进默认关闭的 `路线明细` 折叠区。
- `branchChoiceText` 和卡片 `title` 仍保留完整汇总，展开后仍能查看原有明细。
- 本轮只调整 DOM 结构、CSS 和静态测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 07:59 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 渲染 `far-dispatch-branch-choice-details`、`路线明细` 和 `far-dispatch-branch-choice-detail-grid`，并把 objective/followup/next/payoff/caption 放入折叠区。
- `src/styles.css` 包含 `far-dispatch-branch-choice-details`、summary 单行省略、展开状态符号和明细网格样式。
- `tests/game.test.js` 覆盖远航路线明细折叠的静态 DOM 与样式绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `far-dispatch-branch-choice-details`、`路线明细` 和 `far-dispatch-branch-choice-detail-grid`。
- 发布验证已通过：功能提交 `14a58ce` 与文档提交 `87cad4b` 已推送到 `origin/main`；GitHub Pages workflow `25195625545` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/app.js` 和 `src/styles.css` 已确认包含 `far-dispatch-branch-choice-details`、`路线明细` 和 `far-dispatch-branch-choice-detail-grid`。
- 已回复 GitHub Issue #6，说明本轮路线明细折叠、验证和部署结果，issue 保持 open 等待复测，更新时间为 2026-05-01T00:09:12Z。
- 已回复 GitHub Issue #4，说明本轮折叠远航分支卡片次级说明以降低文字密度，issue 保持 open 等待复测，更新时间为 2026-05-01T00:09:29Z。
- 回复后同步 GitHub Issues：2026-05-01 08:09 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，父目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线微图方向箭头

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 07:44 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是后半段玩法变化主反馈，#4 仍是文字密度和图片化主反馈，因此本轮继续进入 Product decision。

当前最大问题：前序路线微图已经显示协同/绕行路线形态、资源取向、推荐/本轮/上轮/改道、已完成/下一步/待推进节点状态和 1/2/3 步号，但轨道本身仍像静态连接线。玩家能看到三步顺序，却还缺少“从 1 到 2 再到 3”的方向感。

本轮决策：

- 新增“远航路线微图方向箭头”。
- `src/styles.css` 使用 `.far-dispatch-branch-choice-route-line::before` 和 `::after` 在路线轨道上绘制两个小箭头，分别指向分支点和回目标点。
- 协同路线箭头继承青色轨道，绕行路线箭头继承粉色投送轨道，让直线协同和偏移绕行的方向都能扫到。
- 本轮只调整 CSS 视觉层和静态测试；不新增 DOM、不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 07:44 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-route-line::before` / `::after`、基础箭头 `border-left`、协同箭头颜色和绕行箭头颜色。
- `tests/game.test.js` 覆盖路线轨道方向箭头的静态 CSS 绑定。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `.far-dispatch-branch-choice-route-line::before`、`.far-dispatch-branch-choice-route-line::after` 和方向箭头 `border-left` 样式。
- 发布验证已通过：提交 `5a781a8` 已推送到 `origin/main`；GitHub Pages workflow `25195156862` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/styles.css` 已确认包含方向箭头相关样式。
- 已回复 GitHub Issue #6，说明本轮路线微图方向箭头、验证和部署结果，issue 保持 open 等待复测，更新时间为 2026-04-30T23:53:13Z。
- 已回复 GitHub Issue #4，说明本轮用方向箭头继续降低远航分支卡片文字压力，issue 保持 open 等待复测，更新时间为 2026-04-30T23:53:26Z。
- 回复后同步 GitHub Issues：2026-05-01 07:53 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，父目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线微图步骤序号

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 07:27 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新后半段玩法反馈，#4 仍指出界面文字密度和图片化诉求，因此本轮继续进入 Product decision。

当前最大问题：前序路线微图已经能显示协同/绕行路径、资源取向、路线状态和当前节点完成状态，但三枚节点仍缺少固定序号。玩家能扫到哪个节点是下一步，却仍要把节点位置和“目标 -> 分支 -> 回目标”的三步顺序对应起来。

本轮决策：

- 新增“远航路线微图步骤序号”。
- `branchChoices` 派生 `routeStepLabels`，固定为起点 `1`、分支点 `2`、回目标点 `3`。
- `renderFarDispatchBranchChoiceRoute(choice)` 将序号写入路线节点 `data-step-label`，样式通过节点伪元素显示。
- 路线微图仍保持 `aria-hidden="true"`；语义继续由已有 `branchChoiceText`、路线步骤、路线下一步、按钮路线标记和路线反馈承载。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 07:27 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 协同/绕行分支均派生 `routeStepLabels` 为 `1:2:3`。
- `src/app.js` 使用 `getFarDispatchBranchChoiceRouteStepLabel` 写入路线节点 `dataset.stepLabel`。
- `src/styles.css` 使用 `.far-dispatch-branch-choice-route-node::after` 与 `content: attr(data-step-label)` 显示序号。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeStepLabels`、`getFarDispatchBranchChoiceRouteStepLabel`、`data-step-label` 和 `.far-dispatch-branch-choice-route-node::after`。
- 发布验证已通过：提交 `e3411af` 已推送到 `origin/main`；GitHub Pages workflow `25194692467` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 与 `src/styles.css` 已确认包含路线微图步骤序号相关代码和样式。
- 已回复 GitHub Issue #6，说明本轮路线微图步骤序号、验证和部署结果，issue 保持 open 等待复测，更新时间为 2026-04-30T23:38:05Z。
- 已回复 GitHub Issue #4，说明本轮用图形化步骤序号继续降低远航分支卡片文字压力，issue 保持 open 等待复测，更新时间为 2026-04-30T23:38:07Z。
- 回复后同步 GitHub Issues：2026-05-01 07:38 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，父目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线微图步骤高亮

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 07:04 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新后半段玩法反馈，#4 仍指出界面文字密度和图片化诉求，因此本轮继续进入 Product decision。

当前最大问题：前序路线微图已经显示协同/绕行路径、资源取向和推荐/上轮/本轮/改道状态，但微图里的三个节点仍是静态点。玩家能扫到路线属于哪一类，却还需要读“路线步骤”或按钮徽标来确认当前是在执行目标、选择分支还是回目标。

本轮决策：

- 新增“远航路线微图步骤高亮”。
- `branchChoices` 派生 `routeNodeStates`，为起点、分支点和回目标点标记 `done`、`next` 或 `waiting`。
- `renderFarDispatchBranchChoiceRoute(choice)` 将节点状态渲染到 `far-dispatch-branch-choice-route-node is-*`，让 0/3 起手、1/3 选分支、2/3 回目标和已完成路线能直接从三点微图扫到。
- 路线微图仍保持 `aria-hidden="true"`；语义继续由已有 `branchChoiceText`、卡片标题、路线步骤、路线下一步和按钮路线标记承载。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 07:04 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手时，两条路线节点为 `next:waiting:waiting`。
- 目标后等待协同/绕行选择时，两条路线节点为 `done:next:waiting`。
- 已选择绕行路线时，绕行路线节点为 `done:done:next`，未选协同路线为 `done:waiting:waiting`。
- 已选择协同路线时，协同路线节点为 `done:done:next`，未选绕行路线为 `done:waiting:waiting`。
- `src/app.js` 使用 `getFarDispatchBranchChoiceRouteNodeState` 渲染起点、分支点和回目标点状态；`src/styles.css` 包含 `.far-dispatch-branch-choice-route-node.is-done` 与 `.is-next` 样式。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeNodeStates`、`getFarDispatchBranchChoiceRouteNodeState`、`far-dispatch-branch-choice-route-node is-done/is-next/is-waiting`。
- 发布验证已通过：提交 `dec5c00` 已推送到 `origin/main`；GitHub Pages workflow `25194040630` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`，deploy job 成功；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 与 `src/styles.css` 已确认包含路线微图步骤高亮相关代码和样式。
- 已回复 GitHub Issue #6，说明本轮路线微图步骤高亮、验证和部署结果，issue 保持 open 等待复测，更新时间为 2026-04-30T23:17:01Z。
- 已回复 GitHub Issue #4，说明本轮用图形化步骤高亮继续降低远航分支卡片文字压力，issue 保持 open 等待复测，更新时间为 2026-04-30T23:19:09Z。
- 回复后同步 GitHub Issues：2026-05-01 07:19 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，父目录两层内也未发现 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线微图标记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 06:49 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新后半段玩法反馈，#4 仍指出界面文字密度和图片化诉求，因此本轮继续进入 Product decision。

当前最大问题：前序已经给协同/绕行路线微图加入资源取向符号，能区分“保留当前”和“投送累计”；但微图里的路线状态仍主要依赖卡片首行和文字徽标。玩家能扫到路线形态和资源方向，却还需要离开微图去确认这条路线是推荐、上轮、本轮还是改道。

本轮决策：

- 新增“远航路线微图标记”。
- `branchChoices` 派生 `routeMarkerKind` / `routeMarkerText`：覆盖 `recommended`、`available`、`current`、`recommended-previous`、`recommended-shift`、`previous` 和 `shift`。
- `renderFarDispatchBranchChoiceRoute(choice)` 在路线微图分支节点附近渲染 `far-dispatch-branch-choice-route-marker is-*`，显示推荐、备选、本轮、推荐上轮、推荐改道、上轮或改道。
- 微图标记 `aria-hidden="true"`，语义继续由已有 `caption`、`branchChoiceText`、卡片 `title`、路线判断、路线目标和路线收益对照承载。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 06:49 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手时，推荐协同分支派生 `routeMarkerKind: "recommended"` / `routeMarkerText: "推荐"`，绕行分支派生 `available / 备选`。
- 上轮协同路线下，推荐协同派生 `recommended-previous / 推荐上轮`，绕行派生 `shift / 改道`。
- 上轮绕行路线下，推荐协同派生 `recommended-shift / 推荐改道`，绕行派生 `previous / 上轮`。
- 本轮已选协同或绕行路线时，当前路线派生 `current / 本轮`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-route-marker` 与 `is-route-marker-*`；`src/styles.css` 包含 `.far-dispatch-branch-choice-route-marker.is-current`、`.is-recommended`、`.is-recommended-shift`、`.is-previous` 和 `.is-shift`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeMarkerKind`、`routeMarkerText`、`far-dispatch-branch-choice-route-marker` 和 `is-route-marker-*`。
- 发布验证已通过：提交 `6fbf8cd` 已推送到 `origin/main`；GitHub Pages workflow `25193446312` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 与 `src/styles.css` 已确认包含路线微图标记相关代码和样式。
- 已回复 GitHub Issue #6，说明本轮路线微图标记、验证和部署结果，issue 保持 open 等待复测。
- 已回复 GitHub Issue #4，说明本轮用图形化节点标记继续降低远航分支卡片文字压力，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 06:59 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 与 #4 更新时间均为 2026-04-30T22:58:46Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航资源取向符号

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 06:34 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新后半段玩法反馈，#4 仍指出界面文字密度和图片化诉求，因此本轮继续进入 Product decision。

当前最大问题：前序已经给协同/绕行分支卡片加入三点路线微图，能区分直线协同和偏移绕行；但“协同补当前资源、绕行投送累计航段”的关键取舍仍主要依赖卡片文字。玩家能扫到路线形态，却还需要读说明才能确认两条路线的资源方向。

本轮决策：

- 新增“远航资源取向符号”。
- `branchChoices` 派生 `routeResourceKind` / `routeResourceText`：协同为 `current / 保留当前`，绕行为 `progress / 投送累计`。
- `renderFarDispatchBranchChoiceRoute(choice)` 在路线微图中渲染 `far-dispatch-branch-choice-route-resource is-current/is-progress`；协同显示小型资源舱，绕行显示投送箭头。
- 资源取向符号 `aria-hidden="true"`，语义继续由已有 `caption`、`branchChoiceText`、卡片 `title`、路线收益对照和路线目标承载。
- 本轮只调整派生展示、DOM、样式和静态测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 06:34 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手时，协同分支派生 `routeResourceKind: "current"` / `routeResourceText: "保留当前"`，绕行分支派生 `routeResourceKind: "progress"` / `routeResourceText: "投送累计"`。
- `src/app.js` 渲染 `far-dispatch-branch-choice-route-resource` 与 `is-resource-*`；`src/styles.css` 包含 `.far-dispatch-branch-choice-route-resource.is-current` 和 `.is-progress`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `routeResourceKind`、`routeResourceText`、`far-dispatch-branch-choice-route-resource` 和 `is-resource-*`。
- 发布验证已通过：提交 `159b72b` 已推送到 `origin/main`；GitHub Pages workflow `25192747774` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 与 `src/styles.css` 已确认包含资源取向符号相关代码和样式。
- 已回复 GitHub Issue #6，说明本轮资源取向符号、验证和部署结果，issue 保持 open 等待复测。
- 已回复 GitHub Issue #4，说明本轮用图形化资源符号继续降低远航分支卡片文字压力，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 06:37 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 与 #4 更新时间均为 2026-04-30T22:37:27Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线微图

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 06:13 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新后半段玩法反馈，#4 仍指出界面“全是密密麻麻的文字、希望更多图片”，因此本轮继续进入 Product decision，并选择同时降低远航分支文字墙和强化路线感的展示改动。

当前最大问题：前序已经让协同/绕行分支卡片首行出现首推、稳航、改道、建档、已选或已完成徽标，但卡片主体仍主要依赖多行文字解释路线。玩家能扫到判断，却仍缺少一个非文字路线锚点来区分协同直达和绕行偏移。

本轮决策：

- 新增“远航路线微图”。
- 主操作区协同/绕行分支卡片新增 `far-dispatch-branch-choice-route` 三点路线微图：起点、分支点、回目标点。
- 协同路线显示直线轨迹，绕行路线显示带偏移的折线路径；焦点、改道和推荐状态通过既有 `kind` / `status` / `decisionKind` class 影响边框与高亮。
- 微图 `aria-hidden="true"`，完整语义继续由已有 `branchChoiceText`、卡片标题、路线判断、路线目标、路线下一步和收益对照承载。
- 本轮只调整 DOM、样式和静态测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 06:13 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 渲染 `renderFarDispatchBranchChoiceRoute(choice)`、`far-dispatch-branch-choice-route`、`far-dispatch-branch-choice-route-line` 和三枚 route node。
- `src/styles.css` 包含 `.far-dispatch-branch-choice-route.is-sync`、`.is-detour`、`.is-shift` 样式。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `renderFarDispatchBranchChoiceRoute` 和 `far-dispatch-branch-choice-route`。
- 发布验证已通过：提交 `51a8ec3` 已推送到 `origin/main`；GitHub Pages workflow `25192206190` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/app.js` 与 `src/styles.css` 已确认包含 `renderFarDispatchBranchChoiceRoute` 和 `far-dispatch-branch-choice-route`。
- 已回复 GitHub Issue #6，说明本轮路线微图、验证和部署结果，issue 保持 open 等待复测。
- 已回复 GitHub Issue #4，说明本轮新增图形化路线微图以降低远航分支卡片文字密度，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 06:22 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 与 #4 更新时间均为 2026-04-30T22:22:17Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线徽标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 05:51 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经给协同/绕行分支卡片加入路线判断和 `decisionKind` 视觉状态，但卡片首行仍主要显示“协同/绕行 + 可选择/上轮路线/可改道”。玩家快速扫卡时，仍要读到第二行路线判断，才能确认这张卡本轮是首推、稳航、改道、建档、已选还是已完成。

本轮决策：

- 新增“远航路线徽标”。
- `branchChoices` 从既有 `decisionKind` 派生 `decisionBadgeText`：覆盖首推、稳航、改道、建档、备选稳航、备选改道、已选和已完成。
- 主操作区分支卡片首行新增 `far-dispatch-branch-choice-badge is-*`，把短判断放到协同/绕行卡片顶部；`branchChoiceText` 和卡片 `title` 同步包含该短判断，保留可访问与悬停复盘。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 05:51 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手时，契合协同分支派生 `decisionBadgeText: "首推"`，绕行分支派生 `decisionBadgeText: "建档"`。
- 上轮协同路线下，推荐协同派生“稳航”，备选改道派生“备选改道”。
- 上轮绕行路线下，推荐改道派生“改道”，备选稳航派生“备选稳航”。
- `src/app.js` 渲染 `far-dispatch-branch-choice-head` 与 `far-dispatch-branch-choice-badge`；`src/styles.css` 包含路线徽标样式。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `decisionBadgeText` 和 `far-dispatch-branch-choice-badge`。
- 发布验证已通过：提交 `334c70e` 已推送到 `origin/main`；GitHub Pages workflow `25191542397` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `decisionBadgeText` 与 `far-dispatch-branch-choice-badge`。
- 已回复 GitHub Issue #6，说明本轮路线徽标、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 06:04 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T22:04:09Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线判断状态

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 05:33 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经让协同/绕行分支卡片显示“路线判断”，但该判断仍和多行路线目标、下一步、收益对照一起以文本堆叠呈现。玩家能读到首推、稳航、改道或建档，但快速扫卡时仍需要在多行文字中定位判断行。

本轮决策：

- 新增“远航路线判断状态”。
- `branchChoices` 为每条协同/绕行路线派生 `decisionKind`：覆盖 `recommended`、`recommended-stable`、`recommended-shift`、`fallback`、`fallback-stable`、`fallback-shift`、`selected` 和 `completed`。
- 主操作区分支卡片和路线判断行追加 `is-decision-*` 状态 class，让首推/推荐稳航/推荐改道/备选/已选/已完成获得不同视觉强调。
- 本轮只调整派生展示、DOM class、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 05:33 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手时，契合协同分支派生 `decisionKind: "recommended"`，绕行分支派生 `decisionKind: "fallback"`。
- 上轮协同路线下，推荐协同派生 `recommended-stable`，备选改道派生 `fallback-shift`。
- 上轮绕行路线下，推荐改道派生 `recommended-shift`，备选稳航派生 `fallback-stable`。
- `src/app.js` 渲染 `is-decision-*` 与 `getFarDispatchBranchChoiceDecisionKind`；`src/styles.css` 包含路线判断状态样式。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `decisionKind` 和 `is-decision-*` 路线判断状态样式。
- 发布验证已通过：提交 `7f3047d` 已推送到 `origin/main`；GitHub Pages workflow `25190839200` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `decisionKind` 与 `is-decision-*`。
- 已回复 GitHub Issue #6，说明本轮路线判断状态、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 05:45 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T21:45:37Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线判断

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 05:15 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把路线反馈放进行动结果，把路线下一步、路线目标和收益对照放进分支卡片；但协同/绕行卡片默认仍需要玩家同时扫“推荐原因、路线目标、下一步、收益对照和收益明细”，才能判断这张卡本轮到底是首推、稳航、改道、建档还是已选路线。

本轮决策：

- 新增“远航路线判断”。
- `branchChoices` 为每条协同/绕行路线派生 `decisionText`：当前航段契合且无上轮路线时显示“当前航段首推”；推荐且续走上轮显示“推荐稳航”；推荐且改走另一分支显示“推荐改道”；非推荐路线显示“备选建档/备选稳航/备选改道”；当前路线进行中或整备态显示“本轮已选/本轮已完成”。
- 主操作区分支选择条新增 `far-dispatch-branch-choice-decision` 行，aria 汇总 `branchChoiceText` 同步包含路线判断。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 05:15 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手时，推荐协同分支显示“路线判断：当前航段首推”，绕行分支显示“路线判断：备选建档”。
- 有上轮协同路线时，续走推荐协同显示“路线判断：推荐稳航”，改走绕行显示“路线判断：备选改道”。
- 有上轮绕行路线时，改走推荐协同显示“路线判断：推荐改道”，续走绕行显示“路线判断：备选稳航”。
- `src/app.js` 渲染 `far-dispatch-branch-choice-decision`，`src/styles.css` 包含 `.far-dispatch-branch-choice-decision`。
- 本地验证已通过：`node --test tests/game.test.js`、`npm install`、`npm test`、`npm run build`、`bun install --no-save`、`bun run test` 和 `bun run build`；测试数 118 项。
- 构建产物已确认包含 `decisionText`、`far-dispatch-branch-choice-decision` 和“路线判断”相关文案。
- 发布验证已通过：提交 `fae216e` 已推送到 `origin/main`；GitHub Pages workflow `25190159685` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `decisionText`、`far-dispatch-branch-choice-decision` 和“路线判断”。
- 已回复 GitHub Issue #6，说明本轮路线判断、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 05:28 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T21:27:49Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线反馈

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 04:57 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把路线下一步放进协同/绕行分支卡片，并把路线步落到按钮；但点击执行后，行动反馈仍偏向收益清单和“路线执行：...”。玩家完成目标、选择协同/绕行、回航或整备之后，还要回看调度条确认这次点击把路线推进到了哪一步。

本轮决策：

- 新增“远航路线反馈”。
- `activateDirective` 和 `getDirectiveStatus` 派生 `dispatchRouteResultText`：完成目标后提示下一步选择推荐协同或绕行；执行协同/绕行后提示回目标；回航完成后提示整备；整备后提示回目标；整备回航后提示下一轮可重新选择协同或绕行。
- 行动反馈会追加“路线反馈：...”，本地 `directive` 事件同步记录 `dispatchRouteResultText`。
- 本轮只调整执行结果派生、行动反馈、本地事件字段和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 04:57 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手执行目标后，结果包含“路线反馈：已完成目标 点火齐射 · 下一步选择推荐协同 谐振脉冲，或绕行 巡航回收”。
- 目标后执行协同/绕行后，结果包含“路线反馈：已选择协同/绕行 X · 下一步回目标 Y”。
- 协同/绕行回航后，结果包含“路线反馈：已完成协同/绕行回航 Y · 下一步整备/绕行整备 X”。
- 整备与整备回航后，结果分别提示回目标或下一轮重新选择协同/绕行。
- `src/app.js` 在本地 `directive` 事件记录 `dispatchRouteResultText`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `dispatchRouteResultText` 和“路线反馈”相关文案。
- 发布验证已通过：提交 `33c539a` 已推送到 `origin/main`；GitHub Pages workflow `25189433751` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js` 和 `src/app.js` 已确认包含 `dispatchRouteResultText` 和“路线反馈”。
- 已回复 GitHub Issue #6，说明本轮路线反馈、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 05:10 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T21:09:58Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线下一步

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 04:38 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经给协同/绕行分支卡片补齐收益对照和路线目标，但卡片仍需要玩家把“路线目标”“路线预案”“路线步骤”和实际按钮顺序组合起来。尤其在 0/3 起手时，分支卡片已经可见，但真正下一步是先执行目标指令；目标后才轮到协同或绕行选择。

本轮决策：

- 新增“远航路线下一步”。
- `branchChoices` 为每条协同/绕行路线派生 `followupText`：0/3 起手提示先执行目标再选分支；目标后提示执行协同/绕行再回目标；当前路线中提示回目标完成闭环；整备态提示先整备或回目标触发整备回航。
- 主操作区分支选择条新增 `far-dispatch-branch-choice-followup` 行，aria 汇总 `branchChoiceText` 同步包含下一步提示。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 04:38 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 0/3 起手时，协同分支显示“下一步：先执行目标 点火齐射，再选协同 谐振脉冲”，绕行分支显示“下一步：先执行目标 点火齐射，再选绕行 巡航回收”。
- 目标后分支选择态，协同/绕行分支显示“下一步：执行协同/绕行 X，再回目标 Y”。
- `src/app.js` 渲染 `far-dispatch-branch-choice-followup`，`src/styles.css` 包含 `.far-dispatch-branch-choice-followup`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `followupText`、`far-dispatch-branch-choice-followup` 和“下一步：先执行目标”相关文案。
- 发布验证已通过：提交 `2e9bbd5` 已推送到 `origin/main`；GitHub Pages workflow `25188555013` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `followupText`、`far-dispatch-branch-choice-followup` 和“下一步：先执行目标”。
- 已回复 GitHub Issue #6，说明本轮路线下一步、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 04:49 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T20:49:11Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 04:20 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经补齐远航路线预案、路线步骤、按钮标记、契合闭环、闭环复盘、路线稳航和收益对照，但分支卡片仍偏向说明“给什么收益”。玩家选择协同/绕行前还需要把上轮路线、当前航段契合、改道和轮替闭环翻译成“这条路线本轮要达成什么目标”。

本轮决策：

- 新增“远航路线目标”。
- `branchChoices` 为每条协同/绕行路线派生 `objectiveText`：无上轮分支时提示按当前航段推荐建档或建立路线作为下轮对照；续走上轮路线时提示触发路线稳航；改走另一条路线时提示开启轮替闭环；当前路线进行中或整备态时提示本轮回航确认或整备后接回目标。
- 主操作区分支选择条新增 `far-dispatch-branch-choice-objective` 行，aria 汇总 `branchChoiceText` 同步包含路线目标。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 04:20 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 无上轮路线时，契合协同分支显示“路线目标：按当前航段推荐建立协同路线”，非契合绕行分支显示“路线目标：建立绕行路线，记录为下轮对照”。
- 有上轮协同路线时，续走协同显示“续走上轮推荐协同，触发路线稳航”，改走绕行显示“改走绕行，开启轮替闭环”。
- 有上轮绕行路线时，改走契合协同显示“改走推荐协同，开启轮替闭环”，续走绕行显示“续走上轮绕行，触发路线稳航”。
- `src/app.js` 渲染 `far-dispatch-branch-choice-objective`，`src/styles.css` 包含 `.far-dispatch-branch-choice-objective`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `objectiveText`、`far-dispatch-branch-choice-objective` 和“路线目标”相关文案。
- 发布验证已通过：提交 `6d3c3b2` 已推送到 `origin/main`；GitHub Pages workflow `25187776607` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `objectiveText`、`far-dispatch-branch-choice-objective` 和“路线目标”。
- 已回复 GitHub Issue #6，说明本轮路线目标、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 04:31 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T20:31:35Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线收益对照

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 04:01 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经补齐远航路线预案、路线步骤、按钮标记、契合闭环、闭环复盘和路线稳航，但协同/绕行分支选择条仍需要玩家把“本步即时收益”和“回目标闭环收益”从多枚徽标里心算。稳航、改道、契合闭环和轮替闭环都已经可见，但选择前缺少一行把本步合计与回目标收益放在同一条路线里对照。

本轮决策：

- 新增“远航路线收益对照”。
- `branchChoices` 为每条协同/绕行路线派生 `payoffText`，显示“本步合计 +X%”以及回目标会触发的远航闭环、远航突破、绕行突破、轮替闭环和契合闭环。
- 主操作区分支选择条新增 `far-dispatch-branch-choice-payoff` 行，aria 汇总 `branchChoiceText` 同步包含收益对照。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 04:01 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 无上轮路线时，协同分支显示本步合计包含远航协同、协同补给和航段契合，回目标包含远航闭环、远航突破和契合闭环。
- 绕行分支显示本步合计、投送累计提示，回目标包含远航闭环、远航突破和绕行突破。
- 有上轮协同路线时，续走协同的本步合计包含路线稳航，改走绕行的回目标预览包含轮替闭环。
- 有上轮绕行路线时，改走协同的本步合计包含分支改道和航段契合，回目标预览包含轮替闭环和契合闭环；续走绕行的本步合计包含路线稳航。
- `src/app.js` 渲染 `far-dispatch-branch-choice-payoff`，`src/styles.css` 包含 `.far-dispatch-branch-choice-payoff`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `payoffText`、`far-dispatch-branch-choice-payoff` 和“本步合计”相关文案。
- 发布验证已通过：提交 `21eb0b0` 已推送到 `origin/main`；GitHub Pages workflow `25187053269` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `payoffText`、`far-dispatch-branch-choice-payoff` 和“本步合计”。
- 已回复 GitHub Issue #6，说明本轮路线收益对照、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 04:15 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T20:14:51Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线稳航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 03:46 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把远航路线的预案、步骤、按钮标记、契合闭环和闭环复盘补齐，但跨轮分支仍偏向“改走另一条路线才有奖励”。如果玩家判断当前资源状态更适合续走上轮分支，界面会标出“上轮路线”，但缺少与“分支改道 +6%”并列的稳定路线收益确认。

本轮决策：

- 新增“远航路线稳航”。
- 目标指令后，如果玩家续走上一轮记录的协同/绕行分支，获得有效基础指令收益 4% 的“路线稳航”奖励。
- 该判断复用现有 `farRouteLastBranchDirectiveId`、目标指令、分支选择和指令链状态；不新增存档字段。
- 分支选择条会把上轮路线显示为“路线稳航 +4%”；推荐分支如果同时是上轮路线，会追加“路线稳航 +4%”；分支轮替提示会同时说明“续走上轮路线触发路线稳航 +4%”与“改走另一分支触发分支改道 +6% / 轮替闭环 +9%”。
- `src/app.js` 在本地 `directive` 事件记录 `dispatchBranchStabilityReward` / `dispatchBranchStabilityRewardRate` / `dispatchBranchStabilityRewardText`，并渲染 `directive-dispatch-branch-stability` 徽标。
- 本轮只新增续走上轮分支的即时奖励与展示，不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、调度校准、远航续航、远航协同、协同补给、远航绕行、绕行投送、分支改道、航段契合、轮替闭环、契合闭环、远航闭环、突破、整备奖励、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 03:46 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE` 为 0.04。
- 没有上轮分支记录时，目标后的协同/绕行分支不会触发路线稳航。
- 上轮分支为协同时，续走协同触发“路线稳航 +X”，改走绕行不触发路线稳航但仍可触发分支改道。
- 上轮分支为绕行时，续走绕行触发“路线稳航 +X”，改走协同不触发路线稳航但仍可触发分支改道。
- 分支选择条、推荐分支、分支轮替提示、按钮徽标、预计收益、执行反馈、本地 `directive` 事件、反馈快照和静态解锁说明同步包含“路线稳航”。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `dispatchBranchStabilityReward`、`directive-dispatch-branch-stability` 和“路线稳航”相关文案。
- 发布验证已通过：提交 `a5deae1` 已推送到 `origin/main`；GitHub Pages workflow `25186268001` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `dispatchBranchStabilityReward`、`FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE`、`directive-dispatch-branch-stability` 和“路线稳航”。
- 已回复 GitHub Issue #6，说明本轮路线稳航、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 03:56 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T19:55:59Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航闭环复盘

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 03:17 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把路线预案、路线步骤、路线按钮标记和契合闭环补齐，但完成 3/3 后的调度条主要进入整备提示。玩家能看到下一步整备，却缺少一行把“刚刚完成了哪条路线、触发了哪些闭环收益、下一步为什么整备”串起来的复盘。

本轮决策：

- 新增“远航闭环复盘”。
- `getFarRouteDispatch` 在协同整备或绕行整备态派生 `branchClosureText`：刚完成闭环时显示“刚完成协同/绕行 X · 已触发远航闭环、远航突破、绕行突破/契合闭环 · 下一步整备/绕行整备 X”；整备指令已执行后显示“X 已整备 · 下一步回目标触发整备回航 +6%”。
- 主操作区远航调度条新增 `far-dispatch-branch-closure`，星图总览远航摘要和反馈快照长文本同步包含闭环复盘。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、调度校准、远航续航、远航协同、协同补给、远航绕行、绕行投送、分支改道、航段契合、轮替闭环、契合闭环、远航闭环、突破、整备奖励、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 03:17 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 协同路线回目标完成 3/3 后，远航调度显示“闭环复盘：刚完成协同 谐振脉冲 · 已触发远航闭环 +16%、远航突破 +0.05%剩余、契合闭环 +7% · 下一步整备 谐振脉冲”。
- 绕行路线回目标完成 3/3 后，远航调度显示“闭环复盘：刚完成绕行 巡航回收 · 已触发远航闭环 +16%、远航突破 +0.05%剩余、绕行突破 +0.03%剩余 · 下一步绕行整备 巡航回收”。
- 整备指令执行后，闭环复盘切换为“协同/绕行 X 已整备 · 下一步回目标触发整备回航 +6%”。
- `src/app.js` 渲染 `dispatch.branchClosureText`，`index.html` 包含 `far-dispatch-branch-closure` 占位，`src/styles.css` 包含 `.far-dispatch-branch-closure`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `branchClosureText`、`far-dispatch-branch-closure` 和“闭环复盘”相关文案。
- 发布验证已通过：提交 `c54273f` 已推送到 `origin/main`；GitHub Pages workflow `25185043034` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `branchClosureText`、`far-dispatch-branch-closure` 和“闭环复盘”。
- 已回复 GitHub Issue #6，说明本轮闭环复盘、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 03:27 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T19:27:24Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航契合闭环

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 02:48 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把远航路线预案、路线步骤和路线按钮标记落到可点击按钮，但“按当前航段推荐分支走完一整圈”仍只在第二步获得航段契合收益。玩家回到目标完成 3/3 时还缺少“这条契合路线已经闭环”的直接确认。

本轮决策：

- 新增“远航契合闭环”。
- 当本轮路线用当前航段契合分支完成目标 -> 协同/绕行 -> 回目标的 3/3 闭环时，回到当前航段目标指令额外获得有效基础指令收益 7% 的“契合闭环”奖励。
- `src/game.js` 新增 `FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE` 和 `dispatchFocusLoopReward` 预览/执行结算；`src/app.js` 在本地 `directive` 事件记录 `dispatchFocusLoopReward` / `dispatchFocusLoopRewardRate` / `dispatchFocusLoopRewardText` 并渲染 `directive-dispatch-focus-loop` 徽标。
- 远航调度长文本、星图当前航段 3 步路径收益标签、静态首页解锁说明、反馈快照和测试同步包含“契合闭环 +7%”。
- 本轮只新增契合分支回目标的闭环奖励，不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、调度校准、远航续航、远航协同、协同补给、远航绕行、绕行投送、分支改道、航段契合、轮替闭环、远航闭环、远航突破、绕行突破、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 02:48 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE` 为 0.07。
- 选择当前航段契合分支后回到当前航段目标指令完成 3/3，会在预计收益和执行反馈中显示并结算“契合闭环 +X”；未走契合分支时不触发。
- 远航调度长文本包含“若用当前航段契合分支回到目标，还会触发契合闭环 +7%”。
- 星图当前航段 3 步路径第三步收益标签包含“契合闭环 +7%”。
- `src/app.js` 渲染 `directive-dispatch-focus-loop` 并在本地 `directive` 事件记录 `dispatchFocusLoopReward` / `dispatchFocusLoopRewardRate` / `dispatchFocusLoopRewardText`；`src/styles.css` 包含 `.directive-button .directive-dispatch-focus-loop`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `dispatchFocusLoopReward`、`directive-dispatch-focus-loop` 和“契合闭环”相关文案。
- 发布验证已通过：提交 `0278967` 已推送到 `origin/main`；GitHub Pages workflow `25184200739` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `dispatchFocusLoopReward`、`FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE`、`directive-dispatch-focus-loop` 和“契合闭环”。
- 已回复 GitHub Issue #6，说明本轮契合闭环、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 03:09 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T19:09:07Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线按钮标记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 02:30 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：上一轮已经在远航调度条显示“路线步骤”，但玩家实际执行时仍要把调度条上的第 1/3、2/3、3/3 与三枚航线指令按钮对应起来。后半段短循环需要把路线步骤直接落到可点击按钮，并在执行后确认刚完成了哪一步。

本轮决策：

- 新增“远航路线按钮标记”。
- 航线指令按钮从当前远航分支态势派生 `dispatchRouteStepText`：目标按钮显示“路线 1/3 目标”，目标后分支按钮显示“路线 2/3 推荐协同/绕行”，回航目标显示“路线 3/3 协同回航/绕行回航”，整备态显示“路线 整备续航/绕行整备/整备回航”。
- 执行航线指令后，行动反馈和本地 `directive` 事件记录 `dispatchRouteStepText`，行动提示会显示“路线执行：...”确认已完成的路线步。
- 本轮只调整派生展示、按钮徽标、行动反馈、事件字段和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 02:30 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸起手时，点火齐射按钮显示“路线 1/3 目标”，执行反馈包含“路线执行：1/3 目标”。
- 目标后分支选择态，谐振脉冲显示“路线 2/3 推荐协同”，巡航回收显示“路线 2/3 绕行”。
- 绕行进行中，点火齐射显示“路线 3/3 绕行回航”；协同进行中显示“路线 3/3 协同回航”。
- 整备态显示“路线 整备续航/绕行整备/整备回航”并在执行反馈中确认。
- `src/app.js` 渲染 `directive-dispatch-route-step` 并在本地 `directive` 事件记录 `dispatchRouteStepText`；`src/styles.css` 包含 `.directive-button .directive-dispatch-route-step`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `dispatchRouteStepText`、`directive-dispatch-route-step` 和“路线执行”相关文案。
- 发布验证已通过：提交 `68475f5` 已推送到 `origin/main`；GitHub Pages workflow `25182952388` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页返回 HTTP 200，线上 `src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `dispatchRouteStepText`、`directive-dispatch-route-step` 和“路线执行”。
- 已回复 GitHub Issue #6，说明本轮路线按钮标记、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 02:41 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T18:41:25Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env*` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线步骤

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 02:07 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经显示路线预案，但“当前该执行第几步”仍分散在路线预案、闭环进度、按钮徽标和整备提示中。玩家需要一行能直接把路线预案落到当前操作步骤的提示。

本轮决策：

- 新增“远航路线步骤”。
- `getFarRouteDispatch` 从当前分支态势和 `branchChoices` 派生 `branchPlanStepText`：覆盖第 1/3 执行目标、第 2/3 选择推荐协同/绕行、第 3/3 协同/绕行回航、整备续航和整备回航。
- 主操作区远航调度条新增 `far-dispatch-branch-step`，星图总览远航摘要和反馈快照长文本同步包含路线步骤。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 02:07 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸初始远航调度显示“路线步骤：第 1/3 执行目标 点火齐射”。
- 目标后分支选择态显示“路线步骤：第 2/3 选择推荐协同 谐振脉冲，或绕行 巡航回收”。
- 绕行进行中显示“路线步骤：第 3/3 绕行回航 点火齐射”。
- 协同整备完成态显示“路线步骤：整备 谐振脉冲，随后回目标 点火齐射”，整备续航后显示“路线步骤：整备回航 点火齐射”。
- `src/app.js` 渲染 `dispatch.branchPlanStepText`；`index.html` 包含 `far-dispatch-branch-step` 占位；`src/styles.css` 包含 `.far-dispatch-branch-step`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `branchPlanStepText`、`far-dispatch-branch-step` 和“路线步骤”相关文案。
- 发布验证已通过：提交 `458c6f7` 已推送到 `origin/main`；GitHub Pages workflow `25182079509` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页、`src/game.js`、`src/app.js` 和 `src/styles.css` 已确认包含 `branchPlanStepText`、`far-dispatch-branch-step` 和“路线步骤”。
- 已回复 GitHub Issue #6，说明本轮路线步骤、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 02:22 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T18:22:17Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线预案

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 01:50 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经显示推荐分支、分支轮替、路线履历和协同/绕行后续，但玩家仍要把目标指令、推荐/当前分支和回目标闭环拼成一条完整执行路线。后半段短循环需要直接给出“这一轮该怎么走”的路线预案。

本轮决策：

- 新增“远航路线预案”。
- `getFarRouteDispatch` 从当前目标指令、`branchChoices`、分支态势和航段契合推荐派生 `branchPlanText`，显示“推荐/本轮/下一轮 目标 X -> 协同/绕行 Y -> 回目标 X”。
- 主操作区远航调度条新增 `far-dispatch-branch-plan`，星图总览远航摘要和反馈快照长文本同步包含路线预案。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 01:50 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸初始远航调度显示“路线预案：推荐 目标 点火齐射 -> 协同 谐振脉冲 -> 回目标 点火齐射”。
- 绕行进行中显示“路线预案：本轮 目标 点火齐射 -> 绕行 巡航回收 -> 回目标 点火齐射”。
- 协同整备完成态显示“路线预案：下一轮 目标 点火齐射 -> 绕行 巡航回收 -> 回目标 点火齐射”。
- `src/app.js` 渲染 `dispatch.branchPlanText`；`index.html` 包含 `far-dispatch-branch-plan` 占位；`src/styles.css` 包含 `.far-dispatch-branch-plan`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `branchPlanText`、`far-dispatch-branch-plan` 和“路线预案”相关文案。
- 发布验证已通过：提交 `41a5108` 已推送到 `origin/main`；GitHub Pages workflow `25181140147` 成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`；线上首页、`src/app.js`、`src/game.js` 和 `src/styles.css` 已确认包含 `far-dispatch-branch-plan`、`branchPlanText` 和“路线预案”。
- 已回复 GitHub Issue #6，说明本轮路线预案、验证和部署结果，issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 02:02 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T18:01:47Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航路线履历

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 01:41 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把分支轮替目标和轮替闭环奖励落到远航调度，但玩家仍需要在“分支轮替”“当前路线”“可改道”和闭环进度之间组合路线记忆。后半段短循环要更像路线循环，需要直接显示已记录路线、本轮路线和下一步确认。

本轮决策：

- 新增“远航路线履历”。
- `getFarRouteDispatch` 从现有 `branchChoices`、分支态势和既有 `farRouteLastBranchDirectiveId` 派生 `branchRouteText`，显示“记录 X · 本轮 Y · 下一步确认”。
- 主操作区远航调度条新增 `far-dispatch-branch-route`，星图总览远航摘要和反馈快照长文本同步包含路线履历。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度既有数值、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 01:41 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 无记录路线时显示“路线履历：记录 无 · 本轮 待选择 · 先完成任一分支闭环”。
- 绕行进行中显示已记录绕行、本轮绕行，并提示回目标后记录当前路线。
- 协同整备完成态显示已记录协同、本轮协同，并提示下一轮可改道。
- `src/app.js` 渲染 `dispatch.branchRouteText`；`index.html` 包含 `far-dispatch-branch-route` 占位；`src/styles.css` 包含 `.far-dispatch-branch-route`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `branchRouteText`、`far-dispatch-branch-route` 和“路线履历”相关文案。
- 发布验证已通过：提交 `9994b3c` 已推送到 `origin/main`；GitHub Pages workflow `25180220027` 成功；线上首页、`src/app.js` 和 `src/game.js` 已确认包含 `far-dispatch-branch-route`、`branchRouteText` 和“路线履历”。
- 已回复 GitHub Issue #6，说明本轮路线履历、验证和部署结果，issue 保持 open 等待复测。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名，也未发现本地 `.env` 文件；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航轮替闭环奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 00:57 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把跨轮分支轮替目标显示到主操作区和星图总览，但“改走另一条路线”主要在第二步通过分支改道给即时反馈。玩家完成改道路线并回到目标时，闭环本身还没有确认“这次跨轮轮替已经完成”，容易仍把分支轮替理解成当轮按钮收益。

本轮决策：

- 新增“远航轮替闭环奖励”。
- 目标后选择与上一轮不同的协同/绕行分支时，记录短期 `farRouteBranchRotationDirectiveId`；该字段只用于本轮闭环待结算，旧存档自动补齐为空。
- 如果本轮改道分支随后回到当前航段目标指令并完成 3/3，额外获得有效基础指令收益 9% 的“轮替闭环”奖励；结算后清空待结算分支。
- 分支轮替提示在可改道时同步预告“回到目标闭环触发轮替闭环 +9%”；当前已改走轮替分支时显示“当前已改走 X，回到目标闭环触发轮替闭环 +9%”。
- 按钮徽标、预计收益、执行反馈、本地 `directive` 事件、远航 3 步路径收益标签、反馈快照长文本和静态首页解锁说明同步包含轮替闭环。
- 本轮不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、调度校准、远航续航、远航协同、协同补给、远航绕行、绕行投送、分支改道、航段契合、远航闭环、远航突破、绕行突破、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 00:57 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE` 为 0.09。
- 上一轮协同、本轮改走绕行后，回到当前航段目标指令会显示并结算“轮替闭环 +X”；重复同一分支不触发。
- 分支轮替提示包含闭环奖励预告，远航路径第三步收益标签包含“轮替闭环 +9%”。
- `src/app.js` 渲染 `directive-dispatch-branch-rotation`，并在本地 `directive` 事件中记录 `dispatchBranchRotationReward` / `dispatchBranchRotationRewardRate` / `dispatchBranchRotationRewardText`。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-branch-rotation`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE`、`farRouteBranchRotationDirectiveId`、`dispatchBranchRotationReward`、`directive-dispatch-branch-rotation` 和“轮替闭环”相关文案。
- 提交 a436937 已推送；GitHub Pages workflow 25179184181 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含轮替闭环相关标记。
- #6 已回复：说明目标后改走不同分支会记录轮替分支，回到目标完成 3/3 时结算“轮替闭环 +9%”；issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 01:17 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T17:17:29Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

## 2026-05-01 Product decision：远航分支轮替目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 00:45 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把协同/绕行路线、推荐原因、后续回航和可改道收益展示出来，但玩家仍需要自己把“上轮路线”和“可改道”翻译成跨轮目标。后半段短循环如果只看本轮收益，仍可能被理解成两个可选按钮，而不是需要跨轮轮替规划的路线循环。

本轮决策：

- 新增“远航分支轮替目标”。
- `getFarRouteDispatch` 从现有 `branchChoices` 派生 `branchRotationText`：没有上轮分支时提示先完成任一分支闭环；已有上轮分支时提示改走另一条协同/绕行路线触发“分支改道 +6%”；当前已走某路线但还没有上轮记录时提示完成闭环后下一轮可改道。
- 主操作区远航调度条新增 `far-dispatch-branch-rotation`，星图总览远航调度摘要和反馈快照长文本同步带出轮替目标。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度收益、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 00:45 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸初始远航调度显示“分支轮替：先完成协同或绕行闭环，下一轮开启分支改道”。
- 绕行路线进行中显示“分支轮替：改走协同 谐振脉冲触发分支改道 +6%”。
- 协同整备完成态显示“分支轮替：改走绕行 巡航回收触发分支改道 +6%”。
- `src/app.js` 渲染 `dispatch.branchRotationText`；`index.html` 包含 `far-dispatch-branch-rotation` 占位；`src/styles.css` 包含 `.far-dispatch-branch-rotation`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `branchRotationText`、`far-dispatch-branch-rotation` 和“分支轮替”相关文案。
- 提交 afaf093 已推送；GitHub Pages workflow 25178047291 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含 `branchRotationText`、`far-dispatch-branch-rotation` 和“分支轮替”相关标记。
- #6 已回复：说明远航调度会直接给出跨轮分支轮替目标；issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 00:52 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T16:52:08Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测，重点确认“分支轮替”是否让协同/绕行更像跨轮路线循环。

## 2026-05-01 Product decision：远航推荐原因标明

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 00:27 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经让分支选择条显示协同/绕行后的回航结果，但推荐分支仍主要写“走哪条、得到什么、后续怎样”。玩家如果没有读到前面的航段契合说明，仍可能不知道为什么当前航段推荐协同或绕行，从而把推荐当成固定收益提示。

本轮决策：

- 新增“远航推荐原因标明”。
- `getFarRouteDispatchBranchFocus` 派生 `reasonText`，例如“推荐原因：点击/过载航段保留当前资源”或“推荐原因：自动/总产能航段投送累计航段”。
- `branchChoices` 的契合路线新增 `reasonText`，分支选择条在契合卡片上直接渲染该原因；`branchChoiceText` 和 `branchRecommendationText` 同步包含推荐原因，星图总览远航调度摘要也会带出推荐原因。
- 本轮只调整派生展示、DOM、样式和测试；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度收益、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 00:27 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸这类点击/过载奖励航段，推荐分支文本包含“推荐原因：点击/过载航段保留当前资源”。
- 离辉轨道港这类自动奖励航段，`branchFocusReasonText` 为“推荐原因：自动/总产能航段投送累计航段”。
- 分支选择条仅在当前航段契合路线显示推荐原因；非契合路线不伪装成推荐路线。
- `src/app.js` 渲染 `choice.reasonText`；`src/styles.css` 包含 `.far-dispatch-branch-choice-reason`。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `branchFocusReasonText`、`choice.reasonText`、“推荐原因：点击/过载航段保留当前资源”和 `.far-dispatch-branch-choice-reason`。
- 提交 dd1e4d0 已推送；GitHub Pages workflow 25177316830 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含 `branchFocusReasonText`、`choice.reasonText` 与 `.far-dispatch-branch-choice-reason`。
- #6 已回复：说明推荐分支和契合分支卡片会显示推荐原因；issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 00:36 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T16:36:07Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测，重点确认“推荐协同/绕行”是否能解释成当前航段奖励类型驱动的路线选择。

## 2026-05-01 Product decision：远航分支后续预告

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-05-01 00:06 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：前序已经把协同/绕行具体指令、推荐分支、航段契合、可改道和按钮级推荐都展示出来，但玩家在目标后的分支选择条里仍主要看到“现在选什么”和“这一步奖励什么”。如果不直接写出分支选择后的下一段路线，协同/绕行仍可能被理解成两个收益按钮，而不是会进入不同回航状态的短循环。

本轮决策：

- 新增“远航分支后续预告”。
- `branchChoices` 为协同路线派生“后续协同回航触发闭环与远航突破”，为绕行路线派生“后续绕行回航触发闭环与绕行突破”。
- 分支选择条新增一行后续预告；`branchChoiceText` 和 `branchRecommendationText` 同步包含后续预告，星图总览远航调度摘要也会带出推荐分支后续。
- 本轮只调整派生展示、DOM 和样式；不新增收益、不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度收益、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-05-01 00:06 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸这类点击/过载奖励航段，推荐分支文本显示协同路线后续会协同回航并触发闭环与远航突破。
- 分支选择条中协同和绕行两项分别显示后续协同回航、后续绕行回航，不只显示资源取向和收益。
- `src/app.js` 渲染 `choice.nextText`；`src/styles.css` 为分支选择条中的后续预告提供紧凑样式。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `choice.nextText`、后续协同/绕行回航文案和 `.far-dispatch-branch-choice small`。
- 提交 f31face 已推送；GitHub Pages workflow 25176578989 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含 `choice.nextText`、后续协同/绕行回航文案和 `.far-dispatch-branch-choice small`。
- #6 已回复：说明分支选择条、推荐分支和星图总览摘要会直接显示协同/绕行后的回航结果；issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-05-01 00:19 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T16:19:15Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测，重点确认分支选择条是否更像路线选择，而不是两个收益按钮。

## 2026-04-30 Product decision：星图远航分支路径标明

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 23:48 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：目标后的实际按钮已经能标出“推荐协同/推荐绕行”，主操作区也有分支选择条；但星图当前航段卡片的 3 步路径仍把第二步写成“协同/绕行 X”或泛化“绕行备选”。玩家在星图目标层扫当前航段时，仍不能直接知道协同和绕行分别对应哪枚航线指令。

本轮决策：

- 新增“星图远航分支路径标明”。
- `buildProjectDispatchInfo` 从现有目标指令和协同续航指令继续派生绕行备选指令，并把星图当前航段详情改为“协同 X · 绕行 Y”。
- 星图当前航段 3 步路径第二步改为“协同 X / 绕行 Y”，主操作区远航路径轨也同步显示实际绕行指令名，不再只写“X/绕行”。
- 本轮只调整派生展示和测试，不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、远航调度收益、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 23:48 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸星图当前航段详情显示“协同 谐振脉冲 · 绕行 巡航回收”。
- 星图当前航段 3 步路径第二步显示“协同 谐振脉冲 / 绕行 巡航回收”。
- 主操作区远航路径轨第二步显示“谐振脉冲/巡航回收”，不再显示泛化“谐振脉冲/绕行”。
- `getProjectStatuses` 暴露 `dispatchDetourDirectiveId` / `dispatchDetourDirectiveName`，便于后续展示和测试复用。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `dispatchDetourDirectiveId` 与具体协同/绕行路径名。
- 提交 048487d 已推送；GitHub Pages workflow 25175638829 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，线上 `game.js` 已确认包含 `dispatchDetourDirectiveId` 与具体协同/绕行路径名。
- #6 已回复：说明星图当前航段卡片和 3 步路径会直接显示“协同 X / 绕行 Y”；issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 23:59 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T15:59:46Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测，重点确认星图目标层是否更容易看清协同/绕行具体路径。

## 2026-04-30 Product decision：推荐分支按钮标记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 23:35 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经能在主操作区和星图总览显示“推荐分支”，但目标指令后的两个实际按钮仍分别显示“远航协同/远航绕行”。玩家在实际点击时仍可能需要回看调度条，才能确认哪一个按钮是当前航段契合推荐。

本轮决策：

- 新增“推荐分支按钮标记”。
- 当指令轮换处于目标后的远航续航阶段，且按钮对应当前航段契合分支时，按钮推荐徽标改为“推荐协同”或“推荐绕行”。
- 推荐分支按钮冷却时显示“等待推荐协同”或“等待推荐绕行”。
- 非契合的另一个分支仍保持“远航协同”或“远航绕行”，避免隐藏另一条可选路线。
- 本轮只调整按钮推荐文案与测试，不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度收益、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 23:35 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 脉冲航闸这类点击/过载奖励航段，目标指令后契合协同路线，协同按钮显示“推荐协同”；冷却时显示“等待推荐协同”。
- 离辉轨道港这类自动奖励航段，目标指令后契合绕行路线，绕行按钮显示“推荐绕行”，非契合协同按钮仍显示“远航协同”。
- 契合分支仍结算既有“航段契合 +5%”，非契合分支不触发。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `推荐` + `branchFocusDirectiveId` 按钮级推荐逻辑。
- 提交 3068cbe 已推送；GitHub Pages workflow 25174805397 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，线上 `game.js` 已确认包含 `branchFocusDirectiveId` 与按钮级推荐逻辑。
- #6 已回复：说明目标后的契合分支按钮会显示“推荐协同/推荐绕行”，非契合分支仍保留原路线文案；issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 23:42 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T15:42:26Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测，重点确认按钮级“推荐协同/推荐绕行”是否降低实际点击时的分支判断成本。

## 2026-04-30 Product decision：远航推荐分支

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 23:16 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经能显示协同/绕行选择、上轮路线、可改道和航段契合，但玩家仍需要在分支选择条、航段契合说明和可改道状态之间自行判断“这一轮到底建议走哪条路线”。当航段契合与分支改道同时存在时，这个判断尤其容易被拆散到多个徽标里。

本轮决策：

- 新增“远航推荐分支”派生展示。
- `getFarRouteDispatch` 从现有 `branchChoices` 选择当前航段契合的分支，派生 `branchRecommendationText`。
- 推荐文本同时合并路线名、指令名、当前状态、资源取向、航段契合 +5%；当推荐分支也是可改道路线时，额外显示分支改道 +6%。
- 主操作区远航调度条新增 `far-dispatch-branch-recommendation`，星图总览远航调度摘要同步包含推荐分支。
- 本轮只新增派生展示和样式，不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度收益、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 23:16 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 锁定态和全部完成态 `branchRecommendationText` 为空。
- 脉冲航闸这类点击奖励航段显示“推荐分支：协同 谐振脉冲 · 可选择 · 补当前资源 · 航段契合 +5%”。
- 上一轮绕行后进入点击/过载奖励航段时，推荐协同分支同时显示“航段契合 +5%”与“分支改道 +6%”。
- 主操作区渲染 `far-dispatch-branch-recommendation`，静态首页保留同名占位，样式中包含 `.far-dispatch-branch-recommendation`。
- 星图总览 `dispatchText` 包含推荐分支，便于在星图层直接看到当前航段建议路线。
- 本地验证已通过：`node --test tests/game.test.js`、`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 提交 a679fe9 已推送；GitHub Pages workflow 25174001536 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含 `branchRecommendationText`、`far-dispatch-branch-recommendation` 和“推荐分支”相关标记。
- #6 已回复：说明本轮新增“远航推荐分支”，会把当前航段契合路线、路线状态、资源取向、航段契合和可改道奖励合并到一行；issue 保持 open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 23:27 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T15:26:46Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测，重点确认“推荐分支”是否能让玩家更快判断当前航段建议走协同还是绕行。

## 2026-04-30 Product decision：远航航段契合

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 23:01 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经能并排展示协同/绕行分支，也能显示上轮路线和可改道路线。但两条分支仍主要由通用资源取向决定，当前星图航段只指定目标指令，还没有进一步决定“这一段更适合走协同还是绕行”。这会让后半段分支仍可能变成固定偏好，而不是随当前航段奖励类型变化。

本轮决策：

- 新增“远航航段契合”。
- `getFarRouteDispatch` 根据当前未完成航段奖励类型派生 `branchFocusKind` / `branchFocusText` / `branchFocusDirectiveId` / `branchFocusDirectiveName`。
- 点击/过载奖励航段契合协同路线，显示“点击/过载航段保留当前资源”；自动/总产能奖励航段契合绕行路线，显示“自动/总产能航段投送累计航段”。
- 目标指令后的契合分支获得有效基础指令收益 5% 的“航段契合”奖励，并在分支选择条、路径收益、按钮徽标、预计收益、执行反馈和本地 `directive` 事件中可见。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度原有收益、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 23:01 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE` 为 0.05。
- 脉冲航闸这类点击奖励航段契合协同路线，分支选择条在协同项显示“航段契合 +5%”。
- 离辉轨道港这类自动奖励航段契合绕行路线，分支选择条在绕行项显示“航段契合 +5%”。
- 目标后的契合分支按钮显示并结算“航段契合 +X”；非契合分支不触发。
- `src/app.js` 记录 `dispatchBranchFocusReward` / `dispatchBranchFocusRewardRate` / `dispatchBranchFocusRewardText` 事件字段，并渲染 `directive-dispatch-branch-focus` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-branch-focus` 和 `.far-dispatch-branch-choice.is-focused` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 提交 0ca888d 已推送；GitHub Pages workflow 25173150738 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含航段契合相关标记。
- #6 已回复：说明本轮新增“航段契合 +5%”，点击/过载航段契合协同，自动/总产能航段契合绕行，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 23:10 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T15:10:10Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测，重点确认“当前航段指定目标指令 + 当前航段推荐分支”是否比固定协同/绕行路线更像后半段玩法变化。

## 2026-04-30 Product decision：远航分支选择条

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 22:30 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经有协同、绕行、分支态势和分支改道，但主操作区只显示一个当前分支徽标和三步路径。玩家在目标后的第二步仍需要从按钮徽标、路径文本和上一轮分支记忆中推断“协同补给”和“绕行投送”两条路线的差异，以及哪条会触发分支改道。

本轮决策：

- 新增“远航分支选择条”。
- `getFarRouteDispatch` 派生 `branchChoices` / `branchChoiceText`，并把协同路线和绕行路线并排展示。
- 协同选择显示协同续航指令、补当前资源、远航协同 +5% 与协同补给 +3%当前；绕行选择显示绕行备选指令、投送累计航段、远航绕行 +4% 与绕行投送 -0.3%当前。
- 当已有上一轮远航分支时，选择条会标出“上轮路线”和“可改道”，并在可改道路线里显示分支改道 +6%；当前路线显示“当前路线”。
- 本轮只新增派生展示和样式，不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度各项奖励、冷却、连携窗口、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 22:30 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 锁定态和全部完成态 `branchChoices` 为空。
- 远航调度 active 时，`branchChoices` 同时包含协同和绕行两条路线。
- 选择绕行后，绕行路线显示“当前路线”，协同路线显示“可改道”；选择协同后状态反向显示。
- 上一轮协同后目标分支选择条会把绕行标为“可改道”并显示“分支改道 +6%”；上一轮绕行后会把协同标为“可改道”。
- 主操作区渲染 `far-dispatch-branch-choices` 和 `far-dispatch-branch-choice`，静态首页保留同名占位。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 提交 806b88b 已推送；GitHub Pages workflow 25171845682 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含 `far-dispatch-branch-choices`、`branchChoices`、“分支选择”和“可改道”相关标记。
- #6 已回复：说明远航调度条新增协同/绕行并排选择条，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 22:45 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T14:44:57Z。

下一步：等待 #6 复测分支选择条是否能降低后半段分支理解成本；如果仍不足，再评估更重的资源循环或项目分支。

## 2026-04-30 Product decision：远航分支改道

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 22:14 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经能显示协同/绕行分支态势，但协同和绕行仍容易变成玩家固定选择的两条收益路线。分支被看见之后，还需要让“本轮是否切换路线”本身具备即时回报，避免玩家只按一个最优路线重复执行。

本轮决策：

- 新增“远航分支改道”奖励。
- 复用现有 `farRouteLastBranchDirectiveId` 记录上一轮远航分支；目标指令后选择与上一轮不同的分支时，按有效基础指令收益 6% 结算“分支改道”。
- 上一轮协同时，本轮选择绕行可触发分支改道；上一轮绕行时，本轮选择协同可触发分支改道；重复同一分支不触发。
- 按钮徽标、预计收益、执行反馈、本地 `directive` 事件、静态支持文案、远航路径收益标签和反馈快照同步显示/记录 `dispatchBranchShiftReward` / `dispatchBranchShiftRewardRate` / `dispatchBranchShiftRewardText`。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、协同补给、远航绕行、绕行投送、远航闭环、远航突破、绕行突破、整备续航、绕行整备、整备回航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 22:14 CST 当前 5 个 open feedback issue、0 个 open bug issue；回复 #6 后于 2026-04-30 22:23 CST 再次同步，#6 更新时间为 2026-04-30T14:23:13Z。
- `FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE` 为 0.06。
- `getDirectiveStatus` 在上一轮协同后选择绕行、或上一轮绕行后选择协同时显示“分支改道 +X”。
- `activateDirective` 执行改道分支时结算分支改道奖励，执行反馈包含“分支改道”，并把当前分支写回 `farRouteLastBranchDirectiveId`。
- 重复上一轮同一分支不触发分支改道。
- `src/app.js` 记录 `dispatchBranchShiftReward` / `dispatchBranchShiftRewardRate` / `dispatchBranchShiftRewardText` 事件字段，并渲染 `directive-dispatch-branch-shift` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-branch-shift` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 118 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE`、`dispatchBranchShiftReward`、`directive-dispatch-branch-shift` 和“分支改道”。
- 提交 5bca14b 已推送；GitHub Pages workflow 25170753179 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含分支改道相关标记。
- #6 已回复：说明交替走协同/绕行会触发“分支改道 +6%”，重复同一分支不触发，并保持 issue open 等待复测。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测交替走协同/绕行是否比固定路线更像后半段操作分支；如果仍不足，再评估更重的资源循环或项目分支，而不是继续只加说明文本。

## 2026-04-30 Product decision：远航分支态势

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 21:43 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，原始反馈指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经具备协同、绕行、协同补给、绕行投送、绕行整备等分支回报，但玩家和后续复测仍需要从闭环进度、最后一次指令、按钮推荐和反馈快照中推断“当前到底处在协同还是绕行路线”。分支状态不够直接，会削弱前序玩法改动的可理解性。

本轮决策：

- 新增“远航分支态势”派生展示。
- `getFarRouteDispatch` 从现有 `directiveChain`、当前目标指令、协同指令和 `farRouteLastBranchDirectiveId` 派生 `branchKind` / `branchText` / `branchDirectiveId` / `branchDirectiveName`。
- 分支态势覆盖“待选择”“协同”“绕行”“协同整备”“绕行整备”，并追加到远航闭环状态、星图总览远航调度摘要和反馈快照。
- 主操作区远航调度条新增 `far-dispatch-branch` 徽标，协同与绕行使用不同视觉状态。
- 本轮只改派生展示和反馈快照文本；不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、协同补给、远航绕行、绕行投送、远航闭环、远航突破、绕行突破、整备续航、绕行整备、整备回航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 21:43 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getFarRouteDispatch` 在远航调度 active 时返回分支态势字段。
- 0/3 起手显示“分支 待选择：先执行目标”；目标后 1/3 显示“分支 待选择：协同或绕行”；协同路线显示“分支 协同：X”；绕行路线显示“分支 绕行：X”；闭环完成态显示“分支 协同整备：X”或“分支 绕行整备：X”。
- 主操作区渲染 `far-dispatch-branch`，样式区分协同和绕行。
- 星图总览远航调度摘要包含当前分支态势。
- 反馈快照中的远航调度包含分支态势，便于后续复测定位玩家路线。
- 本地验证已通过：`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `far-dispatch-branch`、`branchKind`、`branchText`、“分支 待选择”、“分支 协同”和“分支 绕行”。
- 提交 7bf24b8 已推送；GitHub Pages workflow 25169515816 已成功，线上地址返回 HTTP 200，线上 `game.js`、`app.js` 和 `styles.css` 已确认包含远航分支态势相关标记。
- #6 已回复：说明远航调度新增“分支态势”，用于直接显示待选择、协同、绕行、协同整备或绕行整备，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 21:58 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T13:58:22Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

## 2026-04-30 Product decision：远航绕行整备

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 21:16 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：协同路线已经通过协同补给形成“补当前资源”，绕行路线通过绕行投送形成“消耗当前资源推进累计航段”。但两条路线完成闭环后都回到相似的整备节奏，绕行选择对下一轮起手的影响还不够明显。

本轮决策：

- 给绕行路线新增“绕行整备”。
- 玩家选择绕行分支并回到目标完成闭环时，记录最近远航分支 `farRouteLastBranchDirectiveId`，刷新刚才的绕行指令冷却，而不是总是刷新协同续航指令。
- 绕行路线完成态下一步优先推荐“绕行整备/等待绕行整备”；执行该绕行指令时按有效基础指令收益 5% 结算“绕行整备”奖励。
- 协同路线保持“远航整备 -> 整备续航 -> 整备回航”；绕行路线形成“绕行投送 -> 绕行回航 -> 绕行整备”的下一轮起手差异。
- 除新增 `farRouteLastBranchDirectiveId` 用于记录最近远航分支外，本轮不新增其他存档字段；不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、协同补给、远航绕行、绕行投送、远航闭环、远航突破、绕行突破、整备续航、整备回航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 21:16 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE` 为 0.05。
- `activateDirective` 在绕行回航完成闭环时刷新刚才的绕行指令冷却，执行反馈显示“绕行整备 X冷却刷新”，并写入 `farRouteLastBranchDirectiveId`。
- `getDirectivePlan` 在绕行闭环完成态推荐“绕行整备/等待绕行整备”。
- `getDirectiveStatus` 在被推荐的绕行指令上显示“绕行整备 +X”。
- `src/app.js` 记录 `dispatchDetourPrepReward` / `dispatchDetourPrepRewardRate` / `dispatchDetourPrepRewardText` 事件字段，并渲染 `directive-dispatch-detour-prep` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-detour-prep` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE`、`dispatchDetourPrepReward`、`directive-dispatch-detour-prep`、`farRouteLastBranchDirectiveId` 和“绕行整备”。
- 提交 2d1bdc0 已推送；GitHub Pages workflow 25168449353 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含绕行整备相关标记。
- #6 已回复：说明绕行路线新增“绕行整备 +5%”、回航完成后刷新刚才的绕行指令冷却，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 21:37 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T13:37:09Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测绕行分支是否因为“绕行投送 -> 绕行回航 -> 绕行整备”而更像真实分支；如果仍认为后半段只是沿目标推进，再评估更重的项目分支或资源消耗型短循环。

## 2026-04-30 Product decision：远航协同补给

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 21:03 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航绕行已经通过“绕行投送”形成消耗当前能量、推进累计航段的选择差异；协同路线虽然有远航协同奖励和协同回航指引，但它仍更像安全收益路线，缺少和绕行投送对应的资源侧特征。玩家可能仍把协同与绕行理解为两种收益徽标，而不是“保留/补当前资源”和“消耗当前资源推进航段”的分支取舍。

本轮决策：

- 给目标指令后的指定协同续航新增“协同补给”。
- 执行指定协同续航时，除远航续航和远航协同外，额外按有效基础指令收益 3% 增加当前能量。
- 协同补给只增加 `state.energy`，不增加 `totalEnergy`，避免把协同路线变成累计航段推进工具；绕行路线继续通过绕行投送消耗当前能量并推进累计能量。
- 按钮徽标、预计收益、执行反馈、本地 `directive` 事件和反馈快照同步显示/记录 `dispatchSyncSupply`、`dispatchSyncSupplyRate`、`dispatchSyncSupplyText`。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同收益、远航绕行、绕行投送、远航闭环、远航突破、绕行突破、远航整备、整备续航、整备回航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 21:03 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE` 为 0.03。
- `getDirectiveStatus` 在目标后的指定协同续航按钮上显示“协同补给 +X当前”。
- `activateDirective` 执行指定协同续航时增加当前能量，不增加累计能量，执行反馈包含“协同补给”。
- 非协同绕行按钮不显示协同补给，继续显示远航绕行和绕行投送。
- `src/app.js` 记录 `dispatchSyncSupply` / `dispatchSyncSupplyRate` / `dispatchSyncSupplyText` 事件字段，并渲染 `directive-dispatch-sync-supply` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-sync-supply` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE`、`dispatchSyncSupply`、`directive-dispatch-sync-supply` 和“协同补给”。
- 提交 a735c69 已推送；GitHub Pages workflow 25167206170 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含协同补给相关标记。
- #6 已回复：说明协同路线新增“协同补给 +3%当前”，与绕行投送形成“补当前资源 vs 消耗当前资源推进累计航段”的取舍，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 21:11 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T13:10:53Z。
- 钉钉通知未发送：运行环境未提供 `DING` / `DINGTALK` / `WEBHOOK` 相关变量名；未将 webhook 写入仓库。

下一步：等待 #6 复测协同与绕行路线的资源取舍是否更清楚；如果仍认为后半段只是沿目标推进，再评估更重的项目分支或消耗型短循环，而不是继续叠加说明文本。

## 2026-04-30 Product decision：远航协同回航指引

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 20:34 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经把目标后的第二步拆成协同与绕行，并让绕行后回目标显示“绕行回航”。但协同路线在第三步回到目标时仍显示泛化的“调度目标”，路线名称在最后一步断开，玩家不容易把“协同 -> 回目标闭环”识别成与绕行路线并列的分支。

本轮决策：

- 在目标指令后执行指定协同续航后，下一步回到当前航段目标指令时显示“协同回航/等待协同”。
- 远航闭环提示同步改为“协同回航到目标指令触发远航闭环与远航突破”。
- 绕行路线继续保留“绕行回航/等待绕行”和绕行突破；本轮只补齐协同路线第三步命名。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、远航绕行、绕行投送、远航闭环、远航突破、绕行突破、远航整备、整备续航、整备回航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 20:34 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getDirectivePlan` 在“目标指令 -> 指定协同续航”后推荐目标指令为“协同回航”，等待文案为“等待协同”。
- `getFarRouteDispatchLoopStatus` 在协同路线第三步提示“协同回航到目标指令触发远航闭环与远航突破”。
- `getDirectiveStatus` 中目标指令按钮显示“协同回航”，同时仍显示远航闭环和远航突破预计收益。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `dispatchSyncReturnCanOverride` 和“协同回航”。

下一步：等待 #6 复测协同与绕行两条路线在按钮层是否都能被识别；如果仍认为后半段只是沿目标推进，再评估更重的资源消耗型指令或项目分支，而不是继续增加路径说明。

## 2026-04-30 Product decision：远航绕行投送

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 20:07 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经把目标、协同、绕行、闭环、突破和整备串成短循环；但绕行分支仍主要是额外奖励和后续突破，和协同路线相比缺少明确代价。玩家可能仍把它理解为“多一个推荐按钮”，而不是后半段操作分支。

本轮决策：

- 在目标指令后的绕行分支新增“绕行投送”。
- 执行非协同非目标绕行时，若当前航段是累计能量航段且有当前能量可消耗，会消耗当前能量与航段剩余量共同限制的一小笔能量，并按 150% 投送量推进累计能量。
- 按钮徽标、预计收益、执行反馈、本地 `directive` 事件和反馈快照同步显示/记录 `dispatchDetourInfusionCost`、`dispatchDetourInfusionProgress`、`dispatchDetourInfusionText`。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、远航绕行奖励、远航闭环、远航突破、绕行突破、远航整备刷新冷却、整备续航、整备回航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 20:07 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE` 为 0.003，`FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER` 为 1.5。
- `getDirectiveStatus` 在目标后的非协同非目标按钮上显示“绕行投送 -X当前 / +Y累计”。
- `activateDirective` 执行绕行时扣除当前能量并额外增加累计能量推进，执行反馈包含“绕行投送”。
- `src/app.js` 记录 `dispatchDetourInfusionCost` / `dispatchDetourInfusionProgress` 事件字段，并渲染 `directive-dispatch-detour-infusion` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-detour-infusion` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE`、`FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER`、`dispatchDetourInfusionCost`、`dispatchDetourInfusionProgress`、`directive-dispatch-detour-infusion` 和“绕行投送”。
- 提交 a5af1b8 已推送；GitHub Pages workflow 25165249350 已成功，build job 已执行 `npm install`、`npm test` 和 `npm run build`。
- 线上地址 https://jassy930.github.io/codex-game-operator/ 返回 HTTP 200，线上 `game.js`、`app.js` 和 `styles.css` 已确认包含绕行投送相关标记。
- #6 已回复：说明绕行分支新增消耗当前能量并推进累计航段的“绕行投送”，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 20:27 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T12:27:25Z。

下一步：等待 #6 复测是否认为绕行分支已经形成“消耗资源推进航段”的真实选择差异；同时记录 GitHub Actions Node.js 20 actions 弃用提示，后续需要升级 workflow action 运行环境。

## 2026-04-30 Product decision：远航绕行分支

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 19:46 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经形成“目标指令 -> 协同/续航 -> 回目标闭环 -> 整备续航 -> 整备回航”的连续短循环；但目标后的第二步仍是单一路径优化，指定协同续航严格优于另一个非目标指令。玩家在后半段看到的仍可能是“按推荐路径走”，而不是一个可选择的分支。

本轮决策：

- 在目标指令后的 1/3 阶段新增“远航绕行”分支。
- 指定协同续航仍显示“远航协同/等待协同”并保留 +5% 协同收益；另一个非目标指令显示“远航绕行/等待绕行”，在远航续航 +8% 基础上追加 +4% 绕行收益。
- 选择绕行后回到当前航段目标指令时，按钮推荐显示“绕行回航/等待绕行”，并按当前能量航段剩余量结算 0.03% 的“绕行突破”。
- 远航路径收益标签从“协同/续航”更新为“协同/绕行”，回目标步同步显示远航闭环、远航突破和绕行突破。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、远航闭环、远航突破、远航整备刷新冷却、整备续航、整备回航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 19:46 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE` 为 0.04，`FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE` 为 0.0003。
- `getDirectiveStatus` 在目标后的非协同非目标按钮上显示“远航绕行”，并结算 `dispatchDetourReward`。
- `getDirectivePlan` 在绕行后回到目标指令时推荐“绕行回航/等待绕行”。
- `activateDirective` 在绕行回航时结算 `dispatchDetourBreakthroughReward`，执行反馈包含“绕行突破”。
- `src/app.js` 记录 `dispatchDetourReward` / `dispatchDetourBreakthroughReward` 事件字段，并渲染 `directive-dispatch-detour` / `directive-dispatch-detour-breakthrough` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-detour` 与 `.directive-button .directive-dispatch-detour-breakthrough` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE`、`FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE`、`dispatchDetourReward`、`dispatchDetourBreakthroughReward`、`directive-dispatch-detour`、`directive-dispatch-detour-breakthrough`、“远航绕行”和“绕行突破”。
- 提交 b10e369 已推送；GitHub Pages workflow 25164148663 已成功；线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航绕行相关标记。
- #6 已回复：说明目标后的第二步新增“协同”和“绕行”两条路线，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 20:01 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T12:01:27Z。

下一步：等待 #6 复测；如果仍认为后半段只是沿目标推进，再评估真正消耗资源的远航指令或项目分支，而不是继续叠加路径说明。

## 2026-04-30 Product decision：远航整备回航奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 19:26 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经形成“目标指令 -> 协同/续航 -> 回目标闭环 -> 整备续航”的后半段短循环；但整备续航执行后，再回到当前航段目标指令时主要表现为常规调度目标。闭环收尾、整备续航和下一轮目标起手之间还缺少一个明确的回航回报。

本轮决策：

- 给整备续航后的目标指令新增“整备回航 +6%”奖励。
- 当上一轮完成 3/3 闭环后已经执行当前协同续航指令，且下一步回到当前航段目标指令时，按有效基础指令收益结算整备回航奖励。
- 按钮推荐从普通调度目标切换为“整备回航/等待回航”，按钮徽标、预计收益、执行反馈和本地 `directive` 事件同步记录 `dispatchReturnReward` / `dispatchReturnRewardRate` / `dispatchReturnRewardText`。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、远航闭环、远航突破、远航整备刷新冷却、整备续航、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 19:26 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE` 为 0.06。
- `getDirectivePlan` 在整备续航后推荐当前目标指令为“整备回航”，等待文案为“等待回航”。
- `getDirectiveStatus` 在整备回航目标指令按钮上显示 `整备回航 +X`。
- `activateDirective` 执行整备回航时结算 `dispatchReturnReward`，执行反馈包含“整备回航”。
- `src/app.js` 记录 `dispatchReturnReward` 事件字段，并渲染 `directive-dispatch-return` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-return` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE`、`dispatchReturnReward`、`directive-dispatch-return` 和“整备回航”。
- 提交 a2f7ffa 已推送；GitHub Pages workflow 25163305696 已成功；线上地址返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含整备回航相关标记。
- #6 已回复：说明整备续航后回到当前航段目标指令会显示并结算“整备回航 +6%”，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 19:40 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T11:40:34Z。

下一步：等待 #6 复测；如果仍认为后半段只是目标推进，再评估资源消耗型指令或项目分支，而不是继续增加路径展示。

## 2026-04-30 Product decision：远航整备续航奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 19:02 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最新反馈线程，指出后半段“只有不停的目标、玩法没有真正变化”，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经把后半段做成目标、协同/续航、回目标闭环，并显示步骤收益；但完成 3/3 闭环后，“远航整备”主要体现为刷新协同续航冷却和推荐下一步，下一轮起手本身没有新的远航回报，循环收尾到再起步之间仍偏弱。

本轮决策：

- 给 3/3 闭环后的远航整备推荐新增“整备续航 +7%”奖励。
- 当上一轮以当前航段目标指令完成 3/3，且下一步执行被整备刷新的协同续航指令时，按有效基础指令收益结算整备续航奖励。
- 按钮徽标、预计收益、执行反馈和本地 `directive` 事件同步记录 `dispatchPrepReward` / `dispatchPrepRewardRate` / `dispatchPrepRewardText`。
- 本轮不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、远航调度校准、远航续航、远航协同、远航闭环、远航突破、远航整备刷新冷却、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 19:02 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `FAR_ROUTE_DISPATCH_PREP_REWARD_RATE` 为 0.07。
- `getDirectiveStatus` 在 3/3 完成态推荐的协同续航按钮上显示 `整备续航 +X`。
- `activateDirective` 执行整备续航时结算 `dispatchPrepReward`，执行反馈包含“整备续航”。
- `src/app.js` 记录 `dispatchPrepReward` 事件字段，并渲染 `directive-dispatch-prep` 徽标。
- `src/styles.css` 包含 `.directive-button .directive-dispatch-prep` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_PREP_REWARD_RATE`、`dispatchPrepReward`、`directive-dispatch-prep` 和“整备续航”。
- 提交 7f3a7c5 已推送；GitHub Pages workflow 25162500371 已成功；线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含整备续航相关标记。
- #6 已回复：说明本轮不是继续加路径展示，而是让 3/3 闭环后的远航整备协同续航获得实际“整备续航 +7%”奖励，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 19:20 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T11:20:39Z。

下一步：等待 #6 复测；如果仍认为后半段只是目标推进，再评估资源消耗型指令或项目分支，而不是继续增加路径展示。

## 2026-04-30 Product decision：远航路径步骤收益标签

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 18:47 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍围绕“后半段只有不停目标、玩法没有真正变化”保持 open，因此本轮进入 Product decision。

当前最大问题：远航调度已经把后半段目标映射到目标指令、协同续航、回目标闭环，并在星图卡片、主操作区和星图总览显示 3 步路径；但路径格本身仍主要展示“按哪个指令”，每一步为什么有玩法回报还要看按钮徽标、预计收益或长说明。对 #6 这类“后半段玩法变化”反馈，三步路径需要更直接地显示每一步的不同回报。

本轮决策：

- 给远航调度 3 步路径新增步骤收益标签。
- 目标步显示“调度校准 +14%”；协同步显示“远航协同 +5%”或无协同时的“远航续航 +8%”；回目标步显示“远航闭环 +16% · 远航突破 +0.05%剩余”。
- 主操作区 `far-dispatch-loop-step` 与星图当前航段 `project-dispatch-step` 同步渲染收益标签，并把完整收益写入路径 aria-label。
- 本轮只调整展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、远航调度计算、远航突破数值、星图航段、项目奖励、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 18:47 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getFarRouteDispatch` 返回的 `loopSteps` 包含 `rewardText`，`loopStepText` 包含三步收益说明。
- 当前星图航段 `dispatchSteps` 包含相同步骤收益标签。
- `src/app.js` 渲染 `far-dispatch-step-reward` 和 `project-dispatch-step-reward`。
- `src/styles.css` 包含 `.far-dispatch-loop-step em` 和 `.project-dispatch-step em` 样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `far-dispatch-step-reward` 和 `project-dispatch-step-reward`。
- 提交 05117b5 已推送；GitHub Pages workflow 25161579162 已成功；线上地址返回 HTTP 200，且线上 `app.js`、`game.js` 和 `styles.css` 已确认包含远航路径步骤收益标签相关标记。
- #6 已回复：说明远航调度 3 步路径新增步骤收益标签，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 18:57 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T10:57:25Z。

下一步：等待 #6 复测；如果仍认为后半段只是目标推进，再评估真正的资源消耗型指令或项目分支，而不是继续只增加路径展示。

## 2026-04-30 Product decision：点火过载倒计时徽标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 18:31 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、缺少点击反馈和点击欲望”保持 open，因此本轮进入 Product decision。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、8 格连击轨、下一击预告、环形蓄能轨、音效、触感、落点闪光和阶段光环，但“距离过载还剩几次”仍主要落在按钮底部小点和按钮外文字上。玩家连续点击时，按钮主体缺少一个更直接的倒计时锚点来促成下一次点击。

本轮决策：

- 在点火按钮内新增 `core-overload-badge` 过载倒计时徽标。
- 运行期 `renderCoreFeedback` 复用现有 `getComboStatus()`，显示剩余过载次数；过载命中时显示 `!`。
- 徽标按 `is-countdown-active`、`is-overload-ready`、`is-overload-hit` 切换普通蓄能、过载前一击和过载命中状态。
- 本轮只调整点火按钮展示层；不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图航段、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 18:31 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `coreOverloadBadge`、`core-overload-badge` 和初始剩余值 `8`。
- 运行期 `src/app.js` 包含 `coreOverloadBadgeValue`，并在 `renderCoreFeedback` 中按 `combo.remaining` / `combo.overloaded` 更新徽标。
- CSS 包含 `.core-overload-badge`、`.is-countdown-active`、`.is-overload-ready`、`.is-overload-hit`、`coreBadgePulse` 和 `coreBadgeBurst`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `coreOverloadBadge`、`core-overload-badge`、`coreOverloadBadgeValue`、`coreBadgePulse` 和 `coreBadgeBurst`。
- 提交 f42758f 已推送；GitHub Pages workflow 25160921955 已成功；线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含点火过载倒计时徽标相关标记。
- #5 已回复：说明按钮内新增过载倒计时徽标，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 18:42 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T10:40:34Z。

下一步：等待 #5 复测；如果仍认为点火按钮点击欲望不足，再评估星核本体随连击阶段改变图形层级，而不是提高点击收益。

## 2026-04-30 Product decision：当前章节节点带

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 18:17 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：上一轮已在星图视觉航线标题下新增当前章节大图景，但大图景仍主要通过章节名、进度文本和单条进度条表达章节内推进。远航长尾这类 44 段章节如果继续展开文字或节点，会重新制造密度；如果只保留进度条，又缺少章节内“已完成 / 当前 / 待推进”的视觉节奏。

本轮决策：

- 在 `project-chapter-hero-scene` 内新增 `project-chapter-hero-route` 章节节点带。
- `getProjectChapterVisuals` 为每个章节派生 `heroNodes`；短章节直接显示章节内节点，远航长尾压缩到最多 8 个节点。
- 节点状态区分 `completed`、`current`、`active` 和 `pending`，用于表达已完成、当前、部分完成和待推进状态。
- 本轮只调整星图当前章节大图景展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、筛选结果、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 18:17 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectChapterVisuals` 返回 `heroNodes`；远航长尾最多返回 `PROJECT_CHAPTER_HERO_NODE_LIMIT` 个压缩节点。
- 静态首页包含 `project-chapter-hero-route` 和 `project-chapter-hero-node`。
- 运行期 `src/app.js` 包含 `renderProjectChapterHeroNode`，并把 `chapter.heroNodes` 渲染进当前章节大图景。
- CSS 包含 `.project-chapter-hero-route`、`.project-chapter-hero-node.is-current`、`.is-completed` 和 `.is-active`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 构建产物已确认包含 `project-chapter-hero-route`、`PROJECT_CHAPTER_HERO_NODE_LIMIT`、`heroNodes` 和 `renderProjectChapterHeroNode`。
- 提交 4785d0f 已推送；GitHub Pages workflow 25160335475 已成功；线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含当前章节节点带相关标记。
- #4 已回复：说明当前章节大图景新增章节节点带，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 18:26 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T10:26:07Z。

下一步：等待 #4 复测；如果章节入口仍被认为文字压力高，再评估真正的章节分页或更强章节插图，而不是继续增加说明文字。

## 2026-04-30 Product decision：当前章节大图景

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 18:02 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图视觉航线已有星域插画、全航线节点、章节视觉导航和章节微图景，但当前章节仍主要通过四个较小章节按钮理解。玩家切换首段星图、专精校准、深空基建和远航长尾时，缺少一个更大的当前章节画面锚点来确认自己正在看的章节。

本轮决策：

- 在星图视觉航线标题下新增 `project-chapter-hero` 当前章节大图景，显示当前筛选章节或当前航段所属章节。
- 大图景复用现有 `getProjectChapterVisuals` 数据与 `visualClass`，按四个章节切换轨道、星门/信标、章节信号和进度条差异。
- 点击章节视觉导航或筛选到章节时，同步更新当前章节大图景；非章节筛选时回退到当前航段所在章节。
- 本轮只调整星图视觉航线展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、筛选结果、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 18:02 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `projectChapterHero`、`project-chapter-hero-scene`、`project-chapter-hero-lane`、`project-chapter-hero-gate`、`project-chapter-hero-signal`、`project-chapter-hero-beacon` 和 `project-chapter-hero-meter`。
- 运行期 `src/app.js` 包含 `renderProjectChapterHero` 和 `getActiveProjectChapter`，并在 `render()` 中与章节视觉导航共用同一组 `getProjectChapterVisuals(projects)` 数据。
- CSS 包含 `.project-chapter-hero`、大图景轨道、星门/信标、章节信号、四类章节差异样式和进度条。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 117 项。
- 提交 81406cc 已推送；GitHub Pages workflow 25159763319 已成功；线上地址返回 HTTP 200，线上首页、`app.js` 和 `styles.css` 已确认包含当前章节大图景相关标记。
- #4 已回复：说明星图视觉航线新增当前章节大图景，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 18:12 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T10:12:00Z。

下一步：等待 #4 复测；如果仍认为章节入口不够图片化，再评估真正的章节分页或更强的章节插图资产，而不是继续增加说明文字。

## 2026-04-30 Product decision：章节导航微图景

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 17:48 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图章节视觉导航已经有章节按钮、进度、焦点标签和小徽记，但按钮内部图形面积仍偏小。玩家在首段星图、专精校准、深空基建和远航长尾之间切换时，仍需要结合章节名、焦点标签和下一条文案理解章节差异。

本轮决策：

- 给每个章节视觉按钮新增 `project-chapter-scene` 微图景，包含固定轨道、星门/信标形状和章节信号。
- 静态首页与运行期 `renderProjectChapterTile` 使用同一套 `project-chapter-scene-*` 结构。
- 四个章节继续复用现有 `visualClass` 切换配色和形状差异，不新增新的章节数据或存档字段。
- 本轮只调整星图章节导航展示层；不改变 57 段星图路线、项目完成判定、筛选结果、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 17:48 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页四个章节按钮包含 `project-chapter-scene`、`project-chapter-scene-track`、`project-chapter-scene-gate` 和 `project-chapter-scene-signal`。
- 运行期 `renderProjectChapterTile` 为每个章节按钮生成同一套微图景 DOM。
- CSS 包含 `.project-chapter-scene`、轨道、星门/信标和四类章节差异样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 116 项。
- 提交 6dd3572 已推送；GitHub Pages workflow 25159179510 已成功；线上地址返回 HTTP 200，线上首页、`app.js` 和 `styles.css` 已确认包含章节微图景相关标记。
- #4 已回复：说明章节导航按钮现在加入轨道、星门/信标和章节信号微图景，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 17:57 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T09:57:32Z。

下一步：等待 #4 复测；如果章节导航仍被认为不够图片化，再评估更强的章节插图或章节分页，而不是增加更多说明文字。

## 2026-04-30 Product decision：筛选按钮视觉标识

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 17:33 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图筛选按钮已经默认收进“筛选航段”抽屉，筛选摘要也已压成短标签，但抽屉展开后仍是一组相似文字按钮。玩家想从 15 个筛选入口里区分全部、当前、本章、章节、累计/升级、奖励方向和完成状态时，仍主要依赖逐字阅读。

本轮决策：

- 给星图筛选按钮增加固定视觉标识 class，由按钮类型映射为全部、当前、章节、推进方式、奖励方向和完成状态等视觉类别。
- 静态首页与运行期按钮保持同一套视觉标识：章节入口、累计/升级入口、四类奖励入口和完成状态入口分别显示不同形状/颜色的小标记。
- 筛选按钮布局改为 `auto-fit` 响应式列宽，按钮本身保持单行省略，降低加上标识后在窄屏溢出的风险。
- 本轮只调整星图筛选按钮展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 17:33 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页的筛选按钮包含 `is-filter-chapter`、`is-filter-reward-overload` 等视觉类别标记。
- 运行期 `renderProjectFilter` 通过 `PROJECT_FILTER_VISUAL_CLASSES` 为每个筛选按钮附加视觉类别。
- CSS 包含 `.project-filter-button::before`、章节/推进/奖励/状态等筛选标识样式，并保持按钮单行省略。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 116 项。
- 提交 bab6924 已推送；GitHub Pages workflow 25158552413 已成功；线上地址返回 HTTP 200，线上首页、`app.js` 和 `styles.css` 已确认包含筛选按钮视觉标识相关标记。
- #4 已回复：说明筛选按钮现在用小图形和颜色区分全部、当前、章节、累计/升级、奖励方向和完成状态入口，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 17:43 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T09:43:16Z。

下一步：等待 #4 复测；如果筛选抽屉仍被认为文字压力高，再继续把筛选入口拆成更强的图形分组，而不是恢复长说明。

## 2026-04-30 Product decision：筛选摘要短标签

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 17:17 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图筛选按钮和完整筛选详情已经默认折叠，但 `projectFilterSummaryBrief` 默认仍显示“航段号 + 章节位置 + 项目名 + 剩余段数”。在窄屏或较长章节名下，这条摘要仍容易换行形成新的文字块。

本轮决策：

- 将筛选摘要默认可见的下一条目标压缩为“航段 X/57 项目名”，不再重复章节内位置。
- 运行期用 `setCompactSupportText` 把完整筛选视图说明保留到 `title` / `aria-label`，展开抽屉后仍显示完整 `projectFilterSummary`。
- CSS 对 `project-filter-drawer summary` 增加单行省略，避免小屏重新形成多行文字块。
- 本轮只调整星图筛选展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 17:17 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectFilterBrief` 默认显示“下一条 航段 X/57 项目名”，完整章节位置仍保留在 `getProjectFilterSummary`。
- 静态首页的 `projectFilterSummaryBrief` 显示短标签，并通过 `title` / `aria-label` 保留完整筛选说明。
- 运行期 `src/app.js` 使用 `setCompactSupportText` 同步短摘要和完整说明。
- `src/styles.css` 对 `project-filter-drawer summary` 增加单行省略。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 116 项。
- 构建产物已确认包含 `formatProjectFilterBriefProjectLabel`、`projectFilterSummaryBrief` 和“筛选摘要：本章 0/4 · 下一条 航段 1/57 点亮星图”。
- 提交 eea834c 已推送；GitHub Pages workflow 25157859784 已成功，线上地址返回 HTTP 200；线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含筛选摘要短标签相关标记。
- #4 已回复：说明星图筛选摘要默认压缩为“航段 X/57 项目名”，完整筛选说明保留在 `title` / `aria-label` 和展开详情中，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 17:28 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T09:27:42Z。

下一步：等待 #4 复测；如果星图筛选区仍有明显文字压力，再继续把默认可见筛选信息转为视觉槽，而不是恢复长说明。

## 2026-04-30 Product decision：航线预告短摘要

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 16:59 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图总览已经有当前航段视觉卡、航线预告视觉带和奖励罗盘，但默认区域仍保留一整句“航线预告：A、B、C”。这行内容与视觉带重复，继续占用默认可见文字密度。

本轮决策：

- 将 `projectOverviewForecast` 默认文本改为短摘要，例如“航线预告：接下来 3 段 · 下一段 1/57 点亮星图”。
- `getProjectOverview` 同时返回 `forecastDetailText`，保留原完整三段预告。
- 运行期用 `setCompactSupportText` 把完整预告写入 `title` / `aria-label`；静态首页同步保留完整可访问说明。
- 本轮只调整星图总览展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 16:59 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectOverview` 的 `forecastText` 返回短摘要，`forecastDetailText` 返回完整三段预告。
- 静态首页的 `projectOverviewForecast` 默认显示短摘要，并通过 `title` / `aria-label` 保留完整预告。
- 运行期 `src/app.js` 使用 `projectOverview.forecastDetailText` 作为完整说明。
- `src/styles.css` 对 `project-overview em` 增加单行省略，避免小屏重新形成长句。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 116 项。
- 构建产物已确认包含 `forecastDetailText`、`projectOverviewForecast` 和“航线预告：接下来 3 段”。
- 提交 f14511d 已推送；GitHub Pages workflow 25157138566 已成功，线上地址返回 HTTP 200；线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含航线预告短摘要相关标记。
- #4 已回复：说明星图总览航线预告默认显示短摘要，完整三段预告保留在 `title` / `aria-label`，并保持 issue open 等待复测。
- 回复后同步 GitHub Issues：2026-04-30 17:10 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T09:10:10Z。

下一步：等待 #4 复测；如果仍认为星图总览默认区域文字压力高，再继续优先压缩重复文本，而不是增加说明句。

## 2026-04-30 Product decision：当前航段视觉卡

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 16:48 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图总览已经有航线预告视觉带和奖励罗盘，但默认首屏对“当前正在推进哪一段、属于累计还是升级、奖励方向是什么”仍主要依赖三行文字。玩家扫总览时需要把标题、当前进度、行动建议和预告槽组合起来才能确认当前航段。

本轮决策：

- 在星图总览默认可见区域新增 `project-current-visual` 当前航段视觉卡。
- `getProjectCurrentVisual` 从现有项目状态派生第一个未完成航段，包含航段号、章节位置、推进类型、奖励方向、进度和可访问说明。
- 运行期 `renderProjectCurrentVisual` 根据 `projectOverview.currentVisual` 更新固定视觉卡；全部航段完成时隐藏该卡。
- 本轮只调整星图总览展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 16:48 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectCurrentVisual(getProjectStatuses(createInitialState(0)))` 返回点亮星图当前航段视觉槽，推进类型为累计航段、奖励方向为总产能。
- 静态首页包含 `projectCurrentVisual`、`project-current-visual` 和“当前航段”。
- `src/app.js` 包含 `renderProjectCurrentVisual`，运行期按 `projectOverview.currentVisual` 更新当前航段视觉卡。
- `src/styles.css` 包含 `.project-current-visual`、`.project-current-orbit`、`.project-current-track` 和 `.project-current-meter`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 116 项。
- 构建产物已确认包含 `projectCurrentVisual`、`project-current-visual`、`getProjectCurrentVisual` 和“当前航段”。
- 提交 37fe8ad 已推送；GitHub Pages workflow 25156456518 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含当前航段视觉卡相关标记。
- #4 已回复并继续保持 open，等待复测确认星图总览新增当前航段视觉卡后，默认可见区域是否更容易一眼看懂当前航段、推进类型和奖励方向。
- 回复后同步 GitHub Issues：2026-04-30 16:54 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T08:53:49Z。

下一步：等待 #4 复测；如果仍认为星图总览文字密度高，再继续把默认可见长句转为视觉结构。

## 2026-04-30 Product decision：航线预告视觉带

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 16:34 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图总览已有奖励罗盘降低四类奖励进度的阅读成本，但“航线预告”仍是一行把后三段项目名和奖励串起来的长文本。玩家想扫下一段、后续奖励方向和推进类型时，仍要读完整句。

本轮决策：

- 在星图总览默认可见区域新增 `project-forecast-map` 航线预告视觉带。
- `getProjectForecastVisuals` 从现有项目状态派生最多三条未完成航段，包含航段号、章节位置、项目名、推进类型、奖励方向、进度和可访问说明。
- 运行期 `renderProjectForecastMap` 渲染三条固定视觉槽，静态首页保留初始占位；原 `projectOverviewForecast` 文本继续保留，避免丢失完整说明。
- 本轮只调整星图总览展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 16:34 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectForecastVisuals(getProjectStatuses(createInitialState(0)))` 返回点亮星图、谐振校准和透镜阵列三条初始预告槽。
- 静态首页包含 `projectForecastMap`、`project-forecast-map` 和“航线预告视觉带”。
- `src/app.js` 包含 `renderProjectForecastMap` / `renderProjectForecastTile`，运行期按 `projectOverview.forecastVisuals` 更新预告视觉带。
- `src/styles.css` 包含 `.project-forecast-map`、`.project-forecast-tile`、`.project-forecast-path` 和 `.project-forecast-meter`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 114 项。
- 构建产物已确认包含 `projectForecastMap`、`project-forecast-map`、`getProjectForecastVisuals` 和“航线预告视觉带”。
- 提交 c492a56 已推送；GitHub Pages workflow 25155839026 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含航线预告视觉带相关标记。
- #4 已回复并继续保持 open，等待复测确认星图总览航线预告改成视觉带后，默认可见区域是否更容易扫视、文字压力是否继续下降。
- 回复后同步 GitHub Issues：2026-04-30 16:39 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T08:39:44Z。

下一步：等待 #4 复测；如果仍认为星图总览文字密度高，再继续把默认可见长句转为视觉结构，而不是增加说明文本。

## 2026-04-30 Product decision：星图奖励罗盘

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 16:11 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍围绕“界面文字密集、希望更多图片和更好看”保持 open，因此本轮继续进入 Product decision。

当前最大问题：星图计划已经有区域级插画、星图视觉航线、章节视觉导航、项目图标、项目缩略图和折叠结构，但星图总览默认区域仍把奖励方向主要放在“航线预告”和折叠明细内的奖励进度文字里。玩家想判断四类奖励还有多少、当前推进到哪类奖励时，仍需要读文字。

本轮决策：

- 在星图总览默认可见区域新增 `project-reward-map` 星图奖励罗盘。
- `getProjectRewardVisuals` 从现有项目状态派生总产能、点击、自动、过载四类奖励的完成数、进度、下一条目标和当前/待推进状态。
- 运行期 `renderProjectRewardMap` 渲染四条固定视觉槽，静态首页保留初始占位，配合可访问标签提供完整说明。
- 本轮只调整星图总览展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 16:11 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectRewardVisuals(getProjectStatuses(createInitialState(0)))` 返回总产能、点击、自动和过载四类奖励进度，初始分别为 `0/17`、`0/14`、`0/15`、`0/11`。
- 静态首页包含 `projectRewardMap`、`project-reward-map` 和“星图奖励罗盘”。
- `src/app.js` 包含 `renderProjectRewardMap` / `renderProjectRewardTile`，运行期按 `projectOverview.rewardVisuals` 更新奖励罗盘。
- `src/styles.css` 包含 `.project-reward-map`、`.project-reward-tile`、`.project-reward-icon`、`.project-reward-meter` 和四类奖励方向样式。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 112 项。
- 构建产物已确认包含 `projectRewardMap`、`project-reward-map`、`getProjectRewardVisuals` 和“星图奖励罗盘”。
- 提交 d72f33a 已推送；GitHub Pages workflow 25155188485 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含奖励罗盘相关标记。
- #4 已回复并继续保持 open，等待复测确认星图总览新增四类奖励视觉罗盘后，星图默认区域是否更容易扫视、文字压力是否继续下降。
- 回复后同步 GitHub Issues：2026-04-30 16:24 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T08:23:47Z。

下一步：等待 #4 复测；如果仍认为界面文字密度高，再继续把默认可见信息转为视觉结构，避免追加长说明。

## 2026-04-30 Product decision：星图项目缩略图

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 16:00 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。#5 与 #6 已连续多轮处理并等待复测，本轮选择继续处理 #4 的“界面文字密集、希望更多图片和更好看”反馈。

当前最大问题：星图计划已有星图插画、章节视觉导航、项目图标、筛选折叠和项目详情折叠；但项目列表每张卡的主体仍主要由航段、章节、标签、状态和详情文字构成。玩家扫 57 段列表时，需要读文字和进度句子来判断航段推进状态、累计/升级路线和奖励方向。

本轮决策：

- 在每张星图项目卡片中新增 `project-card-scene` 可视化进度缩略图。
- 缩略图只从现有 `project.progress`、`project.completed`、`project.isCurrent`、`project.upgradeId` 和奖励 effect 派生，显示推进路线、进度填充、当前节点与奖励方向。
- 本轮只调整星图项目卡片展示层；不新增存档字段，不改变 57 段星图路线、项目完成判定、奖励数值、升级价格、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 16:00 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `src/app.js` 包含 `renderProjectCardScene`，并把 `project-card-scene` 插入每张项目卡。
- `src/styles.css` 包含 `--project-card-progress`、`project-card-scene-fill`、`project-card-scene-marker`、累计/升级推进样式和四类奖励方向样式。
- `tests/game.test.js` 覆盖项目卡可视化进度缩略图结构与样式标记。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 110 项。
- 构建产物已确认包含 `project-card-scene`、`--project-card-progress`、`renderProjectCardScene` 和“航段缩略图”。
- 提交 79a7a4b 已推送；GitHub Pages workflow 25154509337 已成功，线上地址返回 HTTP 200，且线上 `app.js` 和 `styles.css` 已确认包含项目卡缩略图相关标记。
- #4 已回复并继续保持 open，等待复测确认星图项目卡片新增缩略图后，项目列表是否更容易扫视、文字压力是否下降。
- 回复后同步 GitHub Issues：2026-04-30 16:07 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T08:07:02Z。

下一步：等待 #4 复测；如果仍认为界面文字密度高，再优先继续把项目列表/筛选信息转为可扫视视觉结构，而不是继续增加长文说明。

## 2026-04-30 Product decision：点火阶段光环

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 15:45 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 最近一轮远航突破已回复等待复测，#5 仍围绕“点火按钮太薄弱、增加点击反馈和点击欲望”保持 open，因此本轮进入 Product decision，并处理点火按钮本体的连续兴奋度反馈。

当前最大问题：点火按钮已经有脉冲、粒子、收益浮层、8 格连击轨、下一击预告、环形蓄能轨、音效、触感和落点闪光，但按钮本体在 3/8、6/8、7/8 这些临近过载阶段缺少一层更连续的视觉升温。玩家仍可能主要靠小点和文字判断距离过载还有多近。

本轮决策：

- 在主点火按钮内新增 `core-stage-aura` 阶段光环。
- 运行期由现有 `getComboStatus().progress` 更新 `--core-stage-angle`，并按 3/8、6/8、过载前一击和过载命中切换 `is-stage-warm`、`is-stage-hot`、`is-overload-ready` 和 `is-overload-hit`。
- 本轮只调整主点火按钮展示层；不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、产能公式、星图航段、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 15:45 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `core-stage-aura`。
- 运行期 `renderCoreFeedback` 会把连击进度转成 `--core-stage-angle`，并切换阶段光环状态。
- CSS 包含 `.core-stage-aura`、`--core-stage-angle`、过载前兆和过载命中动效。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `core-stage-aura`、`--core-stage-angle`、`coreStageAura`、`coreStageCharge` 和 `coreStageBurst`。
- 提交 6ceae57 已推送；GitHub Pages workflow 25153942991 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含阶段光环相关标记。
- #5 已回复并继续保持 open，等待复测确认阶段光环配合现有点火反馈后是否让点火按钮更有点击反馈和点击欲望。
- 回复后同步 GitHub Issues：2026-04-30 15:52 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T07:52:38Z。

下一步：等待 #5 复测；若仍认为点火欲望不足，再评估更多星核视觉阶段或更明确的点击节奏目标。

## 2026-04-30 Product decision：远航突破

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 15:17 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍围绕“后半段只有不停的目标、玩法没有真正变化”保持 open，因此本轮继续进入 Product decision。

当前最大问题：远航调度已经把当前航段目标、协同续航、闭环路径和按钮推荐补齐，但完成 3/3 闭环后，回报仍主要是指令收益与冷却整备。玩家仍可能把后半段理解成“继续追下一段累计能量”，因为主动短循环和当前航段剩余进度之间缺少直接连接。

本轮决策：

- 新增 `FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE = 0.0005`。
- 20M 后远航调度 active 时，3/3 轮换回到当前航段目标指令会额外获得“远航突破”，按当前能量航段剩余量的 0.05% 注入能量。
- 按钮徽标、预计收益、执行反馈、本地 `directive` 事件和反馈快照同步记录 `dispatchBreakthroughReward` / `dispatchBreakthroughRewardRate` / `dispatchBreakthroughRewardText`。
- 本轮只补远航闭环和当前航段剩余进度的连接；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响、远航调度校准、冷却、连携窗口、远航续航、远航协同、远航闭环倍率、远航整备或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 15:17 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- #6 快照附近的脉冲航闸阶段，3/3 回到点火齐射时，按钮预计收益显示“远航突破 +2.5K”；执行时因 tick 后剩余进度变化，执行反馈显示“远航突破 +2.4K”。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE`、`dispatchBreakthroughReward`、`directive-dispatch-breakthrough` 和“远航突破”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 提交 b2cb915 已推送；GitHub Pages workflow 25153371579 已成功，线上地址返回 HTTP 200，且线上 `game.js`、`app.js` 和 `styles.css` 已确认包含远航突破相关标记。
- #6 已回复并继续保持 open，等待复测确认远航闭环直接推进当前航段剩余进度后，后半段是否更像可执行、可完成、可重复的玩法循环。
- 回复后同步 GitHub Issues：2026-04-30 15:38 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T07:37:57Z。

下一步：等待 #6 复测；若仍认为后半段变化不足，再评估更重的可规划短循环或资源消耗型指令分支。

## 2026-04-30 Product decision：远航协同按钮推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 15:05 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍围绕“后半段只有不停的目标、玩法没有真正变化”保持 open，因此本轮继续进入 Product decision，并处理远航调度第二步在按钮层的可辨识度。

当前最大问题：远航调度已经在星图总览、当前航段卡片和主操作区显示目标、协同与闭环路径；但实际点击第二步时，指定协同续航按钮和其他非目标按钮都显示“远航续航”。玩家需要读收益徽标里的“远航协同 +X”才能知道哪个按钮是当前航段指定的优先选择。

本轮决策：

- 在 `getDirectiveStatus` 中新增每个按钮独立的远航推荐文案派生。
- 当远航目标后的 1/3 阶段推荐非目标指令时，指定协同续航按钮显示“远航协同”，冷却中显示“等待协同”；其他非目标按钮仍显示“远航续航/等待续航”。
- 本轮只调整按钮推荐文案；不新增存档字段，不改变指令收益、冷却、连携窗口、远航调度计算、星图航段、项目奖励、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 15:05 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- #6 快照对应的脉冲航闸阶段，执行目标指令后，巡航回收仍显示“远航续航”，谐振脉冲显示“远航协同”。
- 当谐振脉冲处于冷却且仍属于协同续航候选时，按钮显示“等待协同”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `getDirectiveOptionRecommendationText`、“远航协同”和“等待协同”。
- 提交 2247813 已推送；GitHub Pages workflow 25152422015 已成功，线上地址返回 HTTP 200，线上 `game.js` 已确认包含 `getDirectiveOptionRecommendationText`、“远航协同”和“等待协同”。
- #6 已回复并继续保持 open，等待复测确认按钮层区分协同优先和普通续航后，后半段短循环是否更清楚。
- 回复后同步 GitHub Issues：2026-04-30 15:12 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T07:12:44Z。

下一步：等待 #6 复测；若仍认为后半段玩法变化不足，再评估资源消耗型指令或更明确的阶段分支。

## 2026-04-30 Product decision：星图总览远航调度总览

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 14:51 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍围绕“后半段只有不停的目标、玩法没有真正变化”保持 open，因此本轮继续进入 Product decision，并处理远航调度在星图总览层的可见性。

当前最大问题：远航调度已经在主操作区显示 3 格路径轨，也在当前航段卡片显示调度徽标、详情和 3 步路径轨。但玩家查看星图计划时，默认首先看到的是星图总览的下一段、行动建议和航线预告；这里还没有直接说明当前航段会驱动哪个主动指令、协同续航是什么、闭环走到哪一步。

本轮决策：

- 在 `getProjectOverview` 中派生 `dispatchText`，只在 `getFarRouteDispatch` active 时返回远航调度总览。
- 星图总览新增 `projectOverviewDispatch` 行，显示当前航段、目标指令、协同续航、闭环进度和下一步路径；未解锁、锁定或全部航段完成时隐藏。
- 本轮只调整星图总览展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、远航调度计算、星图航段、项目奖励、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 14:51 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectOverview` 在 #6 快照对应的脉冲航闸阶段返回 `dispatchText = "远航调度总览：航段 27/57 脉冲航闸 · 目标 点火齐射 · 协同 谐振脉冲 · 闭环 0/3 · 下一步 目标 点火齐射"`。
- 运行期星图总览会渲染 `projectOverviewDispatch`，并按 `dispatchText` 显示或隐藏。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `projectOverviewDispatch`、`project-overview-dispatch`、`buildProjectOverviewDispatchText`、`dispatchText` 和“远航调度总览”。
- 提交 ddc9622 已推送；GitHub Pages workflow 25151944052 已成功，线上地址返回 HTTP 200，且线上首页、`app.js`、`game.js` 和 `styles.css` 已确认包含远航调度总览相关标记。
- #6 已回复并继续保持 open，等待复测确认星图总览层显示远航调度路径后，后半段目标和主动指令短循环的关系是否更清楚。
- 回复后同步 GitHub Issues：2026-04-30 15:00 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T07:00:06Z。

下一步：推送并等待 #6 复测；若仍认为后半段玩法变化不足，再评估资源消耗型指令或更明确的阶段分支，而不是继续只追加展示文本。

## 2026-04-30 Product decision：点火落点闪光

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 14:38 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，因此本轮继续进入 Product decision，并处理 #5 的点火按钮按下反馈层。

当前最大问题：点火按钮已经有视觉脉冲、粒子、收益浮层、8 格连击轨、下一击预告、环形蓄能轨、可关闭音效和可关闭触感，但普通点火的按下反馈仍主要从按钮中心扩散。玩家实际点击按钮的落点没有单独回应，连续点火时“手指按到哪里、哪里被点亮”的即时确认还可以更直接。

本轮决策：

- 在主点火按钮内新增 `coreImpactPoint` 落点闪光层。
- 点火点击事件把鼠标/触控点击坐标写入 `--core-impact-x` 和 `--core-impact-y`，键盘触发时回退到按钮中心。
- 普通点火播放 420ms 落点闪光；过载点火使用更大的 `is-overload-impact` 落点闪光。
- 本轮只调整点火按钮展示层；不新增游戏存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图航段、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 14:38 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `coreImpactPoint` 和 `core-impact-point`。
- 运行期 `animateCore` 会接收点击事件并调用 `positionCoreImpact`，把落点写入 `--core-impact-x` / `--core-impact-y`。
- 普通点火和过载点火都会触发落点闪光，过载点火会切换 `is-overload-impact`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `coreImpactPoint`、`core-impact-point`、`--core-impact-x`、`--core-impact-y` 和 `coreImpactPoint` 动画标记。
- 提交 704132c 已推送；GitHub Pages workflow 25151443908 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含点火落点闪光相关标记。
- #5 已回复并继续保持 open，等待复测确认落点闪光配合现有音效、触感和蓄能轨后是否让点火按钮更有点击反馈和点击欲望。
- 回复后同步 GitHub Issues：2026-04-30 14:46 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T06:45:56Z。

下一步：等待 #5 复测；若仍认为点火欲望不足，再评估更明确的星核阶段变化或连击节奏目标。

## 2026-04-30 Product decision：点火触感反馈开关

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 14:27 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，因此本轮继续进入 Product decision，并处理 #5 的点火反馈层。

当前最大问题：点火按钮已经有视觉脉冲、粒子、收益浮层、8 格连击轨、下一击预告、环形蓄能轨和可关闭音效，但移动端点击仍缺少一层可感知的按下反馈。普通点火与过载点火如果能在支持的设备上使用不同触感节奏，会更直接回应“点击反馈”和“点击欲望”，且不需要改数值。

本轮决策：

- 在点火反馈偏好区新增 `hapticToggle` 触感反馈开关，默认开启，偏好写入独立 localStorage key `codex-game-operator.haptic-enabled`。
- 点火后通过 `navigator.vibrate` 能力检测播放触感反馈；普通点火使用 12ms 短震动，过载点火使用 `[18, 22, 34]` 节奏。
- 本轮只调整点火反馈表现层、本地偏好和本地事件；不新增游戏存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图航段、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 14:27 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `hapticToggle` 和“触感反馈”开关。
- 运行期 `playCoreHaptic` 只在玩家点火后按开关状态调用 `navigator.vibrate`；普通点击和过载点击使用不同震动节奏。
- 点火触感偏好只写入 `HAPTIC_KEY`，不进入游戏进度存档；切换时记录本地 `haptic_toggle` 事件。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `hapticToggle`、`haptic-toggle`、`HAPTIC_KEY`、`playCoreHaptic` 和 `navigator.vibrate`。
- 提交 c647cff 已推送；GitHub Pages workflow 25150988751 已成功，线上地址返回 HTTP 200，且线上首页和 `app.js` 已确认包含点火触感反馈相关标记。
- #5 已回复并继续保持 open，等待复测确认触感反馈配合现有视觉和音效后是否让点火按钮更有点击反馈和点击欲望。
- 回复后同步 GitHub Issues：2026-04-30 14:32 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T06:32:54Z。

下一步：等待 #5 复测；若仍认为点火欲望不足，再评估更多星核视觉阶段或更明确的点击节奏目标。

## 2026-04-30 Product decision：点火音效反馈开关

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 14:12 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#5 仍围绕“点火按钮太薄弱、增加点击反馈、特效和点击欲望”保持 open，因此本轮继续进入 Product decision，并处理 #5 的点火反馈层。

当前最大问题：点火按钮已经有视觉脉冲、粒子、收益浮层、8 格连击轨、下一击预告和环形蓄能轨，但点击反馈仍全部停留在视觉层。玩家明确提到“点击反馈”和“点击欲望”，在不改变数值和存档的前提下，补一层可关闭的短促音效能让普通点火和过载点击形成更明确的感官差异。

本轮决策：

- 在点火主循环下方新增 `soundToggle` 点火音效开关，默认开启，偏好写入独立 localStorage key `codex-game-operator.sound-enabled`。
- 使用浏览器 Web Audio 在玩家点击后播放短促本地音效；普通点火使用轻双音，过载点火使用更厚的双音反馈。
- 本轮只调整点火反馈表现层和本地偏好；不新增游戏存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图航段、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 14:12 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `soundToggle` 和“点火音效”开关。
- 运行期 `playCoreSound` 只在玩家点火后按开关状态调用 Web Audio；过载点击和普通点击使用不同音色组合。
- 点火音效偏好只写入 `SOUND_KEY`，不进入游戏进度存档。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `soundToggle`、`sound-toggle`、`SOUND_KEY`、`playCoreSound` 和 `AudioContext`。
- 提交 8980f49 已推送；GitHub Pages workflow 25150604998 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含点火音效开关相关标记。
- #5 已回复并继续保持 open，等待复测确认点火音效配合现有视觉反馈后是否让点火按钮更有点击反馈和点击欲望。
- 回复后同步 GitHub Issues：2026-04-30 14:20 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T06:20:40Z。

下一步：等待 #5 复测；若仍认为点火欲望不足，再评估更多星核视觉阶段或更明确的点击节奏目标。

## 2026-04-30 Product decision：点火环形蓄能轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 14:01 CST 已同步到 5 个 open feedback issue、0 个 open bug issue。#6 刚完成多轮远航调度展示并已回复等待复测；#5 仍围绕“点火按钮太薄弱、增加点击反馈和点击欲望”保持 open，因此本轮继续进入 Product decision，并处理 #5 的展示层反馈。

当前最大问题：点火按钮已经有点击脉冲、粒子层、收益浮层、8 格连击轨和下一击预告，但按钮主体仍缺少一个随每次点击逐步充能的连续视觉反馈。玩家需要在底部小点和文字预告之间读取“现在离过载还有多近”，点击欲望还可以继续通过按钮本体状态强化。

本轮决策：

- 在主点火按钮内新增 `core-charge-ring` 环形蓄能轨。
- 运行期由 `getComboStatus().progress` 直接更新 `--core-charge-angle`，并复用现有过载前兆与过载命中状态切换高亮。
- 本轮只调整主点火按钮展示层；不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、星图航段、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 14:01 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `core-charge-ring`。
- 运行期 `renderCoreFeedback` 会把连击进度转成 `--core-charge-angle`，并切换 `is-charging`、`is-overload-ready` 和 `is-overload-hit`。
- CSS 包含 `.core-charge-ring`、`--core-charge-angle` 和过载高亮状态。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `core-charge-ring`、`--core-charge-angle` 和运行期环形蓄能绑定。
- 提交 734fe4d 已推送；GitHub Pages workflow 25150187384 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含环形蓄能轨相关标记。
- #5 已回复并继续保持 open，等待复测确认环形蓄能轨是否让点火按钮更有点击反馈和点击欲望。
- 回复后同步 GitHub Issues：2026-04-30 14:07 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T06:07:29Z。

下一步：等待 #5 复测；若仍认为点火欲望不足，再评估音效开关或更强的星核阶段变化。

## 2026-04-30 Product decision：远航调度主路径轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 13:43 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 仍是最近更新的开放反馈，继续进入 Product decision。

当前最大问题：上一轮已经把 3 步调度路径显示到星图当前航段卡片，但玩家在实际执行时主要盯着主操作区的远航调度条和航线指令按钮。远航调度条有文字状态和闭环进度条，但还没有直接展示“目标 -> 协同/续航 -> 回目标”的 3 格当前步骤轨。

本轮决策：

- 在 `getFarRouteDispatch` 中为 active 调度派生 `loopSteps` 和 `loopStepText`，按闭环进度标记“下一步 / 已完成 / 待推进”。
- 在主操作区 `farDispatch` 中渲染 `far-dispatch-loop-track`，显示目标、协同/续航、回目标三格路径。
- 本轮只调整远航调度展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、远航调度计算、星图航段、项目奖励、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 13:43 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getFarRouteDispatch` 在 #6 快照对应的脉冲航闸阶段返回 `loopStepText = "远航路径：下一步 目标 点火齐射 -> 待推进 协同 谐振脉冲 -> 待推进 回目标 点火齐射"`，并在 1/3、2/3、3/3 时正确切换三格状态。
- 运行期远航调度条会渲染 `far-dispatch-loop-track` 和 `far-dispatch-loop-step`，锁定态不显示路径轨。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `far-dispatch-loop-track`、`loopStepText` 和“远航路径”。
- 提交 2301e81 已推送；GitHub Pages workflow 25149809258 已成功，线上地址返回 HTTP 200，且线上首页、`app.js`、`game.js` 和 `styles.css` 已确认包含远航调度主路径轨相关标记。
- #6 已回复并继续保持 open，等待复测确认主操作区远航调度条的 3 格路径轨是否让后半段短循环在实际执行时更清楚。
- 回复后同步 GitHub Issues：2026-04-30 13:55 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T05:55:22Z。

下一步：等待 #6 复测；若仍认为后半段玩法变化不足，再评估更重的可规划短循环或资源消耗型指令。

## 2026-04-30 Product decision：星图调度路径轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 13:28 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 的“后半段只有不停的目标、玩法没有真正变化”仍未有玩家复测结论，继续进入 Product decision。

当前最大问题：上一轮已经把远航调度目标、协同续航和闭环提示同步到星图当前航段卡片，但仍是一行详情文字。玩家需要阅读后才能意识到当前航段实际驱动的是“目标指令 -> 协同续航 -> 回到目标闭环”的 3 步短循环。

本轮决策：

- 在 `getProjectStatuses` 的当前航段远航调度字段中增加 `dispatchSteps` 和 `dispatchStepText`，复用现有目标指令与协同续航映射。
- 在星图当前航段卡片详情中渲染 `project-dispatch-track`，显示 3 个固定步骤：目标指令、协同续航、回目标闭环。
- 本轮只调整星图卡片展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、远航调度计算、星图航段、项目奖励、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 13:28 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectStatuses` 在 #6 快照对应的脉冲航闸阶段返回 `dispatchStepText = "调度路径：目标 点火齐射 -> 协同 谐振脉冲 -> 回目标 点火齐射"`，并返回 3 个路径步骤。
- 运行期卡片详情会渲染 `project-dispatch-track` 和 `project-dispatch-step`，窄屏下按固定最小宽度换行，不挤压项目卡片。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `project-dispatch-track`、`dispatchStepText` 和“调度路径”。
- 提交 1d6e6ef 已推送；GitHub Pages workflow 25149295793 已成功，线上地址返回 HTTP 200，且线上 `app.js`、`game.js` 和 `styles.css` 已确认包含星图调度路径轨相关标记。
- #6 已回复并继续保持 open，等待复测确认星图当前航段的 3 步路径轨是否让后半段目标和主动指令玩法的关系更清楚。
- 回复后同步 GitHub Issues：2026-04-30 13:37 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T05:37:33Z。

下一步：等待 #6 复测；若仍认为后半段玩法变化不足，再评估把路径轨同步到星图总览或增加更明确的航段驱动状态图。

## 2026-04-30 Product decision：星图调度可见性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 13:13 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#6 的“后半段只有不停的目标、玩法没有真正变化”仍未有玩家复测结论，继续进入 Product decision。

当前最大问题：20M 后远航调度已经会让当前航段指定目标指令、协同续航和闭环奖励，但玩家在星图卡片层仍主要看到“目标名称 + 奖励 + 进度”。如果调度关系只出现在航线指令区，目标层和玩法变化之间的连接仍不够直接。

本轮决策：

- 在 `getProjectStatuses` 中为 20M 后当前航段派生远航调度展示字段：调度徽标、目标指令、协同续航指令和闭环提示。
- 星图当前航段卡片头部显示“调度 X”徽标，详情里显示“远航调度：目标 X · 协同 Y · 3/3 回到目标触发闭环”。
- 本轮只调整星图卡片展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、远航调度计算、星图航段、项目奖励、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 13:13 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getProjectStatuses` 在 #6 快照对应的脉冲航闸阶段返回 `dispatchBadgeText = "调度 点火齐射"`，并返回目标/协同指令 id。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 构建产物已确认包含 `project-dispatch-badge`、`project-dispatch` 和远航调度详情派生逻辑。
- 提交 c35a086 已推送；GitHub Pages workflow 25148886216 已成功，线上地址返回 HTTP 200，且线上 `app.js`、`game.js` 和 `styles.css` 已确认包含星图调度可见性相关标记。
- #6 已回复并继续保持 open，等待复测确认星图目标层是否更清楚地连接到后半段指令玩法。
- 回复后同步 GitHub Issues：2026-04-30 13:24 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T05:23:59Z。

下一步：回复 #6 并等待复测；若仍认为后半段玩法变化不足，再评估把远航调度关系同步到星图总览或增加更明确的航段驱动效果图。

## 2026-04-30 Product decision：航线指令插画

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 13:00 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 的“界面文字密集、希望更多图片和更好看”仍未有玩家复测结论，继续进入 Product decision。

当前最大问题：航线指令按钮已有视觉徽记、冷却轨、状态灯、徽标压缩、收益明细压缩和支持说明摘要化，但 100K 后的主动玩法入口仍从点火按钮直接进入三张指令按钮和进度/调度状态。相比主操作区和星图区已有插画，航线指令区还缺少区域级图片锚点。

本轮决策：

- 新增项目内本地 SVG `src/assets/directive-visual.svg`，表现点火齐射、巡航回收、谐振脉冲和 3 步轮换轨。
- 静态首页在 `directiveList` 前新增 `directive-scene-image`，让玩家先扫到指令玩法画面，再读按钮状态和短摘要。
- 本轮只调整航线指令区展示层；不新增存档字段，不改变指令收益、实际冷却、连携窗口、轮换目标奖励、预案执行、航线委托、策略契合、策略终结、指令熟练、远航调度、星图航段、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 13:00 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页和构建产物包含 `directive-scene-image`、`src/assets/directive-visual.svg`、“星核工坊航线指令插画”和 `routeBeam`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 109 项。
- 提交 2a9d51e 已推送；GitHub Pages workflow 25148455339 已成功，线上地址返回 HTTP 200，且线上首页、SVG 资源和 `styles.css` 已确认包含航线指令插画相关标记。
- #4 已回复并继续保持 open，等待复测确认 100K 后航线指令区新增插画是否进一步降低文字密度。
- 回复后同步 GitHub Issues：2026-04-30 13:08 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T05:08:21Z。

下一步：等待 #4 复测；若仍认为界面密集，优先评估航线指令区布局密度或更明确的状态图形，而不是调整指令数值。

## 2026-04-30 Product decision：航线指令说明摘要化

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 12:45 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 的“界面文字密集、希望更多图片和更好看”仍未有玩家复测结论，继续进入 Product decision。

当前最大问题：航线指令按钮本体已完成徽记、冷却轨、状态灯、徽标压缩和收益明细压缩，但按钮下方的指令轮换、航线委托和远航调度说明仍默认显示完整长句。100K/20M 后这些长句会和 3 格视觉轨、进度条、按钮徽标一起形成新的文字块。

本轮决策：

- 运行期新增 `setCompactSupportText`，把指令轮换、航线委托、远航调度主说明默认压缩为短摘要，完整说明保留到 `title` 和 `aria-label`。
- 静态首页同步短摘要：`directivePlan` 只显示解锁摘要，`directive-task-text` 只显示 100K 解锁短句，`far-dispatch-text` 只显示 20M 解锁短句。
- CSS 对三段支持文本增加单行省略，避免小屏继续换行成文字墙。
- 本轮只调整航线指令支持说明展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、轮换目标奖励、预案执行、航线委托、策略契合、策略终结、指令熟练、远航调度、星图航段、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 12:45 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页和运行期资源包含 `setCompactSupportText`、`getDirectivePlanDisplayText`、`getDirectiveTaskDisplayText`、`getFarDispatchDisplayText`，且完整说明进入 `title` / `aria-label`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 108 项。
- 构建产物已确认包含 `setCompactSupportText`、`getDirectivePlanDisplayText`、`getDirectiveTaskDisplayText`、`getFarDispatchDisplayText`、“航线委托：100K 后解锁 3 步任务”和“远航调度：20M 后解锁”。
- 提交 893ab03 已推送；GitHub Pages workflow 25148101290 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含航线指令说明摘要化相关标记。
- #4 已回复并继续保持 open，等待复测确认 100K/20M 后航线指令支持说明默认摘要化是否进一步降低文字密度。
- 回复后同步 GitHub Issues：2026-04-30 12:55 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T04:54:55Z。

## 2026-04-30 Product decision：航线指令徽标压缩

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 12:32 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 的“界面文字密集、希望更多图片和更好看”仍未有玩家复测结论，继续进入 Product decision。

当前最大问题：航线指令三按钮已经有徽记、冷却进度轨和状态灯，但 100K 后推荐、预案、委托、远航调度、远航续航、远航协同、整备、策略终结、熟练和策略契合等徽标可能同时出现。按钮头部和预计收益行会重新堆出一串文字，抵消前几轮视觉化改动。

本轮决策：

- 在运行期 `renderDirective` 中增加 `DIRECTIVE_VISIBLE_BADGE_LIMIT = 3`，每个航线指令按钮最多直接显示 3 个文字徽标，剩余徽标折成 `directive-badge-overflow` 的 `+N` 提示。
- 预计收益行改用 `getDirectivePreviewDisplayText` 展示“预计 +X 能量 · N 项明细”，完整原始 `option.previewText` 保留到 `title` 和 `aria-label`，减少视觉文字密度但不丢失明细。
- 本轮只调整航线指令按钮展示层；不新增存档字段，不改变指令收益、实际冷却、连携窗口、轮换目标奖励、预案执行、航线委托、策略契合、策略终结、指令熟练、远航调度、星图航段、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 12:32 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 运行期资源包含 `DIRECTIVE_VISIBLE_BADGE_LIMIT`、`compactDirectiveBadges`、`directive-badge-overflow`、`getDirectivePreviewDisplayText` 和“项明细”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 108 项。
- 构建产物已确认包含 `DIRECTIVE_VISIBLE_BADGE_LIMIT`、`directive-badge-overflow`、`getDirectivePreviewDisplayText`、`is-collapsed-badge` 和“项明细”。
- 提交 74dac74 已推送；GitHub Pages workflow 25147712250 已成功，线上地址返回 HTTP 200，且线上 `app.js` / `styles.css` 已确认包含航线指令徽标压缩相关标记。
- #4 已回复并继续保持 open，等待复测确认 100K 后航线指令按钮的徽标和收益明细压缩是否进一步减少文字密度。
- 回复后同步 GitHub Issues：2026-04-30 12:40 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T04:40:35Z。

## 2026-04-30 Product decision：航线指令状态灯

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 12:19 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍反馈界面文字密集、希望更多图片和更好看，继续进入 Product decision。

当前最大问题：航线指令三按钮已经有固定徽记和冷却进度轨，但可执行、冷却中、未解锁这些状态仍主要依赖按钮下方文字和进度条判断。玩家在 100K 后同时处理推荐、预案、远航和冷却时，需要更快看出图标本身是否可用。

本轮决策：

- 给 `renderDirectiveVisual` 增加 `directive-state-orb` 状态灯，运行期按 `option.ready` / `option.cooling` / `option.recommended` 添加 `is-ready`、`is-cooling`、`is-recommended` 视觉状态。
- 静态首页三枚锁定态指令徽记同步包含状态灯占位，避免首屏结构与运行期结构不一致。
- 本轮只调整航线指令徽记展示层；不新增存档字段，不改变指令收益、实际冷却、连携窗口、轮换目标奖励、预案执行、航线委托、策略契合、策略终结、指令熟练、远航调度、星图航段、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 12:19 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页和运行期资源包含 `directive-state-orb`，运行期徽记能根据 ready/cooling/recommended 状态追加对应 class。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 108 项。
- 构建产物已确认包含 `directive-state-orb`、`directive-visual.is-ready` 和 `directive-visual.is-cooling`。
- 提交 bb1a4c7 已推送；GitHub Pages workflow 25147333844 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含航线指令状态灯相关标记。
- #4 已回复并继续保持 open，等待复测确认状态灯是否进一步降低 100K 后航线指令按钮区的文字判断压力。
- 回复后同步 GitHub Issues：2026-04-30 12:27 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T04:27:31Z。

## 2026-04-30 Product decision：航线指令冷却进度轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 12:07 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍反馈界面文字密集、希望更多图片和更好看，且 #3/#6 的主动短循环也依赖指令按钮可扫视性，继续进入 Product decision。

当前最大问题：航线指令三按钮已经有视觉徽记，但每个按钮在使用后仍主要靠“冷却 X 秒”文字说明可用状态。玩家在 100K 后同时处理轮换推荐、预案奖励、远航调度和冷却时，需要读状态文本才能判断哪个指令快好。

本轮决策：

- 在 `getDirectiveStatus` 为每个指令派生 `cooldownProgress` 和 `cooling`，只反映已有冷却状态。
- 运行期按钮新增 `directive-cooldown-meter` 可访问进度轨，静态首页锁定态也补三条冷却进度占位。
- 本轮只调整航线指令按钮展示层；不新增存档字段，不改变指令收益、实际冷却、连携窗口、轮换目标奖励、预案执行、航线委托、策略契合、策略终结、指令熟练、远航调度、星图航段、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 12:07 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- `getDirectiveStatus` 在可执行、冷却中和未解锁状态返回稳定的 `cooldownProgress` / `cooling`。
- 静态首页和运行期资源包含 `directive-cooldown-meter`、`cooldownProgress`、`is-cooling` 和“冷却进度”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 108 项。
- 构建产物已确认包含 `directive-cooldown-meter`、`cooldownProgress`、`is-cooling` 和“冷却进度”。
- 提交 45b4a8b 已推送；GitHub Pages workflow 25146979089 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含航线指令冷却进度轨相关标记。
- #4 已回复并继续保持 open，等待复测确认冷却进度轨是否进一步降低 100K 后航线指令按钮区的文字判断压力。
- 回复后同步 GitHub Issues：2026-04-30 12:14 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T04:14:37Z。

## 2026-04-30 Product decision：航线指令视觉徽记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 11:52 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍反馈界面文字密集、希望更多图片和更好看，#3/#6 也都和航线指令扫视成本有关，进入 Product decision。

当前最大问题：星图、章节、升级、项目卡片和航线策略已经补充视觉资产或徽记，但 100K 后的航线指令三按钮仍以文字标题、说明和大量收益徽标为主。玩家需要先读“点火齐射/巡航回收/谐振脉冲”和说明文字，才能区分三类主动按钮的作用方向。

本轮决策：

- 为三种航线指令新增 `DIRECTIVE_ICON_DEFS` 和 `renderDirectiveVisual`，分别渲染点火齐射、巡航回收、谐振脉冲徽记。
- 静态首页 `directiveList` 增加三张带徽记的锁定占位按钮，运行期按钮标题区也改为徽记 + 指令名 + 徽标组。
- 本轮只调整航线指令按钮展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、轮换目标奖励、预案执行、航线委托、策略契合、策略终结、指令熟练、远航调度、星图航段、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 11:52 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页和运行期资源包含 `directive-visual-ignition-salvo`、`directive-visual-cruise-cache`、`directive-visual-resonance-pulse`、`DIRECTIVE_ICON_DEFS` 和 `renderDirectiveVisual`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 108 项。
- 构建产物已确认包含航线指令视觉徽记相关标记。
- 提交 0b5d006 已推送；GitHub Pages workflow 25146648219 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含航线指令视觉徽记相关标记。
- #4 已回复并继续保持 open，等待复测确认航线指令三类徽记是否降低 100K 后指令区的文字压力。
- 回复后同步 GitHub Issues：2026-04-30 12:02 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T04:02:09Z。

## 2026-04-30 Product decision：航线策略视觉徽记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 11:41 CST 通过 `ops/collect-feedback.sh` 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#4 仍反馈界面文字密集、希望更多图片和更好看，进入 Product decision。

当前最大问题：星图、章节导航、升级和项目卡片已经有视觉资产与图标，但 100K 后的航线策略三按钮仍是文本卡片。玩家需要读“均衡航线/点火优先/巡航优先”和说明文字才能区分策略方向，和 #4 的扫视压力仍有关。

本轮决策：

- 为三种航线策略新增 `ROUTE_STANCE_ICON_DEFS` 和 `renderRouteStanceVisual`，分别渲染均衡、点火、巡航徽记。
- 静态首页 `routeStanceList` 增加三张带徽记的锁定占位按钮，运行期渲染仍由当前策略状态替换。
- 本轮只调整航线策略按钮展示层；不新增存档字段，不改变航线策略倍率、100K 解锁条件、专精航段、航线指令、星图路线、升级价格、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 11:41 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页和运行期资源包含 `route-stance-visual-balanced`、`route-stance-visual-ignition`、`route-stance-visual-cruise`、`ROUTE_STANCE_ICON_DEFS` 和 `renderRouteStanceVisual`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 107 项。
- 构建产物已确认包含策略视觉徽记相关标记。
- 提交 03d317b 已推送；GitHub Pages workflow 25146277465 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含航线策略视觉徽记相关标记。
- #4 已回复并继续保持 open，等待复测确认航线策略三类徽记是否降低 100K 后策略区的文字压力。
- 回复后同步 GitHub Issues：2026-04-30 11:47 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-30T03:47:33Z。

## 2026-04-30 Product decision：指令轮换视觉轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 11:25 CST 同步到 5 个 open feedback issue、0 个 open bug issue。没有新的 bug issue；#3 仍反馈玩法太简单，#6 仍反馈后半段缺少真正玩法变化，且二者都和航线指令短循环的可理解性有关，继续进入 Product decision。

当前最大问题：航线指令已经有推荐预案、航线委托、策略终结、指令熟练、远航调度、远航续航、远航协同、远航闭环和远航整备，但玩家默认看到的是一段较长的指令轮换说明、三个按钮和两个进度条。短循环“第几步完成、下一步按哪个、后续还有几步”仍需要从文字和按钮徽标里拼接。

本轮决策：

- 在指令轮换说明下方新增 `directivePlanTrack` 三格视觉轨，按 `getDirectivePlan` 的 `progress`、`target`、`nextDirectiveIds`、`recommendationText` 派生已完成、下一步和待推进状态。
- 视觉轨在锁定态显示 100K 解锁；解锁后显示 1/3 到 3/3 的当前完成进度和推荐指令名；完成 3/3 后显示轮换完成。
- 本轮只调整航线指令展示层；不新增存档字段，不改变指令收益、冷却、连携窗口、轮换目标奖励、预案执行、航线委托、策略契合、策略终结、指令熟练、远航调度、远航续航、远航协同、远航闭环、远航整备、星图航段、项目奖励、升级价格或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 11:25 CST 当前 5 个 open feedback issue、0 个 open bug issue。
- 静态首页包含 `directivePlanTrack`、`directive-plan-track`、`directive-plan-step` 和 `aria-label="指令轮换视觉轨"`。
- 运行期 `src/app.js` 调用 `renderDirectivePlanTrack(directives.plan, directives.options)`，并把现有计划状态渲染为 3 格视觉轨。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 构建产物已确认包含 `directivePlanTrack`、`directive-plan-track`、`directive-plan-step`、`renderDirectivePlanTrack` 和“指令轮换视觉轨”。
- 提交 ca9b1db 已推送；GitHub Pages workflow 25145956308 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含指令轮换视觉轨相关标记。
- #3 和 #6 已回复并继续保持 open，等待复测确认 3 格视觉轨是否让航线指令和后半段远航短循环更容易扫视和连续执行。
- 回复后同步 GitHub Issues：2026-04-30 11:35 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-30T03:35:12Z，#6 更新时间为 2026-04-30T03:35:32Z。

## 2026-04-30 Product decision：点火收益浮层

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 11:13 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 已连续多轮补齐远航调度短循环但尚无复测结论；#5 仍反馈点火按钮“太薄弱”，继续进入有反馈样本下的 Product decision。

当前最大问题：点火按钮已有脉冲、粒子、过载前兆、冲击波、8 格连击轨和下一击预告，但点击后的实际收益仍主要出现在主操作提示里。玩家按下按钮的一瞬间，按钮本体还没有直接弹出“这次得到了多少”的确认，点击欲望的即时回报仍可继续增强。

本轮决策：

- 在点火按钮内新增 `coreGainPop` 收益浮层，点击后短暂显示本次 `+X` 能量。
- 过载点击会给收益浮层追加 `is-overload-gain` 样式和更长动画，和现有过载冲击波形成同一瞬间的强反馈。
- 本轮只调整点火按钮展示层；不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、产能公式、星图 57 段路线、项目奖励、航线策略、航线指令、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 11:13 CST 当前 5 个 open feedback issue、0 个 open bug issue；#5 继续作为点火点击欲望处理对象。
- 点击点火后按钮内显示 `+lastGain` 收益浮层；第 8 次过载点击使用 `is-overload-gain` 强反馈样式。
- 静态首页和运行期资源包含 `coreGainPop`、`core-gain-pop`、`coreGainFloat` 和 `is-overload-gain`。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 构建产物已确认包含 `coreGainPop`、`core-gain-pop`、`coreGainFloat`、`gainText` 和 `is-overload-gain`。
- 提交 5b1a738 已推送；GitHub Pages workflow 25145593440 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含点火收益浮层相关标记。
- #5 已回复并继续保持 open，等待复测确认按钮内收益浮层是否提升点击反馈和点击欲望。
- 回复后同步 GitHub Issues：2026-04-30 11:21 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T03:21:06Z。

下一步：等待 #5 复测；若仍觉得点火按钮薄弱，再评估音效开关、更多星核视觉阶段或更强的点击连击阶段反馈。

## 2026-04-30 Product decision：远航整备续航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 10:57 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已给目标后的非目标步骤增加“远航协同”优先项，但尚无玩家复测结论；继续进入 Product decision。

当前最大问题：远航调度短循环已经明确为目标指令、协同续航、回到目标指令闭环，但完成闭环后仍可能撞上协同续航指令冷却，导致下一轮短循环从“完成后继续操作”退回“等冷却”。这会削弱后半段当前航段改变操作节奏的感知。

本轮决策：

- 新增“远航整备”：远航调度 active 时，3/3 指令轮换回到当前航段目标指令并触发远航闭环后，会刷新当前协同续航指令的冷却。
- 完成态的下一步推荐从普通熟练续航改为“整备续航/等待整备”，并优先推荐当前目标指令指定的协同续航指令；脉冲航闸阶段为点火齐射闭环后刷新并推荐谐振脉冲。
- 按钮徽标、预计收益、执行反馈、本地 `directive` 事件和远航调度条记录 `dispatchRefreshDirectiveId` / `dispatchRefreshDirectiveName` / `dispatchRefreshText`。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响、远航调度校准、冷却倍率、连携窗口、远航续航奖励倍率、远航协同奖励、远航闭环奖励或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 10:57 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，远航调度显示完成闭环后远航整备刷新谐振脉冲冷却。
- 谐振脉冲作为协同续航后仍在冷却时，回到点火齐射完成 3/3 闭环会把谐振脉冲冷却刷新为可执行。
- 完成闭环后 `getDirectivePlan.nextDirectiveIds` 优先返回谐振脉冲，推荐文案为“整备续航”，等待文案为“等待整备”。
- 静态首页和运行期资源包含 `dispatchRefreshText`、`directive-dispatch-refresh` 和“远航整备”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 构建产物已确认包含 `dispatchRefreshText`、`directive-dispatch-refresh`、“远航整备”和“整备续航”。
- 提交 1f190f8 已推送；GitHub Pages workflow 25145266275 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航整备相关标记。
- #6 已回复并继续保持 open，等待复测确认远航整备刷新协同续航冷却后，后半段短循环是否更容易连续进入下一轮。
- 回复后同步 GitHub Issues：2026-04-30 11:09 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T03:08:55Z。

下一步：等待 #6 复测；若仍认为后半段只是追推荐按钮，再评估更重的资源消耗型阶段动作或项目分支。

## 2026-04-30 Product decision：远航协同续航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 10:38 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已让目标指令后的两个非目标按钮都进入远航续航推荐，但尚无玩家复测结论；继续进入 Product decision。

当前最大问题：远航调度短循环已经具备目标指令、非目标续航和回到目标指令闭环，但目标后的两个非目标按钮在上一轮变成等价选择。玩家仍可能把第二步理解成“按任意推荐按钮”，而不是当前航段进一步改变操作结构。

本轮决策：

- 新增 `FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE = 0.05`；远航调度 active 时，目标指令后的 1/3 阶段仍允许任意非目标指令触发 8% 远航续航，但目标指令会额外指定一个协同续航指令，执行该指令获得 5% 远航协同奖励。
- 协同续航按目标指令派生：点火齐射后优先谐振脉冲，谐振脉冲后优先巡航回收，巡航回收后优先点火齐射；脉冲航闸阶段因此形成“点火齐射 -> 谐振脉冲协同续航 -> 回到点火齐射”的优先闭环。
- 按钮徽标、预计收益、执行反馈和本地 `directive` 事件新增 `dispatchSyncReward` / `dispatchSyncRewardRate` / `dispatchSyncRewardText`；远航调度条和闭环进度文案同步提示“优先协同，其他非目标仍可续航”。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响、远航调度校准、冷却、连携窗口、远航续航奖励倍率、远航闭环奖励或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 10:38 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，远航调度目标指令为点火齐射，协同续航指令为谐振脉冲，并显示“目标后优先谐振脉冲触发远航协同 +5%，其他非目标仍触发远航续航 +8%”。
- 点火齐射后 `getDirectivePlan.nextDirectiveIds` 仍返回巡航回收和谐振脉冲；巡航回收只显示远航续航，谐振脉冲同时显示远航续航和远航协同。
- 执行谐振脉冲续航时，预计收益、执行反馈和本地 `directive` 事件记录远航协同；执行巡航回收续航时不记录远航协同。
- 静态首页和运行期资源包含 `FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE`、`dispatchSyncReward`、`directive-dispatch-sync` 和“远航协同”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 1faabbd 已推送；GitHub Pages workflow 25144798558 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航协同相关标记。
- #6 已回复并继续保持 open，等待复测确认目标后的协同续航优先级是否比两个等价非目标按钮更像后半段当前航段决定的操作变化。
- 回复后同步 GitHub Issues：2026-04-30 10:51 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T02:51:43Z。

下一步：等待 #6 复测；若仍认为后半段只是按推荐按钮追目标，再评估资源消耗型阶段动作、项目分支或更重的可规划短循环。

## 2026-04-30 Product decision：远航续航推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 10:23 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已让目标指令后的非目标指令结算“远航续航”，但尚无玩家复测结论；继续进入 Product decision。

当前最大问题：远航调度短循环已经形成“目标指令 -> 非目标续航 -> 回到目标指令”，但第二步的按钮推荐仍可能沿用常规收束逻辑，只标出一个非目标指令。玩家看到“任意非目标指令都有远航续航奖励”与“只有一个按钮被推荐”时，仍可能把第二步理解成规则折中而不是当前航段给出的明确操作。

本轮决策：

- 目标指令后的 1/3 阶段新增远航续航推荐：若上一指令是当前航段目标指令，下一步可用非目标指令都标为“远航续航/等待续航”。
- `getDirectivePlan` 在该阶段不再用常规策略收束过滤掉另一个非目标指令，脉冲航闸点火齐射后会同时推荐巡航回收和谐振脉冲作为远航续航第二步。
- 远航调度条文案同步从“目标后切换非目标指令触发远航续航”调整为“目标后推荐非目标指令触发远航续航”，让第二步不只靠奖励徽标说明。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响、远航调度校准、冷却、连携窗口、远航续航奖励倍率、远航闭环奖励或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 10:23 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，点火齐射后 `getDirectivePlan.nextDirectiveIds` 返回巡航回收和谐振脉冲，推荐文案为“远航续航”，等待文案为“等待续航”。
- 点火齐射后两个非目标指令按钮都显示远航续航推荐；执行任意非目标指令仍结算远航续航奖励，再回到点火齐射触发远航闭环。
- 静态首页和运行期资源包含“远航续航”，运行期远航调度条显示目标后推荐非目标指令触发远航续航。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 36b91fe 已推送；GitHub Pages workflow 25144325224 已成功，线上地址返回 HTTP 200，且线上 `game.js` 已确认包含 `dispatchRelayCanOverride`、“远航续航可切换到”、“目标后推荐非目标指令”和“等待续航”。
- #6 已回复并继续保持 open，等待复测确认两个非目标按钮都进入远航续航推荐后，三步远航短循环是否更像后半段真正的操作变化。
- 回复后同步 GitHub Issues：2026-04-30 10:33 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T02:33:23Z。

下一步：等待 #6 复测；若仍认为后半段只是按推荐按钮追目标，再评估资源消耗型指令或阶段内选择分支。

## 2026-04-30 Product decision：远航续航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 10:12 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已把远航闭环进度条上线但尚无玩家复测结论；继续进入 Product decision。

当前最大问题：远航调度短循环已经有目标指令起手的调度校准、目标冷却缩短、调度接力、3/3 回到目标指令的远航闭环奖励和闭环进度条。但第二步“从目标指令切到非目标指令”仍主要靠连携规则和进度文案支撑，玩家可能把它看成被迫绕路，而不是当前航段短循环的一部分。

本轮决策：

- 新增 `FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE = 0.08`；20M 后远航调度 active 时，如果上一指令是当前航段目标指令，下一步切换任意非目标指令并接上 1/3 连携，会获得有效基础指令收益 8% 的“远航续航”奖励。
- 指令按钮新增 `directive-dispatch-relay` 徽标；预计收益、执行反馈和本地 `directive` 事件记录 `dispatchRelayReward` / `dispatchRelayRewardRate` / `dispatchRelayRewardText`。
- 远航调度条和闭环进度文案同步说明“目标后切换非目标指令触发远航续航 +8%”，让目标指令 -> 非目标续航 -> 回到目标指令三步都有明确回报。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响、远航调度校准、冷却、连携窗口、远航闭环奖励或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 10:12 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，远航调度显示目标指令点火齐射，并说明目标后切换非目标指令触发远航续航 +8%。
- 点火齐射后，远航闭环进度显示 1/3，并提示下一步切换非目标指令触发远航续航；非目标指令按钮显示远航续航收益徽标，执行反馈包含远航续航。
- 静态首页和运行期资源包含 `directive-dispatch-relay`、`dispatchRelayReward`、`FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE` 和“远航续航”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 72aefdc 已推送；GitHub Pages workflow 25143929133 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航续航相关标记。
- #6 已回复并继续保持 open，等待复测确认三步远航短循环是否比上一版更像后半段真正的可执行玩法变化。
- 回复后同步 GitHub Issues：2026-04-30 10:18 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T02:18:33Z。

下一步：等待 #6 复测；若仍认为后半段只是追目标，再评估真正消耗资源的阶段动作或项目分支。

## 2026-04-30 Product decision：远航调度闭环进度

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 09:55 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已上线“远航闭环”奖励但尚无玩家复测结论；继续进入 Product decision。

当前最大问题：远航调度已经能指定目标指令、接管推荐、缩短冷却、延长连携窗口并在回到目标指令时给闭环奖励，但远航调度条仍主要说明规则和当前航段进度。玩家可能仍要从按钮徽标和指令轮换文案里拼出“闭环现在走到第几步、下一步是否该回到目标指令”。

本轮决策：

- 新增远航调度闭环进度派生状态：`loopProgress`、`loopTarget`、`loopStatusText` 从现有 `directiveChain`、目标指令和连携窗口推导，不新增存档字段。
- 远航调度条新增第二条可访问进度条 `far-dispatch-loop-meter`，显示 0/3 到 3/3；0/3 提示下一步目标指令，2/3 明确提示回到目标指令触发远航闭环，3/3 提示切换非目标指令开启下一轮。
- 反馈快照中的远航调度状态追加闭环进度，便于后续复盘 #6 是否完成了目标指令短循环。
- 本轮不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响、远航调度奖励、冷却、连携窗口或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 09:55 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，远航调度显示目标指令点火齐射，并派生 `闭环进度 0/3 · 下一步 点火齐射`。
- 点火齐射 -> 巡航回收后，远航调度派生 `闭环进度 2/3`，并提示下一步回到点火齐射触发远航闭环；完成后显示 `闭环进度 3/3` 和开启下一轮提示。
- 静态首页包含 `far-dispatch-loop-meter` 与 `aria-label="远航闭环进度"`；运行期 `renderFarDispatch` 渲染闭环文字和第二条 meter。
- 反馈 Issue 快照包含远航调度闭环进度。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 b358677 已推送；GitHub Pages workflow 25143476516 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含闭环进度相关标记。
- #6 已回复并继续保持 open，等待复测确认闭环进度条是否让后半段更像可执行、可完成、可重复的当前航段短循环。
- 回复后同步 GitHub Issues：2026-04-30 10:02 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T02:01:58Z。

下一步：等待 #6 复测；若仍认为后半段只是追目标，再评估真正消耗资源的阶段动作或项目分支。

## 2026-04-30 Product decision：远航调度闭环奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 09:34 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已让远航调度目标指令延长连携窗口，但尚无玩家复测结论；继续进入 Product decision。

当前最大问题：远航调度已经指定目标指令、接管推荐、缩短冷却并把目标指令后的连携窗口延长到 120 秒，但“完成一轮短循环”的奖励仍主要混在轮换目标、委托和调度校准里。玩家可能知道下一步按哪个，却不一定把“目标指令 -> 续航 -> 回到目标指令”识别成后半段当前航段的闭环目标。

本轮决策：

- 新增 `FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE = 0.16`；20M 后远航调度 active 时，若 3/3 指令轮换回到当前航段目标指令，额外获得有效基础指令收益 16% 的“远航闭环”奖励。
- 目标指令只有在本次执行会完成 3/3 轮换时显示 `远航闭环 +X` 徽标；普通目标指令仍只显示调度校准、调度冷却和调度接力。
- 远航调度条同步说明“3/3 回到目标指令触发远航闭环 +16%”；本地 `directive` 事件新增 `dispatchLoopReward` / `dispatchLoopRewardRate` / `dispatchLoopRewardText`。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响、反馈入口或部署链路。

验收标准：

- GitHub Issues 已同步：2026-04-30 09:34 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，远航调度显示目标指令点火齐射、调度校准、目标冷却缩短、调度接力和 `远航闭环 +16%`。
- 点火齐射 -> 巡航回收后，第三步回到点火齐射会显示并结算 `远航闭环`；第一步点火齐射和非目标指令不触发闭环奖励。
- 按钮徽标、预计收益、执行反馈和本地 `directive` 事件都包含远航闭环字段；静态首页锁定态说明闭环奖励。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 6806c45 已推送；GitHub Pages workflow 25143036877 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航闭环相关标记。
- #6 已回复并继续保持 open，等待复测确认 3/3 回到目标指令的闭环奖励是否让后半段更像可完成短循环。
- 回复后同步 GitHub Issues：2026-04-30 09:45 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T01:45:22Z。

下一步：等待 #6 复测；若仍认为后半段只是追目标，再评估资源消耗型指令或更重的项目分支。

## 2026-04-30 Product decision：远航调度接力

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 09:20 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已让远航调度目标指令冷却缩短，但尚无玩家复测结论；继续进入 Product decision。

当前最大问题：远航调度已经能指定目标指令、接管推荐、提供调度奖励并缩短目标冷却，但执行目标指令后仍沿用 90 秒连携窗口。后半段玩家如果被冷却、读秒或其他按钮节奏打断，仍可能难以把“当前航段目标 -> 后续两步轮换”连成一个稳定短循环。

本轮决策：

- 新增 `FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS = 30`；20M 后远航调度 active 时，执行当前航段目标指令会把本轮指令连携窗口从 90 秒延长到 120 秒。
- 目标指令按钮显示 `调度接力 +30 秒`，预计收益和执行反馈同步展示；本地 `directive` 事件记录 `dispatchChainWindowSeconds` / `dispatchChainWindowText`。
- 远航调度条同步展示调度接力；锁定态文案说明后半段会解锁目标指令推荐、目标冷却缩短与连携窗口延长。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、基础连携倍率、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 09:20 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，远航调度显示目标指令点火齐射、`目标指令冷却 -30%` 和 `调度接力 +30 秒`。
- 点火齐射作为远航调度目标指令执行后，`directiveChain.expiresAt` 写入 120 秒窗口；同阶段非目标指令仍使用 90 秒窗口。
- 目标指令按钮显示 `directive-dispatch-window` 徽标，预计收益包含 `调度接力 +30 秒`，本地 `directive` 事件记录调度接力字段。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 d5dc442 已推送；GitHub Pages workflow 25142609617 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航调度接力相关标记。
- #6 已回复并继续保持 open，等待复测确认目标指令后的 120 秒连携窗口是否让后半段更像可完成短循环。
- 回复后同步 GitHub Issues：2026-04-30 09:28 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T01:28:41Z。

下一步：等待 #6 复测；若仍认为后半段只是追目标，再评估资源消耗型指令、项目分支或更重的远航短循环。

## 2026-04-30 Product decision：远航调度冷却抢占

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 09:07 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，上一轮已让远航调度接管推荐，但尚无复测结论；继续进入 Product decision。

当前最大问题：远航调度已经能指定目标指令、给“调度校准”奖励并接管下一步推荐，但目标指令仍使用原本 35/60/75 秒冷却。玩家看到当前航段目标后，仍可能因为冷却等待而回到“看目标、等数值”的节奏，当前航段对操作频率的影响还不够直接。

本轮决策：

- 新增 `FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER = 0.7`，20M 后远航调度 active 时，当前航段目标指令冷却缩短 30%。
- `activateDirective`、`getDirectiveStatus` 和 `getDirectivePlan` 共用调度后的有效冷却；目标指令会更早从冷却中恢复，按钮显示“调度冷却 -30%”。
- 远航调度条文案同步展示“目标指令冷却 -30%”，本地 `directive` 事件记录 `dispatchCooldownMultiplier` / `dispatchCooldownText`，便于后续复盘 #6。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令基础收益、连携窗口、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 09:07 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 继续作为本轮处理对象。
- 25M 脉冲航闸阶段，远航调度显示目标指令点火齐射、`调度校准 +14%` 和 `目标指令冷却 -30%`。
- 点火齐射 35 秒基础冷却在脉冲航闸调度中按 0.7 倍生效：使用后 19 秒仍显示冷却，25 秒后恢复可执行。
- 目标指令按钮显示 `directive-dispatch-cooldown` 徽标，预计收益包含“调度冷却 -30%”；非目标指令不显示该徽标。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 7cba19e 已推送；GitHub Pages workflow 25142230649 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航调度冷却相关标记。
- #6 已回复并继续保持 open，等待复测确认目标指令冷却缩短是否让后半段当前航段更能改变指令节奏。
- 回复后同步 GitHub Issues：2026-04-30 09:13 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T01:13:41Z。

下一步：等待 #6 复测；若仍认为后半段只是追目标，再评估更重的远航短循环或资源消耗型指令。

## 2026-04-30 Product decision：远航调度接管推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 08:51 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 仍是最新后半段玩法变化反馈，继续进入 Product decision。

当前最大问题：上一轮远航调度已经让 20M 后当前航段指定目标指令并提供“调度校准”奖励，但指令轮换推荐仍按常规收束起手、策略终结和熟练续航推导。玩家可能看到目标指令奖励，却仍被下一步推荐引向另一条指令，当前航段对操作结构的影响还不够直接。

本轮决策：

- `getDirectivePlan` 在远航调度 active 时把当前航段目标指令写入 `nextDirectiveIds`，按钮推荐文案显示“调度目标/等待调度”。
- 0/3 起手阶段，远航调度目标优先于常规“非契合起手、保留契合指令做策略终结”；连携进行中时，只要目标指令不是刚执行的上一条指令，也会优先成为下一步推荐。
- 脉冲航闸阶段会把点火齐射收束为唯一推荐目标；离辉轨道港这类自动奖励航段会让巡航回收优先于常规收束起手，让不同航段直接改变下一步指令选择。
- 本轮只调整派生推荐与展示文案；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令冷却、连携窗口、轮换目标奖励、预案执行、航线委托、指令熟练、满层回响或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 08:51 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 作为本轮处理对象。
- 25M 脉冲航闸阶段，`getDirectivePlan` 返回 `nextDirectiveIds = ["ignition-salvo"]`，推荐文案为“调度目标”，提示包含“远航调度指定点火齐射”。
- 35M 离辉轨道港阶段，巡航优先航线下常规起手会避开巡航回收，但远航调度会把 `nextDirectiveIds` 改为 `["cruise-cache"]` 并提示当前航段调度优先。
- 静态首页锁定文案同步为“累计 20M 能量后解锁后半段航段调度与目标指令推荐”。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 106 项。
- 提交 edec87d 已推送；GitHub Pages workflow 25141772650 已成功，线上地址返回 HTTP 200，且线上首页和 `game.js` 已确认包含“目标指令推荐”“调度目标”“等待调度”和“当前航段调度优先”。
- #6 已回复并继续保持 open，等待复测确认远航调度接管推荐是否让后半段当前航段更能改变操作选择。

下一步：等待 #6 复测；若仍认为后半段只是追目标，再评估资源消耗型指令、项目分支或更明确的远航短循环。

## 2026-04-30 Product decision：远航调度

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 08:27 CST 同步到 5 个 open feedback issue、0 个 open bug issue。#6 明确指出后半段“只有不停的目标，玩法没有真正变化”，本轮进入有反馈样本下的 Product decision。

当前最大问题：玩家已经到脉冲航闸附近，星图目标数量足够，但当前航段主要还是“攒到下一个数值门槛”。继续追加远航目标或文字摘要无法解决玩法结构变化不足。

本轮决策：

- 新增 20M 后解锁的“远航调度”，从当前未完成星图航段派生一个目标指令：点击奖励航段指定点火齐射，自动奖励航段指定巡航回收，过载奖励航段指定谐振脉冲，总产能奖励航段指定当前航线策略契合指令。
- 执行当前航段指定指令时，获得有效基础指令收益 14% 的“调度校准”奖励，并在预计收益、执行反馈、本地 `directive` 事件和按钮徽标中记录 `dispatchReward` / `dispatchRewardRate`。
- 主操作区新增 `farDispatch` 远航调度条，显示当前航段、目标指令、调度奖励和当前航段进度；反馈快照新增远航调度状态，便于后续复盘 #6。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、指令冷却、连携窗口、轮换目标奖励、预案执行、航线委托、指令熟练或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 08:27 CST 当前 5 个 open feedback issue、0 个 open bug issue；#6 作为本轮处理对象。
- 20M 前 `getFarRouteDispatch` 返回锁定态；25M 脉冲航闸阶段返回目标指令点火齐射、奖励文案“调度校准 +14%”和航段 27/57。
- 点火齐射预计收益和执行反馈包含调度校准奖励；巡航回收在同一脉冲航闸阶段不获得调度奖励。
- 静态首页包含 `farDispatch`、`far-dispatch-meter` 和“远航调度”；运行期会渲染 `directive-dispatch-bonus`。
- 反馈 Issue 快照包含远航调度状态。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 105 项。
- 构建产物已确认包含 `FAR_ROUTE_DISPATCH_UNLOCK_ENERGY`、`getFarRouteDispatch`、`farDispatch`、`directive-dispatch-bonus` 和“调度校准”。
- 提交 399e179 已推送；GitHub Pages workflow 25141363221 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含远航调度相关标记。
- #6 已回复并继续保持 open，等待复测确认远航调度是否让脉冲航闸附近的主动指令选择发生变化。
- 回复后同步 GitHub Issues：2026-04-30 08:42 CST 当前仍为 5 个 open feedback issue、0 个 open bug issue；#6 更新时间为 2026-04-30T00:42:29Z。

下一步：等待 #6 复测确认“当前航段改变目标指令”是否能缓解后半段只追数值目标的问题；若仍不足，再评估项目分支或资源消耗型指令。

## 2026-04-30 Product decision：点火奖励预告与连击轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 08:07 CST 同步到 4 个 open feedback issue、0 个 open bug issue。没有新的玩家复测或 bug；#5 仍保持 open，且指向“点火按钮太薄弱、增加点击反馈、特效和点击欲望”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：上一轮已补普通点击脉冲、粒子层、过载前兆和过载冲击波，但玩家仍需要从按钮外的连击文字和顶部产能区拼接“下一次点击给多少、还差几次过载”。按钮已经有点击后的反馈，但点击前的预期奖励和第 8 次过载目标还不够直接。

本轮决策：

- 新增 `getCoreRewardPreview`，从现有点击产能、过载奖励和 `getComboStatus` 推导下一击收益文案：普通状态显示“下一击 +X · 再 N 次过载 +Y”，第 7 次连击显示“下一击 +X · 触发过载 +Y”，第 8 次过载后提示进入新一轮蓄能。
- 在 `coreButton` 内新增 `core-combo-track` 8 格连击轨，运行期 `renderCoreComboTrack` 标记已填充格、下一格和第 8 格过载点，让过载进度变成按钮内的视觉目标。
- 在按钮下方新增 `coreRewardHint`，运行期 `renderCoreRewardHint` 同步下一击奖励预告，并在临近过载或刚触发过载时切换高亮状态。
- 本轮只调整展示和奖励预告；不新增存档字段，不改变点击收益、连击窗口、过载奖励、升级价格、产能公式、星图 57 段路线、项目奖励、航线策略、航线指令或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 08:07 CST 当前 4 个 open feedback issue、0 个 open bug issue；#5 继续作为本轮处理对象。
- `getCoreRewardPreview` 覆盖初始态、第 7 次连击临近过载和第 8 次过载后的下一击预告。
- 静态首页包含 `core-combo-track`、8 个 `core-combo-dot`、`coreRewardHint` 和默认“下一击 +1 · 再 8 次过载 +5”。
- 运行期 `renderCoreComboTrack` 会切换 `is-filled`、`is-next`、`is-overload-dot`、`is-overload-ready` 和 `is-overload-hit`；`renderCoreRewardHint` 会切换奖励预告高亮。
- `src/styles.css` 包含 `core-combo-track`、`core-combo-dot.is-next`、`core-reward-hint` 和 `coreDotPulse` 动画。
- 本地验证已通过：`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build`；测试数 104 项。
- 构建产物已确认包含 `core-combo-track`、`coreRewardHint`、`getCoreRewardPreview`、`coreDotPulse` 和“下一击”文案。
- 提交 d6e2dbd 已推送；GitHub Pages workflow 25140734201 已成功，线上地址返回 HTTP 200，且线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含点火奖励预告与 8 格连击轨相关标记。
- #5 已回复并继续保持 open，等待复测确认 8 格连击轨和下一击奖励预告是否让点火按钮更有明确点击目标。
- 回复后同步 GitHub Issues：2026-04-30 08:21 CST 当前为 5 个 open feedback issue、0 个 open bug issue；本轮工作期间新增 #6，反馈后半段“只有不停的目标，玩法没有真正变化”，已回复并作为下一轮优先产品决策候选。

下一步：优先处理 #6，评估后半段能改变操作结构的小系统，避免只继续追加星图目标或文字提示。

## 2026-04-30 Product decision：点火按钮即时反馈

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 07:54 CST 同步到 4 个 open feedback issue、0 个 open bug issue。没有新的 bug；#5 是最新反馈，明确指出“点火按钮太薄弱了，增加点击反馈，增加特效，增加点击欲望”，本轮进入有反馈样本下的 Product decision。

当前最大问题：主操作区已有工坊插画、连击/过载文本和行动提示，但点火按钮本身按下后的视觉反馈仍偏弱。玩家需要从数字和文字确认收益，按钮没有足够的按下脉冲、连击蓄势和过载触发差异。

本轮决策：

- 给 `coreButton` 增加静态 `data-combo-step` 与 `core-feedback-layer`，把“点火”文字改为明确的 `core-label`，为按钮内粒子层和冲击波留出稳定结构。
- 新增 `renderCoreFeedback`：按 `getComboStatus` 派生 `is-combo-charging`、`is-overload-ready`、`is-overload-hit`，并同步高亮 `pulseValue`，让第 7 次连击时出现过载前兆，第 8 次过载后保留强反馈状态。
- 扩展 `animateCore`：普通点击触发短脉冲，过载点击额外触发 `is-overload-impact`，并在动画结束后自动清理临时 class。
- 新增按钮环形蓄能、点击冲击波、过载冲击波和粒子层 CSS 动画；本轮只调整展示与交互反馈，不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、连击窗口、过载奖励、航线策略、航线指令或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 07:54 CST 当前 4 个 open feedback issue、0 个 open bug issue；#5 作为本轮处理对象。
- 静态首页 `coreButton` 包含 `data-combo-step="0"`、`core-feedback-layer` 和 `core-label`。
- 运行期 `renderCoreFeedback` 会写入 `dataset.comboStep`，并切换 `is-combo-charging`、`is-overload-ready`、`is-overload-hit`。
- `animateCore` 会按是否过载切换 `is-pulsing` / `is-overload-impact`，并用定时器清理临时动画状态。
- `src/styles.css` 包含 `coreShockwave`、`coreOverloadShockwave`、`coreSparks`、过载前兆按钮样式和 `pulseValue` 高亮样式。
- `tests/game.test.js` 新增点火按钮反馈测试；`bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 103 项。
- 构建产物包含 `core-feedback-layer`、`renderCoreFeedback`、`is-overload-ready`、`coreShockwave`、`coreOverloadShockwave` 和 `coreSparks`。
- 提交 f25d88f 已推送；GitHub Pages workflow 25140116602 已成功，线上地址返回 HTTP 200，且线上首页、`app.js` 和 `styles.css` 已确认包含点火按钮即时反馈相关标记。
- #5 已回复并继续保持 open，等待复测确认普通点击反馈、过载前兆和过载触发特效是否让点火按钮更有点击欲望。
- 回复后同步 GitHub Issues：2026-04-30 08:01 CST 当前仍为 4 个 open feedback issue、0 个 open bug issue；#5 更新时间为 2026-04-30T00:00:44Z。

下一步：等待 #5 复测；若仍认为按钮弱，再评估音效开关、点击连段奖励展示或更多星核视觉阶段。

## 2026-04-30 Product decision：航线委托进度条

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 07:38 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的 bug；#3 仍是最近更新的玩法反馈，上一轮已新增“航线委托”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线委托已经把推荐轮换变成 0/3 到 3/3 的短期任务，但显示仍是一行文字。玩家需要读完整文案才能判断进度，任务感还不够像一个可扫视的主动目标。

本轮决策：

- 在航线委托区域新增固定高度进度条，使用 `getDirectiveTaskStatus` 既有 `progress` / `target` / `completed` 派生状态渲染 0/3、2/3、3/3。
- 进度条提供 `role="meter"`、`aria-valuenow` 和 `aria-valuetext`；完成态切换 `is-completed` 样式。
- 本轮只调整航线委托展示层；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、预案执行、策略契合、策略终结、指令熟练、满层回响、航线委托奖励或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 07:38 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 静态首页 `directiveTask` 包含 `directive-task-meter`、`role="meter"` 和“航线委托进度”可访问标签。
- 运行期 `renderDirectiveTask` 使用 `task.progress` / `task.target` 计算进度条宽度，并在 3/3 后给容器添加 `is-completed`。
- `tests/game.test.js` 覆盖 2/3 未完成态和 3/3 完成态的 `progress` / `target` / `completed`。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 102 项。
- 构建产物包含 `directive-task-meter`、`renderDirectiveTask`、“航线委托进度”和 `is-completed`。
- 提交 40efcb0 已推送；GitHub Pages workflow 25139616313 已成功，线上地址返回 HTTP 200；线上首页包含 `directive-task-meter` 和“航线委托进度”，线上 `app.js` 包含 `renderDirectiveTask`，线上 `styles.css` 包含 `directive-task-meter` 与完成态样式。
- #3 已回复并继续保持 open，等待复测确认航线委托进度条是否让航线指令更像可完成、可扫视的短期主动任务。
- 回复后同步 GitHub Issues：2026-04-30 07:44 CST 当前为 4 个 open feedback issue、0 个 open bug issue；本轮工作期间新增 #5，已补 `feedback` 标签并回复，下一轮优先评估点火按钮点击反馈、特效和点击欲望。

下一步：优先处理 #5，围绕点火按钮即时反馈、连击前兆和轻量特效做最小可验证改动。

## 2026-04-30 Product decision：航线委托短期任务

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 07:24 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的玩家复测或 bug；#3 仍是最近更新的玩法反馈，继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有主动按钮、连携、推荐预案、预案执行奖励、策略终结、指令熟练和满层回响，但这些能力仍主要附着在按钮收益和轮换说明里。玩家缺少一个独立的短期任务行来确认“我现在正在做一轮 3 步委托，完成后有额外奖励”。

本轮决策：

- 新增“航线委托”短期任务，100K 后显示 0/3 到 3/3 的推荐轮换委托。
- 新增 `DIRECTIVE_TASK_REWARD_RATE = 0.08`：当玩家按推荐预案把轮换从 2/3 完成到 3/3 时，额外获得有效基础指令收益 8% 的“委托完成”奖励。
- `getDirectiveTaskStatus` 只从现有指令链、推荐预案和冷却状态推导；按钮徽标、预计收益、执行反馈和本地 `directive` 事件记录 `taskReward` / `taskRewardRate`。
- 本轮不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、预案执行、策略契合、策略终结、指令熟练、满层回响或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 07:24 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 锁定态显示“航线委托：累计 100K 能量后解锁 3 步短期任务”。
- 0/3 解锁态显示“航线委托 0/3 · 下一步 点火齐射或巡航回收，完成 3/3 推荐轮换 · 完成奖励 委托完成 +8%”。
- 2/3 推荐收束指令按钮显示 `directive-task-bonus`，预计收益包含“委托完成 +1.3”示例奖励。
- 执行 2/3 到 3/3 的推荐指令会返回 `taskReward = 1.2544`、`taskRewardRate = 0.08`，执行反馈写入“委托完成 +1.3”。
- 3/3 后委托状态显示已完成，并提示重置或超时后开启下一轮委托。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 102 项。
- 构建产物包含 `DIRECTIVE_TASK_REWARD_RATE`、`getDirectiveTaskStatus`、`directiveTask`、`directive-task-bonus`、“航线委托”和“委托完成”。
- 提交 6d29667 已推送；GitHub Pages workflow 25139224153 已成功，线上地址返回 HTTP 200；线上首页、`game.js`、`app.js` 和 `styles.css` 已确认包含航线委托短期任务相关标记。
- #3 已回复并继续保持 open，等待复测确认航线委托是否让航线指令更像一个可完成、有奖励确认的短期主动任务。
- 回复后同步 GitHub Issues：2026-04-30 07:31 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T23:31:14Z。

下一步：等待 #3 复测；若仍认为主动玩法不足，再评估资源消耗型指令或更明确的指令构筑分支。

## 2026-04-30 Product decision：预案执行按钮徽标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 07:07 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的玩家复测或 bug；#3 仍是最近更新的玩法反馈，继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有推荐预案、预案执行奖励、策略终结、指令熟练和满层回响，但“预案执行 +X”主要藏在预计收益行和执行反馈里。玩家扫按钮时仍先看到“收束起手/熟练续航”，不一定能立刻确认推荐按钮本身会带来额外收益。

本轮决策：

- 在航线指令按钮徽标区新增 `directive-plan-bonus`，当 `option.planRewardText` 存在时直接显示“预案执行 +X”。
- 保留原有收益计算、预计收益、执行反馈和本地 `directive` 事件字段；本轮只提升按钮层的奖励可见性。
- 不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、策略契合、策略终结、指令熟练、满层回响或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 07:07 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 推荐指令按钮会渲染 `directive-plan-bonus`，并把 `option.planRewardText` 显示为按钮徽标；没有预案奖励的指令不显示该徽标。
- `src/styles.css` 包含 `directive-plan-bonus` 样式，让预案执行奖励在按钮徽标组中可扫视。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 102 项。
- 构建产物包含 `directive-plan-bonus`、`planBonus.textContent = option.planRewardText` 和“预案执行”。
- 提交 8eb92b6 已推送；GitHub Pages workflow 25138711061 已成功，线上地址返回 HTTP 200；线上 `app.js` 包含 `directive-plan-bonus` 与 `planBonus.textContent = option.planRewardText`，线上 `styles.css` 包含 `directive-plan-bonus`。
- #3 已回复并继续保持 open，等待复测确认按钮层“预案执行 +X”是否让推荐指令更像有明确收益的主动选择。
- 回复后同步 GitHub Issues：2026-04-30 07:14 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T23:14:33Z。

下一步：等待 #3 复测；若仍认为主动玩法不足，再评估短期任务、资源消耗型指令或更明确的指令构筑分支。

## 2026-04-30 Product decision：航线指令预案执行奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 06:54 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的 bug；#3 仍是最近更新的玩法反馈，继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有主动按钮、连携、轮换目标、策略契合、策略终结、指令熟练、熟练续航和满层回响，但按钮推荐本身仍主要是提示。玩家按推荐顺序操作时，系统还缺少一个明确的“我执行了预案”的即时奖励反馈。

本轮决策：

- 新增 `DIRECTIVE_PLAN_BONUS_RATE = 0.06`，当玩家执行的指令位于 `getDirectivePlan.nextDirectiveIds` 推荐预案中时，额外获得有效基础指令收益 6% 的“预案执行”奖励。
- 预计收益、执行反馈和本地 `directive` 事件记录 `planReward` / `planBonusRate`；静态锁定提示同步说明按推荐预案执行有奖励。
- 本轮只调整航线指令推荐预案的即时奖励和提示；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、策略契合、策略终结、指令熟练、满层回响或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 06:54 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 0/3 均衡航线下，推荐的点火齐射预计收益显示“预计 +95 能量 · 预案执行 +5.4”，非推荐的谐振脉冲不获得预案执行奖励。
- 执行推荐点火齐射会返回 `planReward = 5.376`、`planBonusRate = 0.06`，执行提示为“已执行点火齐射，预案执行 +5.4，+95 能量。”。
- 3/3 满层熟练回响续航下，推荐点火齐射同时显示指令熟练、预案执行、航线连携、轮换目标和满层回响。
- `src/app.js` 的本地 `directive` 事件记录 `planReward` 和 `planBonusRate`。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 102 项。
- 构建产物包含 `DIRECTIVE_PLAN_BONUS_RATE`、`planReward`、`planBonusRate`、“预案执行”和“预案执行奖励”。
- 提交 3c1c522 已推送；GitHub Pages workflow 25138264959 已成功，线上地址返回 HTTP 200；线上首页包含“预案执行奖励”，线上 `game.js` 包含 `DIRECTIVE_PLAN_BONUS_RATE`、`planReward` 和“预案执行”，线上 `app.js` 包含 `planReward` / `planBonusRate`。
- #3 已回复并继续保持 open，等待复测确认预案执行奖励是否让推荐指令顺序更有操作确认感。
- 回复后同步 GitHub Issues：2026-04-30 07:01 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T23:01:21Z。

下一步：等待 #3 复测；若仍认为主动玩法不足，再评估短期任务、资源消耗型指令或更明确的指令构筑分支。

## 2026-04-30 Product decision：指令满层回响续航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 06:32 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的玩家复测或 bug；#3 仍指向“玩法太简单、只有点击和自动产能”，本轮进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有主动按钮、连携、轮换目标、策略契合、策略终结、指令熟练和熟练续航，但当指令熟练叠到 3/3 后，继续完成 3/3 轮换只刷新熟练时长。玩家达到满层后缺少继续按完整轮换操作的额外短期目标。

本轮决策：

- 新增 `DIRECTIVE_MASTERY_CAPSTONE_RATE = 0.1`，当指令熟练已满 3/3 且本次指令完成 3/3 轮换时，额外获得有效基础指令收益 10% 的“满层回响”。
- 满层熟练下的完成态推荐从“熟练续航”升级为“回响续航”，冷却中显示“等待回响”。
- 预计收益、执行反馈、本地 `directive` 事件和静态锁定提示都显示满层回响相关信息。
- 本轮只调整航线指令满层续航奖励和提示；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、策略契合、策略终结或指令熟练层数上限。

验收标准：

- GitHub Issues 已同步：2026-04-30 06:32 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 满层指令熟练 3/3 且连携已完成 3/3 时，`getDirectivePlan` 返回“回响续航”和“等待回响”。
- 满层状态下继续执行推荐指令会获得“满层回响 +10.3”示例奖励，执行提示写入满层回响并刷新指令熟练。
- 本地 `directive` 事件记录 `masteryCapstoneReward` 和 `masteryCapstoneRate`。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 102 项。
- 构建产物包含 `DIRECTIVE_MASTERY_CAPSTONE_RATE`、`masteryCapstoneReward`、“回响续航”和“满层回响”。
- GitHub Pages workflow 25137727635 已成功，线上地址返回 HTTP 200；线上首页包含“回响续航”和“满层回响”，线上 `game.js` 包含 `DIRECTIVE_MASTERY_CAPSTONE_RATE`、`masteryCapstoneReward`、“回响续航”和“满层回响”，线上 `app.js` 包含 `masteryCapstoneReward` 和 `masteryCapstoneRate`。
- #3 已回复并继续保持 open，等待复测确认满层回响是否让指令熟练到 3/3 后仍有继续完整轮换的目标和奖励感。
- 回复后同步 GitHub Issues：2026-04-30 06:45 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T22:45:18Z。

下一步：等待 #3 复测；若仍认为主动玩法不足，再评估小型委托、资源消耗型指令或更明确的长期主动分支。

## 2026-04-30 Product decision：星图项目长列表收起

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 06:20 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的 bug 或玩家复测结论；#4 仍是最近更新的视觉密度反馈，继续进入有反馈样本下的 Product decision。

当前最大问题：星图区已经有插画、节点航线、章节视觉导航、章节徽记、默认本章列表、折叠筛选按钮和折叠摘要，但当玩家切到“全部”“未完成”或“远航长尾”时，项目列表仍可能一次性铺开 44 到 57 张卡片。即使非当前航段详情默认折叠，长列表本身仍会形成明显的文字墙。

本轮决策：

- 新增 `getProjectListWindow`，当筛选结果超过 8 段时，只直接显示包含当前航段的 8 段窗口。
- 其余航段收进默认关闭的 `project-list-drawer`，summary 显示已收起数量和当前显示范围。
- 本轮只调整星图项目列表默认展示密度；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、航线指令、反馈入口、筛选定义或章节点击逻辑。

验收标准：

- GitHub Issues 已同步：2026-04-30 06:20 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 作为本轮处理对象。
- 全部 57 段初始视图通过 `getProjectListWindow` 默认显示 8 段、收起 49 段，并保留当前航段可见。
- 远航长尾 44 段默认显示 8 段、收起 36 段；4 段以内的小视图不出现列表抽屉。
- 运行期 `src/app.js` 渲染 `project-list-drawer` 和 `project-list-drawer-grid`；`src/styles.css` 包含默认收起和展开符号样式。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 101 项。
- 构建产物包含 `getProjectListWindow`、`project-list-drawer`、`project-list-drawer-grid` 和“已收起”文案。
- GitHub Pages workflow 25137109823 已成功，线上地址返回 HTTP 200；线上 `game.js` 包含 `getProjectListWindow`、`PROJECT_LIST_PREVIEW_LIMIT` 和“已收起”，线上 `app.js` 包含 `project-list-drawer`，线上 `styles.css` 包含 `project-list-drawer-grid`。
- #4 已回复并继续保持 open，等待复测确认长列表默认只露出 8 段后，全部、未完成或远航长尾视图是否不再像卡片墙。
- 回复后同步 GitHub Issues：2026-04-30 06:28 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T22:28:03Z。

下一步：等待 #4 复测；若长尾列表仍显拥挤，再评估章节内分页或更强的长尾分组导航。

## 2026-04-30 Product decision：星图筛选控件折叠

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 06:08 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的 bug 或玩家复测结论；#4 仍是最近更新的视觉密度反馈，继续进入有反馈样本下的 Product decision。

当前最大问题：星图区已经有插画、节点航线、章节视觉导航、章节徽记、默认本章列表和多处默认折叠，但旧的 15 个星图筛选按钮仍在章节视觉导航下方全部外露。玩家第一眼会同时看到视觉导航、航线策略、筛选按钮和筛选摘要，筛选按钮本身再次形成一块密集文字区。

本轮决策：

- 将 `projectFilterList` 外层改为默认关闭的 `project-filter-controls` 抽屉，首屏只保留“筛选航段”入口。
- 保留原有 15 个筛选按钮、`projectFilter` 状态、章节视觉导航点击切换、筛选摘要和所有筛选逻辑；展开抽屉后仍可直接访问全部筛选。
- 本轮只调整星图筛选控件的默认展示密度；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、航线指令、反馈入口、筛选定义或章节点击逻辑。

验收标准：

- GitHub Issues 已同步：2026-04-30 06:08 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 作为本轮处理对象。
- 静态首页包含默认关闭的 `<details class="project-filter-controls">` 和“筛选航段”，并且不带 `open` 属性。
- `projectFilterList` 仍保留原有筛选按钮容器，运行期 `src/app.js` 不需要重写筛选渲染逻辑。
- `src/styles.css` 包含 `project-filter-controls` 和展开/收起符号样式。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 100 项。
- 构建产物包含 `project-filter-controls`、“筛选航段”和 `project-filter-controls[open]` 样式。
- GitHub Pages workflow 25136621221 已成功，线上地址返回 HTTP 200；线上首页包含 `project-filter-controls`、“筛选航段”和 `project-filter-list`，线上 `styles.css` 包含 `project-filter-controls[open]`。
- #4 已回复并继续保持 open，等待复测确认默认隐藏筛选按钮后是否进一步减少星图区文字按钮密度。
- 回复后同步 GitHub Issues：2026-04-30 06:15 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T22:15:41Z。

下一步：等待 #4 复测；若仍认为星图区文字密度过高，再评估章节分页、长尾分段折叠或更强的章节插图。

## 2026-04-30 Product decision：星图章节视觉徽记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 05:54 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的 bug 或玩家复测结论；#4 仍是最近更新的视觉密度反馈，继续进入有反馈样本下的 Product decision。

当前最大问题：星图已经有插画、节点航线、默认折叠摘要、非当前航段折叠、章节筛选入口和可点击章节视觉导航，但四个章节视觉按钮内部仍使用相同的轨道/核心小图形。玩家能点击章节，却还需要读章节名和下一条目标来区分“首段、专精、基建、远航”四个阶段。

本轮决策：

- 给四个章节补充不同的视觉徽记和短焦点标签：星核点亮、策略校准、基建扩展、远航航线。
- `PROJECT_CHAPTER_DEFS` 作为单一数据源输出 `visualClass` 与 `focusText`，运行期和静态首页都复用这些视觉语义。
- 视觉徽记只改变章节导航的扫视性；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、航线指令、反馈入口、筛选规则或章节点击逻辑。

验收标准：

- GitHub Issues 已同步：2026-04-30 05:54 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 作为本轮处理对象。
- `getProjectChapterVisuals` 返回 `visualClass` 和 `focusText`；远航长尾为 `is-long-tail` 与“远航航线”。
- 运行期章节视觉导航渲染 `project-chapter-emblem` 与 `project-chapter-focus`。
- 静态首页包含 `project-chapter-visual is-long-tail`、`project-chapter-emblem` 和“远航航线”。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 100 项。
- 构建产物包含 `project-chapter-emblem`、`project-chapter-focus`、`is-long-tail`、`visualClass`、`focusText` 和“远航航线”。
- GitHub Pages workflow 25136175855 已成功，线上地址返回 HTTP 200；线上首页、`app.js`、`game.js` 和 `styles.css` 已确认包含章节视觉徽记、焦点标签、数据推导和样式。
- #4 已回复并继续保持 open，等待复测确认章节徽记和焦点标签是否让星图章节导航更像可扫视的视觉入口。
- 回复后同步 GitHub Issues：2026-04-30 06:03 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T22:03:01Z。

下一步：等待 #4 复测；若仍认为星图区文字密度过高，再评估更强的章节插图、章节分页或长尾分段折叠。

## 2026-04-30 Product decision：星图章节视觉导航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 05:39 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的 bug 或玩家复测结论；#4 仍是最近更新的视觉密度反馈，继续进入有反馈样本下的 Product decision。

当前最大问题：星图已经有插画、节点航线、筛选摘要折叠、非当前航段详情折叠、默认本章和四个章节筛选按钮，但“章节”仍主要藏在按钮文字和摘要文字里。玩家看节点航线时，不能直接用更视觉化的章节块判断四个阶段的进度和下一条目标。

本轮决策：

- 在星图视觉航线下新增四个可点击章节视觉按钮：首段星图、专精校准、深空基建、远航长尾。
- 章节视觉按钮显示章节进度、下一条目标和小型进度轨，点击后直接切换到对应章节筛选。
- 章节视觉数据由 `getProjectChapterVisuals` 从现有项目完成状态、`chapterName` 和筛选定义推导。
- 本轮只调整星图导航与视觉呈现；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、航线指令、反馈入口或既有筛选摘要结构。

验收标准：

- GitHub Issues 已同步：2026-04-30 05:39 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 作为本轮处理对象。
- `getProjectChapterVisuals` 返回四个章节的 `filterId`、`progressText`、`status` 和 `nextText`；在 260K 示例状态下，专精校准为 `1/5`、`current`、`下一条 1/5 点火航校`，远航长尾为 `0/44`、`pending`、`下一条 1/44 星门远征`。
- 运行期 `projectChapterMap` 渲染 `project-chapter-tile`，并能通过点击章节视觉按钮切换 `projectFilter` 到对应章节筛选。
- 静态首页包含 `projectChapterMap`、“星图章节视觉导航”和远航长尾下一条目标。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；测试数 100 项。
- 构建产物包含 `projectChapterMap`、`project-chapter-tile`、`getProjectChapterVisuals` 和“下一条 1/44 星门远征”。
- GitHub Pages workflow 25135611407 已成功，线上地址返回 HTTP 200；线上首页、`app.js`、`game.js` 和 `styles.css` 已确认包含章节视觉导航、数据推导和点击切换逻辑。
- #4 已回复并继续保持 open，等待复测确认章节视觉导航是否比只看筛选按钮更容易定位星图阶段，并进一步降低星图区文字密度。
- 回复后同步 GitHub Issues：2026-04-30 05:48 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T21:48:36Z。

下一步：等待 #4 复测；若仍认为文字密度过高，再评估更强的章节插图、章节分页或长尾分段折叠。

## 2026-04-30 Product decision：星图章节筛选入口

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 05:28 CST 同步到 3 个 open feedback issue、0 个 open bug issue。没有新的 bug 或玩家复测结论；#4 仍指向“界面密密麻麻、希望生成图片、更好看”，本轮回到视觉密度问题做 Product decision。

当前最大问题：星图列表已默认进入“本章”，首段星图和专精校准阶段能明显压缩默认列表，但远航长尾本章本身有 44 段；玩家如果想按章节定位，只能依赖筛选摘要里的章节构成和项目卡片徽标，不能直接切到某个章节。

本轮决策：

- 在星图筛选按钮中新增四个章节入口：首段星图、专精校准、深空基建、远航长尾。
- 章节筛选复用现有项目 `chapterName`、筛选摘要、星图高亮和按钮完成数逻辑。
- 首页静态筛选按钮同步加入四个章节入口，保持首屏默认仍为“本章”。
- 本轮只调整星图列表导航和筛选展示；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、项目完成判定、航线策略、航线指令、反馈入口或筛选摘要结构。

验收标准：

- GitHub Issues 已同步：2026-04-30 05:28 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 作为本轮处理对象。
- `filterProjectStatuses` 支持 `chapter-starter-map`、`chapter-mastery`、`chapter-deep-infra` 和 `chapter-long-tail`，其中远航长尾返回 44 段。
- 筛选按钮显示“首段星图 4/4”“专精校准 1/5”“深空基建 0/4”“远航长尾 0/44”等完成进度。
- 远航长尾筛选摘要显示“远航长尾 0/44”、下一条“航段 14/57 · 远航长尾 1/44 星门远征”和终点“航段 57/57 · 远航长尾 44/44 星渊方舟”。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `chapter-long-tail`、“首段星图 0/4”和“远航长尾 0/44”。
- GitHub Pages workflow 25135022545 已成功，线上地址返回 HTTP 200；线上首页包含“首段星图 0/4”“专精校准 0/5”“深空基建 0/4”“远航长尾 0/44”，线上 `game.js` 包含四个章节筛选 id 和 `chapterName` 过滤逻辑。
- #4 已回复并继续保持 open，等待复测确认章节筛选是否让星图列表尤其是远航长尾阶段不再像一次性铺开的文字墙。
- 回复后同步 GitHub Issues：2026-04-30 05:34 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T21:33:52Z。

下一步：等待 #4 复测；若仍认为文字密度过高，再评估章节分页、章节插图或长尾分段折叠。

## 2026-04-30 Product decision：指令熟练续航推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 05:10 CST 同步到 3 个 open feedback issue、0 个 open bug issue。#3 仍是最近更新的玩法反馈，继续指向“玩法太简单、只有点击和自动产能”；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已补充主动按钮、连携、轮换目标、按钮推荐、策略契合、策略终结、指令熟练、收束起手和收束续航，但完成 3/3 后按钮仍回到泛化的“轮换推荐”，玩家不容易把刚获得的 3 分钟指令熟练理解成下一轮应继续利用的短期状态。

本轮决策：

- 完成 3/3 轮换且指令熟练有效时，下一步推荐按钮显示“熟练续航”。
- 完成 3/3 但没有熟练状态时，推荐按钮显示“满轮续航”，避免泛化为普通轮换推荐。
- 指令轮换提示补充“进入熟练续航”，静态锁定文案说明完成轮换后会用熟练续航提示下一步。
- 本轮只调整派生提示和按钮徽标，不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、策略契合、策略终结或指令熟练数值。

验收标准：

- GitHub Issues 已同步：2026-04-30 05:10 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 测试覆盖 3/3 后“熟练续航”计划、按钮推荐和预计收益；构建产物包含“熟练续航”“满轮续航”和静态提示文案。
- GitHub Pages workflow 25134436661 已成功，线上地址返回 HTTP 200；线上首页包含“完成轮换会累积指令熟练，并用熟练续航提示下一步”，线上 `game.js` 包含 `continuationLead`、“熟练续航”和“满轮续航”。
- #3 已回复并继续保持 open，等待复测确认 3/3 后熟练续航是否让航线指令更像连续可规划的主动玩法链。
- 回复后同步 GitHub Issues：2026-04-30 05:20 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T21:20:09Z。

下一步：继续等待 #3 复测；若仍认为主动玩法不足，再评估短期任务、资源消耗型指令或更明确的指令构筑分支。

## 2026-04-30 Product decision：航线指令收束续航推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 04:54 CST 同步到 3 个 open feedback issue、0 个 open bug issue。#3 仍是最近更新的玩法反馈，继续指向“玩法太简单、只有点击和自动产能”；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：上一轮已经把 0/3 起步推荐改为非契合指令，把当前策略契合指令留给 3/3 策略终结。但玩家完成第一步后，1/3 阶段仍会把“另一条非契合指令”和“契合指令”都作为普通轮换推荐；如果第二步提前点掉契合指令，这一轮第三步仍无法触发策略终结。

本轮决策：

- `getDirectivePlan` 在 1/3 且上一指令不是当前策略契合指令时，只推荐另一条非契合指令，把契合指令继续保留给第三步。
- 按钮推荐文案从普通“轮换推荐”改为“收束续航”，冷却中显示“等待续航”。
- 锁定态首页和提示文案补充“第二步继续避开契合指令”。
- 本轮只调整第二步推荐与提示文案；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、策略契合 +10%、策略终结奖励或指令熟练数值。

验收标准：

- GitHub Issues 已同步：2026-04-30 04:54 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 默认均衡航线下，第一步执行点火齐射后，1/3 阶段只推荐巡航回收，谐振脉冲不再被提前标为推荐。
- `getDirectivePlan` 在 1/3 返回 `nextDirectiveIds = ["cruise-cache"]`、`recommendationText = "收束续航"` 和 `waitingRecommendationText = "等待续航"`。
- 1/3 轮换提示包含“继续保留谐振脉冲做 3/3 策略终结”。
- 锁定态首页提示包含“第二步继续避开契合指令”。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `收束续航`、`等待续航`、`第二步继续避开契合指令` 和 `shouldPreserveStanceFinisher`。
- GitHub Pages workflow 25133712571 已成功，线上地址返回 HTTP 200；线上首页包含“第二步继续避开契合指令”，线上 `game.js` 包含 `shouldPreserveStanceFinisher`、“收束续航”和“等待续航”。
- #3 已回复并继续保持 open，等待复测确认第二步收束续航推荐是否让 3/3 策略终结路线更容易按顺序完成。
- 回复后同步 GitHub Issues：2026-04-30 05:04 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T21:03:45Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估短期任务、资源消耗型指令或更明确的指令构筑分支。

## 2026-04-30 Product decision：航线指令收束起手推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 04:37 CST 同步到 3 个 open feedback issue、0 个 open bug issue。#3 仍是最近更新的玩法反馈，继续指向“玩法太简单、只有点击和自动产能”；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有策略契合、策略终结、按钮推荐和指令熟练，但 0/3 起步提示仍让玩家“先执行任意航线指令”。由于策略终结要求第三步收束到当前策略契合指令，如果玩家一开始就按契合指令，反而无法在这一轮 3/3 中拿到策略终结奖励。

本轮决策：

- `getDirectivePlan` 在 0/3 且无有效连携时，根据当前航线策略把契合指令保留为收束指令，优先推荐另外两条指令作为“收束起手”。
- `getDirectiveStatus` 复用计划里的 `recommendationText` / `waitingRecommendationText`，让按钮在起步阶段显示“收束起手”或“等待起手”，连携阶段继续显示“轮换推荐/等待轮换”。
- 锁定态首页和计划提示同步说明“先从非契合指令起手，把契合指令留到 3/3 策略终结”。
- 本轮只调整起手推荐和提示文案；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令基础收益、冷却、连携窗口、轮换目标奖励、策略契合 +10%、策略终结奖励、指令熟练或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 04:37 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 默认均衡航线、0/3 未起步时，点火齐射和巡航回收按钮标记 `recommended: true` 且显示“收束起手”，谐振脉冲保留策略契合但不作为起手推荐。
- `getDirectivePlan` 在 0/3 返回 `nextDirectiveIds = ["ignition-salvo", "cruise-cache"]`、`recommendationText = "收束起手"` 和 `waitingRecommendationText = "等待起手"`。
- 完成上一轮 3/3 后，若两个起手指令仍在冷却，轮换提示显示“等待冷却后执行点火齐射或巡航回收，保留谐振脉冲完成 3/3 策略终结”。
- 锁定态首页提示包含“非契合指令起手”和“3/3 策略终结”。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `收束起手`、`等待起手`、`非契合指令起手`、`recommendationText` 和 `waitingRecommendationText`。
- GitHub Pages workflow 25132973346 已成功，线上地址返回 HTTP 200；线上首页包含“非契合指令起手”和“3/3 策略终结”，线上 `game.js` 包含“收束起手”“等待起手”和 `waitingRecommendationText`，线上 `app.js` 继续渲染 `directive-recommendation`。
- #3 已回复并继续保持 open，等待复测确认 0/3 起步推荐是否让 3/3 策略终结更容易规划和完成。
- 回复后同步 GitHub Issues：2026-04-30 04:48 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T20:47:49Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估资源消耗型指令、短期任务队列或更明确的指令构筑分支。

## 2026-04-30 Product decision：航线指令熟练层

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 04:17 CST 同步到 3 个 open feedback issue、0 个 open bug issue。#3 仍是最近更新的玩法反馈，继续指向“玩法太简单、只有点击和自动产能”；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有冷却、连携、轮换目标、3/3 奖励、按钮推荐、策略契合和策略终结，但完成一次完整轮换后缺少可延续的短期成长状态。玩家完成 3/3 后得到即时奖励，却没有把这次操作沉淀成下一轮指令收益。

本轮决策：

- 新增 `directiveMastery` 存档字段，旧存档自动补齐为 0 层。
- 完成 3/3 指令轮换后获得 3 分钟“指令熟练”，每层让后续指令收益 +5%，最多 3 层；再次完成轮换会叠层或刷新时长。
- 指令预计收益、按钮徽标、执行反馈、本地 `directive` 事件和反馈快照都显示/记录指令熟练。
- 本轮只调整航线指令短期成长；不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令冷却、连携窗口、轮换目标奖励、策略契合 +10%、策略终结奖励数值或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 04:17 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 第三步完成 3/3 轮换后，状态写入 `directiveMastery.stacks = 1` 并提示“指令熟练 +1 层 (1/3)”。
- 指令熟练有效期内，按钮预计收益显示“指令熟练 +5%”，轮换提示显示当前层数、下一次指令加成和剩余时间。
- 指令熟练过期后，预计收益不再显示熟练加成。
- 反馈快照包含“指令熟练：x/3”。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `directiveMastery`、`DIRECTIVE_MASTERY_MAX_STACKS`、`directive-mastery-bonus` 和“指令熟练”。
- GitHub Pages workflow 25132200302 已成功，线上地址返回 HTTP 200；线上 `game.js` 包含 `directiveMastery`、`DIRECTIVE_MASTERY_MAX_STACKS` 和“指令熟练”，线上 `app.js` 包含 `directive-mastery-bonus` 和 `masteryRewardStacks`，线上 `feedback.js` 包含“指令熟练”快照字段。
- #3 已回复并继续保持 open，等待复测确认指令熟练层是否让 3/3 轮换形成连续操作目标。
- 回复后同步 GitHub Issues：2026-04-30 04:31 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T20:31:11Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估资源消耗型指令、短期任务队列或更明确的指令构筑分支。

## 2026-04-30 Product decision：策略终结按钮提示

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 04:03 CST 同步到 3 个 open feedback issue、0 个 open bug issue。#3 仍是最近更新的玩法反馈，继续指向“玩法太简单、只有点击和自动产能”；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已有冷却、连携、轮换目标、3/3 奖励、按钮推荐、策略契合 +10% 和策略终结奖励，但“第三步如果是策略终结”主要体现在预计收益和提示句里。玩家点击按钮时还不能在按钮层直接区分普通轮换推荐和可触发策略终结的收束指令。

本轮决策：

- 在 `getDirectiveStatus` 中新增派生字段 `finisherRecommended` 与 `finisherRecommendationText`。
- 当某个推荐指令会完成 3/3 轮换且可触发策略终结奖励时，按钮额外显示“策略终结”徽标，并增加 `is-finisher-recommended` 状态样式。
- 本轮只调整航线指令按钮可读性；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令冷却、连携窗口、轮换目标奖励、策略契合 +10%、策略终结奖励数值、反馈入口或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 04:03 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 连携 1/3 后，普通下一步指令保持 `recommended: true`，但 `finisherRecommended: false`。
- 连携 2/3 后，能完成 3/3 且匹配当前策略的指令同时标记 `recommended: true`、`finisherRecommended: true` 和 `finisherRecommendationText: "策略终结"`。
- 非策略契合指令即使能完成 3/3，也不显示策略终结徽标。
- 运行期按钮渲染包含 `is-finisher-recommended` 和 `directive-finisher-recommendation`。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `finisherRecommended`、`finisherRecommendationText`、`is-finisher-recommended`、`directive-finisher-recommendation` 和“策略终结”。
- GitHub Pages workflow 25131324928 已成功，线上地址返回 HTTP 200；线上 `game.js` 包含 `finisherRecommended`、`finisherRecommendationText` 和“策略终结”，线上 `app.js` 包含 `is-finisher-recommended` 和 `directive-finisher-recommendation`，线上 `styles.css` 包含对应样式。
- #3 已回复并继续保持 open，等待复测确认按钮层策略终结徽标是否让第三步收束目标更明确。
- 回复后同步 GitHub Issues：2026-04-30 04:12 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T20:11:54Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估资源消耗型指令、短期任务队列或更明确的指令构筑分支。

## 2026-04-30 Product decision：航线策略终结奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 03:45 CST 同步到 3 个 open feedback issue、0 个 open bug issue。#3 仍是更新时间最新的玩法反馈，核心问题仍是“玩法太简单、只有点击和自动产能”；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有冷却、连携、轮换目标、3/3 奖励、按钮推荐和策略契合 +10%，但 3/3 轮换的收束顺序仍可以随意完成。当前航线策略还没有把“第三步应该用哪个指令收束”变成明确目标。

本轮决策：

- 新增 `DIRECTIVE_STANCE_FINISHER_RATE = 0.12`，完成 3/3 轮换且本次指令匹配当前航线策略时，额外获得基础指令收益 12% 的“策略终结”奖励。
- 指令预计收益、执行反馈、轮换目标提示和本地 `directive` 事件记录 `stanceFinisherReward`，让玩家看到“把轮换收束到契合指令”的收益。
- 本轮只调整航线指令短期目标；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令冷却、连携窗口、轮换目标奖励、策略契合 +10%、反馈入口或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 03:45 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 默认均衡航线下，以谐振脉冲完成第三步轮换时，预计收益同时显示“航线连携 +24%”“轮换目标 +2.8”“策略终结 +1.9”和“策略契合 +10%”，总预计收益为 26.6。
- 非契合指令完成第三步轮换时仍获得轮换目标奖励，但 `stanceFinisherReward` 为 0。
- 本地 `directive` 事件记录 `stanceFinisherReward`。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `DIRECTIVE_STANCE_FINISHER_RATE`、`stanceFinisherReward`、“策略终结”和“完成 3/3 并收束”。
- GitHub Pages workflow 25130644996 已成功，线上地址返回 HTTP 200；线上首页包含“完成 3/3 并收束到契合指令可获得策略终结奖励”，线上 `game.js` 包含 `DIRECTIVE_STANCE_FINISHER_RATE`、`stanceFinisherReward` 和“策略终结”，线上 `app.js` 包含 `stanceFinisherReward`。
- #3 已回复并继续保持 open，等待复测确认策略终结奖励是否让航线指令更像需要规划顺序的主动玩法。
- 回复后同步 GitHub Issues：2026-04-30 03:57 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T19:57:07Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估资源消耗型指令或独立短期任务队列。

## 2026-04-30 Product decision：航线策略契合指令

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 2026-04-30 03:26 CST 同步到 3 个 open feedback issue、0 个 open bug issue。#3 更新时间晚于 #4，且仍指向“玩法太简单、只有点击和自动产能”；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令已经有冷却、连携、轮换目标、3/3 奖励和按钮推荐，但航线策略仍主要是被动倍率选择。策略选择和主动指令之间缺少直接收益关系，玩家还没有理由基于当前策略决定优先按哪个指令。

本轮决策：

- 三个航线策略各绑定一个契合指令：均衡航线 -> 谐振脉冲，点火优先 -> 点火齐射，巡航优先 -> 巡航回收。
- 匹配当前航线策略的指令获得 `DIRECTIVE_STANCE_BONUS_RATE = 0.1` 的策略契合加成，按指令本次总收益额外增加 10%。
- 指令预计收益、执行反馈、按钮徽标和本地 `directive` 事件记录 `stanceBonus` / `stanceBonusRate`。
- 本轮只打通航线策略和航线指令；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、指令冷却、连携窗口、轮换目标奖励、反馈入口或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 03:26 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 默认均衡航线下，谐振脉冲显示 `策略契合 +10%`，预计收益从 15.7 提升到 17.2。
- 完成 3/3 轮换并使用均衡契合的谐振脉冲时，预计收益同时包含“航线连携 +24%”“轮换目标 +2.8”和“策略契合 +10%”。
- 运行期按钮渲染包含 `directive-badges` 和 `directive-stance-bonus`，本地 `directive` 事件记录 `stanceBonus` 与 `stanceBonusRate`。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 浏览器级检查已通过：本地解锁状态下谐振脉冲按钮真实渲染“策略契合 +10%”徽标。
- 构建产物包含 `DIRECTIVE_STANCE_BONUS_RATE`、`stanceBonus`、`directive-stance-bonus` 和“策略契合”。
- GitHub Pages workflow 25129867365 已成功，线上地址返回 HTTP 200；线上首页包含“策略契合加成”，线上 `game.js` 包含 `DIRECTIVE_STANCE_BONUS_RATE`、`stanceBonus` 和“策略契合”，线上 `app.js` 包含 `directive-stance-bonus`，线上 `styles.css` 包含 `directive-badges` 和 `directive-stance-bonus`。
- #3 已回复并继续保持 open，等待复测确认航线策略直接影响主动指令收益后是否更有主动选择感。
- 回复后同步 GitHub Issues：2026-04-30 03:39 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T19:39:38Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估短期任务、资源消耗型指令或更明确的指令构筑分支。

## 2026-04-30 Product decision：航线指令按钮轮换推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 已连续处理视觉密度，#3 仍指向“玩法太简单、只有点击和自动产能”，上一轮已给 3/3 指令轮换补明确奖励，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：指令轮换目标已经在提示行里说明“下一步切换到哪些指令”，但玩家实际点击时仍要把提示文字映射到三个按钮。主动玩法的下一步建议还没有落到可操作控件本身。

本轮决策：

- `getDirectiveStatus` 复用 `getDirectivePlan` 的 `nextDirectiveIds`，给推荐的下一条不同指令增加 `recommended` 和 `recommendationText`。
- 运行期指令按钮增加 `is-recommended` 和 `directive-recommendation` 标记，可执行时显示“轮换推荐”，仍在冷却时显示“等待轮换”。
- 本轮只调整航线指令按钮可读性和静态测试；不新增存档字段，不改变升级价格、产能公式、星图 57 段路线、项目奖励、航线策略、指令基础收益、冷却、连携窗口、轮换目标奖励或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 03:16 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 连携 1/3 后，两个不同且可执行的指令按钮会标记 `recommended: true` 和 `recommendationText: "轮换推荐"`。
- 连携 2/3 后，下一条可触发 3/3 奖励的指令按钮会标记 `recommended: true` 和 `recommendationText: "轮换推荐"`。
- 运行期按钮渲染包含 `is-recommended`、`directive-head` 和 `directive-recommendation`。
- 静态测试覆盖按钮推荐态渲染和样式。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `is-recommended`、`directive-recommendation`、`recommendationText` 和“轮换推荐”。
- GitHub Pages workflow 25129029268 已成功，线上地址返回 HTTP 200；线上 `app.js` 包含 `is-recommended`、`directive-recommendation` 和 `recommendationText`，线上 `game.js` 包含“轮换推荐/等待轮换”，线上 `styles.css` 包含 `.directive-button.is-recommended` 和 `.directive-recommendation`。
- #3 已回复并继续保持 open，等待复测确认按钮层推荐是否让指令轮换更容易执行。
- 回复后同步 GitHub Issues：2026-04-30 03:21 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T19:21:28Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估轻量任务队列或指令消耗型分支。

## 2026-04-30 Product decision：星图列表默认本章筛选

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#3 刚完成航线指令、连携、轮换目标和 3/3 奖励，尚无复测结论；#4 仍指向“界面全是密密麻麻的文字、希望生成一些图片”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：星图区已经有插画、视觉航线、筛选摘要折叠、项目图标和非当前航段详情折叠，但默认仍选中“全部”，首次进入星图列表时会一次性出现 57 张项目卡片。即使卡片详情已经折叠，长列表本身仍会造成文字密度和滚动压力。

本轮决策：

- 新增运行期初始筛选常量 `INITIAL_PROJECT_FILTER_ID = "current-chapter"`，让星图项目列表默认进入“本章”视图。
- 静态首页同步把筛选按钮、星图视觉高亮和筛选摘要改为本章 4 段，玩家仍可一键切回“全部 0/57”查看完整星图。
- 本轮只调整默认展示范围；不改变存档、升级价格、产能公式、星图 57 段路线、项目奖励、筛选规则、航线策略、航线指令或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 02:55 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- 运行期 `projectFilter` 使用 `INITIAL_PROJECT_FILTER_ID`，默认值为 `current-chapter`。
- 静态首页默认高亮“本章 0/4”，星图视觉显示“高亮：本章 4 段”，筛选摘要显示“本章 0/4”和终点“航段 4/57 · 首段星图 4/4 采集阵列”。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `INITIAL_PROJECT_FILTER_ID`、`let projectFilter = INITIAL_PROJECT_FILTER_ID`、“高亮：本章 4 段”、“筛选摘要：本章 0/4”和“终点 航段 4/57”。
- GitHub Pages workflow 25128378775 已成功，线上地址返回 HTTP 200；线上首页包含“高亮：本章 4 段”“筛选摘要：本章 0/4”和“终点 航段 4/57”，线上脚本包含 `INITIAL_PROJECT_FILTER_ID` 和 `let projectFilter = INITIAL_PROJECT_FILTER_ID`。
- #4 已回复并继续保持 open，等待复测确认默认本章筛选是否降低 57 段星图项目列表的文字密度。
- 回复后同步 GitHub Issues：2026-04-30 03:07 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T19:07:02Z。

下一步：观察 #4 复测结论；若仍认为星图列表密度高，再评估章节分页或只在列表默认显示当前航段。

## 2026-04-30 Product decision：航线轮换目标奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 已连续处理视觉密度，#3 仍指向“玩法太简单、只有点击和自动产能”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令、90 秒航线连携和“指令轮换”目标提示已经让玩家知道下一步该切换哪个指令，但完成 3/3 轮换时只体现为 +24% 收益，没有独立的完成奖励。短期目标的“收束感”仍偏弱。

本轮决策：

- 完成 3/3 指令轮换时，在既有 +24% 航线连携之外，额外获得一次“轮换目标奖励”，数值为该指令基础收益的 18%。
- 预计收益、执行反馈和本地 `directive` 事件都显示/记录 `rotationReward`，让玩家能看到完成 3/3 带来的额外收益。
- 本轮只调整航线指令收益收束、展示文案和本地事件；不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、航线策略、指令基础收益、冷却、反馈入口或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 02:37 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- `DIRECTIVE_ROTATION_REWARD_RATE` 固定为 0.18，只在 `chain.stacks >= DIRECTIVE_CHAIN_MAX_STACKS` 时生效。
- 第三步轮换的预计收益包含“航线连携 +24%”和“轮换目标 +N”，执行反馈包含同样的奖励说明。
- 本地 `directive` 事件记录 `rotationReward`。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `DIRECTIVE_ROTATION_REWARD_RATE`、`rotationReward`、“轮换目标”和“完成 3/3”。
- GitHub Pages workflow 25127536220 已成功，线上地址返回 HTTP 200；线上首页包含“完成 3/3 获得轮换目标奖励”，线上 `app.js` 包含 `rotationReward`，线上 `game.js` 包含 `DIRECTIVE_ROTATION_REWARD_RATE` 和“轮换目标”。
- #3 已回复并继续保持 open，等待复测确认 3/3 轮换目标奖励是否让航线指令更像有完成回报的短期主动玩法。
- 回复后同步 GitHub Issues：2026-04-30 02:49 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T18:49:07Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估短期任务列表或资源消耗型指令分支。

## 2026-04-30 Product decision：星图项目详情折叠

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 仍指向“界面全是密密麻麻的文字、希望生成一些图片”，上一轮已折叠筛选长摘要，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：星图区已有插画、视觉航线、明细折叠、筛选摘要折叠和项目卡片图标，但 57 段项目列表仍默认展示每张卡片的说明、进度、奖励和进度条。玩家切到全部、未完成或奖励类型视图时，列表仍会形成连续长文本块。

本轮决策：

- 当前航段保持完整展开，继续直接显示说明、进度、奖励和进度条，保证下一步操作不被隐藏。
- 非当前航段默认只展示标题、图标、航段、章节、推进/奖励标签和状态，完整说明、进度、奖励和进度条收进 `project-card-drawer`。
- 本轮只调整运行期 DOM、样式和静态测试；不改变存档、升级价格、产能公式、星图 57 段路线、项目奖励、筛选规则、航线策略、航线指令或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 02:22 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- 星图项目运行期包含 `project-card-drawer`、`project-card-detail-grid` 和 `renderProjectDetailNodes`。
- `project.isCurrent` 项目保持详情展开，非当前项目使用默认不带 `open` 的 `details` 折叠航段详情。
- 静态测试覆盖非当前航段详情折叠结构和样式。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- 构建产物包含 `project-card-drawer`、`project-card-detail-grid`、`renderProjectDetailNodes` 和“航段详情”。
- GitHub Pages workflow 25126720795 已成功，线上地址返回 HTTP 200；线上 `app.js` 包含 `project-card-drawer`、`project-card-detail-grid`、`renderProjectDetailNodes` 和“航段详情”，线上 `styles.css` 包含 `project-card-drawer` 和 `project-card-detail-grid`。
- #4 已回复并继续保持 open，等待复测确认非当前航段详情默认折叠是否降低星图项目列表文字密度。
- 回复后同步 GitHub Issues：2026-04-30 02:31 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T18:31:35Z。

下一步：观察 #4 复测结论；若仍认为列表密度高，再评估按章节分页或只默认显示当前章节。

## 2026-04-30 Product decision：星图筛选摘要折叠

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 仍指向“界面全是密密麻麻的文字、希望生成一些图片”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：星图总览明细已经默认折叠，项目卡片也已补图标，但筛选区仍默认展示一整段长摘要，包含完成率、状态构成、奖励构成、推进构成、章节构成、待领取奖励、下一条、后续和终点。它保留了完整信息，但第一眼仍会形成一块高密度文字。

本轮决策：

- 新增 `getProjectFilterBrief`，把当前筛选视图压缩成一行“筛选摘要”：筛选名、完成数、下一条航段和剩余段数。
- 将原完整 `getProjectFilterSummary` 放入默认折叠的 `project-filter-drawer`，保留详细信息但不再默认铺开。
- 本轮只调整筛选摘要展示结构和静态测试；不改变存档、升级价格、产能公式、星图 57 段路线、项目奖励、筛选规则、航线策略、航线指令或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 02:08 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- 静态首页包含 `project-filter-drawer` 和 `projectFilterSummaryBrief`，且筛选详情默认不带 `open`。
- `getProjectFilterBrief` 覆盖本章视图和空视图，完整筛选摘要仍由 `getProjectFilterSummary` 保留。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- GitHub Pages workflow 25126003982 已成功，线上地址返回 HTTP 200；线上首页包含 `project-filter-drawer`、`projectFilterSummaryBrief` 和“筛选摘要：全部 0/57”，线上 `game.js` 包含 `getProjectFilterBrief`，线上 `app.js` 包含 `projectFilterSummaryBrief`，线上 `styles.css` 包含 `project-filter-drawer`。
- #4 已回复并继续保持 open，等待复测确认筛选摘要默认折叠是否降低星图区文字密度。
- 回复后同步 GitHub Issues：2026-04-30 02:16 CST 当前仍为 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T18:16:06Z。

下一步：观察 #4 复测结论；若仍认为文字密度高，再评估项目列表默认收起非当前航段或进一步提升视觉资产占比。

## 2026-04-30 Product decision：航线指令轮换目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 已连续处理视觉密度，#3 仍指向“玩法太简单、只有点击和自动产能”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：航线指令和 90 秒航线连携已经让中后段不只剩点击与等待，但玩家仍需要从三个按钮的收益和冷却中自行推断“现在处于连携第几步、下一步应该换哪个指令”。这会削弱主动玩法的可读性。

本轮决策：

- 在航线指令下方新增“指令轮换”目标提示。
- 锁定时提示 100K 解锁；解锁后显示 0/3 起步目标；连携窗口内显示当前指令、轮换进度、窗口时间、下一步建议和预计连携加成。
- 本轮只新增派生展示和静态测试；不新增存档字段，不改变升级价格、星图 57 段路线、项目奖励、航线策略、指令基础收益、冷却或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 01:50 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- `getDirectiveStatus` 返回 `plan`，`getDirectivePlan` 覆盖锁定、起步、轮换进度和下一步建议。
- 静态首页包含 `directivePlan` 和 `directive-plan` 样式。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过。
- GitHub Pages workflow 25125372756 已成功，线上地址返回 HTTP 200；线上首页、`game.js`、`app.js` 和 `styles.css` 均包含指令轮换目标相关内容。
- #3 已回复并继续保持 open，等待复测确认指令轮换目标是否让三个航线指令更像可规划的短期操作链。
- 回复后同步 GitHub Issues：2026-04-30 02:02 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T18:02:20Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再评估短期任务、资源消耗型指令或更明确的指令构筑分支。

## 2026-04-30 Product decision：星图项目卡片图标化

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 仍是最新反馈主题，指向“密密麻麻的文字”和“生成一些图片”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：星图区已有视觉航线、插画和默认折叠明细，升级面板也已经图标化，但星图项目列表仍主要依赖航段、章节、推进、奖励和状态文字标签。57 段列表在筛选后仍需要玩家阅读“累计航段/升级航段”和“总产能/点击/自动/过载奖励”来判断卡片性质。

本轮决策：

- 为星图项目卡片新增两个固定尺寸内联 SVG 图标：一个表示推进方式（累计航段或升级航段），一个表示奖励方向（总产能、点击、自动或过载）。
- 图标放在项目标题前，与项目名称同层，保留原有文字标签用于可读性和可访问性。
- 本轮只调整运行期 DOM、样式和静态测试；不改变存档、升级价格、产能公式、星图 57 段路线、项目奖励、筛选规则、航线策略、航线指令或反馈入口。

验收标准：

- GitHub Issues 已同步：2026-04-30 01:35 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- 星图项目运行期包含 `PROJECT_CARD_ICON_DEFS`、`project-card-icons`、`project-card-icon-track` 和 `project-card-icon-reward`。
- 图标具备可访问标签：累计航段图标、升级航段图标、总产能奖励图标、点击奖励图标、自动奖励图标和过载奖励图标。
- 静态测试覆盖 `src/app.js` 项目卡片图标定义和 `src/styles.css` 图标样式。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过；构建产物包含 `PROJECT_CARD_ICON_DEFS`、`project-card-icons`、`project-card-icon`、`累计航段图标` 和 `过载奖励图标`。
- GitHub Pages workflow 25124547651 已成功，线上地址返回 HTTP 200；线上 `app.js` 包含 `PROJECT_CARD_ICON_DEFS`、`project-card-icons`、`累计航段图标` 和 `过载奖励图标`，线上 `styles.css` 包含 `project-card-icon-track`、`project-card-icon-reward` 和 `project-card-icon-overload`。
- #4 已回复并继续保持 open，等待复测确认星图项目卡片图标是否改善 57 段列表扫视感。
- 回复后同步 GitHub Issues：2026-04-30 01:45 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T17:44:51Z。

下一步：观察 #4 复测结论；若仍认为视觉不足，再评估章节级插图或项目列表默认折叠策略。

## 2026-04-30 Product decision：升级卡片图标化

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 已处理星图视觉航线、星图插画、星图明细折叠和主操作区工坊插画，但没有新的复测结论；本轮继续进入有反馈样本下的 Product decision。

当前最大问题：#4 的核心是“界面全是密密麻麻的文字、希望生成图片”。上一轮已经覆盖星图区和主操作区的大画面，但升级面板仍由四张文字卡片组成，玩家需要阅读名称、说明、等级、成本和状态来区分点击、自动、总产能和过载四条成长线。

本轮决策：

- 为四个升级卡片新增固定尺寸内联 SVG 图标：聚能透镜、自动采集臂、星核稳定器和星核谐振器分别使用不同图形与配色。
- 图标放入卡片头部，与升级名称和“目标推荐”标记同层，提升扫视识别，不引入远端图片依赖或新资源管线。
- 本轮只调整运行期 DOM、样式和静态测试；不改变存档、升级价格、产能公式、星图 57 段路线、航线策略、航线指令、反馈入口或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 01:20 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- 升级卡片运行期包含 `upgrade-card-head`、`upgrade-icon`、`upgrade-icon-lens`、`upgrade-icon-collector`、`upgrade-icon-stabilizer` 和 `upgrade-icon-resonator`。
- 图标具备可访问标签：聚能透镜图标、自动采集臂图标、星核稳定器图标和星核谐振器图标。
- 静态测试覆盖 `src/app.js` 图标定义和 `src/styles.css` 图标样式。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 通过；构建产物包含 `UPGRADE_ICON_DEFS`、`upgrade-icon`、`聚能透镜图标` 和 `星核谐振器图标`。
- GitHub Pages workflow 25123861697 已成功，线上地址返回 HTTP 200；线上 `app.js` 包含 `UPGRADE_ICON_DEFS`、`upgrade-icon`、`聚能透镜图标` 和 `星核谐振器图标`，线上 `styles.css` 包含 `upgrade-card-head`、`upgrade-icon` 和 `upgrade-icon-resonator`。
- #4 已回复并继续保持 open，等待复测确认升级面板图标是否改善右侧卡片的扫视感。
- 回复后同步 GitHub Issues：2026-04-30 01:30 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T17:30:10Z。

下一步：观察 #4 复测结论；若仍认为视觉不足，再评估项目卡片图标化或章节级插图。

## 2026-04-30 Product decision：主操作区工坊插画

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue、0 个 open bug issue。#4 已连续处理星图视觉航线、星图插画和星图明细折叠，但反馈主题仍是“界面全是密密麻麻的文字、希望生成图片”，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：前几轮视觉改动都集中在星图区域，主操作区仍主要由目标条、提示、点火按钮、连击状态和航线指令文字构成。继续只折叠星图文本会边际递减，玩家进入页面时的主要操作区域仍缺少“工坊正在运行”的画面信号。

本轮决策：

- 在主操作区新增项目内 SVG 工坊插画资产 `src/assets/workshop-visual.svg`。
- 插画表现星核、聚能透镜、自动采集臂、稳定器和谐振环，补足点火主循环的第一眼画面。
- 静态首页通过 `.workshop-scene-image` 引用本地资产，随现有 `src/` 构建进入 `dist/`。
- 本轮只调整视觉呈现和静态测试；不改变存档、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令、反馈入口或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 01:07 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- 静态首页包含 `workshop-scene-image`、`src/assets/workshop-visual.svg` 和工坊插画 alt 文案。
- 测试覆盖首页、样式和 SVG 资产引用链路。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 通过；构建产物包含 `workshop-scene-image`、`workshop-visual.svg`、“星核工坊主操作插画”和 `energyBeam`。
- GitHub Pages workflow 25123181571 已成功，线上地址返回 HTTP 200；线上首页包含 `workshop-scene-image` 和 `workshop-visual.svg`，线上样式包含 `workshop-scene-image`，线上 SVG 包含“星核工坊主操作插画”和 `energyBeam`。
- #4 已回复并继续保持 open，等待复测确认主操作区工坊插画是否改善第一眼视觉观感。
- 回复后同步 GitHub Issues：2026-04-30 01:15 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#4 更新时间为 2026-04-29T17:15:21Z。

下一步：观察 #4 复测结论；若仍认为画面不足，再评估章节级插图或升级卡片图标化。

## 2026-04-30 Product decision：航线连携

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue，0 个 open bug issue。#4 已连续处理视觉密度，#3 仍围绕“玩法太简单、只有点击和自动产能”保持 open，本轮进入有反馈样本下的 Product decision。

当前最大问题：上一轮为 #3 新增了点火齐射、巡航回收和谐振脉冲，但三个指令仍主要是独立冷却按钮。玩家可以看到更多主动按钮，却缺少“先用哪个、接下来切到哪个”的短期决策。

本轮决策：

- 100K 后航线指令新增“航线连携”：90 秒内轮换到不同指令时获得连携加成。
- 第一次轮换加成 +12%，再次轮换封顶 +24%；重复同一指令或超过 90 秒会重置连携。
- 指令预计收益和执行提示直接显示连携加成，本地 `directive` 事件记录连携层数与倍率。
- 旧存档由 `normalizeState` 自动补齐 `directiveChain`；本轮不改变升级价格、星图 57 段路线、项目奖励、航线策略、指令基础冷却或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 00:53 CST 查询到 3 个 open issue、3 个 open feedback issue、0 个 open bug issue；#3 作为本轮处理对象。
- 测试覆盖航线连携预计收益、执行收益、+12%/+24% 层数和 90 秒超时重置。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 通过，构建产物包含 `DIRECTIVE_CHAIN_WINDOW_SECONDS`、`directiveChain` 和“航线连携”。
- GitHub Pages workflow 25122478541 已成功，线上地址返回 HTTP 200；线上脚本包含 `DIRECTIVE_CHAIN_WINDOW_SECONDS`、`directiveChain`、`chainMultiplier`、`chainStacks` 和“航线连携”。
- #3 已回复并继续保持 open，等待复测确认轮换指令是否比独立冷却按钮更有主动规划感。
- 回复后同步 GitHub Issues：2026-04-30 01:01 CST 查询到 3 个 open feedback issue、0 个 open bug issue；#3 更新时间为 2026-04-29T17:00:51Z。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再考虑短期任务或资源消耗型指令分支。

## 2026-04-30 Product decision：星图明细折叠

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue，0 个 open bug issue。#4 已上线节点航线和星图插画，但仍围绕界面文字密度保持 open，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：星图插画改善了第一眼画面，但星图总览仍默认展示目标分轨、阶段导航、章节目标、章节奖励、奖励进度、奖励目标、里程碑、航线焦点、航线构成和生效加成等长文本。继续加图片会增加视觉资源，删除信息又会损失玩家追踪 57 段星图的能力。

本轮决策：

- 星图总览主视图只保留星图进度、当前进度、行动建议和航线预告。
- 将目标分轨、阶段导航、章节目标、章节奖励、奖励进度、奖励目标、里程碑、航线焦点、航线构成和生效加成移动到默认折叠的“星图明细”。
- 本轮只调整 HTML 结构、样式和静态测试；不改变存档、升级价格、星图 57 段路线、项目奖励、航线策略、航线指令或筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 00:36 CST 查询到 3 个 open issue、3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- 静态首页包含 `project-detail-drawer`、`project-detail-grid` 和“星图明细”，且详情区默认不带 `open` 属性。
- 测试覆盖首页默认折叠星图详细文本和样式类。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 通过，构建产物包含 `project-detail-drawer`、`project-detail-grid` 和“星图明细”。
- GitHub Pages workflow 25121814199 已成功，线上地址返回 HTTP 200；线上首页和样式均包含星图明细折叠相关内容。
- #4 已回复并保持 open，等待复测确认默认折叠星图明细是否降低星图区第一眼文字压力。

下一步：观察 #4 复测结论；若仍认为文字压力大，再评估筛选摘要或项目列表的默认折叠策略。

## 2026-04-30 Product decision：星图插画资产

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue，0 个 open bug issue。#3 和 #4 已各自完成第一轮回复，但 #4 明确要求“生成一些图片”，上一轮只新增节点化视觉航线，本轮继续进入有反馈样本下的 Product decision。

当前最大问题：#4 的核心不是缺少更多星图文字，而是星图区信息密度过高、缺少可直接感知的画面。继续增加筛选摘要或项目文案会放大“密密麻麻”的问题；直接引入远端图片依赖又会增加静态部署和可维护性风险。

本轮决策：

- 在星图视觉航线前新增项目内 SVG 星域插画资产 `src/assets/star-map-visual.svg`。
- 插画表现星核、航线节点、远航星门和深空航迹，作为可见图片先降低星图区纯文字占比。
- 资产随 `src/` 一起进入构建产物，不依赖远端图片、第三方 CDN 或新存档字段。
- 本轮只调整视觉呈现和静态资源；不改变升级价格、星图 57 段路线、项目完成判定、项目奖励、航线策略、航线指令和筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-30 00:23 CST 查询到 3 个 open issue、3 个 open feedback issue、0 个 open bug issue；#4 继续作为视觉密度跟进对象。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 通过。
- 静态首页包含 `project-scene-image`、`src/assets/star-map-visual.svg` 和星图插画 alt 文案。
- 样式包含 `.project-scene-image`，构建产物包含 `dist/src/assets/star-map-visual.svg`。
- 测试覆盖首页、样式和 SVG 资产引用链路。
- GitHub Pages workflow 25121080696 已成功，线上地址返回 HTTP 200，线上首页、样式和 SVG 资源均包含星图插画相关内容。
- #4 已回复并保持 open，等待复测确认插画资产是否比只有节点和文字更接近“生成一些图片、界面更好看”的诉求。

下一步：观察 #4 复测结论；若仍认为视觉不足，再考虑按章节或关键航段补充更具体的插图资产。

## 2026-04-29 Product decision：航线指令主动玩法

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue，0 个 open bug issue。#4 已在上一轮处理并回复，本轮转向尚未回复的 #3，进入有反馈样本下的 Product decision。

当前最大问题：#3 指出“游戏玩法太简单了，不够丰富，就只有点击和自动产能这样的东西”。现有星图已经提供长线目标、筛选、视觉航线和航线策略，但玩家在主循环里仍主要是点火、等待自动产能、购买升级；继续追加星图文字或第 58 段不能直接解决主动操作单薄。

本轮决策：

- 100K 后新增“航线指令”，让中后段玩家在点火和等待之外多一个主动选择层。
- 首批提供 3 个带冷却的即时指令：点火齐射、巡航回收、谐振脉冲，分别对应点击、自动和过载收益。
- 指令只保存各自上次使用时间戳，旧存档由 `normalizeState` 自动补齐默认冷却字段。
- 指令只增加即时能量与本地 `directive` 事件；不改变升级价格、星图 57 段路线、项目完成判定、项目奖励、航线策略和筛选规则。

验收标准：

- GitHub Issues 已同步：2026-04-29 23:30 CST 查询到 3 个 open issue、3 个 open feedback issue、0 个 open bug issue；#3 为本轮处理对象。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 通过。
- 静态首页包含 `directiveList`、“点火齐射”“巡航回收”“谐振脉冲”和“累计 100K 能量后解锁航线指令”。
- 测试覆盖航线指令 100K 解锁、预计收益、即时收益和冷却阻挡。
- GitHub Pages workflow 25118696821 已成功，线上地址返回 HTTP 200，线上首页、脚本和样式均包含航线指令相关内容。
- #3 已回复并保持 open，等待复测确认航线指令是否缓解中后段玩法单薄。

下一步：观察 #3 复测结论；若仍认为主动玩法不足，再考虑把航线指令扩展成可组合的短期任务或资源消耗型分支。

## 2026-04-29 Product decision：星图视觉航线

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前有 3 个 open feedback issue，0 个 open bug issue。本轮优先处理 #4 的视觉密度反馈，进入有反馈样本下的 Product decision。

当前最大问题：#4 指出界面“全是密密麻麻的文字”，并希望生成图片。现有星图已经有 57 段、筛选摘要、章节、奖励和后续预告，但这些信息主要以文本呈现；继续追加说明会直接放大 #4 反馈的问题。

本轮决策：

- 新增“星图视觉航线”，把 57 段显示为已完成、当前和待推进节点。
- 视觉航线随当前星图筛选高亮命中航段，让玩家不用先读完整筛选摘要也能看到当前视图覆盖范围。
- 保持节点为代码原生 UI，不引入外部图片依赖；本轮先解决可扫视结构，后续再评估是否补充位图氛围资产。
- 同步修复 `ops/collect-feedback.sh`：改用 `gh api --method GET` 读取 Issues，避免当前 token 下默认 `gh issue list` 触发 GraphQL 401。
- 不改变存档字段、星图完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 23:18 CST 查询到 3 个 open issue、3 个 open feedback issue、0 个 open bug issue；#4 为本轮处理对象，#3 留到后续玩法分支。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，新增测试覆盖星图视觉图的 57 个节点、当前节点和当前筛选高亮。
- 静态首页包含 `projectMapSummary`、`projectMapTrack` 和“星图视觉 0/57 · 当前 航段 1/57 · 首段星图 1/4 点亮星图”。
- 运行期渲染会生成 `project-map-node`，并按 `is-complete`、`is-current`、`is-pending` 和 `is-dimmed` 区分状态与筛选高亮。
- GitHub Pages workflow 25117381991 已成功，线上地址返回 HTTP 200，线上首页、脚本和样式均包含星图视觉航线相关内容。
- #4 已回复并保持 open，等待复测确认星图视觉航线是否缓解星图区纯文字密度。

下一步：优先评估 #3 的主动玩法分支；若 #4 复测仍认为视觉不足，再基于现有星图视觉结构补充位图氛围资产或章节插图。

## 2026-04-29 Product decision：星图筛选航段章节位置

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已让筛选摘要显示章节构成，但摘要里的下一条、后续和终点仍只显示全局航段号，玩家想判断这些目标分别落在章节内第几段时，仍需要和章节构成或项目列表做二次对照。

本轮决策：

- 不追加第 58 段，先让筛选摘要里的下一条、后续和终点航段统一显示“航段 N/57 · 章节 X/Y 名称”。
- 复用项目状态已有的 `segmentText` 和 `chapterText`，避免新增存档字段或重复维护章节映射。
- 覆盖全部、本章、升级、奖励类型、未完成等仍有下一条/后续/终点的筛选视图；已完成和空筛选保持原有行为。
- 不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 22:39 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前和已完成筛选摘要。
- 静态首页初始筛选摘要已包含“下一条 航段 1/57 · 首段星图 1/4 点亮星图”“后续 航段 2/57 · 首段星图 2/4 谐振校准”和“终点 航段 57/57 · 远航长尾 44/44 星渊方舟”。
- 构建产物已包含 `formatProjectFilterProjectLabel`、“下一条 航段 1/57 · 首段星图 1/4 点亮星图”和“终点 航段 57/57 · 远航长尾 44/44 星渊方舟”。
- GitHub Pages workflow 25115992745 已成功，线上地址返回 HTTP 200，线上首页包含“下一条 航段 1/57 · 首段星图 1/4 点亮星图”和“终点 航段 57/57 · 远航长尾 44/44 星渊方舟”，线上脚本包含 `formatProjectFilterProjectLabel`。
- #2 已回复并保持 open，等待复测确认章节位置是否降低 57 段星图在筛选摘要里的定位成本。
- 回复后重新同步 GitHub Issues：2026-04-29 22:51 CST 查询到 3 个 open issue、3 个 open feedback issue、0 个 open bug issue；新增 #3 指向玩法太简单，新增 #4 指向界面文字密度过高并希望生成图片。

下一步：下一轮优先评估 #4 的视觉资产和信息密度问题；若继续处理玩法系统，则以 #3 的“只有点击和自动产能”作为主动玩法分支的依据。

## 2026-04-29 Product decision：星图筛选章节构成

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已让筛选摘要显示状态构成，但玩家切到全部、升级、奖励类型、未完成或已完成视图后，仍需要从航段名称和章节徽标里判断这组内容集中在哪些阶段。

本轮决策：

- 不追加第 58 段，先让星图筛选摘要显示当前视图的章节构成。
- 章节构成按现有首段星图、专精校准、深空基建、远航长尾顺序统计当前筛选视图中各章节航段数。
- 空筛选仍只显示没有匹配航段；当前、已完成、升级、奖励类型等筛选只显示命中的章节。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 22:23 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前和已完成筛选的章节构成。
- 静态首页初始筛选摘要已包含“章节构成 首段星图 4 段 / 专精校准 5 段 / 深空基建 4 段 / 远航长尾 44 段”。
- 构建产物已包含 `formatProjectFilterChapterMix` 和“章节构成”。
- GitHub Pages workflow 25115037486 已成功，线上地址返回 HTTP 200，线上首页包含“章节构成 首段星图 4 段 / 专精校准 5 段 / 深空基建 4 段 / 远航长尾 44 段”，线上脚本包含 `formatProjectFilterChapterMix`。
- #2 已回复并保持 open，等待复测确认筛选摘要章节构成是否降低 57 段星图在不同视图里的阶段判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 22:33 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选摘要章节构成降低不同筛选视图里的阶段判断成本。

## 2026-04-29 Product decision：星图筛选状态构成

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已给每个星图项目卡片新增状态标签，但玩家切到全部、本章、升级、奖励类型或已完成视图后，仍需要扫描卡片才能知道当前视图里已完成、当前推进和待推进内容各有多少。

本轮决策：

- 不追加第 58 段，先让星图筛选摘要显示当前视图的状态构成。
- 状态构成按当前筛选视图统计“已完成 / 当前 / 待推进”航段数，复用项目卡片已有的完成状态和第一个未完成航段判定。
- 空筛选仍只显示没有匹配航段；已完成筛选只显示已完成段数；当前筛选只显示当前段数。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 22:04 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前和已完成筛选的状态构成。
- 静态首页初始筛选摘要已包含“状态构成 当前 1 段 / 待推进 56 段”。
- GitHub Pages workflow 25113972752 已成功，线上地址返回 HTTP 200，线上首页包含“状态构成 当前 1 段 / 待推进 56 段”，线上脚本包含 `formatProjectFilterStatusMix`。
- #2 已回复并保持 open，等待复测确认筛选摘要状态构成是否降低 57 段星图在不同视图里的状态判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 22:13 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选摘要状态构成降低 57 段星图在不同筛选视图里的状态判断成本。

## 2026-04-29 Product decision：星图项目状态标签

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已让筛选摘要显示已领取奖励，但玩家回到 57 段项目列表时，仍需要依赖卡片颜色和进度文本判断某段是已完成、当前推进还是后续待推进。

本轮决策：

- 不追加第 58 段，先给每个星图项目卡片新增状态标签。
- 状态标签由项目完成状态和第一个未完成航段自动推导：已完成、当前航段、待推进。
- 当前航段仍只会标记第一个未完成项目；全部完成时不会出现当前航段。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 21:48 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖已完成、当前航段和待推进三类状态文本。
- 构建产物已包含 `project-status-badge`、`statusText`、“当前航段”和“待推进”。
- GitHub Pages workflow 25113075342 已成功，线上地址返回 HTTP 200，线上脚本包含 `project-status-badge`、`statusText`、“当前航段”和“待推进”，线上样式包含 `project-status-badge`。
- #2 已回复并保持 open，等待复测确认项目状态标签是否降低 57 段星图列表的状态判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 21:56 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为项目状态标签降低 57 段星图列表的状态判断成本。

## 2026-04-29 Product decision：星图筛选已领取奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已让筛选摘要显示待领取奖励，但玩家在全部、本章、升级或奖励类型视图里，仍需要用总奖励构成减去待领取奖励，才能判断这个视图已经获得了哪些成长线。

本轮决策：

- 不追加第 58 段，先让星图筛选摘要在混合完成/未完成视图中显示已领取奖励构成。
- “已领取奖励”只统计当前筛选视图里已完成航段的总产能、点击、自动和过载奖励。
- 当前筛选没有已完成航段、没有未完成航段或已完成筛选全为已领取内容时不重复显示，避免空信息或和奖励构成重复。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 21:30 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前、已完成和全部完成后空本章筛选摘要。
- 构建产物已包含“已领取奖励”和 `formatProjectFilterClaimedRewardMix`。
- GitHub Pages workflow 25112149264 已成功，线上地址返回 HTTP 200，线上脚本包含 `formatProjectFilterClaimedRewardMix` 和“已领取奖励”。
- #2 已回复并保持 open，等待复测确认筛选摘要已领取奖励是否降低 57 段星图各视图的已获得成长线判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 21:38 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选摘要已领取奖励降低 57 段星图各视图的已获得成长线判断成本。

## 2026-04-29 Product decision：星图筛选待领取奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已让筛选摘要显示完成率和剩余航段数，但玩家切到某个筛选视图后，仍需要从已完成航段和奖励构成中推断剩余内容还会给哪些成长线。

本轮决策：

- 不追加第 58 段，先让星图筛选摘要显示当前视图的待领取奖励构成。
- 有未完成航段的筛选摘要追加“待领取奖励 X 段”，只统计当前筛选视图里尚未完成航段的总产能、点击、自动和过载奖励。
- 已完成筛选不显示待领取奖励，避免把已领取奖励误读成剩余奖励。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 21:10 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前、已完成和全部完成后空本章筛选摘要。
- 构建产物已包含“待领取奖励 总产能 17 段 / 点击 14 段 / 自动 15 段 / 过载 11 段”和 `formatProjectFilterPendingRewardMix`。
- GitHub Pages workflow 25111260326 已成功，线上地址返回 HTTP 200，线上页面包含“待领取奖励 总产能 17 段 / 点击 14 段 / 自动 15 段 / 过载 11 段”，线上脚本包含 `formatProjectFilterPendingRewardMix`。
- #2 已回复并保持 open，等待复测确认筛选摘要待领取奖励是否降低 57 段星图各视图的剩余成长线判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 21:20 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选摘要待领取奖励降低 57 段星图各视图的剩余成长线判断成本。

## 2026-04-29 Product decision：星图筛选摘要剩余量

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已让筛选按钮显示完成进度，但玩家切到某个筛选视图后，摘要仍只显示已完成数，需要自行反推出这组内容的完成率和剩余航段数。

本轮决策：

- 不追加第 58 段，先让星图筛选摘要显示完成率和剩余航段数。
- 有匹配航段的筛选摘要统一追加“完成率 X% · 剩余 N 段”；已完成筛选显示 100% 和剩余 0 段。
- 空筛选继续显示“没有匹配航段”，避免给全部完成后的本章视图制造不存在的剩余目标。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 20:56 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前、已完成和全部完成后空本章筛选摘要。
- 构建产物已包含“完成率 0% · 剩余 57 段”和 `formatProjectFilterCompletion`。
- GitHub Pages workflow 25110458028 已成功，线上地址返回 HTTP 200，线上页面包含“完成率 0% · 剩余 57 段”，线上脚本包含 `formatProjectFilterCompletion`。
- #2 已回复并保持 open，等待复测确认筛选摘要剩余量是否降低 57 段星图各视图的内容余量判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 21:04 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选摘要剩余量降低 57 段星图各视图的内容余量判断成本。

## 2026-04-29 Product decision：星图筛选按钮进度

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已让项目卡片显示推进方式和奖励类型，但玩家在点击筛选前，仍只能从按钮看到匹配数量，不能直接判断每组筛选内容已经推进到什么程度、还剩多少内容。

本轮决策：

- 不追加第 58 段，先让星图筛选按钮显示完成进度。
- 全部、本章、累计、升级和奖励类型筛选显示“已完成/总数”，例如“全部 5/57”“本章 1/5”“累计 2/48”。
- 当前、未完成和已完成筛选继续显示直接数量，保持定位当前航段、查看剩余和复盘已完成内容的按钮语义。
- 按钮文案由 `getProjectFilterButtonText` 基于现有筛选结果自动生成；不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 20:40 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖全部、当前、本章、累计、升级、四类奖励、未完成、已完成和全部完成后空本章筛选按钮文案。
- 构建产物已包含 `getProjectFilterButtonText`、`全部 0/57` 和更新后的筛选按钮渲染。
- GitHub Pages workflow 25109646272 已成功，线上地址返回 HTTP 200，线上页面包含“全部 0/57”“本章 0/4”“累计 0/48”“升级 0/9”，线上脚本包含 `getProjectFilterButtonText` 和按钮渲染调用。
- #2 已回复并保持 open，等待复测确认筛选按钮进度是否降低 57 段星图各组内容剩余量的判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 20:48 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选按钮进度降低 57 段星图各组内容剩余量判断成本。

## 2026-04-29 Product decision：星图项目标签

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮筛选摘要已经显示推进构成，但玩家实际浏览 57 段项目卡片时，仍需要分别阅读目标条件和奖励文本，才能判断某一段是累计推进还是升级补强、奖励落到哪条成长线。

本轮决策：

- 不追加第 58 段，先给每个星图项目卡片新增“累计/升级航段 · 奖励类型”标签。
- 标签由项目是否带 upgradeId 和 effect 类型自动推导，例如“累计航段 · 总产能奖励”“升级航段 · 过载奖励”。
- 标签只改变项目列表展示；不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 20:21 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖累计/升级航段及总产能、过载、点击奖励标签。
- 构建产物已包含 `buildProjectTagText`、`project-tag-badge` 和新增的项目卡片标签渲染。
- GitHub Pages workflow 25108907209 已成功，线上地址返回 HTTP 200，线上脚本包含 `buildProjectTagText`、`tagText` 和 `project-tag-badge`，线上样式包含 `project-tag-badge`。
- #2 已回复并保持 open，等待复测确认项目标签是否降低 57 段星图列表的操作方式和成长线判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 20:31 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为项目标签降低 57 段星图列表的操作方式和成长线判断成本。

## 2026-04-29 Product decision：星图筛选推进构成

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮筛选摘要已经显示奖励构成，但玩家切换本章、奖励类型、未完成或已完成视图时，仍需要从航段条件里判断这一组内容主要靠累计能量推进，还是需要回到升级卡片补等级。

本轮决策：

- 不追加第 58 段，先在星图筛选摘要中追加“推进构成”。
- 推进构成按当前筛选视图统计累计航段和升级航段各有多少段。
- 已完成筛选也显示推进构成，方便玩家复盘已完成内容主要来自等待/点火还是升级补强；空筛选仍只显示没有匹配航段。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 20:09 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前和已完成筛选的推进构成。
- 构建产物已包含“推进构成 累计 48 段 / 升级 9 段”、`formatProjectFilterTrackMix` 和更新后的 `getProjectFilterSummary`。
- GitHub Pages workflow 25108240146 已成功，线上地址返回 HTTP 200，发布页面包含“推进构成 累计 48 段 / 升级 9 段”，线上脚本包含 `formatProjectFilterTrackMix` 和 `getProjectFilterSummary`。
- #2 已回复并保持 open，等待复测确认筛选推进构成是否降低 57 段星图在不同筛选视图里的操作方式判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 20:16 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选推进构成降低 57 段星图在不同筛选视图里的操作方式判断成本。

## 2026-04-29 Product decision：星图筛选奖励构成

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮筛选摘要已经显示下一条、后续和终点，但玩家切换本章、累计、升级、奖励类型、未完成或已完成视图时，仍需要从每个航段奖励文本里自行判断这一组内容覆盖哪些成长方向。

本轮决策：

- 不追加第 58 段，先在星图筛选摘要中追加“奖励构成”。
- 奖励构成按当前筛选视图统计总产能、点击、自动和过载奖励各有多少段。
- 已完成筛选也显示奖励构成，方便玩家复盘已经拿到的成长线；空筛选仍只显示没有匹配航段。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 19:52 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖本章、升级、当前和已完成筛选的奖励构成。
- 构建产物已包含“奖励构成 总产能 17 段 / 点击 14 段 / 自动 15 段 / 过载 11 段”、`PROJECT_REWARD_SUMMARY_DEFS`、`formatProjectFilterRewardMix` 和更新后的 `getProjectFilterSummary`。
- GitHub Pages workflow 25107604800 已成功，线上地址返回 HTTP 200，发布页面包含“奖励构成 总产能 17 段 / 点击 14 段 / 自动 15 段 / 过载 11 段”，线上脚本包含 `PROJECT_REWARD_SUMMARY_DEFS`、`formatProjectFilterRewardMix` 和 `getProjectFilterSummary`。
- #2 已回复并保持 open，等待复测确认筛选奖励构成是否降低 57 段星图在不同筛选视图里的成长线判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 20:02 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选奖励构成降低 57 段星图在不同筛选视图里的成长线判断成本。

## 2026-04-29 Product decision：星图筛选终点提示

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮筛选摘要已经显示下一条和最多两条后续航段，但玩家切换本章、累计、升级或奖励类型筛选后，仍需要扫描列表末尾才能判断当前视图最终通向哪个航点。

本轮决策：

- 不追加第 58 段，先在星图筛选摘要中追加“终点”提示。
- 终点提示显示当前筛选视图最后一个匹配航段的航段号和名称。
- 仅当当前筛选还有 4 条及以上未完成航段时显示终点，避免与下一条或后续两条预告重复。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 19:36 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，新增测试覆盖本章筛选终点和升级筛选终点，并确认当前单航段不追加终点。
- 构建产物已包含“终点 航段 57/57 星渊方舟”和更新后的 `getProjectFilterSummary`。
- GitHub Pages workflow 25106925998 已成功，线上地址返回 HTTP 200，发布页面包含“终点 航段 57/57 星渊方舟”和 `projectFilterSummary`，线上脚本包含 `formatProjectFilterEndpoint` 和 `getProjectFilterSummary`。
- #2 已回复并保持 open，等待复测确认筛选终点提示是否降低 57 段星图在不同筛选视图里的跨度判断成本。
- GitHub Issues 已在回复后同步：2026-04-29 19:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选终点提示降低 57 段星图在不同筛选视图里的跨度判断成本。

## 2026-04-29 Product decision：星图筛选后续预告

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮筛选摘要已经能显示当前筛选视图的下一条可推进航段，但玩家如果想判断本章、升级或奖励类型筛选里是否还有连续目标，仍需要继续扫描列表。

本轮决策：

- 不追加第 58 段，先在星图筛选摘要中追加“后续”预告。
- 后续预告最多显示两条当前筛选视图里的未完成航段，包含航段号和名称。
- 当前筛选只有一条、已完成筛选或空筛选不显示后续预告，避免制造不存在的连续目标。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 19:22 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，新增测试覆盖本章筛选后续预告、升级筛选后续预告和当前单航段不追加后续预告。
- 构建产物已包含“后续 航段 2/57 谐振校准”、`formatProjectFilterPreview` 和更新后的 `getProjectFilterSummary`。
- GitHub Pages workflow 25106266215 已成功，线上地址返回 HTTP 200，发布页面包含“后续 航段 2/57 谐振校准”和 `projectFilterSummary`，线上脚本包含 `formatProjectFilterPreview` 和 `getProjectFilterSummary`。
- #2 已回复并保持 open，等待复测确认筛选摘要后续预告是否降低 57 段星图在筛选视图里的连续目标扫描成本。
- GitHub Issues 已在回复后同步：2026-04-29 19:30 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选摘要后续预告降低 57 段星图的连续目标扫描成本。

## 2026-04-29 Product decision：星图筛选摘要

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已新增行动建议，把当前航段转成下一步操作；但玩家切换本章、累计、升级或奖励类型筛选后，仍需要继续扫描列表，才能判断当前视图里的下一条可推进航段。

本轮决策：

- 不追加第 58 段，先在星图筛选区新增“筛选视图摘要”。
- 摘要显示当前筛选名称、匹配航段数、已完成数和下一条未完成航段的航段号、名称、奖励与进度。
- 全部完成或空筛选时显示明确完成/空状态，避免误导玩家仍有当前航段。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略、筛选规则和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 19:05 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，新增测试覆盖本章筛选摘要、升级筛选摘要、已完成筛选摘要和全部完成后的空本章状态。
- 构建产物已包含“筛选视图”、`projectFilterSummary`、`project-filter-summary` 和 `getProjectFilterSummary`。
- GitHub Pages workflow 25105644650 已成功，线上地址返回 HTTP 200，发布页面包含“筛选视图”和 `projectFilterSummary`，线上脚本包含 `getProjectFilterSummary`，线上样式包含 `project-filter-summary`。
- #2 已回复并保持 open，等待复测确认筛选摘要是否降低 57 段星图的视图扫描成本。
- GitHub Issues 已在回复后同步：2026-04-29 19:15 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为筛选摘要降低 57 段星图的视图扫描成本。

## 2026-04-29 Product decision：星图行动建议

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已新增目标类型筛选，让 57 段星图能按累计和升级拆开查看；但筛选解决的是“看哪组内容”，还没有把当前航段直接翻译成“现在点火、等待还是购买升级”。

本轮决策：

- 不追加第 58 段，先在星图总览新增“行动建议”。
- 升级航段复用现有升级可购买/还差能量判断，直接提示应购买哪个升级并标出对应航段。
- 累计航段提示继续点火或放置累计，显示剩余能量；已有自动产能时额外显示按当前每秒产能估算的所需时间。
- 不新增存档字段，不改变项目完成判定、奖励数值、升级价格、航线策略和 57 段星图顺序。

验收标准：

- GitHub Issues 已同步：2026-04-29 18:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖升级航段行动建议、累计航段行动建议和全部完成状态。
- 构建产物已包含“行动建议”、`projectOverviewAction` 和 `formatDuration`。
- GitHub Pages workflow 25104944364 已成功，线上地址返回 HTTP 200，发布页面包含“行动建议”和 `projectOverviewAction`，线上脚本包含 `formatDuration`。
- #2 已回复并保持 open，等待复测确认行动建议是否降低 57 段星图的操作规划成本。
- GitHub Issues 已在回复后同步：2026-04-29 18:58 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为行动建议降低 57 段星图的操作规划成本。

## 2026-04-29 Product decision：星图目标类型筛选

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已新增奖励类型筛选，让 57 段星图可按成长线查看；但玩家如果想按“累计能量推进”或“补升级等级”安排操作，仍需要在目标分轨和项目列表之间对照。

本轮决策：

- 不追加第 58 段，先新增目标类型筛选：累计、升级。
- 累计筛选显示不依赖升级等级的航段；升级筛选显示带 upgradeId 的航段。
- 筛选只影响当前列表视图，不新增存档字段，不改变项目完成判定、奖励数值、升级价格和 57 段星图路线。
- 静态 HTML 初始文案、README、产品说明、路线图、设计约束、研究记录、反馈记录和发布日志同步记录目标类型筛选能力。

验收标准：

- GitHub Issues 已同步：2026-04-29 18:31 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖累计 48 段、升级 9 段，以及升级筛选的首批航段。
- 构建产物已包含“累计 48”、“升级 9”、`energy-track` 和 `upgrade-track`。
- GitHub Pages workflow 25104192714 已成功，线上地址返回 HTTP 200，发布页面包含“累计 48”和“升级 9”，线上脚本包含 `energy-track` 和 `upgrade-track`。
- #2 已回复并保持 open，等待复测确认目标类型筛选是否让 57 段星图更容易按当下操作方式规划。
- GitHub Issues 已在回复后同步：2026-04-29 18:40 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为目标类型筛选改善 57 段星图的操作规划成本。

## 2026-04-29 Product decision：星图奖励类型筛选

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已新增“本章”筛选，降低当前章节扫描成本；但如果玩家想按自己关心的成长线规划 57 段星图，仍需要在奖励目标、章节奖励和项目列表之间来回对照。

本轮决策：

- 不追加第 58 段，先新增奖励类型筛选：总产能、点击、自动、过载。
- 奖励类型筛选按项目 effect 归类，只影响当前列表视图，不新增存档字段，不改变项目完成判定、奖励数值、升级价格和 57 段星图路线。
- 静态 HTML 初始文案、README、产品说明、路线图、设计约束、研究记录、反馈记录和发布日志同步记录奖励类型筛选能力。

验收标准：

- GitHub Issues 已同步：2026-04-29 18:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，测试覆盖总产能 17 段、点击 14 段、自动 15 段、过载 11 段筛选，以及过载奖励筛选的首批航段。
- 构建产物已包含“总产能 17”、“点击 14”、“自动 15”、“过载 11”、`total-reward`、`click-reward`、`second-reward`、`overload-reward` 和 `PROJECT_REWARD_FILTER_EFFECTS`。
- GitHub Pages workflow 25103602168 已成功，线上地址返回 HTTP 200，发布页面包含“总产能 17”、“点击 14”、“自动 15”和“过载 11”，线上脚本包含 `total-reward`、`click-reward`、`second-reward`、`overload-reward` 和 `PROJECT_REWARD_FILTER_EFFECTS`。
- #2 已回复并保持 open，等待复测确认奖励类型筛选是否让 57 段星图更容易按成长线规划。
- GitHub Issues 已在回复后同步：2026-04-29 18:26 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为奖励类型筛选改善 57 段星图的成长线规划和内容操作成本。

## 2026-04-29 Product decision：星图本章筛选

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已新增全部、当前、未完成和已完成筛选，但在 57 段星图中，“未完成”仍可能是一条很长的跨章节列表；继续追加第 58 段会后移边界，却不会降低当前章节内的扫描成本。

本轮决策：

- 不追加新航段，先新增“本章”航段筛选。
- “本章”按当前航段所属章节展示同章项目；全部完成时不显示本章航段，避免制造不存在的当前章节。
- 筛选只影响当前列表视图，不新增存档字段，不改变项目完成判定、奖励数值、升级价格和 57 段星图路线。
- 静态 HTML 初始文案、README、产品说明、路线图、设计约束、研究记录和发布日志同步记录本章筛选能力。

验收标准：

- GitHub Issues 已同步：2026-04-29 17:58 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，覆盖本章筛选返回当前章节 5 段、非法筛选回退和全部完成时本章筛选为空。
- 构建产物已包含 `current-chapter`、“本章”、`PROJECT_FILTER_DEFS`、`filterProjectStatuses` 和静态筛选按钮“本章 4”。
- GitHub Pages workflow 25102939695 已成功，线上地址返回 HTTP 200，发布页面包含“本章 4”，线上脚本包含 `current-chapter` 和 `filterProjectStatuses`。
- #2 已回复并保持 open，等待复测确认本章筛选是否降低 57 段星图的章节扫描成本。
- GitHub Issues 已在回复后同步：2026-04-29 18:10 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为本章筛选改善 57 段星图的章节扫描和内容操作成本。

## 2026-04-29 Product decision：星图航段筛选

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 57 段，如果继续只追加第 58 段，会继续后移内容边界，但也会让项目列表更长、更难定位当前可玩的内容。

本轮决策：

- 不追加新航段，先新增星图航段筛选：全部、当前、未完成、已完成。
- 筛选只影响当前列表视图，不新增存档字段，不改变项目完成判定、奖励数值、升级价格和 57 段星图路线。
- 当前筛选让玩家直接定位正在推进的航段；未完成筛选保留后续追逐目标；已完成筛选支持复盘已获得奖励。
- 静态 HTML 初始文案、README、产品说明、路线图、设计约束和发布日志同步记录筛选能力。

验收标准：

- GitHub Issues 已同步：2026-04-29 17:43 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- `bun install --no-save`、`bun run test`、`bun run build`、`npm install`、`npm test` 和 `npm run build` 已通过，覆盖全部/当前/未完成/已完成筛选、非法筛选回退和全部完成时当前筛选为空。
- 构建产物已包含 `projectFilterList`、`project-filter-button`、`filterProjectStatuses` 和“星图航段筛选”。
- GitHub Pages workflow 25102148181 已成功，线上地址返回 HTTP 200，发布页面包含“星图航段筛选”、`projectFilterList`、`project-filter-button` 和筛选逻辑 `filterProjectStatuses`。
- #2 已回复并保持 open，等待复测确认筛选是否让 57 段星图内容更容易操作。
- GitHub Issues 已在回复后同步：2026-04-29 17:52 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为星图航段筛选改善现有内容的可操作性。

## 2026-04-29 Product decision：星渊方舟航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 56 段，但星渊巡航环完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星渊方舟”航段，要求累计 122B 能量，奖励总产能 +32%。
- 星图路线从 56 段扩展到 57 段；远航长尾章节从 43 段扩展到 44 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案、README、产品说明、路线图和设计约束同步到 57 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星渊巡航环之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 17:26 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星渊巡航环完成后继续指向星渊方舟、57 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星渊方舟”、`abyss-ark`、“星图进度 0/57”、“48 个累计航段”、“总产能 17 段”和“122B”。
- GitHub Pages workflow 25101463915 已成功，线上地址返回 HTTP 200，发布页面包含“星图进度 0/57”、“48 个累计航段”、“总产能 17 段”、“122B”和终局航点“星渊方舟”，线上脚本包含 `abyss-ark`。
- #2 已回复并保持 open，等待复测确认 122B 后续航段是否改善长尾内容丰富度。
- GitHub Issues 已在回复后同步：2026-04-29 17:35 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为星渊方舟改善长尾内容丰富度。

## 2026-04-29 Product decision：星渊巡航环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 55 段，但星渊点火塔完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星渊巡航环”航段，要求累计 91B 能量，奖励自动产能 +31%。
- 星图路线从 55 段扩展到 56 段；远航长尾章节从 42 段扩展到 43 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案、README、产品说明、路线图和设计约束同步到 56 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星渊点火塔之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 17:08 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星渊点火塔完成后继续指向星渊巡航环、56 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星渊巡航环”、`abyss-cruise-ring`、“星图进度 0/56”、“47 个累计航段”、“自动 0/15”和“91B”。
- GitHub Pages workflow 25100747523 已成功，线上地址返回 HTTP 200，发布页面包含“星图进度 0/56”、“47 个累计航段”、“自动 0/15”、“91B”和终局航点“星渊巡航环”，线上脚本包含 `abyss-cruise-ring`。
- #2 已回复并保持 open，等待复测确认 91B 后续航段是否改善长尾内容丰富度。
- GitHub Issues 已在回复后同步：2026-04-29 17:21 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为星渊巡航环改善长尾内容丰富度。

## 2026-04-29 Product decision：星渊点火塔航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 54 段，但曜渊谐振门完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星渊点火塔”航段，要求累计 67.5B 能量，奖励点击产能 +31%。
- 星图路线从 54 段扩展到 55 段；远航长尾章节从 41 段扩展到 42 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案、README、产品说明、路线图和设计约束同步到 55 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在曜渊谐振门之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 16:57 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖曜渊谐振门完成后继续指向星渊点火塔、55 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星渊点火塔”、`abyss-ignition-spire`、“星图进度 0/55”、“46 个累计航段”、“点击 0/14”和“67.5B”。
- GitHub Pages workflow 25100046206 已成功，线上地址返回 HTTP 200，发布页面包含“星渊点火塔”、“星图进度 0/55”、“46 个累计航段”、“点击 0/14”和“67.5B”，线上脚本包含 `abyss-ignition-spire`。
- #2 已回复并保持 open，等待复测确认 67.5B 后续航段是否改善长尾内容丰富度。
- GitHub Issues 已在回复后同步：2026-04-29 17:02 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为星渊点火塔改善长尾内容丰富度。

## 2026-04-29 Product decision：曜渊谐振门航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 53 段，但曜翼星门完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“曜渊谐振门”航段，要求累计 50B 能量，奖励过载奖励 +30%。
- 星图路线从 53 段扩展到 54 段；远航长尾章节从 40 段扩展到 41 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案、README、产品说明、路线图和设计约束同步到 54 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在曜翼星门之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 16:37 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖曜翼星门完成后继续指向曜渊谐振门、54 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“曜渊谐振门”、`radiant-abyss-resonance-gate`、“星图进度 0/54”、“45 个累计航段”、“过载 0/11”和“50B”。
- GitHub Pages workflow 25099357093 已成功，线上地址返回 HTTP 200，发布页面包含“曜渊谐振门”、“星图进度 0/54”、“45 个累计航段”、“过载 0/11”和“50B”，线上脚本包含 `radiant-abyss-resonance-gate`。
- #2 已回复并保持 open，等待复测确认 50B 后续航段是否改善长尾内容丰富度。
- GitHub Issues 已在回复后同步：2026-04-29 16:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为曜渊谐振门改善长尾内容丰富度。

## 2026-04-29 Product decision：曜翼星门航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 52 段，但星翼远航港完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“曜翼星门”航段，要求累计 37.2B 能量，奖励总产能 +30%。
- 星图路线从 52 段扩展到 53 段；远航长尾章节从 39 段扩展到 40 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案、README、产品说明、路线图和设计约束同步到 53 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星翼远航港之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 16:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星翼远航港完成后继续指向曜翼星门、53 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“曜翼星门”、`radiant-wing-stargate`、“星图进度 0/53”、“44 个累计航段”、“总产能 0/16”和“37.2B”。
- GitHub Pages workflow 25098446069 已成功，线上地址返回 HTTP 200，发布页面包含“曜翼星门”、“星图进度 0/53”、“44 个累计航段”、“总产能 0/16”和“37.2B”，线上脚本包含 `radiant-wing-stargate`。
- #2 已回复并保持 open，等待复测确认 37.2B 后续航段是否改善长尾内容丰富度。
- GitHub Issues 已在回复后同步：2026-04-29 16:23 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为曜翼星门改善长尾内容丰富度。

## 2026-04-29 Product decision：星翼远航港航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 51 段，但星耀跃迁塔完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星翼远航港”航段，要求累计 27.5B 能量，奖励自动产能 +29%。
- 星图路线从 51 段扩展到 52 段；远航长尾章节从 38 段扩展到 39 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案、README、产品说明、路线图和设计约束同步到 52 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星耀跃迁塔之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 16:02 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星耀跃迁塔完成后继续指向星翼远航港、52 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星翼远航港”、`starwing-voyage-haven`、“星图进度 0/52”、“43 个累计航段”和“自动 0/14”。
- GitHub Pages workflow 25097861346 已成功，线上地址返回 HTTP 200，发布页面包含“星翼远航港”、“星图进度 0/52”、“43 个累计航段”、“自动 0/14”和“27.5B”，线上脚本包含 `starwing-voyage-haven`。
- #2 已回复并保持 open，等待复测确认 27.5B 后续航段是否改善长尾内容丰富度。
- GitHub Issues 已在回复后同步：2026-04-29 16:09 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue。

下一步：继续观察 #2 复测是否认为星翼远航港改善长尾内容丰富度。

## 2026-04-29 Product decision：星耀跃迁塔航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 50 段，但曜潮谐振门完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星耀跃迁塔”航段，要求累计 20.4B 能量，奖励点击产能 +29%。
- 星图路线从 50 段扩展到 51 段；远航长尾章节从 37 段扩展到 38 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案、README、产品说明、路线图和设计约束同步到 51 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在曜潮谐振门之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 15:38 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖曜潮谐振门完成后继续指向星耀跃迁塔、51 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星耀跃迁塔”、`starflare-transition-spire`、“星图进度 0/51”、“42 个累计航段”和“点击 0/13”。
- GitHub Pages workflow 25097250747 已成功，线上地址返回 HTTP 200，发布文件包含“星耀跃迁塔”、`starflare-transition-spire`、“星图进度 0/51”、“42 个累计航段”和“点击 0/13”。
- #2 已回复并保持 open，等待复测确认 20.4B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星耀跃迁塔改善长尾内容丰富度。

## 2026-04-29 Product decision：曜潮谐振门航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 49 段，但曜冕星门完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“曜潮谐振门”航段，要求累计 15.2B 能量，奖励过载奖励 +28%。
- 星图路线从 49 段扩展到 50 段；远航长尾章节从 36 段扩展到 37 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 50 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在曜冕星门之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 15:21 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖曜冕星门完成后继续指向曜潮谐振门、50 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“曜潮谐振门”、`radiant-tide-resonance-gate`、“星图进度 0/50”、“41 个累计航段”和“过载 0/10”。
- GitHub Pages workflow 25096340907 已成功，线上地址返回 HTTP 200，发布文件包含“曜潮谐振门”、`radiant-tide-resonance-gate`、“星图进度 0/50”、“41 个累计航段”和“过载 0/10”。
- #2 已回复并保持 open，等待复测确认 15.2B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为曜潮谐振门改善长尾内容丰富度。

## 2026-04-29 Product decision：曜冕星门航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 48 段，但星冕远航港完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“曜冕星门”航段，要求累计 11.4B 能量，奖励总产能 +28%。
- 星图路线从 48 段扩展到 49 段；远航长尾章节从 35 段扩展到 36 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 49 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星冕远航港之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 14:58 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星冕远航港完成后继续指向曜冕星门、49 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“曜冕星门”、`radiant-crown-stargate`、“星图进度 0/49”、“40 个累计航段”和“总产能 0/15”。
- GitHub Pages workflow 25095578907 已成功，线上地址返回 HTTP 200，发布文件包含“曜冕星门”、`radiant-crown-stargate`、“星图进度 0/49”、“40 个累计航段”和“总产能 0/15”。
- #2 已回复并保持 open，等待复测确认 11.4B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为曜冕星门改善长尾内容丰富度。

## 2026-04-29 Product decision：星冕远航港航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 47 段，但星焰引航环完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星冕远航港”航段，要求累计 8.6B 能量，奖励自动产能 +27%。
- 星图路线从 47 段扩展到 48 段；远航长尾章节从 34 段扩展到 35 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 48 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星焰引航环之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 14:43 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星焰引航环完成后继续指向星冕远航港、48 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星冕远航港”、`starcrown-voyage-harbor`、“星图进度 0/48”、“39 个累计航段”和“自动 0/13”。
- GitHub Pages workflow 25094997919 已成功，线上地址返回 HTTP 200，发布文件包含“星冕远航港”、`starcrown-voyage-harbor`、“星图进度 0/48”、“39 个累计航段”和“自动 0/13”。
- #2 已回复并保持 open，等待复测确认 8.6B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星冕远航港改善长尾内容丰富度。

## 2026-04-29 Product decision：星焰引航环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 46 段，但星瀑谐振门完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星焰引航环”航段，要求累计 6.5B 能量，奖励点击产能 +27%。
- 星图路线从 46 段扩展到 47 段；远航长尾章节从 33 段扩展到 34 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 47 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星瀑谐振门之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 14:33 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星瀑谐振门完成后继续指向星焰引航环、47 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星焰引航环”、`starflame-pilot-ring`、“星图进度 0/47”、“38 个累计航段”和“点击 0/12”。
- GitHub Pages workflow 25094523729 已成功，线上地址返回 HTTP 200，发布文件包含“星焰引航环”、`starflame-pilot-ring`、“星图进度 0/47”、“38 个累计航段”和“点击 0/12”。
- #2 已回复并保持 open，等待复测确认 6.5B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星焰引航环改善长尾内容丰富度。

## 2026-04-29 Product decision：星瀑谐振门航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 45 段，但星穹导航塔完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星瀑谐振门”航段，要求累计 4.9B 能量，奖励过载奖励 +26%。
- 星图路线从 45 段扩展到 46 段；远航长尾章节从 32 段扩展到 33 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 46 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星穹导航塔之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 14:13 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星穹导航塔完成后继续指向星瀑谐振门、46 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星瀑谐振门”、`starfall-resonance-gate`、“星图进度 0/46”、“37 个累计航段”和“过载 0/9”。
- GitHub Pages workflow 25094087045 已成功，线上地址返回 HTTP 200，发布文件包含“星瀑谐振门”、`starfall-resonance-gate`、“星图进度 0/46”、“37 个累计航段”和“过载 0/9”。
- #2 已回复并保持 open，等待复测确认 4.9B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星瀑谐振门改善长尾内容丰富度。

## 2026-04-29 Product decision：星穹导航塔航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 44 段，但辉翼巡航港完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星穹导航塔”航段，要求累计 3.7B 能量，奖励总产能 +26%。
- 星图路线从 44 段扩展到 45 段；远航长尾章节从 31 段扩展到 32 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 45 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在辉翼巡航港之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 14:01 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖辉翼巡航港完成后继续指向星穹导航塔、45 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星穹导航塔”、`stardome-navigation-spire`、“星图进度 0/45”、“36 个累计航段”和“总产能 0/14”。
- GitHub Pages workflow 25093603685 已成功，线上地址返回 HTTP 200，发布文件包含“星穹导航塔”、`stardome-navigation-spire`、“星图进度 0/45”、“36 个累计航段”和“总产能 0/14”。
- #2 已回复并保持 open，等待复测确认 3.7B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星穹导航塔改善长尾内容丰富度。

## 2026-04-29 Product decision：辉翼巡航港航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 43 段，但星辉远港完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“辉翼巡航港”航段，要求累计 2.8B 能量，奖励自动产能 +25%。
- 星图路线从 43 段扩展到 44 段；远航长尾章节从 30 段扩展到 31 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 44 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星辉远港之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 13:45 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星辉远港完成后继续指向辉翼巡航港、44 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“辉翼巡航港”、`radiant-wing-cruise-haven`、“星图进度 0/44”、“35 个累计航段”和“自动 0/12”。
- GitHub Pages workflow 25093112588 已成功，线上地址返回 HTTP 200，发布文件包含“辉翼巡航港”、`radiant-wing-cruise-haven`、“星图进度 0/44”、“35 个累计航段”和“自动 0/12”。
- #2 已回复并保持 open，等待复测确认 2.8B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为辉翼巡航港改善长尾内容丰富度。

## 2026-04-29 Product decision：星辉远港航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 42 段，但星潮谐振庭完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星辉远港”航段，要求累计 2.1B 能量，奖励点击产能 +25%。
- 星图路线从 42 段扩展到 43 段；远航长尾章节从 29 段扩展到 30 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 43 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星潮谐振庭之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 13:23 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星潮谐振庭完成后继续指向星辉远港、43 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星辉远港”、`starglow-far-harbor`、“星图进度 0/43”、“34 个累计航段”和“点击 0/11”。
- GitHub Pages workflow 25092643630 已成功，线上地址返回 HTTP 200，发布文件包含“星辉远港”、`starglow-far-harbor`、“星图进度 0/43”、“34 个累计航段”和“点击 0/11”。
- #2 已回复并保持 open，等待复测确认 2.1B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星辉远港改善长尾内容丰富度。

## 2026-04-29 Product decision：星潮谐振庭航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 41 段，但晨星方舟完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星潮谐振庭”航段，要求累计 1.6B 能量，奖励过载奖励 +24%。
- 星图路线从 41 段扩展到 42 段；远航长尾章节从 28 段扩展到 29 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 42 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在晨星方舟之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 13:07 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖晨星方舟完成后继续指向星潮谐振庭、42 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星潮谐振庭”、`startide-resonance-court`、“星图进度 0/42”、“33 个累计航段”和“过载 0/8”。
- GitHub Pages workflow 25092169111 已成功，线上地址返回 HTTP 200，发布文件包含“星潮谐振庭”、`startide-resonance-court`、“星图进度 0/42”、“33 个累计航段”和“过载 0/8”。
- #2 已回复并保持 open，等待复测确认 1.6B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星潮谐振庭改善长尾内容丰富度。

## 2026-04-29 Product decision：晨星方舟航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 40 段，但银翼曙环完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“晨星方舟”航段，要求累计 1.2B 能量，奖励总产能 +24%。
- 星图路线从 40 段扩展到 41 段；远航长尾章节从 27 段扩展到 28 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 41 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在银翼曙环之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 12:48 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖银翼曙环完成后继续指向晨星方舟、41 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“晨星方舟”、`morningstar-ark`、“星图进度 0/41”、“32 个累计航段”和“总产能 0/13”。
- GitHub Pages workflow 25091744955 已成功，线上地址返回 HTTP 200，发布文件包含“晨星方舟”、`morningstar-ark`、“星图进度 0/41”、“32 个累计航段”和“总产能 0/13”。
- #2 已回复并保持 open，等待复测确认 1.2B 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为晨星方舟改善长尾内容丰富度。

## 2026-04-29 Product decision：银翼曙环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 39 段，但极光谱站完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补总览说明不会直接增加可玩的长尾目标。

本轮决策：

- 新增“银翼曙环”航段，要求累计 950M 能量，奖励自动产能 +23%。
- 星图路线从 39 段扩展到 40 段；远航长尾章节从 26 段扩展到 27 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 40 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在极光谱站之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 12:30 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖极光谱站完成后继续指向银翼曙环、40 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“银翼曙环”、`silverwing-dawn-ring`、“星图进度 0/40”、“31 个累计航段”和“自动 0/11”。
- GitHub Pages workflow 25091232813 已成功，线上地址返回 HTTP 200，发布文件包含“银翼曙环”、`silverwing-dawn-ring`、“星图进度 0/40”、“31 个累计航段”和“自动 0/11”。
- #2 已回复并保持 open，等待复测确认 950M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为银翼曙环改善长尾内容丰富度。

## 2026-04-29 Product decision：极光谱站航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 38 段，但穹海棱镜完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补总览说明不会直接增加可玩的长尾目标。

本轮决策：

- 新增“极光谱站”航段，要求累计 720M 能量，奖励点击产能 +23%。
- 星图路线从 38 段扩展到 39 段；远航长尾章节从 25 段扩展到 26 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 39 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在穹海棱镜之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 12:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖穹海棱镜完成后继续指向极光谱站、39 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“极光谱站”、`aurora-spectrum-station`、“星图进度 0/39”、“30 个累计航段”和“点击 0/10”。
- GitHub Pages workflow 25090803408 已成功，线上地址返回 HTTP 200，发布文件包含“极光谱站”、`aurora-spectrum-station`、“星图进度 0/39”、“30 个累计航段”和“点击 0/10”。
- #2 已回复并保持 open，等待复测确认 720M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为极光谱站改善长尾内容丰富度。

## 2026-04-29 Product decision：穹海棱镜航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 37 段，但星澜汇流庭完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“穹海棱镜”航段，要求累计 550M 能量，奖励过载奖励 +22%。
- 星图路线从 37 段扩展到 38 段；远航长尾章节从 24 段扩展到 25 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表、静态 HTML 初始文案和 README 同步到 38 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星澜汇流庭之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 12:03 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星澜汇流庭完成后继续指向穹海棱镜、38 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“穹海棱镜”、`skysea-prism`、“星图进度 0/38”、“29 个累计航段”和“过载 0/7”。
- GitHub Pages workflow 25090390131 已成功，线上地址返回 HTTP 200，发布文件包含“穹海棱镜”、`skysea-prism`、“星图进度 0/38”、“29 个累计航段”和“过载 0/7”。
- #2 已回复并保持 open，等待复测确认 550M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为穹海棱镜改善长尾内容丰富度。

## 2026-04-29 Product decision：星澜汇流庭航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 36 段，但辉潮巡航环完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星澜汇流庭”航段，要求累计 420M 能量，奖励总产能 +22%。
- 星图路线从 36 段扩展到 37 段；远航长尾章节从 23 段扩展到 24 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表和静态 HTML 初始文案同步到 37 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在辉潮巡航环之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 11:40 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖辉潮巡航环完成后继续指向星澜汇流庭、37 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星澜汇流庭”、`starwave-confluence-court`、“星图进度 0/37”、“28 个累计航段”和“总产能 0/12”。
- GitHub Pages workflow 25089905939 已成功，线上地址返回 HTTP 200，发布文件包含“星澜汇流庭”、`starwave-confluence-court`、“星图进度 0/37”、“28 个累计航段”和“总产能 0/12”。
- #2 已回复并保持 open，等待复测确认 420M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星澜汇流庭改善长尾内容丰富度。

## 2026-04-29 Product decision：辉潮巡航环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 35 段，但烁影星匣完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“辉潮巡航环”航段，要求累计 320M 能量，奖励自动产能 +21%。
- 星图路线从 35 段扩展到 36 段；远航长尾章节从 22 段扩展到 23 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表和静态 HTML 初始文案同步到 36 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在烁影星匣之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 11:25 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖烁影星匣完成后继续指向辉潮巡航环、36 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“辉潮巡航环”、`radiant-tide-cruise-ring`、“星图进度 0/36”、“27 个累计航段”和“自动 0/10”。
- GitHub Pages workflow 25089421473 已成功，线上地址返回 HTTP 200，发布文件包含“辉潮巡航环”、`radiant-tide-cruise-ring`、“星图进度 0/36”、“27 个累计航段”和“自动 0/10”。
- #2 已回复并保持 open，等待复测确认 320M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为辉潮巡航环改善长尾内容丰富度。

## 2026-04-29 Product decision：烁影星匣航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 34 段，但虚曜谐振塔完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“烁影星匣”航段，要求累计 250M 能量，奖励点击产能 +21%。
- 星图路线从 34 段扩展到 35 段；远航长尾章节从 21 段扩展到 22 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表和静态 HTML 初始文案同步到 35 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在虚曜谐振塔之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 10:58 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖虚曜谐振塔完成后继续指向烁影星匣、35 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“烁影星匣”、`glimmer-shadow-vault`、“星图进度 0/35”、“26 个累计航段”和“点击 0/9”。
- GitHub Pages workflow 25088946556 已成功，线上地址返回 HTTP 200，发布文件包含“烁影星匣”、`glimmer-shadow-vault`、“星图进度 0/35”、“26 个累计航段”和“点击 0/9”。
- #2 已回复并保持 open，等待复测确认 250M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为烁影星匣改善长尾内容丰富度。

## 2026-04-29 Product decision：虚曜谐振塔航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 33 段，但星渊回声门完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“虚曜谐振塔”航段，要求累计 190M 能量，奖励过载奖励 +20%。
- 星图路线从 33 段扩展到 34 段；远航长尾章节从 20 段扩展到 21 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表和静态 HTML 初始文案同步到 34 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星渊回声门之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 10:40 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星渊回声门完成后继续指向虚曜谐振塔、34 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“虚曜谐振塔”、`voidflare-resonator`、“星图进度 0/34”、“25 个累计航段”和“过载 0/6”。
- GitHub Pages workflow 25088478958 已成功，线上地址返回 HTTP 200，发布文件包含“虚曜谐振塔”、`voidflare-resonator`、“星图进度 0/34”、“25 个累计航段”和“过载 0/6”。
- #2 已回复并保持 open，等待复测确认 190M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为虚曜谐振塔改善长尾内容丰富度。

## 2026-04-29 Product decision：星渊回声门航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 32 段，但曜幕天穹完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补信息结构不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星渊回声门”航段，要求累计 145M 能量，奖励总产能 +20%。
- 星图路线从 32 段扩展到 33 段；远航长尾章节从 19 段扩展到 20 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表和静态 HTML 初始文案同步到 33 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在曜幕天穹之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 10:25 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖曜幕天穹完成后继续指向星渊回声门、33 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星渊回声门”、`abyss-echo-gate`、“星图进度 0/33”和“24 个累计航段”。
- GitHub Pages workflow 25088064228 已成功，线上地址返回 HTTP 200，发布文件包含“星渊回声门”、`abyss-echo-gate`、“星图进度 0/33”和“24 个累计航段”。
- #2 已回复并保持 open，等待复测确认 145M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星渊回声门改善长尾内容丰富度。

## 2026-04-29 Product decision：曜幕天穹航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序多轮已经把 31 段星图的信息结构补到目标分轨、章节、奖励目标、里程碑和航线焦点；继续只添加说明性总览会增加信息密度，但不直接增加可玩的长尾目标。

本轮决策：

- 新增“曜幕天穹”航段，要求累计 110M 能量，奖励自动产能 +20%。
- 星图路线从 31 段扩展到 32 段；远航长尾章节从 18 段扩展到 19 段。
- 主目标、星图总览、里程碑、航线构成、章节奖励、奖励进度、项目列表和静态 HTML 初始文案同步到 32 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在晨渊观星台之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 10:08 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖晨渊观星台完成后继续指向曜幕天穹、32 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“曜幕天穹”、`solar-veil-dome`、“星图进度 0/32”和“23 个累计航段”。
- GitHub Pages workflow 25087650173 已成功，线上地址返回 HTTP 200，发布文件包含“曜幕天穹”、`solar-veil-dome`、“星图进度 0/32”和“23 个累计航段”。
- #2 已回复并保持 open，等待复测确认 110M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为曜幕天穹改善长尾内容丰富度。

## 2026-04-29 Product decision：星图航线焦点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览新增“里程碑”，当前章节终点和终局航点已经更清楚，但玩家选择均衡、点火或巡航后，仍需要在航线策略按钮和项目列表之间自行对照对应专精航段。

本轮决策：

- 在星图总览新增“航线焦点”，按当前航线策略显示对应专精航段、奖励和当前进度。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续把已有 31 段星图和可切换航线策略连成更明确的可追目标。
- 静态 HTML 初始文案同步到航线焦点，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:54 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖锁定状态、当前策略专精、进行中状态和全部完成状态的航线焦点文案。
- 构建产物已包含“航线焦点”、`projectOverviewRouteFocus` 和 `routeFocusText`。
- GitHub Pages workflow 25087158534 已成功，线上地址返回 HTTP 200，发布文件包含“航线焦点”、`projectOverviewRouteFocus` 和 `routeFocusText`。
- #2 已回复并保持 open，等待复测确认航线焦点是否改善策略选择与内容目标之间的关联。

下一步：继续观察 #2 复测是否认为航线焦点改善策略选择与内容目标之间的关联。

## 2026-04-29 Product decision：星图里程碑

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览新增“奖励目标”，四条成长线的下一条奖励已经更明确，但玩家仍缺少把“当前章节终点”和“整条路线终局航点”并排理解的短期/长期里程碑。

本轮决策：

- 在星图总览新增“里程碑”，显示当前章节终点和终局航点的航段序号、奖励和当前进度。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的路线跨度感。
- 静态 HTML 初始文案同步到里程碑，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:31 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖初始状态、进行中状态和全部完成状态的里程碑文案。
- 构建产物已包含“里程碑”、`projectOverviewMilestones` 和 `milestoneText`。
- GitHub Pages workflow 25086687155 已成功，线上地址返回 HTTP 200，发布文件包含“里程碑”、`projectOverviewMilestones` 和 `milestoneText`。
- #2 已回复并保持 open，等待复测确认里程碑是否改善章节目标和长期路线的内容丰富度感知。

下一步：继续观察 #2 复测是否认为里程碑改善章节目标和长期路线的内容丰富度感知。

## 2026-04-29 Product decision：星图奖励目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览新增“奖励进度”，但玩家只能看到四条成长线的已获得数量，还需要自行扫描项目列表，才能判断下一条总产能、点击、自动或过载奖励分别来自哪个航段。

本轮决策：

- 在星图总览新增“奖励目标”，按总产能、点击、自动和过载分别显示下一条未完成奖励航段、奖励内容和当前进度。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的成长线目标可见性。
- 静态 HTML 初始文案同步到奖励目标，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖初始状态、进行中状态和全部完成状态的奖励目标文案。
- 构建产物已包含“奖励目标”、`projectOverviewRewardTargets` 和 `rewardTargetText`。
- GitHub Pages workflow 25086307782 已成功，线上地址返回 HTTP 200，发布文件包含“奖励目标”、`projectOverviewRewardTargets` 和 `rewardTargetText`。
- #2 已回复并保持 open，等待复测确认奖励目标是否改善四条成长线的目标识别和内容丰富度感知。

下一步：继续观察 #2 复测是否认为奖励目标改善四条成长线的目标识别和内容丰富度感知。

## 2026-04-29 Product decision：星图奖励进度

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览按章节汇总奖励数量，但这些数量仍是静态总量，玩家无法直接看到四条奖励线已经拿到多少、还剩多少。

本轮决策：

- 在星图总览新增“奖励进度”，按总产能、点击、自动和过载显示已生效奖励数/总奖励数。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的成长线进度可见性。
- 静态 HTML 初始文案同步到奖励进度，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:02 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖初始状态、进行中状态和全部完成状态的奖励进度文案。
- 构建产物已包含“奖励进度”、`projectOverviewRewardProgress` 和 `rewardProgressText`。
- GitHub Pages workflow 25085902738 已成功，线上地址返回 HTTP 200，发布文件包含“奖励进度”、`projectOverviewRewardProgress` 和 `rewardProgressText`。
- #2 已回复并保持 open，等待复测确认奖励进度是否改善成长线余量和内容丰富度感知。

下一步：继续观察 #2 复测是否认为奖励进度改善成长线余量和内容丰富度感知。

## 2026-04-29 Product decision：星图章节奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览按章节列出各自下一段目标，但玩家仍需要把章节目标、航线构成和奖励分布自行合并，才能判断每个章节分别提供哪些成长方向。

本轮决策：

- 在星图总览新增“章节奖励”，按首段星图、专精校准、深空基建、远航长尾汇总各章节的总产能、点击、自动和过载奖励数量。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的章节主题和奖励主题可见性。
- 静态 HTML 初始文案同步到章节奖励，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:49 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖章节奖励在初始状态、进行中状态和全部完成状态的文案。
- 构建产物已包含“章节奖励”、`projectOverviewChapterRewards` 和 `chapterRewardText`。
- GitHub Pages workflow 25085541649 已成功，线上地址返回 HTTP 200，发布文件包含“章节奖励”、`chapterRewardText` 和 `projectOverviewChapterRewards`。
- #2 已回复并保持 open，等待复测确认章节奖励是否改善章节主题和奖励丰富度感知。

下一步：继续观察 #2 复测是否认为章节奖励改善章节主题和奖励丰富度感知。

## 2026-04-29 Product decision：星图章节目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把章节内位置下沉到项目列表和阶段导航当前项，但星图总览仍只突出当前章节的位置，玩家要理解其他章节“下一段是什么”仍需要扫描完整项目列表。

本轮决策：

- 在星图总览新增“章节目标”，按首段星图、专精校准、深空基建、远航长尾列出每个章节的下一段未完成目标，已完成章节显示“已完成”。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的跨章节内容预期。
- 静态 HTML 初始文案同步到章节目标，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:35 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖章节目标在初始状态、进行中状态和全部完成状态的文案。
- 构建产物已包含“章节目标”、`projectOverviewChapterTargets` 和 `chapterTargetText`。
- GitHub Pages workflow 25085160189 已成功，线上地址返回 HTTP 200，发布文件包含“章节目标”、`projectOverviewChapterTargets` 和 `chapterTargetText`。
- #2 已回复并保持 open，等待复测确认章节目标是否改善跨章节内容预期和内容丰富度感知。

下一步：继续观察 #2 复测是否认为章节目标改善跨章节内容预期和内容丰富度感知。

## 2026-04-29 Product decision：星图章节内位置

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把项目列表标记到四个章节，但项目卡片只显示章节名，玩家扫描列表时仍需要回到阶段导航才能判断“这是本章节第几段”。

本轮决策：

- 为每个星图项目派生章节内位置：章节名、章节内序号、章节总数和章节位置文本。
- 星图项目列表的章节徽标改为显示“首段星图 2/4”这类章节内位置；阶段导航当前项同步显示章节内位置和全局航段号。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的章节扫描效率。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:21 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖章节内序号、最终阶段余量和项目列表章节文本。
- 构建产物已包含 `chapterText` 渲染字段和“首段星图 1/4”静态初始文案。
- GitHub Pages workflow 25084767463 已成功，线上地址返回 HTTP 200，发布文件包含“首段星图 1/4”和 `chapterText`。
- #2 已回复并保持 open，等待复测确认章节内位置是否改善项目列表扫描和后续内容感知。

下一步：继续观察 #2 复测是否认为章节内位置改善项目列表扫描和后续内容感知。

## 2026-04-29 Product decision：星图项目章节标记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序迭代已经在星图总览中补齐阶段导航、阶段余量、目标分轨和航线构成，但玩家在下方 31 段项目列表里逐项扫描时，仍主要看到航段号和当前航段标记，列表本体的章节归属不够直接。

本轮决策：

- 为每个星图项目派生并显示所属章节：首段星图、专精校准、深空基建、远航长尾。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；只增强已有项目列表的章节识别。
- 保持星图总览、主目标、航线策略和反馈入口行为不变。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:07 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖项目章节映射。
- 构建产物已包含 `project-chapter-badge` 渲染样式和 `chapterName` 渲染字段。
- GitHub Pages workflow 25084357042 已成功，线上地址返回 HTTP 200，且发布文件包含 `project-chapter-badge` 和 `chapterName`。
- #2 已回复并保持 open，等待复测确认项目列表章节标记是否改善内容层次感和后续内容感知。

下一步：继续观察 #2 复测是否认为项目列表章节标记改善内容层次感和后续内容感知。

## 2026-04-29 Product decision：星图阶段余量

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经在星图总览新增阶段导航，但阶段导航只说明当前处于哪个阶段，没有直接告诉玩家“这个阶段还剩几段”和“下一阶段是什么”，章节感仍可继续增强。

本轮决策：

- 在阶段导航中追加“本阶段还剩 X 段”和“下一阶段 Y / 最终阶段”。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的章节进度可见性。
- 静态 HTML 初始文案同步到新的阶段余量展示，避免加载前信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:53 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖当前阶段余量和最终阶段余量。
- 构建产物 dist 包含“本阶段还剩”和 `projectOverviewChapter` 渲染字段。
- GitHub Pages workflow 25083929387 已成功，线上地址返回 HTTP 200，且发布文件包含“本阶段还剩”。
- #2 已回复并保持 open，等待复测确认阶段余量是否改善内容层次感和后续内容感知。

下一步：继续观察 #2 复测是否认为阶段余量改善内容层次感和后续内容感知。

## 2026-04-29 Product decision：星图阶段导航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经补充航线构成和奖励分布，但总览仍把 31 段内容主要表达为目标类型和奖励类型，缺少“章节感”。继续追加第 32 段会增加路线长度，却不一定让玩家更快理解已有内容跨度。

本轮决策：

- 在星图总览中新增“阶段导航”，把 31 段星图拆成首段星图、专精校准、深空基建、远航长尾四个阶段。
- 每个阶段显示已完成数/总数，并追加当前阶段、当前航段序号和当前项目名。
- 不新增存档字段、不调整奖励数值和升级价格，不改变项目完成判定；先提升已有内容的章节感和路线层次。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:40 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星图总览阶段导航和全部完成状态。
- 构建产物 dist 包含“阶段导航”和 `projectOverviewChapter` 渲染字段。
- 发布前未发现 open bug 或测试失败。
- GitHub Pages workflow 25083504675 已成功，线上地址返回 HTTP 200，发布文件包含“阶段导航”。
- #2 已回复并保持 open，等待复测确认阶段导航是否改善内容层次感和内容丰富度感知。

下一步：继续观察 #2 复测是否认为阶段导航改善内容层次感和内容丰富度感知。

## 2026-04-29 Product decision：星图航线构成

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经补充“目标分轨”，继续只追加新终点会让内容感知更依赖线性长度，而不是让玩家理解现有 31 段星图由哪些目标类型和奖励方向组成。

本轮决策：

- 在星图总览中新增“航线构成”，显示 22 个累计航段和 9 个升级航段。
- 同一行显示奖励分布：总产能 10 段、点击 8 段、自动 8 段、过载 5 段。
- 不新增存档字段、不调整奖励数值和升级价格，不改变项目完成判定；先提升已有内容的结构可见性。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:27 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星图总览航线构成和全部完成状态。
- 构建产物 dist 包含“航线构成”和 `projectOverviewComposition` 渲染字段。
- GitHub Pages workflow 25083078319 已成功，线上地址返回 HTTP 200，发布文件包含“航线构成”。
- #2 已回复并保持 open，等待复测确认航线构成和奖励分布是否改善内容丰富度感知。

下一步：继续观察 #2 复测是否认为航线构成和奖励分布改善内容丰富度感知。

## 2026-04-29 Product decision：星图目标分轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。过去多轮主要用新增长尾航段延长内容边界，但 100K 后玩家在总览里仍主要看到一个线性下一目标和一个最多 3 项预告，较难同时识别“累计能量航段”和“升级航段”两条推进线。

本轮决策：

- 在星图总览中新增“目标分轨”，同时显示下一个未完成累计航段和下一个未完成升级航段。
- 不新增存档字段、不调整既有奖励数值和升级价格，不改变项目完成判定；先提升已有 31 段星图内容的结构可见性。
- 页面初始文案同步到 31 段，避免静态 HTML 与当前项目总数不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:19 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星图总览目标分轨和全部完成状态。
- 构建产物 dist 包含目标分轨文案和渲染字段。
- GitHub Pages workflow 25082651631 已成功，线上地址返回 HTTP 200，发布文件包含“目标分轨”。
- #2 已回复并保持 open，等待复测确认目标分轨是否改善内容丰富度和中后段目标识别。

下一步：继续观察 #2 复测是否认为目标分轨改善内容丰富度和中后段目标识别。

## 2026-04-29 Product decision：晨渊观星台航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 65M 的星冠回声站，但星冠回声站完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“晨渊观星台”航段，要求累计 85M 能量，奖励点击产能 +19%。
- 星图路线从 30 段扩展到 31 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个星冠回声站后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:57 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星冠回声站完成后继续指向晨渊观星台、31 段航线序号和全部完成总览。
- 构建产物 dist 包含晨渊观星台。
- GitHub Pages workflow 25082177564 已成功，线上地址返回 HTTP 200，且发布文件包含晨渊观星台。
- #2 已回复并保持 open，等待复测确认晨渊观星台是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为晨渊观星台改善长尾内容丰富度。

## 2026-04-29 Product decision：星冠回声站航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 50M 的远曦灯塔，但远曦灯塔完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“星冠回声站”航段，要求累计 65M 能量，奖励过载奖励 +19%。
- 星图路线从 29 段扩展到 30 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个远曦灯塔后续航段继续延长现有路线，并把奖励落到过载奖励成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖远曦灯塔完成后继续指向星冠回声站、30 段航线序号和全部完成总览。
- 构建产物 dist 已包含星冠回声站。
- GitHub Pages workflow 25081716589 已成功，线上地址返回 HTTP 200，且发布文件包含星冠回声站。
- #2 已回复并保持 open，等待复测确认星冠回声站是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为星冠回声站改善长尾内容丰富度。

## 2026-04-29 Product decision：远曦灯塔航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 38M 的离辉轨道港，但离辉轨道港完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“远曦灯塔”航段，要求累计 50M 能量，奖励总产能 +19%。
- 星图路线从 28 段扩展到 29 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个离辉轨道港后续航段继续延长现有路线，并把奖励落到总产能成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:32 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖离辉轨道港完成后继续指向远曦灯塔、29 段航线序号和全部完成总览。
- 构建产物 dist 已包含远曦灯塔。
- GitHub Pages workflow 25081269321 已成功，线上地址返回 HTTP 200，且发布文件包含远曦灯塔。
- #2 已回复并保持 open，等待复测确认远曦灯塔是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为远曦灯塔改善长尾内容丰富度。

## 2026-04-29 Product decision：离辉轨道港航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 30M 的脉冲航闸，但脉冲航闸完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“离辉轨道港”航段，要求累计 38M 能量，奖励自动产能 +18%。
- 星图路线从 27 段扩展到 28 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个脉冲航闸后续航段继续延长现有路线，并把奖励落到自动成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:17 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖脉冲航闸完成后继续指向离辉轨道港、28 段航线序号和全部完成总览。
- 构建产物 dist 已包含离辉轨道港。
- GitHub Pages workflow 25080761749 已成功，线上地址返回 HTTP 200，且发布文件包含离辉轨道港。
- #2 已回复并保持 open，等待复测确认离辉轨道港是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为离辉轨道港改善长尾内容丰富度。

## 2026-04-29 Product decision：脉冲航闸航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 24M 的引潮星环，但引潮星环完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“脉冲航闸”航段，要求累计 30M 能量，奖励点击产能 +18%。
- 星图路线从 26 段扩展到 27 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个引潮星环后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:04 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖引潮星环完成后继续指向脉冲航闸、27 段航线序号和全部完成总览。
- GitHub Pages workflow 25080325889 已成功，线上地址返回 HTTP 200，且发布文件包含脉冲航闸。
- #2 已回复并保持 open，等待复测确认脉冲航闸是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为脉冲航闸改善长尾内容丰富度。

## 2026-04-29 Product decision：引潮星环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 20M 的磁帆穹顶，但磁帆穹顶完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“引潮星环”航段，要求累计 24M 能量，奖励过载奖励 +18%。
- 星图路线从 25 段扩展到 26 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个磁帆穹顶后续航段继续延长现有路线，并把奖励落到过载成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:51 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖磁帆穹顶完成后继续指向引潮星环、26 段航线序号和全部完成总览。
- GitHub Pages workflow 25079781899 已成功，线上地址返回 HTTP 200，且发布文件包含引潮星环。
- #2 已回复并保持 open，等待复测确认引潮星环是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为引潮星环改善长尾内容丰富度。

## 2026-04-29 Product decision：磁帆穹顶航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 16.5M 的日冕回廊，但日冕回廊完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“磁帆穹顶”航段，要求累计 20M 能量，奖励总产能 +18%。
- 星图路线从 24 段扩展到 25 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个日冕回廊后续航段继续延长现有路线，并把奖励落到总产能成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:38 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖日冕回廊完成后继续指向磁帆穹顶、25 段航线序号和全部完成总览。
- GitHub Pages workflow 25079287266 已成功，线上地址返回 HTTP 200，且发布文件包含磁帆穹顶。
- #2 已回复并保持 open，等待复测确认磁帆穹顶是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为磁帆穹顶改善长尾内容丰富度。

## 2026-04-29 Product decision：日冕回廊航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 13.5M 的极昼折跃井，但极昼折跃井完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“日冕回廊”航段，要求累计 16.5M 能量，奖励自动产能 +16%。
- 星图路线从 23 段扩展到 24 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个极昼折跃井后续航段继续延长现有路线，并把奖励落到自动成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:26 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖极昼折跃井完成后继续指向日冕回廊、24 段航线序号和全部完成总览。
- GitHub Pages workflow 25078802380 已成功，线上地址返回 HTTP 200，且发布文件包含日冕回廊。
- #2 已回复并保持 open，等待复测确认日冕回廊是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为日冕回廊改善长尾内容丰富度。

## 2026-04-29 Product decision：极昼折跃井航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 11M 的寂光中继环，但寂光中继环完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“极昼折跃井”航段，要求累计 13.5M 能量，奖励点击产能 +16%。
- 星图路线从 22 段扩展到 23 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个寂光中继环后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:14 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖寂光中继环完成后继续指向极昼折跃井、23 段航线序号和全部完成总览。
- GitHub Pages workflow 25078221692 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open，等待复测确认极昼折跃井是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为极昼折跃井改善长尾内容丰富度。

## 2026-04-29 Product decision：寂光中继环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 9M 的深穹测距阵，但深穹测距阵完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“寂光中继环”航段，要求累计 11M 能量，奖励过载奖励 +16%。
- 星图路线从 21 段扩展到 22 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个深穹测距阵后续航段继续延长现有路线，并把奖励落到过载成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:00 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖深穹测距阵完成后继续指向寂光中继环、22 段航线序号和全部完成总览。
- GitHub Pages workflow 25077653548 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为寂光中继环改善长尾内容丰富度。

## 2026-04-29 Product decision：深穹测距阵航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 7.25M 的星云档案库，但星云档案库完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“深穹测距阵”航段，要求累计 9M 能量，奖励总产能 +17%。
- 星图路线从 20 段扩展到 21 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个星云档案库后续航段继续延长现有路线，并把奖励落到总产能成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:48 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星云档案库完成后继续指向深穹测距阵、21 段航线序号和全部完成总览。
- GitHub Pages workflow 25077104300 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为深穹测距阵改善长尾内容丰富度。

## 2026-04-29 Product decision：星云档案库航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 5.75M 的虚空罗盘，但虚空罗盘完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“星云档案库”航段，要求累计 7.25M 能量，奖励自动产能 +17%。
- 星图路线从 19 段扩展到 20 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个虚空罗盘后续航段继续延长现有路线，并把奖励落到自动成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:32 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖虚空罗盘完成后继续指向星云档案库、20 段航线序号和全部完成总览。
- GitHub Pages workflow 25076465558 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为星云档案库改善长尾内容丰富度。

## 2026-04-29 Product decision：虚空罗盘航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 4.5M 的暗流观测站，但暗流观测站完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“虚空罗盘”航段，要求累计 5.75M 能量，奖励点击产能 +15%。
- 星图路线从 18 段扩展到 19 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个暗流观测站后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖暗流观测站完成后继续指向虚空罗盘、19 段航线序号和全部完成总览。
- GitHub Pages workflow 25075816843 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为虚空罗盘改善长尾内容丰富度。

## 2026-04-29 Product decision：暗流观测站航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 3.5M 的引力航标，但引力航标完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“暗流观测站”航段，要求累计 4.5M 能量，奖励过载奖励 +15%。
- 星图路线从 17 段扩展到 18 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个引力航标后续航段继续延长现有路线，并把奖励落到过载成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:06 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过。
- 测试覆盖引力航标完成后继续指向暗流观测站、18 段航线序号和全部完成总览。
- GitHub Pages workflow 25075213288 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：继续观察 #2 复测是否认为暗流观测站改善长尾内容丰富度。

## 2026-04-29 Product decision：引力航标航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 2.75M 的彗尾船坞，但彗尾船坞完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“引力航标”航段，要求累计 3.5M 能量，奖励总产能 +15%。
- 星图路线从 16 段扩展到 17 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个彗尾后续航段继续延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:53 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖彗尾船坞完成后继续指向引力航标、17 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25074556183 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：继续观察 #2 复测是否认为引力航标改善长尾内容丰富度。

## 2026-04-29 Product decision：彗尾船坞航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 2M 的外环信标，但外环信标完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“彗尾船坞”航段，要求累计 2.75M 能量，奖励自动产能 +18%。
- 星图路线从 15 段扩展到 16 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个外环后续航段继续延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- npm test 通过，覆盖外环信标完成后继续指向彗尾船坞、16 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25073990022 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：继续观察 #2 复测是否认为彗尾船坞改善长尾内容丰富度。

## 2026-04-29 Product decision：外环信标航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 1.5M 的星门远征，但星门远征完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“外环信标”航段，要求累计 2M 能量，奖励点击产能 +14%。
- 星图路线从 14 段扩展到 15 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个星门后续航段继续延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:26 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖星门远征完成后继续指向外环信标、15 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25073461380 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：继续观察 #2 复测是否认为外环信标改善长尾内容丰富度。

## 2026-04-29 Product decision：星门远征航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把航线策略和策略专精进度关联到同屏，但当玩家完成现有 13 段星图路线后仍会回到循环累计目标，后续内容边界过早暴露。

本轮决策：

- 新增“星门远征”航段，要求累计 1.5M 能量，奖励总产能 +16%。
- 星图路线从 13 段扩展到 14 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个深空后续航段延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:19 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- bun run test 通过，覆盖深空航段完成后继续指向星门远征、14 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25072808220 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open，等待复测确认 1.5M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星门远征改善长尾内容丰富度。

## 2026-04-29 Product decision：航线专精进度展示

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把航线策略扩展为点火航校、巡航航校和均衡校准三段专精目标，但策略按钮本身仍只显示倍率摘要，玩家需要去项目列表里对照对应专精航段。

本轮决策：

- 航线策略定义绑定对应专精航段：均衡航线对应均衡校准，点火优先对应点火航校，巡航优先对应巡航航校。
- 航线策略按钮在 100K 解锁后显示对应专精航段进度或完成状态。
- 不新增存档字段、不调整奖励数值和升级价格，先把主动策略选择和现有可追目标连起来。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:57 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun run test 通过，覆盖航线策略专精进度和已完成状态。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25072150110 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：发布后观察 #2 复测是否认为航线策略和策略专精目标的关联更清晰。

## 2026-04-29 Product decision：星图策略专精航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮航线策略增加了主动选择，但这些策略还缺少对应的可追目标，玩家可能只感知为倍率开关。

本轮决策：

- 新增点火航校，要求聚能透镜达到 14 级，奖励点击产能 +16%。
- 新增巡航航校，要求自动采集臂达到 14 级，奖励自动产能 +16%。
- 新增均衡校准，要求星核稳定器达到 14 级，奖励总产能 +14%。
- 星图路线从 10 段扩展到 13 段；主目标、总览、航线预告和项目列表沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有项目奖励和升级价格，先把航线策略变成可追的中后段目标。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:41 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖新增策略专精航段、13 段航线序号、策略专精奖励叠加和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25071584006 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：发布后观察 #2 复测是否认为航线策略从“倍率选择”变成了可玩的中后段目标。

## 2026-04-29 Product decision：星图航线策略

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮航段序号后没有新的复测结论。星图计划已经扩展了路线、奖励和导航，但玩家在 100K 后仍主要是沿一条固定路线推进，缺少一个可主动切换的玩法选择。

本轮决策：

- 新增星图航线策略，累计 100K 能量后解锁。
- 提供“均衡航线”“点火优先”“巡航优先”三种策略。
- 点火优先提升点击产能和过载奖励；巡航优先提升自动产能；均衡航线保持当前产能分配。
- 航线策略进入本地存档、产能计算、界面按钮和反馈快照。
- 不新增星图项目、不改既有星图奖励和升级价格，先用一组轻量可切换策略提升中后段主动选择感。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:34 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖 100K 后航线策略解锁、点火优先产能变化、旧存档未知策略兼容和反馈快照中的航线策略。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25070815559 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 保持 open；等待玩家复测航线策略是否改善内容丰富度和主动选择感。

## 2026-04-29 Product decision：星图航段序号

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮当前航段标记后没有新的复测结论。星图项目已经有总览、奖励预告和当前航段高亮，但玩家在主目标条和项目列表中仍只能从项目数量间接感知路线规模，缺少“当前是第几段/总共几段”的直接信号。

本轮决策：

- 为星图项目状态派生 `segmentIndex`、`segmentTotal` 和 `segmentText`。
- 星图总览显示“下一段 X/10：项目名”，把下一段目标和完整航线规模放在同一行。
- 星图主目标进度前置“航段 X/10”，让当前追逐目标直接带有路线位置。
- 星图项目列表显示“航段 X/10”徽章，并继续只把第一个未完成项目标为“当前航段”。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的规模感和导航清晰度。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:12 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm install 成功。
- npm test 通过，覆盖星图航段序号、总览下一段序号和星图主目标航段文案。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25070035103 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 保持 open；等待玩家复测航段序号是否改善中后段内容规模感和目标定位。

## 2026-04-29 Product decision：星图当前航段标记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，且上一轮过载谐振成长线后没有新的复测结论。星图总览已经显示下一段和后续航线，但项目列表本身仍缺少“当前正在推进哪一段”的直接标记，玩家在多个中后段项目之间还需要自行对照总览和列表。

本轮决策：

- 为星图项目状态派生 `isCurrent`，只标记第一个未完成项目。
- 星图项目列表对当前项目显示“当前航段”徽章并高亮。
- 全部星图项目完成时不显示当前航段，避免误导。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的导航清晰度。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:55 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm install 成功。
- npm test 通过，覆盖星图项目只会标记第一个未完成项目为当前航段，全部完成时没有当前航段。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25069380519 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 已回复并保持 open；等待玩家复测当前航段标记是否改善中后段目标识别。

## 2026-04-29 Product decision：过载谐振线

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序迭代已经扩展星图目标、奖励预告和生效加成，但中后段成长方向仍主要围绕点击产能、自动产能和总产能，早期的过载点击机制没有形成后续成长线。

本轮决策：

- 新增“星核谐振器”升级，提升每次过载触发的奖励。
- 顶部产能区新增“过载”数值，让玩家能直接看到当前过载奖励。
- 星图计划在点亮星图后新增“谐振校准”项目，要求星核谐振器达到 6 级，奖励过载奖励 +20%。
- 反馈快照补充过载奖励字段，后续反馈能带上这条新成长线的状态。
- 不调整 100K 前目标顺序、不改已有升级价格、不新增远端指标，先用一条小型可测试成长线回应内容不足反馈。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:39 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖星核谐振器购买、100K 后谐振校准接管星图目标、星图总览预告和过载奖励叠加。
- npm install 成功。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25068686413 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 已回复并保持 open；等待玩家复测过载谐振成长线是否改善内容丰富度和主动点击成长感知。

## 2026-04-29 Product decision：星图航线奖励预告

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。星图总览已经显示下一段、后续航线和已生效加成，但航线预告只列项目名，玩家仍需要去项目列表里逐项查看后续奖励。

本轮决策：

- 在星图总览的“航线预告”中，把最多 3 个未完成项目的名称和奖励一起展示。
- 全部项目完成后的等待下一段航线文案保持不变。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有后续内容的成长预期可见性。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:29 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- npm install 成功。
- npm test 通过，覆盖星图总览航线预告中的后续项目奖励文案。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25067860271 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测航线奖励预告是否改善内容丰富度和后续奖励感知。

## 2026-04-29 Product decision：星图加成总览

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序迭代已经让星图总览显示下一段目标、奖励和后续航线，但玩家完成项目后，仍需要从产能数字变化中反推“已完成内容正在带来什么长期收益”。

本轮决策：

- 在星图总览中新增“生效加成”，汇总当前已完成星图项目带来的总产能、点击产能和自动产能倍率。
- 尚未完成任何星图项目时显示等待首个星图奖励。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有内容和长期成长之间的可见关联。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- npm install 成功。
- npm test 通过，覆盖首个星图项目前、部分星图奖励生效后、全部星图项目完成后的加成总览文案。
- npm run build 生成 dist。
- GitHub Pages workflow 25067331498 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图加成总览是否改善内容丰富度和成长反馈感知。

## 2026-04-29 Product decision：星图航线预告

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮星图总览已经集中展示下一段目标和奖励，但玩家仍只能看到一个下一目标，难以快速感知后续还有多少连续内容。

本轮决策：

- 在星图总览中新增“航线预告”，展示最多 3 个未完成星图项目。
- 全部项目完成后，航线预告显示等待下一段航线。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的连续性可见度。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:05 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖星图总览的后续项目预告，以及全部项目完成后的预告状态。
- npm run build 生成 dist。
- GitHub Pages workflow 25066765644 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图航线预告是否改善内容丰富度和后续目标感知。

## 2026-04-29 Product decision：星图总览

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。星图计划已经延伸到 500K 后，但侧栏只逐项罗列项目，玩家缺少一个快速判断“已完成多少、下一段是什么、奖励是什么”的总览。

本轮决策：

- 在星图计划列表前新增星图总览。
- 总览显示已完成项目数/总项目数、下一段项目名称、下一段奖励和对应进度详情。
- 全部项目完成后显示全部航段已完成和奖励已生效状态。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的可读性。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm test 通过，覆盖中后段玩家的星图总览，以及全部星图项目完成后的总览状态。
- npm install 成功。
- npm run build 生成 dist。
- GitHub Pages workflow 25066081325 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图总览是否改善内容丰富度和后续目标感知。

## 2026-04-29 Product decision：深空航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经补强星图项目完成反馈，但远星中继完成后仍会回到循环累计目标；对中后段玩家来说，500K 后还需要看到下一段明确内容。

本轮决策：

- 在远星中继之后新增深空矿带，要求累计 750K 能量，奖励点击产能 +26%。
- 新增星环工厂，要求自动采集臂达到 16 级，奖励自动产能 +30%。
- 新增恒星锚点，要求星核稳定器达到 16 级，奖励总产能 +22%。
- 不调整 100K 前目标、反馈入口、部署基础设施和已有升级曲线，先扩展星图项目层的后续目标密度。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:32 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖 500K 后继续指向深空矿带，以及深空航段完成后的项目奖励叠加。
- npm run build 生成 dist。
- GitHub Pages workflow 25065455400 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测 500K 后深空航段是否改善内容丰富度。

## 2026-04-29 Product decision：星图奖励完成反馈

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经扩展 250K 后长尾项目，但项目完成瞬间只提示目标切换，没有明确确认“刚获得了什么奖励”，中后段内容的完成感仍可能被弱化。

本轮决策：

- 星图项目完成并切换到下一目标时，在操作提示中追加“获得奖励：X”。
- 普通早期目标完成提示保持原文案，不额外制造奖励描述。
- 不调整升级曲线、星图项目数量、奖励数值和反馈入口，先补强已有中后段内容的完成反馈。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:21 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖星桥试运行完成后提示已获得总产能奖励并切换到稳定矩阵。
- npm run build 生成 dist。
- GitHub Pages workflow 25064855163 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图项目完成提示是否改善中后段完成感和内容丰富度感知。

## 2026-04-29 Product decision：星图长尾目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：上一轮已让星图项目进入主目标并显示奖励，但星桥试运行之后仍会回到循环累计目标。对“内容丰富度太差”的反馈来说，首批星图项目完成后还需要继续看到 250K 之后的可追目标。

本轮决策：

- 在星桥试运行之后新增稳定矩阵和远星中继两个星图项目。
- 稳定矩阵要求星核稳定器达到 12 级，并奖励总产能 +18%。
- 远星中继要求累计 500K 能量，并奖励自动产能 +24%。
- 保持 100K 前目标、反馈入口、部署基础设施和已有升级曲线不变，先扩展星图长尾而不引入主动分支系统。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:06 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖首批星图项目完成后继续指向稳定矩阵，以及远星中继完成后的自动产能奖励。
- npm run build 生成 dist。
- GitHub Pages workflow 25064242368 已成功。

下一步：#2 已回复并保持 open；等待玩家复测 250K 后长尾星图目标是否改善内容丰富度。

## 2026-04-28 Product decision：星图奖励进主目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：星图计划已经接管 100K 后主目标，但目标条只显示进度和下一步购买动作，奖励仍主要在侧栏项目列表里。对“内容丰富度太差”的反馈来说，主操作区需要直接说明完成当前计划会带来什么成长。

本轮决策：

- 星图项目进入主目标条时，把项目奖励随进度文案一起展示。
- 透镜阵列、采集阵列仍保留对应升级的可购买/能量缺口提示，并追加奖励说明。
- 100K 前目标、项目奖励数值、反馈入口和部署基础设施保持不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:55 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖星图主目标显示奖励文案。
- npm run build 生成 dist。

下一步：#2 保持 open；等待玩家复测主目标条同时显示行动和奖励后，确认内容丰富度感知是否改善。

## 2026-04-28 Product decision：星图主目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：上一轮已新增 100K 后星图计划，但主目标条在中后段仍可能回到“累计 X 能量”的循环目标。对反馈“内容丰富度太差”的玩家来说，新内容应进入主操作区，而不只是在侧栏等待玩家发现。

本轮决策：

- 100K 后且基础目标完成时，当前目标优先指向下一个未完成的星图计划项目。
- 透镜阵列和采集阵列复用升级行动提示，并继续高亮对应升级卡片。
- 100K 前仍保留短周期累计能量目标，避免过早把玩家推向跨度过大的长期目标。
- 保持星图项目奖励、反馈入口、部署基础设施和数值曲线不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:43 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖 100K 后星图项目接管当前目标，以及 100K 前仍保留短周期累计目标。
- npm run build 生成 dist。

下一步：#2 已回复并保持 open；等待玩家复测星图计划在主目标条出现后是否缓解内容不足感。

## 2026-04-28 Product decision：星图计划

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 出现真实体验反馈 #2，进入有反馈样本下的 Product decision。

当前最大问题：#2 评分 3/5，玩家在累计 114.5K 能量、升级 lens:11 / collector:11 / stabilizer:9 后反馈“内容丰富度太差，可玩的内容太少”。当前稳定器之后只剩循环累计目标，缺少新的中后段追逐对象。

本轮决策：

- 新增“星图计划”项目层，提供点亮星图、透镜阵列、采集阵列和星桥试运行 4 个中后段目标。
- 项目按累计能量或升级等级自动完成，完成后提供总产能、点击产能或自动产能奖励。
- 侧栏显示每个项目的进度、剩余量、完成状态和奖励，给 100K 以后玩家明确的下一步内容。
- 保持反馈入口、部署基础设施和原有升级曲线不变，先用小型可验证内容层回应真实反馈。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:23 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已补充 feedback 标签。
- npm install 成功。
- npm test 通过，覆盖星图项目进度和项目奖励后的有效产能。
- npm run build 生成 dist。

下一步：#2 已回复并保持 open；继续观察玩家复测后是否仍认为内容不足，再决定是否引入主动选择、分支升级或重置循环。

## 2026-04-28 Product decision：目标升级推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条已经说明下一步关键升级，但升级区没有视觉锚点，玩家仍需要在卡片列表里自行匹配目标对应的升级。

本轮决策：

- 为购买型目标暴露对应 upgradeId。
- 升级区将当前目标对应卡片高亮，并显示“目标推荐”标记。
- 保持数值曲线、目标顺序、反馈入口和部署基础设施不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:12 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖购买型目标到升级推荐的映射。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，继续围绕 30 秒内的目标理解、升级选择和反馈入口转化做小步优化。

## 2026-04-28 Product decision：目标完成反馈

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条能显示下一步和剩余量，但完成目标的那一刻只会切换到新目标，玩家缺少明确的“已完成/下一目标”反馈。

本轮决策：

- 点击、购买升级或自动产能推进目标时，在主操作区拼接显示目标完成和下一目标。
- 新增本地 `goal_complete` 事件，记录完成目标和下一目标，用于验证目标链路是否被触发。
- 保持数值曲线、升级顺序、反馈入口和部署基础设施不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:02 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖目标完成提示拼接。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，继续围绕 30 秒内的目标完成、升级选择和反馈入口转化做小步优化。

## 2026-04-28 Product decision：操作反馈可见性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条和升级卡片已经说明下一步还差多少，但玩家完成点击或购买后仍需要从数值变化中反推本次行动收益，早期正反馈不够明确。

本轮决策：

- 点击星核后在主操作区显示本次获得的能量。
- 第八次连击触发过载时，操作提示显示本次总收益并标明“含过载”。
- 购买升级后显示已购买升级、新等级和当前产能结果。
- 保持数值曲线、升级顺序、部署和反馈基础设施不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:51 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖点击收益提示和升级购买提示。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，继续围绕 30 秒内的行动反馈、目标理解和反馈入口转化做小步优化。

## 2026-04-28 Product decision：目标行动提示

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条已显示“进度/剩余量”，但购买型目标仍以“还差 1 次升级/1 级”表达，玩家需要再去升级区匹配下一步实际需要多少能量。

本轮决策：

- 为购买型目标补充关键升级行动提示：首次升级指向聚能透镜，自动产能指向自动采集臂，稳定器目标指向星核稳定器。
- 目标条在未满足购买条件时显示“还差 X 能量购买 Y”，满足条件时显示“可购买 Y”。
- 保持数值曲线、目标顺序和反馈基础设施不变，继续优先降低早期目标理解成本。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:37 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖购买型目标的能量缺口和可购买提示。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先继续优化 30 秒内点击、购买与目标条之间的一致性。

## 2026-04-28 Product decision：过载进度可读性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：第八次连击会触发过载奖励，但界面只显示连击数和“稳定/过载”状态，玩家无法直接判断还差几次点击触发下一次奖励。

本轮决策：

- 将过载间隔提取为可测试常量，并返回连击数、过载进度、剩余点击数和触发状态。
- 在连击状态栏显示“过载 X/8”和“距过载 X 次”，触发时保留过载奖励反馈。
- 修正旧发布脚本中的测试绕过，确保 deploy/autopush 路径在测试失败时停止。
- 保持升级、目标、离线收益和反馈基础设施不变，继续优先补强 30 秒内核心循环的状态可见性。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:25 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖连击过载进度和剩余点击数。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先观察早期点击节奏和反馈表单转化是否需要更清晰的微文案。

## 2026-04-28 Product decision：目标进度可读性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：当前目标只显示目标名称和进度条，玩家无法直接看到“已经完成多少、还差多少”，目标条的信息密度低于升级卡片。

本轮决策：

- 为当前目标返回 currentValue、remaining 和 progressText。
- 在目标条中显示“进度 X / Y · 还差 Z”，覆盖首次升级、自动采集、累计能量、稳定器和循环目标。
- 保持数值曲线、升级成本和反馈基础设施不变，避免无反馈时扩大系统复杂度。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:16 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖当前目标进度和剩余量。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先继续补强 30 秒内目标链路的状态反馈。

## 2026-04-28 Product decision：升级可读性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 暂无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：升级按钮只显示等级和成本，玩家需要自行心算距离下一次正反馈还差多少能量，早期点击节奏不够清晰。

本轮决策：

- 为每个升级计算购买进度、剩余能量和可购买状态。
- 在升级卡片中显示“还差 X”或“可购买”，并加入非交互进度条，降低玩家判断下一步行动的成本。
- 保持数值曲线不变，不在无真实反馈时提前扩大系统复杂度。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:06 CST 查询到 0 个 open issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖升级购买进度计算。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先补充轻量目标链路或新手阶段的状态提示。

## 2026-04-28 Product decision

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 暂无真实玩家反馈，处于无反馈样本下的 Product decision。

当前最大问题：自动产能已经能在离线期间累计，但玩家回到页面时缺少明确回收反馈，放置玩法的“回来有收获”不够可见。

本轮决策：

- 读取存档时立即结算离线收益，沿用现有 8 小时离线收益上限。
- 当收益达到至少 1 能量且离线时间不少于 30 秒时，在主操作区显示一次离线回收提示。
- 记录本地 `offline_gain` 事件，用于验证离线收益触发；发布前仍不得把本地事件当作真实线上指标。

验收标准：

- GitHub Issues 已同步：2026-04-28 21:51 CST 查询到 0 个 open issue，#1 已关闭。
- npm install 成功。
- npm test 通过，覆盖离线收益结算摘要。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先补充轻量目标或升级可读性，而不是引入复杂后端。

## 2026-04-28 Feedback Infra

阶段判断：仓库已有 package.json、可玩游戏、构建脚本和 Vercel 发布版本；GitHub Pages 已可配置；游戏内尚缺少真实反馈入口，处于 Feedback infra。

当前最大问题：玩家无法从游戏界面直接提交结构化反馈，`feedback_sent` 指标也没有触发入口。

本轮决策：

- 在侧栏新增游戏内反馈表单，收集类型、评分和内容。
- 提交时生成预填的 GitHub Issue 草稿，并附带当前游戏快照，避免提交密钥或引入未验证后端。
- 本地记录最近 50 条反馈草稿，并写入 `feedback_sent` 事件，作为前端行为验证；发布前不得把本地记录当作真实线上指标。
- GitHub 仓库当前为 public，已通过 REST API 用 `build_type=workflow` 启用 GitHub Pages；issue #1 已在 deploy workflow 通过后回复并关闭。

验收标准：

- npm install 成功。
- npm test 通过，覆盖反馈 Issue 链接和游戏快照。
- npm run build 生成 dist。
- 主分支 push 后 GitHub Pages workflow 可部署，本轮 run 25056371852 已通过。

下一步：开始收集真实玩家反馈，优先观察 feedback issue 的内容质量和首批阻塞点。

## 2026-04-28 Build/Deploy Infra

阶段判断：仓库已有 package.json、浏览器游戏、测试和构建脚本，但 GitHub Pages 尚未配置，处于 Build/Deploy infra。

当前最大问题：主分支 push 后不会自动生成可访问的静态发布版本。

本轮决策：新增 GitHub Pages Actions workflow，并同步更新 workflow 生成脚本。CI 必须执行安装、测试和构建，测试失败不得继续部署。

执行结果：GitHub Actions build job 通过，但私有仓库当前计划不支持 GitHub Pages，已创建 issue #1 跟踪。为避免已知失败，Pages deploy job 仅在公开仓库执行；本轮已改用 Vercel 发布 `dist/`。

当前可访问版本：https://dist-kblvoc9qq-wangf930-2746s-projects.vercel.app

验收标准：

- npm install 成功。
- npm test 通过。
- npm run build 生成 dist。
- .github/workflows/pages.yml 存在并使用 npm install、npm test、npm run build。
- Vercel 部署状态为 READY。

下一步：部署成功后补齐游戏内反馈入口。

## 2026-04-28 Bootstrap

阶段判断：仓库没有 package.json，处于 Bootstrap。

当前最大问题：项目尚未初始化，玩家无法运行游戏。

本轮决策：先完成《星核工坊》最小可运行版本，包括静态页面、核心数值逻辑、测试与构建脚本。

验收标准：

- npm install 成功。
- npm test 通过。
- npm run build 生成 dist。

下一步：配置 GitHub Pages 或 Vercel preview，并增加稳定的玩家反馈入口。
