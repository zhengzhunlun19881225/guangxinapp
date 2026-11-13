# 移动资讯、热点追踪与主动提醒验收

final result: passed

## 视觉依据与归一方式

- 原移动规范及前轮验收保留于 `design-reference/portal-news/previous-design-qa.md`，品牌红、文字语义色、Alibaba 字体、375px基准及44px操作热区继续使用。
- AI资讯卡片依据 `design-reference/portal-news/reference.png`（554×584）；列表后续要求依据 `list-ratio-reference.png` 与 `list-gap-reference.png`，并以用户最后“高度不变，改宽度”为准：95px高、16:9宽、32px条目间距、无分割线。
- 订阅依据 `subscription-manual-reference.png`（484×936）、`subscription-ai-reference.png`（454×926）。PC表单适配375px，控件保留44px热区，选项按可用宽度换行，内容独立滚动，底部操作固定。
- 集团资讯依据 `group-reference.png`（378×632）；详情依据 `group-detail-reference.png`（750×2994），照片与正文按375px宽归一。保留App自己的状态栏、导航及底部安全区，详情局部对比不计这些额外设备区域。
- 通知间距依据 `notices-spacing-reference.png`：通知区域上下和两卡之间均10px，支持原生左右滑动。
- 热点依据 `hotspot-reference.png`（420×627），按355px卡片宽归一。主动提醒依据 `service-card-reference.png`（562×353）与 `service-more-reference.png`（801×642）；PC宽卡内容适配现有355×310px移动区块，PC对话框改为手机滚动弹层。
- Chrome在375×812 CSS px、deviceScaleFactor=1捕获；另验证320、430、768、1440px。桌面保留375px手机画布；320/430按既有App缩放机制适配。图片尺寸与间距断言允许亚像素取整误差。

## 同图比较与修复记录

- `output/playwright/portal-news/card-comparison-final.png`：卡片题图、标签、标题/摘要层级和元数据。初次标题换行及摘要密度偏差已通过字距、标签与字号修正并复拍。
- `output/playwright/portal-news/list-layout-comparison-final.png`：用户标注前的列表与最终列表并列。后续文字指令优先于旧截图：图片高度95px，宽约168.89px；原图等比cover裁切；32px空隙代替横线。标题区域随图片加宽收窄，仍保留两行截断及完整详情入口。
- `output/playwright/news-tools/manual-375-comparison-final.png`、`ai-generated-375-comparison-final.png`：PC订阅参考与手机弹层并列。由于44px热区及手机字号，手动选项为3列，AI生成结果需下滑查看；固定页脚始终可操作。最初关闭按钮30px问题已修为44px，弹层最大高度改94%，复拍及多宽度断言通过。
- `output/playwright/group-news/comparison-v1.png`：集团资讯五条排名、题图、来源与日期一致，独立标题和四个标签行完整。
- `output/playwright/group-detail/comparison-final.png`，局部 `comparison-top-final.png`、`comparison-bottom-final.png`：四段正文、两张原图、发布单位/时间、323阅读、232初始点赞及附件。初次标题过轻和段落换行偏差已调整标题字重及正文1px字距。可点击计数保留44px热区，因而元数据行比静态参考略高；文字颜色优先使用已确认系统规范。
- `output/playwright/group-detail/notices-comparison.png`：通知/公告上下空隙与卡片间距统一10px；真实手指向左/右滑动验证通过，保留纵向位置。
- `output/playwright/hotspots/comparison-v1.png` → `comparison-final.png`：初次最后主题及第三条进展底部不全（P2）；缩小主题标签内距，调整正文与节点间距，保留44px操作热区。最终四个主题及三条默认进展完整可见，附计算断言。时间、阶段、分类、来源数量均复用PC数据。
- `output/playwright/service-alerts/card-comparison-v1.png` → `card-comparison-final.png`：加强模块/提醒标题字重，标签移至正文下方，首个分类标签完整保留；移动端摘要和长业务类型允许省略，详情保留全文。
- `output/playwright/service-alerts/more-comparison-final.png`、`field-column-comparison-final.png`：原88px标签列造成“其他酒店订单”与值相邻重叠（P2）；标签列改104px。最终截图的标签与值分离，全部字段名不溢出断言通过。生成依据统一14/22px单行，超长省略并保留完整文本。

## 五项保真核对

- 字体：沿用Alibaba及系统字体链。列表标题16/24、提醒标题14/22、摘要12/18、生成依据14/22。页面及模块字号沿用手机规范；截图中的PC宽度和缩放不直接替代手机字号。
- 间距与布局：资讯列表95px高图、16:9、32px间距；通知区域10px；集团资讯下热点10px。提醒区保持原310px高度，以两张白卡、业务图标、摘要、标签和操作组成；长字段自然换行，生成依据独立保持单行。
- 颜色：品牌红 #FF0000、主文字 #03091B、次文字 #4E5969、辅助 #878B99、信息蓝 #006DFF；事实绿、媒体橙、分析蓝按语义呈现。导航透明，卡片与弹层使用原系统背景及圆角。
- 图片和图标：AI题图复用PC原始图片；集团新闻沿用原App照片；详情仅提取用户参考的两个真实照片区域，没有将文字或控件压成整图。热点管理/刷新与提醒字段复用PC SVG，提醒业务图标使用与PC相同的Lucide CalendarClock/Building2。
- 内容：AI分类及正文、订阅条件、集团新闻排行、四段详情、两附件、三阶段热点与提醒十个字段完整。集团“更多”按用户要求只显示第三方App提示。列表条目进入统一的用户提供文章样例，未伪造其他新闻的完整正文。

## 浏览器、交互与构建证据

- `output/playwright/portal-news/report.json`：三个门户分类、More、AI正文、返回、真实触屏滑动、多宽度布局、滚动位置。
- `output/playwright/portal-news/list-height-fixed-report.json`：最后固定高度修改后单独复验320/375/430/768/1440；95px高、16:9比例、零分割线和32px间距通过。
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
