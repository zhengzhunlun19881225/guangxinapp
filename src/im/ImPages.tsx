import {useEffect,useRef,useState,type CSSProperties,type FormEvent,type ReactNode} from 'react';
import {Camera,FileText,Folder} from 'lucide-react';
import {assets} from '../assets';
import {readLocal,saveLocal,imageFor,conversations} from '../data';
import CloseButton from '../components/CloseButton';
import AppNavBar,{NavBackIcon,NavMoreIcon} from '../components/AppNavBar';
import {people,meetingPeople,initialMembers,initialGroups,initialMessages,defaultSettings,imAsset,imTitles,enterpriseDepartments,type Person,type Group,type ChatMessage,type ChatSettings,type Schedule} from './data';
import {startShare,download} from '../features/data';
import './im-pages.css';
import ImPreferences from './ImPreferences';
import {isGroupMuted} from './conversations';

type Props={route:string;locationKey:string;height:number;navigate:(route:string)=>void;notify:(text:string)=>void};
type SelectionPurpose='create'|'whitelist'|'add'|'remove'|'meeting';
function Icon({name,size=22}:{name:string;size?:number}){return <span aria-hidden="true" className="im2-icon" style={{width:size,height:size,maskImage:`url(/assets/im/${name}.svg)`} as CSSProperties}/>}
function Avatar({person,size=40}:{person:Pick<Person,'name'|'avatar'>;size?:number}){return <img className="im2-avatar" src={person.avatar} alt={person.name} style={{width:size,height:size}}/>}
function Toggle({label,checked,onChange}:{label:string;checked:boolean;onChange:(next:boolean)=>void}){return <button type="button" className="im2-switch" role="switch" aria-label={label} aria-checked={checked} onClick={()=>onChange(!checked)}><span/></button>}
function Dialog({title,close,children}:{title:string;close:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDivElement>(null);
 const closeRef=useRef(close);closeRef.current=close;
 useEffect(()=>{const prev=document.activeElement as HTMLElement;ref.current?.querySelector<HTMLElement>('button,input')?.focus();const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')closeRef.current();if(e.key==='Tab'){const items=Array.from(ref.current?.querySelectorAll<HTMLElement>('button,input')||[]);if(!items.length)return;const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',handler);return()=>{document.removeEventListener('keydown',handler);prev?.focus()}},[]);
 return <div className="im2-overlay" onClick={e=>{if(e.target===e.currentTarget)close()}}><div ref={ref} className="im2-dialog app-close-surface" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><CloseButton onClick={close}/></header>{children}</div></div>;
}
export default function ImPages({route,locationKey,height,navigate,notify}:Props){
 const query=new URLSearchParams(locationKey.split('?')[1]||'');
 const name=query.get('name')||'石梁雅';
 const groupId=query.get('group')||'';
 const department=query.get('department')||'';
 const origin=query.get('origin')==='profile'&&['im-preferences','im-account','im-login','im-scan'].includes(route)?'profile':query.get('origin')==='contacts'?'contacts':'im';
 const [groups,setGroups]=useState<Group[]>(()=>readLocal('im2-groups',initialGroups));
 const group=groups.find(g=>g.id===groupId);
 const entity=group?.name||name;
 const storageKey=group?'group-'+group.id:'person-'+name;
 const [settingsStore,setSettingsStore]=useState<Record<string,ChatSettings>>(()=>readLocal('im2-settings',{}));
 const settings={...defaultSettings,...settingsStore[storageKey]};
 const [messageStore,setMessageStore]=useState<Record<string,ChatMessage[]>>(()=>readLocal('im2-messages',{}));
 const messages=messageStore[storageKey]||initialMessages;
 const person:Person=people.find(p=>p.name===name)||initialMembers.find(p=>p.name===name)||{id:name,name,job:'广东省广新控股集团有限公司',avatar:imageFor(conversations.find(c=>c.name===name)?.node||'0:5819')||imAsset('chat-avatar')};
 const [search,setSearch]=useState(''),[draft,setDraft]=useState(''),[groupTab,setGroupTab]=useState('joined');
 const [panel,setPanel]=useState(''),[selected,setSelected]=useState<string[]>([]),[selectionSheet,setSelectionSheet]=useState(false);
 const [schedule,setSchedule]=useState<Schedule>(settings.schedule),[groupName,setGroupName]=useState(entity);
 const [meetingMembers,setMeetingMembers]=useState<string[]>(()=>readLocal('im2-meeting-members',meetingPeople.slice(0,9).map(p=>p.id)));
 const [mic,setMic]=useState(true),[camera,setCamera]=useState(false),[meetingId,setMeetingId]=useState(''),[meetingActive,setMeetingActive]=useState(false);
 const [imagePreview,setImagePreview]=useState(''),[confirmation,setConfirmation]=useState(''),[error,setError]=useState('');
 const [scanResult,setScanResult]=useState('');
 const body=useRef<HTMLDivElement>(null),fileInput=useRef<HTMLInputElement>(null),scanInput=useRef<HTMLInputElement>(null);
 const purpose=(query.get('purpose')||'create') as SelectionPurpose;
 useEffect(()=>{if(route==='im-select'&&purpose==='create')navigate('im-create-group?'+new URLSearchParams({origin,from:query.get('from')||'groups'}))},[route,purpose]);
 const pickerPeople=purpose==='remove'?(group?.members||[]):purpose==='meeting'?meetingPeople:people.slice(0,7);
 function persistGroups(next:Group[]){if(!saveLocal('im2-groups',next)){notify('群组设置保存失败，请重试');return false}setGroups(next);return true}
 function updateSettings(change:Partial<ChatSettings>){const next={...settingsStore,[storageKey]:{...settings,...change}};if(!saveLocal('im2-settings',next)){notify('设置保存失败，请重试');return false}setSettingsStore(next);return true}
 function path(next:string,extra:Record<string,string>={}){const q=new URLSearchParams({name,origin,...(query.get('return')?{return:query.get('return')!}:{}),...(groupId?{group:groupId}:{}),...(query.get('from')==='groups'?{from:'groups'}:{}),...extra});return next+'?'+q.toString()}
 function go(next:string,extra:Record<string,string>={}){navigate(path(next,extra))}
 function openGroup(g:Group,from='groups'){navigate('im-chat?'+new URLSearchParams({group:g.id,name:g.name,origin,from}).toString())}
 useEffect(()=>{setSearch('');setPanel('');setDraft('');setError('');setSelectionSheet(false);body.current?.scrollTo(0,0);if(route==='im-schedule')setSchedule(settings.schedule);if(route==='im-group-name')setGroupName(entity);if(route==='im-select')setSelected(purpose==='whitelist'?settings.whitelist:purpose==='meeting'?meetingMembers:[]);if(route==='im-meeting'||route==='im-join')setMeetingActive(false);if(route==='im-chat')requestAnimationFrame(()=>{const target=query.get('highlight');if(target)Array.from(body.current?.querySelectorAll<HTMLElement>('[data-message-id]')||[]).find(el=>el.dataset.messageId===target)?.scrollIntoView({block:'center'});else body.current?.scrollTo(0,0)});},[locationKey]);
 function back(){
  if(route==='im-chat'&&query.get('return'))navigate(query.get('return')!);
  else if(route==='im-account')go('im-preferences');
  else if(route==='im-preferences'||route==='im-login')navigate(origin);
  else if(route==='im-chat'&&query.get('from')==='groups')go('im-groups');
  else if(route==='im-enterprise'&&department)navigate('im-enterprise?'+new URLSearchParams({origin}).toString());
  else if(route==='im-chat'||route==='im-groups'||route==='im-enterprise'||route==='im-scan')navigate(origin);
  else if(route==='im-settings')go('im-chat');
  else if(route==='im-whitelist'||route==='im-schedule')go('im-mute');
  else if(route==='im-mute'||route==='im-group-name'||route==='im-members')go('im-settings');
  else if(route==='im-select'&&purpose==='create'&&query.get('from')==='plus')navigate(origin);
  else if(route==='im-select')purpose==='create'?go('im-groups'):purpose==='whitelist'?go('im-whitelist'):purpose==='meeting'?go('im-meeting'):go('im-settings');
  else if(route==='im-profile')query.get('from')==='directory'?go('im-enterprise'):go('im-settings');
  else go('im-chat');
 }
 function toggleSelected(id:string){if(!selected.includes(id)&&purpose==='create'&&selected.length>=499){notify('群聊最多 500 人（包含自己）');return}setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])}
 function confirmSelection(){
  if(purpose==='whitelist'){if(updateSettings({whitelist:selected}))go('im-whitelist')}
  else if(purpose==='meeting'){if(!saveLocal('im2-meeting-members',selected)){notify('参会人员保存失败，请重试');return}setMeetingMembers(selected);go('im-meeting')}
  else if(purpose==='add'||purpose==='remove'){
   if(group){const next=purpose==='add'?[...group.members,...people.filter(p=>selected.includes(p.id)&&!group.members.some(m=>m.id===p.id))]:group.members.filter(p=>!selected.includes(p.id)||p.id===group.members[0]?.id);if(!persistGroups(groups.map(g=>g.id===group.id?{...g,members:next}:g)))return}go('im-settings');notify(purpose==='add'?'群成员已添加':'群成员已移除')
  }else{
   if(!selected.length)return;const members=people.filter(p=>selected.includes(p.id));const newGroup:Group={id:'group-'+Date.now(),name:members.slice(0,3).map(p=>p.name).join('、')+'的群聊',created:true,members:[{id:'self',name:'我',job:'群主',avatar:imAsset('self-avatar')},...members],avatar:imAsset('group-0')};if(!persistGroups([...groups,newGroup]))return;openGroup(newGroup,query.get('from')==='plus'?'plus':'groups');notify('群聊已创建')
  }
 }
 function sendMessage(e?:FormEvent,text=draft,image?:string){e?.preventDefault();if(settings.blocked){notify('请先在聊天设置中解除拉黑');return}const now=new Date();if(groupId&&isGroupMuted(settings)&&!settings.whitelist.includes('self')){notify('当前群内已禁言，仅群主和白名单可发言');return}if(!text.trim()&&!image)return;const next={...messageStore,[storageKey]:[...messages,{id:crypto.randomUUID(),side:'out' as const,text:image?undefined:text.trim(),image,read:false,time:new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(now)}]};if(!saveLocal('im2-messages',next)){notify('消息未保存，请重试');return}setMessageStore(next);setDraft('');setPanel('');requestAnimationFrame(()=>body.current?.scrollTo({top:body.current.scrollHeight,behavior:'smooth'}))}
 function saveSchedule(){
  if(schedule.repeat&&!schedule.days.length){setError('请至少选择一天');return}
  if(!schedule.start||!schedule.end){setError('请选择开始和结束时间');return}
  if(schedule.repeat?schedule.start.slice(11)>=schedule.end.slice(11):schedule.start>=schedule.end){setError('结束时间须晚于开始时间');return}
  if(!updateSettings({schedule,mute:'scheduled'}))return;go('im-mute');notify('定时禁言已保存')
 }
 const title=route==='im-preferences'&&origin==='profile'?'设置':route==='im-chat'?entity:route==='im-select'?(purpose==='whitelist'?'添加成员':purpose==='remove'?'移除群成员':'选择群聊人员'):imTitles[route];
 const wideStatus=['im-chat','im-settings','im-meeting','im-join'].includes(route);
 const visibleGroups=groups.filter(g=>!g.left&&!g.disbanded&&(groupTab==='joined'||g.created)&&g.name.includes(search));
 const hasFooter=route==='im-chat'||route==='im-select'||route==='im-meeting';
 const memberForId=(id:string)=>meetingPeople.find(p=>p.id===id)||initialMembers.find(p=>p.id===id);
 function row(label:string,onClick:()=>void,value?:string){return <button className="im2-row" onClick={onClick}><span>{label}</span><span className="im2-row-value">{value}<Icon name="ChevronRight" size={17}/></span></button>}
 function switchRow(label:string,value:boolean,change:(v:boolean)=>void){return <div className="im2-row"><span>{label}</span><Toggle label={label} checked={value} onChange={change}/></div>}
 return <section className={'im2-flow im2-'+route} style={{height}} aria-label={title}>
  <div className={'im2-status'+(wideStatus?' im2-status-wide':'')}><span>{wideStatus?'9:41':'19:41'}</span><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
  <AppNavBar className="im2-header" title={title} left={<button className={'im2-back '+(route==='im-select'&&purpose!=='whitelist'||route==='im-schedule'?'im2-text-button':'')} aria-label={route==='im-select'?'取消选择':'返回'} onClick={back}>{route==='im-select'&&purpose!=='whitelist'||route==='im-schedule'?'取消':<NavBackIcon/>}</button>} right={
   route==='im-chat'?<button aria-label="聊天设置" onClick={()=>go('im-settings')}><NavMoreIcon/></button>:
    route==='im-groups'?<button aria-label="创建群" onClick={()=>navigate('im-create-group?'+new URLSearchParams({origin,from:'groups'}))}><Icon name="UserRoundPlus"/></button>:
    route==='im-whitelist'?<button className="im2-text-button" onClick={()=>go('im-select',{purpose:'whitelist'})}>添加成员</button>:
    route==='im-schedule'?<button className="im2-text-button" onClick={saveSchedule}>完成</button>:
    route==='im-group-name'?<button className="im2-text-button" disabled={!groupName.trim()} onClick={()=>{if(group&&!persistGroups(groups.map(g=>g.id===group.id?{...g,name:groupName.trim()}:g)))return;go('im-settings');notify('群聊名称已保存')}}>保存</button>:undefined}/>
  <div className={'im2-body '+(hasFooter?'im2-has-footer':'')} ref={body}>
   {['im-preferences','im-account','im-login'].includes(route)&&<ImPreferences key={route} route={route} go={next=>next==='im'?navigate(origin):go(next)} notify={notify} logout={()=>setConfirmation('退出登录')}/>}

   {route==='im-chat'&&<div className="im2-messages">{messages.map(m=><div key={m.id} data-message-id={m.id} style={query.get('highlight')===m.id?{background:'#fff0ed',borderRadius:12}:undefined}>
    {m.time&&<p className="im2-message-time">{m.time}</p>}
    <div className={'im2-message im2-'+m.side}><Avatar person={m.side==='in'?{name:entity,avatar:group?group.members[1]?.avatar||person.avatar:person.avatar}:{name:'我',avatar:imAsset('self-avatar')}} size={32}/>
      <div className="im2-message-main">{m.side==='in'&&<small>{group?group.members[1]?.name||entity:entity}</small>}
       {m.attachment?<button className="im2-bubble" onClick={()=>download(m.attachment!.url,m.attachment!.name)}><FileText size={20}/>{m.attachment.name}</button>:m.image?<button aria-label="查看聊天图片" onClick={()=>setImagePreview(m.image!)}><img className="im2-chat-photo" src={m.image} alt="聊天图片"/></button>:<p className="im2-bubble">{m.text?.includes('https://')?m.text.split(/(https:\/\/[^\s]+)/g).map((part,index)=>part.startsWith('https://')?<a key={index} href={part} target="_blank" rel="noreferrer">{part}</a>:part):m.text}</p>}
       <button className="im2-message-forward" aria-label={'转发消息'+m.id} onClick={()=>startShare(m.attachment?{kind:'file',title:m.attachment.name,url:m.attachment.url}:m.image?{kind:'image',title:'聊天图片',url:m.image}:m.text?.startsWith('https://')?{kind:'link',title:'分享链接',url:m.text}:{kind:'text',title:'分享消息',text:m.text||''},path('im-chat'),navigate)}>转发</button>
       {m.side==='out'&&<small className={m.read?'im2-read':'im2-unread'}>{m.read?'已读':'未读'}</small>}
      </div>
    </div></div>)}</div>}
   {route==='im-groups'&&<><div className="im2-search"><Icon name="Search" size={15}/><input aria-label="搜索群组" placeholder="搜索" value={search} onChange={e=>setSearch(e.target.value)}/></div>
    <div className="im2-card im2-group-list"><div className="im2-tabs" role="tablist" aria-label="群组分类">{[['joined','我加入的'],['created','我创建的']].map(([id,label])=><button key={id} role="tab" aria-selected={groupTab===id} onClick={()=>setGroupTab(id)}>{label}</button>)}</div>
    {visibleGroups.filter(g=>g.id!=='original').map(g=><button className="im2-person-row" key={g.id} onClick={()=>openGroup(g)}><Avatar person={{name:g.name,avatar:g.avatar}} size={46}/><span>{g.name} ({g.members.length})</span><img className="im2-group-chat-icon" src={imageFor('0:5849')} alt=""/></button>)}
    {!visibleGroups.filter(g=>g.id!=='original').length&&<p className="im2-empty-text">{search?'未找到相关群组':'暂无群组，点击右上角创建'}</p>}</div></>}
   {route==='im-settings'&&<>
    <section className={'im2-card '+(group?'im2-group-settings':'')}>
     <button className="im2-person-row" onClick={()=>group?go('im-group-name'):go('im-profile')}><Avatar person={group?{name:entity,avatar:group.avatar}:person} size={46}/><span><strong>{entity}</strong>{!group&&<small>原昵称：{person.nickname||entity}</small>}</span>{!group&&<Icon name="ChevronRight" size={17}/>}</button>
     {group&&<><h2>群成员</h2><div className="im2-members-grid">{group.members.slice(0,10).map(p=><button key={p.id} onClick={()=>navigate('im-profile?'+new URLSearchParams({name:p.name,group:group.id,origin}).toString())}><Avatar person={p}/><small>{p.name}</small></button>)}
      <button aria-label="添加群成员" onClick={()=>go('im-select',{purpose:'add'})}><span className="im2-member-action"><Icon name="Plus" size={27}/></span></button>
      {group.created&&<button aria-label="移除群成员" onClick={()=>go('im-select',{purpose:'remove'})}><span className="im2-member-action"><Icon name="Minus" size={27}/></span></button>}</div>
      <button className="im2-more-members" onClick={()=>go('im-members')}>查看更多群员</button></>}
    </section>
    {group&&<section className="im2-card">{row('群聊名称',()=>go('im-group-name'),entity)}</section>}
    <section className="im2-card">{group&&row('群内禁言',()=>go('im-mute'))}{row('聊天记录',()=>go('im-chat-search'))}{row('聊天文件',()=>go('im-chat-files'))}{row('图片及视频',()=>go('im-media'))}{row('转发聊天记录',()=>startShare({kind:'history',title:entity+'的聊天记录',text:messages.map(m=>(m.side==='out'?'我':entity)+'：'+(m.text||'[图片]')).join('\n')},path('im-chat'),navigate))}
     {switchRow('置顶聊天',settings.pinned,v=>updateSettings({pinned:v}))}{switchRow('消息免打扰',settings.quiet,v=>updateSettings({quiet:v}))}</section>
    <section className="im2-card im2-danger">{group?<><button onClick={()=>setConfirmation('退出群聊')}>退出群聊</button>{group.created&&<button onClick={()=>setConfirmation('解散群聊')}>解散群聊</button>}</>:<button onClick={()=>setConfirmation(settings.blocked?'解除拉黑':'拉黑')}>{settings.blocked?'解除拉黑':'拉黑'}</button>}</section>
   </>}
   {route==='im-mute'&&<><p className="im2-label">意见反馈</p><section className="im2-card">{([['off','未开启禁言'],['always','始终禁言'],['scheduled','定时禁言']] as const).map(([id,label])=><div className="im2-row im2-mute-option" key={id}>
    <button role="radio" aria-checked={settings.mute===id} onClick={()=>{if(id==='scheduled')go('im-schedule');else updateSettings({mute:id})}}>{label}{id==='scheduled'&&<Icon name="Settings" size={15}/>}</button>
    {settings.mute===id&&<Icon name="Check" size={21}/>}</div>)}</section>
    <p className="im2-help">禁言后，只允许群主和白名单发言</p><p className="im2-label im2-label-space">设置禁言时允许发言</p><section className="im2-card">{row('白名单',()=>go('im-whitelist'),settings.whitelist.length?settings.whitelist.length+'人':'未设置')}</section>
   </>}
   {route==='im-whitelist'&&<><div className="im2-search"><Icon name="Search" size={15}/><input placeholder="搜索" aria-label="搜索白名单" value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {settings.whitelist.length?<section className="im2-card">{people.filter(p=>settings.whitelist.includes(p.id)&&p.name.includes(search)).map(p=><div className="im2-person-row" key={p.id}><Avatar person={p.id==='yue'?{...p,avatar:imAsset('whitelist-yue')}:p}/><span><strong>{p.name}</strong><small>{p.id==='dong'?'软件及通信解决方案部':p.job}</small></span><button aria-label={'移除'+p.name} onClick={()=>updateSettings({whitelist:settings.whitelist.filter(id=>id!==p.id)})}><Icon name="CircleX" size={17}/></button></div>)}{search&&!people.some(p=>settings.whitelist.includes(p.id)&&p.name.includes(search))&&<p className="im2-empty-text">未找到成员</p>}</section>:<div className="im2-empty"><img src={imAsset('empty-members')} alt=""/><p>暂无成员，请在右上角点击添加成员</p></div>}
   </>}
   {route==='im-select'&&<><div className="im2-search"><Icon name="Search" size={15}/><input placeholder="搜索" aria-label="搜索成员" value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {purpose==='create'&&<p className="im2-breadcrumb"><button onClick={()=>go('im-groups')}>我的群组</button><Icon name="ChevronRight" size={15}/><span>选择联系人</span></p>}
    <section className="im2-card im2-picker-list">{pickerPeople.filter(p=>p.name.includes(search)||p.job.includes(search)).map(p=>{
     const disabled=purpose==='remove'&&p.id===group?.members[0]?.id||purpose==='add'&&group?.members.some(m=>m.id===p.id);
     return <label className="im2-person-row" key={p.id}><input type="checkbox" aria-label={'选择'+p.name} checked={selected.includes(p.id)} disabled={disabled} onChange={()=>toggleSelected(p.id)}/><Avatar person={p}/><span><strong>{p.name}</strong><small>{p.job}{disabled?(purpose==='remove'?' · 不可移除':' · 已在群内'):''}</small></span></label>})}
    {!pickerPeople.some(p=>p.name.includes(search)||p.job.includes(search))&&<p className="im2-empty-text">未找到成员</p>}</section>
   </>}
   {route==='im-members'&&<><div className="im2-search"><Icon name="Search" size={15}/><input aria-label="搜索群成员" placeholder="搜索" value={search} onChange={e=>setSearch(e.target.value)}/></div><p className="im2-label">群成员 · {group?.members.length||0}人</p><section className="im2-card">{group?.members.filter(p=>p.name.includes(search)).map(p=><button key={p.id} className="im2-person-row" onClick={()=>navigate('im-profile?'+new URLSearchParams({name:p.name,group:group.id,origin}).toString())}><Avatar person={p}/><span><strong>{p.name}</strong><small>{p.job}</small></span><Icon name="ChevronRight" size={17}/></button>)}{!group?.members.some(p=>p.name.includes(search))&&<p className="im2-empty-text">未找到群成员</p>}</section></>}
   {route==='im-schedule'&&<><p className="im2-label">设置禁言时段</p><section className="im2-card">{switchRow('重复周期',schedule.repeat,v=>{setSchedule({...schedule,repeat:v});setError('')})}
    {schedule.repeat&&['周一','周二','周三','周四','周五','周六','周日'].map((label,i)=><label className="im2-row im2-weekday" key={label}><input type="checkbox" aria-label={label} checked={schedule.days.includes(i+1)} onChange={()=>setSchedule({...schedule,days:schedule.days.includes(i+1)?schedule.days.filter(d=>d!==i+1):[...schedule.days,i+1]})}/><span>{label}</span></label>)}</section>
    <section className="im2-card">{(['start','end'] as const).map((field,i)=><label className="im2-row im2-time-row" key={field}><span>{i===0?'开始时间':'结束时间'}</span><input aria-label={i===0?'开始时间':'结束时间'} type={schedule.repeat?'time':'datetime-local'} value={schedule.repeat?schedule[field].slice(11):schedule[field]} onChange={e=>{setSchedule({...schedule,[field]:schedule.repeat?schedule[field].slice(0,11)+e.target.value:e.target.value});setError('')}}/></label>)}</section>{error&&<p className="im2-error" role="alert">{error}</p>}
   </>}
   {route==='im-history'&&<><div className="im2-search"><Icon name="Search" size={15}/><input aria-label="搜索聊天记录" placeholder="搜索聊天记录" value={search} onChange={e=>setSearch(e.target.value)}/></div><section className="im2-card">{messages.filter(m=>!search||m.text?.includes(search)).map(m=><div key={m.id} className="im2-record"><small>{m.side==='out'?'我':entity}</small>{m.image?<button onClick={()=>setImagePreview(m.image!)}><img src={m.image} alt="聊天图片"/></button>:<p>{m.text}</p>}</div>)}{search&&!messages.some(m=>m.text?.includes(search))&&<p className="im2-empty-text">未找到聊天记录</p>}</section></>}
   {route==='im-profile'&&<><section className="im2-card im2-profile"><Avatar person={person} size={64}/><h2>{name}</h2><p>{person.job}</p></section><section className="im2-card"><div className="im2-row"><span>所属企业</span><span className="im2-row-value">广新集团</span></div><div className="im2-row"><span>部门</span><span className="im2-row-value">{person.job}</span></div></section><button className="im2-primary im2-wide" onClick={()=>navigate('im-chat?'+new URLSearchParams({name,origin}).toString())}>发消息</button><button className="im2-secondary im2-wide" onClick={()=>go('im-meeting')}>发起会议</button></>}
   {route==='im-enterprise'&&<><div className="im2-search"><Icon name="Search" size={15}/><input aria-label="搜索企业联系人" placeholder="搜索" value={search} onChange={e=>setSearch(e.target.value)}/></div><p className="im2-breadcrumb"><button onClick={()=>navigate('im-enterprise?'+new URLSearchParams({origin}).toString())}>广新集团</button><Icon name="ChevronRight" size={15}/><span>{department||'集团总部'}</span></p>{(department||search)?<section className="im2-card im2-directory-card">{people.filter(p=>p.name.includes(search)||p.job.includes(search)||(!search&&p.job.includes(department))).map(p=><button className="im2-person-row" key={p.id} onClick={()=>navigate('im-profile?'+new URLSearchParams({name:p.name,origin:'contacts',from:'directory'}).toString())}><Avatar person={p}/><span><strong>{p.name}</strong><small>{p.job}</small></span><Icon name="ChevronRight" size={17}/></button>)}{!people.some(p=>p.name.includes(search)||p.job.includes(search)||(!search&&p.job.includes(department)))&&<p className="im2-empty-text">未找到联系人</p>}</section>:<section className="im2-card im2-directory-card">{enterpriseDepartments.map((item,index)=><button className="im2-row" key={item.name+'-'+index} onClick={()=>navigate('im-enterprise?'+new URLSearchParams({origin,department:item.name}).toString())}><span>{item.name} <small>{'（'+item.count+'人）'}</small></span><Icon name="ChevronRight" size={17}/></button>)}</section>}</>}
   {route==='im-group-name'&&<><label className="im2-name-field im2-card"><span>群聊名称</span><input aria-label="群聊名称" maxLength={40} value={groupName} onChange={e=>setGroupName(e.target.value)}/></label><p className="im2-help">最多 40 个字符，修改后对群内所有成员可见。</p></>}
   {(route==='im-meeting'||route==='im-join')&&<>
    {meetingActive?<section className="im2-card im2-meeting-preview"><Icon name="Video" size={42}/><h2>本地会议预览</h2><p>{route==='im-join'?'会议 ID：'+meetingId:'会议准备就绪'}</p><p>麦克风{mic?'开启':'关闭'} · 摄像头{camera?'开启':'关闭'}</p><p className="im2-help">当前为界面演示，尚未连接会议服务。</p><button className="im2-secondary" onClick={()=>setMeetingActive(false)}>结束预览</button></section>:<>
     {route==='im-meeting'?<section className="im2-card im2-meeting-name">{name==='石梁雅'?'芦丽云':name}发起的视频会议</section>:<label className="im2-card im2-meeting-id"><span>会议ID</span><input aria-label="会议ID" placeholder="请输入会议ID" inputMode="numeric" autoComplete="off" pattern="[0-9]*" value={meetingId} onChange={e=>setMeetingId(e.target.value.replace(/\D/g,'').slice(0,12))}/></label>}
     <section className="im2-card">{switchRow('麦克风',mic,setMic)}{switchRow('摄像头',camera,setCamera)}</section>
     {route==='im-meeting'?<section className="im2-card im2-meeting-participants">{row('参会方',()=>go('im-select',{purpose:'meeting'}),meetingMembers.length+'人')}<div><button onClick={()=>go('im-select',{purpose:'meeting'})}><span className="im2-member-action"><Icon name="Plus" size={29}/></span><small>添加</small></button>{meetingMembers.map(id=>memberForId(id)).filter((p):p is Person=>!!p).map(p=><button key={p.id} onClick={()=>go('im-select',{purpose:'meeting'})}><Avatar person={p}/><small>{p.name}</small></button>)}</div></section>:<button className="im2-primary im2-wide" disabled={meetingId.length<6} onClick={()=>setMeetingActive(true)}>加入会议</button>}
    </>}
   </>}
   {route==='im-scan'&&<section className="im2-card im2-scan"><Icon name="ScanLine" size={56}/><h2>扫一扫</h2><p>选择二维码图片，识别联系人或群组信息</p><input ref={scanInput} type="file" accept="image/*" hidden onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{const Detector=(window as unknown as {BarcodeDetector?:new(options:unknown)=>{detect:(image:ImageBitmap)=>Promise<{rawValue:string}[]>}}).BarcodeDetector;if(!Detector){setScanResult('当前浏览器不支持二维码识别，请使用手机扫码。');return}const bitmap=await createImageBitmap(file);const results=await new Detector({formats:['qr_code']}).detect(bitmap);bitmap.close();setScanResult(results[0]?.rawValue||'未识别到二维码，请更换清晰的图片。')}catch{setScanResult('识别失败，请重新选择图片。')}}}/><button className="im2-primary" onClick={()=>scanInput.current?.click()}>选择二维码图片</button>{scanResult&&<p className="im2-scan-result" role="status">{scanResult}</p>}</section>}
  </div>
  {route==='im-chat'&&<div className="im2-composer-wrap">{panel&&<div className="im2-composer-panel">{panel==='more'?<div className="im2-attachment-actions"><button type="button" aria-label="照片" onClick={()=>fileInput.current?.click()}><span className="im2-attachment-icon"><Icon name="Image" size={25}/></span><span>照片</span></button><button type="button" aria-label="拍摄" onClick={()=>notify('拍摄功能待接入')}><span className="im2-attachment-icon"><Camera size={25}/></span><span>拍摄</span></button><button type="button" aria-label="文件" onClick={()=>go('im-chat-files')}><span className="im2-attachment-icon"><Folder size={25}/></span><span>文件</span></button></div>:panel==='emoji'?<div className="im2-quick-replies">{['收到，谢谢','好的','稍后回复','辛苦了'].map(t=><button key={t} onClick={()=>{setDraft(draft+t);setPanel('')}}>{t}</button>)}</div>:<p>请使用手机输入法的语音功能转文字。</p>}</div>}
   <form className="im2-composer" onSubmit={sendMessage}><button type="button" aria-label="语音输入" onClick={()=>setPanel(panel==='voice'?'':'voice')}><Icon name="AudioLines"/></button><input aria-label="消息内容" placeholder="请输入内容" value={draft} onChange={e=>setDraft(e.target.value)}/><button type="button" aria-label="快捷回复" onClick={()=>setPanel(panel==='emoji'?'':'emoji')}><Icon name="Smile"/></button>{draft.trim()?<button className="im2-send" aria-label="发送消息" type="submit"><Icon name="Send" size={20}/></button>:<button type="button" aria-label="更多聊天功能" onClick={()=>setPanel(panel==='more'?'':'more')}><Icon name="CirclePlus"/></button>}</form>
   <input ref={fileInput} type="file" accept="image/*" hidden onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>2*1024*1024){notify('请选择 2MB 以内的图片');return}const reader=new FileReader();reader.onload=()=>sendMessage(undefined,'',String(reader.result));reader.readAsDataURL(file);e.target.value=''}}/>
  </div>}
  {route==='im-select'&&<footer className="im2-selection-footer"><button onClick={()=>setSelectionSheet(true)}>已选择：<span>{selected.length+(purpose==='create'?1:0)}{purpose==='create'?'/500':''}人</span></button><button className="im2-primary" disabled={!selected.length&&purpose!=='whitelist'&&purpose!=='meeting'} onClick={confirmSelection}>确定</button></footer>}
  {route==='im-meeting'&&!meetingActive&&<footer className="im2-meeting-footer"><button className="im2-primary" onClick={()=>setMeetingActive(true)}>开始会议</button></footer>}
  <div className="im2-home"><span/></div>
  {selectionSheet&&<Dialog title={'已选择 ('+(selected.length+(purpose==='create'?1:0))+')'} close={()=>setSelectionSheet(false)}><div className="im2-selected-list">{purpose==='create'&&<div className="im2-person-row"><Avatar person={{name:'系统管理员',avatar:imAsset('self-admin')}}/><span><strong>系统管理员</strong><small>软件及通信解决方案部</small></span></div>}{selected.map(id=>pickerPeople.find(p=>p.id===id)).filter((p):p is Person=>!!p).map(p=><div className="im2-person-row" key={p.id}><Avatar person={p}/><span><strong>{p.name}</strong><small>{p.job}</small></span><button aria-label={'取消选择'+p.name} onClick={()=>toggleSelected(p.id)}><Icon name="CircleX" size={17}/></button></div>)}{!selected.length&&purpose!=='create'&&<p className="im2-empty-text">暂未选择成员</p>}</div><footer><button className="im2-secondary" onClick={()=>setSelected([])}>清空</button><button className="im2-primary" onClick={()=>setSelectionSheet(false)}>确定</button></footer></Dialog>}
  {imagePreview&&<Dialog title="聊天图片" close={()=>setImagePreview('')}><img className="im2-image-preview" src={imagePreview} alt="聊天图片原图"/></Dialog>}
  {confirmation&&<Dialog title={confirmation} close={()=>setConfirmation('')}><p className="im2-confirm-text">确定{confirmation}{group&&confirmation!=='退出登录'?'“'+entity+'”':''}？</p><footer><button className="im2-secondary" onClick={()=>setConfirmation('')}>取消</button><button className="im2-primary" onClick={()=>{if(confirmation==='退出登录'){if(!saveLocal('im2-session',false)){notify('退出失败，请重试');return}setConfirmation('');go('im-login');return}if(group){if(!persistGroups(groups.map(g=>g.id===group.id?{...g,left:true,disbanded:confirmation==='解散群聊'}:g)))return;go('im-groups')}else{if(!updateSettings({blocked:!settings.blocked}))return}setConfirmation('');notify('已'+confirmation)}}>确定</button></footer></Dialog>}
 </section>;
}
