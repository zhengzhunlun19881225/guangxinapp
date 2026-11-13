# 资讯素材来源

图片原样复用现有 PC 项目，未重新绘制。正文复用 PC 本地演示资讯。

- `skyline.png`: PC `71-2370:img8` / `assets/figma/7671288f-9b61-4688-bb8c-5fdd4cfaf421.png`
- `campus.png`: PC `71-2370:img10` / `assets/figma/8aec71e6-c42a-43eb-86eb-8665a454c97d.png`
- `materials.png`: PC `71-2370:img11` / `assets/figma/65e90b52-a43b-454a-b0a7-14f462ad1d4c.png`
- `industry.png`: PC `71-2370:img` / `assets/figma/448aef38-101a-4195-a335-cbc534300f8f.png`
- `collaboration.png`: PC `71-2370:img17` / `assets/figma/d8d18ff8-8603-401d-a32c-38f732eaebbd.png`

集团详情两张照片从用户提供的750×2994详情参考中单独提取原始照片区域（678×243、678×381），不包含文字或控件；运行时以真实图片和可选正文组合。


热点数据复用PC `src/data/hotspotTracking.ts`，管理/刷新图标复用 `80317c914b2850d6.svg`、`9f5979c76f43c8ed.svg`。主动提醒复用PC `src/data/serviceAlerts.ts`、`src/assets/service-alerts/`三个字段SVG和机票/酒店/高铁/说明四个规范SVG；卡片图标与PC一致使用Lucide CalendarClock、Building2。


- 资讯偏好图标来自PC项目 `src/assets/spec-icons/34ea38113a5f13b7.svg`、`698e003d9e5e375b.svg`、`79103c7c42caf873.svg`、`eb119e7053af95bb.svg`，原字节复制为 `public/assets/portal-news/feedback-{interested,interested-selected,less,less-selected}.svg`，通过CSS mask使用原矢量轮廓。界面文案按用户要求缩短为“减少此类”。
