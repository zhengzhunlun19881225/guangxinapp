import {useEffect,useRef,type CSSProperties,type ReactNode} from 'react';
import CloseButton from '../components/CloseButton';
export function Icon({name,size=20}:{name:string;size?:number}){return <span className="schedule-icon" aria-hidden="true" style={{width:size,height:size,maskImage:`url(/assets/schedule/${name}.svg)`} as CSSProperties}/>}
export function Sheet({title,close,children}:{title:string;close:()=>void;children:ReactNode}){
 const root=useRef<HTMLElement>(null),closeRef=useRef(close);closeRef.current=close;
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement;
  root.current?.querySelector<HTMLElement>('button,input,select,textarea,a[href]')?.focus();
  function key(event:KeyboardEvent){
   if(event.key==='Escape')closeRef.current();
   if(event.key==='Tab'){
    const nodes=Array.from(root.current?.querySelectorAll<HTMLElement>('button,input,select,textarea,a[href]')||[]),first=nodes[0],last=nodes.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
   }
  }
  document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);previous?.focus()};
 },[]);
 return <div className="schedule-overlay" onClick={event=>{if(event.target===event.currentTarget)close()}}><section className="schedule-sheet app-close-surface" ref={root} onKeyDown={event=>{if(event.key==='Enter'&&event.target instanceof HTMLInputElement)event.preventDefault()}} role="dialog" aria-modal="true" aria-label={title}>
  <header><h2>{title}</h2><CloseButton onClick={close}/></header>{children}
 </section></div>;
}

