# Metrics

需要采集 session、click、first_upgrade_time、upgrade_purchase、offline_gain、goal_complete、route_stance、directive、sound_toggle、haptic_toggle、feedback_sent。

当前实现：

- 浏览器本地通过 localStorage 保存最近 200 条 session、click、first_upgrade_time、upgrade_purchase、goal_complete、reset 事件。
- 浏览器本地在玩家切换点火音效偏好时记录 sound_toggle 事件；音效偏好使用独立 localStorage key，不计入游戏进度存档。
- 浏览器本地在玩家切换点火触感偏好时记录 haptic_toggle 事件；触感偏好使用独立 localStorage key，不计入游戏进度存档。
- 浏览器本地在玩家切换星图航线策略时记录 route_stance 事件。
- 浏览器本地在玩家执行航线指令时记录 directive 事件，包含指令 id、本次即时收益、指令熟练收益、指令熟练倍率、当前熟练层、熟练叠层结果、预案执行奖励、航线委托奖励、远航调度奖励、远航续航奖励、远航协同奖励、协同补给当前能量、远航绕行奖励、分支改道奖励、路线稳航奖励、航段契合奖励、轮替闭环奖励、契合闭环奖励、路线按钮标记 `dispatchRouteStepText`、路线反馈 `dispatchRouteResultText`、绕行投送消耗、绕行投送累计推进、远航调度闭环奖励、远航突破奖励、绕行突破奖励、远航整备续航奖励、远航绕行整备奖励、远航整备回航奖励、远航整备刷新指令、远航调度冷却倍率、远航调度连携窗口、轮换目标奖励、满层回响奖励、策略终结奖励、策略契合奖励、策略契合倍率、航线连携层数和连携倍率。
- 指令轮换目标和 3 格视觉轨当前由本地冷却、连携字段与 `getDirectivePlan` 即时推导，不单独记录为真实线上指标。
- 点火阶段光环当前由本地连击进度与 `getComboStatus` 即时推导，不单独记录为真实线上指标；点火行为仍通过 click 事件复盘。
- 点火过载倒计时徽标当前由本地连击进度与 `getComboStatus` 即时推导，不单独记录为真实线上指标；点火行为仍通过 click 事件复盘。
- 星图总览航线预告视觉带当前由本地项目状态与 `getProjectForecastVisuals` 即时推导，不单独记录为真实线上指标；星图完成状态仍通过当前存档数值复盘。
- 远航调度接管下一步指令推荐、目标后的远航续航推荐、协同续航指令、协同按钮“远航协同/等待协同”推荐文案、推荐分支按钮“推荐协同/推荐绕行”及等待态、协同补给预览、协同后回目标的“协同回航/等待协同”推荐文案、绕行按钮“远航绕行/等待绕行”推荐文案、分支改道预览、路线稳航预览、航段契合预览、轮替闭环预览、契合闭环预览、远航推荐分支及其推荐原因与后续回航预告、分支轮替目标、路线履历、路线预案、路线步骤、闭环复盘、路线按钮标记、路线反馈、路线判断 `choice.decisionText`、路线判断状态 `choice.decisionKind` 与路线徽标 `choice.decisionBadgeText`、路线收益对照 `choice.payoffText`、路线目标 `choice.objectiveText`、路线下一步 `choice.followupText`、绕行投送预览、绕行后的“绕行整备/等待绕行整备”推荐文案、分支选择条及其推荐原因与后续回航预告、目标指令冷却缩短、调度接力窗口、远航闭环、远航突破、绕行突破、远航整备、整备续航、绕行整备、整备回航、星图当前航段 3 步路径轨、星图远航协同/绕行具体路径名、主操作区远航调度 3 格路径轨和路径步骤收益标签当前由当前航段、航线策略、冷却、连携状态、当前能量、最近远航分支、轮替待结算分支、远航调度奖励常量与当前航段剩余进度即时推导，不单独记录为真实线上指标；执行后仍通过 `directive` 事件中的远航调度奖励、远航续航奖励、远航协同奖励、协同补给当前能量、远航绕行奖励、分支改道奖励、路线稳航奖励、航段契合奖励、轮替闭环奖励、契合闭环奖励、`dispatchRouteStepText`、`dispatchRouteResultText`、绕行投送消耗、绕行投送累计推进、闭环奖励、远航突破奖励、绕行突破奖励、整备续航奖励、绕行整备奖励、整备回航奖励、整备刷新指令、冷却倍率与连携窗口字段复盘。
- 远航路线微图当前由 `branchChoices` 的 kind、status、decisionKind、focused 状态、`routeResourceKind` / `routeResourceText`、`routeMarkerKind` / `routeMarkerText`、`routeNodeStates`、`routeProgressPercent`、`routeStepLabels` 和 `routeRewardLabels` 即时渲染，只是视觉锚点，不单独记录为真实线上指标；路线语义仍通过分支选择文本和 `directive` 事件中的路线字段复盘。
- 远航资源取向符号当前由 `branchChoices` 派生的 `current / progress` 展示状态即时渲染，不单独记录为真实线上指标；协同保留当前资源、绕行投送累计航段的语义仍通过现有分支选择文本、收益对照和反馈快照复盘。
- 远航路线微图标记当前由 `branchChoices` 派生的 `recommended / available / current / recommended-previous / recommended-shift / previous / shift` 展示状态即时渲染，不单独记录为真实线上指标；推荐、上轮、本轮和改道语义仍通过路线判断、分支选择文本、收益对照和反馈快照复盘。
- 远航路线微图步骤高亮当前由 `branchChoices.routeNodeStates` 派生的 `done / next / waiting` 节点展示状态即时渲染，不单独记录为真实线上指标；目标、分支选择、回目标和整备语义仍通过路线步骤、路线下一步、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线微图步骤序号当前由 `branchChoices.routeStepLabels` 派生的 `1 / 2 / 3` 节点标记即时渲染，不单独记录为真实线上指标；目标、分支选择、回目标和整备语义仍通过路线步骤、路线下一步、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线微图方向箭头当前由 `.far-dispatch-branch-choice-route-line::before` / `::after` 的 CSS 展示状态即时渲染，不单独记录为真实线上指标；1 -> 2 -> 3 的路线语义仍通过路线步骤、路线下一步、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线微图推进填充当前由 `branchChoices.routeProgressPercent` 派生的 `--branch-route-progress` 即时渲染，不单独记录为真实线上指标；0/3、1/3、2/3 和完成态语义仍通过路线步骤、路线下一步、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线当前步短标当前由 `branchChoices.routePhaseKind` / `routePhaseText` 即时渲染，不单独记录为真实线上指标；0/3 起手、1/3 分支、2/3 回航、3/3 完成和未选语义仍通过 `branchChoiceText`、路线步骤、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线收益短标当前由 `branchChoices.routeRewardLabels` / `routeRewardText` 即时渲染，不单独记录为真实线上指标；校准、协同补给、绕行投送和闭环回报语义仍通过 `branchChoiceText`、收益对照、路线步骤、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线资源流向短标当前由 `branchChoices.routeFlowKind` / `routeFlowText` 即时渲染，不单独记录为真实线上指标；协同补当前资源和绕行投送累计航段的语义仍通过 `branchChoiceText`、资源取向符号、收益对照、路线目标和反馈快照复盘。
- 远航路线代价短标当前由 `branchChoices.routeCostKind` / `routeCostText` 即时渲染，不单独记录为真实线上指标；协同无当前资源消耗、绕行消耗当前资源的语义仍通过 `branchChoiceText`、卡片标题、收益对照、资源流向短标和反馈快照复盘。
- 远航路线取向短标当前由 `branchChoices.routeIntentKind` / `routeIntentText` 即时渲染，不单独记录为真实线上指标；协同保当前资源、绕行推累计航段的语义仍通过 `branchChoiceText`、卡片标题、资源流向短标、代价短标、收益对照和反馈快照复盘。
- 远航路线回航结果短标当前由 `branchChoices.routeReturnKind` / `routeReturnText` 即时渲染，不单独记录为真实线上指标；协同远航突破、绕行突破的语义仍通过 `branchChoiceText`、卡片标题、路线下一步、收益对照、路线反馈和反馈快照复盘。
- 远航路线指令串当前由 `branchChoices.routeCommandLabels` / `routeCommandText`、`routeStepLabels` 和 `routeNodeStates` 即时渲染，并在短槽 `title` / `aria-label` 中暴露步骤名、指令名和已完成/下一步/待推进状态，不单独记录为真实线上指标；目标指令、分支指令和回目标指令的顺序仍通过 `branchChoiceText`、卡片标题、路线预案、路线步骤、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线对照条当前由 `branchChoiceSummaryText` 和 `branchChoices` 的路线徽标、当前步短标 `routePhaseText`、下一步短标 `routeActionText`、收益短标 `routeRewardSummaryText`、第二步短标 `routeBranchStepText`、本步收益短标 `routePayoffSummaryText`、取向、代价、回航结果即时渲染，不单独记录为真实线上指标；协同/绕行路线取舍、当前阶段、下一步操作、三步回报落点、第二步按钮映射与本步即时收益差异仍通过 `branchChoiceText`、卡片标题、路线收益对照、路线判断、路线指令串、路线反馈和反馈快照复盘。
- 远航路线对照条分组布局当前由 CSS 命名网格区域即时渲染，不单独记录为真实线上指标；它只改变对照槽短标层级，不改变 `branchChoiceSummaryText`、反馈快照、收益、存档或事件字段。
- 远航路线对照条小屏布局当前由 820px 响应式 CSS 即时渲染，不单独记录为真实线上指标；它只改变对照槽在窄屏下的列数和命名网格区域，不改变 `branchChoiceSummaryText`、反馈快照、收益、存档或事件字段。
- 远航路线对照条迷你三步进度条当前由 `branchChoices.routeProgressPercent`、`branchChoices.routeNodeStates`、`branchChoices.routeStepLabels` 和 `branchChoices.routeCommandLabels` 即时渲染，包含 1/2/3 步号、悬停标题和“路线对照进度”可访问汇总，不单独记录为真实线上指标；目标、分支、回目标的阶段语义仍通过 `branchChoiceSummaryText`、当前步短标、路线微图、路线步骤、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线微图图例当前由 `far-dispatch-branch-choice-legend` 和 `far-dispatch-branch-choice-legend-item` 即时渲染，不单独记录为真实线上指标；1 目标、2 分支、3 回目标的路线语义仍通过路线步骤、路线下一步、按钮路线标记、路线反馈和反馈快照复盘。
- 远航路线明细折叠当前由 `far-dispatch-branch-choice-details` 的浏览器展开状态即时渲染，不单独记录为真实线上指标；路线目标、下一步、收益对照和后续回航语义仍保留在 `branchChoiceText`、卡片标题、展开内容和反馈快照中复盘。
- 远航分支态势当前由本地 `directiveChain`、目标指令、协同指令和最近远航分支即时派生，不单独记录为远端指标；游戏内反馈快照会通过远航调度文本记录待选择、协同、绕行、协同整备或绕行整备状态，便于人工复盘。
- 浏览器本地在离线收益达到展示阈值时记录 offline_gain 事件。
- 浏览器本地通过 localStorage 保存最近 50 条 feedback 草稿，提交反馈时记录 feedback_sent 事件；反馈快照包含当前过载奖励、航线策略、指令熟练层和远航调度状态。
- 星图计划完成状态当前由存档数值实时推导，暂不记录为真实线上指标。
- 星图章节导航微图景当前由章节 `visualClass` 和本地项目完成状态即时派生，不单独记录为真实线上指标；章节选择仍只通过当前 UI 状态和存档数值复盘。
- 星图当前章节大图景当前由章节 `visualClass`、当前筛选和本地项目完成状态即时派生，不单独记录为真实线上指标；章节选择仍只通过当前 UI 状态和存档数值复盘。
- 星图当前章节节点带当前由章节内项目状态与 `heroNodes` 即时派生，不单独记录为真实线上指标；章节推进仍通过当前存档数值和项目完成状态复盘。
- 星图筛选摘要短标签当前由本地项目状态与 `getProjectFilterBrief` / `getProjectFilterSummary` 即时推导，不单独记录为真实线上指标；筛选状态仍可通过当前存档数值和本地 UI 状态复盘。
- 星图筛选按钮视觉标识当前由筛选 id 即时派生，不单独记录为真实线上指标；筛选选择仍只通过当前 UI 状态和存档数值复盘。
- 尚未接入远端指标上报；发布前不能把本地事件当作真实线上指标。
