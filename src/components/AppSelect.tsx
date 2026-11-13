import {useEffect,useId,useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import {createPortal} from 'react-dom';
import {Check,ChevronDown} from 'lucide-react';
import './AppSelect.css';

type Props={label:string;value:string;options:readonly string[];onChange:(value:string)=>void};
/** Shared listbox; a portal keeps menus clear of card clipping and scroll containers. */
export default function AppSelect({label,value,options,onChange}:Props){
 const id=useId(),trigger=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null);
 const [open,setOpen]=useState(false),[active,setActive]=useState(0),[position,setPosition]=useState<CSSProperties>({});
 const host=trigger.current?.closest('.desktop-spec-panel,.device')||null;
 const close=()=>setOpen(false);
 function choose(index:number){if(!options[index])return;onChange(options[index]);close();trigger.current?.focus({preventScroll:true})}
 function show(){setActive(Math.max(0,options.indexOf(value)));setOpen(true)}
 useLayoutEffect(()=>{
  if(!open||!host||!trigger.current)return;
  function place(){if(!trigger.current)return;const box=trigger.current.getBoundingClientRect(),frame=host!.getBoundingClientRect();const availableBelow=frame.bottom-box.bottom-8,availableAbove=box.top-frame.top-8,desired=Math.min(248,options.length*40+10);const above=availableBelow<desired&&availableAbove>availableBelow;const maxHeight=Math.max(40,Math.min(248,above?availableAbove:availableBelow));setPosition({left:Math.max(4,box.left-frame.left),width:Math.min(box.width,frame.width-8),maxHeight,top:above?undefined:box.bottom-frame.top+4,bottom:above?frame.bottom-box.top+4:undefined})}
  place();window.addEventListener('resize',place);document.addEventListener('scroll',place,true);
  return()=>{window.removeEventListener('resize',place);document.removeEventListener('scroll',place,true)};
 },[open,host,options.length]);
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{const target=event.target as Node;if(!trigger.current?.contains(target)&&!menu.current?.contains(target))close()};
  document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);
 },[open]);
 useEffect(()=>{if(open)menu.current?.children[active]?.scrollIntoView({block:'nearest'})},[active,open]);
 return <div className="app-select"><button ref={trigger} type="button" role="combobox" className="app-select-trigger" aria-label={label} aria-haspopup="listbox" aria-controls={open?id:undefined} aria-expanded={open} aria-activedescendant={open?id+'-'+active:undefined} onClick={()=>open?close():show()} onKeyDown={event=>{
  if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();if(!open){show();return}setActive(index=>event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowUp'?-1:1)+options.length)%options.length)}
  else if(event.key==='Enter'||event.key===' '){event.preventDefault();if(open)choose(active);else show()}
  else if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();close()}
  else if(event.key==='Tab')close();
 }}><span>{value}</span><ChevronDown size={16} aria-hidden="true"/></button>
 {open&&host&&createPortal(<div ref={menu} id={id} role="listbox" aria-label={label+'选项'} className="app-select-menu" style={position}>{options.map((option,index)=><div id={id+'-'+index} key={option} role="option" aria-selected={value===option} className={active===index?'is-active':''} onPointerMove={()=>setActive(index)} onPointerDown={event=>event.preventDefault()} onClick={()=>choose(index)}><span>{option}</span>{value===option&&<Check size={16} aria-hidden="true"/>}</div>)}</div>,host)}
 </div>;
}
