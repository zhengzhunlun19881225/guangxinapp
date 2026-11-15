import {useCallback,useEffect,useLayoutEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import {ArrowUp,Check,ChevronDown,FileText,Globe,Layers,Mic,Plane,Plus,Presentation,ReceiptText,WandSparkles,X} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import type {Action} from './SceneAction';
import CloseButton from './CloseButton';
import ComposerSheet from './ComposerSheet';
import PptPicker,{pptTemplates} from './PptPicker';
import KnowledgePicker from './KnowledgePicker';
import {readResources} from '../features/data';
import PromptPicker from './PromptPicker';
import ModelPicker,{normalizeModel} from './ModelPicker';
import PreviewKeyboard from './PreviewKeyboard';
import ComposerAttachments,{type ComposerAttachmentsHandle} from './ComposerAttachments';
import type {ComposerAttachment} from './attachmentStore';
import AiToolIcon from './AiToolIcon';
import './Composer.css';

type Mode=''|'智能问答'|'智能问数'|'智能写作'|'智能摘要'|'AI+财务自动差旅'|'PPT生成';
export type ComposerRequest={id:number;mode:string;text?:string};
const modes:Exclude<Mode,''>[]=['智能问答','智能问数','智能写作','智能摘要','AI+财务自动差旅','PPT生成'];
const summaryTypes=['提取材料中的要点','提炼文档中的结论','梳理政策要求','提炼文档核心内容','归纳会议纪要','整理工作进展','提取关键数据','汇总风险与待办'];
function modeIcon(mode:string){return mode==='智能问答'?<AiToolIcon name="qa"/>:mode==='智能问数'?<AiToolIcon name="data"/>:mode==='智能摘要'?<FileText size={16}/>:mode==='PPT生成'?<Presentation size={16}/>:mode==='AI+财务自动差旅'?<Plane size={16}/>:<WandSparkles size={16}/>}

export default function Composer({onSend,onAction,request,onModeChange,captureState}:{onSend:(text:string,attachments?:ComposerAttachment[])=>boolean|void;onAction:(action:Action)=>void;request?:ComposerRequest;onModeChange?:(mode:string)=>void;captureState?:string}){
 const captureMode=captureState==='smart-question'?'智能问答':captureState==='smart-count'?'智能问数':captureState==='writing'||captureState==='writing-templates'||captureState==='knowledge'?'智能写作':captureState==='summary'||captureState==='summary-templates'?'智能摘要':captureState==='travel'||captureState==='travel-templates'?'AI+财务自动差旅':captureState==='ppt'?'PPT生成':'';
 const capturePanel=captureState==='model'?'model':captureState==='agents'?'agents':captureState==='attachments'?'attachments':captureState==='writing-templates'||captureState==='travel-templates'?'templates':captureState==='summary-templates'?'summary':captureState==='knowledge'?'knowledge':captureState==='ppt'?'ppt':'';
 const [text,setText]=useState(()=>readLocal('composer-text',''));
 const [inputFocused,setInputFocused]=useState(false);
 const [toolsHost,setToolsHost]=useState<HTMLDivElement|null>(null);
 const [mode,setMode]=useState<Mode>(()=>captureMode||(captureState?'' : (()=>{const value=readLocal<Mode>('composer-mode-v2','');return modes.includes(value as Exclude<Mode,''>)?value:''})()));
 const [model,setModel]=useState(()=>normalizeModel(readLocal('composer-model','qwen3.8')));
 const [network,setNetwork]=useState(false),[knowledgeLinked,setKnowledgeLinked]=useState(false),[panel,setPanel]=useState(capturePanel),[scope,setScope]=useState('全部');
 const [summary,setSummary]=useState(summaryTypes[0]),[ppt,setPpt]=useState(()=>readLocal('composer-ppt','')),[device,setDevice]=useState<HTMLElement|null>(null),[error,setError]=useState(''),[keyboard,setKeyboard]=useState(captureState==='keyboard');
 const [knowledge,setKnowledge]=useState<string[]>(()=>readLocal('writing-knowledge',[]));
 const references=readResources().filter(file=>knowledge.includes(file.id));
 const [attachments,setAttachments]=useState<ComposerAttachment[]>([]),[attachmentBusy,setAttachmentBusy]=useState(false);
 const attachmentChange=useCallback((files:ComposerAttachment[],busy:boolean)=>{setAttachments(files);setAttachmentBusy(busy)},[]);
 const closeAttachments=useCallback(()=>setPanel(''),[]);
 const attachmentApi=useRef<ComposerAttachmentsHandle>(null);
 const input=useRef<HTMLTextAreaElement>(null),root=useRef<HTMLDivElement>(null),dialog=useRef<HTMLElement>(null);
 const inputExpanded=inputFocused||!!text.trim()||attachments.length>0||panel==='attachments';
 useEffect(()=>{saveLocal('composer-text',text)},[text]);
 useEffect(()=>{onModeChange?.(mode)},[mode,onModeChange]);
 useEffect(()=>{saveLocal('composer-ppt',ppt)},[ppt]);
 useLayoutEffect(()=>{const field=input.current;if(!field)return;const resize=()=>{field.style.height='0px';field.style.height=Math.min(150,Math.max(32,field.scrollHeight))+'px'};resize();const observer=new ResizeObserver(()=>{if(field.clientWidth!==lastWidth){lastWidth=field.clientWidth;resize()}});let lastWidth=field.clientWidth;observer.observe(field);return()=>observer.disconnect()},[text,inputExpanded]);
 useEffect(()=>{const element=root.current,device=element?.closest<HTMLElement>('.device');if(!element||!device)return;setDevice(device);const update=()=>device.style.setProperty('--composer-height',element.offsetHeight+'px');const observer=new ResizeObserver(update);observer.observe(element);update();return()=>{observer.disconnect();device.style.removeProperty('--composer-height')}},[]);
 useEffect(()=>{if(!request?.id)return;if(modes.includes(request.mode as Exclude<Mode,''>)){setMode(request.mode as Mode);saveLocal('composer-mode-v2',request.mode);setPanel(request.mode==='PPT生成'?'ppt':'');setKeyboard(false)}if(request.text!==undefined){setText(request.text);setPanel('');requestAnimationFrame(()=>input.current?.focus({preventScroll:true}))}},[request]);
 function updateKnowledge(next:string[]){if(!saveLocal('writing-knowledge',next)){setError('文档选择保存失败，请重试');return false}setKnowledge(next);return true}
 function navigate(route:string){onAction({type:'navigate',value:route})}
 function chooseMode(next:Mode){attachmentApi.current?.collapse();setMode(next);saveLocal('composer-mode-v2',next);setPanel(next==='PPT生成'?'ppt':'');setPpt('');setKeyboard(false);setKnowledgeLinked(false);setScope('全部');setError('')}
 function toggle(next:string){setPanel(panel===next?'':next);setKeyboard(false)}
 function focusInput(){attachmentApi.current?.collapse();if(!(navigator.maxTouchPoints>0&&matchMedia('(pointer:coarse)').matches))setKeyboard(true)}
 function closeKeyboard(){setKeyboard(false);input.current?.blur()}
 function fillInput(value:string){setText(value);setPanel('');requestAnimationFrame(()=>input.current?.focus())}
 function insertKey(key:string){const field=input.current;if(!field)return;const start=field.selectionStart??text.length,end=field.selectionEnd??start;let from=start;if(key==='Backspace'&&start===end)from=start-(Array.from(text.slice(0,start)).at(-1)?.length||0);from=Math.max(0,from);const value=key==='Backspace'?'':key;setText(text.slice(0,from)+value+text.slice(end));requestAnimationFrame(()=>{field.focus({preventScroll:true});field.setSelectionRange(from+value.length,from+value.length)})}
 function writingDocument(title:string,content:string,template:string){const id=crypto.randomUUID(),documents=readLocal<Record<string,unknown>[]>('writing-documents',[]);if(!saveLocal('writing-documents',[{id,title,content,template,createdAt:new Date().toISOString()},...documents])){setError('保存失败，请保留输入内容后重试');return}setText('');setPanel('');navigate('writing-document?'+new URLSearchParams({id}))}
 function submit(event:FormEvent){event.preventDefault();if(attachmentBusy||(!text.trim()&&!attachments.length))return;setError('');setKeyboard(false);setInputFocused(false);input.current?.blur();
  if(attachments.length){const sent=onSend(text.trim()||'请查看附件',attachments);if(sent===false){setError('消息保存失败，请保留附件后重试');return}attachmentApi.current?.clearSent();setText('');setPanel('');return}
  if(mode==='PPT生成'){if(!ppt){setPanel('ppt');return}writingDocument(text.slice(0,30)+' · 演示大纲',text+'\n模板：'+ppt+'\n\n1. 封面：'+text+'\n2. 背景与目标：介绍主题背景及目标。\n3. 现状分析：补充现状、数据与主要问题。\n4. 重点工作：说明行动计划、责任分工与节点。\n5. 总结与展望：汇总成果、风险及下一步安排。','PPT大纲');return}
  if(mode==='智能摘要'){const sentences=text.trim().split(/(?<=[。！？!?；;\n])/).map(value=>value.trim()).filter(Boolean);writingDocument(summary,summary+'\n\n'+sentences.slice(0,5).map((sentence,index)=>(index+1)+'. '+sentence).join('\n')+'\n\n原文\n'+text,'智能摘要');return}
  if(onSend(text.trim())===false){setError('消息保存失败，请保留内容后重试');return}setText('');setPanel('');
 }
 const option=(label:string,icon:ReactNode,click:()=>void,{pressed,chevron=false,arrow=!!mode,aria=label}:{pressed?:boolean;chevron?:boolean;arrow?:boolean;aria?:string}={})=><button key={aria} type="button" aria-label={aria} aria-pressed={pressed} onClick={click}><span>{icon}<span className="composer-tool-label">{label}</span>{chevron&&<ChevronDown size={14}/>} {arrow&&<span className="composer-option-arrow" aria-hidden="true"/>}</span></button>;
 const modelOption=option(mode?model:'模型',mode?null:<img className="composer-model-icon" src="/assets/ui/model-aether.png" alt=""/>,()=>toggle('model'),{chevron:true,aria:'切换模型，当前 '+model});
 const networkOption=option(network?'已联网':'未联网',<Globe size={16}/>,()=>setNetwork(!network),{pressed:network});
 const knowledgeOption=(linked=false)=>linked?<button className="composer-knowledge-toggle" type="button" role="switch" aria-label="联动知识库" aria-checked={knowledgeLinked} onClick={()=>setKnowledgeLinked(value=>!value)}><span><AiToolIcon name="knowledge"/><span className="composer-tool-label">联动知识库</span><i className="composer-knowledge-switch" aria-hidden="true"><i/></i></span></button>:option('知识库',<AiToolIcon name="knowledge"/>,()=>toggle('knowledge'));
 return <div ref={root} onPointerDownCapture={event=>{if(keyboard&&event.target instanceof Element&&event.target.closest('button'))event.preventDefault()}} className={'composer composer-enhanced'+(!mode?' is-default'+(inputExpanded?' is-input-expanded':''):' has-agent')}>
  <div className={mode?'composer-agent-card':undefined} data-mode={mode||undefined}>
   {mode&&<header className="composer-agent-header"><button type="button" aria-label="切换智能体" onClick={()=>toggle('agents')}>{mode}</button><CloseButton aria-label={'移除'+mode+'模式'} onClick={()=>chooseMode('')}/></header>}
   {mode!=='智能问答'&&<div className="composer-toolbar"><div className="composer-options" aria-label="AI 输入工具">
   {!mode?<>{modelOption}{networkOption}{(['智能问答','智能问数','智能写作','智能摘要'] as Mode[]).map(value=>option(value,modeIcon(value),()=>chooseMode(value)))}</>:mode==='智能问数'?<>{option('分享管理',<AiToolIcon name="share"/>,()=>navigate('scheduled-shares'))}{option('技能树',<Layers size={16}/>,()=>{closeKeyboard();navigate('skill-tree')})}</>:mode==='智能写作'?<>{knowledgeOption()}{option('提示词模板',<FileText size={16}/>,()=>toggle('templates'))}</>:mode==='智能摘要'?<>{option('模板',<FileText size={16}/>,()=>toggle('summary'))}{knowledgeOption(true)}</>:mode==='AI+财务自动差旅'?<>{option('模板',<FileText size={16}/>,()=>toggle('templates'))}{option('单据记录',<ReceiptText size={16}/>,()=>onAction({type:'travel-documents',value:'单据记录'}))}</>:<>{option('模板',<Presentation size={16}/>,()=>toggle('ppt'),{aria:'PPT生成'})}</>}
   </div>{!mode&&<div className="composer-tools-fixed"><button className="composer-tools-grid" type="button" aria-label="切换智能体" onClick={()=>toggle('agents')}><span><AiToolIcon name="more"/></span></button></div>}</div>}
   <form className="composer-input" onSubmit={submit} onFocusCapture={()=>setInputFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setInputFocused(false)}}>
    <ComposerAttachments ref={attachmentApi} device={device} toolsHost={toolsHost} open={panel==='attachments'} close={closeAttachments} onChange={attachmentChange} knowledgeFiles={mode==='智能写作'?references:[]} removeKnowledge={id=>updateKnowledge(knowledge.filter(value=>value!==id))} clearKnowledge={()=>mode==='智能写作'?updateKnowledge([]):true}>
    {mode==='PPT生成'&&ppt&&<div className="composer-chosen-template"><img src={'/assets/ppt/'+(pptTemplates.find(template=>template.name===ppt)?.cover||'business')+'.webp'} alt="已选模板封面"/><span>{ppt}</span><button aria-label="移除PPT模板" type="button" onClick={()=>setPpt('')}>×</button></div>}
    <div className="composer-default-entry"><textarea rows={1} ref={input} aria-label="请输入您的问题" placeholder="请输入您的问题..." value={text} onFocus={focusInput} onBlur={()=>setKeyboard(false)} onChange={event=>setText(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)&&!event.nativeEvent.isComposing){event.preventDefault();event.currentTarget.form?.requestSubmit()}}}/><div className="composer-entry-actions"><button type="button" className="composer-add" aria-label={panel==='attachments'?'收起附件与工具':'添加附件与工具'} aria-expanded={panel==='attachments'} onClick={()=>toggle('attachments')}>{panel==='attachments'?<X size={18}/>:<Plus size={18}/>}</button><button className="composer-voice" disabled={attachmentBusy} type="button" aria-label="语音输入" onClick={()=>{closeKeyboard();onAction({type:'voice',value:'语音输入'})}}><Mic size={20}/></button>{(text.trim()||attachments.length>0)&&<button className="send-button" disabled={attachmentBusy} type="submit" aria-label="发送消息"><ArrowUp size={20}/></button>}</div></div>
    </ComposerAttachments>
   </form>
  </div>
  <div className="composer-attachment-tools-host" ref={setToolsHost}/>
  {device&&panel==='agents'&&<ComposerSheet device={device} title="切换智能体" closeLabel="关闭切换智能体" close={()=>setPanel('')} dialogRef={dialog} compact><div className="composer-agent-list">{modes.map(value=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>chooseMode(value)}>{modeIcon(value)}<span>{value}</span>{mode===value&&<Check size={16}/>}</button>)}</div></ComposerSheet>}
  {device&&panel==='summary'&&<ComposerSheet device={device} title="摘要模板" closeLabel="关闭摘要模板" close={()=>setPanel('')} dialogRef={dialog} compact><div className="composer-summary-list">{summaryTypes.map(value=><button key={value} type="button" aria-pressed={summary===value} onClick={()=>{setSummary(value);fillInput(value)}}><FileText size={18}/><span>{value}</span></button>)}</div></ComposerSheet>}
  {panel==='ppt'&&device&&<PptPicker device={device} selected={ppt} close={()=>setPanel('')} choose={template=>{setPpt(template.name);setPanel('');requestAnimationFrame(()=>input.current?.focus())}}/>}
  {panel==='knowledge'&&device&&<KnowledgePicker device={device} close={()=>setPanel('')} choose={ids=>{setKnowledge(ids);setPanel('');requestAnimationFrame(()=>input.current?.focus({preventScroll:true}))}}/>}
  {panel==='templates'&&device&&<PromptPicker device={device} kind={mode==='AI+财务自动差旅'?'travel':'writing'} scope={scope} setScope={setScope} close={()=>setPanel('')} choose={fillInput}/>}
  {panel==='model'&&device&&<ModelPicker device={device} selected={model} close={()=>setPanel('')} choose={value=>{setModel(value);saveLocal('composer-model',value);setPanel('')}}/>}
  {keyboard&&!panel&&device&&<PreviewKeyboard device={device} insert={insertKey} close={closeKeyboard} canSend={!attachmentBusy&&(!!text.trim()||!!attachments.length)} send={()=>input.current?.form?.requestSubmit()}/>}
  {error&&<p className="composer-error" role="alert">{error}</p>}<div className="home-indicator"/>
 </div>;
}
