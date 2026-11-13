import {useEffect,useState} from 'react';
import {saveLocal} from '../data';
import {canModifySchedule,occurrenceTimes,readScheduleEvents,scheduleEnded,scheduleKind,scheduleStorage,scheduleTitle,type ScheduleEvent} from '../schedule/data';
import RecordDetails,{RecordTags,type RecordField} from './RecordDetails';

export function useRecordNow(){const [now,setNow]=useState(Date.now);useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[]);return now}
export function ScheduleTags({event,date,now}:{event:ScheduleEvent;date?:string;now:number}){
 const ended=scheduleEnded(event,date,now),started=new Date(occurrenceTimes(event,date).start).getTime()<=now;
 return <RecordTags items={[{label:scheduleKind(event)==='meeting'?((event.mode==='线上'||!event.mode&&event.location.includes('线上'))?'线上会议':'线下会议'):scheduleKind(event)==='trip'?'出差':'事项'},{label:ended?'已完成':started?'进行中':'未开始',tone:ended?'success':started?'info':undefined}]}/>;
}
export function ScheduleRecord({event,date,children}:{event:ScheduleEvent;date?:string;children?:React.ReactNode}){
 const meeting=scheduleKind(event)==='meeting',times=occurrenceTimes(event,date);
 const fields:RecordField[]=[
  {label:'时间',value:times.start.replace('T',' ')+' 至 '+times.end.replace('T',' '),icon:'date'},
  {label:'发起人',value:event.creator||'张嘉嘉',icon:'person'},
  ...(meeting?[{label:'主持人',value:event.host||event.creator||'张嘉嘉',icon:'person'} as RecordField]:[]),
  {label:meeting?((event.mode==='线上'||!event.mode&&event.location.includes('线上'))?'会议链接':'会议地址'):scheduleKind(event)==='trip'?'途经及目的地':'地点',value:event.location||'未设置',icon:'location'},
  {label:meeting?'与会人员':'安排人员',value:event.participants.join('、')||'未添加',icon:'person'},
  ...(event.informed?.length?[{label:'告知人',value:event.informed.join('、'),icon:'person'} as RecordField]:[]),
  ...(!meeting&&event.content?[{label:'事件内容',value:event.content,icon:'details'} as RecordField]:[]),
  {label:'提前提醒',value:event.reminder.replace(/^提前/,'')||'未设置',icon:'reminder'},
  {label:'可见范围',value:event.visibility||'个人日程',icon:'visibility'},
  {label:'描述',value:event.description||event.notes||'未填写',icon:'details'},
 ];
 return <RecordDetails fields={fields}>{!!event.attachments?.length&&<div className="record-attachments"><p>附件</p><ul>{event.attachments.map(file=><li key={file.id}><a href={file.dataUrl} download={file.name}>{file.name}</a></li>)}</ul></div>}{children}</RecordDetails>;
}
export default function MeetingDetail({id,onClose,onEdit,onDeleted}:{id:string;onClose:()=>void;onEdit:(event:ScheduleEvent)=>void;onDeleted:()=>void}){
 const event=readScheduleEvents().find(item=>item.id===id);
 const [confirm,setConfirm]=useState(false),[error,setError]=useState('');
 const now=useRecordNow();
 if(!event)return <p className="empty-state">日程不存在或已删除</p>;
 const editable=canModifySchedule(event,undefined,now);
 function remove(){
  if(!event||!canModifySchedule(event)){setConfirm(false);setError('会议已结束，不能删除');return}
  if(!saveLocal(scheduleStorage,readScheduleEvents().filter(item=>item.id!==event.id))){setError('删除失败，请重试');return}
  onDeleted();
 }
 return <><ScheduleTags event={event} now={now}/><ScheduleRecord event={event}>
  {error&&<p role="alert" className="record-error">{error}</p>}
  {confirm&&editable&&<div className="record-confirm" role="group" aria-label="删除确认"><p>确定删除“{scheduleTitle(event)}”？</p><div className="record-footer"><button className="secondary-button" onClick={()=>setConfirm(false)}>取消</button><button className="primary-button" onClick={remove}>确认删除</button></div></div>}
  <footer className="record-footer">{editable&&!confirm&&<><button className="record-delete" onClick={()=>setConfirm(true)}>删除</button><button className="primary-button" onClick={()=>{if(canModifySchedule(event))onEdit(event);else setError('会议已结束，不能编辑')}}>编辑</button></>}<button className="secondary-button" onClick={onClose}>关闭</button></footer>
 </ScheduleRecord></>;
}
