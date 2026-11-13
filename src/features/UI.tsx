import {useEffect,useRef,type ReactNode} from 'react';
import {Search as SearchIcon,X} from 'lucide-react';
import {assets} from '../assets';
import AppNavBar,{NavBackIcon} from '../components/AppNavBar';
import CloseButton from '../components/CloseButton';
import './features.css';

export function FeatureShell({title,height,back,left,right,children,footer,header,className=''}:{title:string;height:number;back:()=>void;left?:ReactNode;right?:ReactNode;children:ReactNode;footer?:ReactNode;header?:ReactNode;className?:string}){
 return <section className={'feature-flow '+className} style={{height}} aria-label={title}>
  <div className="feature-status"><span>19:41</span><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
  {header||<AppNavBar className="feature-navbar" title={title} left={left||<button aria-label="返回" onClick={back}><NavBackIcon/></button>} right={right}/>}
  <div className="feature-body">{children}</div>
  {footer&&<footer className="feature-footer">{footer}</footer>}<div className="feature-home"><span/></div>
 </section>;
}
export function FeatureSearch({value,onChange,placeholder='搜索',autoFocus=false}:{value:string;onChange:(value:string)=>void;placeholder?:string;autoFocus?:boolean}){
 return <div className="feature-search"><SearchIcon size={16} aria-hidden="true"/><input aria-label={placeholder} placeholder={placeholder} value={value} autoFocus={autoFocus} onChange={e=>onChange(e.target.value)}/>{value&&<button aria-label="清空搜索" onClick={()=>onChange('')}><X size={16}/></button>}</div>;
}
export function FeatureTabs({items,value,onChange,label='分类',segmented=false}:{items:string[];value:string;onChange:(value:string)=>void;label?:string;segmented?:boolean}){
 return <div className={'feature-tabs'+(segmented?' is-segmented':'')} role="tablist" aria-label={label}>{items.map(item=><button role="tab" key={item} aria-selected={item===value} onClick={()=>onChange(item)}>{item}</button>)}</div>;
}
export function Mark({text,query}:{text:string;query:string}){if(!query)return <>{text}</>;const parts=text.split(query);return <>{parts.map((part,i)=><span key={i}>{i>0&&<mark>{query}</mark>}{part}</span>)}</>}
export function Empty({children='暂无相关内容'}:{children?:ReactNode}){return <p className="feature-empty" role="status">{children}</p>}
export function Sheet({title,close,children,footer,compact=false}:{title:string;close:()=>void;children:ReactNode;footer?:ReactNode;compact?:boolean}){
 const ref=useRef<HTMLDivElement>(null),closeRef=useRef(close);closeRef.current=close;
 useEffect(()=>{const previous=document.activeElement as HTMLElement;const flow=ref.current?.closest('.feature-flow');const siblings:HTMLElement[]=[];let branch:Element|null=ref.current?.parentElement||null;while(branch&&branch!==flow){for(const el of Array.from(branch.parentElement?.children||[]))if(el!==branch&&el instanceof HTMLElement)siblings.push(el);branch=branch.parentElement}const inert=siblings.map(el=>el.inert);siblings.forEach(el=>el.inert=true);ref.current?.querySelector<HTMLElement>('input,button,textarea,select')?.focus();
  function key(e:KeyboardEvent){if(flow?.querySelectorAll('.feature-sheet').item(flow.querySelectorAll('.feature-sheet').length-1)!==ref.current)return;if(e.key==='Escape'){e.stopPropagation();closeRef.current()}if(e.key==='Tab'){const els=Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,textarea,a[href],[tabindex="0"]')||[]);if(!els.length)return;const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);siblings.forEach((el,i)=>el.inert=inert[i]);if(previous?.isConnected)previous.focus({preventScroll:true})};
 },[]);
 return <div className="feature-overlay" onClick={e=>{if(e.target===e.currentTarget)close()}}><div ref={ref} className={'feature-sheet app-close-surface'+(compact?' is-compact':'')} role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><CloseButton onClick={close}/></header><div className="feature-sheet-body">{children}</div>{footer&&<footer>{footer}</footer>}</div></div>;
}
