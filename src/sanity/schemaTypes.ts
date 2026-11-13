import { defineArrayMember, defineField, defineType } from "sanity";

export const schemaTypes = [
  defineType({
    name: "post",
    title: "文章",
    type: "document",
    fields: [
      defineField({
        name: "title",
        title: "标题",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "slug",
        title: "链接标识",
        type: "slug",
        options: { source: "title", maxLength: 96 },
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "excerpt", title: "摘要", type: "text", rows: 3 }),
      defineField({
        name: "coverImage",
        title: "封面",
        type: "image",
        options: { hotspot: true },
        fields: [
          defineField({ name: "alt", title: "图片描述", type: "string" }),
        ],
      }),
      defineField({
        name: "tags",
        title: "标签",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
        options: { layout: "tags" },
      }),
      defineField({
        name: "publishedAt",
        title: "发布时间",
        type: "datetime",
        initialValue: () => new Date().toISOString(),
      }),
      defineField({
        name: "body",
        title: "正文",
        type: "array",
        of: [
          defineArrayMember({ type: "block" }),
          defineArrayMember({
            type: "image",
            options: { hotspot: true },
            fields: [
              defineField({ name: "alt", title: "图片描述", type: "string" }),
            ],
          }),
          defineArrayMember({
            name: "codeBlock",
            title: "代码块",
            type: "object",
            fields: [
              defineField({
                name: "language",
                title: "语言",
                type: "string",
                initialValue: "typescript",
              }),
              defineField({
                name: "code",
                title: "代码",
                type: "text",
                rows: 12,
              }),
            ],
          }),
        ],
      }),
    ],
    preview: {
      select: { title: "title", media: "coverImage", subtitle: "publishedAt" },
    },
    orderings: [
      {
        title: "发布时间（最新优先）",
        name: "publishedAtDesc",
        by: [{ field: "publishedAt", direction: "desc" }],
      },
    ],
  }),
];
