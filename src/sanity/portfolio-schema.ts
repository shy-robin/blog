import { defineArrayMember, defineField, defineType } from "sanity";

const imageFields = [
  defineField({ name: "alt", title: "图片描述", type: "string" }),
];
const urlValidation = (rule: import("sanity").UrlRule) =>
  rule.uri({ scheme: ["http", "https"] });

export const portfolioSchemaTypes = [
  defineType({
    name: "profile",
    title: "个人资料",
    type: "document",
    fields: [
      defineField({
        name: "name",
        title: "展示名字",
        type: "string",
        initialValue: "ShyRobin",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "intro",
        title: "一句话介绍",
        type: "string",
        initialValue: "记录 Web 前端开发的实践与思考。",
      }),
      defineField({
        name: "avatar",
        title: "头像",
        type: "image",
        options: { hotspot: true },
        fields: imageFields,
      }),
      defineField({
        name: "bio",
        title: "自我介绍",
        description: "段落之间空一行，只填写希望公开的内容。",
        type: "text",
        rows: 8,
      }),
      defineField({
        name: "location",
        title: "所在城市（可选）",
        type: "string",
      }),
      defineField({
        name: "githubUrl",
        title: "GitHub 地址",
        type: "url",
        initialValue: "https://github.com/shy-robin",
        validation: urlValidation,
      }),
      defineField({
        name: "email",
        title: "公开联系邮箱（可选）",
        description: "填写后会公开显示在关于页，不会自动使用 Git 提交邮箱。",
        type: "string",
        validation: (rule) => rule.email(),
      }),
      defineField({
        name: "interests",
        title: "关注方向 / 技术标签",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
        options: { layout: "tags" },
        validation: (rule) => rule.unique(),
      }),
      defineField({
        name: "experiences",
        title: "技术经历",
        type: "array",
        of: [
          defineArrayMember({
            name: "experience",
            title: "经历",
            type: "object",
            fields: [
              defineField({
                name: "role",
                title: "角色 / 经历标题",
                type: "string",
                validation: (rule) => rule.required(),
              }),
              defineField({
                name: "organization",
                title: "公司 / 团队（可选）",
                type: "string",
              }),
              defineField({
                name: "period",
                title: "时间说明（可选）",
                type: "string",
                description: "例如：2024 — 至今。未填写时不会自动推断。",
              }),
              defineField({
                name: "summary",
                title: "经历介绍",
                type: "text",
                rows: 4,
              }),
            ],
            preview: { select: { title: "role", subtitle: "organization" } },
          }),
        ],
      }),
    ],
    preview: { select: { title: "name", subtitle: "intro", media: "avatar" } },
  }),
  defineType({
    name: "project",
    title: "项目",
    type: "document",
    fields: [
      defineField({
        name: "title",
        title: "项目名称",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "summary",
        title: "项目简介",
        type: "text",
        rows: 3,
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "coverImage",
        title: "项目截图",
        type: "image",
        options: { hotspot: true },
        fields: imageFields,
      }),
      defineField({
        name: "technologies",
        title: "技术栈",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
        options: { layout: "tags" },
        validation: (rule) => rule.unique(),
      }),
      defineField({ name: "role", title: "我的职责", type: "string" }),
      defineField({
        name: "contributions",
        title: "解决的问题 / 个人贡献",
        description: "每行一项，不需要输入列表符号。",
        type: "text",
        rows: 5,
      }),
      defineField({
        name: "demoUrl",
        title: "在线演示地址（可选）",
        type: "url",
        validation: urlValidation,
      }),
      defineField({
        name: "sourceUrl",
        title: "源码地址（可选）",
        type: "url",
        validation: urlValidation,
      }),
      defineField({
        name: "sortOrder",
        title: "展示顺序",
        description: "数字越小越靠前。",
        type: "number",
        initialValue: 0,
        validation: (rule) => rule.integer().min(0),
      }),
    ],
    preview: {
      select: { title: "title", subtitle: "summary", media: "coverImage" },
    },
    orderings: [
      {
        title: "展示顺序",
        name: "sortOrderAsc",
        by: [{ field: "sortOrder", direction: "asc" }],
      },
    ],
  }),
];
