# Max Autonomy Policy

Agent 被授权在当前仓库内自主执行：

```bash
git status
git add .
git commit -m "..."
git push
git tag
git push --tags
npm install
npm test
npm run build
gh issue list
gh issue view
gh issue comment
gh issue create
vercel
vercel --prod --yes
```

## 自主 push 条件

- 没有提交密钥
- build/test 尽量通过
- docs/DECISION.md 和 docs/RELEASE_LOG.md 已更新

## 自主 production 条件

- build 通过
- 测试通过或测试缺失原因已记录
- 发布日志已更新
- 不是明显破坏性改动
