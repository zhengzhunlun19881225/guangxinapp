import {useEffect,useId,useRef,useState} from 'react';
import {BellPlus,ChevronLeft,ChevronRight,Search,X} from 'lucide-react';
import {assets} from '../assets';
import {categoryNews,newsCategories,newsCategory,portalNews,type NewsCategory,type NewsItem,type NewsFeedback} from '../data/portalNews';
import type {Action,SceneProps} from './SceneAction';
import type {NewsSubscription} from '../data/newsSubscription';
import {NewsTabs} from './NewsTabs';
import './PortalNews.css';

function NewsTags({item,important=false}:{item:NewsItem;important?:boolean}){
 return <span className="portal-news-tags"><span>{item.category}</span>{item.featured&&<span className="is-featured">{important?'重点资讯':'精选'}</span>}</span>;
}
function NewsMeta({item}:{item:NewsItem}){
 return <span className="portal-news-meta"><time dateTime={item.date}>{item.date}</time><span>{item.source}</span></span>;
}
export default function PortalNews({route,onAction,subscription}:{route:string;subscription:NewsSubscription|null}&SceneProps){
 const [category,setCategory]=useState<NewsCategory>('推荐'),track=useRef<HTMLDivElement>(null),id=useId();
 const panelId=id+'-cards';
 function change(value:NewsCategory){setCategory(value);track.current?.scrollTo({left:0})}
 return <section className="portal-news" aria-labelledby={id+'-heading'} data-portal={route}>
  <header><h2 id={id+'-heading'}><img src="/assets/workbench/section-accent.png" alt=""/>AI 智能资讯</h2>
   <button aria-label="更多AI智能资讯" onClick={()=>onAction({type:'navigate',value:'portal-news?'+new URLSearchParams({category,origin:route})})}>更多<ChevronRight size={14}/></button>
  </header>
  <NewsTabs categories={newsCategories} category={category} onChange={change} panelId={panelId}/>
  <div ref={track} id={panelId} className="portal-news-track" role="tabpanel" aria-labelledby={panelId+'-tab-'+newsCategories.indexOf(category)}>
   {categoryNews(category,subscription).map(item=><button className="portal-news-card" key={item.id} aria-label={item.title} onClick={()=>onAction({type:'portal-news-detail',value:item.id})}>
    <img className="portal-news-photo" src={item.image} alt="" loading="lazy"/>
    <span className="portal-news-card-copy"><NewsTags item={item} important={!!subscription?.important&&category==='我关注的'}/><strong>{item.title}</strong><span className="portal-news-summary">{item.summary}</span><NewsMeta item={item}/></span>
   </button>)}
   {!categoryNews(category,subscription).length&&<p className="portal-news-empty">暂无匹配资讯</p>}
  </div>
 </section>;
}

export function PortalNewsPage({locationKey,height,navigate,onAction,subscription}:{locationKey:string;height:number;navigate:(route:string)=>void;onAction:(action:Action)=>void;subscription:NewsSubscription|null}){
 const query=new URLSearchParams(locationKey.split('?')[1]||''),category=newsCategory(query.get('category')),id=useId(),panelId=id+'-list';
 const [searchOpen,setSearchOpen]=useState(false),[search,setSearch]=useState('');
 const searchInput=useRef<HTMLInputElement>(null),searchButton=useRef<HTMLButtonElement>(null),list=useRef<HTMLDivElement>(null);
 const items=categoryNews(category,subscription,search);
 useEffect(()=>{if(searchOpen)searchInput.current?.focus()},[searchOpen]);
 useEffect(()=>{list.current?.scrollTo({top:0})},[search,category]);
 useEffect(()=>{setSearch('')},[subscription]);
 function closeSearch(){setSearchOpen(false);setSearch('');searchButton.current?.focus()}
 const origin=['portal-staff','portal-manager','portal-leader'].includes(query.get('origin')||'')?query.get('origin')!:'portal-leader';
 return <section className="portal-news-page" style={{height}}>
  <div className="portal-news-status"><span>19:41</span><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
  <header className="portal-news-nav"><button aria-label="返回门户" onClick={()=>navigate(origin)}><ChevronLeft size={22}/></button><h1>AI 智能资讯</h1><div className="portal-news-tools"><button aria-label="资讯订阅设置" title="订阅" onClick={()=>onAction({type:'news-subscription',value:'资讯订阅设置'})}><BellPlus size={20}/></button><button ref={searchButton} aria-label="搜索资讯" title="搜索" aria-expanded={searchOpen} aria-controls={id+'-search'} onClick={()=>searchOpen?closeSearch():setSearchOpen(true)}><Search size={20}/></button></div></header>
  {searchOpen&&<div className="portal-news-search" id={id+'-search'}><div><Search size={16} aria-hidden="true"/><input ref={searchInput} aria-label="搜索资讯标题或内容" placeholder="搜索资讯标题或内容" value={search} onChange={event=>setSearch(event.target.value)} onKeyDown={event=>{if(event.key==='Escape'){event.stopPropagation();closeSearch()}}}/>{search&&<button aria-label="清空资讯搜索" onClick={()=>{setSearch('');searchInput.current?.focus()}}><X size={16}/></button>}</div><button onClick={closeSearch}>取消</button></div>}
  <NewsTabs categories={newsCategories} category={category} panelId={panelId} onChange={next=>navigate('portal-news?'+new URLSearchParams({origin,category:next}))}/>
  <div className="portal-news-list" ref={list} id={panelId} role="tabpanel" aria-labelledby={panelId+'-tab-'+newsCategories.indexOf(category)} key={category}>
   {items.map(item=><button className="portal-news-row" key={item.id} aria-label={item.title} onClick={()=>onAction({type:'portal-news-detail',value:item.id})}>
    <img src={item.image} alt="" loading="lazy"/>
    <span className="portal-news-row-copy"><strong>{item.title}</strong><NewsTags item={item} important={!!subscription?.important&&category==='我关注的'}/><NewsMeta item={item}/></span>
   </button>)}
   {!items.length&&<div className="portal-news-empty" role="status"><p>暂无匹配资讯</p>{search?<button onClick={()=>setSearch('')}>清除搜索</button>:subscription&&category==='我关注的'?<button onClick={()=>onAction({type:'news-subscription',value:'资讯订阅设置'})}>调整订阅</button>:null}</div>}
  </div>
  <div className="portal-news-home"><div className="home-indicator"/></div>
 </section>;
}

export function PortalNewsDetail({id,feedback,onFeedback}:{id:string;feedback?:NewsFeedback;onFeedback:(value:NewsFeedback)=>void}){
 const item=portalNews.find(news=>news.id===id);
 if(!item)return <p className="empty-state">未找到这篇资讯</p>;
 return <article className="portal-news-article"><h3 id="modal-title">{item.title}</h3><NewsTags item={item}/><div className="portal-news-article-meta"><NewsMeta item={item}/><div className="portal-news-feedback" role="group" aria-label="资讯偏好">{([{value:'interested',label:'感兴趣'},{value:'less',label:'减少此类'}] as const).map(option=><button type="button" key={option.value} aria-pressed={feedback===option.value} onClick={()=>onFeedback(option.value)}><span className="portal-news-feedback-label"><span className="portal-news-feedback-icon" aria-hidden="true" style={{maskImage:'url(/assets/portal-news/feedback-'+option.value+(feedback===option.value?'-selected':'')+'.svg)'}}/>{option.label}</span></button>)}</div></div><img src={item.image} alt=""/>{item.paragraphs.length?item.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>):<p className="empty-state" role="status">暂无正文</p>}</article>;
}
