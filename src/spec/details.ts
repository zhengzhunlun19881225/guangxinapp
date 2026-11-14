import type {SpecItem} from './catalog';

export const detailFields=[
 ['usage','用途与选择'],['visual','结构与视觉'],['behavior','状态与交互'],
 ['keyboard','键盘与焦点'],['boundaries','边界与恢复'],['contract','接入约定'],
] as const;
type Details=Record<(typeof detailFields)[number][0],string>&{source:string};
type Entry=Omit<Details,'visual'>;
const demo='src/spec/Demos.tsx';
const overlay='src/spec/Overlay.tsx';
const patterns='src/spec/AppPatterns.tsx';
const staticKeyboard='静态展示不进入 Tab 顺序；相关说明可选择、复制。';
const activate='Tab 定位操作，Enter / Space 激活；保留清晰的键盘焦点。';
const modalKeyboard='打开后焦点进入浮层并限制在内部；Escape 关闭，关闭后回到触发入口。';
const entry=(usage:string,behavior:string,keyboard:string,boundaries:string,contract:string,source=demo):Entry=>({usage,behavior,keyboard,boundaries,contract,source});

// 接入约定描述移动端统一标准；来源指向当前实现或示例，并非另行发布的组件 API。
const entries:Record<string,Entry>={
 icons:entry('表达搜索、日程、消息等明确动作；陌生图标配文字说明。','可点击图标提供按下、聚焦和禁用反馈；纯装饰图标不响应。',activate,'资源缺失时保留文字名称；不得以颜色或图标作为唯一状态信息。','复用既有图标资源，分别设置视觉尺寸、操作名称和点击热区。','src/components/WorkbenchVectorIcon.tsx · src/apps/AppIcon.tsx · src/spec/Demos.tsx'),
 close:entry('关闭弹窗、详情和底部面板，位置与样式全 App 统一。','点击关闭按钮、允许的遮罩或 Escape 关闭；有未保存内容时先确认。',modalKeyboard,'长标题自动换行；关闭入口保持可见，关闭不误触背景。','复用 CloseButton；由所属浮层处理关闭、未保存状态与回焦。','src/components/CloseButton.tsx · src/components/CloseButton.css'),
 radius:entry('按输入、卡片、弹层和胶囊层级选用圆角。','圆角只表达形状；不额外增加悬停或选中行为。',staticKeyboard,'图片与容器圆角一致；内容裁切不能截断焦点轮廓。','沿用对应组件的圆角令牌，不因页面差异重复定义数值。','src/styles.css · src/spec/components.css'),
 shadow:entry('区分普通内容、悬浮操作与浮层的空间层级。','弹层出现时配合遮罩；普通卡片不因点击永久增加阴影。',staticKeyboard,'避免多个阴影叠加；高对比度环境仍需依靠边线区分层级。','按容器层级复用样式，阴影与交互焦点分别设置。','src/spec/components.css'),
 spacing:entry('统一模块、内容、字段和操作之间的留白。','间距随内容排版保留；隐藏模块后同时移除多余间隙。',staticKeyboard,'窄屏先换行再调整布局，不挤压文字或点击热区。','使用规定间距档位；首页模块间距与常规页面内边距分开设置。','src/styles.css · src/spec/components.css'),
 divider:entry('分隔列表条目、表单分组和说明区；优先通过留白建立层级。','分割线本身不响应点击，不显示可操作状态。',staticKeyboard,'末项避免重复底线；深色、缩放和高对比度下仍可辨认分组。','使用装饰性边线或 hr；不要给装饰线添加按钮角色。','src/spec/components.css'),
 skeleton:entry('首次加载时预示头像、标题和正文结构。','加载完成后替换为内容；刷新已有内容时优先保留原列表。',staticKeyboard,'失败后结束骨架并显示重试；空数据切换空状态，不持续占位。','由真实请求驱动 loading；容器设置 aria-busy，装饰骨架对读屏隐藏。'),

 'system-grid':entry('展示已配置的业务系统入口，适合五列快捷访问。','支持横滑、分页按钮及方向键；点击入口进入对应系统。','分页和入口可 Tab 聚焦；左右方向键切换页，Enter 打开入口。','无权限入口说明原因；空列表提供添加入口，长名称换行而不撑宽页面。','复用 ShortcutCard；系统 ID、排序与跳转来自应用目录，禁止用展示名作主键。','src/apps/ShortcutCard.tsx · src/apps/data.ts'),
 'common-shortcuts':entry('工作台中展示高频功能，适合四列双行的快捷操作。','横滑与分页同步；功能点击沿用业务跳转，编辑后保留顺序。','入口和分页均可通过键盘激活；不只依赖横滑访问后页。','不足八项按实际内容展示；背景复杂时保证文字可读。','复用 ShortcutCard 的常用功能配置；背景透明度只作用于容器。','src/apps/ShortcutCard.tsx · src/apps/applications.css'),
 'poster-cases':entry('门户展示主题海报和案例，图片承担主要信息表达。','横滑或点击圆点切换；点击当前海报打开对应案例。','圆点具有序号名称，Enter / Space 选择；海报入口可聚焦。','资源加载失败保留标题与入口；尊重减少动态效果，不强制自动轮播。','复用 PortalBanner；按稳定案例 ID 绑定图片、标题和详情。','src/components/PortalBanner.tsx · src/components/usePagedCarousel.ts'),
 'chat-composer':entry('用于 AI 提问、输入文本及通过五种来源添加附件。','加号展开五列等分入口；紧凑状态显示两张卡片，点击附件数量展开完整列表，支持预览、移除、确认清空和发送。','问题及模板先填入草稿，文件与PPT模板先展示于输入框上方；输入框自动换行增高，Enter换行，按钮或Ctrl/Command+Enter发送；工具可Tab激活，弹层支持Escape和焦点约束，组合输入未结束时不发送。','无文本且无附件不发送；最多5个、单个20MB；重复、空文件和读取失败提供提示；解析失败支持重试，未支持格式明确标注未解析。','附件二进制和草稿存本机IndexedDB，发送后保留预览下载入口；尚未接入附件分析服务，不模拟解析或AI回答。','src/components/Composer.tsx · src/components/ComposerAttachments.tsx · src/components/attachmentStore.ts'),
 'daily-brief':entry('展示 AI 今日简报、员工关怀及感谢操作。','详情紧邻标题，历史位于右侧；感谢按钮进入文案辅助流程。',activate,'关怀内容缺失时不留固定空白；生成失败保留已编辑的感谢文案。','复用 DailyBrief 与业务弹窗；日期、员工信息和生成请求由上层提供。','src/components/DailyBrief.tsx · src/components/BriefDialogs.tsx'),
 'adaptive-news':entry('展示随分类变化的资讯列表，避免少量内容时出现空白。','切换分类更新列表；点击条目查看详情，后续模块随高度移动。','分类与资讯入口均可聚焦；切换后保持触发项焦点。','覆盖多条、单条、空列表与长标题；请求失败提供重试，保留已加载内容。','按真实数据渲染条目，不以固定高度模拟列表长度。','src/components/GroupNews.tsx · src/spec/AppPatterns.tsx'),
 'follow-settings':entry('管理已关注主题，或用自然语言生成 AI 订阅条件。','生成后允许编辑，保存后关注；取消关注与编辑独立操作。','页签、主题操作和表单依次聚焦；生成后不强行抢走输入焦点。','追踪需求上限 4000 字；生成或保存失败保留输入，避免重复创建主题。','复用 HotspotManage；示例设置仅保存在示例状态，真实业务接入订阅存储。','src/components/HotspotManage.tsx · src/components/NewsSubscription.tsx'),

 navbar:entry('标识当前页面，提供返回、搜索及页面级操作。','返回沿原路径；右侧操作打开对应功能，左右内容变化不推动标题偏移。',activate,'长标题省略或按业务换行；无返回路径时跳转上级首页，不渲染无效按钮。','复用 AppNavBar；传入 title、left、right 与操作回调，图标使用可访问名称。','src/components/AppNavBar.tsx · src/components/AppNavBar.css'),
 tabbar:entry('切换五个 App 一级入口，保留稳定顺序和名称。','切换后更新选中图标与文字；当前入口再次点击不重复创建页面。','每个入口可 Tab 激活；用 aria-current 表达当前页面。','底部安全区与键盘弹起时不遮挡内容；消息角标不撑大布局。','导航状态与路由保持一致；各入口按业务需要恢复页面滚动与筛选。','src/App.tsx · src/styles.css'),
 tabs:entry('切换同一页面内同级且互斥的内容分类。','点击切换对应内容与指示线；保持选中项可见。','页签需按 Tab / 方向键组织焦点，Enter 激活；关联对应内容区域。','选项过多时横向滚动；空分类显示原因，不跳回第一项。','接入时绑定稳定分类 ID 与受控选中值；使用 tablist、tab、tabpanel 关系。','src/components/NewsTabs.tsx · src/spec/Demos.tsx'),
 drawer:entry('承载次级导航、历史记录或补充筛选。','由明确入口打开，遮罩与关闭按钮可退出；背景停止操作。',modalKeyboard,'窄屏宽度不超过 80%；长菜单内部滚动，关闭后恢复原页面位置。','统一管理打开状态与关闭回调；抽屉内容不得嵌套第二套页面滚动。',overlay),
 indexbar:entry('按姓名首字母快速定位较长通讯录。','选择字母滚动到对应分组，并同步当前字母。','索引可键盘聚焦激活；另提供搜索，无需连续精细触控。','无对应分组的字母不执行跳转；空通讯录显示空状态。','索引和分组由同一联系人集合派生，避免使用独立维护的字母列表。'),
 backtop:entry('长页面快速回到当前滚动容器顶部。','点击后滚动至顶部；减少动态效果时立即定位。',activate,'仅处理所属容器；固定入口避开底部导航与安全区。','接入时传入或查找正确的滚动容器，不假定页面总由 window 滚动。'),
 scrollnav:entry('分类较多时以横向胶囊导航切换内容。','点击分类更新选中状态，当前项应滚动进入可见区。','分类可 Tab 激活；接入时补齐方向键切换，保留可见焦点。','首尾分类不截断；长名称完整呈现，内容无结果时保留当前分类。','与资讯分类共用 PillTabs 样式和分类 ID，避免独立维护选中颜色。','src/components/PillTabs.css · src/spec/Demos.tsx'),
 segmented:entry('切换门户总体情况与综合资讯，或 IM 与通讯录两个同级视图。','选中白底黑色加粗，未选中为次级文字；切换保留各视图状态。','切换项均可聚焦激活；用 aria-selected 或 aria-pressed 表达当前值。','门户与IM共用158px宽、30px高的容器，内边距2px、选项间距0；两项等宽，整体相对页面居中。','门户复用 LeaderScenePortalToggle，IM 使用消息列表状态；不与红色业务分类混用。','src/screens/LeaderScenePortalToggle.tsx · src/components/Controls.tsx'),

 'button-types':entry('按操作优先级选择主、次、文字、幽灵及危险按钮。','同一区域突出一个主要动作；危险操作先确认，导航跳转使用链接语义。',activate,'长文案可换行且不压缩热区；无权限与禁用需说明原因。','使用原生 button 并显式设置 type；提交动作由表单与异步状态管理。'),
 'button-states':entry('说明操作从可用、按下、加载到成功或报错的反馈。','加载时阻止重复提交；禁用优先于悬停和点击。',activate,'失败保留输入并恢复可重试状态；请求结束后清理加载标识。','绑定真实 pending / disabled / error 状态；使用 aria-busy 和就近错误提示。'),
 floating:entry('在日程等页面突出唯一高频的新建动作。','点击进入新建流程；位置固定在内容之上但不遮挡其他操作。',activate,'滚动、横屏与键盘弹起时避开底部操作；不可与多个同级主按钮竞争。','使用明确名称如“新建日程”，定位相对当前页面容器并计算安全区。'),
 'button-group':entry('并列确认/取消操作，或在少量互斥视图间切换。','动作按钮分别执行；分段选项选中后更新关联视图。',activate,'窄屏可改为纵向排列；长文字不重叠，禁用项不改变当前值。','动作组与视图切换分别建模；互斥选择由单一受控值管理。'),
 iconbutton:entry('空间有限、语义明确的搜索、新增、更多等辅助操作。','按下、聚焦与禁用有反馈；纯图标也必须有操作名称。',activate,'提示文字不能只在 hover 时可见；图标缩小不缩小点击热区。','使用原生按钮与 aria-label；装饰图标设置 aria-hidden，避免重复朗读。'),

 input:entry('填写姓名等单行短文本；标签独立于占位提示。','默认白底，hover / 聚焦浅灰；可清空，校验后就近展示错误。','保留原生选择、复制、粘贴与输入法；Tab 顺序与页面阅读顺序一致。','空值、超长和非法格式分别反馈；失败保留原输入，不擅自截断。','绑定 value / onChange；设置 label、输入类型、自动填充及错误关联。'),
 textarea:entry('填写说明、意见和较长的多行内容。','输入实时更新字数；默认白底，hover / 聚焦浅灰，允许正常换行。','Enter 换行；保留输入法组合、复制粘贴，Tab 切换控件。','字数上限明确提示；长内容内部滚动或自增高，校验失败保留文本。','绑定 value / onChange 与长度规则；辅助说明使用 aria-describedby 关联。'),
 search:entry('对联系人或列表执行关键词筛选。','输入即筛选，清空后恢复结果；无结果显示关键词与恢复入口。','输入可 Tab 聚焦；清空按钮可键盘操作，清空后焦点回到输入框。','异步结果防止旧请求覆盖新关键词；网络失败与无结果分别说明。','查询词与结果状态分开管理；远程搜索按需防抖并取消过期请求。'),
 radio:entry('同一问题只能选择一个答案，如审批方式。','整行点击切换，选择新项时取消原项。','同组原生单选通过方向键切换，Tab 进入或离开组。','至少有一个有效选项；禁用项不能被选中，必填时明确校验。','同组共享 name；使用 fieldset / legend 和稳定值关联业务选项。'),
 checkbox:entry('订阅内容等允许同时选择多项的独立选项。','点击勾选或取消；整行标签可点，状态同时以勾选符号表达。','Tab 定位，Space 切换；原生复选框保留可见焦点。','全选需处理中间状态；必选数量限制就近提示，保留已有选择。','受控值使用 ID 集合；勾选状态与表单提交值一致。'),
 switch:entry('立即生效的二元设置，如消息免打扰。','切换后更新开启状态；异步保存期间避免重复切换。','Tab 定位，Enter / Space 切换；通过 aria-checked 说明状态。','保存失败恢复原值并提示；需要提交确认的选项改用复选框。','提供名称、当前布尔值和变更回调；错误恢复由设置请求处理。'),
 picker:entry('从固定少量选项中单选，如处理优先级。','默认白底，hover / 聚焦 / 展开浅灰；选中后关闭，Escape 取消本次浏览。','方向键移动、Home / End 到首尾、Enter 确认、Escape 关闭并回焦。','禁用选项不能选；长列表内部滚动，无结果保留当前有效值。','复用 AppSelect；传入 options、value、onChange 与 label，提交稳定选项值。','src/components/AppSelect.tsx · src/components/AppSelect.css'),
 cascade:entry('按组织与部门等层级逐步选择路径。','改变上级后重置不兼容下级；当前路径完整可读。','每级沿用选择器的方向键、确认与 Escape；Tab 顺序按层级排列。','下级未加载或无数据时显示明确状态；失败重试不丢失上级选择。','上级 ID 驱动下级数据，路径由同一份选择状态生成；复用 AppSelect。','src/components/AppSelect.tsx · src/spec/Demos.tsx'),
 city:entry('省、市等地区联动选择，提交结构化地区信息。','更换省份后更新城市列表；完成后展示完整地区名称。','沿用选择器键盘规则；省、市按填写顺序聚焦。','直辖市、空城市和地区变更需处理；无效旧值提示重新选择。','显示名与地区编码分离；省市数据使用同一版本，复用 AppSelect。','src/components/AppSelect.tsx · src/spec/Demos.tsx'),
 datepicker:entry('日程与表单中的日期、时间输入。','默认白底，hover / 聚焦 / 展开浅灰；选择后更新可读时间。','沿用系统日期控件键盘方式；Tab 进入字段，Escape 退出日期面板。','校验开始早于结束；处理空值、非法日期、跨日及时区变化。','使用 datetime-local 或业务日期控件；保存时显式约定时区与时间格式。'),
 slider:entry('在连续或有固定步长的范围内选择值，如音量。','拖动即时显示当前值；设置最小、最大和步长。','方向键按步长调整，Home / End 到边界；值变化可被读屏感知。','超范围值归一到合法范围；精确输入需求同时提供数字输入。','使用原生 range，绑定 min / max / step / value 与可访问名称。'),
 stepper:entry('在有限范围内逐步调整数量。','点击加减更新数量，达到边界禁用对应按钮。',activate,'不允许越界或重复请求造成跳数；无效输入恢复到最近合法值。','数量、上下限与步长由业务传入；加减按钮名称区分方向。'),
 upload:entry('为表单或消息附加文件和图片，选择后先确认内容。','展示文件名、图片预览和移除入口；选择不会自动发送。','选择文件与移除按钮可键盘激活；使用系统文件选择面板。','类型、大小与数量限制提前说明；取消选择保留原列表，失败允许重试。','处理 File 列表与上传状态；预览 URL 在移除、替换和卸载时释放。'),
 chip:entry('将少量可选标签直接展开，便于快速选择。','单选互斥，多选可取消；用边框、勾选和文字共同表达状态。',activate,'长标签允许换行；数量过多时改用选择器，禁用项说明原因。','明确 single / multiple 选择模型；选中值使用 ID，而非颜色或显示顺序。'),

 card:entry('组织相关内容和操作，如资讯、简报或指标模块。','仅有跳转职责时整卡可点；含多个操作时分别设置入口。','可操作内容按阅读顺序聚焦；静态卡片不增加 Tab 停靠点。','内容高度自适应；图片失败保留文字，空模块说明原因或收起。','复用页面卡片样式与内容结构；避免在整卡按钮内嵌套按钮。','src/components/DailyBrief.tsx · src/spec/components.css'),
 list:entry('展示联系人、通知和业务记录等同构条目。','整行进入详情，尾部操作独立响应，不连带触发行点击。',activate,'长标题换行或省略；加载、空、错误和末页有各自反馈。','按稳定 ID 渲染；条目跳转、辅助操作与选中状态分别绑定。'),
 avatar:entry('识别人、群组或 AI 数字员工。','静态头像不交互；可进入资料时提供明确入口与按下反馈。','静态图像不聚焦；资料入口可用键盘激活，并读出对象名称。','图片加载失败使用姓名或默认头像；保持比例且不暴露损坏图片。','头像 URL、姓名和尺寸由业务传入；相邻已有姓名时避免重复替代文本。','src/im/ImPages.tsx · src/spec/Demos.tsx'),
 badge:entry('显示未读数或需要关注的状态提示。','数量随已读状态变化；仅附着在对应业务入口上。','徽章自身不聚焦；父入口名称应包含未读数量或状态。','零值按业务隐藏；负数归零，超过 99 显示 99+，不撑开入口。','由业务计数驱动，读屏名称保留完整数量，视觉展示可封顶；接入 count、dot、max=99 与 showZero。','src/spec/BadgeDemo.tsx · src/spec/components.css'),
 tag:entry('以紧凑标签标记已完成、待审批、进行中、告警和未完成。','静态状态不响应点击；筛选标签应使用独立的可选择控件。',staticKeyboard,'未知状态显示中性文字；状态不只依赖颜色，不把告警与待审批混用。','沿用 PC 五种语义色，将业务状态码映射到文案与 tone。','src/spec/Demos.tsx · src/spec/components.css'),
 carousel:entry('以海报案例说明轮播；入口轮播另沿用业务分页样式。','横滑与圆点联动，点击海报进入案例；页码与当前内容同步。','圆点可键盘激活；若业务自动轮播，需提供暂停并支持减少动态效果。','单项隐藏无意义分页；图片失败保留标题，末项行为需保持一致。','复用 PortalBanner 与 usePagedCarousel；数据顺序、当前索引和详情对应同一案例。','src/components/PortalBanner.tsx · src/components/usePagedCarousel.ts'),
 empty:entry('列表或搜索没有记录时解释原因，并给出下一步操作。','操作按钮引导新建、刷新或重置筛选；空状态不自动消失。','插画不聚焦；恢复操作可 Tab 激活，说明可被读屏读取。','区分首次无数据、筛选无结果与请求失败，不以空状态掩盖错误。','使用透明底插画，传入具体原因与恢复动作；不依赖固定空白高度。','public/assets/ui/empty-records.png · src/spec/Demos.tsx'),
 result:entry('完整反馈成功、失败等流程结果。','显示具体结果、必要原因和返回或继续操作入口。',activate,'失败保留已填内容与重试路径；返回不重复提交原请求。','结果状态由真实操作返回值驱动；主次动作根据流程出口确定。'),
 progress:entry('展示可度量的上传、处理或任务完成进度。','百分比与进度条同步；完成后切换成功状态。','进度本身不聚焦；使用 progressbar 语义与当前值，避免逐帧播报。','无法测量时使用不定进度；失败、取消与停滞不能显示为已完成。','传入真实 value / max 与任务状态；数值归一到合法范围。'),
 countdown:entry('展示有明确结束时间的短时等待或活动倒计时。','按秒更新；到零停止，提供重新开始入口。','输出按需读屏提示，避免每秒打断；重新开始按钮可键盘操作。','后台恢复按目标时间校正；页面卸载清理计时器，禁止显示负数。','生产接入使用截止时间计算剩余值；不要依赖定时器累计次数。'),
 collapse:entry('将次要或较长内容按标题分组收起。','点击标题展开或收起；箭头与 aria-expanded 同步更新。','标题使用按钮，可 Tab 定位、Enter / Space 切换。','长标题换行；收起前若焦点位于内容中，需回到标题按钮。','用稳定 ID 关联触发按钮与内容区域；明确是否允许同时展开多项。'),
 imageviewer:entry('查看聊天和资讯中的大图，提供缩放与退出。','支持缩放按钮、双指缩放及关闭；图片保持比例。',modalKeyboard,'加载失败显示重试；缩放限制在合理范围，关闭后恢复原页面滚动。','复用预览交互；传入图片与替代说明，统一管理缩放、关闭与焦点。',overlay),
 notice:entry('持续展示简短重要公告，并引导查看完整内容。','点击查看入口进入详情；动态滚动信息需可暂停。','查看入口可键盘激活；减少动态效果时改为静态显示。','超长文案不截断关键意思；公告过期后由业务移除。','公告正文与目标链接成对配置；重要通知不能仅依赖滚动文字传达。'),

 'bubble-tips':entry('在目标附近补充简短提示，五种指向适应不同边缘。','随触发状态显示，避免遮挡目标；交互内容较多时改用气泡面板。','由聚焦或显式按钮触发，并支持 Escape 关闭；纯提示关联 aria-describedby。','靠近视口边缘时调整方向；长说明换用可换行面板，不挤入 32px 单行框。','主体与三角分别计算尺寸；根据触发元素位置定位，不写死页面坐标。','src/spec/Demos.tsx · src/spec/components.css'),
 toast:entry('提供文字、加载、信息、成功、警告、错误六种轻提示，用于操作反馈、语义消息与短暂等待。','文字及四种语义提示约2.5秒自动消失；加载提示随任务结束更新或关闭，演示约1.8秒后显示加载完成。新消息替换当前提示，不显示关闭按钮。','使用 status 播报且不抢焦点；文字提示不带图标，语义提示使用文字配合对应颜色图标，加载提示展示红色渐变转圈并标记 busy，尊重减少动态效果。','长文案自然换行且保持屏幕内显示；加载失败应结束等待并呈现原因，关键错误持续就近展示。','复用 ToastMessage，按 text 与 variant（text / loading / info / success / warning / danger）传入内容和效果；统一消息入口管理显示与计时，卸载或替换消息时清理定时器。','src/components/ToastMessage.tsx · src/spec/ToastDemo.tsx · src/components/MobileSpec.tsx'),
 dialog:entry('有标题或无标题提示用于需要确认阅读的信息；确认弹窗用于明确决定，圆角按钮用于突出主动作，组件用法支持自定义图片内容。','提示仅提供确认；确认弹窗提供取消与确认。异步示例提交中禁用确认，完成后关闭；取消、遮罩或Escape退出时清理等待任务。',modalKeyboard,'窄屏保持两侧留白，长内容内部滚动；真实业务报错应保留弹窗与输入并提供重试，禁止重复提交。','复用Dialog表面组件，传入可选title、可访问名称、children、actions和buttonStyle；浮层容器统一处理关闭、锁定背景与回焦。异步示例仅演示本地状态，不代替真实请求。','src/components/Dialog.tsx · src/components/Dialog.css · src/spec/DialogDemo.tsx · src/spec/DialogExample.tsx · src/spec/Overlay.tsx'),
 actionsheet:entry('在移动端底部展示少量上下文操作；按场景选择基础列表、图标列表、取消分组、描述信息、选项状态或自定义内容。','点击可用选项后反馈并关闭；禁用与加载项不执行操作。取消独立分组，遮罩与 Escape 均可退出；自定义示例提供文档预览及四种分享入口。',modalKeyboard,'长列表内部滚动，保留底部安全区；禁用和加载状态同时由语义表达，危险操作接入真实业务前按风险确认。','选项使用稳定 ID、名称、图标、描述及 disabled / loading 状态；取消不改变业务数据，自定义内容沿用同一浮层的关闭、焦点限制和回焦。','src/spec/ActionSheetDemo.tsx · src/spec/ActionSheetContent.tsx · src/spec/Overlay.tsx'),
 dropdown:entry('在入口附近展示当前视图或操作选项。','展开菜单，选择后更新当前值并关闭；外部点击或 Escape 取消。','菜单接入应支持方向键、Enter 选择与 Escape 退出；关闭回焦。','禁用项不可选；空间不足改为向上展开或在面板内滚动。','绑定稳定 value 与 options；使用正确菜单语义，选择变化与业务动作分开处理。'),
 banner:entry('页面顶部以基础通知条持续呈现信息、成功、警告或错误。','每条可独立关闭；示例支持恢复全部，重要消息不按计时自动消失。','关闭按钮可 Tab 激活；异步新消息按紧急程度使用 status 或 alert，避免静态示例重复播报。','保持40px单行，超长文字省略并保留完整文本与title，关闭不影响其他消息；关闭按钮独立保留44px热区，关键阻断问题保留恢复入口。','按 tone、文案和可关闭状态组织消息；颜色复用规范语义变量，背景由对应语义色8%混白生成，避免使用参考图的外部色值。','src/spec/BannerDemo.tsx · src/spec/components.css'),
 overlay:entry('隔离弹窗、抽屉和底部面板与背景页面。','打开时阻止背景操作与滚动；按业务允许遮罩关闭。',modalKeyboard,'多层浮层按顺序关闭；退出后恢复原滚动与焦点，不遗留锁定。','复用统一浮层容器，成对处理打开/卸载清理、inert、焦点限制和回焦。',overlay),
 guide:entry('首次进入功能时介绍关键入口与操作顺序。','突出当前目标，支持下一步、跳过与关闭；不强迫完成全部引导。',modalKeyboard,'目标不可见时先定位或跳过；小屏说明不遮挡目标与退出按钮。','按功能版本保存完成状态；演示不修改用户真实引导记录。',overlay),
 loading:entry('反馈正在处理、暂时无法展示内容的状态。','旋转指示配明确文字；长任务提供取消，结束后切换实际结果。','使用 busy / status 反馈；取消按钮可聚焦，不在计时更新时反复抢焦点。','失败结束加载并给出重试；页面退出时取消请求或忽略过期返回。','绑定真实请求生命周期；取消与成功分别处理，不能用固定延时代表业务成功。',overlay),

 refresh:entry('在列表顶部主动重新获取最新内容。','下拉达到约 60px 后释放触发；加载中禁止重复刷新。','提供“刷新”按钮替代手势，Enter / Space 可触发。','仅在列表顶部拦截下拉；失败保留原内容和重试，避免与页面滚动冲突。','刷新状态与请求绑定；完成或失败都要复位位移并恢复滚动。'),
 loadmore:entry('长列表按页加载后续记录，减少首屏等待。','触底或点击加载更多；加载期间不重复请求，无更多时明确说明。','始终提供可聚焦的加载按钮；新增记录不强制移动焦点。','失败保留已加载条目并重试当前页；避免重复项和旧请求乱序。','页码或游标、hasMore、loading 与 error 分开维护，按稳定 ID 去重。'),
 swipe:entry('为列表条目提供删除等低频辅助操作。','左滑只展开操作；点击删除执行，完成后允许撤销。','提供“更多”按钮替代侧滑；展开后的删除按钮可键盘操作。','纵向滚动时不误触删除；同一时间只展开一项，失败恢复原条目。','维护展开条目 ID 与撤销快照；删除状态由业务结果确认。'),
 sticky:entry('滚动中保留当前分组标题或筛选条件。','仅在所属容器内吸顶，后续分组按顺序替换。','吸顶本身不改变焦点；标题内操作保持原有 Tab 顺序。','不盖住导航、锚点目标或操作；容器底部结束吸顶。','设置明确滚动容器、top 与层级，锚点定位同时配置 scroll-margin。'),

 touch:entry('统一触屏操作可点击范围，避免小图标难以命中。','视觉主体可以小于热区；相邻热区不重叠、不误触。',activate,'窄屏和缩放后仍保持至少 44×44 CSS px；边缘热区不能超出容器。','验收点击区域而非仅检查 SVG 尺寸；使用独立包装层扩展热区。','src/components/AppNavBar.css · src/components/CloseButton.css · src/spec/components.css'),
 responsive:entry('在手机、横屏及桌面预览中保持一致的信息与操作顺序。','375px 为基准；宽度变化调整布局，内容区域保持可滚动。','缩放、旋转和键盘弹起不改变焦点顺序；聚焦项应保持可见。','检查 320 / 375 / 430px 与横屏；长内容不产生页面横向溢出。','结合视口、安全区与容器宽度布局；桌面规范与 App 预览分别滚动。','src/styles.css · src/desktop-workspace.css'),
 gestures:entry('为点击、长按、侧滑、下拉和双指缩放建立一致约定。','达到明确阈值再触发；拖动与滚动冲突时优先保证页面可滚动。','所有手势提供按钮或键盘等价操作；不能要求用户必须长按或双指。','取消手势时复位；多点触控、移出边界和中途松手不误执行动作。','统一处理 pointercancel、触控方向与阈值；危险操作在手势结束后仍需明确动作。','src/spec/Demos.tsx · src/spec/Overlay.tsx'),
 states:entry('作为组件默认、按下、禁用、加载、错误、成功和空状态的验收标准。','禁用不响应，加载不重复提交，错误就近反馈，成功后提供下一步。','保持焦点可见；错误通过 aria-invalid / 描述关联，不只依赖颜色。','重试不丢输入；修正后移除过期错误，空数据与加载失败分开处理。','按真实业务状态建模；静态文字与分割线不增加无意义的加载或选中状态。'),
};

export function componentDetails(item:SpecItem):Details{
 const details=entries[item.id];
 if(!details)throw new Error('缺少组件说明：'+item.id);
 return {...details,visual:item.rule};
}
