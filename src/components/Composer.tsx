import {useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import {ArrowUp,BookOpen,Bot,ChartNoAxesCombined,Check,ChevronDown,ChevronRight,FileText,Globe,Grid2X2,Layers,Mic,Plane,Plus,Presentation,ReceiptText,Share2,Sparkles,WandSparkles} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import type {Action} from './SceneAction';
import CloseButton from './CloseButton';
import ComposerSheet from './ComposerSheet';
import PptPicker from './PptPicker';
import PromptPicker from './PromptPicker';
import ModelPicker,{normalizeModel} from './ModelPicker';
import PreviewKeyboard from './PreviewKeyboard';
import './Composer.css';

type Mode=''|'智能问答'|'智能问数'|'智能写作'|'智能摘要'|'AI+财务自动差旅'|'PPT生成';
export type ComposerRequest={id:number;mode:string};
const modes:Exclude<Mode,''>[]=['智能问答','智能问数','智能写作','智能摘要','AI+财务自动差旅','PPT生成'];
const summaryTypes=['提取材料中的要点','提炼文档中的结论','梳理政策要求','提炼文档核心内容'];
function modeIcon(mode:string){return mode==='智能问答'?<Bot size={16}/>:mode==='智能问数'?<ChartNoAxesCombined size={16}/>:mode==='智能摘要'?<FileText size={16}/>:mode==='PPT生成'?<Presentation size={16}/>:mode==='AI+财务自动差旅'?<Plane size={16}/>:<WandSparkles size={16}/>}

export default function Composer({onSend,onAction,request}:{onSend:(text:string)=>void;onAction:(action:Action)=>void;request?:ComposerRequest}){
 const [text,setText]=useState(()=>readLocal('composer-text',''));
 const [mode,setMode]=useState<Mode>(()=>{const value=readLocal<Mode>('composer-mode-v2','');return modes.includes(value as Exclude<Mode,''>)?value:''});
 const [model,setModel]=useState(()=>normalizeModel(readLocal('composer-model','qwen3.8')));
 const [network,setNetwork]=useState(false),[knowledgeLinked,setKnowledgeLinked]=useState(false),[panel,setPanel]=useState(''),[scope,setScope]=useState('全部');
 const [summary,setSummary]=useState(summaryTypes[0]),[ppt,setPpt]=useState(''),[device,setDevice]=useState<HTMLElement|null>(null),[error,setError]=useState(''),[keyboard,setKeyboard]=useState(false);
 const input=useRef<HTMLInputElement>(null),attachment=useRef<HTMLInputElement>(null),root=useRef<HTMLDivElement>(null),dialog=useRef<HTMLElement>(null);
 useEffect(()=>{saveLocal('composer-text',text)},[text]);
 useEffect(()=>{const element=root.current,device=element?.closest<HTMLElement>('.device');if(!element||!device)return;setDevice(device);const update=()=>device.style.setProperty('--composer-height',element.offsetHeight+'px');const observer=new ResizeObserver(update);observer.observe(element);update();return()=>{observer.disconnect();device.style.removeProperty('--composer-height')}},[]);
 useEffect(()=>{if(request?.id&&modes.includes(request.mode as Exclude<Mode,''>)){setMode(request.mode as Mode);saveLocal('composer-mode-v2',request.mode);setPanel(request.mode==='PPT生成'?'ppt':'');setKeyboard(false)}},[request]);
 function navigate(route:string){onAction({type:'navigate',value:route})}
 function chooseMode(next:Mode){setMode(next);saveLocal('composer-mode-v2',next);setPanel(next==='PPT生成'?'ppt':'');setPpt('');setKeyboard(false);setKnowledgeLinked(false);setScope('全部');setError('')}
 function toggle(next:string){setPanel(panel===next?'':next);setKeyboard(false)}
 function focusInput(){if(!(navigator.maxTouchPoints>0&&matchMedia('(pointer:coarse)').matches))setKeyboard(true)}
 function closeKeyboard(){setKeyboard(false);input.current?.blur()}
 function fillInput(value:string){setText(value);setPanel('');requestAnimationFrame(()=>input.current?.focus())}
 function insertKey(key:string){const field=input.current;if(!field)return;const start=field.selectionStart??text.length,end=field.selectionEnd??start;let from=start;if(key==='Backspace'&&start===end)from=start-(Array.from(text.slice(0,start)).at(-1)?.length||0);from=Math.max(0,from);const value=key==='Backspace'?'':key;setText(text.slice(0,from)+value+text.slice(end));requestAnimationFrame(()=>{field.focus({preventScroll:true});field.setSelectionRange(from+value.length,from+value.length)})}
 function writingDocument(title:string,content:string,template:string){const id=crypto.randomUUID(),documents=readLocal<Record<string,unknown>[]>('writing-documents',[]);if(!saveLocal('writing-documents',[{id,title,content,template,createdAt:new Date().toISOString()},...documents])){setError('保存失败，请保留输入内容后重试');return}setText('');setPanel('');navigate('writing-document?'+new URLSearchParams({id}))}
 function submit(event:FormEvent){event.preventDefault();if(!text.trim())return;setError('');setKeyboard(false);input.current?.blur();
  if(mode==='PPT生成'){if(!ppt){setPanel('ppt');return}writingDocument(text.slice(0,30)+' · 演示大纲',text+'\n模板：'+ppt+'\n\n1. 封面：'+text+'\n2. 背景与目标：介绍主题背景及目标。\n3. 现状分析：补充现状、数据与主要问题。\n4. 重点工作：说明行动计划、责任分工与节点。\n5. 总结与展望：汇总成果、风险及下一步安排。','PPT大纲');return}
  if(mode==='智能写作'){saveLocal('writing-draft',{template:'方案策划',prompt:text,deep:false,showTemplates:true});navigate('writing');return}
  if(mode==='智能摘要'){const sentences=text.trim().split(/(?<=[。！？!?；;\n])/).map(value=>value.trim()).filter(Boolean);writingDocument(summary,summary+'\n\n'+sentences.slice(0,5).map((sentence,index)=>(index+1)+'. '+sentence).join('\n')+'\n\n原文\n'+text,'智能摘要');return}
  onSend(text.trim());setText('');setPanel('');
 }
 const option=(label:string,icon:ReactNode,click:()=>void,{pressed,chevron=false,arrow=!!mode,aria=label}:{pressed?:boolean;chevron?:boolean;arrow?:boolean;aria?:string}={})=><button key={aria} type="button" aria-label={aria} aria-pressed={pressed} onClick={click}><span>{icon}<span className="composer-tool-label">{label}</span>{chevron&&<ChevronDown size={14}/>} {arrow&&<ChevronRight className="composer-option-arrow" size={17}/>}</span></button>;
 const modelOption=option(mode?model:'模型',mode?null:<img className="composer-model-icon" src="/assets/ui/model-aether.png" alt=""/>,()=>toggle('model'),{chevron:true,aria:'切换模型，当前 '+model});
 const networkOption=option(network?'已联网':'未联网',<Globe size={16}/>,()=>setNetwork(!network),{pressed:network});
 const knowledgeOption=(linked=false)=>option(linked?'联动知识库':'知识库',<BookOpen size={16}/>,()=>linked?setKnowledgeLinked(true):navigate('knowledge?select=writing&return=chat'),linked?{pressed:knowledgeLinked}:{}) ;
 return <div ref={root} onPointerDownCapture={event=>{if(keyboard&&event.target instanceof Element&&event.target.closest('button'))event.preventDefault()}} className={'composer composer-enhanced'+(!mode?' is-default':' has-agent')}>
  <div className={mode?'composer-agent-card':undefined}>
   {mode&&<header className="composer-agent-header"><button type="button" aria-label="切换智能体" onClick={()=>toggle('agents')}>{mode}</button><CloseButton aria-label={'移除'+mode+'模式'} onClick={()=>chooseMode('')}/></header>}
   {mode!=='智能问答'&&<div className="composer-options" aria-label="AI 输入工具">
   {!mode?<>{modelOption}{networkOption}{(['智能问答','智能问数','智能写作','智能摘要'] as Mode[]).map(value=>option(value,modeIcon(value),()=>chooseMode(value)))}<button className="composer-tools-grid" type="button" aria-label="切换智能体" onClick={()=>toggle('agents')}><span><Grid2X2 size={16}/></span></button></>:mode==='智能问数'?<>{option('分享管理',<Share2 size={16}/>,()=>navigate('scheduled-shares'))}{option('技能树',<Layers size={16}/>,()=>{closeKeyboard();navigate('skill-tree')})}</>:mode==='智能写作'?<>{knowledgeOption()}{option('提示词模板',<FileText size={16}/>,()=>toggle('templates'))}</>:mode==='智能摘要'?<>{option('模板',<FileText size={16}/>,()=>{setKnowledgeLinked(false);toggle('summary')},{pressed:!knowledgeLinked})}{knowledgeOption(true)}</>:mode==='AI+财务自动差旅'?<>{option('模板',<FileText size={16}/>,()=>toggle('templates'))}{option('单据记录',<ReceiptText size={16}/>,()=>onAction({type:'travel-documents',value:'单据记录'}))}</>:<>{option('模板',<Presentation size={16}/>,()=>toggle('ppt'),{aria:'PPT生成'})}</>}
   </div>}
   <form className="composer-input" onSubmit={submit}>
    {mode==='PPT生成'&&ppt&&<div className="composer-chosen-template"><Presentation size={13}/>已选 {ppt}<button aria-label="移除PPT模板" type="button" onClick={()=>setPpt('')}>×</button></div>}
    <div className="composer-default-entry"><button type="button" className="composer-add" aria-label="添加附件与工具" onClick={()=>toggle('attachments')}><Plus size={18}/></button><input ref={input} aria-label="请输入您的问题" placeholder="请输入您的问题" value={text} onFocus={focusInput} onBlur={()=>setKeyboard(false)} onChange={event=>setText(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&event.nativeEvent.isComposing)event.preventDefault()}}/><button className="send-button" type={text.trim()?'submit':'button'} aria-label={text.trim()?'发送消息':'语音输入'} onClick={()=>{if(!text.trim()){closeKeyboard();onAction({type:'voice',value:'语音输入'})}}}>{text.trim()?<ArrowUp size={20}/>:<Mic size={20}/>}</button></div>
   </form>
  </div>
  <input className="composer-hidden-file" ref={attachment} aria-label="添加文本附件" type="file" accept=".txt,.md,.csv" onChange={async event=>{const file=event.target.files?.[0];if(!file)return;if(file.size>5*1024*1024){setError('请选择 5MB 以内的文本文件');return}try{fillInput(await file.text());setError('')}catch{setError('文件读取失败，请重试')}event.target.value=''}}/>
  {device&&panel==='agents'&&<ComposerSheet device={device} title="切换智能体" closeLabel="关闭切换智能体" close={()=>setPanel('')} dialogRef={dialog} compact><div className="composer-agent-list">{modes.map(value=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>chooseMode(value)}>{modeIcon(value)}<span>{value}</span>{mode===value&&<Check size={16}/>}</button>)}</div></ComposerSheet>}
  {device&&panel==='summary'&&<ComposerSheet device={device} title="摘要模板" closeLabel="关闭摘要模板" close={()=>setPanel('')} dialogRef={dialog} compact><div className="composer-summary-list">{summaryTypes.map(value=><button key={value} type="button" aria-pressed={summary===value} onClick={()=>{setSummary(value);setPanel('');requestAnimationFrame(()=>input.current?.focus())}}><FileText size={18}/><span>{value}</span></button>)}</div></ComposerSheet>}
  {device&&panel==='attachments'&&<ComposerSheet device={device} title="附件与工具" closeLabel="关闭附件与工具" close={()=>setPanel('')} dialogRef={dialog} compact><div className="composer-agent-list"><button type="button" onClick={()=>attachment.current?.click()}><FileText size={18}/>添加文本附件</button><button type="button" onClick={()=>setPanel('agents')}><Grid2X2 size={18}/>切换智能体</button><button type="button" onClick={()=>{setPanel('');onAction({type:'ai-tools',value:'AI 工具'})}}><Sparkles size={18}/>更多 AI 工具</button></div></ComposerSheet>}
  {panel==='ppt'&&device&&<PptPicker device={device} selected={ppt} close={()=>setPanel('')} choose={template=>{setPpt(template.name);setPanel('');requestAnimationFrame(()=>input.current?.focus())}}/>}
  {panel==='templates'&&device&&<PromptPicker device={device} kind={mode==='AI+财务自动差旅'?'travel':'writing'} scope={scope} setScope={setScope} close={()=>setPanel('')} choose={fillInput}/>}
  {panel==='model'&&device&&<ModelPicker device={device} selected={model} close={()=>setPanel('')} choose={value=>{setModel(value);saveLocal('composer-model',value);setPanel('')}}/>}
  {keyboard&&!panel&&device&&<PreviewKeyboard device={device} insert={insertKey} close={closeKeyboard} canSend={!!text.trim()} send={()=>input.current?.form?.requestSubmit()}/>}
  {error&&<p className="composer-error" role="alert">{error}</p>}<div className="home-indicator"/>
 </div>;
}
