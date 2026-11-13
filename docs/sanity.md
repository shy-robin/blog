# Sanity 后台

使用 Node.js 22（安装后执行 `nvm use`），重启 `npm run dev`，访问 http://localhost:3000/studio，使用 Sanity 项目成员账号登录。旧的 Node.js 18 不满足部分 Sanity 依赖的运行要求。

- Project ID: `e4fd09lc`
- Dataset: `production`
- 在 Sanity 管理平台的 API → CORS origins 中允许 `http://localhost:3000`，并启用 Allow credentials。
- 正式上线后添加实际网站 origin（例如 `https://example.com`），不要添加路径。
- 可通过 `NEXT_PUBLIC_SANITY_PROJECT_ID` 和 `NEXT_PUBLIC_SANITY_DATASET` 环境变量覆盖默认值。这两个值不是密钥。
- 不需要向浏览器提供写入 Token；Studio 使用登录用户的权限。不要把服务端 Token 放入 NEXT_PUBLIC 环境变量。

后台支持文章标题、slug、摘要、封面、标签、日期、富文本、图片及代码块。编辑会保存为草稿，点击 Publish 发布。发布时间字段仅是元数据，不代表定时发布。

## 前台文章

首页展示最新 5 篇文章，`/posts` 展示文章列表，`/posts/[slug]` 展示详情。仅查询已发布且有 slug 的文章，草稿不会显示。正文支持富文本、列表、图片和高亮代码块；二、三级标题会生成目录。

服务端缓存 60 秒，过期后的下一次请求会触发后台刷新，稍后再访问即可看到新内容。该机制不依赖 webhook；开发模式下的缓存行为可能不同。

图片使用 Sanity 图片 CDN 缩放并自动选择格式，按实际图片比例显示，加载失败时展示提示。访问速度仍受读者到 Sanity CDN 的网络影响；国内部署时可后续增加国内图片存储同步。

本地使用 Node.js 22 运行 `npm test` 可检查正文渲染、代码转义、链接安全及图片引用。生产构建可以用 `NEXT_DIST_DIR=.next-verify npm run build` 输出到独立目录，避免影响正在运行的开发服务。

### 可选：发布后立即刷新

1. 在部署平台设置一个随机的 `SANITY_REVALIDATE_SECRET` 环境变量，并重新部署。
2. 在 Sanity 项目的 API → Webhooks 创建 webhook：URL 填写 `https://你的域名/api/revalidate`，方法 POST，选择 production 数据集，启用 Create、Update、Delete。
3. Filter 填写 `_type == "post"`，Projection 填写 `{_type}`，Secret 填写同一密钥。不要启用草稿触发。
4. 发布、更新或删除文章后验证 webhook 投递成功。接口校验签名后清除文章缓存，下次访问将读取新内容。

本地的 localhost 无法接收 Sanity 云端 webhook，开发时使用默认缓存刷新即可。不需要在公开聊天或前端代码中填写该密钥。
