# Decision

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
