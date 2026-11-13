# 工作台内容调整验收 · 2026-11-08

final result: passed

## 范围与来源

- 需求：去掉邮箱、AI、每日简报，新增最近使用表单；本次移除“集团邮箱”“AI每日简报”“AI智能提醒”。
- 保留已有工作台顶部、常用功能、统一待办和我的日程样式；日程顺延至新增表单下方。
- source visual truth: `design-reference/workbench-update/reference.png`，419 × 828 px。
- 比较区域为截图中的“最近使用表单”，裁剪坐标 (6,13)-(413,404)，原始 407 × 391 px，统一缩放到 355 × 341 px。
- 实际截图：`output/playwright/workbench-update/recent-forms-375.png`，355 × 340 px；Chrome，375 × 812 CSS px，deviceScaleFactor=1。
- 同输入并列比较证据：`output/playwright/workbench-update/comparison.png`。
- 页面完整视口证据：`output/playwright/workbench-update/top-375.png`、`forms-calendar-375.png`；另含 320/375/430/1440px 视口截图。

## Findings

没有待修复的 P0/P1/P2。首轮已打开并列图和 Chrome 视口截图进行核对，无需修改后再次截图。

- 字体：沿用已确认手机规范，模块标题 16/24、500，入口正文 14/22、400，更多 13/20。源图缩小后的文字略小，实际实现优先遵守用户确认的 375px 字体标准。
- 间距：卡片宽 355px、左右距屏幕 10px，两列、六行、32px 入口高度、8px 行距，左六右四，共十个入口；表单与上下模块各留 10px，无重叠。
- 颜色：主要文字 #03091B、次级文字 #4E5969；保留源图绿色表格文件图标和橙色标题标记；白色入口与浅蓝卡片形成层级。
- 图像：两个图标均从用户提供截图裁取，未以自绘图形替代；原始小图标按约原尺寸显示，没有缺图。
- 文案：模块标题、更多和十个业务表单入口与源图对应。源图省略的完整表单名称使用演示补全，尚未接入正式表单服务。
- 布局：仅新增表单模块并移除指定旧卡片，日程位置调整；统一待办和日程内容与样式保留原有实现。

## 交互与验证

- `pnpm run build` 通过 TypeScript 与生产构建。
- `CHECK_WORKBENCH_ONLY=1 … node scripts/verify-production.mjs`：生产构建在本机 Chrome 中通过。
- 十个入口逐一打开对应表单；更多搜索“用车”显示两条；不存在关键字显示空状态。
- 从搜索结果填写并保存表单，刷新后重新打开仍保留本机填写内容。
- 检查 320、375、430、1440px：页面无横向溢出，入口没有超出卡片，底部导航完整。
- 检查无图片加载失败、HTTP 错误、浏览器 JavaScript 错误。
- 机器报告：`output/playwright/workbench-update/report.json`。

## Implementation Checklist

- [x] 删除三张旧卡片，同时更新生成脚本避免再生成。
- [x] 新增最近使用表单，接通更多、搜索和本机演示表单。
- [x] 更新工作台画布高度并裁掉旧背景造成的多余空白。
- [x] 在真实 Chrome 生产页面截图比较并验证交互。

## Follow-up Polish

无阻塞项。源截图底色有细微明暗变化，实现使用项目浅蓝底色；这是 P3 级色彩细节。正式表单数据和服务接入不在本次界面内容调整范围内。
