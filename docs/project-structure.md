# 项目结构说明

本项目使用 Next.js App Router，并启用 `src` 目录。目录设计遵守 Next.js 的路由约定，同时使用 `features` 和 `shared` 做业务分层，方便长期维护。

## 顶层结构

```txt
src/
├── app/        # Next.js App Router 路由文件与 Route Handlers
├── features/   # 按页面/业务域拆分的功能模块
└── shared/     # 跨业务复用的公共代码
```

## `src/app`

`src/app` 只放 Next.js 约定相关的文件：

- `layout.tsx`
- `page.tsx`
- `globals.css`
- `favicon.ico`
- `*/page.tsx`
- `api/*/route.ts`

路由文件应尽量保持轻量，只负责把 URL 连接到对应的 feature 组件，不承载完整页面实现。

示例：

```tsx
import MusicPage from "@/features/music/components/MusicPage";

export default function MusicBoxRoute() {
  return <MusicPage />;
}
```

当前路由：

```txt
src/app/
├── page.tsx
├── about/page.tsx
├── musicbox/page.tsx
└── api/
    ├── bilibili/route.ts
    ├── douyin/route.ts
    └── weibo/route.ts
```

## `src/features`

`features` 存放某个页面或业务域专属的代码。

```txt
src/features/
├── about/
├── home/
└── music/
```

当代码只服务于某个页面或业务模块时，应放入对应的 feature 目录。

feature 内部目录约定：

- `components/`：该业务域专属组件。
- `data/`：该业务域的数据、兜底数据、静态内容。
- `hooks/`：该业务域专属 hooks。
- `context/`：该业务域专属 React Context。
- `constants/`：该业务域专属常量。
- `types/`：该业务域专属类型。
- `styles/`：该业务域专属样式。

不同 feature 之间不要随意互相引用内部实现。如果某段代码确实被多个业务域复用，应移动到 `src/shared`。

## `src/shared`

`shared` 存放多个业务域复用的代码，或根应用外壳需要使用的公共代码。

```txt
src/shared/
├── components/
│   ├── icons/
│   ├── layout/
│   ├── providers/
│   ├── transitions/
│   └── ui/
├── lib/
└── styles/
```

适合放入 `shared` 的内容：

- 导航栏、页脚等应用外壳组件。
- 全局 Provider。
- 基础 UI 组件。
- 公共图标。
- 通用工具函数。
- 跨业务复用的样式与动画。

不要把某个页面专属的文案、样式或业务逻辑放入 `shared`。只有当代码确实存在复用价值，或者属于全局应用外壳时，才移动到这里。

## 导入规则

项目使用 `@/*` 作为 `src` 路径别名。

推荐：

```ts
import { cn } from "@/shared/lib/utils";
import MusicPage from "@/features/music/components/MusicPage";
```

避免跨目录使用过长的相对路径：

```ts
// 不推荐
import MusicPage from "../../features/music/components/MusicPage";
```

同一目录或相邻文件之间可以使用相对路径。

## 命名规则

- React 组件文件使用 PascalCase，例如 `MusicPlayerBar.tsx`。
- Hook 文件使用 `useXxx.ts`，例如 `useAboutData.ts`。
- 非组件 TypeScript 文件使用 kebab-case 或语义化短名，例如 `music-data.ts`、`social-api.ts`。
- 基础 UI 组件沿用 shadcn 风格，使用小写文件名，例如 `button.tsx`、`card.tsx`。
- CSS 文件使用 kebab-case，例如 `home-page.css`、`music-player.css`。
- Next.js 约定文件保持官方命名，例如 `page.tsx`、`layout.tsx`、`route.ts`。
- 文件名应与默认导出的组件或模块职责一致，避免 `Wrapper`、`Utils` 这类含义过宽的命名。

## 样式规则

- 全局 Tailwind、设计 token、基础样式放在 `src/app/globals.css`。
- 跨业务复用动画放在 `src/shared/styles`。
- 页面或业务域专属 CSS 放在对应 feature 内，例如 `src/features/music/styles`。
- 静态资源统一放在 `public`。

## 新增代码规则

新增页面时：

1. 在 `src/app` 中创建路由入口。
2. 在 `src/features/<feature-name>` 中创建页面实现。
3. 保持 `src/app` 中的 route 文件轻量。
4. 只有当代码确实被复用时，才移动到 `src/shared`。

新增公共组件时：

1. 基础 UI 放在 `src/shared/components/ui`。
2. 应用外壳组件放在 `src/shared/components/layout`。
3. Provider 放在 `src/shared/components/providers`。
4. 公共组件中避免混入具体页面的业务文案、业务数据和专属样式。

## 与 Next.js 官方约定的关系

Next.js 通过 `app` 目录和 `page.tsx`、`layout.tsx`、`route.ts` 等特殊文件定义路由行为。

`features` 和 `shared` 不是 Next.js 的保留目录名，而是本项目的工程组织约定。它们放在 `app` 外部，因此不会参与路由生成。
