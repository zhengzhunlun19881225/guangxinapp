# IM 与通讯录二级页面验收 · 2026-11-08

final result: blocked

## 范围与来源

来源为 `design-reference/im-secondary/01.png` 至 `17.png`。01–15 为 375px 宽截图；16–17 为 750px 双倍图，归一化到 375px 宽比较。一级入口截图 02–03 仅用于入口关系参考，一级样式不改动。

实现为 `src/im/ImPages.tsx`、`src/im/im-pages.css` 和新增二级路由。预览 `http://localhost:5317/#/im-groups?origin=contacts`。

## 当前检查

TypeScript 与 Vite 构建通过。`src/styles.css`、`src/mobile-spec.css`、`src/screens/ImScene.tsx` 和 `src/screens/ContactsScene.tsx` 与修改前 SHA-256 一致。现有控件仅连接二级路由并补齐展开菜单项目。

代码已覆盖：会话发送与图片选择、单聊/群聊设置、群组分类、创建/增加/移除成员、已选抽屉、群名称、成员列表、禁言模式、白名单增删、定时禁言与重复周期、聊天记录、联系人详情、企业通讯录、会议 ID/设备开关/参与人选择/本地预览。

## 待完成的浏览器检查

内置浏览器运行时返回 `Local browser use is disabled in Work settings`。用户选择开启内置浏览器后再验收，因此未改用 Chrome，尚无本轮实现截图，也尚未完成浏览器交互验证。

需在浏览器开启后完成：

- 同一 375px 视口与对应状态的截图；750px 来源按 2x 归一化。
- 全页及重点区域的来源/实现并排比较。
- 字体层级、间距/圆角、颜色、原图素材清晰度与文案逐项核对。
- 群组创建 → 群聊 → 设置 → 禁言 → 白名单 → 选择成员 → 返回的人数与持久化。
- 定时禁言切换、周重复、无效时间范围及取消不保存；聊天/图片、聊天记录和设置状态。
- 会议成员选择、数字 ID 输入、禁用/开启加入操作、本地预览与退出。
- 320 / 375 / 390 / 430px 的滚动、固定输入区/确认区、无横向溢出及资源/控制台错误。
- 一级 IM 与通讯录的浏览器截图回归。

本轮未宣称视觉匹配或交互验收通过。此前 11 张一级页面的历史验收报告保存在 `design-reference/im-secondary/previous-design-qa.md`，不作为新增页面的验收证据。
