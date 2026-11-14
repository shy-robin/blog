# 搜索引擎与订阅

正式站点地址默认是 `https://blog-tau-coral-10.vercel.app`，配置集中在 `src/lib/site.ts`。之后绑定自定义域名时，设置 `NEXT_PUBLIC_SITE_URL=https://你的域名` 并重新部署，站点地图、RSS 和 canonical 链接都会使用新域名。不要将临时部署地址或 `VERCEL_URL` 用作正式域名。

## 公开入口

- `/sitemap.xml`：首页、文章列表、项目页、关于页和已发布文章。文章的最后更新时间来自 Sanity `_updatedAt`，不会每次访问都修改日期。
- `/robots.txt`：允许抓取前台，排除 `/studio`、`/api/` 和静态设计示例 `/demos/`，并声明站点地图地址。robots 是爬虫约定，不是访问权限控制；后台仍依靠 Sanity 身份认证。
- `/feed.xml`：RSS 2.0，提供最近 50 篇已发布文章的标题、摘要、日期、标签和正式链接。为避免链接变化导致重复订阅项，GUID 使用文章唯一 ID。页脚和页面元数据中均提供订阅入口。
- `/og`：1200×630 的默认 PNG 分享卡片，无需额外图片或字体服务。

站点地图和 RSS 沿用 60 秒缓存及 `posts` 标签，Sanity 发布 Webhook 清除文章数据缓存后，相关入口会按需重新生成。它们不会包含未发布草稿或后台页面。

## 页面元数据

首页、文章列表和详情都有指向正式域名的 canonical。搜索/标签筛选结果标记为 `noindex, follow`，canonical 指向 `/posts`；不会写入站点地图。`/studio` 保留 noindex 设置。

文章设置独立的 Open Graph 和 Twitter 大图卡片元数据。优先使用封面并指定 JPEG 格式，缺少封面时使用 `/og` 默认图；缺少摘要时提供文字回退。分享平台是否实际展示卡片以及旧预览何时更新，由平台自己的抓取和缓存策略决定。

## 验证

1. 访问上述 XML/TXT/PNG 地址，检查状态码、内容类型和正式域名。
2. 查看文章页面 HTML 的 canonical、`og:title`、`og:image`、`twitter:card` 和 RSS alternate 链接。
3. 发布/更新文章后验证站点地图和 RSS 内容更新。
4. 可在搜索引擎站长工具提交 `/sitemap.xml`；生成站点地图不保证页面一定被收录。
