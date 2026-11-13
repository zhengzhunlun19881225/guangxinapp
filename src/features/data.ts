import {readLocal,saveLocal} from '../data';
import {people,initialMembers,initialGroups,initialMessages,type ChatMessage,type Group,type ChatSettings} from '../im/data';
import {isGroupMuted} from '../im/conversations';

export const featureRoutes=['im-create-group','skill-tree','scheduled-shares','knowledge','knowledge-files','writing','writing-document','share','im-search-all','im-chat-search','im-chat-files','im-media','cloud-drive'];
export const featureTitles:Record<string,string>={'im-create-group':'创建群组','skill-tree':'技能树','scheduled-shares':'定时分享管理',knowledge:'知识库','knowledge-files':'知识库文档',writing:'智能写作','writing-document':'文档详情',share:'选择联系人','im-search-all':'搜索','im-chat-search':'查找聊天内容','im-chat-files':'聊天文件','im-media':'图片及视频','cloud-drive':'云盘'};
export type FeatureProps={route:string;locationKey:string;height:number;navigate:(route:string)=>void;notify:(text:string)=>void};
export const uid=()=>globalThis.crypto.randomUUID();
export const today=()=>new Date().toLocaleDateString('en-CA');
export const dateKey=(date:Date)=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
export function queryFor(locationKey:string){return new URLSearchParams(locationKey.split('?')[1]||'')}
export function routeTo(route:string,query:Record<string,string>={}){return route+(Object.keys(query).length?'?'+new URLSearchParams(query):'')}
export function download(url:string,name:string){const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove()}
export function downloadText(text:string,name:string){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));download(url,name);setTimeout(()=>URL.revokeObjectURL(url),1000)}
export async function copyText(text:string){if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return}catch{}}const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok)throw new Error('无法复制，请选择文字后复制')}
export type SharePayload={kind:'text'|'image'|'file'|'link'|'history';title:string;text?:string;url?:string;fileKind?:string;items?:{title:string;url:string;kind:string}[]};
export function startShare(payload:SharePayload,returnTo:string,navigate:(route:string)=>void){const id=uid();if(!saveLocal('share-payload-'+id,payload))return false;navigate(routeTo('share',{id,return:returnTo}));return true}
export type Recipient={id:string;name:string;avatar:string;job:string;group?:string;members?:string[]};
export function readRecipients():Recipient[]{const groups=readLocal<Group[]>('im2-groups',initialGroups).filter(g=>!g.left&&!g.disbanded);const members=[...new Map([...people,...initialMembers,...groups.flatMap(g=>g.members)].map(p=>[p.name,p])).values()];return [...groups.map(g=>({id:'group-'+g.id,name:g.name,avatar:g.avatar,job:g.members.length+'人',group:g.id,members:g.members.map(p=>'person-'+p.name)})),...members.map(p=>({id:'person-'+p.name,name:p.name,avatar:p.avatar,job:p.job}))]}
export function sendShare(payload:SharePayload,ids:string[],note:string){
 const all=readRecipients(),settings=readLocal<Record<string,ChatSettings>>('im2-settings',{}),messages=readLocal<Record<string,ChatMessage[]>>('im2-messages',{});
 if(!ids.length)return '请选择接收人';
 for(const id of ids){const recipient=all.find(p=>p.id===id);if(!recipient)return '接收对象已失效，请重新选择';if(settings[id]?.blocked)return recipient.name+'已被拉黑，请先解除拉黑';if(recipient.group&&settings[id]&&isGroupMuted(settings[id]))return recipient.name+'当前处于禁言时段'}
 const prefix=payload.kind==='link'?'[链接] ':payload.kind==='history'?'[聊天记录] ':payload.kind==='file'?'[文件] ':'';
 for(const id of ids){const list=[...(messages[id]||initialMessages)];const common={side:'out' as const,read:false,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}),createdAt:new Date().toISOString()};
  if(payload.items?.length)for(const item of payload.items)list.push({...common,id:uid(),...(item.kind==='image'?{image:item.url}:{text:'[文件] '+item.title,attachment:{name:item.title,url:item.url,kind:item.kind}})});
  else list.push({...common,id:uid(),...(payload.kind==='image'&&payload.url?{image:payload.url}:payload.kind==='file'&&payload.url?{text:prefix+payload.title,attachment:{name:payload.title,url:payload.url,kind:payload.fileKind||'document'}}:{text:prefix+(payload.text||payload.title)+(payload.kind==='link'&&payload.url?'\n'+payload.url:'')})});
  if(note.trim())list.push({...common,id:uid(),text:note.trim()});messages[id]=list;
 }
 return saveLocal('im2-messages',messages)?'':'发送失败，请保留内容后重试';
}
export type Library={id:string;name:string;description:string;scope:string;department?:string};
export const libraries:Library[]=[
 {id:'general',name:'集团通用知识库',description:'企业制度、办事指南与常见问题',scope:'通用'},
 {id:'finance',name:'财务管理知识库',description:'财务制度、报销流程和经营资料',scope:'组织',department:'财务部'},
 {id:'development',name:'研发知识库',description:'研发规范、项目交付与技术文档',scope:'组织',department:'研发部'},
 {id:'team',name:'项目协作知识库',description:'团队项目资料和协作记录',scope:'团队'},
 {id:'personal',name:'我的工作资料',description:'个人工作笔记与已收藏文档',scope:'个人'},
];
export type Resource={id:string;name:string;url:string;kind:'document'|'image'|'video'|'audio'|'archive'|'other';date:string;sender:string;avatar:string;size:string};
export const resources:Resource[]=[
 {id:'report',name:'集团资讯资料.pdf',url:'/assets/portal-news/reference-article.pdf',kind:'document',date:'2026-11-12',sender:'石梁雅',avatar:people[0].avatar,size:'PDF'},
 {id:'table',name:'年度财务统计.csv',url:'/assets/features/finance.csv',kind:'document',date:'2026-11-10',sender:'董巧珑',avatar:people[1].avatar,size:'1KB'},
 {id:'archive',name:'项目资料汇总.zip',url:'/assets/features/project-materials.zip',kind:'archive',date:'2026-10-25',sender:'官文',avatar:people[2].avatar,size:'2KB'},
 {id:'brief',name:'工作汇报.txt',url:'/assets/features/work-report.txt',kind:'document',date:'2026-10-16',sender:'李树洁',avatar:people[6].avatar,size:'1KB'},
 {id:'video',name:'办公环境演示.webm',url:'/assets/features/office-tour.webm',kind:'video',date:'2026-11-12',sender:'石梁雅',avatar:people[0].avatar,size:'00:03'},
 {id:'audio',name:'会议提示音.wav',url:'/assets/features/meeting-tone.wav',kind:'audio',date:'2026-11-11',sender:'石梁雅',avatar:people[0].avatar,size:'16KB'},
 ...Array.from({length:19},(_,i)=>({id:'photo-'+i,name:'办公环境 '+(i+1)+'.jpg',url:'/assets/features/office-'+(i+1)+'.jpg',kind:'image' as const,date:i<5?'2026-10-15':i<12?'2026-11-06':'2026-11-12',sender:people[i%7].name,avatar:people[i%7].avatar,size:'图片'})),
];
export function readResources(){const deleted=readLocal<string[]>('hidden-resources',[]);return [...resources,...readLocal<Resource[]>('uploaded-resources',[])].filter(file=>!deleted.includes(file.id))}
export function chatKey(query:URLSearchParams){return query.get('group')?'group-'+query.get('group'):'person-'+(query.get('name')||'石梁雅')}
export function readChatMessages(key:string){return readLocal<Record<string,ChatMessage[]>>('im2-messages',{})[key]||initialMessages}
export const articleSections=[
 {heading:'一、概念与价值',text:'数据监测与优化策略是指在业务全链路中，通过实时采集、清洗、分析与反馈数据，持续迭代产品、运营与技术方案，以提升关键指标（KPI）的系统化方法。它将原本事后复盘的经验管理，转变为前瞻式、闭环式、量化的科学管理，帮助企业降低试错成本、放大增长杠杆。'},
 {heading:'二、指标体系设计',text:'a. 北极星指标：唯一且最能代表长期价值的指标，例如 SaaS 企业的月活跃付费账户数。\n\nb. OSM模型：Objective（业务目标）→Signal（用户行为信号）→Metric（可量化指标），确保每个指标都能向上溯源到商业目标。\n\nc. 分层拆解：战略层→战术层→执行层，逐层细化，避免“只对树木不见森林”，也避免“空洞口号”。\n\nd. 指标分级：核心指标、护航指标、观察指标，分别对应决策、分析与预警场景。'},
 {heading:'三、数据采集与治理',text:'统一数据字典与采集口径，明确数据来源、更新频率、责任人和质量要求。通过完整性、一致性和及时性检查，建立可追溯的数据治理流程。'},
];
export type WritingDocument={id:string;title:string;content:string;createdAt:string;template:string;html?:string};
export const defaultDocument:WritingDocument={id:'strategy',title:'数据监测与优化策略',content:articleSections.map(s=>s.heading+'\n'+s.text).join('\n\n'),createdAt:'2026-11-12T13:32:00',template:'方案策划'};
export function readDocuments(){return readLocal<WritingDocument[]>('writing-documents',[defaultDocument])}
export function saveDocument(doc:WritingDocument){const all=readDocuments();return saveLocal('writing-documents',[doc,...all.filter(d=>d.id!==doc.id)])}
export const templates=['述职报告','通知公告','方案策划','周报总结','会议纪要','总结汇报'];
export function generateDocument(template:string,prompt:string,detail=false){return {title:prompt.trim().slice(0,36)||template,content:`${template}\n\n一、背景与目标\n围绕“${prompt.trim()}”，明确本次工作的目标、范围与成果要求。${detail?'结合现有资料梳理关键问题，形成可衡量、可追踪的改进计划。':''}\n\n二、主要工作\n1. 梳理现状与需求，统一各方对工作目标的理解。\n2. 制定执行计划，明确责任分工、时间节点和协同方式。\n3. 汇总过程数据与成果，及时识别并处理风险。\n\n三、后续安排\n按计划推进重点任务，定期复盘执行情况，根据反馈持续改进。`}}
export type ScheduledShare={id:string;prompt:string;title:string;content:string;frequency:string;days:number[];time:string;start:string;end:string;recipients:string[];createdAt:string};
export function readScheduledShares(){return readLocal<ScheduledShare[]>('scheduled-shares',[])}
