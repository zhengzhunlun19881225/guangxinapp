import {ChevronLeft,FileText,Paperclip} from 'lucide-react';
import {assets} from '../assets';
import article from '../data/groupDetail.json';
import './GroupNewsDetail.css';

export default function GroupNewsDetail({locationKey,height,navigate}:{locationKey:string;height:number;navigate:(route:string)=>void}){
 const query=new URLSearchParams(locationKey.split('?')[1]||''),origin=['portal-leader','portal-manager','portal-staff'].includes(query.get('origin')||'')?query.get('origin')!:'portal-leader';
 return <section className="group-detail-page" style={{height}}>
  <div className="portal-news-status"><span>19:41</span><div><img src={assets.chat.imgCellularConnection} alt=""/><img src={assets.chat.imgWifi} alt=""/><img src={assets.chat.imgBattery} alt=""/></div></div>
  <header className="group-detail-nav"><button aria-label="返回集团资讯" onClick={()=>navigate(origin)}><ChevronLeft size={22}/></button><h1>资讯详情</h1><span/></header>
  <div className="group-detail-scroll"><GroupNewsArticle/></div>
  <div className="portal-news-home"><div className="home-indicator"/></div>
 </section>;
}

export function GroupNewsArticle({titleId}:{titleId?:string}){
 return <article className="group-detail-article">
    <header><h2 id={titleId}>{article.title}</h2><div className="group-detail-meta"><time dateTime="2025-10-30T09:03:00">{article.publishedAt}</time><span>{article.publisher}</span></div></header>
    <img className="group-detail-hero" src="/assets/portal-news/group-detail-city.webp" alt="城市产业园区"/>
    <p>{article.paragraphs[0]}</p><p>{article.paragraphs[1]}</p>
    <img className="group-detail-inline" src="/assets/portal-news/group-detail-people.webp" alt="交流活动配图" loading="lazy"/>
    <p>{article.paragraphs[2]}</p><p>{article.paragraphs[3]}</p>
    <section className="group-detail-attachments" aria-labelledby="group-attachments-title"><h3 id="group-attachments-title"><Paperclip size={16}/>附件 (2)</h3>
     {[['reference-article.pdf',article.title+'.pdf'],['reference-article-images.pdf',article.title+'-图文附件.pdf']].map(([file,name])=><a key={file} href={'/assets/portal-news/'+file} download={name} aria-label={'下载附件：'+name}><span className="group-attachment-icon"><FileText size={18}/></span><span title={name}>{name}</span></a>)}
    </section>
   </article>;
}
