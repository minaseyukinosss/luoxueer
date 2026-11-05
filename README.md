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
├── app/                 # Next.js App Router 路由入口、layout、API routes
├── features/            # home / music / about 等业务域模块
└── shared/              # 跨业务复用的 layout、providers、ui、icons、lib、styles
public/
├── audio/               # 音频资源
└── images/              # 静态图片资源
```

完整结构规范见 [`docs/project-structure.md`](docs/project-structure.md)，英文版见 [`docs/project-structure.en.md`](docs/project-structure.en.md)。

## 说明

- 社交媒体接口受目标平台与网络环境影响，可能出现限流或不可用；About 页会在失败时展示 fallback 数据。

## 许可证

私有项目（`package.json` 中 `"private": true`）。

## 抖音数据容错

- 成功获取的数据写入 `SOCIAL_STATS_DATA_DIR/douyin.json`；未设置时使用项目下的 `.data/`（已忽略提交）。
- 使用 Playwright 独立游客上下文读取抖音网页自身的公开资料响应，无需登录账号或第三方 API。
- 页面可见时每 2 分钟刷新抖音数据，返回页面时也会刷新；服务端按需每 2 分钟更新；失败后等待 5 分钟再请求。同一进程的并发请求合并处理。
- 接口失败时保留上次成功的数字与时间，过期数据标注“历史数据”；没有成功快照时显示 `--`。直播状态只在 2 分钟缓存有效期内展示，过期后视为未知。
- 部署脚本将数据目录设为 `/www/wwwroot/luoxueer/data/social-stats`，位于每次替换的 `standalone` 目录之外。运行进程需要对此目录有写权限。
- 部署会将 Chromium 安装到 `PLAYWRIGHT_BROWSERS_PATH=/www/wwwroot/luoxueer/data/browsers`。Linux 首次部署前需要管理员在源码目录运行 `pnpm exec playwright install-deps chromium`，安装浏览器系统依赖；后续发布复用浏览器下载缓存。
- 本地可运行 `pnpm exec playwright install chromium`，或用 `DOUYIN_BROWSER_EXECUTABLE` 指向现有 Chrome/Chromium 可执行文件。
- 游客响应可能受平台验证、网络和页面变化影响，失败时沿用历史快照；不会自动登录或处理验证码。
- 回归检查：`pnpm test:douyin`。
