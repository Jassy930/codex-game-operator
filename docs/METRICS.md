# Metrics

需要采集 session、click、first_upgrade_time、upgrade_purchase、feedback_sent。

当前实现：

- 浏览器本地通过 localStorage 保存最近 200 条 session、click、first_upgrade_time、upgrade_purchase、reset 事件。
- 浏览器本地通过 localStorage 保存最近 50 条 feedback 草稿，提交反馈时记录 feedback_sent 事件。
- 尚未接入远端指标上报；发布前不能把本地事件当作真实线上指标。
