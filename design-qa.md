## 最新：五列入口、五个海报案例、门户标题栏与毛玻璃卡片（2026-11-10）

final result: passed

“我的系统”“全部系统”和门户“系统导航”统一每行5个，共用 systemColumns 控制列数、系统导航分页条目数与键盘排序步长；常用功能维持每页8项、每行4项。较长系统名称在各自单元格内换行。Chrome验证320/375/430宽度的五列、标签边界、排序、取消及保存刷新；常用功能与系统导航的双向触摸、鼠标拖动、分页条与入口激活通过。报告与实拍：`output/playwright/five-columns-swiping-unified/`。

三个资讯门户共用5个真实海报案例，覆盖供应链、智慧园区、绿色材料、产业协同和数据治理。沿用本地资讯配图与文章详情，每页主题及配图各不相同；支持触摸左右滑动、鼠标拖动、键盘左右键和5个分页点。三个角色的全部15个案例入口与图片加载均验证通过。原生分页手势抽为共用 usePagedCarousel，拖动不会误触详情。

总体情况/综合资讯与IM/通讯录的切换栏精确水平居中，选中为主文字黑色600加粗，未选中为灰色400。门户移除上方“广新门户”标题，将切换栏放在与IM相同的48px顶部位置（16px/24px），并使两种门户内容向上收回48px。总体情况筛选、地图缩放与动态表格同步位移；头像和搜索保留在标题行。已验证切换栏双向点击和三种宽度居中、颜色、字重。

底部导航按用户参考调整：默认灰色线框图标及文字，选中工作台为红色实心显示器、门户为红色实心房屋、IM为红色Hi气泡，小新AI沿用用户透明PNG并凸起显示。浅色导航背景、五项均分和底部手势条保留。四页实拍及底部导航跳转验证通过。

“常用功能”和“系统导航”共用70%不透明白色背景与12px backdrop-filter模糊，补充WebKit声明。整张卡片及文字、图标opacity保持1，避免内容变淡。Chrome实测工作台和三个门户均为rgba(255,255,255,0.7)、blur(12px)，分页与更多入口正常。实拍和报告位于 `output/playwright/shortcut-glass/`。

综合验收产物：`output/playwright/app-layout-updates/`，包含系统网格、门户/IM标题栏、5个海报和4个底部导航状态。生产构建通过，浏览器运行时错误为空。

## 最新：五列系统、左右滑动与弹窗标题标准（2026-11-10）

final result: passed

“我的系统”按用户已确认的五列效果图落地；共用列数控制布局与键盘上下移动步长，鼠标拖动排序继续按实际目标位置计算。Chrome验证320/375/430宽度每行五个、十项两行、无溢出，并验证跨列拖动、上下五位移动、取消和保存刷新。实拍与报告位于 `output/playwright/five-columns-swiping/`。

常用功能和系统导航改为原生水平滚动与整页吸附，支持真实触摸左右滑动、触控板、鼠标拖动及点击分页条。跟随当前页更新指示条；非当前页入口不可聚焦；拖动后不误触入口，拖动结束后正常点击仍可打开应用。分页条承担位置提示，避免叠加滚动条。两模块的双向触摸、分页点击、鼠标拖动与入口激活均在Chrome验证通过，运行时错误为空。

全App弹窗标题按“每日简报·来源依据”参考统一为18px/26px、600加粗、左对齐、左间距20px，标题栏至少66px高、无底部分割线；长标题允许换行并保留关闭按钮空间。普通弹窗、日程Sheet、IM Dialog和手机规范弹层共用规则。文章详情保留内嵌标题结构，标题仍为18px/26px、600。关闭按钮保持30px圆底、20px X、44px热区、圆底距顶部/右侧12px。已更新手机规范的标题与关闭示例。

`verify-dialog-header-standard.mjs`验证13个状态，包括资讯详情/订阅、来源/历史/感谢、320/430/1440感谢弹窗、日程人员、IM图片、规范示例/确认、日程关闭。字号、字重、行高、左边距、无底边框及关闭按钮尺寸位置均实测通过；已打开感谢弹窗、人员弹层、五列系统和滑动后的功能卡截图检查。产物位于 `output/playwright/dialog-header-standard/`。生产构建通过，浏览器无运行时错误。

## 最新：AI 首页、模块素材与四个主页面背景（2026-11-10）

final result: passed

本轮以用户欢迎首页参考（codex-clipboard-8708dcb1-e7e9-476c-84ee-da23fb539f69.png，750×1624）还原 AI 首页。Chrome 以375×812 CSS像素、deviceScaleFactor=2实拍；参考与实现均750×1624、无缩放并列于 `output/playwright/chat-home/comparison-02.png`，已打开核对。底部工具栏局部对比 `focus-02.png` 也已打开检查。

欢迎语、功能卡、最近记录/热门问答与输入栏均已对齐参考布局。输入栏实测x=15、y=729、宽345、高52。首轮修正卡片原素材被裁切/放大模糊、导航纵向位置、欢迎语字号及页签垂直间距。最新比对未见P0/P1/P2；残留P3为制作PPT原素材在2倍显示下略软，以及图标库细节与参考的轻微差异。聊天历史保留；默认欢迎首页，发送后进入对话。模型切换、联网搜索开关、发送、返回首页、刷新后历史记录及历史入口均验证通过。320/430/1440视口无文档横向溢出。运行时错误为空。

后续素材按用户最终提供文件更新：通知/公告使用40×36红蓝喇叭PNG，显示20×18；模块标题使用42×57透明渐变条，显示21×28.5，核心约5×14且保留外部光晕。标题与核心间隔8px。直接使用用户图像，未自绘替代。

四个主页面（工作台、广新门户、IM、我的）统一使用用户背景 `codex-clipboard-8cc33994-f30f-4956-96da-416fc4fb4731.png`，由同一CSS变量引用，按375×210置于顶部，不镜像、不叠加旧底纹。门户覆盖员工/经理/领导及总体情况，IM通讯录同步。头像、吉祥物和门户插画继续作为前景显示。

验证：生产构建通过；Chrome检查8个页面，背景引用与尺寸全部一致，控制台错误为空。报告 `output/playwright/main-backgrounds/report.json`，截图包含workbench、portal-staff、portal-manager、portal-leader、portal-overview、im、contacts、profile。工作台、IM、我的及通知卡片均已逐张打开检查；`background-comparison.png` 汇总参考与四页顶部实拍。

# 移动资讯、热点追踪与主动提醒验收

final result: passed



## 最新：AI订阅布局与轻量生成按钮（2026-11-09）

final result: passed

来源：`design-reference/subscription-layout/reference.png`（384×768）为最新布局真值；`icon-reference.png`（421×864）补充图标移动与轻量按钮要求，优先于前一张图中的按钮填充样式。用户明确要求采用给定布局，本轮未实施上一轮审查提出的自适应高度、底部按钮合并等其他建议。

实际Chrome视口375×812、1倍密度。正式截图`output/playwright/news-tools/ai-empty-375.png`及`ai-generated-375.png`；弹层裁图`output/playwright/subscription-layout/after.png`为375×763，合并对比`comparison.png`已打开检查。对比中的来源均等比缩至375px宽；第一张有外围边框、第二张含设备与顶部留白，实际仅裁App弹层，不把这些外围差异列为问题。

五项检查：正文、页签、输入框、标题与底部按钮沿用原字体与字重；仅生成按钮改12px/18px文字、12px Sparkles图标、30px高度、110px左右宽度、6px圆角，输入框下16px、左侧对齐。保留164px输入高度、500字计数、全高留白和底部恢复默认/取消/保存位置；移除两条示例。生成按钮正常为#fff0f0浅红底及品牌红字，禁用为#fff5f5与#ff9a9a，保持轻量无描边。AI页签只保留文字，其Sparkles图标移至生成按钮并替换原SlidersHorizontal图标，标题原红色Sparkles继续保留；全部为既有Lucide矢量图标。生成结果与保存内容、手动订阅功能保持。

迭代记录：首轮按钮仍受通用primary-button最小42px规则影响；移除该通用类、限定独立按钮样式后实测30px，左侧偏差0、输入框下间距16px。最终参考与实现合并对比无剩余P0/P1/P2；全图足以判断本次按钮与图标变化，不另重复放大截图。

`pnpm run build`通过。原`verify-news-tools.mjs`改为直接填写需求，覆盖取消隔离、手动必填、重置、AI空值/不识别、生成预览/编辑/保存/刷新、保存失败保留草稿，以及320/375/430/1440布局；新增断言确认示例不存在、页签无图标、生成按钮使用Sparkles及30px/16px/左对齐尺寸。报告`output/playwright/news-tools/report.json`为passed，控制台和资源错误为空。


## 最新：月历比例与两类新建表单（2026-11-09）

final result: passed

来源：`design-reference/schedule-create/`中的用户8张截图；`meeting-content.png`为694×805、`event-content.png`为689×844，作为字段内容真值；`mobile-editor-before.png`为375×812，作为移动端样式真值。月历高度参考395×821，标题参考449×481，关闭按钮参考487×842，含设备边框及红色标注，不复制这些外围元素。当前Chrome主视口375×812、deviceScaleFactor=1，实际App截取375×812。表单按用户要求保留手机样式，不复制PC双列布局、描边输入框和底部确认按钮。

实现与合并对比：`output/playwright/schedule-create/calendar-comparison.png`、`meeting-comparison.png`、`event-comparison.png`已打开逐项检查；`rows-comparison.png`为原移动与新会议表单顶部/字段的375px同尺寸局部对比。PC全图在对比中缩至350px宽以核对字段，字体和行距以移动同尺寸局部为准。新增表单内容超过一屏是预期，底部实拍见`meeting-filled-bottom.png`、`event-filled-bottom.png`；均可滚到附件与原全天/重复/日历设置。月份4/5/6周都已实拍，较矮屏幕见`month-short-375-600.png`及`month-short-1440-650.png`。

- 字体：保留App原页面标题、14px正文、辅助文字与日期字号，白色行表单原54px行高、18px内边距和原64px名称行不变；只补充字数、必填标记和多行内容。
- 布局：月历的星期与日期整体为App页面高度40%，812px屏实测324.796875px（39.9996%），年月中心偏差0px；左右箭头即时切月，无月份弹框。31日切至短月取该月最后一天，跨年与闰月使用原日期计算。返回改现有X图标，保持关闭工作台行为。短屏日期圆圈随行空间缩小避免重叠。
- 配色：沿用#F2F1F5背景、白表单、品牌红保存/选中、原日期彩色提示点；弹出菜单复用原日程菜单白底/圆角/阴影。状态栏、导航、底部指示条和50px红色添加按钮保持。
- 素材：继续使用原Lucide SVG目录，无新插画、截图背景或自绘图标。
- 内容：加号弹出“新建日程/新建会议”。会议含名称20字、时间、线上/线下、地址/链接、主持人、与会人、告知人、提醒、可见范围、描述200字及附件；日程含名称20字、起止时间、安排他人、告知人、必填事件内容200字、提醒、可见范围、描述及附件。提醒严格为不提醒/5分钟/10分钟/15分钟/30分钟/1小时，默认10分钟；可见范围公开/个人，默认公开。人员可搜索，主持人单选，其余多选；取消不应用待选人员。附件可添加多份、移除、下载，保存后刷新保留；按本原型现有本机存储保存，不是服务端上传。超出浏览器存储容量时保留草稿并提示减少附件。

迭代：修正继承默认空描述导致旧示例备注不显示；修正人员弹层关闭按钮默认提交表单及搜索回车提交；较矮屏幕去除260px最小高度，确保仍为40%。首轮会议截图含上一操作临时提示与输入焦点框，最终截图等待提示消失、失焦并实拍滚动底部。修正后全部合并对比已重生成并检查。无剩余P0/P1/P2，无额外P3。

验证：`pnpm run build`通过；`scripts/verify-schedule-create.mjs`通过，覆盖箭头跨月/跨年/日期截断、4/5/6周、40%比例与居中、两项菜单/点击外部/Escape、两种表单必填/日期/线上链接校验、人员搜索/多选/取消、六种提醒与两种可见范围、真实附件读取/移除/下载/刷新、保存详情编辑、取消保留日期视图、结束会议只读、320/375/430/1440适配及短屏布局。`verify-schedule.mjs`通过原全天/重复/色彩/重叠时间轴/搜索/编辑删除；`verify-business-details.mjs`通过待办、工作台会议、实时结束保护及旧来源内容回归。报告位于对应`output/playwright/`目录，控制台和资源错误均为空。


## 最新：统一待办仅同步内容（2026-11-09）

final result: passed

用户明确“仅参考内容”：内容真值为`design-reference/todo-content/content-reference.png`，原样式真值为`style-reference.png`。完整标题、发起人、时间和状态取自PC `src/data/workbenchTasks.ts`的初始9条（4待办、2已办、3消息），不引入PC的布局、渐变、行卡片或模拟新增定时器。

实现截图：`output/playwright/todo-content/{pending,completed,messages}-final.png`；内容/旧样式/更新后同一合并对比为`comparison.png`，已打开检查。Chrome 375×812px视口、1倍密度；卡片355×273px、top402px、行高57px均为原值。源内容图360×464px、源样式图406×372px（含周边），实际为355×273px卡片截取；只比较内容对应关系及旧样式，不要求复制内容参考的布局密度。

首页保持三行预览，待办数显示4；“更多”列出全部9条，含第4条同名待办。标题带[系统来源]，详情去掉来源前缀并显示完整标题。两条同名调研事项使用独立记录ID，分别对应上官成硕/1小时前与李佳佳/2026-10-29；办理第一条不改变另一条。列表、更多和详情使用相同记录数据；已办和消息只读，原办理流程保留。

五项视觉检查：字号、字重、行高及省略处理保持原样；间距/白卡/圆角/切换栏/三行布局保持原样；默认#F2F1F5及白卡保持，正常状态复用现有绿色成功样式；既有素材不改；9条内容与PC逐项对应。无P0/P1/P2。`pnpm run build`通过；`scripts/verify-todo-content.mjs`验证字段对应、更多9条、同名记录隔离、办理及刷新持久化、已办/消息只读及原几何尺寸，报告`output/playwright/todo-content/report.json`为passed，控制台错误为空。既有核心及详情脚本的旧条数/重复标题定位已同步，未重复运行无关流程。


## 最新：应用分类与PC目录一致（2026-11-09）

final result: passed

- 来源：PC `src/data/workbenchApps.ts`。提取的应用ID、名称、图标、颜色与分类记录保存在`design-reference/app-directory/pc-directory.json`，与移动`pcCatalog.ts`全部逐项相等。用户旧状态截图为`design-reference/app-directory/reference.png`。
- 实现：`output/playwright/app-directory/common-final.png`、`common-bottom.png`、`systems-final.png`；375×812px Chrome视口、1倍密度。合并对比`comparison.png`已打开检查。用户参考不含顶部状态栏，实际包含现有原生状态栏；保留同一宽度比较。默认应用由旧10条变为PC14条，卡片自然增高属于本次目录补齐；底部截图确认6类完整、可滚动。
- 修正：应用数据从PC图标目录直接派生，6类14项应用、18项系统；默认“我的应用/我的系统”采用PC完整清单。旧缓存删除AI智写、AI查询、通讯录、智数、知识库、AI PPT、打卡、BPM等目录外条目；保留有效条目原排序，再补齐PC清单。无目录外条目的有效自定义选择及主动清空保留。限制保存范围，应用和系统互不混用；兼容原移动ID及PC ID。
- 字体/间距/颜色/素材：沿用原文字、四列栅格、34px应用/32px系统图标与PC图形、白卡及#F2F1F5底色；仅清单和默认选择变化。内容：名称与分类逐项匹配PC，原出差等表单操作保留。无剩余P0/P1/P2。
- 第一轮截图包含上一操作的临时“已保存”提示，随后用全新会话重拍并重新检查`comparison.png`；产品界面未改动，正式截图已去除瞬时提示。
- 构建通过；更新的`scripts/verify-apps.mjs`检查PC清单、旧记录迁移、异类过滤、去重、别名、空列表、自定义排序、添加/移除/拖动/键盘/取消/保存/刷新/恢复默认及首页原操作。320/375/430/1440px均为4列、无溢出，编辑热区至少44px。报告`output/playwright/app-directory/report.json`为passed，控制台和资源错误均为空。


## 最新：热点标签配色（2026-11-09）

final result: passed

来源：`design-reference/hotspot-topic-colors/colors-reference.png`（358×107px）及`location-reference.png`。实现：`output/playwright/hotspot-topic-colors/after.png`与`topics.png`，375×812px Chrome视口、1倍密度、领导门户/国产算力选中。合并对比：`comparison.png`已打开检查。

标签选中背景#FFF0F0/品牌红字；未选背景#F4F4F4/#4E5969文字；透明边框消除可见描边并保留原几何。字体、6px圆角、内边距、触摸区域和横向布局不变。文字与现有图标保留；与参考相比仅应用配色，不复制订阅网格的尺寸和布局。无P0/P1/P2。构建通过；浏览器报告`output/playwright/hotspot-topic-colors/report.json`验证四个标签颜色、切换选择，控制台错误为空。



## 最新：PC图标同步与总体情况显示修正（2026-11-09）

final result: passed

### 来源与验证状态

- 最新图标请求来源：`design-reference/pc-icons/{metrics,apps,systems}-reference.png`。截图为替换前状态；目标图形直接来自PC的`PortalMetricIcon.tsx`、`WorkbenchVectorIcon.tsx`、`workbenchSolidGlyphs.ts`和既有工作台SVG。只更换前景，手机尺寸、位置、底板、圆角和间距按原值保留。
- 表格来源：`design-reference/overview-tables/{research,investment}-reference.png`；图例/切换栏来源：`design-reference/overview-panels/`；下拉来源：`design-reference/select-inset/reference.png`；隐藏筛选和16px图标来源：`design-reference/investment-filters/`。
- Chrome、375px设计宽度、1倍像素密度。指标卡截图355×298px；科研动态355×323px；纳税卡355×291px；创新进度355×320px。应用及系统管理页375px宽，保留原生滚动与状态。另检查320/375/430/768/1440px浏览器宽度，手机缩放采用现有运行时。
- 合并对比证据：`output/playwright/pc-icons/comparison.png`、`overview-tables/comparison.png`、`overview-panels/comparison.png`、`select-inset/comparison.png`及先前`investment-filters/comparison.png`。均已打开检查。用户截图裁到对应卡片；纳税参考564px宽缩至355px，比较同一切换与图表区域；下拉比较保留原375px手机宽度，忽略截图上下起点差异。

### 修正与对比迭代

- [已修复 P1] 科研动态固定坐标/裁切导致长文字不完整。改为原生表格、自动换行和自适应高度，最多5条；现有来源4条，不补造第5条。中试阶段、申请获批恢复PC完整文案。ResizeObserver同步投资及创新进度位置，保留10px设计间隔。
- [已修复 P2] 第一轮科研类别出现“智能算/法”换行。第二轮将前两列设为76px、保持单行，末列按内容换行；修正后的`overview-tables/comparison.png`展示完整分类和动态。
- [已修复 P2] 两张表格标题、行间距和分割线不一致。共用16/24px常规标题、14/22px正文、6px行内上下留白及灰色表头底线。项目投资保留7项指标和内部横向滑动。
- [已修复 P2] 创新进度图例嵌套固定宽度裁切名称。改用自然宽度flex，完整显示预算与实际经费，保留卡片尺寸及原柱状图。
- [已修复 P2] 纳税切换文字裁切、选中层不覆盖文字。采用32px灰底切换条、白底选中项、14/22px文字及600选中字重；左右方向键、Home/End与点击均有效。第二视图沿用PC同一演示序列的青色显示。
- [已修复 P2] 项目投资筛选字段占据卡片高度、入口过大。四个字段移入筛选弹框；门户四入口图标16px、无文字描边、至少44px实际操作范围。支持草稿、应用、取消、Escape、重置及空结果恢复。
- [已修复 P2] 下拉箭头靠右。统一既有16px ChevronDown，右侧10px内缩，文本右侧36px留白；日程移除重复箭头。覆盖投资/门户/日程/订阅/规范5类表单，共17个实际下拉框。
- [已完成] 指标4枚使用PC描边图形；常用应用14枚采用PC实心图形；系统18枚采用PC描边。`pc-icons/before-sizes.json`与`after-sizes.json`逐项一致：原指标图标区域约19.2×15.6px，应用34×34px，系统32×32px；所有外框圆角保持原值。

### 五项视觉检查

- 字体：图标替换不改变文字；表格共用字号/行高，分类无断行；纳税选中标题字重符合参考。
- 间距：图标尺寸、原卡片边距及栅格未动；科研动态自然增高，后续模块按10px间距跟随；表格无页面横向溢出。
- 颜色：指标及应用保留手机原背景色、渐变与语义色；PC系统白色描边；默认页面#F2F1F5，卡片白色。
- 素材：PC实心路径及指标组件直接复制；系统使用PC图标目录，原SVG底板保留；没有重画业务图标。
- 内容：科研更新完整显示，现有4条/最多5条；投资5条、全部7指标可横向查看；两项经费图例完整。

### 检查结果

`pnpm run build`通过。Chrome报告：`output/playwright/pc-icons/report.json`、`overview-tables/report.json`、`overview-panels/report.json`、`select-inset/report.json`、`investment-filters/report.json`全部passed；控制台错误为空。尺寸逐项对比、科研详情点击、投资横向滚动及筛选应用/取消/重置、纳税点击/键盘切换、各类下拉样式均通过。剩余P0/P1/P2：无。


## 最新：总体情况顶部背景替换（2026-11-09）

直接使用用户提供的两张PNG：746×418背景图与123×123透明柱状图，复制到 `public/assets/portal-background/`。背景按375px宽等比例呈现于顶部211px区域，去掉旧的翻转、蒙版及40%透明度；柱状图沿用123px尺寸与右侧位置，保留源图透明边缘。

已查看 `output/playwright/portal-background/comparison.png`：左为两张提供素材按实际尺寸合成，中为替换前页面，右为375px实拍。渐变、弧形纹理及柱状图颜色与素材一致，导航文字清晰，首张内容卡正常覆盖插图下部，无拉伸、遮挡或新增P0/P1/P2。

`portal-background/report.json` passed：两张原图正常加载、无额外透明度或翻转，320/375/430/1440无横向溢出，筛选入口仍可打开，errors=[]。TypeScript/Vite生产构建通过。


## 最新：业务详情、项目投资、红色税金地图与滚动条范围

本轮沿用既有375px手机原型及Alibaba字体。用户的PC宽截图作为内容、字段、图标与业务状态依据，适配为375px弹层；字段列104px、正文14/22px，内容自然换行。待办详情展示类型、数据来源、发起时间、发起人和完整内容；已有审批仍可办理，已办与消息只读。会议详情展示8项字段，未结束显示删除和编辑；标记完成或结束时间已到则只读，打开期间到点也会收起操作。编辑复用既有日程编辑器，删除需确认，均保存至本机。

总体情况在科研动态后、创新项目进度前新增项目投资，5条记录和7个指标复用PC示例。窄屏内部左右滑动，四个筛选下拉保持可用，空结果可重置。模块高度自适应，与后续模块间隔10px。税金地图直接使用PC红色原图，去掉旧黄底/紫色，标注及缩放保留，缩放位于左上。

滚动指示条按底部导航栏上边缘裁切轨道，不延伸到导航按钮和Home区域，保持3px、滚动时显示和停止淡出。

已查看同图比较：`output/playwright/business-details/todo-comparison.png`、`meeting-comparison.png`、`investments-comparison.png`、`map-comparison.png`、`scrollbar-comparison.png`。比较包括原始参考和375px实际内容；PC宽表通过默认/滑至末列两种状态展示，移动字段换行为预期适配。会议已完成与未开始两种状态明确分离，无临时提示遮挡。无P0/P1/P2遗留。

`business-details/report.json` passed：5条投资数据、7列指标、真实触摸滑动、筛选空状态与重置、地图及缩放、待办内容/审批/已办只读、会议8字段/编辑/刷新/删除确认及取消/结束时间与直接编辑入口保护/打开期间到期，320/375/430/768/1440下三个页面的滚动条不超出导航上缘、弹框无横向溢出，errors=[]、failed=[]。现有 `verify-schedule.mjs` 与 `verify-browser.mjs` 回归通过；TypeScript/Vite构建通过。

## 最新：所有门户筛选按钮改为纯SVG图标

总体情况的3个筛选入口统一使用用户提供的 `筛选.svg`，原文件复制至 `public/assets/ui/filter.svg`。图标20×20px，无可见文字、0px描边、透明底色；实际点击区域各尺寸均至少44px，保留原ARIA名称、筛选状态和键盘焦点。条件已应用时只改变图标颜色。

已查看 `business-details/filter-comparison.png`，与用户原截图同图比较，并按最新文字要求去掉标注按钮的文字和描边。`filter-style-report.json` 逐项确认3按钮的文本为空、边框0px、背景透明、遮罩资源为用户SVG，图标20px。现有 `portal-filters/report.json` passed：全部入口弹框、草稿取消、应用、重置、状态共享、地图缩放及320/375/430/1440点击区域，errors=[]、failed=[]。其余投资筛选下拉和提交按钮保持业务文字。无新增P0/P1/P2。


## 最新：30px关闭按钮及集团资讯元数据靠左

两类详情的关闭按钮统一改为30×30px，覆盖前轮32px要求。集团详情移除标题下元数据分割线与多余底部内距，改为时间在前、来源单位在后，8px间距、均靠左；正文与标题保持前轮统一排版。

已查看 `output/playwright/portal-news/30px-left-meta-comparison.png`：时间与来源同排靠左、无分割线，关闭按钮缩小，标题和配图无挤压。`30px-left-meta-report.json` 在320/375/430/768/1440验证两类关闭按钮实际30px、真实点击可关闭；集团时间位于元数据左边缘、来源紧随其后且间隔8px、无横向溢出，errors=[]。TypeScript/Vite构建通过，无新增P0/P1/P2。

## 最新：资讯偏好与两类详情统一排版

AI资讯标签移到正文标题下方，日期/来源右侧新增“感兴趣”“减少此类”。按钮复用PC的4份原始SVG，支持互斥选择、重复点击取消、按文章保存本机偏好；存储失败保留会话选择并提示。没有宣称已调整实时推荐。

两类资讯均去掉顶部通用“资讯详情”栏，正文标题作为弹框可访问名称。按最新指令，关闭按钮统一32×32px，覆盖前轮44px规则；标题统一18/26px、600字重、#03091B，正文统一14/26px、400字重、#4E5969、正常字距和左对齐。左右留白20px，标题自然换行并避让关闭按钮。

已查看最终同图对比 `output/playwright/portal-news/article-typography-comparison.png`，将两类最新参考与375px实拍并列；标题、字体、颜色、段落及关闭按钮通过，无P0/P1/P2。早期header对比中的44px关闭与均衡折行由本次结果覆盖。

`portal-news/report.json` passed：三种门户、正文、标签、偏好位置、5种宽度、互斥/取消/文章隔离/刷新保持及存储异常；`group-detail/report.json` passed：正文照片、两份有效PDF、关闭和焦点循环。`article-typography-report.json` 在320/375/430/768/1440逐项比较两类标题与全部正文段落的计算样式，完全一致，关闭按钮32px、标题无重叠、真实点击关闭正常。TypeScript/Vite最终构建通过。

## 视觉依据与归一方式

- 原移动规范及前轮验收保留于 `design-reference/portal-news/previous-design-qa.md`，品牌红、文字语义色、Alibaba 字体、375px基准及44px操作热区继续使用。
- AI资讯卡片依据 `design-reference/portal-news/reference.png`（554×584）；列表后续要求依据 `list-4x3-reference.png` 与 `list-gap-reference.png`，并以用户最后“改成4:3，高度不变”为准：95px高、4:3宽、32px条目间距、无分割线。
- 订阅依据 `subscription-manual-reference.png`（484×936）、`subscription-ai-reference.png`（454×926）。PC表单适配375px，控件保留44px热区，选项按可用宽度换行，内容独立滚动，底部操作固定。
- 集团资讯依据 `group-reference.png`（378×632）；详情依据 `group-detail-reference.png`（750×2994），照片与正文按375px宽归一。保留App自己的状态栏、导航及底部安全区，详情局部对比不计这些额外设备区域。
- 通知间距依据 `notices-spacing-reference.png`：通知区域上下和两卡之间均10px，支持原生左右滑动。
- 热点依据 `hotspot-reference.png`（420×627），按355px卡片宽归一。主动提醒依据 `service-card-reference.png`（562×353）与 `service-more-reference.png`（801×642）；PC宽卡内容适配现有355×310px移动区块，PC对话框改为手机滚动弹层。
- Chrome在375×812 CSS px、deviceScaleFactor=1捕获；另验证320、430、768、1440px。桌面保留375px手机画布；320/430按既有App缩放机制适配。图片尺寸与间距断言允许亚像素取整误差。

## 同图比较与修复记录

- `output/playwright/portal-news/card-comparison-final.png`：卡片题图、标签、标题/摘要层级和元数据。初次标题换行及摘要密度偏差已通过字距、标签与字号修正并复拍。
- `output/playwright/portal-news/list-4x3-comparison.png`：用户标注前的列表与最终列表并列。后续文字指令优先于旧截图：图片高度95px，宽约126.67px；原图等比cover裁切；32px空隙代替横线。标题区域随图片加宽收窄，仍保留两行截断及完整详情入口。
- `output/playwright/news-tools/manual-375-comparison-final.png`、`ai-generated-375-comparison-final.png`：PC订阅参考与手机弹层并列。由于44px热区及手机字号，手动选项为3列，AI生成结果需下滑查看；固定页脚始终可操作。最初关闭按钮30px问题已修为44px，弹层最大高度改94%，复拍及多宽度断言通过。
- `output/playwright/group-news/comparison-v1.png`：集团资讯五条排名、题图、来源与日期一致，独立标题和四个标签行完整。
- `output/playwright/group-detail/comparison-final.png`，局部 `comparison-top-final.png`、`comparison-bottom-final.png`：四段正文、两张原图、发布单位/时间、323阅读、232初始点赞及附件。初次标题过轻和段落换行偏差已调整标题字重及正文1px字距。可点击计数保留44px热区，因而元数据行比静态参考略高；文字颜色优先使用已确认系统规范。
- `output/playwright/group-detail/notices-comparison.png`：通知/公告上下空隙与卡片间距统一10px；真实手指向左/右滑动验证通过，保留纵向位置。
- `output/playwright/hotspots/comparison-v1.png` → `comparison-final.png`：初次最后主题及第三条进展底部不全（P2）；缩小主题标签内距，调整正文与节点间距，保留44px操作热区。最终四个主题及三条默认进展完整可见，附计算断言。时间、阶段、分类、来源数量均复用PC数据。
- `output/playwright/service-alerts/card-comparison-v1.png` → `card-comparison-final.png`：加强模块/提醒标题字重，标签移至正文下方，首个分类标签完整保留；移动端摘要和长业务类型允许省略，详情保留全文。
- `output/playwright/service-alerts/more-comparison-final.png`、`field-column-comparison-final.png`：原88px标签列造成“其他酒店订单”与值相邻重叠（P2）；标签列改104px。最终截图的标签与值分离，全部字段名不溢出断言通过。生成依据统一14/22px单行，超长省略并保留完整文本。

## 五项保真核对

- 字体：沿用Alibaba及系统字体链。列表标题16/24、提醒标题14/22、摘要12/18、生成依据14/22。页面及模块字号沿用手机规范；截图中的PC宽度和缩放不直接替代手机字号。
- 间距与布局：资讯列表95px高图、4:3、32px间距；通知区域10px；集团资讯下热点10px。提醒区保持原310px高度，以两张白卡、业务图标、摘要、标签和操作组成；长字段自然换行，生成依据独立保持单行。
- 颜色：品牌红 #FF0000、主文字 #03091B、次文字 #4E5969、辅助 #878B99、信息蓝 #006DFF；事实绿、媒体橙、分析蓝按语义呈现。导航透明，卡片与弹层使用原系统背景及圆角。
- 图片和图标：AI题图复用PC原始图片；集团新闻沿用原App照片；详情仅提取用户参考的两个真实照片区域，没有将文字或控件压成整图。热点管理/刷新与提醒字段复用PC SVG，提醒业务图标使用与PC相同的Lucide CalendarClock/Building2。
- 内容：AI分类及正文、订阅条件、集团新闻排行、四段详情、两附件、三阶段热点与提醒十个字段完整。集团“更多”按用户要求只显示第三方App提示。列表条目进入统一的用户提供文章样例，未伪造其他新闻的完整正文。

## 浏览器、交互与构建证据

- `output/playwright/portal-news/report.json`：三个门户分类、More、AI正文、返回、真实触屏滑动、多宽度布局、滚动位置。
- `output/playwright/portal-news/list-4x3-report.json`：最后固定高度修改后单独复验320/375/430/768/1440；95px高、4:3比例、零分割线和32px间距通过。
- `output/playwright/news-tools/report.json`：订阅/搜索44px按钮，搜索结果/清空/取消/空态；手动与AI订阅、必填、取消、保存刷新、失败保留草稿；多宽度与Escape关闭。
- `output/playwright/group-news/report.json`：集团新闻分类、五条数据、第三方App提示、详情及返回保留位置。
- `output/playwright/group-detail/report.json`：三个门户通知10px及双向真实手势、完整文章、双处点赞同步与刷新保留、两个有效PDF下载、响应布局。排版修订后另捕获 `article-full-final.png`。
- `output/playwright/hotspots/report.json`：四主题、默认三节点、完整进展/来源/返回、刷新反馈、关注保存及空态、失败重试、键盘操作、多宽度和底部导航避让。
- `output/playwright/service-alerts/report.json`：领导/中层两提醒、More十字段、单条酒店与行程、忽略/空态/恢复、14px单行依据、字段名不溢出、多宽度及Escape。
- `output/playwright/verification.json`：原11画布、字体颜色、AI对话/历史、IM、门户切换、经营筛选与地图、审批和申请保存、320/390/430/768/1440回归通过。
- 上述浏览器报告 errors=[]、failed=[]。TypeScript检查及Vite生产构建通过。
- 两份演示PDF通过pypdf检查并以Poppler渲染三页，视觉证据 `output/pdf/review.png`；可下载文件明确标注本地演示附件。

## 完成与边界

- [x] 资讯卡片、列表、搜索与订阅。
- [x] 集团新闻、统一详情样例、点赞及演示附件。
- [x] 10px通知间距与左右滑动。
- [x] 热点时间线、来源与关注管理。
- [x] 主动服务卡片、全部详情、忽略/恢复、14px单行依据。
- [x] 对照复拍、交互验证、原画布回归与生产构建。

没有未解决的P0/P1/P2。所有业务记录、AI订阅解析与热点更新为本地演示；没有连接实时采集、推送、订房或提交申请后端。没有进行远程发布。


## 4:3 比例更新

最新参考 `design-reference/portal-news/list-4x3-reference.png` 是修改前的16:9截图；本轮以文字要求4:3为准。`output/playwright/portal-news/list-4x3-comparison.png` 将参考和最终375×812、DPR=1截图并列：高度仍95px，宽度从约169px缩至126.67px，标题获得更多宽度，32px条目间距及原有字体、颜色、图片素材保持一致。

生产构建通过；Chrome在320/375/430/768/1440下复验全部12条记录的高度、比例、32px间距、零分割线及无横向溢出，errors=[]。没有新增P0/P1/P2问题；上一版本报告存于 `design-reference/portal-news/previous-aspect-ratio-qa.md`。


## 热点标题栏操作位置更新

依据 `design-reference/portal-news/hotspot-header-reference.png` 及用户文字要求，刷新按钮紧跟标题，管理关注独立靠最右侧；原PC SVG、16px图标、44px热区和原事件操作保留。`output/playwright/hotspots/header-position-comparison.png` 将原状态与最终355×48px标题栏并列；标题、刷新、管理关注同排且无拥挤。

Chrome在320/375/430/1440下验证按钮顺序、与标题垂直居中、模块边界及无横向溢出；实际点击刷新有反馈、管理关注打开对应弹窗且Escape可关闭。报告 `output/playwright/hotspots/header-position-report.json` 为passed，errors=[]。生产构建通过，无新增P0/P1/P2。


## 工作台卡片白色背景更新

依据 `design-reference/portal-news/workbench-card-background-reference.png` 和用户最新要求，将最近使用表单、我的日程两张外层卡片从浅蓝改为rgba(255,255,255,0.8)，不设置组件opacity。`output/playwright/workbench-card-background/comparison.png` 将修改前参考与最终375px实拍并列：背景为白色，标题/正文/图标清晰，内部条目、圆角、模块间距及布局保持原样。

Chrome计算样式确认两个背景均为rgba(255,255,255,0.8)、整体opacity=1、宽355px，内部条目仍为纯白；320px布局无横向溢出。证据 `output/playwright/workbench-card-background/report.json` 为passed，errors=[]；TypeScript及Vite生产构建通过。没有新增P0/P1/P2。


## 资讯订阅选项与36px控件更新

final result: passed

按两轮用户要求，将订阅选项改为三列等宽浅灰色块、选中浅红底红字，隐藏原生勾选图形但保留真实复选框和键盘焦点；选项圆角8px、底部按钮圆角10px保持原样。底部取消/保存等宽展开，保存使用参考红色渐变。订阅表单单行控件改为36px，手动/AI切换栏铺满内容宽度。

已查看参考及最终实拍并列图 `output/playwright/news-tools/style-comparison.png` 和 `style-36px-comparison.png`；文字清晰、无裁切，选中态明确。`style-36px-report.json` 在320/375/430/1440核对选项、输入框、底部按钮和切换栏36px，切换栏宽度等于内容可用宽度，圆角及等宽按钮正确、无横向溢出。现有订阅交互回归 `report.json` passed，保存/取消/恢复、必选校验、AI生成、持久化及异常处理均通过。TypeScript/Vite生产构建通过，无新增P0/P1/P2。


## 集团详情弹框、元数据与完整生成依据更新

final result: passed

集团资讯条目复用现有弹框框架，门户URL不变、列表保留在原处；正文独立滚动，关闭恢复条目焦点。标题完整换行，单位名称居左、日期时间居右，去掉“发布单位：”前缀及所有阅读/点赞控件；正文、两张照片和两份PDF保留。旧的详情URL仍兼容，门户正常入口统一为弹框。已查看 `output/playwright/group-detail/modal-meta-comparison.png`，文字、元数据、配图和弹框边界符合要求。三种门户的关闭位置/焦点报告 `group-news/report.json` passed，详情内容、PDF下载、Escape及包含附件链接的焦点循环由 `group-detail/report.json` 验证。

生成依据根据最新用户要求从单行省略改为14/22px自动换行，底容器随全文增高，覆盖前面的单行规则。已查看 `output/playwright/service-alerts/basis-wrap-comparison.png`，全文清晰可见；四种屏宽检查无横向裁切，提醒操作回归通过。

## 全局默认底色更新

统一页面底色为#F2F1F5，共享--color-page/--canvas覆盖一级画布、导出手机底层、IM、日程、应用、资讯列表和规范页；白色内容卡片与弹层保留。已查看 `output/playwright/page-surface/comparison.png`。`page-surface/report.json` 核对全部35个页面的默认底层均为rgb(242,241,245)，无横向溢出或页面异常。原有核心交互回归 `output/playwright/verification.json` passed，errors=[]、failed=[]。

## 主动提醒去除内部底卡并自适应

外层卡片由浅蓝改为白色，内部两条提醒改为透明背景、零圆角，不再有独立底卡和固定高度。标题、摘要及标签自然换行，保留图标和操作。监听模块实际高度，同步调整后续资讯、通知、集团资讯、热点与页面高度，避免内容增减后重叠或空位。

已查看 `output/playwright/service-alerts/unboxed-comparison.png`：两条提醒完整，白色外层与页面灰底有清楚分界，内部无底卡。`service-alerts/report.json` 在领导/中层验证白色外层、透明内容、忽略时高度收缩与后续资讯同步上移；更多、完整生成依据、单条查看、恢复、320/375/430/768/1440显示均通过。TypeScript/Vite生产构建通过，无新增P0/P1/P2。

## 管理关注补齐与日程设置移除（2026-11-09）

final result: passed

用户确认补齐列表、手动新增和AI订阅，PC参考仅对应内容；继续使用App字体、白色弹层、切换栏、品牌红和轻量生成按钮。管理列表包含全部五个预置主题，可关注/取消关注、编辑及新增；首页原默认四主题保持，按关注设置显示新增主题。新主题名称、关键词、来源、排除词及AI草稿保存到本机，时间线和来源使用明确标识的演示数据。

已逐张打开并检查合并对照：`output/playwright/hotspot-manage/list-comparison.png`、`new-comparison.png`、`ai-comparison.png`。PC字段完整转为移动表单；列表与长AI结果独立滚动，底部操作固定，末尾字段均可滚动到达。图标沿用现有Lucide组件，未新增位图或手绘图形。字体、颜色、圆角、正文行距沿用当前App。

用户后续要求覆盖原日程设置：两类表单移除全天日程、重复、日历三行，以及名称前的颜色选择。已打开 `output/playwright/schedule-remove-extras/comparison.png` 和 `title-comparison.png`：底部结束于附件区，标题输入左对齐，原64px名称行、54px字段行、顶部操作及留白保持。旧记录属性保留数据兼容。

功能与布局证据：`output/playwright/hotspot-manage/report.json` passed，验证关注切换、必填/重名/取消、手动新增编辑、AI空态/生成/编辑/失效/保存、失败保留草稿、三门户同步及320/375/430/1440列表/手动/AI布局和关闭。`hotspots/report.json` passed，验证原主题、节点、来源、刷新、键盘与窄屏；`schedule-create/report.json` 与 `schedule/report.json` passed，验证两表单控件缺失、新建编辑、人员、附件、日期、旧记录及月历。所有报告errors=[]、failed=[]；TypeScript及Vite生产构建通过。

迭代中修复AI页签与表单重复ID导致保存无响应；响应布局检查改为等待弹层动画完成后测量，最终页脚无溢出。无未解决P0/P1/P2，没有远程发布。

## 管理关注按最新双页截图调整（2026-11-09）

final result: passed

来源：`design-reference/hotspot-manage-layout/reference.png`，原图889×837；裁切左侧列表412×820、右侧新增408×822，分别等比归一到375×746、375×756。Chrome实拍视口375×800、DPR=1，弹层375×752；对齐内容区域比较，参考拼图边框不进入App实现。列表使用两项关注记录；实际目录继续保留五个PC主题，排序沿用现有目录，因此比参考示例多显示两个可关注主题，不删除业务数据。

已打开完整合并对照 `output/playwright/hotspot-manage-layout/list-comparison.png`、`new-comparison.png`，及列表局部 `list-detail-comparison.png`。列表切换栏等宽铺满，复选框紧随标签，新增入口位于同行右侧；关注按钮靠右，元数据独占下一行。移除列表说明条、分隔线、独立编辑与底部关闭按钮，X关闭保留。新增页隐藏切换栏，仅显示返回、标题和四个字段，底部取消/保存并关注固定。

五项保真核对：字体沿用App Alibaba字体链，页签14/22px、600字重，主题14/22px加粗，说明12/20px，输入和表单标签使用原14px；间距维持20px左右留白、36px切换栏、40px输入与原圆角，新增页顶部收紧6px、页脚底留白12px；颜色使用原品牌红、浅红、白色及灰字，不新增色系；图标继续使用现有Plus/ChevronLeft与弹层X，原生表单与矢量清晰；文案与四个字段对应参考，已有主题和本地演示数据机制保留。

初次对照发现[P2]按钮挤占说明宽度，人工智能主题提前折行，列表首条及新增字段偏下。初版证据 `list-comparison-v1.png`、`new-comparison-v1.png`；修为标题与按钮同排、元数据满宽，收紧控制行与卡片间距及新增顶部留白。复拍后的上述最终合并图已检查，说明完整且不与按钮重叠，表单和页脚无裁切。参考图经过拼图缩放，残余字形抗锯齿差异不作为字体替换依据；无未解决P0/P1/P2。

验证：TypeScript/Vite生产构建通过；更新后的 `output/playwright/hotspot-manage/report.json` passed，覆盖手动新增、必填/重名、返回/取消、关注取消关注、AI条件编辑/保存、草稿与失败恢复、本机刷新、三个门户，以及320/375/430/1440零横向溢出、切换栏满宽、同行筛选/新增、右侧按钮和满宽元数据、固定表单页脚。`hotspots/report.json` passed，原时间线、来源、刷新与键盘操作正常。报告errors=[]、failed=[]。实现检查完成，没有远程发布。

## App 模块标题、门户背景与关闭按钮（2026-11-09）

final result: passed

- 参考：用户提供的标题截图 `codex-clipboard-731da380-5d43-4932-a4f7-4647360c434f.png`、背景截图 `codex-clipboard-debd71e3-3a31-489e-a1dc-761b86427e07.png`、按钮截图 `codex-clipboard-df4d8f3d-f831-499b-9368-347b57165fb1.png`。
- 模块标题统一为 600 16px/24px，前置红色修饰条为 5×14px、圆角 3px、与文字间隔 8px；替换原来的渐变和发光修饰。保留原有内容与节点。
- 综合资讯门户复用总体情况的浅粉波纹背景和蓝色箭头建筑原图，保持现有卡片位置。
- 资讯详情关闭按钮由 top/right 8px 调整为 12px，实际向下/向左各移动 4px；关闭交互正常。
- Chrome 375×812、DPR 1 检查：总体情况、领导/管理/员工门户、工作台标题样式一致，无运行时错误；生产构建通过。
- 证据：`output/playwright/title-background/report.json`、`background-comparison.png`、`title-comparison.png`、`close-comparison.png`、各路由截图。并排对比检查背景颜色、插画、标题字重、修饰条、关闭按钮位置，未发现阻断问题。
