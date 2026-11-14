import {readWorkbenchTasks,type TaskKind} from '../data/workbenchTasks';
import {readImConversations} from '../im/conversations';
import {readScheduleEvents,scheduleEnded,todayKey} from '../schedule/data';
import {useEffect,useLayoutEffect,useState,useRef,type FormEvent} from 'react';
import {ArrowRight,BellOff,Camera,ChevronDown,CirclePlus,Mic,Pin,Plus} from 'lucide-react';
import AppNavBar from './AppNavBar';
import {imageFor, mascot, agents, skills, conversations, contacts, questions,readLocal,saveLocal} from '../data';
import type {Action} from './SceneAction';

export function Asset({node, className='', alt=''}:{node:string;className?:string;alt?:string}) {
  const src=imageFor(node);
  return src ? <img src={src} alt={alt} className={className} draggable={false}/> : null;
}
export function Search({value,onChange,placeholder='搜索',className='',onSearch}:{
  value:string;onChange:(s:string)=>void;placeholder?:string;className?:string;onSearch?:()=>void}) {
  return <div className={'search-control '+className}>
    {onSearch?<button aria-label="搜索全部联系人、群组和聊天记录" onClick={onSearch}><Asset node="0:6068" className="search-icon"/></button>:<Asset node="0:6068" className="search-icon"/>}<input aria-label={placeholder}
      placeholder={placeholder} value={value} onFocus={()=>onSearch?.()} onKeyDown={e=>{if(e.key==='Enter')onSearch?.()}} onChange={e=>onChange(e.target.value)}/>
    {value && <button aria-label="清空搜索" onClick={()=>onChange('')}>×</button>}
  </div>;
}
export function Directory({kind,onAction}:{kind:'agents'|'skills';onAction:(a:Action)=>void}) {
  const [search,setSearch]=useState(''); const [tab,setTab]=useState('全部');
  const tabs=kind==='agents'?['全部','自己创建','常用','热门','默认']:['全部','常用','热门','法务','数据分析'];
  const data=(kind==='agents'?agents:skills).filter(x=>(tab==='全部'||x.type===tab)&&x.name.toLowerCase().includes(search.toLowerCase()));
  return <>
    <div className="segmented header-toggle" role="tablist" aria-label="智能体与技能">
      {(['agents','skills'] as const).map((v,i)=><button key={v} role="tab" aria-selected={kind===v}
        onClick={()=>onAction({type:'navigate',value:v})}>{i===0?'智能体':'技能'}</button>)}
    </div>
    <Search value={search} onChange={setSearch} className="directory-search"/>
    <section className="directory native-card" aria-label={kind==='agents'?'智能体列表':'技能列表'}>
      <div className="directory-tabs" role="tablist">{tabs.map(t=><button key={t} role="tab"
        aria-selected={tab===t} onClick={()=>setTab(t)}>{t}</button>)}</div>
      <div className="directory-items">{data.map(item=><button className="directory-row" key={item.name}
        onClick={()=>onAction({type:'agent',value:item.name})}>
        <span className={'app-icon '+item.color}><Asset node={item.icon}/></span>
        <span className="directory-info"><strong>{item.name}</strong><span>{item.intro}</span>
          <small><span aria-hidden>♟</span> 2万+ · @广新集团</small></span>
      </button>)}</div>
      {!data.length && <div className="empty-state"><img src={mascot} alt=""/><p>{search?'未找到相关内容':'暂无自己创建的智能体'}</p>
        <button className="text-link" onClick={()=>{setSearch('');setTab('全部')}}>查看全部</button></div>}
    </section>
  </>;
}
export function MessagingList({kind,onAction}:{kind:'im'|'contacts';onAction:(a:Action)=>void}) {
  const [search,setSearch]=useState('');
  const conversationRows=readImConversations();
  const [read,setRead]=useState<string[]>(()=>readLocal('im2-read',[]));
  return <>
    <AppNavBar className="app-messaging-navbar" label="IM 顶部导航" title={<div className="segmented" role="tablist" aria-label="消息与通讯录">
      {(['im','contacts'] as const).map((v,i)=><button key={v} role="tab" aria-selected={kind===v}
        onClick={()=>onAction({type:'navigate',value:v})}>{i===0?'IM':'通讯录'}</button>)}
    </div>} right={<button className="im-add" aria-label="创建群" onClick={()=>onAction({type:'navigate',value:'im-create-group?'+new URLSearchParams({origin:kind,from:'plus'}).toString()})}><CirclePlus size={22}/></button>}/>
    <Search value={search} onChange={setSearch} className="im-search" onSearch={()=>onAction({type:'navigate',value:'im-search-all?'+new URLSearchParams({origin:kind,q:search})})}/>
    {kind==='im' ? <section className="im-list native-card" aria-label="会话列表">
      {conversationRows.map((c,index)=>({...c,index})).filter(c=>c.name.includes(search)||c.preview.includes(search)).map(c=>
        <button key={c.index} className={'conversation-row'+(c.pinned?' is-pinned':'')} onClick={()=>{const next=[...new Set([...read,c.key])];setRead(next);saveLocal('im2-read',next);onAction({type:'conversation',value:c.name})}}>
          <span className="avatar-wrap">{c.avatar?<img src={c.avatar} className="im-avatar" alt=""/>:c.node?<Asset node={c.node} className="im-avatar"/>:<img src="/assets/im/member-0.png" className="im-avatar" alt=""/>}
            {c.unread>0&&!read.includes(c.key)&&!c.quiet&&<span className="badge">{c.unread}</span>}</span>
          <span className="conversation-info"><strong>{c.name}</strong><span>{c.preview}</span></span>
          <time>{c.time}<span className="conversation-flags">{c.pinned&&<Pin size={12} aria-label="已置顶"/>}{c.quiet&&<BellOff size={12} aria-label="免打扰"/>}</span></time>
        </button>)}
      {search&&!conversationRows.some(c=>c.name.includes(search)||c.preview.includes(search))&&<p className="empty-state">没有找到会话</p>}
    </section> : <div className="contacts-content">
      {!search && <section className="contact-company native-card">
        <button onClick={()=>onAction({type:'list',value:'我的群组'})}><span className="company-icon"><Asset node="0:5770"/></span><span>我的群组</span><i>›</i></button>
        <button onClick={()=>onAction({type:'list',value:'企业通讯录'})}><span className="company-icon"><Asset node="0:5787"/></span>
          <span>企业通讯录<small>广东省广新控股集团有限公司</small></span><i>›</i></button>
        <button className="company-child" onClick={()=>onAction({type:'list',value:'广新集团'})}>└ 广新集团<i>›</i></button>
      </section>}
      <p className="contacts-label">{search?'搜索结果':'最近联系人'}</p>
      <section className="contacts-list native-card">{contacts.filter(c=>c.name.includes(search)).map(c=><div className="contact-row" key={c.name}>
        <button className="contact-person" onClick={()=>onAction({type:'conversation',value:c.name})}><Asset node={c.node} className="contact-avatar"/><span>{c.name}</span></button>
        <button aria-label={'发消息给'+c.name} onClick={()=>onAction({type:'conversation',value:c.name})}><Asset node="0:5849"/></button>
        <button aria-label={'呼叫'+c.name} onClick={()=>onAction({type:'call',value:c.name})}><Asset node="0:5827"/></button>
      </div>)}
      {!contacts.some(c=>c.name.includes(search))&&<p className="empty-state">没有找到联系人</p>}</section>
    </div>}
  </>;
}
export function Suggestions({onAction,history=[]}:{onAction:(a:Action)=>void;history?:string[]}) {
  const [tab,setTab]=useState('热门问答');
  const rows=(tab==='最近记录'?history:questions).slice(0,3);
  return <section className="chat-suggestions native-card" data-kind={tab==='最近记录'?'recent':'popular'}>
    <div className="suggestion-tabs" role="tablist" aria-label="AI 首页推荐">{['最近记录','热门问答'].map(t=><button role="tab" aria-selected={tab===t} key={t} className={tab===t?'selected':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
    {rows.map((q,i)=><button className="suggestion-row" key={q+i} onClick={()=>onAction({type:'question',value:q})}>
      <span>{i+1}.</span><span>{q}</span></button>)}
    {!rows.length&&<p className="small-empty">暂无最近记录</p>}
  </section>;
}
export function Todo({onAction}:{onAction:(a:Action)=>void}) {
  const [tab,setTab]=useState<TaskKind>('pending');
  const tasks=readWorkbenchTasks(),pendingCount=tasks.filter(task=>task.kind==='pending').length,rows=tasks.filter(task=>task.kind===tab);
  return <section className="work-todo native-card"><header><h2>统一待办</h2><button onClick={()=>onAction({type:'list',value:'统一待办'})}>更多 ›</button></header>
    <div className="todo-tabs" role="tablist" aria-label="待办分类">{(['pending','completed','messages'] as const).map(kind=><button key={kind} role="tab" aria-selected={tab===kind} onClick={()=>setTab(kind)}><span className="app-pill-label">{kind==='pending'?'待办('+pendingCount+')':kind==='completed'?'已办':'消息'}</span></button>)}</div>
    {rows.slice(0,3).map(task=><button className="todo-row" key={task.id} onClick={()=>onAction({type:task.kind==='pending'?'approve':'todo-detail',value:task.id})}
      ><strong>[系统来源] {task.title}</strong><span>发起人 <Asset node="0:6867"/> {task.author}　时间 {task.time}</span></button>)}
    {!rows.length&&<p className="small-empty">暂无{tab==='messages'?'消息':tab==='completed'?'已办事项':'待办事项'}</p>}
  </section>;
}
export function FeatureCards({onAction}:{onAction:(a:Action)=>void}){
  const carousel=useRef<HTMLDivElement>(null),scrollTimer=useRef<number|undefined>(undefined),[scrollLeft,setScrollLeft]=useState(30),[scrolling,setScrolling]=useState(false);
  const step=137;
  const items=[
    {name:'财务自动差旅',description:'一句话提交出差申请单',node:'0:5343',color:'#006dff'},
    {name:'法智小新',description:'解法规，答操作',node:'0:5312',color:'#722ed1'},
    {name:'制作PPT',description:'从需求到方案一键生成完整方案',node:'0:5327',color:'#ff7d00'},
    {name:'AI+员工服务',description:'一句话提交请假、加班申请',node:'0:5298',color:'#ff0000'}];
  useLayoutEffect(()=>{carousel.current?.scrollTo({left:30,behavior:'auto'})},[]);
  useEffect(()=>()=>{if(scrollTimer.current!==undefined)window.clearTimeout(scrollTimer.current)},[]);
  const cardStyle=(index:number)=>{const center=16+64.5+index*step,offset=(center-(scrollLeft+187.5))/step,curve=Math.max(-1.65,Math.min(1.65,offset)),distance=Math.min(1.5,Math.abs(curve)),verticalOffset=Math.max(0,distance*22-4);return {transform:`translateY(${verticalOffset}px) scale(${1-distance*.1}) rotate(${curve*8}deg)`,zIndex:String(20-Math.round(distance*10))}};
  const handleScroll=(event:React.UIEvent<HTMLDivElement>)=>{
    const element=event.currentTarget;
    setScrollLeft(Math.max(0,Math.min(element.scrollWidth-element.clientWidth,element.scrollLeft)));setScrolling(true);
    if(scrollTimer.current!==undefined)window.clearTimeout(scrollTimer.current);
    scrollTimer.current=window.setTimeout(()=>setScrolling(false),160);
  };
  return <div ref={carousel} className={'feature-carousel'+(scrolling?' is-scrolling':'')} aria-label="AI 功能卡片" onScroll={handleScroll}>
    {items.map((x,index)=><button className="feature-card" style={cardStyle(index)} key={x.name} onClick={()=>onAction({type:'agent',value:x.name})}>
      {x.node==='0:5343'?<img src="/assets/chat/document-card.png" alt=""/>:x.node==='0:5312'?<img src="/assets/chat/legal-card.png" alt=""/>:<Asset node={x.node}/>}<h3>{x.name}</h3><b style={{background:x.color}}/>
      <p>{x.description}</p><span className="feature-arrow"><ArrowRight size={18} strokeWidth={1.5}/></span>
    </button>)}
  </div>;
}
export function Calendar({onAction}:{onAction:(a:Action)=>void}) {
  const [day,setDay]=useState(24), [week,setWeek]=useState(0);
  const days=[20,21,22,23,24,25];
  const entries=readScheduleEvents().filter(event=>event.id.startsWith('sample-'+todayKey()+'-'));
  return <section className="work-calendar native-card"><header><h2>我的日程</h2><button onClick={()=>onAction({type:'navigate',value:'schedule'})}>更多 ›</button></header>
    <div className="week-strip"><button aria-label="上一周" onClick={()=>setWeek(week-1)}>‹</button>
      {days.map((d,i)=><button className={day===d+week*7?'current':''} key={d} onClick={()=>setDay(d+week*7)}>
        <small>{['一','二','三','四','五','六'][i]}</small><span>{d+week*7===24?'今':((d+week*7-1)%30+30)%30+1}</span></button>)}
      <button aria-label="下一周" onClick={()=>setWeek(week+1)}>›</button></div>
    <div className="work-schedule-list">{(day===24?entries:[]).map(entry=><button key={entry.id} className="calendar-event work-schedule-entry" title={entry.title} onClick={()=>onAction({type:'meeting-detail',value:entry.id})}>
      <div className="work-schedule-title"><time>{entry.start.slice(11,16)}</time><strong>{entry.title}</strong></div>
      <div className="work-schedule-meta"><span className={'work-schedule-status '+(scheduleEnded(entry)?'is-complete':'')}>{scheduleEnded(entry)?'已完成':new Date(entry.start).getTime()<=Date.now()?'进行中':'未开始'}</span><span>发起人</span><Asset node="0:6868"/><b>{entry.creator||'上官成硕'}</b>{entry.location&&<><span>{entry.kind==='trip'?'途经及目的地':'地址'}</span><b>{entry.location}</b></>}</div>
    </button>)}{day!==24&&<p className="work-schedule-empty">当天暂无日程</p>}</div>
  </section>;
}
export {default as Composer} from './Composer';
