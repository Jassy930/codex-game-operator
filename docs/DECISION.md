# Decision

## 2026-04-28 Build/Deploy Infra

阶段判断：仓库已有 package.json、浏览器游戏、测试和构建脚本，但 GitHub Pages 尚未配置，处于 Build/Deploy infra。

当前最大问题：主分支 push 后不会自动生成可访问的静态发布版本。

本轮决策：新增 GitHub Pages Actions workflow，并同步更新 workflow 生成脚本。CI 必须执行安装、测试和构建，测试失败不得继续部署。

验收标准：

- npm install 成功。
- npm test 通过。
- npm run build 生成 dist。
- .github/workflows/pages.yml 存在并使用 npm install、npm test、npm run build。

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
