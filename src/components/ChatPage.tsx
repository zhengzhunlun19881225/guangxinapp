import {useState} from 'react';
import {Menu,X,Volume2,Copy,Download,RotateCw,Share2,ThumbsUp,ThumbsDown,FileText,FileType} from 'lucide-react';
import AppNavBar,{NavBackIcon} from './AppNavBar';
import {assets} from '../assets';
import type {Message} from '../data';
import type {Action} from './SceneAction';
import {FeatureCards,Suggestions} from './Controls';
import {copyText,downloadText} from '../features/data';
import './ChatPage.css';

type Props={active:boolean;messages:Message[];selectedAgent:string;history:string[];height:number;onAction:(action:Action)=>void;onHome:()=>void;onClearAgent:()=>void};

const answerTitle='数据监测与优化策略';
const answerSections=[
 ['一、关键指标','为贯彻落实政府服务数字化转型要求，提升服务效率与质量，建议加快推进智能问答与反检系统建设。智能问答系统通过知识库与语义理解，实现高频问题自动应答与复杂问题智能转接，有效提升服务效率与群众满意度；质检系统通过全量质检与环节管理，强化服务过程监控与风险防控，推动服务质量持续优化。两系统应协同联动，形成“服务一质量一改进”闭环机制，实现数据共享与动态优化。'],
 ['二、当前存在的问题','两系统应协同协同，形成“服务一质检一改进”闭环机制，实现数据共享与动态优化。建议优先采用成熟技术方案，结合本地实际进行定制开发，同步推进组织架构调整与人员培训，准确服务以式由“人工为主”向“智能以自”转变。促进试点先行、逐步推广，极速高效，使您、智能的政务。身体系，全面提升政务服务效能与管理水平。']
];
const references=['知识库名称和知识库名称和知识库名称.doc','知识库名称和知识库名称和知识库名称…','知识库名称和知识库名称和知识库名称.doc','知识库名称.pdf'];

function AiAnswerCard({onAction}:{onAction:(action:Action)=>void}){
 const answer=answerTitle+'\n\n'+answerSections.map(parts=>parts.join('\n')).join('\n\n');
 const [expanded,setExpanded]=useState(false);
 return <article className="ai-answer-card" aria-label="AI回答：数据监测与优化策略">
  <h2>{answerTitle}</h2>
  {answerSections.map(([heading,body])=><section key={heading}><h3>{heading}</h3><p>{body}</p></section>)}
  <div className="ai-reference-heading"><strong>引用</strong><button type="button" onClick={()=>setExpanded(value=>!value)} aria-expanded={expanded}>{expanded?'收起':'展开'}</button></div>
  <div className="ai-references">{references.map((name,index)=><div className="ai-reference" key={name}><span className={'ai-reference-icon '+(index===3?'pdf':'doc')}>{index===3?<FileType size={14}/>:<FileText size={14}/>}</span><span>{name}</span></div>)}</div>
  {expanded&&<div className="ai-reference-menu" role="menu" aria-label="引用文件类型"><button role="menuitem" type="button"><span className="ai-menu-icon word"><FileText size={17}/></span>Word</button><button role="menuitem" type="button"><span className="ai-menu-icon pdf"><FileType size={17}/></span>PDF</button></div>}
  <div style={{display:'flex',gap:16}}><button onClick={()=>onAction({type:'navigate',value:'writing-document?id=strategy'})}>查看与编辑</button><button onClick={()=>onAction({type:'navigate',value:'scheduled-shares?new=1&prompt='+encodeURIComponent(answerTitle)})}>定时分享</button></div>
  <div className="ai-answer-actions"><button aria-label="朗读回答"><Volume2 size={17}/></button><button aria-label="复制回答" onClick={()=>copyText(answer).catch(()=>onAction({type:'external-app-tip',value:'请使用系统复制操作'}))}><Copy size={17}/></button><button aria-label="下载回答" onClick={()=>downloadText(answer,answerTitle+'.txt')}><Download size={17}/></button><button aria-label="重新生成"><RotateCw size={17}/></button><button aria-label="分享回答" onClick={()=>onAction({type:'share-answer',value:answer})}><Share2 size={17}/></button><i/><button aria-label="赞"><ThumbsUp size={17}/></button><button aria-label="踩"><ThumbsDown size={17}/></button></div>
 </article>;
}
export default function ChatPage({active,messages,selectedAgent,history,height,onAction,onHome,onClearAgent}:Props){
 return <section className="chat-page" style={{minHeight:height}}>
  <header className="chat-header">
   <div className="chat-status"><time>19:41</time><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
   <AppNavBar label="小新 AI 导航" title="广智新" left={<><button aria-label={active?'返回 AI 首页':'返回工作台'} onClick={()=>active?onHome():onAction({type:'navigate',value:'workbench'})}><NavBackIcon/></button><button aria-label="打开历史记录" onClick={()=>onAction({type:'navigate',value:'history'})}><Menu size={22}/></button></>}/>
  </header>
  {!active?<div className="chat-welcome"><h2>您好，欢迎使用广智新</h2><FeatureCards onAction={onAction}/><Suggestions history={history} onAction={onAction}/></div>:<>
   {selectedAgent&&<button className="chat-selected-agent" onClick={onClearAgent}>{selectedAgent}<X size={14}/></button>}
   <section className="ai-messages" aria-label="AI 对话">{messages.map((message,index)=><div className={'message '+message.role} key={index}>{message.role==='assistant'?<AiAnswerCard onAction={onAction}/>:<><small>我</small><p>{message.text}</p></>}</div>)}</section>
  </>}
 </section>;
}
