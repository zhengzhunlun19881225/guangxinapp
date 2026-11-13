# 本轮参考与资源

- todo-reference.png：用户提供的待办详情截图。字段、标题、状态与内容来自PC `src/data/todoDetails.ts`、`workbenchTasks.ts`。
- meeting-reference.png：用户提供的会议详情截图。字段与内容参照PC `ScheduleModule.tsx`、`schedules.ts`；手机端沿用现有弹层与日程编辑器。
- investments-reference.png：用户提供的项目投资截图。5个项目、公司、阶段、IRR、回收期、完成率与利润率复用PC `PortalDataView.tsx` 示例记录；窄屏内部横向滚动，筛选适配为两列。
- map-reference.png / map-before-reference.png：用户要求采用图一的红色地图。底图直接复制PC `public/assets/portal/province-tax-map.png` 至App `public/assets/record-details/province-tax-map.png`，保留原省界、高亮和引导线，没有重绘地图。
- 字段图标直接复制PC service-alerts 的 application/calendar/details/person-solid.svg，及 spec-icons 中906ac8ec26cf194a、baa7655d84d8d748、61dc145e12dd1dc5，分别为地址、提醒和可见范围。
- 使用既有Alibaba字体、白色内容卡、#F2F1F5页面底色、16px模块圆角和手机原型运行环境。

- `public/assets/ui/filter.svg`：直接复制用户 `/Users/alien/Downloads/筛选.svg`，以CSS遮罩显示20px纯图标，不重绘路径。

- 顶部新背景：用户 `/Users/alien/Desktop/编组-40.png`（746×418）直接复制为 `public/assets/portal-background/overview-header.png`；透明柱状图 `/Users/alien/Desktop/编组 40备份 5.png`（123×123）复制为同目录 `overview-chart.png`，不重绘、不烘焙底色。


## 2026-11-09：PC图标同步

指标前景来自PC `src/components/PortalMetricIcon.tsx`（HandCoins、ChartNoAxesCombined、Landmark、WalletCards，原Lucide描边1.8），文件直接复制；沿用手机原位置、图标区域、36px底板和原语义颜色。

应用图标前景来自PC `src/components/WorkbenchVectorIcon.tsx` 与 `workbenchSolidGlyphs.ts`，后者原样复制。常用应用采用PC实心白色图形，系统使用PC目录的Lucide描边图形；本地`pcCatalog.ts`与PC`src/data/workbenchApps.ts`同源。沿用既有SVG背景、手机无源图标的原渐变、常用34px及系统32px外框，不改变应用名、顺序、交互或间距。适配仅为移动目录导入路径及保留原手机背景绘制。

用户截图存于 `design-reference/pc-icons/`；替换前后尺寸记录与界面截图存于 `output/playwright/pc-icons/`。
