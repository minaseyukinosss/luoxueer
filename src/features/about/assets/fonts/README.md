# 动态标题字体

`news-serif.ttf` 为 [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC) 的 600 字重精简版，采用同目录 `OFL.txt` 中的 SIL Open Font License。

仅用于图片下方的动态标题。模块标题、正文及右侧列表保持原字体；日期导航与序号使用已有的站内字体。

字体约 67 KB，由 `next/font/local` 随网站提供，不会在访客浏览时请求 Google Fonts。

精简字库覆盖现有中、英、日文标题。新增标题后在项目根目录运行 `node scripts/update-news-font.mjs`，并一并提交生成的字体文件；未覆盖字符仍会回退到本机宋体/衬线字体。
