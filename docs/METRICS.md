# Metrics

需要采集 session、click、first_upgrade_time、upgrade_purchase、offline_gain、goal_complete、route_stance、directive、feedback_sent。

当前实现：

- 浏览器本地通过 localStorage 保存最近 200 条 session、click、first_upgrade_time、upgrade_purchase、goal_complete、reset 事件。
- 浏览器本地在玩家切换星图航线策略时记录 route_stance 事件。
- 浏览器本地在玩家执行航线指令时记录 directive 事件，包含指令 id、本次即时收益、指令熟练收益、指令熟练倍率、当前熟练层、熟练叠层结果、预案执行奖励、航线委托奖励、远航调度奖励、远航续航奖励、远航协同奖励、远航调度闭环奖励、远航整备刷新指令、远航调度冷却倍率、远航调度连携窗口、轮换目标奖励、满层回响奖励、策略终结奖励、策略契合奖励、策略契合倍率、航线连携层数和连携倍率。
- 指令轮换目标和 3 格视觉轨当前由本地冷却、连携字段与 `getDirectivePlan` 即时推导，不单独记录为真实线上指标。
- 远航调度接管下一步指令推荐、目标后的远航续航推荐、协同续航指令、目标指令冷却缩短、调度接力窗口、远航闭环、远航整备和星图当前航段 3 步路径轨当前由当前航段、航线策略、冷却与连携状态即时推导，不单独记录为真实线上指标；执行后仍通过 `directive` 事件中的远航调度奖励、远航续航奖励、远航协同奖励、闭环奖励、整备刷新指令、冷却倍率与连携窗口字段复盘。
- 浏览器本地在离线收益达到展示阈值时记录 offline_gain 事件。
- 浏览器本地通过 localStorage 保存最近 50 条 feedback 草稿，提交反馈时记录 feedback_sent 事件；反馈快照包含当前过载奖励、航线策略、指令熟练层和远航调度状态。
- 星图计划完成状态当前由存档数值实时推导，暂不记录为真实线上指标。
- 尚未接入远端指标上报；发布前不能把本地事件当作真实线上指标。
