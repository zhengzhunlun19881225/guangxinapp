import {useId,useLayoutEffect,useRef} from 'react';
import {FileText,History,Sparkles} from 'lucide-react';
import type {SceneProps} from './SceneAction';
import {dailyBrief,type DailyBriefSnapshot} from '../data/dailyBrief';
import './DailyBrief.css';

export default function DailyBrief({onAction,onHeightChange}:SceneProps&{onHeightChange:(height:number)=>void}){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{const element=root.current;if(!element)return;const measure=()=>onHeightChange(element.offsetHeight);measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect()},[onHeightChange]);
 return <section className="work-daily-brief" aria-labelledby="daily-brief-heading" ref={root}>
  <header><div className="daily-brief-title"><h2 id="daily-brief-heading"><img src="/assets/workbench/section-accent.png" alt=""/>AI今日简报</h2><button aria-label="查看来源" title="查看来源" onClick={()=>onAction({type:'daily-sources',value:'每日简报·来源依据'})}><FileText size={16}/></button></div><div className="daily-brief-actions"><button aria-label="历史简报" title="历史简报" onClick={()=>onAction({type:'daily-history',value:'历史简报'})}><History size={16}/></button></div></header>
  <BriefCare onAction={onAction}/>
  <BriefSections sections={dailyBrief.sections.slice(0,1)}/>
 </section>;
}

function BriefCare({onAction}:SceneProps){
 const id=useId();
 return <article className="daily-brief-care" aria-labelledby={id}>
   <h3 id={id}><span className="daily-brief-icon"><FileText size={14}/></span>员工关怀</h3>
   <img className="daily-brief-banner" src="/assets/workbench/anniversary-care.png" alt="入职周年快乐，感恩同行，未来可期"/>
   <h4>今天是陈晓晓的入职 1 周年</h4>
   <p>根据入职时间记录，您的同事「陈晓晓」今天在公司工作满 1 年。感谢陈晓晓一直以来的付出，也欢迎您在部门内送上感谢与鼓励。</p>
   <footer><button className="compact-special-action" onClick={()=>onAction({type:'daily-greeting',value:'送入职周年祝福'})}><span><Sparkles size={14}/>AI 帮写感谢</span></button></footer>
  </article>;
}

function BriefSections({sections}:{sections:DailyBriefSnapshot['sections']}){
 return sections.map(section=><article className="daily-brief-arrangements" key={section.title}>
   <h3><span className={'daily-brief-icon '+section.color}><FileText size={14}/></span>{section.title}</h3>
   {section.items.map((item,index)=><div className="daily-brief-item" key={index}>{item.title&&<h4>{item.title}</h4>}<p>{item.text}</p></div>)}
  </article>);
}

export function DailyBriefCards({brief,onAction}:{brief:DailyBriefSnapshot}&SceneProps){
 return <><article><h3><span className="daily-brief-icon"><FileText size={14}/></span>今天的导读</h3><p>{brief.introduction}</p></article><BriefCare onAction={onAction}/><BriefSections sections={brief.sections}/></>;
}
