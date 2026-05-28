# 前端优化改动说明

## 1. 微博凭据处理

- 问题：微博 API route 里原本直接写入完整 Cookie，凭据容易泄露，也不方便轮换。
- 改动：`src/app/api/weibo/route.ts` 改为从运行时环境变量 `WEIBO_COOKIE` 读取 Cookie，只有变量存在时才发送 `Cookie` 请求头。
- 收益：敏感信息不再进入代码仓库，部署环境可以独立更新凭据，本地开发也能在无 Cookie 时正常走 fallback。
- 后续：如果线上需要获取实时微博数据，需要在部署平台配置 `WEIBO_COOKIE`。

## 2. 社交平台 API 缓存策略

- 问题：社交数据接口原本返回 `no-store`，每次刷新都有可能直接请求第三方接口。
- 改动：新增 `src/shared/lib/api-cache.ts` 管理统一缓存头。B 站、抖音、微博接口现在返回 `s-maxage=60` 和 `stale-while-revalidate=300`；fallback 数据使用更短缓存。
- 收益：降低第三方接口限流风险，提升页面数据稳定性，同时保持数据有合理的新鲜度。
- 后续：如果直播状态需要比粉丝数更高的实时性，可以按平台细分 `SOCIAL_STATS_CACHE_SECONDS`。

## 3. 音乐播放器进度状态隔离

- 问题：`currentTime` 和 `duration` 原本放在主音乐 context 中，播放进度频繁更新会让所有 `useMusic()` 消费组件收到新的 context value。
- 改动：在 `MusicContext.tsx` 中新增轻量外部进度 store，并暴露 `useMusicProgress()`。歌词和进度条现在只订阅播放进度数据。
- 收益：播放按钮、队列、音量、播放模式等组件不会再因为播放时间推进而频繁重渲染。
- 后续：如果后续播放列表规模变大，可以继续把队列操作拆成独立 store。

## 4. 进度条 Pointer Events 交互

- 问题：桌面端进度拖拽原本只监听鼠标事件，移动端只支持点击/触摸跳转。
- 改动：`ProgressBar.tsx` 改用 Pointer Events 处理桌面拖拽，并为移动端进度条补充 pointer seek。
- 收益：鼠标、触摸、触控板等输入方式的交互路径更统一，也减少了全局事件监听和清理逻辑。
- 后续：如果播放器需要更完整的无障碍体验，可以继续补充键盘快进/后退能力。

## 5. 首页动画目标绑定

- 问题：首页动画原本查询 `.greeting-container`、`.name-container`、`.wishes-container`，但实际渲染结构中没有这些 class，导致入场动画目标不稳定。
- 改动：`HomePage.tsx` 改为给每组文案绑定 React ref，并把 hover 查询范围限制在首页根节点内。
- 收益：动画目标和实际渲染元素直接绑定，减少选择器漂移带来的失效风险。
- 后续：如果后面继续增加动画文案组，可以抽一个复用的文字动画 hook。

## 6. 运行时安全与可访问性

- 问题：项目原本关闭了 React Strict Mode，同时 viewport 禁止移动端用户缩放。
- 改动：在 `next.config.ts` 中开启 `reactStrictMode`，并从 viewport 配置中移除 `maximumScale` / `userScalable`。
- 收益：Strict Mode 可以在开发阶段更早暴露不安全副作用；移动端用户也能恢复浏览器默认缩放能力。
- 后续：本地开发时如果出现 effect 重复执行引发的问题，通常说明对应清理逻辑还可以继续收紧。
