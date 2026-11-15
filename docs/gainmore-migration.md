# 旧博客迁移

源仓库：本机 `~/coding/gainmore`。目标：Sanity 项目 `e4fd09lc` 的 `production` 数据集。

## 内容与时间

- 迁移全部 84 篇有标题的文章，包括技术笔记、转载、随笔和生活记录。无标题的 `htmlDemo` 是演示页面，不创建文章。
- `publishedAt` 直接复制 `content.json` 的 `date`，不经过本地时区换算，不使用执行迁移的日期。`_createdAt` 也随导入文件携带源日期。
- `legacySource` 保留原文地址、路径、原始发布时间及原始更新时间。它在 Studio 中只读，折叠展示。Sanity 自身 `_updatedAt` 会随着资产关联、后续编辑、发布而改变，不能替代原始时间。
- 全部创建为 `drafts.gainmore-*` 草稿，固定 ID 来自原文路径摘要；不自动发布。保留原标题和 slug，不重写旧文章的技术观点。
- 文章之间的旧链接改为新站 `/posts/<slug>`；标题锚点对应新正文目录的锚点。

## 正文和图片

从 HTML 的 `article#post` 提取正文，移除主题元数据、版权页脚、侧边栏及脚本。保留行内样式、链接、标题和嵌套列表；代码去掉主题行号，保留源 HTML 中已有的换行、缩进以及内容（源代码本身已经粘连的地方不擅自重新排版）。

普通表格以 Markdown 代码块保留；非 1 起始的有序列表使用显式编号段落保留原始数字。交互组件不执行其脚本，原始 HTML 保留在本地备份中。

图片先下载到本地并检查文件头，再上传至 Sanity。下载失败的图片转换为可点击的原图链接；旧 Windows 电脑本机路径无法下载，保留缺图说明。不会将错误页面当图片上传，也不让失效图片导致整篇文章丢失。

## 执行

使用 Node.js 22，先在项目目录登录 `npx sanity login`，不要把 Token 写进脚本或提交仓库。

```sh
npm run migrate:gainmore -- ~/coding/gainmore
python3 scripts/migration/prepare-assets.py ~/coding/gainmore
npm run migrate:gainmore:import
```

转换与下载命令不写入云端；只有最后一步新增远端草稿和资产。下载结果会缓存，传入 `--retry` 可重试失败图片。导入前检查 ID、slug 冲突和时间，不覆盖已存在的同 ID 草稿或已发布版本。导入后查询核对草稿数量、发布时间、原始更新时间、正文块数及图片引用数量。

导出和备份都在 `.gitignore` 排除的 `migration-output/gainmore/` 下：

- `posts-source.ndjson`：转换结果，保留原始图片 URL。
- `posts.ndjson`：可导入文件，图片引用下载到的本地文件。
- `source-html/`：84 篇原始 HTML 备份。
- `report.json`：文章清单、时间和转换提醒。
- `asset-results.json`、`missing-images.json`：逐图片下载结果和缺图对应文章。
- `before-import.json`、`after-import.json`、`import-result.json`：云端导入与校验结果。

这些本地文件是恢复依据，建议单独备份；它们不随 Git 提交，也不是网站运行所需资源。待草稿检查后，在 Studio 手动发布即可保持原始发布时间上线。

## 本次发布结果

2026-11-15，用户审核草稿并授权发布后，通过 Sanity 发布接口发布了全部 84 篇迁移文章。云端复查：84 篇原始发布时间和审核后的正文完全一致，迁移草稿已清除，其他文章未修改。发布前的草稿备份、发布后的完整数据与事务记录保存在本地迁移目录。
