# CI 流水线

GitHub Actions（`.github/workflows/ci.yml`），push 到 main 与 pull request 触发，两个 job 均不需要任何仓库 secret。

## verify

依次执行 `npm run lint`、`npm run format:check`、`npm test`、`npm run build`。

- Node 版本读取 `.nvmrc`（22），npm 缓存由 setup-node 管理。
- 测试全部纯本地（fixture + groq-js 内存求值），不访问 Sanity、不需要凭证。
- build 需要出网访问 Sanity 公共 API（匿名可读，无需 token）：文章页、sitemap、RSS、关于页在构建时预渲染并拉取已发布内容。所有环境变量都有代码默认值。若 GitHub 共享 runner IP 触发 Sanity 匿名限流（429），build 可能偶发失败，重跑即可；verify 的 lint/format/test 不受影响。
- lockfile 的 resolved 地址混用 npmmirror 与 npmjs。CI 在 `npm ci` 前用 sed 把 npmmirror 重写为 npmjs（仅 CI 工作区，不提交）：两侧 tarball 字节一致，integrity 校验不受影响，npm 缓存 key 也基于重写后的 lockfile。本地开发继续享受镜像速度，仓库 lockfile 保持原样。CI 严禁改用 `npm install`（会改写 lockfile）。

## secrets

gitleaks 全历史密钥扫描，作为 AGENTS.md 敏感信息约定的强制拦截层。

- 直接下载钉版本的 MIT 许可二进制（当前 v8.30.1），不依赖 gitleaks-action 的账户类型/license 判断，仓库转入组织也不受影响。升级时改 URL 与命令中的版本号即可。
- `gitleaks git . --redact` 扫描全部 git 历史，`--redact` 让命中内容在日志中打码，避免二次泄密。
- 出现误报时新建根目录 `.gitleaks.toml` allowlist，只放行已确认的公开标识（如 Giscus repoId），不要整体关闭规则。

## 本地对应命令

```sh
npm run lint
npm run format:check
npm test
NEXT_DIST_DIR=.next-verify npm run build
```
