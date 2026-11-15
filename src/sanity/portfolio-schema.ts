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
        name: "qq",
        title: "公开 QQ 号（可选）",
        type: "string",
        description:
          "点击页脚 QQ 入口尝试唤起 QQ，需要访客安装应用并允许跳转。",
        validation: (rule) => rule.regex(/^[1-9]\d{4,11}$/, { name: "QQ 号" }),
      }),
      defineField({
        name: "wechat",
        title: "公开微信号（可选）",
        type: "string",
        description: "仅保存联系方式；页脚通过下方好友二维码展示微信入口。",
        validation: (rule) => rule.max(64),
      }),
      defineField({
        name: "wechatQrCode",
        title: "微信好友二维码（可选）",
        description:
          "上传微信个人二维码名片，页脚点击 WeChat 后展示。请保留完整二维码和四周白边。",
        type: "image",
        fields: imageFields,
      }),
      defineField({
        name: "gender",
        title: "性别（可选）",
        type: "string",
      }),
      defineField({
        name: "birthDate",
        title: "出生日期（可选）",
        type: "date",
        description: "前台按北京时间自动计算年龄，不直接显示完整出生日期。",
      }),
      defineField({
        name: "hometown",
        title: "籍贯（可选）",
        type: "string",
      }),
      defineField({
        name: "school",
        title: "学校（可选）",
        type: "string",
      }),
      defineField({
        name: "occupation",
        title: "职业（可选）",
        type: "string",
      }),
      defineField({
        name: "basicInfo",
        title: "基本信息（可选）",
        description:
          "可添加其他公开资料，如称呼。性别、年龄、籍贯、学校和职业使用上方专用字段，城市不显示。未填写时保留展示名字。",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "profileInfo",
            title: "资料项",
            fields: [
              defineField({
                name: "label",
                title: "名称",
                type: "string",
                validation: (rule) => rule.required(),
              }),
              defineField({
                name: "value",
                title: "内容",
                type: "string",
                validation: (rule) => rule.required(),
              }),
            ],
            preview: { select: { title: "label", subtitle: "value" } },
          }),
        ],
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
