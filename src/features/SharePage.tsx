import {useState} from 'react';
import {Check,ChevronRight,Heart,Users,Building2,X,FileText,Link} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import {enterpriseDepartments} from '../im/data';
import {Empty,FeatureSearch,FeatureShell,Mark,Sheet} from './UI';
import {queryFor,readRecipients,sendShare,type FeatureProps,type Recipient,type SharePayload} from './data';

type PickerProps={height:number;close:()=>void;notify:FeatureProps['notify'];payload?:SharePayload;initialSelected?:string[];onPick?:(ids:string[])=>void;onSent?:()=>void};
type View='recent'|'contacts'|'groups'|'followed'|'departments'|'department'|'group-members'|'selected';
export function RecipientPicker({height,close,notify,payload,initialSelected=[],onPick,onSent}:PickerProps){
 const all=readRecipients(),persons=all.filter(p=>!p.group),groups=all.filter(p=>p.group);
 const [view,setView]=useState<View>('recent'),[query,setQuery]=useState(''),[multiple,setMultiple]=useState(!!onPick),[selected,setSelected]=useState<string[]>(initialSelected.filter(id=>all.some(p=>p.id===id))),[target,setTarget]=useState(''),[confirm,setConfirm]=useState(false),[note,setNote]=useState(''),[error,setError]=useState('');
 const recentIds=readLocal<string[]>('share-recent',persons.slice(0,5).map(p=>p.id));const recent=recentIds.map(id=>all.find(p=>p.id===id)).filter((p):p is Recipient=>!!p);
 const followed=readLocal<string[]>('im2-followed',persons.slice(0,6).map(p=>p.id));
 const groupMembers=all.find(p=>p.id===target)?.members||[];
 const departments=[...new Set(enterpriseDepartments.map(d=>d.name))];
 function departmentPeople(name:string){const index=departments.indexOf(name);return persons.filter((p,i)=>p.job.includes(name)||i%departments.length===index)}
 const rows=view==='groups'?groups:view==='followed'?persons.filter(p=>followed.includes(p.id)):view==='department'?departmentPeople(target):view==='group-members'?persons.filter(p=>groupMembers.includes(p.id)):view==='selected'?all.filter(p=>selected.includes(p.id)):view==='contacts'?persons:all.slice(0,12);
 const filtered=query?all.filter(p=>(p.name+p.job).includes(query)||(p.members?.some(id=>all.find(person=>person.id===id)?.name.includes(query)))):rows;
 const title=view==='selected'?'已选择（'+selected.length+'）':view==='groups'?'我的群组':view==='followed'?'我的关注':view==='departments'?'组织机构':view==='department'?target:view==='group-members'?all.find(p=>p.id===target)?.name||'群成员':view==='contacts'?'选择联系人':multiple?'选择多个聊天':'选择联系人';
 function changeView(next:View,value=''){setView(next);setTarget(value);setQuery('')}
 function toggle(id:string){setSelected(values=>values.includes(id)?values.filter(value=>value!==id):[...values,id]);setError('')}
 function choose(person:Recipient){if(multiple||onPick)toggle(person.id);else{setSelected([person.id]);setConfirm(true)}}
 function back(){if(query){setQuery('');return}if(view==='recent'){close();return}if(view==='department')changeView('departments');else if(view==='group-members')changeView('groups');else if(['groups','followed','departments'].includes(view))changeView('contacts');else changeView('recent')}
 function next(){if(!selected.length)return;if(onPick)onPick(selected);else setConfirm(true)}
 function send(){if(!payload)return;const problem=sendShare(payload,selected,note);if(problem){setError(problem);return}saveLocal('share-recent',[...new Set([...selected,...recentIds])].slice(0,5));onSent?.();notify('已发送给'+selected.length+'个聊天')}
 function row(person:Recipient){return <div className="feature-row feature-recipient-row" key={person.id}>
  <button aria-label={(multiple?'选择':'发送给')+person.name} aria-pressed={multiple?selected.includes(person.id):undefined} onClick={()=>choose(person)}>
   {multiple&&<span className={'feature-check'+(selected.includes(person.id)?' is-checked':'')}>{selected.includes(person.id)&&<Check size={14}/>}</span>}
   <img className="feature-avatar" src={person.avatar} alt=""/><span><strong><Mark text={person.name} query={query}/></strong><small>{person.job}</small></span>
  </button>
  {view==='selected'?<button className="feature-icon-button" aria-label={'取消选择'+person.name} onClick={()=>toggle(person.id)}><X size={18}/></button>:person.group&&<button className="feature-icon-button" aria-label={'查看'+person.name+'成员'} onClick={()=>changeView('group-members',person.id)}><ChevronRight size={18}/></button>}
 </div>}
 return <FeatureShell title={title} height={height} back={back} className="feature-recipient-picker" right={view==='selected'?<button className="feature-text" onClick={()=>changeView('recent')}>完成</button>:['groups','followed','department','group-members','departments'].includes(view)&&multiple?<button className="feature-text" onClick={()=>{const ids=view==='departments'?persons.map(p=>p.id):rows.map(p=>p.id);setSelected(ids.every(id=>selected.includes(id))?selected.filter(id=>!ids.includes(id)):[...new Set([...selected,...ids])])}}>全选</button>:<button className="feature-text" onClick={()=>{if(onPick){close();return}setMultiple(!multiple);setSelected([])}}>{multiple?'取消':'多选'}</button>}
 footer={multiple?<><button className="feature-selected-count" aria-label="查看已选择联系人" onClick={()=>changeView('selected')}>已选择：<span>{selected.length}人／群</span></button><button className="feature-primary" disabled={!selected.length} onClick={next}>确定</button></>:undefined}>
  <FeatureSearch placeholder="搜索联系人或群组" value={query} onChange={setQuery}/>
  {!query&&view==='recent'&&<><p className="feature-section-label">最近转发</p><section className="feature-surface feature-recipient-grid">{recent.map(person=><button key={person.id} aria-label={'最近转发'+person.name} aria-pressed={multiple?selected.includes(person.id):undefined} onClick={()=>choose(person)}><img src={person.avatar} alt=""/>{multiple&&<span className={'feature-check'+(selected.includes(person.id)?' is-checked':'')}>{selected.includes(person.id)&&<Check size={12}/>}</span>}<small>{person.name}</small></button>)}</section>
   <section className="feature-surface"><button className="feature-row" onClick={()=>{setMultiple(true);changeView('contacts')}}><span>从通讯录选择</span><ChevronRight size={18}/></button></section><p className="feature-section-label">最近聊天</p></>}
  {!query&&view==='contacts'&&<section className="feature-surface">{[['followed','我的关注',Heart],['groups','我的群组',Users],['departments','企业通讯录',Building2]].map(([id,label,Icon])=>{const Component=Icon as typeof Heart;return <button className="feature-row" key={String(id)} onClick={()=>changeView(id as View)}><Component size={24}/><span>{String(label)}</span><ChevronRight size={18}/></button>})}</section>}
  {!query&&view==='department'&&<nav className="feature-breadcrumb"><button onClick={()=>changeView('departments')}>企业通讯录</button><ChevronRight size={14}/><span>{target}</span></nav>}
  {view==='departments'&&!query?<section className="feature-surface">{departments.map(name=>{const ids=departmentPeople(name).map(p=>p.id),checked=ids.length>0&&ids.every(id=>selected.includes(id));return <div className="feature-row feature-recipient-row" key={name}><button className="feature-icon-button" aria-label={'选择'+name} aria-pressed={checked} onClick={()=>setSelected(checked?selected.filter(id=>!ids.includes(id)):[...new Set([...selected,...ids])])}><span className={'feature-check'+(checked?' is-checked':'')}>{checked&&<Check size={14}/>}</span></button><button onClick={()=>changeView('department',name)}><span>{name} <small>{ids.length}人</small></span><ChevronRight size={18}/></button></div>})}</section>:<section className="feature-surface">{filtered.map(row)}{!filtered.length&&<Empty>{query?'未找到相关联系人或群组':'暂无可选内容'}</Empty>}</section>}
  {confirm&&payload&&<Sheet compact title="发送给" close={()=>{setConfirm(false);setError('')}} footer={<><button className="feature-secondary" onClick={()=>setConfirm(false)}>取消</button><button className="feature-primary" onClick={send}>发送</button></>}>
   <button className="feature-recipient-summary" onClick={()=>{setConfirm(false);setMultiple(true);changeView('selected')}}>{all.filter(p=>selected.includes(p.id)).map(person=><span className="feature-recipient-summary" key={person.id}><img className="feature-avatar" src={person.avatar} alt=""/>{person.name}</span>)}<ChevronRight size={18}/></button>
   <div className="feature-share-preview">{payload.kind==='image'&&payload.url?<img src={payload.url} alt={payload.title}/>:<><p>{payload.kind==='file'?<FileText size={20}/>:payload.kind==='link'?<Link size={20}/>:null}{payload.title}</p>{payload.text&&<p>{payload.text}</p>}{payload.kind==='link'&&payload.url&&<p>{payload.url}</p>}{payload.items&&<small>共 {payload.items.length} 项</small>}</>}</div>
   <label className="feature-field">留言<input aria-label="转发留言" maxLength={200} placeholder="留言（可选）" value={note} onChange={e=>setNote(e.target.value)}/></label>{error&&<p className="feature-error" role="alert">{error}</p>}
  </Sheet>}
 </FeatureShell>;
}

export default function SharePage({locationKey,height,navigate,notify}:FeatureProps){const query=queryFor(locationKey),returnTo=query.get('return')||'im',id=query.get('id')||'';const payload=readLocal<SharePayload|null>('share-payload-'+id,null);
 if(!payload)return <FeatureShell title="分享" height={height} back={()=>navigate(returnTo)}><Empty>分享内容已失效，请返回后重新选择。</Empty></FeatureShell>;
 return <RecipientPicker height={height} payload={payload} close={()=>navigate(returnTo)} notify={notify} onSent={()=>navigate(returnTo)}/>;
}
