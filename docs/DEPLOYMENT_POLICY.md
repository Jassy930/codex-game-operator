# Deployment Policy

优先支持：

1. GitHub Pages workflow
2. Vercel preview
3. Vercel production

发布前：

```bash
npm install
npm test
npm run build
```

GitHub Pages：

- 主分支 push 触发 `.github/workflows/pages.yml`。
- workflow 必须完成 install、test、build 后才上传 `dist`。
- 不允许用 `npm test || true` 绕过测试失败。
- 当前仓库为 private，GitHub Pages 受计划限制，deploy job 仅在公开仓库执行。

Vercel：

- Pages 不可用时，允许部署 `dist/`。
- 本轮生产地址：https://dist-kblvoc9qq-wangf930-2746s-projects.vercel.app
