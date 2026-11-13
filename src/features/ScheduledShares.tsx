import {useState} from 'react';
import {ChevronDown,ChevronUp,Plus,RotateCw,Users} from 'lucide-react';
import {saveLocal} from '../data';
import {Empty,FeatureShell,Sheet} from './UI';
import {dateKey,generateDocument,queryFor,readRecipients,readScheduledShares,uid,type FeatureProps,type ScheduledShare} from './data';
import {RecipientPicker} from './SharePage';

const dayNames=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
function emptyShare(prompt=''):ScheduledShare{const now=new Date(),end=new Date(now);end.setMonth(end.getMonth()+3);return{id:uid(),prompt,title:'',content:'',frequency:'每月',days:[1,2,3,4,5],time:'12:30',start:dateKey(now),end:dateKey(end),recipients:[],createdAt:now.toISOString()}}
export default function ScheduledShares({locationKey,height,navigate,notify}:FeatureProps){
 const query=queryFor(locationKey),[items,setItems]=useState(readScheduledShares),[draft,setDraft]=useState<ScheduledShare|null>(()=>query.get('new')==='1'?emptyShare(query.get('prompt')||''):null),[start,setStart]=useState(''),[end,setEnd]=useState(''),[error,setError]=useState(''),[expanded,setExpanded]=useState(true),[daysOpen,setDaysOpen]=useState(false),[dayDraft,setDayDraft]=useState<number[]>([]),[pick,setPick]=useState(false),[deleteId,setDeleteId]=useState('');
 const recipients=readRecipients();const visible=items.filter(item=>(!start||item.createdAt.slice(0,10)>=start)&&(!end||item.createdAt.slice(0,10)<=end));
 function update(change:Partial<ScheduledShare>){setDraft(value=>value?{...value,...change}:null);setError('')}
 function generate(){if(!draft?.prompt.trim()){setError('请输入提示词内容');return}const generated=generateDocument('统计报告',draft.prompt);update({title:generated.title,content:generated.content});setExpanded(true)}
 function save(){if(!draft)return;if(!draft.prompt.trim()){setError('请输入提示词内容');return}if(!draft.start||!draft.time||draft.frequency!=='单次'&&!draft.end){setError('请补齐推送时间和日期');return}if(draft.frequency!=='单次'&&draft.end<draft.start){setError('结束日期不能早于开始日期');return}if(draft.frequency==='每周'&&!draft.days.length){setError('请至少选择一个星期');return}if(!draft.recipients.length){setError('请选择推送对象');return}if(!draft.content.trim()){setError('请先生成并核对分享内容');return}const next=[draft,...items.filter(item=>item.id!==draft.id)];if(!saveLocal('scheduled-shares',next)){setError('保存失败，请保留填写内容并重试');return}setItems(next);setDraft(null);notify('分享计划已保存')}
 if(pick&&draft)return <RecipientPicker height={height} close={()=>setPick(false)} notify={notify} initialSelected={draft.recipients} onPick={ids=>{update({recipients:ids});setPick(false)}}/>;
 return <FeatureShell title="定时分享管理" height={height} back={()=>navigate(query.get('return')||'chat')} right={<button aria-label="新建定时分享" onClick={()=>{setDraft(emptyShare());setError('')}}><Plus size={22}/></button>}>
  <div className="feature-date-range"><input type="date" aria-label="筛选开始日期" value={start} onChange={e=>setStart(e.target.value)}/><span>至</span><input type="date" aria-label="筛选结束日期" min={start} value={end} onChange={e=>setEnd(e.target.value)}/></div>
  {start&&end&&end<start?<p className="feature-error" role="alert">结束日期不能早于开始日期</p>:null}
  <p className="feature-note">计划保存在此设备，自动推送需由企业服务启用。</p>
  {visible.map(item=><div key={item.id}><p className="feature-section-label">{item.createdAt.slice(0,10)===dateKey(new Date())?'今天':item.createdAt.slice(0,10)}</p><article className="feature-surface feature-schedule-card"><h2>{item.title}</h2><dl><dt>分享类型：</dt><dd>{item.frequency==='单次'?'单次':'重复'}</dd><dt>分享频率：</dt><dd>{item.frequency}{item.frequency==='每周'?' · '+item.days.map(day=>dayNames[day-1]).join('、'):''}</dd><dt>推送时间：</dt><dd>{item.time}</dd><dt>日期：</dt><dd>{item.start}{item.frequency!=='单次'?' 至 '+item.end:''}</dd><dt>创建人：</dt><dd>唐学文</dd><dt>推送对象：</dt><dd>{item.recipients.map(id=>recipients.find(p=>p.id===id)?.name||'已失效对象').join('、')}</dd></dl><footer><button onClick={()=>setDeleteId(item.id)}>删除</button><button onClick={()=>{setDraft({...item});setError('')}}>修改</button></footer></article></div>)}
  {!visible.length&&<section className="feature-surface"><Empty>{items.length?'此日期范围没有分享计划':'暂无定时分享，点击右上角新建。'}</Empty></section>}
  {draft&&<Sheet title="定时分享" close={()=>{setDraft(null);setError('')}} footer={<button className="feature-primary" onClick={save}>保存</button>}>
   <div className="feature-form">
    <label>提示词内容<input aria-label="提示词内容" maxLength={200} placeholder="例如：统计年度财务报表" value={draft.prompt} onChange={e=>update({prompt:e.target.value})}/></label>
    <label>推送频率<select aria-label="推送频率" value={draft.frequency} onChange={e=>update({frequency:e.target.value})}>{['单次','每天','每周','每月'].map(value=><option key={value}>{value}</option>)}</select></label>
    {draft.frequency==='每周'&&<label>选择星期<button className="feature-field-trigger" aria-label="选择星期" onClick={()=>{setDayDraft(draft.days);setDaysOpen(true)}}>{draft.days.length?draft.days.map(day=>dayNames[day-1]).join('、'):'请选择星期'}<ChevronDown size={16}/></button></label>}
    <label>推送时间<input type="time" aria-label="推送时间" value={draft.time} onChange={e=>update({time:e.target.value})}/></label>
    <label>{draft.frequency==='单次'?'推送日期':'开始日期'}<input type="date" aria-label="开始日期" value={draft.start} onChange={e=>update({start:e.target.value})}/></label>
    {draft.frequency!=='单次'&&<label>结束日期<input type="date" aria-label="结束日期" min={draft.start} value={draft.end} onChange={e=>update({end:e.target.value})}/></label>}
    <label>推送对象<button className="feature-field-trigger" onClick={()=>setPick(true)} aria-label="选择推送对象"><span>{draft.recipients.length?'已选择 '+draft.recipients.length+' 人／群':'请选择联系人或群组'}</span><Users size={18}/></button></label>
    <div className="feature-edit-tools"><button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{expanded?'收起':'展开'}{expanded?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</button><button className="feature-text" onClick={generate}><RotateCw size={16}/>{draft.content?'重新生成':'生成内容'}</button></div>
    {expanded&&<label>分享内容<textarea aria-label="分享内容" placeholder="生成后可在此核对和修改内容" rows={7} value={draft.content} onChange={e=>update({content:e.target.value})}/></label>}
    <p className="feature-note">生成结果为模板草稿，请核对资料与实际数据后保存。</p>{error&&<p className="feature-error" role="alert">{error}</p>}
   </div>
  </Sheet>}
  {daysOpen&&draft&&<Sheet title="选择星期" close={()=>setDaysOpen(false)} footer={<><button className="feature-secondary" onClick={()=>setDayDraft([])}>重置</button><button className="feature-primary" disabled={!dayDraft.length} onClick={()=>{update({days:[...dayDraft].sort()});setDaysOpen(false)}}>确定</button></>}><div className="feature-weekdays">{dayNames.map((day,index)=><button key={day} aria-pressed={dayDraft.includes(index+1)} onClick={()=>setDayDraft(values=>values.includes(index+1)?values.filter(value=>value!==index+1):[...values,index+1])}>{day}</button>)}</div></Sheet>}
  {deleteId&&<Sheet compact title="删除分享计划" close={()=>setDeleteId('')} footer={<><button className="feature-secondary" onClick={()=>setDeleteId('')}>取消</button><button className="feature-primary" onClick={()=>{const next=items.filter(item=>item.id!==deleteId);if(!saveLocal('scheduled-shares',next)){notify('删除失败，请重试');return}setItems(next);setDeleteId('');notify('分享计划已删除')}}>删除</button></>}><p>确定删除此分享计划？</p></Sheet>}
 </FeatureShell>;
}
