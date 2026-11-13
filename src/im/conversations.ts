import {conversations,readLocal} from '../data';
import {initialGroups,type ChatMessage,type ChatSettings,type Group} from './data';
import {readAnniversaryConversation} from './greetings';
export function readImConversations(){
 const groups=readLocal<Group[]>('im2-groups',initialGroups),settings=readLocal<Record<string,ChatSettings>>('im2-settings',{}),messages=readLocal<Record<string,ChatMessage[]>>('im2-messages',{});
 const anniversary=readAnniversaryConversation();
 const rows=[...(anniversary?[anniversary]:[]),...conversations];
 const extras=Object.keys(messages).filter(key=>key.startsWith('person-')&&!rows.some(row=>'person-'+row.name===key)).map(key=>({name:key.slice(7),node:'',preview:'',time:'',unread:0}));
 const groupRows=groups.filter(g=>!g.left&&!g.disbanded&&(messages['group-'+g.id]||g.id.startsWith('group-'))).filter(g=>!rows.some(row=>row.name===g.name)).map(g=>({name:g.name,node:'',preview:'群聊已创建',time:'',unread:0}));
 return [...extras,...groupRows,...rows].map((row,index)=>{
  const group=groups.find(g=>g.name===row.name),key=group?'group-'+group.id:'person-'+row.name,last=messages[key]?.at(-1),prefs=settings[key];
  return {...row,id:key+'-'+index,key,group:group?.id,avatar:group?.avatar,lastText:last?.text||(last?.image?'[图片]':undefined),preview:last?.text||(last?.image?'[图片]':row.preview),time:last?.time||row.time,pinned:!!prefs?.pinned,quiet:!!prefs?.quiet,blocked:!!prefs?.blocked,unavailable:!!group&&(!!group.left||!!group.disbanded)};
 }).filter(row=>!row.unavailable).sort((a,b)=>Number(b.pinned)-Number(a.pinned));
}
export function isGroupMuted(settings:ChatSettings,date=new Date()){
 if(settings.mute==='always')return true;
 if(settings.mute!=='scheduled')return false;
 const rule=settings.schedule;
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const part=(type:Intl.DateTimeFormatPartTypes)=>parts.find(item=>item.type===type)?.value||'';
 const localDate=part('year')+'-'+part('month')+'-'+part('day'),clock=part('hour')+':'+part('minute');
 if(rule.repeat){const day=({Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:7} as Record<string,number>)[part('weekday')];return rule.days.includes(day)&&clock>=rule.start.slice(11)&&clock<rule.end.slice(11)}
 return localDate+'T'+clock>=rule.start&&localDate+'T'+clock<rule.end;
}
