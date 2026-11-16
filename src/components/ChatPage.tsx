import {useId,useRef,useState} from 'react';
import {ChevronLeft,MessageCirclePlus,X,Volume2,Copy,Download,RotateCw,ThumbsUp,ThumbsDown,FileText,FileType} from 'lucide-react';
import AppNavBar from './AppNavBar';
import {assets} from '../assets';
import type {Message} from '../data';
import type {Action} from './SceneAction';
import {FeatureCards,Suggestions} from './Controls';
import {copyText,downloadText} from '../features/data';
import {ComposerAttachmentPreview} from './ComposerAttachments';
import {attachmentSize,type ComposerAttachment} from './attachmentStore';
import AiToolIcon from './AiToolIcon';
import './ChatPage.css';

type Props={hideWelcome:boolean;active:boolean;messages:Message[];selectedAgent:string;history:string[];height:number;onAction:(action:Action)=>void;onHome:()=>void;onClearAgent:()=>void};

function AiAnswerCard({message,onAction}:{message:Message;onAction:(action:Action)=>void}){
 const answer=message.text,answerTitle=message.title||answer.split('\n')[0].slice(0,60)||'AI回答';
 const body=message.title&&answer.startsWith(message.title)?answer.slice(message.title.length).trim():answer;
 const references=message.references||[];
 const [expanded,setExpanded]=useState(false),referenceId=useId();
 return <article className="ai-answer-card" aria-label={'AI回答：'+answerTitle}>
  {message.title&&<h2>{message.title}</h2>}
  {body.split(/\n\s*\n/).filter(Boolean).map((block,index)=>{
   const [heading,...lines]=block.split('\n');
   return <section key={index}>{lines.length&&/^[一二三四五六七八九十]+、/.test(heading)?<><h3>{heading}</h3><p>{lines.join('\n')}</p></>:<p>{block}</p>}</section>;
  })}
  {!!references.length&&<><div className="ai-reference-heading"><strong>引用</strong><button type="button" onClick={()=>setExpanded(value=>!value)} aria-expanded={expanded} aria-controls={referenceId}>{expanded?'收起':'展开'}</button></div>
  {expanded&&<div id={referenceId} className="ai-references">{references.map(({id,name})=><div className="ai-reference" key={id}><span className={'ai-reference-icon '+(/\.pdf$/i.test(name)?'pdf':'doc')}>{/\.pdf$/i.test(name)?<FileType size={14}/>:<FileText size={14}/>}</span><span>{name}</span></div>)}</div>}</>}
  <div className={'ai-answer-actions'+(references.length&&expanded?' has-references':'')}><button aria-label="朗读回答"><Volume2 size={17}/></button><button aria-label="复制回答" onClick={()=>copyText(answer).catch(()=>onAction({type:'external-app-tip',value:'请使用系统复制操作'}))}><Copy size={17}/></button><button aria-label="下载回答" onClick={()=>downloadText(answer,answerTitle+'.txt')}><Download size={17}/></button><button aria-label="重新生成"><RotateCw size={17}/></button><button aria-label="分享回答" onClick={()=>onAction({type:'share-answer',value:answer})}><AiToolIcon name="share" size={17}/></button><i/><button aria-label="赞" onClick={()=>onAction({type:'answer-feedback',value:'positive'})}><ThumbsUp size={17}/></button><button aria-label="踩" onClick={()=>onAction({type:'answer-feedback',value:'negative'})}><ThumbsDown size={17}/></button></div>
 </article>;
}
export default function ChatPage({hideWelcome,active,messages,selectedAgent,history,height,onAction,onHome,onClearAgent}:Props){
 const root=useRef<HTMLElement>(null),[preview,setPreview]=useState<ComposerAttachment|null>(null);
 return <section ref={root} className="chat-page" style={{minHeight:height}}>
  <header className="chat-header">
   <div className="chat-status"><time>19:41</time><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
   <AppNavBar className="chat-navbar" label="小新 AI 导航" title={<div className="chat-nav-heading"><h1>广智新</h1><p>内容由AI生成仅供参考</p></div>} left={<><button className="chat-nav-action" aria-label={active?'返回 AI 首页':'返回工作台'} onClick={()=>active?onHome():onAction({type:'navigate',value:'workbench'})}><ChevronLeft size={22}/></button><button className="chat-nav-action" aria-label="打开历史记录" onClick={()=>onAction({type:'navigate',value:'history'})}><svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4 5h14M4 11h14M4 17h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg></button></>} right={<button className="chat-nav-action" aria-label="新建对话" onClick={()=>onAction({type:'new-chat',value:'新建对话'})}><MessageCirclePlus size={22} aria-hidden="true"/></button>}/>

  </header>
   {selectedAgent&&<button className="chat-selected-agent" onClick={onClearAgent}>{selectedAgent}<X size={14}/></button>}
  {!active?<>{!hideWelcome&&<div className="chat-welcome"><h2>您好，欢迎使用广智新</h2><FeatureCards onAction={onAction}/><Suggestions onAction={onAction}/></div>}</>:<>
   <section className="ai-messages" aria-label="AI 对话">{messages.map((message,index)=><div className={'message '+message.role} key={index}>{message.role==='assistant'?(message.plain?<p>{message.text}</p>:<AiAnswerCard message={message} onAction={onAction}/>):<><p>{message.text}</p>{!!message.attachments?.length&&<div className="message-attachments" aria-label="已发送附件">{message.attachments.map(item=><button type="button" className="message-attachment" key={item.id} onClick={()=>setPreview(item)} aria-label={'预览已发送附件 '+item.name}><FileText size={22}/><span><strong>{item.name}</strong><small>{attachmentSize(item.size)} · {item.source}</small></span></button>)}</div>}</>}</div>)}</section>
  </>}
 {preview&&root.current?.closest<HTMLElement>('.device')&&<ComposerAttachmentPreview device={root.current.closest<HTMLElement>('.device')!} item={preview} close={()=>setPreview(null)}/>}
 </section>;
}
