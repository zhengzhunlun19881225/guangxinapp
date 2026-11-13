import {useEffect,useRef,useState,type CSSProperties,type ReactNode,type RefObject} from 'react';
import {createPortal} from 'react-dom';
import CloseButton from './CloseButton';
import './ComposerSheet.css';

export default function ComposerSheet({device,title,closeLabel,close,escape,dialogRef,children,compact=false}:{device:HTMLElement;title:string;closeLabel:string;close:()=>void;escape?:()=>void;dialogRef:RefObject<HTMLElement|null>;children:ReactNode;compact?:boolean}){
 const [height,setHeight]=useState(600),escapeRef=useRef(escape||close);escapeRef.current=escape||close;
 useEffect(()=>{const update=()=>{const zoom=Number(getComputedStyle(device).getPropertyValue('--app-zoom'))||1;setHeight(Math.max(240,device.clientHeight/zoom-72))};const observer=new ResizeObserver(update);observer.observe(device);update();return()=>observer.disconnect()},[device]);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement,overlay=dialogRef.current?.parentElement;
  const siblings=Array.from(device.children).filter((el):el is HTMLElement=>el!==overlay&&el instanceof HTMLElement),inert=siblings.map(el=>el.inert);siblings.forEach(el=>el.inert=true);
  dialogRef.current?.querySelector<HTMLElement>('button')?.focus({preventScroll:true});
  function key(event:KeyboardEvent){
   if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();escapeRef.current()}
   if(event.key==='Tab'){
    const nodes=Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled):not([tabindex="-1"]),[href],input,[tabindex="0"]')||[]),first=nodes[0],last=nodes.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
   }
  }
  document.addEventListener('keydown',key,true);
  return()=>{document.removeEventListener('keydown',key,true);siblings.forEach((el,i)=>el.inert=inert[i]);if(previous?.isConnected)previous.focus({preventScroll:true})};
 },[device,dialogRef]);
 return createPortal(<div className="modal-backdrop composer-picker-overlay" onClick={event=>{if(event.target===event.currentTarget)close()}}>
  <section className="composer-picker-sheet app-close-surface" style={{zoom:'var(--app-zoom,1)',height:compact?'auto':height,maxHeight:height} as CSSProperties} ref={dialogRef} role="dialog" aria-modal="true" aria-label={title}>
   <header><h2>{title}</h2><CloseButton aria-label={closeLabel} onClick={close}/></header>
   {children}
  </section>
 </div>,device);
}
