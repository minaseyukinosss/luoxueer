# Luoxueer

基于 Next.js 的个人站点：生日祝福首页、音乐盒播放器，以及聚合社交媒体数据的 About 页面。支持中 / 英 / 日界面切换。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | [Next.js 16](https://nextjs.org/)（App Router、Turbopack） |
| UI | React 19、TypeScript、Tailwind CSS 4 |
| 动画 | GSAP、Lenis（平滑滚动）、Lottie |
| 音频 | Howler |
| 组件 | Radix Slot、`lucide-react` |

## 功能概览

- **`/`** — 全屏生日祝福页：GSAP 粒子随鼠标偏移、点击水波纹、文字入场与悬停动。
- **`/musicbox`** — 音乐盒：播放列表、歌词区、底部播放控制（Howler + 上下文状态）。
- **`/about`** — 个人/社交概览：从服务端 API 拉取 B 站、抖音、微博等数据（失败时使用内置 fallback），动态与筛选展示。

## 环境要求

- Node.js 18+（建议与 Next 16 官方要求一致）
- [pnpm](https://pnpm.io/) 9.x（仓库已指定 `packageManager`）

`next.config.ts` 中已启用 `output: 'standalone'`，构建后可按 [Next.js Standalone 部署说明](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) 将 `.next/standalone` 与静态资源一并部署。

## 目录结构（摘要）

```
src/
├── app/                 # App Router 页面与 API
│   ├── page.tsx         # 首页
│   ├── musicbox/
│   ├── about/
│   └── api/             # bilibili / douyin / weibo
├── components/          # 导航、预加载、音乐播放器、国际化等
├── contexts/
├── data/
├── lib/
├── styles/
└── constants/
public/
└── images/              # 静态资源（如首页配图）
```

## 说明

- 社交媒体接口受目标平台与网络环境影响，可能出现限流或不可用；About 页会在失败时展示 fallback 数据。

## 许可证

私有项目（`package.json` 中 `"private": true`）。
