# 关于页动态来源

核验日期：2026-11-06。页面日期均为原动态的发布日期，摘要为编辑整理。

| 发布日期 | 页面标题 | 渠道 | 原文 |
| --- | --- | --- | --- |
| 2026-11-03 | 近况影像 | 微博 | https://weibo.com/6106700809/5361134813317774 |
| 2026-10-20 | 盛夏的我们 | 微博 | https://weibo.com/6106700809/5356092054831382 |
| 2026-09-11 | 学功夫练武术！ | B站 | https://www.bilibili.com/video/BV1KzY76jEuM/ |
| 2026-09-03 | 面具之下 | 微博 | https://weibo.com/6106700809/5339041131398399 |
| 2026-08-27 | 杳无音讯 | B站 | https://www.bilibili.com/video/BV1grhF6PECk/ |
| 2026-08-20 | 我保证你是天使 | B站 | https://www.bilibili.com/video/BV1FR8c6nEmv/ |
| 2026-07-27 | 半壶纱 | B站 | https://www.bilibili.com/video/BV1zqgd6DE4C/ |
| 2026-07-20 | 恶魔未必有我坏 | B站 | https://www.bilibili.com/video/BV1kZKp6WEk6/ |
| 2026-05-13 | 好好告个别 | B站 | https://www.bilibili.com/video/BV1QP5y6EEtk/ |

微博通过新浪官方展示页交叉核对：

- https://www.sina.cn/news/detail/5361134813317774.html
- https://www.sina.cn/news/detail/5356092054831382.html
- https://www.sina.cn/news/detail/5339041131398399.html

B站通过本人主页和各视频页面的公开资料核对，六条视频的作者 UID 均为 `406895348`，昵称为「罗雪儿_」。发布时间按 `Asia/Shanghai` 转换为日期。

## 配图

使用对应原动态的公开配图，保留原图水印，压缩为本地 WebP：

- `recently.webp`：https://wx2.sinaimg.cn/large/006Fh5Qlgy1iiouwk3hzhj30mi0u0tar.jpg
- `summer-announcement.webp`：https://wx3.sinaimg.cn/large/006Fh5Qlgy1ii8rscnq71j32yo1o0b2a.jpg
- `mask.webp`：https://wx2.sinaimg.cn/large/006Fh5Qlgy1igqdih706lj30xi1n8dxh.jpg
- `kung-fu.webp`：https://i0.hdslb.com/bfs/archive/22f6e54dabdb4c101e0ce7e330887e3681609961.jpg
- `no-word.webp`：https://i2.hdslb.com/bfs/archive/b6b83f2d1bf87ef286758a208d2a8106d5a40050.jpg
- `angel.webp`：https://i2.hdslb.com/bfs/archive/80c5591fe2c58762ede2f10f714d28d2cfc681ce.jpg
- `singing.webp`：https://i1.hdslb.com/bfs/archive/dc394c740398bfaeb23a9436ee23524377aa4ae2.jpg
- `devil.webp`：https://i1.hdslb.com/bfs/archive/594dba084bdc9023f5129697a8cf30ac32528a6f.jpg
- `goodbye.webp`：https://i1.hdslb.com/bfs/archive/b86f4b352c76ecad6a4d67bdffcf3959892fc4f4.jpg

## 编辑说明

第一条图集通过微博官方 `/ajax/statuses/show?id=5361134813317774` 的 `mix_media_info.items` 核对，共 9 项：前 7 项照片，后 2 项视频。第 3、4 张原帖为 Live Photo，此处展示静态照片；两段独立视频保留播放功能。按返回顺序保存，未用重复图片凑格子：

1. `recently.webp`：https://wx2.sinaimg.cn/large/006Fh5Qlgy1iiouwk3hzhj30mi0u0tar.jpg
2. `recently-2.webp`：https://wx1.sinaimg.cn/large/006Fh5Qlgy1iiouwjnsdej30me0tuael.jpg
3. `recently-3.webp`：https://wx2.sinaimg.cn/large/006Fh5Qlgy1iiouxj9nzsj30mi0u0ace.jpg
4. `recently-4.webp`：https://wx2.sinaimg.cn/large/006Fh5Qlgy1iiouwgzisej30mi0u00w6.jpg
5. `recently-5.webp`：https://wx1.sinaimg.cn/large/006Fh5Qlgy1iiouwgle4gj30mi0u0n0k.jpg
6. `recently-6.webp`：https://wx1.sinaimg.cn/large/006Fh5Qlgy1iiouwir06oj30mi0u0441.jpg
7. `recently-7.webp`：https://wx2.sinaimg.cn/large/006Fh5Qlgy1iiouwj75knj30u00min2e.jpg
8. `recently-8.webp` / `recently-8.mp4`：https://video.weibo.com/show?fid=1034:5361134493171767 （18 秒，720p）
9. `recently-9.webp` / `recently-9.mp4`：https://video.weibo.com/show?fid=1034:5361134736441354 （5 秒，720p）

视频下载自官方响应中的 720p MP4，保留画面及水印；未将会过期的 CDN 地址写入前端。

其余两条微博也通过同一官方接口核对，按 `pic_ids` 的顺序读取 `pic_infos`，未发现额外视频或 Live Photo：

- 「盛夏的我们」（`5356092054831382`）共 2 张，第一张为上述 `summer-announcement.webp`，第二张 `summer-announcement-2.webp` 来自 https://wx4.sinaimg.cn/large/006Fh5Qlgy1ii8rs73zesj32gs35se82.jpg 。
- 「面具之下」（`5339041131398399`）共 3 张，第一张为上述 `mask.webp`，第二张 `mask-2.webp` 来自 https://wx3.sinaimg.cn/large/006Fh5Qlgy1igqdii74okj30xi1np7ma.jpg ，第三张 `mask-3.webp` 来自 https://wx3.sinaimg.cn/large/006Fh5Qlgy1igqdig7a0ij30xi1mtqji.jpg 。
- 其余 6 条为 B站视频投稿，沿用官方播放器，不以封面或视频截图凑成多图。

- 「Recently.」为原动态文案，不把新浪自动生成的新闻标题作为本人原文。
- 《盛夏的我们》为定档消息，不能写作已发售。原微博公告为 11 月 12 日；核验时 [Steam 商店](https://store.steampowered.com/app/4767430/?l=schinese)展示 11 月 11 日，可能涉及地区时间差异，摘要不额外承诺精确发售日。
- 「面具之下」对应蜘蛛侠主题写真。
- 撤下无可核实来源的每日固定直播时段和巡回演唱会筹划预告；这些历史新闻不作为下一场直播安排。
- 抖音游客作品列表本次返回空响应或服务异常，搜索结果中的相关视频多为第三方测评/转载，尚未同时核实本人身份和发布日期，因此没有冒充本人动态收录。
- 未将同一条定档消息在微博与 Steam 的展示重复计为两条动态；未把粉丝回放当成本人投稿。
