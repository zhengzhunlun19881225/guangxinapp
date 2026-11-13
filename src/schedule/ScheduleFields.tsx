import {useRef,useState} from 'react';
import {contacts} from '../data';
import {scheduleKind,type ScheduleEvent,type ScheduleAttachment} from './data';
import {Icon,Sheet} from './ScheduleUi';

type Props={draft:ScheduleEvent;update:(value:Partial<ScheduleEvent>)=>void;onError:(message:string)=>void;onBusy:(busy:boolean)=>void};
export const reminderOptions=['不提醒','5分钟','10分钟','15分钟','30分钟','1小时'];
export default function ScheduleFields({draft,update,onError,onBusy}:Props){
 const meeting=scheduleKind(draft)==='meeting',trip=scheduleKind(draft)==='trip';
 const [picker,setPicker]=useState<'host'|'participants'|'informed'|''>(''),[search,setSearch]=useState(''),[chosen,setChosen]=useState<string[]>([]);
 const [adding,setAdding]=useState(false);
 const input=useRef<HTMLInputElement>(null),locations=useRef<Partial<Record<'线上'|'线下',string>>>({});
 const people=[...new Set(['张嘉嘉','上官成硕','李明浩','上官家家','李家家','李佳佳','张锐','王武','陈晓晓','张三',...contacts.map(person=>person.name),draft.host||'',...draft.participants,...(draft.informed||[])])].filter(Boolean);
 function openPicker(key:typeof picker){setPicker(key);setSearch('');setChosen(key==='host'?(draft.host?[draft.host]:[]):key==='participants'?draft.participants:draft.informed||[])}
 function personRow(key:'host'|'participants'|'informed',label:string,required=false){
  const value=key==='host'?draft.host:(draft[key]||[]).join('、');
  return <button type="button" className="schedule-field" aria-label={'选择'+label} aria-required={required} onClick={()=>openPicker(key)}><Icon name="UsersRound"/><span>{required&&<em className="schedule-required">*</em>}{label}</span><span className="schedule-field-value">{value||'请选择'}</span><Icon name="Plus" size={16}/></button>;
 }
 function select(label:string,icon:string,key:'reminder'|'visibility',options:string[]){return <label className="schedule-field"><Icon name={icon}/><span>{label}</span><select aria-label={label} value={draft[key]} onChange={event=>update({[key]:event.target.value})}>{options.map(option=><option key={option}>{option}</option>)}</select></label>}
 function textArea(label:string,key:'content'|'description',required=false){return <label className="schedule-field schedule-content-field"><span className="schedule-content-label"><Icon name="StickyNote"/>{required&&<em className="schedule-required">*</em>}{label}</span><textarea aria-label={label} aria-required={required} maxLength={200} rows={3} placeholder="请输入" value={draft[key]||''} onChange={event=>update({[key]:event.target.value})}/><small>{(draft[key]||'').length}/200</small></label>}
 async function addFiles(files:File[]){
  if(!files.length)return;
  setAdding(true);onBusy(true);
  try{
   const additions=await Promise.all(files.map(file=>new Promise<ScheduleAttachment>((resolve,reject)=>{
    const reader=new FileReader();reader.onload=()=>resolve({id:crypto.randomUUID(),name:file.name,size:file.size,dataUrl:String(reader.result)});reader.onerror=()=>reject(new Error('附件读取失败，请重试'));reader.readAsDataURL(file);
   })));
   update({attachments:[...(draft.attachments||[]),...additions]});
  }catch{onError('附件读取失败，请重试')}finally{setAdding(false);onBusy(false);if(input.current)input.current.value=''}
 }
 return <>
  <div className="schedule-title-field"><input aria-label={meeting?'会议名称':'事件名称'} aria-required="true" maxLength={20} placeholder={meeting?'请输入会议名称':'请输入事件名称'} value={draft.title} onChange={event=>update({title:event.target.value})}/><small>{draft.title.length}/20</small></div>
  <section className="schedule-form-group">
   {(['start','end'] as const).map(key=><label className="schedule-field" key={key}><Icon name="Clock"/><span><em className="schedule-required">*</em>{key==='start'?'开始时间':'结束时间'}</span><input aria-label={key==='start'?'开始时间':'结束时间'} aria-required="true" type={draft.allDay?'date':'datetime-local'} value={draft.allDay?draft[key].slice(0,10):draft[key]} onChange={event=>update({[key]:draft.allDay?event.target.value+'T'+(key==='start'?'00:00':'23:59'):event.target.value})}/></label>)}
   {meeting&&<>
    <label className="schedule-field"><Icon name="CalendarDays"/><span><em className="schedule-required">*</em>会议类型</span><select aria-label="会议类型" aria-required="true" value={draft.mode||'线下'} onChange={event=>{const mode=event.target.value as '线上'|'线下';locations.current[draft.mode||'线下']=draft.location;update({mode,location:locations.current[mode]||''})}}><option>线下</option><option>线上</option></select></label>
    <label className="schedule-field"><Icon name="MapPin"/><span>{draft.mode==='线上'?'会议链接':'会议地址'}</span><input aria-label={draft.mode==='线上'?'会议链接':'会议地址'} type={draft.mode==='线上'?'url':'text'} placeholder={draft.mode==='线上'?'请输入会议链接':'请输入会议地址'} value={draft.location} onChange={event=>update({location:event.target.value})}/></label>
    {personRow('host','主持人',true)}
   </>}
   {trip&&<label className="schedule-field"><Icon name="MapPin"/><span>地点</span><input aria-label="地点" value={draft.location} onChange={event=>update({location:event.target.value})}/></label>}
   {personRow('participants',meeting?'与会人':'安排他人',meeting)}
   {personRow('informed','告知人')}
   {!meeting&&!trip&&textArea('事件内容','content',true)}
   {select('提前提醒','Bell','reminder',reminderOptions)}
   {select('可见范围','UsersRound','visibility',['公开日程','个人日程'])}
   {textArea('描述','description')}
   <div className="schedule-attachment-field">
    <button type="button" className="schedule-field" disabled={adding} onClick={()=>input.current?.click()}><Icon name="StickyNote"/><span>上传附件</span><span className="schedule-field-value">{adding?'正在添加…':'点击上传文件'}</span><Icon name="Plus" size={16}/></button>
    <input hidden ref={input} aria-label="上传附件" type="file" multiple onChange={event=>void addFiles(Array.from(event.target.files||[]))}/>
    {!!draft.attachments?.length&&<ul className="schedule-attachments">{draft.attachments.map(file=><li key={file.id}><a href={file.dataUrl} download={file.name}>{file.name}<small>{file.size<1024?file.size+' B':Math.ceil(file.size/1024)+' KB'}</small></a><button type="button" aria-label={'移除附件'+file.name} onClick={()=>update({attachments:draft.attachments?.filter(item=>item.id!==file.id)})}><Icon name="X" size={16}/></button></li>)}</ul>}
   </div>
  </section>
  {picker&&<Sheet title={picker==='host'?'选择主持人':picker==='participants'?(meeting?'选择与会人':'安排他人'):'选择告知人'} close={()=>setPicker('')}>
   <label className="schedule-search"><Icon name="Search" size={18}/><input aria-label="搜索人员" placeholder="输入姓名搜索" value={search} onChange={event=>setSearch(event.target.value)}/></label>
   <div className="schedule-participants">{people.filter(name=>name.includes(search.trim())).map(name=><label key={name}><input type={picker==='host'?'radio':'checkbox'} name="schedule-person" checked={chosen.includes(name)} onChange={()=>setChosen(picker==='host'?[name]:chosen.includes(name)?chosen.filter(person=>person!==name):[...chosen,name])}/><span>{name}</span></label>)}{!people.some(name=>name.includes(search.trim()))&&<p className="schedule-empty">未找到相关人员</p>}</div>
   <div className="schedule-sheet-actions"><span>已选择 {chosen.length} 人</span><button type="button" onClick={()=>{update(picker==='host'?{host:chosen[0]||''}:{[picker]:chosen});setPicker('')}}>确定</button></div>
  </Sheet>}
 </>;
}
