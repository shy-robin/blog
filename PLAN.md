# “小森林”博客网站开发计划

本文档旨在将 “xiao_sen_lin” 静态 Demo 扩展为一个功能完善的、动态的、可维护的博客网站。我们将从前端和后端两个角度，详细阐述技术选型、关键功能点和注意事项。

---

## 一、 前端 (Frontend)

前端的核心目标是将静态的 HTML 页面转化为一个由数据驱动的、组件化的现代 Web 应用，同时保持“小森林”独特的设计风格。

### 1. 技术栈选型

- **框架 (Framework):** **Next.js (React)**
  - **理由:** `Next.js` 是一个功能强大的 React 框架，与本项目技术栈吻合。它提供了生产环境所需的所有功能，如混合渲染（服务端渲染 SSR 和静态站点生成 SSG）、路由、API 路由等，非常适合博客这类内容驱动的网站。
- **样式 (Styling):** **Tailwind CSS** 或 **CSS Modules**
  - **理由:** 虽然现有的是原生 CSS，但为了更好的可维护性和组件化，推荐使用 `Tailwind CSS` 或 `CSS Modules`。`Tailwind CSS` 可以快速构建界面，而 `CSS Modules` 能确保组件样式的隔离。考虑到现有项目已使用 `Tailwind CSS`，继续使用是最佳选择。
- **数据请求 (Data Fetching):** **SWR** 或 **React Query**
  - **理由:** 用于从后端 API 获取数据。`SWR` 由 `Next.js` 的团队开发，集成度高，轻量易用。`React Query` 功能更强大，缓存管理更灵活。两者都是优秀的选择。
- **Markdown/MDX 解析:** **`gray-matter`** 和 **`remark` / `rehype`**
  - **理由:** 博客文章通常用 Markdown 编写。`gray-matter` 用于解析 Markdown 文件头部的元数据（如标题、日期、标签），`remark`/`rehype` 系列插件则负责将 Markdown 内容安全地转换为 HTML。

### 2. 关键功能点与注意事项

- **组件化:**
  - 将现有页面中的重复部分（如页头、页脚、文章卡片、导航栏）拆分为可复用的 React 组件。
- **动态路由:**
  - 使用 Next.js 的动态路由功能来生成文章页面。例如，`pages/posts/[slug].js` 可以根据文章的唯一标识（slug）动态渲染页面。
- **数据驱动:**
  - **首页/归档页:** 从后端获取文章列表数据，然后使用 `.map()` 循环渲染文章卡片组件。
  - **文章详情页:** 根据路由中的 `slug` 参数，获取特定文章的内容和元数据进行渲染。
  - **分类/标签页:** 实现逻辑以根据分类或标签过滤文章列表。
- **API 交互:**
  - **评论功能:** 创建一个表单，用户提交评论时，通过 API 将数据发送到后端。
  - **联系表单:** 与评论功能类似，将表单数据提交到后端进行处理。
- **SEO 优化:**
  - 利用 Next.js 的 `getStaticProps` 或 `getServerSideProps` 在构建时或请求时获取数据，并使用 `next/head` 组件为每个页面动态生成 `<title>` 和 `<meta>` 标签，这对 SEO 至关重要。

---

## 二、 后端 (Backend)

后端的核心目标是提供数据存储、处理和 API 接口，为前端提供动态内容支持。

### 1. 技术栈选型

- **框架 (Framework):** **Next.js API Routes** 或 **Express.js / NestJS**
  - **Next.js API Routes:** 对于中小型博客，可以直接使用 Next.js 自带的 API 路由功能，可以快速搭建后端接口，无需额外的服务。这能极大地简化开发和部署流程。
  - **Express.js / NestJS:** 如果计划未来扩展更复杂的功能，或者希望前后端完全分离，可以选择 `Express.js` (轻量灵活) 或 `NestJS` (功能强大，基于 TypeScript)。
- **数据库 (Database):** **PostgreSQL** 或 **MongoDB**
  - **PostgreSQL:** 一款功能强大的关系型数据库，非常适合结构化数据（如用户、文章、评论），数据一致性高。
  - **MongoDB:** 一款流行的 NoSQL 数据库，以其灵活的文档模型著称，对于文章和评论这类半结构化数据非常友好。
- **ORM / ODM:** **Prisma** 或 **Mongoose (for MongoDB)**
  - **Prisma:** 一个现代化的数据库工具集，支持 TypeScript，可以轻松地与多种数据库交互，提供类型安全的查询，能显著提升开发效率。
  - **Mongoose:** 如果选择 MongoDB，`Mongoose` 是事实上的标准，提供了强大的数据建模和校验功能。
- **认证 (Authentication):** **NextAuth.js** 或 **JWT (JSON Web Tokens)**
  - **NextAuth.js:** 如果需要用户登录（例如，用于后台管理），`NextAuth.js` 是一个与 Next.js 无缝集成的优秀认证库，支持多种登录方式。
  - **JWT:** 如果需要自己实现认证逻辑，可以使用 JWT 来创建和验证用户身份令牌。

### 2. 关键功能点与注意事项

- **API 设计 (RESTful API):**
  - 设计清晰的 API 端点 (Endpoints)，例如：
    - `GET /api/posts`: 获取所有文章列表（支持分页）。
    - `GET /api/posts/:slug`: 获取单篇文章详情。
    - `POST /api/posts/:slug/comments`: 为某篇文章添加评论。
    - `GET /api/tags`: 获取所有标签列表。
- **数据模型 (Database Schema):**
  - **`Post` (文章):** `id`, `title`, `slug`, `content`, `coverImage`, `authorId`, `createdAt`, `updatedAt`。
  - **`User` (用户):** `id`, `name`, `email`, `password` (需加密存储)。
  - **`Comment` (评论):** `id`, `content`, `authorName`, `postId`, `createdAt`。
  - **`Tag` (标签):** `id`, `name`。
- **后台管理系统 (CMS):**
  - 为了方便地发布和管理文章，需要一个后台管理界面。可以自己开发，也可以集成一个 Headless CMS，如 `Strapi`, `Contentful` 或 `Sanity`。
- **安全性:**
  - **密码存储:** 绝不能明文存储用户密码，必须使用 `bcrypt` 等库进行哈希加密。
  - **API 安全:** 对需要权限的 API 端点（如发布文章）进行保护，确保只有认证用户才能访问。
  - **数据校验:** 对所有来自客户端的输入（如评论、表单）进行严格的校验，防止 XSS 等攻击。
