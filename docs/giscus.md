# Giscus 评论

文章详情页已配置 `shy-robin/blog` 的 Announcements 分类，无需新增数据库、访问令牌或 Vercel 环境变量。公开仓库 ID 为 `R_kgDONaitLQ`，分类 ID 为 `DIC_kwDONaitLc4DLH00`，默认配置位于 `src/lib/giscus.ts`。评论在滚动到附近后加载，也可手动触发，并支持网络失败后重试。

## GitHub 准备

1. 选择一个公开仓库，可使用 `shy-robin/blog`；若博客源码仓库不公开，可另外创建公开的评论仓库，无需公开源码。
2. 在仓库 Settings → General → Features 中启用 Discussions。
3. 从 https://github.com/apps/giscus 安装 Giscus App，仅授权选定的评论仓库。
4. 打开 https://giscus.app/zh-CN，填写仓库，选择 Announcements（公告）类型的讨论分类。页面底部会生成配置片段。

## 可选环境变量覆盖

如果以后迁移评论仓库，可修改默认配置，或从生成片段读取对应属性，在本地 `.env.local` 和 Vercel Production 覆盖以下值。迁移时四项一起更新，避免仓库与分类不匹配；显式设为空字符串会隐藏评论区。

| 环境变量                         | 对应属性                           |
| -------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_GISCUS_REPO`        | `data-repo`，例如 `shy-robin/blog` |
| `NEXT_PUBLIC_GISCUS_REPO_ID`     | `data-repo-id`                     |
| `NEXT_PUBLIC_GISCUS_CATEGORY`    | `data-category`                    |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | `data-category-id`                 |

这些值是公开标识，不是密钥，不需要 GitHub Token。修改本地环境变量后重启开发服务；修改 Vercel 环境变量后重新部署，因为文章页面会在构建时预生成。

## 评论关联规则

代码使用 `specific` 映射和严格匹配，以 `post:文章唯一 ID` 作为讨论标识，不使用文章标题、slug 或域名。文章改名、修改 slug 或更换域名后仍关联原讨论。新建另一篇文章会产生独立讨论。GitHub 讨论在首次发表评论或回应后自动创建，不需要为每篇文章手动创建。

正文使用中文浅色评论区，并启用回应与顶部评论框。普通读者可以阅读评论，发表评论需要 GitHub 登录；管理者在 GitHub Discussions 管理评论。

## 上线验收

1. 配置完整并重新部署后，打开一篇文章并滚动到末尾，确认评论框出现。
2. 登录 GitHub 发表一条测试评论，刷新页面后确认评论仍存在。
3. 打开另一篇文章，确认不会显示前一篇文章的评论。
4. 若网络加载失败，可点击“重新加载”或“在 GitHub 查看讨论”。如果 iframe 内报告仓库/权限错误，检查仓库可见性、Giscus App 安装范围和四项配置。

真实评论发布验证需要仓库配置完成后进行，测试中不自动发送评论。
