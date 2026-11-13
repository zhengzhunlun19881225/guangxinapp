import {useEffect,useRef,useState,type CSSProperties,type FormEvent} from 'react';
import {assets} from '../assets';
import {saveLocal} from '../data';
import {Icon,Sheet} from './ScheduleUi';
import CloseButton from '../components/CloseButton';
import ScheduleFields from './ScheduleFields';
import {addDays,canModifySchedule,readScheduleEvents,scheduleKind,scheduleTitle,blankEvent,editDraft,dateKey,dateLabel,dayLabel,eventsOn,parseDate,scheduleStorage,todayKey,timelineLayout,validDate,type ScheduleEvent} from './data';
import './schedule.css';
import {ScheduleRecord,ScheduleTags,useRecordNow} from '../components/MeetingDetail';

type Props={route:string;locationKey:string;height:number;navigate:(path:string)=>void;notify:(message:string)=>void};

export default function SchedulePages({route,locationKey,height,navigate,notify}:Props){
 const query=new URLSearchParams(locationKey.split('?')[1]||'');
 const date=validDate(query.get('date'))?query.get('date')!:todayKey();
 const view=query.get('view')==='day'?'day':'month';
 const [events,setEvents]=useState<ScheduleEvent[]>(readScheduleEvents);
 const selected=events.find(event=>event.id===query.get('id'));
 const newKind=query.get('kind')==='meeting'?'meeting':'event';
 const [draft,setDraft]=useState<ScheduleEvent>(()=>selected?editDraft(selected):blankEvent(date,newKind));
 const [uploading,setUploading]=useState(false);
 const addButton=useRef<HTMLButtonElement>(null),addMenu=useRef<HTMLDivElement>(null);
 const [panel,setPanel]=useState(''),[searching,setSearching]=useState(false),[search,setSearch]=useState('');
 const [error,setError]=useState('');
 const body=useRef<HTMLDivElement>(null);
 const editing=route==='schedule-new',detail=route==='schedule-detail';
 const recordNow=useRecordNow(),canEditSelected=!selected||canModifySchedule(selected,date,recordNow);
 useEffect(()=>{
  setPanel('');setError('');setSearching(false);setSearch('');
  if(editing)setDraft(selected?editDraft(selected):blankEvent(date,newKind));
  body.current?.scrollTo(0,0);
 },[locationKey]);
 function go(next='schedule',extra:Record<string,string>={}){navigate(next+'?'+new URLSearchParams({date,view,...extra}).toString())}
 function openEvent(event:ScheduleEvent){go('schedule-detail',{id:event.id})}
 function update(change:Partial<ScheduleEvent>){setDraft(previous=>({...previous,...change}));setError('')}
 function save(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const form=event.currentTarget;
  const fail=(message:string,name?:string)=>{setError(message);if(name)form.querySelector<HTMLElement>(`[aria-label="${name}"]`)?.focus()};
  if(selected&&!canModifySchedule(selected,date)){fail('会议已结束，不能编辑');return}
  if(uploading){fail('附件正在添加，请稍候');return}
  const meeting=scheduleKind(draft)==='meeting';
  if(!draft.title.trim()){fail(meeting?'请输入会议名称':'请输入事件名称',meeting?'会议名称':'事件名称');return}
  if(draft.title.length>20){fail('名称不能超过20个字',meeting?'会议名称':'事件名称');return}
  if(!draft.start||!draft.end||draft.end<=draft.start){fail('结束时间须晚于开始时间','结束时间');return}
  if(meeting&&!draft.host?.trim()){fail('请选择主持人','选择主持人');return}
  if(meeting&&!draft.participants.length){fail('请选择与会人','选择与会人');return}
  if(!meeting&&scheduleKind(draft)==='event'&&!draft.content?.trim()){fail('请输入事件内容','事件内容');return}
  if((draft.content?.length||0)>200||(draft.description?.length||0)>200){fail('内容和描述不能超过200个字');return}
  if(meeting&&draft.mode==='线上'&&draft.location&&!/^https?:\/\//i.test(draft.location)){fail('会议链接须以http://或https://开头','会议链接');return}
  const item={...draft,title:draft.title.trim(),notes:draft.description||'',id:draft.id||'event-'+Date.now()};
  const next=[...events.filter(entry=>entry.id!==item.id),item];
  if(!saveLocal(scheduleStorage,next)){fail('本机保存失败，附件可能过大，请减少附件后重试');return}
  setEvents(next);go('schedule',{date:item.start.slice(0,10),view:'day'});notify(draft.id?'日程已更新':'日程已保存');
 }
 function remove(){
  if(selected&&!canModifySchedule(selected,date)){setPanel('');setError('会议已结束，不能删除');return}
  const next=events.filter(event=>event.id!==selected?.id);
  if(!saveLocal(scheduleStorage,next)){setError('删除失败，请重试');return}
  setEvents(next);go();notify('日程已删除');
 }
 const daily=eventsOn(events,date),display=parseDate(date),first=new Date(display.getFullYear(),display.getMonth(),1);
 const monthStart=dateKey(new Date(first.getFullYear(),first.getMonth(),1-first.getDay()));
 const preview=daily.length>3?[daily[0],daily[Math.floor(daily.length/2)],daily[daily.length-1]]:daily;
 const count=Math.ceil((first.getDay()+new Date(display.getFullYear(),display.getMonth()+1,0).getDate())/7)*7;
 const weekStart=addDays(date,-display.getDay());
 const filtered=events.filter(event=>event.title.includes(search)||event.location.includes(search)||event.notes.includes(search)||(event.content||'').includes(search)||(event.description||'').includes(search)).sort((a,b)=>a.start.localeCompare(b.start));
 const dayEvents=daily.filter(event=>!event.allDay),allDayEvents=daily.filter(event=>event.allDay);
 const now=new Date(),nowHour=now.getHours()+now.getMinutes()/60;
 const nowVisible=date===todayKey()&&nowHour>=8&&nowHour<=21;
 function entry(event:ScheduleEvent){return <button key={event.id} className={'schedule-agenda-entry schedule-color-'+event.color} onClick={()=>openEvent(event)}>
  <span className="schedule-event-dot"/><div><p><time>{event.allDay?'全天':event.start.slice(11,16)}</time><strong>{event.title}</strong></p>
   <small>{event.allDay?'全天日程':event.end.slice(11,16)}<span>{event.location||'未设置地点'}</span></small></div>
 </button>}
 function shiftMonth(delta:number){
  const target=new Date(display.getFullYear(),display.getMonth()+delta,1);
  const last=new Date(target.getFullYear(),target.getMonth()+1,0).getDate();
  target.setDate(Math.min(display.getDate(),last));go('schedule',{date:dateKey(target)});
 }
 useEffect(()=>{
  if(panel!=='add')return;
  addMenu.current?.querySelector<HTMLButtonElement>('button')?.focus();
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){setPanel('');addButton.current?.focus()}};
  document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
 },[panel]);
 return <section className={'schedule-flow schedule-'+(editing?'editor':detail?'detail':view)} style={{height}} aria-label={editing?(scheduleKind(draft)==='meeting'?'新建会议':'新建日程'):detail?'日程详情':'我的日程'}>
  <div className="schedule-status"><span>19:41</span><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
  {editing&&!canEditSelected?<div className="schedule-scroll"><p className="schedule-empty">会议已结束，不能编辑</p><button className="secondary-button" onClick={()=>go('schedule-detail',{id:selected!.id})}>返回详情</button></div>:editing?<form className="schedule-form" noValidate onSubmit={save}>
   <header className="schedule-form-header"><button type="button" className="schedule-cancel" onClick={()=>go()}>取消</button><h1>{draft.id?(scheduleKind(draft)==='meeting'?'编辑会议':'编辑日程'):(scheduleKind(draft)==='meeting'?'新建会议':'新建日程')}</h1><button className="schedule-save" type="submit" disabled={uploading}>保存</button></header>
   {error&&<p className="schedule-error" role="alert">{error}</p>}
   <div className="schedule-editor-body">
    <ScheduleFields draft={draft} update={update} onError={setError} onBusy={setUploading}/>
   </div>
  </form>:detail?<>
   <header className="schedule-detail-header"><button aria-label="返回日程" onClick={()=>go()}><Icon name="ChevronLeft" size={24}/></button><h1>日程详情</h1></header>
   <div className="schedule-scroll" ref={body}>{selected?<article className="schedule-event-detail">
    <h2 className="schedule-record-title">{scheduleTitle(selected)}</h2><ScheduleTags event={selected} date={date} now={recordNow}/>
    <ScheduleRecord event={selected} date={date}>
     <p className="schedule-record-calendar">{selected.calendar} · {selected.repeat}</p>
     {error&&<p className="schedule-error" role="alert">{error}</p>}
     <footer className="record-footer">{canEditSelected&&<><button className="schedule-delete record-delete" onClick={()=>setPanel('delete')}>删除日程</button><button className="primary-button" onClick={()=>go('schedule-new',{id:selected.id})}>编辑</button></>}<button className="secondary-button" onClick={()=>go()}>关闭</button></footer>
    </ScheduleRecord>
   </article>:<p className="schedule-empty">日程不存在或已删除</p>}</div>
  </>:<>
   <header className="schedule-header"><CloseButton aria-label="关闭日程" onClick={()=>navigate('workbench')}/>
    {view==='month'?<div className="schedule-month-navigation"><button aria-label="上一个月" onClick={()=>shiftMonth(-1)}><Icon name="ChevronLeft" size={18}/></button><h1 className="schedule-date-title" aria-live="polite">{display.getFullYear()}年{display.getMonth()+1}月</h1><button aria-label="下一个月" onClick={()=>shiftMonth(1)}><Icon name="ChevronRight" size={18}/></button></div>:<div className="schedule-date-title">{dateLabel(date)}<small>{dayLabel(date)}</small></div>}
    {view==='month'&&<button aria-label="搜索日程" aria-expanded={searching} onClick={()=>{setSearching(!searching);setSearch('')}}><Icon name="Search" size={23}/></button>}
    <button aria-label={view==='month'?'切换到日视图':'切换到月历'} onClick={()=>go('schedule',{view:view==='month'?'day':'month'})}><Icon name="CalendarDays" size={23}/></button>
    {view==='day'&&<button aria-label="更多日程操作" aria-expanded={panel==='menu'} onClick={()=>setPanel(panel==='menu'?'':'menu')}><Icon name="MoreHorizontal" size={23}/></button>}
   </header>
   <div className="schedule-scroll" ref={body}>
    {searching?<div className="schedule-search-results"><label className="schedule-search"><Icon name="Search" size={18}/><input autoFocus aria-label="搜索日程" placeholder="搜索标题、地点或备注" value={search} onChange={event=>setSearch(event.target.value)}/></label>
     {search.trim()?filtered.length?filtered.map(event=><div key={event.id}><p className="schedule-search-date">{event.start.slice(0,10)}</p>{entry(event)}</div>):<p className="schedule-empty">未找到相关日程</p>:<p className="schedule-empty">输入关键词查找日程</p>}
    </div>:view==='month'?<>
     <div className="schedule-month-calendar" style={{height:height*.4,'--month-day-size':Math.min(34,Math.max(18,(height*.4-48)/(count/7)-7))+'px'} as CSSProperties}>
     <div className="schedule-week-labels">{['日','一','二','三','四','五','六'].map(day=><span key={day}>{day}</span>)}</div>
     <div className="schedule-month-grid">{Array.from({length:count},(_,index)=>{
      const key=addDays(monthStart,index),cell=parseDate(key),items=eventsOn(events,key);
      return <button data-date={key} aria-label={`${cell.getFullYear()}年${cell.getMonth()+1}月${cell.getDate()}日`} aria-pressed={key===date} key={key} className={(cell.getMonth()!==display.getMonth()?'schedule-outside ':'')+(key===date?'schedule-selected':'')} onClick={()=>go('schedule',{date:key})}>
       <span>{cell.getDate()}</span><i className="schedule-date-dots" aria-hidden="true">{items.slice(0,1).map((event,index)=><b className={'schedule-color-'+(key===date?'blue':event.color)} key={index}/>)}</i>
      </button>;
     })}</div>
     </div>
     <section className="schedule-agenda"><header><button onClick={()=>go('schedule',{view:'day'})}>{dateLabel(date)} <small>{dayLabel(date)}</small></button><button aria-label="查看当天全部日程" onClick={()=>go('schedule',{view:'day'})}>全部({daily.length})</button></header>
      {daily.length?preview.map(entry):<p className="schedule-empty">当天暂无日程，点击右下角新建</p>}
     </section>
    </>:<>
     <div className="schedule-week-labels">{['日','一','二','三','四','五','六'].map(day=><span key={day}>{day}</span>)}</div>
     <div className="schedule-week-days">{Array.from({length:7},(_,index)=>{const key=addDays(weekStart,index);return <button key={key} data-date={key} aria-label={dateLabel(key)} aria-pressed={key===date} onClick={()=>go('schedule',{date:key})}><span>{parseDate(key).getDate()}</span></button>})}</div>
     {allDayEvents.length>0&&<div className="schedule-all-day"><small>全天</small><div>{allDayEvents.map(entry)}</div></div>}
     <div className="schedule-timeline" style={{height:13*42+16}}>
      {Array.from({length:14},(_,index)=><div className="schedule-hour" style={{top:12+index*42}} key={index}><time>{String(index+8).padStart(2,'0')}:00</time><span/></div>)}
      {timelineLayout(dayEvents,date).map(({event,from,height:cardHeight,lane,columns})=>{
       const fraction=lane/columns;
       return <button key={event.id} className={'schedule-timeline-event schedule-color-'+event.color} style={{top:12+(from-8)*42,height:cardHeight,left:`calc(${fraction*100}% + ${58-58*fraction}px)`,width:`calc(${100/columns}% - ${58/columns+(columns>1?4:0)}px)`,right:'auto'}} onClick={()=>openEvent(event)}><p><time>{event.start.slice(11,16)}</time> <strong>{event.title}</strong></p><small>{event.location||'未设置地点'}</small>{event.reminder!=='不提醒'&&<Icon name="Bell" size={12}/>}</button>;
      })}
      {nowVisible&&<div className="schedule-now" style={{top:12+(nowHour-8)*42}}><time>{now.toTimeString().slice(0,5)}</time><span/></div>}
     </div>
     {dayEvents.some(event=>event.start.slice(11,16)<'08:00'||event.start.slice(11,16)>='21:00')&&<section className="schedule-off-hours"><h2>其他时段</h2>{dayEvents.filter(event=>event.start.slice(11,16)<'08:00'||event.start.slice(11,16)>='21:00').map(entry)}</section>}
    </>}
   </div>
   <button ref={addButton} className="schedule-add" aria-label="添加日程" aria-haspopup="menu" aria-expanded={panel==='add'} onClick={()=>setPanel(panel==='add'?'':'add')}><Icon name="Plus" size={29}/></button>
  </>}
  <div className="schedule-home"><div className="home-indicator"/></div>
  {panel==='menu'&&<><button className="schedule-menu-dismiss" aria-label="关闭日程菜单" onClick={()=>setPanel('')}/><div className="schedule-menu"><button onClick={()=>go('schedule',{view:'month'})}>月历视图</button><button onClick={()=>go('schedule',{date:todayKey()})}>回到今天</button><button onClick={()=>{setPanel('');setSearching(true)}}>搜索日程</button></div></>}
  {panel==='add'&&<><button className="schedule-menu-dismiss schedule-add-dismiss" aria-label="关闭添加菜单" onClick={()=>{setPanel('');addButton.current?.focus()}}/><div className="schedule-menu schedule-add-menu" role="menu" aria-label="添加日程" ref={addMenu}><button role="menuitem" onClick={()=>go('schedule-new',{kind:'event'})}><Icon name="CalendarDays" size={18}/>新建日程</button><button role="menuitem" onClick={()=>go('schedule-new',{kind:'meeting'})}><Icon name="UsersRound" size={18}/>新建会议</button></div></>}
  {panel==='delete'&&<Sheet title="删除日程" close={()=>setPanel('')}><p className="schedule-delete-message">确定删除“{selected?.title}”？</p>{error&&<p className="schedule-error" role="alert">{error}</p>}<div className="schedule-sheet-actions"><button onClick={()=>setPanel('')}>取消</button><button className="schedule-danger" onClick={remove}>删除</button></div></Sheet>}
 </section>;
}
