import {useId,type ReactNode} from 'react';
import './SegmentedTabs.css';

/** Shared 36px segmented control used by task categories and follow settings. */
export default function SegmentedTabs<T extends string>({id,options,value,onChange,label,className='',panels=false}:{id?:string;options:readonly {value:T;label:ReactNode}[];value:T;onChange:(value:T)=>void;label:string;className?:string;panels?:boolean}){
 const generated=useId(),base=id||generated;
 return <div className={'app-segmented-tabs '+className} role="tablist" aria-label={label}>{options.map((option,index)=><button key={option.value} id={base+'-'+option.value} type="button" role="tab" aria-selected={value===option.value} aria-controls={panels?base+'-panel-'+option.value:undefined} tabIndex={value===option.value?0:-1} onClick={()=>onChange(option.value)} onKeyDown={event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowRight'?1:-1)+options.length)%options.length;
  onChange(options[next].value);document.getElementById(base+'-'+options[next].value)?.focus();
 }}>{option.label}</button>)}</div>;
}
