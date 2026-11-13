import {useId,useLayoutEffect,useRef,useState} from 'react';
import {ChevronRight} from 'lucide-react';
import {categoryGroupNews,groupCategories,type GroupCategory,type GroupNewsItem} from '../data/groupNews';
import {NewsTabs} from './NewsTabs';
import type {SceneProps} from './SceneAction';
import './GroupNews.css';

export function GroupNewsRows({items,onAction}:{items:GroupNewsItem[]}&SceneProps){
 return <div className="group-news-rows">{items.map((item,index)=><button key={item.id} className="group-news-row" data-rank={index+1} data-lines={item.lines.length} aria-label={item.title} onClick={()=>onAction({type:'group-news-detail',value:item.id})}>
  <span className="group-news-rank" aria-hidden="true">{index+1}</span>
  <span className="group-news-copy"><strong>{item.lines.map((line,i)=><span key={i}>{line}</span>)}</strong><span className="group-news-meta"><span>{item.source}</span><i aria-hidden="true">·</i><time dateTime={item.date}>{item.displayDate}</time></span></span>
  <img src={item.image} alt="" loading="lazy"/>
 </button>)}</div>;
}
export default function GroupNews({route,onAction,onHeightChange}:{route:string;onHeightChange:(height:number)=>void}&SceneProps){
 const [category,setCategory]=useState<GroupCategory>('最新'),id=useId(),panelId=id+'-group';
 const section=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{const element=section.current;if(!element)return;const measure=()=>onHeightChange(element.offsetHeight);measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect()},[onHeightChange]);
 return <section className="group-news" aria-labelledby={id+'-heading'} ref={section}>
  <header><h2 id={id+'-heading'}><img src="/assets/workbench/section-accent.png" alt=""/>集团综合资讯</h2><button aria-label="更多集团综合资讯" onClick={()=>onAction({type:'external-app-tip',value:'请前往第三方 App 查看更多资讯'})}>更多<ChevronRight size={14}/></button></header>
  <NewsTabs categories={groupCategories} category={category} onChange={setCategory} panelId={panelId}/>
  <div id={panelId} role="tabpanel" aria-labelledby={panelId+'-tab-'+groupCategories.indexOf(category)}><GroupNewsRows items={categoryGroupNews(category)} onAction={onAction}/></div>
 </section>;
}
