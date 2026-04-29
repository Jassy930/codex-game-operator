# Decision

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
