import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {createPortal} from 'react-dom';
import {Minus,Plus} from 'lucide-react';
import {assets} from '../assets';
import type {Action} from '../components/SceneAction';
import {appById,catalog,categories,systems,defaults,loadApps,moveApp,saveApps,systemColumns,type Application,type ShortcutKind} from './data';
import AppIcon from './AppIcon';
import {useAppSorting} from './useAppSorting';
import './applications.css';
function Icon({name}:{name:string}){return <span aria-hidden="true" className="applications-icon" style={{maskImage:`url(/assets/${name==='Minus'?'im':'spec'}/${name}.svg)`} as CSSProperties}/>}
export default function ApplicationsPage({locationKey,height,navigate,onAction,notify}:{locationKey:string;height:number;navigate:(r:string)=>void;onAction:(a:Action)=>void;notify:(s:string)=>void}){
 const query=new URLSearchParams(locationKey.split('?')[1]||''),kind:ShortcutKind=query.get('module')==='portal'?'portal':'workbench';
 const origin=['workbench','portal-staff','portal-manager','portal-leader'].includes(query.get('origin')||'')?query.get('origin')!:kind==='portal'?'portal-staff':'workbench';
 const [saved,setSaved]=useState(()=>loadApps(kind)),[draft,setDraft]=useState(saved),[editing,setEditing]=useState(false),[announcement,setAnnouncement]=useState('');
 const scroll=useRef<HTMLDivElement>(null),sorting=useAppSorting(editing,draft,setDraft,scroll,setAnnouncement);
 const ids=editing?draft:saved,library=kind==='portal'?systems:catalog,groups=kind==='portal'?['全部系统']:categories;
 const available=editing?library.filter(a=>!draft.includes(a.id)):library;
 const title=kind==='portal'?'添加系统':'添加应用',item=kind==='portal'?'系统':'应用';
 const columns=kind==='portal'?systemColumns:4;
 useEffect(()=>{const next=loadApps(kind);setSaved(next);setDraft(next);setEditing(false);setAnnouncement('')},[kind]);
 function edit(){setDraft([...saved]);setEditing(true)}
 function cancel(){sorting.clear();setDraft([...saved]);setEditing(false)}
 function save(){sorting.clear();if(!saveApps(kind,draft)){notify('保存失败，请重试');return}setSaved([...draft]);setEditing(false);notify(kind==='portal'?'系统导航已保存':'常用应用已保存')}
 function add(a:Application){setDraft(prev=>prev.includes(a.id)?prev:[...prev,a.id]);setAnnouncement('已添加'+a.name)}
 function remove(a:Application){setDraft(prev=>prev.filter(id=>id!==a.id));setAnnouncement('已移除'+a.name)}
 function tile(a:Application,mine=false){return <div key={a.id} data-app-id={a.id} className={'application-tile'+(sorting.drag?.id===a.id&&mine?' is-dragging':'')}>
  <button className="application-main" aria-label={a.name} aria-describedby={editing&&mine?'application-sort-help':undefined} aria-keyshortcuts={editing&&mine?'ArrowLeft ArrowRight ArrowUp ArrowDown':undefined} onClick={()=>editing?(!mine&&add(a)):onAction(a.action)} onPointerDown={mine?e=>sorting.start(e,a.id):undefined} onKeyDown={e=>{if(!editing||!mine)return;const steps:Record<string,number>={ArrowLeft:-1,ArrowRight:1,ArrowUp:-columns,ArrowDown:columns};if(e.key in steps){e.preventDefault();setDraft(prev=>{const i=prev.indexOf(a.id);return moveApp(prev,i,i+steps[e.key])});setAnnouncement('顺序已调整')}}}>
   <AppIcon app={a} system={kind==='portal'}/><span>{a.name}</span>
  </button>
  {editing&&<button className={'application-edit-control '+(mine?'remove':'add')} aria-label={(mine?'移除':'添加')+a.name} onClick={()=>mine?remove(a):add(a)}><span>{mine?<Minus size={13} strokeWidth={2.5}/>:<Plus size={13} strokeWidth={2.5}/>}</span></button>}
 </div>}
 const d=sorting.drag;
 return <section className={'applications-page applications-'+kind+(editing?' is-editing':'')} style={{height,'--app-grid-columns':columns} as CSSProperties}>
  <div className="applications-status"><span>19:41</span><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
  <header className="applications-nav"><button aria-label={editing?'取消编辑':'返回'} onClick={()=>editing?cancel():navigate(origin)}>{editing?'取消':<Icon name="ChevronLeft"/>}</button><h1>{title}</h1><button onClick={()=>editing?save():edit()}>{editing?'保存':'编辑'}</button></header>
  <div className="applications-scroll" ref={scroll}>
   {editing&&<p className="applications-hint" id="application-sort-help">拖动可调整{item}位置<span className="application-sr-only">，键盘可使用方向键调整</span></p>}
   <section className="applications-card my-apps"><header><h2>我的{item}</h2>{editing&&<button className="restore-apps" onClick={()=>{sorting.clear();setDraft([...defaults[kind]])}}>恢复默认</button>}</header><div className="applications-grid">{ids.map(id=>tile(appById[id],true))}</div>
    {!ids.length&&<p className="applications-empty">{editing?'从下方分类中添加'+item:'暂无'+item+'，点击右上角编辑添加'}</p>}
   </section>
   <section className="applications-card application-catalog" aria-label={editing?'可添加的'+item:item+'分类'}>{groups.map(category=>{const entries=available.filter(a=>a.category===category);return entries.length?<section className="application-category" key={category}><h2>{category}</h2><div className="applications-grid">{entries.map(a=>tile(a))}</div></section>:null})}
    {!available.length&&<p className="applications-empty">已添加全部{item}</p>}
   </section>
  </div><div className="applications-home"><div className="home-indicator"/></div>
  <span className="application-sr-only" aria-live="polite">{announcement}</span>
  {d&&createPortal(<div className="application-drag-preview" aria-hidden="true" style={{left:d.x-d.offsetX,top:d.y-d.offsetY,width:d.width,height:d.height,'--drag-scale':d.scale,'--drag-icon-size':kind==='portal'?'32px':'34px'} as CSSProperties}><AppIcon app={appById[d.id]} system={kind==='portal'}/><span>{appById[d.id].name}</span></div>,document.body)}
 </section>
}
