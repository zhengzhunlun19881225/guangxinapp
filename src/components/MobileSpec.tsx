import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import Foundations from '../spec/Foundations';
import SpecDemo,{SpecIcon} from '../spec/Demos';
import SpecOverlay from '../spec/Overlay';
import {catalog,categories} from '../spec/catalog';
import ComponentDetails from '../spec/ComponentDetails';
import ToastMessage,{type ToastVariant} from './ToastMessage';
import './MobileSpec.css';
import '../spec/components.css';

export default function MobileSpec(){
 const [category,setCategory]=useState('atoms'),[query,setQuery]=useState(''),[overlay,setOverlay]=useState('');
 const [notice,setNotice]=useState<{text:string;undo?:()=>void;variant:ToastVariant}|null>(null);
 const tabs=useRef<HTMLElement>(null),guide=useRef<HTMLElement>(null);
 const scrollHost=()=>guide.current?.closest<HTMLElement>('.desktop-spec-scroll')||document.querySelector<HTMLElement>('.device-scroll');
 const current=categories.find(item=>item.id===category)!;
 const keyword=query.trim().toLowerCase();
 const items=keyword?Object.values(catalog).flat().filter(item=>(item.name+' '+item.en+' '+item.rule).toLowerCase().includes(keyword)):catalog[category];
 const total=Object.values(catalog).reduce((count,items)=>count+items.length,0)+4;
 const showFoundations=!keyword&&category==='atoms'||!!keyword&&/颜色|字体|布局|color|font|375/.test(keyword);
 const message=(text:string,undo?:()=>void,variant:ToastVariant='text')=>setNotice({text,undo,variant});
 useEffect(()=>{if(!notice)return;const timer=notice.variant==='loading'?setTimeout(()=>setNotice({text:'加载完成',variant:'text'}),1800):setTimeout(()=>setNotice(null),notice.undo?6000:2500);return()=>clearTimeout(timer)},[notice]);
 useEffect(()=>{if(overlay!=='loading')return;const timer=setTimeout(()=>{setOverlay('');message('加载完成')},1800);return()=>clearTimeout(timer)},[overlay]);
 useEffect(()=>{if(!overlay)return;const scroll=scrollHost();if(!scroll)return;const before=scroll.style.overflow;const element=guide.current;scroll.style.overflow='hidden';if(element)element.inert=true;return()=>{scroll.style.overflow=before;if(element)element.inert=false}},[overlay]);
 function select(next:string){setCategory(next);setQuery('');requestAnimationFrame(()=>tabs.current?.scrollIntoView({block:'start'}))}
 const host=guide.current?.closest('.desktop-spec-panel,.device')||null;
 return <article ref={guide} className="mobile-guide mobile-guide-complete" aria-labelledby="mobile-guide-title">
  <header className="guide-header"><a href="#/canvases" aria-label="返回全部画布"><SpecIcon name="ChevronLeft" size={19}/>全部画布</a><span>App 设计规范</span></header>
  <div className="guide-intro"><span className="guide-eyebrow">广智新 · 当前 App 样式</span><h1 id="mobile-guide-title">手机规范</h1><p>同步工作台、广新门户与 AI 对话的实际样式、组件和交互。每项组件参照 PC，包含六项规范说明与参考源码。</p>
   <a className="guide-download" href="./mobile-design-spec.md" download="广智新App完整手机规范.md" title="包含全部基础参数、组件规范、状态与交互"><SpecIcon name="Download" size={16}/>下载完整规范 MD 文档</a>
   <div className="guide-summary"><div><strong>375<span>px</span></strong><small>设计基准</small></div><div><strong>44<span>px</span></strong><small>最小触摸热区</small></div><div><strong>{total}<span>项</span></strong><small>规范与组件</small></div></div>
  </div>
  <div className="guide-current-summary"><strong>当前 App 约定</strong><p>系统五列 · 常用功能四列双行 · 70% 毛玻璃 · 顶部选中黑色加粗</p><button onClick={()=>select('app')}>查看 App 组件 <SpecIcon name="ChevronRight" size={16}/></button></div>
  <label className="guide-catalog-search"><SpecIcon name="Search" size={18}/><input aria-label="搜索组件或规范" placeholder="搜索组件或规范" value={query} onChange={event=>setQuery(event.target.value)}/>{query&&<button className="spec-iconbutton" aria-label="清空规范搜索" onClick={()=>setQuery('')}><SpecIcon name="X" size={17}/></button>}</label>
  <nav className="guide-categories" aria-label="规范分类" ref={tabs}>{categories.map(item=><button key={item.id} aria-current={!keyword&&category===item.id?'true':undefined} onClick={()=>select(item.id)}>{item.label}</button>)}</nav>
  <div className="guide-category-heading"><h2>{keyword?'搜索结果':current.label}</h2><p>{keyword?`“${query}” · ${items.length+(showFoundations?4:0)} 项`:current.description}</p></div>
  {showFoundations&&<Foundations/>}
  <div className="guide-demo-catalog">{items.map(item=><section className="guide-demo-card" aria-labelledby={'spec-'+item.id} data-component={item.id} key={item.id}>
   <header><div><h3 id={'spec-'+item.id}>{item.name}</h3><code>{item.en}</code></div><span className={'guide-origin '+(item.existing?'is-existing':'')}>{item.existing?'现有样式':'补充规范'}</span></header>
   <div className="guide-demo-surface"><SpecDemo id={item.id} open={setOverlay} message={message}/></div><ComponentDetails item={item}/>
  </section>)}</div>
  {!items.length&&!showFoundations&&<div className="guide-no-results"><SpecIcon name="Search" size={28}/><p>未找到相关组件</p><button className="spec-button spec-button-text" onClick={()=>setQuery('')}>清空搜索</button></div>}
  <footer className="guide-footer"><span>广智新 App · 手机规范</span><a href="#/canvases">查看全部画布 <SpecIcon name="ChevronRight" size={16}/></a><button className="spec-button spec-button-text" onClick={()=>scrollHost()?.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}><SpecIcon name="ArrowUp" size={16}/> 返回顶部</button></footer>
  {overlay&&<SpecOverlay host={host} type={overlay} close={()=>setOverlay('')} message={message}/>}
  {notice&&host&&createPortal(notice.undo?<div className="spec-live-message spec-snackbar" role="status"><span>{notice.text}</span><button onClick={()=>{const undo=notice.undo;setNotice(null);undo?.()}}>撤销</button></div>:<ToastMessage className="spec-live-message" text={notice.text} variant={notice.variant} announce/>,host)}
 </article>;
}
