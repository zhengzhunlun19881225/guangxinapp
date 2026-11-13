import {useEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {dailyBrief,dailyBriefArchive,dailyBriefSources} from '../data/dailyBrief';
import {addDays,parseDate,todayKey} from '../schedule/data';
import {DailyBriefCards} from './DailyBrief';
import type {SceneProps} from './SceneAction';
import './BriefDialogs.css';

export function DailyBriefSources(){
 return <div className="daily-brief-dialog"><div className="daily-sources-scroll">
  <p className="brief-dialog-note">{dailyBrief.date} · 信息截至 {dailyBrief.cutoff}。当前为示例简报，以下记录用于展示来源依据。</p>
  {dailyBriefSources.map(source=><section className="daily-source-entry" key={source.title}>
   <header><h3>{source.title}</h3><span className={'daily-source-status'+(source.partial?' is-partial':'')}>{source.partial?'部分待核实':'已获取'}</span></header>
   <p className="daily-source-time">{dailyBrief.dateKey} {source.time} · 北京时间</p><p>{source.text}</p>
  </section>)}
 </div></div>;
}

function weekDates(day:string){const date=parseDate(day),monday=addDays(day,-((date.getDay()+6)%7));return Array.from({length:7},(_,index)=>addDays(monday,index))}

export function DailyBriefHistory({onAction}:SceneProps){
 const latest=[...dailyBriefArchive].sort((a,b)=>b.dateKey.localeCompare(a.dateKey))[0];
 const [day,setDay]=useState(latest?.dateKey||todayKey()),scroll=useRef<HTMLDivElement>(null),calendar=useRef<HTMLDivElement>(null);
 const today=todayKey(),week=weekDates(day),snapshot=dailyBriefArchive.find(brief=>brief.dateKey===day);
 useEffect(()=>{scroll.current?.scrollTo({top:0})},[day]);
 function selectDay(date:string,focus=false){if(date>today)return;setDay(date);if(focus)requestAnimationFrame(()=>calendar.current?.querySelector<HTMLButtonElement>('[data-brief-date="'+date+'"]')?.focus())}
 return <div className="daily-brief-dialog">
  <div className="daily-history-controls">
   <div className="daily-history-week" ref={calendar} role="group" aria-label={week[0]+' 至 '+week[6]+' 简报日期选择'}>
    <button aria-label="上一周简报" onClick={()=>selectDay(addDays(day,-7))}><ChevronLeft size={16}/></button>
    <div>{week.map((date,index)=>{const available=dailyBriefArchive.some(brief=>brief.dateKey===date);return <button key={date} data-brief-date={date} aria-label={date+' 星期'+'一二三四五六日'[index]+(available?'，有简报':'')} aria-pressed={date===day} disabled={date>today} onClick={()=>selectDay(date)} onKeyDown={event=>{const next=event.key==='ArrowLeft'?addDays(date,-1):event.key==='ArrowRight'?addDays(date,1):event.key==='Home'?week[0]:event.key==='End'?(week[6]>today?today:week[6]):null;if(next){event.preventDefault();selectDay(next,true)}}}><span>{'一二三四五六日'[index]}</span><b>{Number(date.slice(8))}</b>{available&&<i aria-hidden="true"/>}</button>})}</div>
    <button aria-label="下一周简报" disabled={weekDates(addDays(day,7))[0]>today} onClick={()=>selectDay(addDays(day,7)>today?today:addDays(day,7))}><ChevronRight size={16}/></button>
   </div><p className="brief-dialog-note">红点表示当天有简报</p>
  </div>
  <div className="daily-history-scroll" ref={scroll}>{snapshot?<div className="daily-history-content"><DailyBriefCards brief={snapshot} onAction={onAction}/></div>:<div className="daily-history-empty"><p>该日期暂无历史简报</p><small>请选择带红点的日期查看。</small>{latest&&<button className="secondary-button" onClick={()=>selectDay(latest.dateKey,true)}>查看最近简报</button>}</div>}</div>
 </div>;
}
