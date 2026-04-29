# Metrics

需要采集 session、click、first_upgrade_time、upgrade_purchase、offline_gain、goal_complete、route_stance、directive、feedback_sent。

当前实现：

- 浏览器本地通过 localStorage 保存最近 200 条 session、click、first_upgrade_time、upgrade_purchase、goal_complete、reset 事件。
- 浏览器本地在玩家切换星图航线策略时记录 route_stance 事件。
- 浏览器本地在玩家执行航线指令时记录 directive 事件，包含指令 id、本次即时收益、指令熟练收益、指令熟练倍率、当前熟练层、熟练叠层结果、轮换目标奖励、策略终结奖励、策略契合奖励、策略契合倍率、航线连携层数和连携倍率。
- 指令轮换目标当前由本地冷却与连携字段即时推导，不单独记录为真实线上指标。
- 浏览器本地在离线收益达到展示阈值时记录 offline_gain 事件。
- 浏览器本地通过 localStorage 保存最近 50 条 feedback 草稿，提交反馈时记录 feedback_sent 事件；反馈快照包含当前过载奖励、航线策略和指令熟练层。
- 星图计划完成状态当前由存档数值实时推导，暂不记录为真实线上指标。
- 尚未接入远端指标上报；发布前不能把本地事件当作真实线上指标。
