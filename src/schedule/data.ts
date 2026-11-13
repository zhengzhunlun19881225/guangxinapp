import {readLocal} from '../data';
export type ScheduleAttachment={id:string;name:string;size:number;dataUrl:string};
export type ScheduleEvent={
 id:string;title:string;start:string;end:string;allDay:boolean;
 repeat:string;reminder:string;location:string;participants:string[];notes:string;calendar:string;color:string;
 kind?:'meeting'|'event'|'trip';creator?:string;host?:string;visibility?:string;completed?:boolean;mode?:'线下'|'线上';informed?:string[];content?:string;description?:string;attachments?:ScheduleAttachment[];
};
export const scheduleRoutes=['schedule','schedule-new','schedule-detail'];
export const scheduleTitles:Record<string,string>={'schedule':'我的日程','schedule-new':'新建日程','schedule-detail':'日程详情'};
export const scheduleStorage='schedule-events-v1';
export const workbenchSchedules=[
 {title:'【线下会议】关于集团2026年调研实施方案的讨论',status:'已完成',owner:'上官成硕',locationLabel:'地址',location:'3楼会议室',color:'green',end:'10:00'},
 {title:'【事项】高级职位候选人面试',status:'未开始',owner:'上官成硕',locationLabel:'',location:'',color:'blue',end:'10:00'},
 {title:'【出差】到深圳参加集团2026年调研实施方案',status:'未开始',owner:'上官成硕',locationLabel:'途经及目的地',location:'深圳',color:'purple',end:'18:00'},
];
export function dateKey(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
export const todayKey=()=>dateKey(new Date());
export function scheduleKind(event:ScheduleEvent){return event.kind||(event.title.includes('会议')||event.title.includes('例会')||event.title.includes('周会')?'meeting':event.title.startsWith('【出差】')?'trip':'event')}
export function scheduleTitle(event:ScheduleEvent){return event.title.replace(/^【[^】]+】/,'')}
export function occurrenceTimes(event:ScheduleEvent,date=event.start.slice(0,10)){
 if(event.repeat==='不重复'||date===event.start.slice(0,10)||!occursOn(event,date))return {start:event.start,end:event.end};
 const days=Math.round((parseDate(event.end).getTime()-parseDate(event.start).getTime())/86400000);
 return {start:date+event.start.slice(10),end:addDays(date,days)+event.end.slice(10)};
}
export function scheduleEnded(event:ScheduleEvent,date?:string,now=Date.now()){return event.completed===true||new Date(occurrenceTimes(event,date).end).getTime()<=now}
export function canModifySchedule(event:ScheduleEvent,date?:string,now=Date.now()){return scheduleKind(event)!=='meeting'||!scheduleEnded(event,date,now)}
export function readScheduleEvents(){
 const samples=seedEvents();
 return readLocal<ScheduleEvent[]>(scheduleStorage,samples).map(event=>{
  const sample=samples.find(item=>item.id===event.id);
  return sample?{...sample,...event,kind:event.kind||sample.kind,creator:event.creator||sample.creator,host:event.host||sample.host,visibility:event.visibility||sample.visibility}:event;
 });
}
export function parseDate(value:string){return new Date(value.slice(0,10)+'T12:00:00')}
export function validDate(value:string|null){return !!value&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(parseDate(value).getTime())&&dateKey(parseDate(value))===value}
export function addDays(value:string,days:number){const date=parseDate(value);date.setDate(date.getDate()+days);return dateKey(date)}
export function dateLabel(value:string){const date=parseDate(value);return `${date.getMonth()+1}月${date.getDate()}日`}
export function dayLabel(value:string){return value===todayKey()?'今天':'周'+['日','一','二','三','四','五','六'][parseDate(value).getDay()]}
export function blankEvent(date:string,kind:'event'|'meeting'='event'):ScheduleEvent {
 return {id:'',title:'',start:date+'T09:00',end:date+'T10:00',allDay:false,repeat:'不重复',reminder:'10分钟',location:'',participants:[],notes:'',calendar:'我的日历',color:'blue',kind,creator:'张嘉嘉',mode:'线下',host:'',informed:[],content:'',description:'',attachments:[],visibility:'公开日程'};
}
export function editDraft(event:ScheduleEvent):ScheduleEvent {
 const kind=scheduleKind(event);
 return {...blankEvent(event.start.slice(0,10)),...event,kind,title:scheduleTitle(event),mode:event.mode||(event.location.includes('线上')?'线上':'线下'),host:event.host||event.creator||'',reminder:event.reminder.replace(/^提前/,''),content:event.content||event.notes,description:event.description||event.notes};
}
export function occursOn(event:ScheduleEvent,date:string){
 const start=event.start.slice(0,10),end=event.end.slice(0,10);
 if(date>=start&&date<=end)return true;
 if(date<start)return false;
 const original=parseDate(start),target=parseDate(date);
 return event.repeat==='每天'||event.repeat==='每周'&&original.getDay()===target.getDay()||event.repeat==='每月'&&original.getDate()===target.getDate();
}
export function eventsOn(events:ScheduleEvent[],date:string){return events.filter(event=>occursOn(event,date)).sort((a,b)=>Number(b.allDay)-Number(a.allDay)||a.start.slice(11).localeCompare(b.start.slice(11)))}
export function timelineLayout(events:ScheduleEvent[],date:string){
 const items=events.map(event=>{
  const start=event.start.slice(0,10)<date&&event.repeat==='不重复'?0:Number(event.start.slice(11,13))+Number(event.start.slice(14,16))/60;
  const end=event.end.slice(0,10)>date&&event.repeat==='不重复'?24:Number(event.end.slice(11,13))+Number(event.end.slice(14,16))/60;
  const from=Math.max(8,start),duration=Math.min(21,end)-from,height=Math.max(46,duration*42-3);
  return {event,from,duration,height,until:from+height/42,lane:0,columns:1};
 }).filter(item=>item.duration>0).sort((a,b)=>a.from-b.from);
 let group:typeof items=[],ends:number[]=[],groupEnd=0;
 const finish=()=>{group.forEach(item=>item.columns=ends.length);group=[];ends=[]};
 for(const item of items){
  if(item.from>=groupEnd)finish();
  let lane=ends.findIndex(end=>end<=item.from);if(lane<0)lane=ends.length;
  ends[lane]=item.until;item.lane=lane;group.push(item);groupEnd=Math.max(groupEnd,item.until);
 }
 finish();return items;
}
export function seedEvents():ScheduleEvent[]{
 const dates=[...new Set(['2024-05-15',todayKey()])];
 const rows:ScheduleEvent[]=[];
 for(const date of dates){
  const examples=date===todayKey()?workbenchSchedules.map(event=>[event.title,'09:00',event.end,event.location,event.color]):[['团队周会','09:30','10:30','会议室 A','amber'],['设计评审','11:00','12:00','线上会议','blue'],['产品需求评审','13:30','14:30','线上会议','purple'],['健身','18:30','19:30','Keep 健身房','green']];
  examples.forEach(([title,start,end,location,color],index)=>rows.push({...blankEvent(date),id:`sample-${date}-${index}`,title,start:date+'T'+start,end:date+'T'+end,location,color,kind:(title.includes('会议')||title.includes('例会')||title.includes('周会')?'meeting':'event'),
   ...(date===todayKey()?{kind:(index===0?'meeting':index===2?'trip':'event') as ScheduleEvent['kind'],creator:'上官成硕',host:'上官成硕',participants:['张嘉嘉'],visibility:'公开日程',completed:index===0,notes:index===0?'讨论调研计划、责任分工与下一步安排。':index===1?'准备面试材料，并与面试团队确认安排。':'确认调研行程及出行安排。'}:{})}));
  for(const day of [1,2,3,5,6,7,8,9,10,11,12,13,14,16,17,19,20,21,22,23,24,26,27,28,29,30,31]){
   const key=date.slice(0,8)+String(day).padStart(2,'0');
   if(!validDate(key)||dates.includes(key))continue;
   rows.push({...blankEvent(key),id:'sample-'+key,title:['项目进度沟通','周工作例会','业务协同会议'][day%3],kind:day%3===0?'event':'meeting',location:'会议室 B',color:['muted','green','purple'][day%3]});
  }
 }
 return rows.filter((event,index)=>rows.findIndex(item=>item.id===event.id)===index);
}
