import {useEffect,useRef,useState,type Dispatch,type SetStateAction,type PointerEvent as ReactPointerEvent,type RefObject} from 'react';
import {moveApp} from './data';
type Drag={id:string;pointerId:number;startX:number;startY:number;x:number;y:number;offsetX:number;offsetY:number;width:number;height:number;scale:number;active:boolean;initial:string[]};
export function useAppSorting(editing:boolean,ids:string[],setIds:Dispatch<SetStateAction<string[]>>,scroll:RefObject<HTMLDivElement|null>,announce:(s:string)=>void){
 const ref=useRef<Drag|null>(null),latest=useRef(ids),frame=useRef(0),[drag,setDrag]=useState<Drag|null>(null);latest.current=ids;
 function clear(restore=false){const d=ref.current;ref.current=null;setDrag(null);cancelAnimationFrame(frame.current);if(restore&&d?.active)setIds(d.initial);if(d&&scroll.current?.hasPointerCapture(d.pointerId))scroll.current.releasePointerCapture(d.pointerId)}
 function reorderAtPoint(){const d=ref.current;if(!d?.active)return;const target=document.elementFromPoint(d.x,d.y)?.closest<HTMLElement>('.my-apps [data-app-id]')?.dataset.appId;
  if(target&&target!==d.id){const from=latest.current.indexOf(d.id),to=latest.current.indexOf(target);if(from>=0&&to>=0){const next=moveApp(latest.current,from,to);latest.current=next;setIds(next)}}
 }
 function autoScroll(){const d=ref.current,el=scroll.current;if(!d?.active||!el)return;const r=el.getBoundingClientRect(),edge=44;let step=0;
  if(d.y<r.top+edge)step=-Math.min(12,(r.top+edge-d.y)/4);else if(d.y>r.bottom-edge)step=Math.min(12,(d.y-r.bottom+edge)/4);
  if(step){el.scrollTop+=step/d.scale;reorderAtPoint()}frame.current=requestAnimationFrame(autoScroll);
 }
 // Capture on the stable scroll container. Reordering a tile never loses the finger stream.
 useEffect(()=>{
  if(!editing){clear();return}
  function move(e:PointerEvent){const d=ref.current;if(!d||d.pointerId!==e.pointerId)return;d.x=e.clientX;d.y=e.clientY;
   if(!d.active&&Math.hypot(d.x-d.startX,d.y-d.startY)>=8){d.active=true;frame.current=requestAnimationFrame(autoScroll)}
   if(d.active){e.preventDefault();reorderAtPoint();setDrag({...d})}
  }
  function finish(e:PointerEvent){const d=ref.current;if(!d||d.pointerId!==e.pointerId)return;if(d.active)announce('顺序已调整');clear()}
  function cancel(e:PointerEvent){if(ref.current?.pointerId===e.pointerId)clear(true)}
  document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',finish);document.addEventListener('pointercancel',cancel);
  return()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',finish);document.removeEventListener('pointercancel',cancel);cancelAnimationFrame(frame.current)};
 },[editing]);
 function start(e:ReactPointerEvent<HTMLButtonElement>,id:string){if(!editing||!e.isPrimary||e.button!==0)return;const box=e.currentTarget.getBoundingClientRect();
  ref.current={id,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,offsetX:e.clientX-box.left,offsetY:e.clientY-box.top,width:box.width,height:box.height,scale:box.width/e.currentTarget.offsetWidth,active:false,initial:[...latest.current]};scroll.current?.setPointerCapture(e.pointerId);
 }
 return {drag,clear,start};
}
