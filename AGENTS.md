# Agent 项目约定

ShyRobin 个人博客（Next.js App Router + Sanity CMS）。项目说明见 README.md，视觉与产品约定见 DESIGN.md、PRODUCT.md，专题文档在 docs/。

## 敏感信息与个人数据（必须遵守）

进入 git 历史的内容难以彻底清除，一律按公开标准把关。

### 密钥与凭证

- 禁止提交任何密钥：API token、Sanity 写入 Token、webhook secret、密码、私钥、cookie。敏感配置只从 `process.env` 读取，不写真实默认值。
- `NEXT_PUBLIC_*` 变量会打包进前端 bundle，只允许公开标识，禁止放任何密钥。
- `.env*`、`*.pem` 已被 .gitignore 排除；禁止 `git add -f` 强行加入，禁止把环境变量值写进源码、注释、文档或测试。
- 迁移/导入脚本使用 `npx sanity login` 的用户凭证，不把 Token 写进脚本。
- 已确认的公开标识可以保留：Sanity projectId `e4fd09lc` 与 dataset `production`、Giscus 的 repo/repoId/categoryId、正式域名 `www.shyrobin.top`。

### 真实个人数据

- 真实个人资料（姓名、生日、籍贯、学校、职业、邮箱、QQ、微信、二维码、头像）与真实文章内容只存 Sanity 云端，禁止写入仓库任何位置（src、tests、docs、scripts、public）。
- 仓库中只允许出现 schema 字段名、GROQ 查询和明显的假数据 fixture（如 `123456789`、`1990-06-15`、`hello@example.com`、「示例作者」）。
- 新增测试或示例沿用假数据风格；不要从 Sanity 草稿、线上页面或迁移备份复制真实内容进仓库。

### 提交前自查

- 每次提交前逐行检查 `git diff --cached`，确认不含 token、真实联系方式、个人资料；发现即移除后再提交。
- 拿不准某个值是否敏感时，先询问用户，不要自行判断为公开。