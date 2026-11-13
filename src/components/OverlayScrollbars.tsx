import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import './overlay-scrollbars.css';
type Thumb={key:string;axis:'vertical'|'horizontal';top:number;left:number;width:number;height:number;visible:boolean};
/** Native scrollbars are hidden. These 3px indicators occupy only the overlay layer. */
export default function OverlayScrollbars(){
 const [thumbs,setThumbs]=useState<Thumb[]>([]);
 useEffect(()=>{
  const ids=new WeakMap<HTMLElement,string>(),active=new Map<HTMLElement,boolean>(),timers=new Map<HTMLElement,number>();let serial=0,frame=0;
  function measure(el:HTMLElement):Thumb[]{
   // Shortcut carousels expose their position through the pagination bars.
   if(el.classList.contains('shortcut-track')||el.classList.contains('portal-banner-track'))return [];
   const root=el===document.scrollingElement,r=root?{top:0,left:0,right:innerWidth,bottom:innerHeight}:el.getBoundingClientRect();
   let top=Math.max(0,r.top),left=Math.max(0,r.left),right=Math.min(innerWidth,r.right),bottom=Math.min(innerHeight,r.bottom);
   const device=el.closest('.device');
   // The chat page uses gesture-only scrolling; do not render the custom
   // scroll indicators over its carousel or page container while dragging.
   if(device?.querySelector('.route-chat'))return [];
   if(device&&!el.closest('.modal-backdrop')){
    // Fixed navigation belongs outside the page's scroll indicator track.
    if(device.querySelector('.modal-backdrop'))return [];
    const footer=device.querySelector<HTMLElement>('.bottom-nav');
    if(footer){const bounds=footer.getBoundingClientRect();if(bounds.left<right&&bounds.right>left)bottom=Math.min(bottom,bounds.top)}
   }
   for(let parent=el.parentElement;parent&&parent!==document.body;parent=parent.parentElement){const s=getComputedStyle(parent),b=parent.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(s.overflowY)){top=Math.max(top,b.top);bottom=Math.min(bottom,b.bottom)}if(/auto|scroll|hidden|clip/.test(s.overflowX)){left=Math.max(left,b.left);right=Math.min(right,b.right)}}
   if(right-left<8||bottom-top<8)return [];
   const id=ids.get(el)||String(++serial);ids.set(el,id);const result:Thumb[]=[],visible=active.get(el)===true;
   if(el.scrollHeight>el.clientHeight+1){const track=bottom-top-4,length=Math.min(track,Math.max(24,track*el.clientHeight/el.scrollHeight)),position=Math.max(0,Math.min(1,el.scrollTop/(el.scrollHeight-el.clientHeight)));result.push({key:id+'y',axis:'vertical',top:top+2+(track-length)*position,left:right-4,width:3,height:length,visible})}
   if(el.scrollWidth>el.clientWidth+1){const track=right-left-4,length=Math.min(track,Math.max(24,track*el.clientWidth/el.scrollWidth)),position=Math.max(0,Math.min(1,Math.abs(el.scrollLeft)/(el.scrollWidth-el.clientWidth)));result.push({key:id+'x',axis:'horizontal',top:bottom-4,left:left+2+(track-length)*position,width:length,height:3,visible})}
   return result;
  }
  function update(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>setThumbs([...active.keys()].filter(el=>el.isConnected).flatMap(measure)))}
  function onScroll(e:Event){const el=e.target===document?document.scrollingElement:e.target;if(!(el instanceof HTMLElement))return;active.set(el,true);clearTimeout(timers.get(el));update();timers.set(el,window.setTimeout(()=>{active.set(el,false);update();timers.set(el,window.setTimeout(()=>{active.delete(el);timers.delete(el);update()},180))},800))}
  document.addEventListener('scroll',onScroll,true);window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);
  return()=>{document.removeEventListener('scroll',onScroll,true);window.removeEventListener('resize',update);window.visualViewport?.removeEventListener('resize',update);timers.forEach(clearTimeout);cancelAnimationFrame(frame)};
 },[]);
 return createPortal(<div className="app-scrollbar-overlay" aria-hidden="true">{thumbs.map(({key,axis,visible,...style})=><div key={key} data-axis={axis} className={'app-scrollbar-thumb'+(visible?' is-scrolling':'')} style={style}/>)}</div>,document.body);
}
