# Release Log

## Unreleased

- 初始化最大自治版本项目骨架。
- Bootstrap《星核工坊》：新增浏览器端最小可玩版本、核心数值逻辑、测试、本地服务和构建脚本。
- 同步 GitHub Issues 反馈状态：当前无 open、feedback、bug issue。
- 新增 GitHub Pages 自动部署 workflow，并移除部署脚本中的测试绕过。
- 记录 GitHub Pages 私有仓库计划阻塞 issue #1，并发布 Vercel 版本：https://dist-kblvoc9qq-wangf930-2746s-projects.vercel.app
- 新增游戏内反馈入口：玩家可填写类型、评分和内容，生成预填 GitHub Issue，并本地记录 feedback_sent 与反馈快照。
- 仓库已为 public，GitHub Pages 已启用 workflow 发布源；run 25056371852 已成功部署到 https://jassy930.github.io/codex-game-operator/
- 补齐 GitHub Issue 标签：feedback、balance、idea、release、research、tech-debt。
- 回复并关闭部署阻塞 issue #1。
- 新增离线收益可见化：读取存档时立即结算离线自动产能，显示回收提示，并记录本地 offline_gain 事件。
- 新增升级购买进度提示：升级卡片显示成本、还差能量或可购买状态，并补充进度计算测试。
- 新增当前目标进度提示：目标条显示进度、剩余量和完成状态，并补充目标进度测试。
- 新增连击过载进度提示：连击状态栏显示过载 X/8、剩余点击数和触发状态，并补充过载进度测试。
- 新增购买型目标行动提示：目标条显示关键升级的能量缺口或可购买状态，并补充目标行动提示测试。
- 修复发布脚本测试绕过：`ops/deploy.sh` 和 `ops/autopush.sh` 现在会在 `npm test` 失败时停止。
