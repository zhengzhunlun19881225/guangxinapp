import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {SpecIcon} from './Demos';
import CloseButton from '../components/CloseButton';
import ActionSheetContent from './ActionSheetContent';
import {actionSheetExamples} from './ActionSheetDemo';
import DialogExample from './DialogExample';
export default function SpecOverlay({type,close,message,host}:{type:string;close:()=>void;message:(text:string)=>void;host:Element|null}){
 const root=useRef<HTMLElement>(null),closeRef=useRef(close),points=useRef(new Map<number,{x:number;y:number}>()),pinch=useRef({distance:0,zoom:1});closeRef.current=close;
 const [zoom,setZoom]=useState(1);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement;
  root.current?.querySelector<HTMLElement>('button:not(:disabled),input:not(:disabled)')?.focus();
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape')closeRef.current();
   if(event.key==='Tab'){
    const nodes=Array.from(root.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled)')||[]),first=nodes[0],last=nodes.at(-1);
    if(!nodes.includes(document.activeElement as HTMLElement)){event.preventDefault();(event.shiftKey?last:first)?.focus()}
    else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
   }
  };
  document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);queueMicrotask(()=>previous?.focus())};
 },[]);
 if(!host)return null;
 const actionVariant=type.startsWith('actionsheet:')?type.split(':')[1]:'';
 const dialogVariant=type.startsWith('dialog:')?type.split(':')[1]:'';
 const title=actionVariant?'动作面板 · '+actionSheetExamples.find(example=>example.id===actionVariant)?.label:({dialog:'确认删除',actionsheet:'更多操作',drawer:'移动端菜单',overlay:'遮罩层示例',guide:'快速认识组件规范',loading:'加载中',image:'图片预览'} as Record<string,string>)[type];
 const drawer=type==='drawer',sheet=type==='actionsheet'||!!actionVariant||drawer,image=type==='image';
 const rect=document.querySelector('.guide-categories')?.getBoundingClientRect(),device=host.getBoundingClientRect();
 const highlight=rect&&type==='guide'?{left:Math.max(0,rect.left-device.left),top:Math.max(8,rect.top-device.top),width:Math.min(rect.width,device.width),height:rect.height}:undefined;
 return createPortal(<div className={'spec-overlay spec-overlay-'+(actionVariant?'actionsheet':dialogVariant?'dialog-example':type)} onClick={event=>{if(event.target===event.currentTarget)close()}}>
  {highlight&&<div className="spec-guide-highlight" style={highlight}/>}
  {dialogVariant?<DialogExample variant={dialogVariant} dialogRef={root} close={close} message={message}/>:<section ref={root} role="dialog" aria-modal="true" aria-label={title} className={'spec-dialog app-close-surface '+(sheet?'spec-dialog-sheet ':'')+(drawer?'spec-dialog-drawer ':'')+(image?'spec-dialog-image ':'')+(actionVariant?'spec-action-sheet':'')}>
   {!actionVariant&&<header><h2>{title}</h2><CloseButton aria-label="关闭规范弹层" onClick={close}/></header>}
   {actionVariant?<ActionSheetContent variant={actionVariant} close={close} message={message}/>:image?<><div className="spec-image-stage" onPointerDown={event=>{
    event.currentTarget.setPointerCapture(event.pointerId);points.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(points.current.size===2){const [a,b]=[...points.current.values()];pinch.current={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom}};
   }} onPointerMove={event=>{
    if(!points.current.has(event.pointerId))return;points.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(points.current.size===2){const [a,b]=[...points.current.values()];if(pinch.current.distance)setZoom(Math.max(1,Math.min(3,pinch.current.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.current.distance)))}
   }} onPointerUp={event=>points.current.delete(event.pointerId)} onPointerCancel={event=>points.current.delete(event.pointerId)}><img src="/assets/im/chat-photo.png" alt="办公空间预览" draggable={false} style={{transform:`scale(${zoom})`}}/></div>
    <div className="spec-image-toolbar"><button className="spec-iconbutton" aria-label="缩小图片" disabled={zoom<=1} onClick={()=>setZoom(Math.max(1,zoom-.25))}><SpecIcon name="ZoomOut"/></button><output>{Math.round(zoom*100)}%</output><button className="spec-iconbutton" aria-label="放大图片" disabled={zoom>=3} onClick={()=>setZoom(Math.min(3,zoom+.25))}><SpecIcon name="ZoomIn"/></button></div></>
   :type==='loading'?<div className="spec-loading"><SpecIcon name="LoaderCircle" size={32}/><p>正在加载，请稍候</p><button className="spec-button spec-button-secondary" onClick={close}>取消加载</button></div>
   :drawer?<nav className="spec-drawer-nav" aria-label="抽屉示例菜单">{['工作台','我的日程','通讯录','我的'].map((label,index)=><button key={label} onClick={()=>{close();message('已选择'+label)}}><SpecIcon name={['Home','CalendarDays','UsersRound','UserRound'][index]}/>{label}<SpecIcon name="ChevronRight" size={16}/></button>)}</nav>
   :type==='actionsheet'?<div className="spec-action-list">{['查看详情','复制链接','分享设置'].map(label=><button key={label} onClick={()=>{close();message('已选择'+label)}}>{label}</button>)}<button className="spec-action-cancel" onClick={close}>取消</button></div>
   :<><p>{type==='dialog'?'删除后将移除该条演示记录，请确认后再操作。':type==='guide'?'使用顶部分类查看九类组件；搜索框可以快速定位组件。每张卡片都提供样式示例与使用规则。':'遮罩将背景操作隔离，弹层内可以正常操作。点击关闭、遮罩或按 Escape 返回。'}</p>
    <div className="spec-dialog-actions"><button className="spec-button spec-button-secondary" onClick={close}>{type==='guide'?'跳过':'取消'}</button><button className={'spec-button spec-button-'+(type==='dialog'?'danger':'primary')} onClick={()=>{close();if(type==='dialog')message('演示记录已删除')}}>{type==='dialog'?'确认删除':'知道了'}</button></div>
   </>}
  </section>}
 </div>,host);
}
