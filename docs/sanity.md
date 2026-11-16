# Sanity 后台

使用 Node.js 22（安装后执行 `nvm use`），重启 `npm run dev`，访问 http://localhost:3000/studio，使用 Sanity 项目成员账号登录。旧的 Node.js 18 不满足部分 Sanity 依赖的运行要求。

- Project ID: `e4fd09lc`
- Dataset: `production`
- 在 Sanity 管理平台的 API → CORS origins 中允许 `http://localhost:3000`，并启用 Allow credentials。
- 正式网站需在 CORS origins 中添加 `https://www.shyrobin.top`，并启用 Allow credentials，供 `/studio` 使用；不要添加路径。保留本地开发的 origin。此项需在 Sanity 管理平台配置，修改代码不会自动同步远程 CORS 设置。
- 可通过 `NEXT_PUBLIC_SANITY_PROJECT_ID` 和 `NEXT_PUBLIC_SANITY_DATASET` 环境变量覆盖默认值。这两个值不是密钥。
- 不需要向浏览器提供写入 Token；Studio 使用登录用户的权限。不要把服务端 Token 放入 NEXT_PUBLIC 环境变量。

后台支持文章标题、slug、摘要、封面、标签、日期、富文本、图片及代码块。编辑会保存为草稿，点击 Publish 发布。发布时间字段仅是元数据，不代表定时发布。

## 前台文章

首页展示最新 5 篇文章，`/posts` 展示文章列表，`/posts/[slug]` 展示详情。仅查询已发布且有 slug 的文章，草稿不会显示。正文支持富文本、列表、图片和高亮代码块；二、三级标题会生成目录。

文章列表支持标题、摘要、标签与正文搜索（不区分大小写，多个空格分隔的关键词需全部匹配），可与标签筛选组合使用。搜索范围含正文文字与代码块代码，不含图片描述与代码语言。筛选条件保存在 `q` 和 `tag` URL 参数中，例如 `/posts?q=React&tag=性能`，可直接分享。点击文章上的标签也会进入筛选结果；无匹配结果时可清除条件。

服务端缓存 60 秒，过期后的下一次请求会触发后台刷新，稍后再访问即可看到新内容。该机制不依赖 webhook；开发模式下的缓存行为可能不同。文章详情页为动态渲染（以支持草稿预览），HTML 不做 ISR，但 Sanity 数据缓存仍是 60 秒，请求量不变。

图片原文件保存在 Sanity，前台使用 Next.js 自带的图片优化，经网站同域名下的 `/_next/image` 加载，由 Vercel 服务端读取 Sanity 图片后处理和缓存。读者无需直接连接 `cdn.sanity.io`；图片按实际比例显示，加载失败时展示提示。`next.config.ts` 仅允许当前 Sanity 项目和数据集的图片路径。本地开发时，开发服务器也需要能够访问 Sanity CDN。

本地使用 Node.js 22 运行 `npm test` 可检查正文渲染、代码转义、链接安全及图片引用。生产构建可以用 `NEXT_DIST_DIR=.next-verify npm run build` 输出到独立目录，避免影响正在运行的开发服务。

### 可选：发布后立即刷新

1. 在 Vercel 项目的环境变量（Production 作用域）中设置一个随机的 `SANITY_REVALIDATE_SECRET`，并重新部署。
2. 在 Sanity 项目的 API → Webhooks 创建 webhook：URL 填写 `https://你的域名/api/revalidate`，方法 POST，选择 production 数据集，启用 Create、Update、Delete。
3. Filter 填写 `_type in ["post", "project", "profile"]`，Projection 填写 `{_type}`，Secret 填写同一密钥。不要启用草稿触发。
4. 发布、更新或删除文章后验证 webhook 投递成功。接口校验签名后清除文章缓存，下次访问将读取新内容。

本地的 localhost 无法接收 Sanity 云端 webhook，开发时使用默认缓存刷新即可。不需要在公开聊天或前端代码中填写该密钥。

## 草稿预览

作者可在发布前于前台真实渲染环境预览草稿（代码高亮、目录、图片均可验证）。基于 Next.js Draft Mode，仅持有预览 cookie 的浏览器可见草稿；文章列表、sitemap、RSS 始终只读已发布内容。

### 配置（可选，两个服务端环境变量）

1. `SANITY_API_READ_TOKEN`：在 Sanity 管理平台 API → Tokens 新建 token，权限选 **Viewer**（只读）。不要给 Editor 或更高权限，不要放入 `NEXT_PUBLIC_*`。
2. `SANITY_PREVIEW_SECRET`：本地执行 `openssl rand -hex 32` 生成随机值，自行保存。

两个变量配置到 Vercel（Production 作用域）后重新部署才生效。未配置时预览入口返回 503，不影响网站其他功能。变量值不写入仓库。

### 使用

1. 在 Studio 打开草稿文章，复制 slug。
2. 访问 `https://www.shyrobin.top/api/draft-mode/enable?secret=<密钥>&slug=<文章slug>`（本地开发用 `http://localhost:3000`）。
3. 校验通过后跳转到文章页，顶部出现「草稿预览」提示条，展示草稿内容（同 slug 的草稿自动覆盖已发布版）。
4. 点击提示条「退出预览」回到已发布内容；关闭浏览器后 cookie 失效。

secret 错误返回 401，slug 非法返回 400。预览链接含 secret，会留在浏览器历史与服务器日志：仅作者自用，可定期轮换 secret；`/api/` 已被 robots.txt 排除。

### 已知行为

- 预览时文章 ID 为 `drafts.**`，Giscus 会按草稿 ID 形成独立评论线程，与发布后的线程互不影响。
- 预览页元数据为 `noindex, nofollow`，不会被搜索引擎收录。
- 文章详情页因此改为动态渲染，Sanity 数据缓存（60 秒）照常生效。

## 个人资料与项目

后台新增“项目”和“个人资料”入口，分别用于管理 `/projects` 和 `/about` 内容。资料只需维护一份，项目可创建多个；均通过 Publish 公开。详见 [编辑说明](portfolio.md)。
