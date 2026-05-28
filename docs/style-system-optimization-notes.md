# 样式体系深层优化说明

## 1. 全局 token 分层

- 问题：`globals.css` 同时承载 Tailwind 入口、基础变量、品牌色、页面私有色和全局工具类，职责过重。
- 改动：新增 `src/shared/styles/tokens.css`，把基础语义色、品牌色、背景色、渐变、暗色变量集中到 token 文件；`globals.css` 只保留 Tailwind 接入、基础样式、共享动画和滚动条工具类。
- 收益：全局样式职责更清晰，后续调整品牌色、暗色模式或页面主题时，不需要在 Tailwind 入口文件里翻找大量业务样式。
- 后续：about 页面中仍有不少 `text-[#E77A9A]` 这类硬编码颜色，可以逐步迁移到 token。

## 2. 首页样式变量命名空间

- 问题：首页 CSS 在 `:root` 中定义 `--gradient-primary`、`--gradient-secondary` 等通用变量名，容易覆盖或混淆全局 token 中的同名变量。
- 改动：将首页私有变量统一改成 `--home-gradient-*` 前缀，例如 `--home-gradient-primary`、`--home-gradient-ripple`。
- 收益：首页视觉效果仍然保持原样，但变量语义更明确，不会污染其他页面。
- 后续：如果首页动画继续扩展，可以进一步把这些变量挂到首页根节点，而不是 `:root`。

## 3. 共享动画收敛

- 问题：共享动画文件里存在音乐播放器旧实现的动画、`.active span` 泛选择器和多个 `!important`，有全局误伤风险。
- 改动：`src/shared/styles/animations.css` 只保留跨页面复用的低风险动画工具类和隐藏滚动条工具，移除唱片、歌词、泛 `.active span` 等业务样式。
- 收益：共享动画层不再承载 feature 私有样式，减少全局 class 命名冲突和不可预期覆盖。
- 后续：新增动画时先判断是共享能力还是页面私有效果，避免重新把 feature 样式放回 shared。

## 4. 音乐页 CSS 去冗余

- 问题：音乐页样式包中存在大量旧实现类，例如 `.music-player`、`.glass-container`、`.volume-slider`、`.turntable-*`、`.tonearm-*`，当前组件没有实际引用。
- 改动：音乐样式入口 `src/features/music/styles/index.css` 只保留当前真实依赖的共享动画和 `vinyl-disc.css`。删除未使用的旧 CSS 文件。
- 收益：音乐页 CSS 从旧的多文件大包收敛到黑胶唱片效果本身，样式体积和维护面都明显下降。
- 后续：如果未来重做播放器皮肤，可以按组件重新增加局部 CSS，不建议恢复大而全的样式包。

## 5. 暗色模式策略统一

- 问题：项目主要使用 Tailwind 的 `.dark` class 作为暗色模式入口，但黑胶样式原本使用 `prefers-color-scheme: dark`，两套策略可能不一致。
- 改动：`vinyl-disc.css` 改为使用 `.dark .vinyl-*` 选择器。
- 收益：黑胶唱片样式与应用暗色状态保持一致，不再受系统设置单独影响。
- 后续：其他 CSS 中如果需要暗色适配，也应优先跟随 `.dark`。

## 6. 样式外部资源本地化

- 问题：音乐页背景和黑胶纹理依赖远程 `noise.svg`，会受到第三方可用性和网络状态影响。
- 改动：新增 `public/images/noise.svg`，并将音乐页和黑胶纹理引用改成本地路径。
- 收益：视觉纹理不再依赖外部站点，加载更稳定，也更利于部署和缓存控制。
- 后续：如果需要更细腻的纹理，可以替换本地 SVG，但保持资源归档在 `public/images` 内。

## 7. 优化结果

- CSS 行数从约 1628 行减少到约 740 行。
- 全局样式入口更轻，feature 私有样式边界更清晰。
- 重复动画和高风险全局选择器已收敛。
- 当前视觉主路径保持不变，重点调整的是样式组织、覆盖关系和长期维护成本。
