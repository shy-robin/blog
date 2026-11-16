export function PreviewBanner() {
  return (
    <p className="preview-banner" role="status">
      草稿预览：当前展示未发布内容，仅你可见。
      <a href="/api/draft-mode/disable">退出预览</a>
    </p>
  );
}
