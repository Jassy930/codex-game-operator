# Research

Agent 可以主动上网调研 idle/incremental/clicker game 设计和留存问题。

## 2026-04-28 Feedback Infra

- GitHub 官方 REST API 文档说明，创建 GitHub Pages 站点可使用 `build_type=workflow`，表示通过自定义 GitHub Actions workflow 构建。本轮据此启用 Pages：https://docs.github.com/en/rest/pages/pages?apiVersion=2022-11-28
- GitHub Pages 官方文档说明，public 仓库在 GitHub Free 下可使用 Pages；当前仓库已转为 public，适合恢复 Pages 路径：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- W3C WAI 表单标签教程要求表单控件具备清晰标签，`label for` 与控件 `id` 应明确关联。本轮反馈表单使用可见标签和 `aria-live` 状态反馈：https://www.w3.org/WAI/tutorials/forms/labels/

产品结论：反馈入口先采用预填 GitHub Issue，而不是匿名远端上报。这样能最小化基础设施风险，并保留玩家上下文快照。
