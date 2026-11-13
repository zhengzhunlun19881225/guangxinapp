# 手机应用管理与全局交互调整验收

final result: passed

## 依据、视口和状态

- 最新图标规范依据：`design-reference/apps/refinement/reference-original-sizing.png`（408×267），源常用功能卡片的应用图标34×34、8px圆角、13/20px次级文字与4列布局。
- 编辑规则与角标依据：`reference-selected.png`、`reference-catalog.png`、`reference-pc-badges.png`。编辑状态下移除下方已选项；复用PC添加/删除角标颜色、右上角相对位置。
- 导航与滚动依据：`reference-transparent-nav.png`、`reference-scrollbar.png`；按用户要求移除顶部导航铺色，全部滚动条默认隐藏，改为不占布局的3px浮层。
- PC源：`guangxin-preview-20261104/src/components/WorkbenchVectorIcon.tsx`、`src/assets/workbench-vectors/`及`src/data/workbenchApps.ts`。移动端复制实际矢量源与目录定义，使用内嵌SVG DOM及Lucide React 0.546.0，不使用应用位图图标。
- Chrome截图375×812 CSS px，deviceScaleFactor=1；另验320/375/430/1440。截图仅包含App可见区域；卡片局部参考去除外部12px画布偏移，保留1:1比例。PC角标参考按375px宽归一，只比较形状、颜色和相对位置，不把PC列宽当移动布局要求。
- 状态：应用/系统默认与编辑、实际手指拖动中、滚动中及停止滚动。

## 同图证据与修复过程

- `output/playwright/app-refinement/compare-refinement.png`：原常用功能局部、最终应用编辑、系统编辑、375px滚动中并列；图标密度、字号/文字色、白卡间距、4列、目录隐藏及右侧3px浮层可同时检查。
- `output/playwright/app-refinement/compare-badges-nav.png`：PC角标参考、最终编辑页、旧白底导航截图与最终透明导航并列。粉红减号、橙色加号贴图标右上方，透明导航与页面背景连续。
- [已修复P2] 旧管理页使用40px位图与更大行高，和原34px常用功能不一致。首页/管理页共用AppIcon，应用34px/圆角8px，系统32px圆形；名称13/20、#4E5969、常规字重；代码计算样式与最新截图均确认。
- [已修复P2] 下方仍显示已选勾选项。编辑目录按当前草稿排除已选；删除即返回可选列表；空分类收起、全选有空状态。
- [已修复P2] 旧前移/后移按钮不符合手指拖动要求。移除该操作条，加入手指跟随预览、跨行/列排序、边缘滚动与取消恢复；键盘方向键保留为辅助操作。
- [已修复P2] 最初触屏拖动在DOM重排时丢失指针捕获。改为在稳定滚动容器捕获，文档接收指针移动/结束/取消。后续使用Chrome CDP实际touchStart/touchMove/touchEnd分别验证应用与系统跨列排序、预览出现/消失及保存刷新通过。
- [已修复P2] 原滚动条预留内容宽度。隐藏原生条和预留槽，指示条移到独立fixed浮层；320/375/430/1440下offsetWidth=clientWidth，滚动前后内容宽度不变，实际条宽3px，停止800ms后隐藏。
- [已修复P2] 顶部导航白底。应用管理、日程编辑/详情及手机规范NavBar示例改透明；业务卡片与弹层仍由各自组件控制。
- 没有未解决的P0/P1/P2。

## 五项保真核对

- 字体：沿用Alibaba字体链。应用名13px/20px、400、#4E5969；页面/模块字号沿用手机规范。真实元素样式断言通过。
- 间距：应用图标34px、8px圆角，系统32px圆形；网格4列、每项64px、行间距12px。角标视觉19px，右侧比图标延伸7px、上移6px；实际触摸容器最小44px。滚动浮层与拖动预览不影响网格宽度。
- 颜色：应用业务图标绘制值、目录颜色和角标沿用PC组件；新增管理操作仍使用已确认品牌红与文字语义色。透明导航无额外底色。
- 图像：PC原始SVG字节与绘制值保留，通过实例ID重命名隔离渐变/蒙版。目录其余图标使用同版官方Lucide React；所有应用/系统图标都有SVG子节点，没有img或SVG image。旧位图仅归档在design-reference/apps/raster-archive，不再部署到public。
- 内容：应用六类14项、系统18项完整；默认目录保留全部，编辑目录仅未选，移除/再加、保存、取消、恢复默认正常。新增规则同步手机规范与README。

## 浏览器与构建

- `output/playwright/app-refinement/report.json`：应用/系统的默认、编辑、隐藏已选、删除返回、整项添加、取消、真实触屏拖动、保存刷新、PC角标位置/颜色、图标尺寸/圆角/名称字体色断言通过；多宽度3px浮层及零滚动槽、工作台/规范/IM/日程全局样式检查通过。errors=[]，failed=[]。
- `output/playwright/apps/report.json`：原应用管理回归、鼠标拖动与键盘排序、添加/移除/保存、首页同步、独立配置、恢复默认、4列与44px热区通过。SVG源码中的换行按真实标签节点读取，避免把SVG空白误当业务文案。
- `output/playwright/verification.json`：原11画布、实际字体色值、AI、IM、角色导航、经营指标筛选、地图缩放、审批申请保存、多尺寸320/390/430/768/1440回归通过；errors=[]，failed=[]。
- TypeScript与Vite生产构建通过。历史规范、日程、筛选等记录保存在本目录previous-design-qa.md链中。

## 完成项与边界

- [x] PC矢量图标与角标、原移动图标规格。
- [x] 编辑隐藏已选、真实手指拖动、保存/取消。
- [x] 透明顶部导航与手机规范同步。
- [x] 全局默认隐藏、3px悬浮滚动条，无宽度挤压。
- [x] 实拍同图核对、触屏/鼠标/键盘与11画布回归。

配置保存在当前浏览器；本次没有新增业务后端。没有待修复的阻塞项。
