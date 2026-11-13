import {useState,type CSSProperties} from 'react';
import type {Action} from '../components/SceneAction';
import {appById,loadApps,systemColumns,type ShortcutKind} from './data';
import './applications.css';
import AppIcon from './AppIcon';
import {usePagedCarousel} from '../components/usePagedCarousel';
export default function ShortcutCard({kind,origin,onAction}:{kind:ShortcutKind;origin:string;onAction:(a:Action)=>void}){
 const [ids]=useState(()=>loadApps(kind));
 const columns=kind==='portal'?systemColumns:4,size=kind==='workbench'?8:systemColumns,pages=Math.max(1,Math.ceil(ids.length/size));
 const title=kind==='workbench'?'常用功能':'系统导航';
 const {page,track,goToPage,bindings}=usePagedCarousel(pages);
 function more(){onAction({type:'navigate',value:'apps?'+new URLSearchParams({module:kind,origin})})}
 return <section className={'shortcut-card shortcut-'+kind} style={{top:kind==='workbench'?174:origin==='portal-leader'?144:104,'--shortcut-columns':columns} as CSSProperties} aria-label={title}>
  <header><h2>{title}</h2><button onClick={more} aria-label={title+'更多'}>更多<img src="/assets/spec/ChevronRight.svg" alt=""/></button></header>
  <div className="shortcut-track" ref={track} {...bindings} tabIndex={0} aria-label={title+'左右滑动翻页'}>
   {Array.from({length:pages},(_,index)=><div className="shortcut-grid" key={index} role="group" aria-label={title+'第'+(index+1)+'页'} inert={index!==page}>
    {ids.slice(index*size,(index+1)*size).map(id=>{const a=appById[id];return <button key={id} onClick={()=>onAction(a.action)}><AppIcon app={a} system={kind==='portal'}/><span data-node-id={id==='travel'?'0:6734':undefined}>{a.name}</span></button>})}
    {!ids.length&&<button className="shortcut-empty" onClick={more}>{kind==='portal'?'添加常用系统':'添加常用应用'}</button>}
   </div>)}
  </div>
  {pages>1&&<nav className="shortcut-pagination" aria-label={title+'翻页'}>{Array.from({length:pages},(_,i)=><button key={i} onClick={()=>goToPage(i)} aria-label={'第'+(i+1)+'页'} aria-current={i===page?'page':undefined}><span/></button>)}</nav>}
 </section>
}
