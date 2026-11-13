import type {CSSProperties} from 'react';


const colors=[
  {name:'品牌',value:'#FF0000',token:'brand',description:'主按钮使用 #FF9622 → #FF0000 横向渐变；底部导航与业务分类选中使用品牌红，顶部视图切换使用黑色加粗。'},
  {name:'成功',value:'#00B578',token:'success'},
  {name:'警告',value:'#FF7D00',token:'warning'},
  {name:'其他',value:'#878B99',token:'other'},
  {name:'紫色',value:'#722ED1',token:'purple'},
  {name:'蓝色',value:'#006DFF',token:'blue'},
  {name:'青色',value:'#14C9C9',token:'cyan'},
];
const textColors=[
  {name:'主要内容',size:'14 / 22',color:'#03091B',token:'primary'},
  {name:'次级内容',size:'12 / 18',color:'#4E5969',token:'secondary'},
  {name:'时间 / 元数据',size:'12 / 18',color:'#878B99',token:'muted'},
  {name:'链接文字',size:'14 / 22',color:'#006DFF',token:'blue'},
];
const typography=[
  {name:'页面标题',sample:'页面标题',role:'page',size:'18 / 26',weight:400,color:'#03091B',token:'primary'},
  {name:'模块标题',sample:'系统导航 · 模块标题',role:'module',size:'16 / 24',weight:600,color:'#03091B',token:'primary',font:'var(--section-title-font)'},
  {name:'弹窗标题',sample:'每日简报·来源依据',role:'dialog',size:'18 / 26',weight:600,color:'#03091B',token:'primary',font:'var(--dialog-title-font)'},
  {name:'顶部选中视图',sample:'综合资讯',role:'selected',size:'16 / 24',weight:600,color:'#03091B',token:'primary',font:'600 16px/24px var(--font-app)'},
  {name:'列表标题',sample:'列表标题',role:'list',size:'16 / 24',weight:400,color:'#03091B',token:'primary'},
  {name:'正文',sample:'正文内容，清晰传达信息。',role:'body',size:'14 / 22',weight:400,color:'#03091B',token:'primary'},
  {name:'功能标题',sample:'功能标题',role:'function',size:'13 / 20',weight:400,color:'#4E5969',token:'secondary'},
  {name:'辅助说明',sample:'辅助说明与补充信息',role:'helper',size:'12 / 18',weight:400,color:'#878B99',token:'muted'},
  {name:'角标数字',sample:'9',role:'badge',size:'10 / 14',weight:400,color:'#FFFFFF',token:'primary'},
];

export default function Foundations(){return <>
    <section className="guide-section" aria-labelledby="guide-layout-title">
      <div className="guide-section-title"><h2 id="guide-layout-title">布局基准</h2><span>01</span></div>
      <div className="guide-baseline"><div><strong>375 <span>px</span></strong><span className="guide-confirmed">移动端基准宽度</span></div>
        <div className="guide-ruler" aria-hidden="true"><span>0</span><span>375</span></div>
        <p>375px 宽度下按 1:1 展示，其他手机宽度按可用空间等比适配。</p>
        <p>桌面预览保持 375px 画布；底部导航与输入栏固定在底部，内容独立滚动。</p>
        <p>工作台、门户卡片左右各 10px，宽 355px；卡片内边距按内容使用 14–20px。系统入口每行 5 个，常用功能每页 4 列 × 2 行。</p>
      </div>
    </section>
    <section className="guide-section" aria-labelledby="guide-colors-title">
      <div className="guide-section-title"><h2 id="guide-colors-title">品牌与功能色</h2><span>02</span></div>
      <div className="guide-palette">{colors.map(c=><div className={'guide-color guide-color-'+c.token} key={c.token}>
        <div className="guide-color-swatch" style={{background:`var(--color-${c.token})`}}/>
        <div><strong>{c.name}</strong><code>{c.value}</code></div>
        {c.description&&<p>{c.description}</p>}
      </div>)}</div>
    </section>
    <section className="guide-section" aria-labelledby="guide-text-title">
      <div className="guide-section-title"><h2 id="guide-text-title">背景与文字</h2><span>03</span></div>
      <div className="guide-surfaces">{[
        ['普通页面','#F2F1F5'],['AI 对话页','#F8FAFE'],['内容卡片','#FFFFFF'],['关闭按钮圆底','#F5F6F8'],
      ].map(([name,color])=><div key={name}><i style={{background:color}}/><span>{name}</span><code>{color}</code></div>)}</div>
      <p className="guide-footnote">工作台和门户保留粉色装饰头图；智能体、技能页使用普通页面底色。常用功能与系统导航卡片为 70% 白色背景、12px 背景模糊，内容保持不透明。</p>
      <div className="guide-text-colors"><div className="guide-table-head"><span>元素</span><span>字号 / 行高</span><span>文字颜色</span></div>
        {textColors.map(c=><div className="guide-text-row" key={c.name}>
          <span>{c.name}</span><span>{c.size}</span><code><i style={{background:`var(--color-${c.token})`}}/>{c.color}</code>
        </div>)}<p className="guide-table-note">以上文字字重均为 400。</p>
      </div>
    </section>
    <section className="guide-section" aria-labelledby="guide-fonts-title">
      <div className="guide-section-title"><h2 id="guide-fonts-title">字体层级</h2><span>04</span></div>
      <div className="guide-types">{typography.map(t=><div className="guide-type-row" key={t.role}>
        <div className="guide-type-example"><span className={'guide-type-sample guide-sample-'+t.role} style={{font:t.font||`var(--type-${t.role})`,color:t.role==='badge'?'#fff':`var(--color-${t.token})`} as CSSProperties}>{t.sample}</span></div>
        <div className="guide-type-meta"><span>{t.size} · {t.weight}</span><code>{t.color}</code></div>
      </div>)}</div>
      <p className="guide-footnote">字号 / 行高的单位为 px，均以 375px 画布为基准。字体示例使用当前 App 的实际样式。</p>
    </section>

</>}
