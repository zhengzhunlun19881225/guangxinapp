import {useRef,useState,type ReactNode} from 'react';
import {Search,Trash2,X} from 'lucide-react';
import {agents,skills,imageFor,readLocal,saveLocal} from '../data';
import {people} from '../im/data';
import {allApps} from '../apps/data';
import AppIcon from '../apps/AppIcon';
import type {Action} from './SceneAction';
import './GlobalSearch.css';

type Category='全部'|'通讯录'|'系统应用'|'智能体&Skill';
type Result={id:string;name:string;description:string;group:'通讯录'|'系统应用'|'智能体'|'Skill';tag:string;icon:ReactNode;action:Action};
const categories:Category[]=['全部','通讯录','系统应用','智能体&Skill'];
const displayNames:Record<string,string>={'AI智写':'智能写作','智能数据':'智能问数'};
const descriptions:Record<string,string>={'智能问答':'企业知识问答与日常工作协助','AI智写':'快速生成高质量文案','AI+财务自动差旅':'出差申请、财务模板与单据管理','智能摘要':'提炼长文章的关键信息，节省阅读时间','智能数据':'定位关键数据，生成可视化报表并进行分析','法智小新':'企业法律法规查询与业务咨询','表格工具':'表格整理、计算与数据处理','泰语翻译':'中文与泰语互译','天气查询':'查询城市天气与出行信息','合同审查':'识别合同条款与潜在风险','智能填表':'根据资料协助填写表单','AI图片':'根据描述生成图片'};
const historyKey='global-search-history';
const historyExamplesKey='global-search-history-examples-v1';
const historyExamples=['智能','OA','财务报表','合同','出差申请','集团通讯录','我的发票','年度经营分析','知识库','智能写作','请休假','数字化创新大赛','集团2026年度预算','项目审批流程'];
function loadHistory(){
 const value=readLocal<unknown>(historyKey,[]);
 const saved=Array.isArray(value)?[...new Set(value.filter((item):item is string=>typeof item==='string'&&!!item.trim()))].slice(0,20):[];
 if(readLocal(historyExamplesKey,false))return saved;
 const examples=[...new Set([...saved,...historyExamples])].slice(0,20);
 if(saveLocal(historyKey,examples))saveLocal(historyExamplesKey,true);
 return examples;
}

export default function GlobalSearch({onSelect,notify}:{onSelect:(action:Action)=>void;notify:(text:string)=>void}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState<Category>('全部'),[history,setHistory]=useState(loadHistory),[confirmClear,setConfirmClear]=useState(false);
 const input=useRef<HTMLInputElement>(null),scroll=useRef<HTMLDivElement>(null),term=query.trim();
 const results:Result[]=[
  ...people.map(person=>({id:'person-'+person.id,name:person.name,description:person.job,group:'通讯录' as const,tag:'通讯录',icon:<img src={person.avatar} alt=""/>,action:{type:'conversation',value:person.name}})),
  ...allApps.map(app=>({id:'app-'+app.id,name:app.name,description:app.category==='全部系统'?'企业业务系统':app.category+' · 常用功能',group:'系统应用' as const,tag:app.category==='全部系统'?'系统':'应用',icon:<AppIcon app={app} system={app.category==='全部系统'}/>,action:app.action})),
  ...([...agents,...skills]).map((item,index)=>({id:(index<agents.length?'agent-':'skill-')+item.name,name:displayNames[item.name]||item.name,description:descriptions[item.name]||item.intro,group:index<agents.length?'智能体' as const:'Skill' as const,tag:'默认',icon:<span className={'app-icon '+item.color}><img src={imageFor(item.icon)} alt=""/></span>,action:{type:'agent',value:item.name}})),
 ];
 const matched=results.filter(item=>(item.name+' '+item.description).toLocaleLowerCase().includes(term.toLocaleLowerCase()));
 const visible=matched.filter(item=>category==='全部'||category==='智能体&Skill'&&['智能体','Skill'].includes(item.group)||item.group===category);
 function store(next:string[]){if(!saveLocal(historyKey,next)){notify('搜索历史保存失败，请重试');return false}setHistory(next);return true}
 function remember(value=term){if(value)store([value,...history.filter(item=>item!==value)].slice(0,20))}
 function change(value:string){setQuery(value);setConfirmClear(false);scroll.current?.scrollTo(0,0)}
 function selectCategory(value:Category){setCategory(value);scroll.current?.scrollTo(0,0)}
 function open(result:Result){remember();onSelect(result.action)}
 function row(result:Result){return <button className="global-search-result" key={result.id} onClick={()=>open(result)}><span className="global-search-avatar">{result.icon}</span><span className="global-search-copy"><strong>{result.name}</strong><small>{result.description}</small></span><span className="global-search-tag">{result.tag}</span></button>}
 return <div className="global-search">
  <form className="global-search-field" role="search" onSubmit={event=>{event.preventDefault();remember();input.current?.blur()}}><Search size={16} aria-hidden="true"/><input ref={input} aria-label="全局搜索关键词" placeholder="请输入关键字搜索" value={query} onChange={event=>change(event.target.value)}/>{query&&<button type="button" aria-label="清空搜索" onClick={()=>{change('');input.current?.focus()}}><X size={16}/></button>}</form>
  {term&&<div className="global-search-tabs" role="tablist" aria-label="全局搜索分类">{categories.map((item,index)=><button key={item} type="button" role="tab" id={'global-search-tab-'+index} aria-selected={category===item} aria-controls="global-search-panel" tabIndex={category===item?0:-1} onClick={()=>selectCategory(item)} onKeyDown={event=>{const step=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;if(!step&&!['Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?categories.length-1:(index+step+categories.length)%categories.length;selectCategory(categories[next]);document.getElementById('global-search-tab-'+next)?.focus()}}>{item}</button>)}</div>}
  <div className="global-search-scroll" ref={scroll}>
   {!term?<section className="global-search-history"><header><h3>历史搜索</h3>{history.length>0&&<button onClick={()=>setConfirmClear(true)}><Trash2 size={14}/>全部清空</button>}</header>
    {confirmClear&&<div className="global-search-clear" role="alert"><span>清空全部搜索历史？</span><button onClick={()=>setConfirmClear(false)}>取消</button><button onClick={()=>{if(store([]))setConfirmClear(false)}}>确定</button></div>}
    <div className="global-search-history-items">{history.map(item=><div className="global-search-history-row" key={item}><button title={item} onClick={()=>{change(item);remember(item)}}>{item}</button><button aria-label={'删除搜索历史：'+item} onClick={()=>store(history.filter(value=>value!==item))}><X size={12}/></button></div>)}</div>
    {!history.length&&<p className="global-search-empty" role="status">暂无搜索历史</p>}
   </section>:<div id="global-search-panel" role="tabpanel" aria-labelledby={'global-search-tab-'+categories.indexOf(category)}><p className="global-search-count" role="status">共 {visible.length} 项</p>
    {(['通讯录','系统应用','智能体','Skill'] as const).filter(group=>visible.some(item=>item.group===group)).map(group=>{const items=visible.filter(item=>item.group===group);return <section className="global-search-group" key={group} aria-label={group+'搜索结果'}>{(category==='全部'||category==='智能体&Skill')&&<h3>{group}<span>{items.length}</span></h3>}{(category==='全部'?items.slice(0,3):items).map(row)}{category==='全部'&&items.length>3&&<button className="global-search-more" onClick={()=>selectCategory(group==='智能体'||group==='Skill'?'智能体&Skill':group)}><Search size={15}/>查看全部{group}（{items.length}）</button>}</section>})}
    {!visible.length&&<p className="global-search-empty" role="status">未找到相关内容，请尝试其他关键词</p>}
   </div>}
  </div>
 </div>;
}
