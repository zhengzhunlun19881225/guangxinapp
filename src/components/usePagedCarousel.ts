import {useRef,useState,type KeyboardEvent,type MouseEvent,type PointerEvent,type UIEvent} from 'react';

/** Native touch scrolling, mouse dragging and page buttons share one position. */
export function usePagedCarousel(count:number){
 const [page,setPage]=useState(0),track=useRef<HTMLDivElement>(null),suppressClick=useRef(false);
 const gesture=useRef<{id:number;x:number;left:number;dragged:boolean}|null>(null);
 const clamp=(index:number)=>Math.max(0,Math.min(count-1,index));
 function goToPage(index:number){const element=track.current;if(!element)return;element.scrollTo({left:clamp(index)*element.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 function move(event:PointerEvent<HTMLDivElement>){const current=gesture.current;if(!current||current.id!==event.pointerId||!(event.buttons&1))return;const element=event.currentTarget,delta=event.clientX-current.x;
  if(!current.dragged&&Math.abs(delta)>6){current.dragged=true;element.style.scrollSnapType='none';element.setPointerCapture(event.pointerId)}
  if(current.dragged){event.preventDefault();element.scrollLeft=current.left-delta}
 }
 function finish(event:PointerEvent<HTMLDivElement>){const current=gesture.current;if(!current||current.id!==event.pointerId)return;const element=event.currentTarget;if(current.dragged){const index=Math.round(element.scrollLeft/element.clientWidth);element.style.scrollSnapType='';goToPage(index);suppressClick.current=true}gesture.current=null;if(element.hasPointerCapture(event.pointerId))element.releasePointerCapture(event.pointerId)}
 const bindings={
  onScroll:(event:UIEvent<HTMLDivElement>)=>setPage(clamp(Math.round(event.currentTarget.scrollLeft/event.currentTarget.clientWidth))),
  onPointerDown:(event:PointerEvent<HTMLDivElement>)=>{suppressClick.current=false;gesture.current=event.pointerType==='mouse'&&event.button===0?{id:event.pointerId,x:event.clientX,left:event.currentTarget.scrollLeft,dragged:false}:null},
  onPointerMove:move,onPointerUp:finish,onPointerCancel:finish,
  onClickCapture:(event:MouseEvent<HTMLDivElement>)=>{if(suppressClick.current&&event.detail!==0){event.preventDefault();event.stopPropagation()}suppressClick.current=false},
  onKeyDown:(event:KeyboardEvent<HTMLDivElement>)=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();goToPage(page+(event.key==='ArrowLeft'?-1:1))}}
 };
 return {page,track,goToPage,bindings};
}
