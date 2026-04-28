# Research

Agent 可以主动上网调研 idle/incremental/clicker game 设计和留存问题。

## 2026-04-28 Goal upgrade recommendation

本轮未新增外部网页调研；沿用前序关于放置类核心循环和系统状态可见性的结论。当前没有真实玩家反馈，因此继续优化已有目标链路和升级区之间的可读连接。

产品结论：当目标条要求购买关键升级时，升级列表需要直接标出对应卡片，避免玩家在多个升级项之间自行匹配。

## 2026-04-28 Goal completion feedback

本轮未新增外部网页调研；沿用前序关于放置类核心循环和系统状态可见性的结论。当前没有真实玩家反馈，因此继续优化已有目标链路的可见性，而不是新增系统。

产品结论：目标从一个阶段切换到下一阶段时，需要明确告知玩家“刚完成了什么”和“接下来追什么”，否则目标条变化容易被视为普通文案刷新。

## 2026-04-28 Operation feedback clarity

本轮未新增外部网页调研；沿用上一轮关于放置类核心循环和系统状态可见性的结论。当前仍没有真实玩家反馈，因此继续优先提升已有核心动作的即时可读性。

产品结论：点击、过载和购买升级是早期 30 秒内最频繁的正反馈点，界面需要直接显示行动结果，让玩家不用从资源数字变化中反推本次收益。

## 2026-04-28 Goal action clarity

本轮未新增外部网页调研；沿用上一轮关于放置类核心循环和系统状态可见性的结论。当前没有真实玩家反馈，因此继续把已有目标链路说明清楚，而不是新增复杂系统。

产品结论：购买型目标不能只说“还差 1 次升级/1 级”，需要直接显示下一步关键升级的能量缺口或可购买状态，让目标条和升级区表达一致。

## 2026-04-28 Overload clarity

本轮未新增外部网页调研；沿用上一轮关于放置类核心循环和系统状态可见性的结论。当前没有真实玩家反馈，因此继续优先把已有奖励规则显性化，而不是增加新系统。

产品结论：第八次连击过载是早期点击循环的重要正反馈，界面需要直接显示过载进度和剩余点击数，让玩家知道下一次奖励何时到来。

## 2026-04-28 Goal clarity

本轮未新增外部网页调研；沿用上一轮关于放置类核心循环和系统状态可见性的结论。当前没有真实玩家反馈，因此继续优先减少玩家对下一步目标的猜测成本。

产品结论：目标条需要和升级卡片一样直接说明进度与剩余量，先补足 30 秒内的状态反馈，再考虑新增系统。

## 2026-04-28 Upgrade clarity

- Machinations 的 idle game 设计文章强调资源生成器、升级和自动化是放置类游戏的核心循环，玩家需要持续看到下一次成长的路径：https://machinations.io/articles/idle-games-and-how-to-design-them
- Nielsen Norman Group 的系统状态可见性原则强调界面应及时向用户反馈当前状态，减少用户猜测下一步是否可行：https://www.nngroup.com/articles/visibility-system-status/

产品结论：在没有真实反馈样本时，不扩大新系统，先让升级卡片直接显示购买进度、剩余能量和可购买状态，强化“下一次正反馈还差多少”的可见性。

## 2026-04-28 Feedback Infra

- GitHub 官方 REST API 文档说明，创建 GitHub Pages 站点可使用 `build_type=workflow`，表示通过自定义 GitHub Actions workflow 构建。本轮据此启用 Pages：https://docs.github.com/en/rest/pages/pages?apiVersion=2022-11-28
- GitHub Pages 官方文档说明，public 仓库在 GitHub Free 下可使用 Pages；当前仓库已转为 public，适合恢复 Pages 路径：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- W3C WAI 表单标签教程要求表单控件具备清晰标签，`label for` 与控件 `id` 应明确关联。本轮反馈表单使用可见标签和 `aria-live` 状态反馈：https://www.w3.org/WAI/tutorials/forms/labels/

产品结论：反馈入口先采用预填 GitHub Issue，而不是匿名远端上报。这样能最小化基础设施风险，并保留玩家上下文快照。

## 2026-04-28 Product decision

本轮未新增外部网页调研；决策依据来自现有路线图和本地反馈状态。当前没有真实玩家反馈，因此优先补齐已列入 `docs/IDEAS.md` 的离线能量可见性，减少玩家回流时的收益感知断层。
