# Gemini CLI 的项目特定指南

此文件包含帮助 Gemini CLI 在此项目中更有效运行的配置和指南。

## 1. 项目命令

### 运行开发服务器
要运行开发服务器，请使用以下命令：

```bash
npm run dev
```

### 构建项目
要为生产环境构建项目，请使用以下命令：

```bash
npm run build
```

### 启动生产服务器
要启动生产服务器，请使用以下命令：

```bash
npm run start
```

### Linting
要对项目进行 linting，请使用以下命令：

```bash
npm run lint
```

## 2. 常用文件路径

- `src/app/page.tsx`: 主页文件。
- `src/app/layout.tsx`: 布局文件。
- `src/app/globals.css`: 全局样式文件。
- `public/demos/blog/`: 包含博客示例的目录。

## 3. 项目约定

- **Commit 信息**: 使用中文生成 commit 信息。
- **敏感信息与个人数据**: 开始工作前必读并遵守 [AGENTS.md](AGENTS.md) 中的敏感信息约定；禁止提交密钥与真实个人数据，提交前自查 staged diff。
