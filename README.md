# ShyRobin 个人博客

中文个人站点，记录 Web 前端工程实践、技术方案与生活思考。正式地址：<https://www.shyrobin.top>。

基于 Next.js App Router 与 Sanity headless CMS：文章、项目、个人资料全部在 Sanity 后台维护，前台只渲染已发布内容。视觉借鉴 cali.so 的窄栏个人页组织，配色采用 One Light / One Dark 深浅双主题，正文使用自托管霞鹜文楷屏幕版。

## 功能

- **文章**：`/` 永久重定向到 `/posts`（保留查询参数）。列表支持关键词搜索（350ms 防抖、兼容中文输入法）、标签筛选与分页（每页 12 篇），条件保存在 `q` / `tag` URL 参数中，可直接分享。
- **文章详情** `/posts/[slug]`：Portable Text 正文、Shiki 代码高亮（跟随主题的 one-light / one-dark-pro）、二三级标题目录、Giscus 评论（滚动到附近懒加载）。
- **项目** `/projects` 与 **关于** `/about`：内容来自 Sanity 的项目和单例个人资料。
- **主题**：跟随系统偏好，可手动切换并持久化，先于渲染应用避免闪烁。
- **订阅与 SEO**：RSS `/feed.xml`（最近 50 篇）、`/sitemap.xml`、`/robots.txt`、动态 OG 分享图 `/og`，文章页带 canonical 与 Open Graph / Twitter 卡片。
- **内容后台**：Sanity Studio 内嵌在 `/studio`，使用 Sanity 账号登录，无需单独部署。

## 技术栈

Next.js 15（App Router）· React 19 · TypeScript · Tailwind CSS 3 · Sanity + next-sanity · Shiki · Giscus

## 快速开始

要求 Node.js 22（见 `.nvmrc`）。

```sh
nvm use
npm install
npm run dev
```

- 前台：<http://localhost:3000>
- 后台：<http://localhost:3000/studio>，用 Sanity 项目成员账号登录

默认连接 Sanity 项目 `e4fd09lc` 的 `production` 数据集，无需本地数据库。本地访问 Studio 前，需在 Sanity 管理平台的 API → CORS origins 允许 `http://localhost:3000` 并启用 Allow credentials（详见 [docs/sanity.md](docs/sanity.md)）。

## 环境变量

写入 `.env.local`（已被 gitignore）。以下均为可选，不设置时使用代码默认值：

| 变量 | 说明 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 正式站点地址，默认 `https://www.shyrobin.top`，影响 canonical、sitemap、RSS 与 OG 链接 |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity 项目 ID，默认 `e4fd09lc`（公开标识，非密钥） |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity 数据集，默认 `production` |
| `SANITY_REVALIDATE_SECRET` | Sanity 发布 webhook 的签名密钥；配置后 `/api/revalidate` 可在发布时即时刷新缓存 |
| `NEXT_PUBLIC_GISCUS_REPO` 等 4 项 | 覆盖 Giscus 评论仓库配置，见 [docs/giscus.md](docs/giscus.md) |
| `NEXT_DIST_DIR` | 构建输出目录，默认 `.next`；验证构建可用 `.next-verify` 避免影响运行中的服务 |

不要把服务端写入 Token 放进 `NEXT_PUBLIC_*` 变量；Studio 使用登录用户权限，前台只读。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run build` / `npm start` | 生产构建 / 启动 |
| `npm run pm2start` | 以 pm2 守护进程启动（进程名 `nextjsBlog`） |
| `npm test` | 运行测试（esbuild 打包后 `node --test` + jsdom，输出到 `.test-output/`） |
| `npm run lint` | ESLint |
| `npm run format` / `format:check` | Prettier 格式化 / 检查 |
| `npm run migrate:gainmore` | 旧博客内容转换（不写入云端，详见迁移文档） |

测试覆盖搜索、分页、主题、正文渲染、SEO、导航音效、迁移转换等核心逻辑。

## 内容管理

- 在 `/studio` 编辑文章、项目与个人资料，保存为草稿，Publish 后公开；`publishedAt` 仅是元数据，不代表定时发布。
- 前台数据缓存 60 秒（ISR + 内容标签）。可选配置 Sanity webhook 指向 `/api/revalidate`，发布后即时失效缓存，步骤见 [docs/sanity.md](docs/sanity.md)。
- 图片原文件存于 Sanity，经同域 `/_next/image` 优化加载，`next.config.ts` 只放行当前项目与数据集的图片路径。

## 部署

`npm run build` 后可用任意 Node.js 方式托管，仓库提供 pm2 脚本（`npm run pm2start`）。上线前确认：

1. `NEXT_PUBLIC_SITE_URL` 指向正式域名；
2. Sanity CORS origins 已添加正式域名（供 `/studio` 使用）；
3. 可选：配置 `SANITY_REVALIDATE_SECRET` 与 Sanity webhook。

## 文档

- [DESIGN.md](DESIGN.md)：视觉系统、布局、主题与交互约定
- [PRODUCT.md](PRODUCT.md)：产品定位与内容约束
- [docs/sanity.md](docs/sanity.md)：Sanity 后台、缓存与 webhook 配置
- [docs/portfolio.md](docs/portfolio.md)：项目与个人资料编辑说明
- [docs/seo.md](docs/seo.md)：站点地图、RSS、元数据与验证
- [docs/giscus.md](docs/giscus.md)：评论配置与关联规则
- [docs/gainmore-migration.md](docs/gainmore-migration.md)：旧博客 84 篇文章的迁移过程与结果

## 目录结构

```
src/app        路由（页面、RSS、OG、revalidate API、内嵌 Studio）
src/components 前台组件（dock、搜索、筛选、正文、评论、主题切换等）
src/lib        纯逻辑（搜索、分页、主题、SEO、导航音效）
src/sanity     数据层（GROQ 查询、schema、图片）与 Studio 配置入口
tests          node --test 测试
scripts        旧博客迁移脚本
docs           专题文档
```