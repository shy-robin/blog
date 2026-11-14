import type { StructureBuilder } from "sanity/structure";

export function studioStructure(S: StructureBuilder) {
  return S.list()
    .id("blog")
    .title("博客管理")
    .items([
      S.documentTypeListItem("post").title("文章"),
      S.documentTypeListItem("project").title("项目"),
      S.divider(),
      S.listItem()
        .title("个人资料")
        .id("profile")
        .child(
          S.editor()
            .id("profile")
            .schemaType("profile")
            .documentId("profile")
            .title("个人资料"),
        ),
    ]);
}
