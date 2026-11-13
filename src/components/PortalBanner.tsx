import type {SceneProps} from './SceneAction';
import {portalNews} from '../data/portalNews';
import {usePagedCarousel} from './usePagedCarousel';
import './PortalBanner.css';

const cases=[
 {id:'ai-3',title:'供应链协同，推动高效交付',tag:'供应链',subtitle:'采购与物流高效衔接'},
 {id:'ai-1',title:'智慧园区建设，让服务更高效',tag:'智慧园区',subtitle:'统一入口，提升运营体验'},
 {id:'ai-2',title:'绿色材料创新，拓展应用新空间',tag:'绿色创新',subtitle:'研发协作，助力低碳发展'},
 {id:'ai-0',title:'产业协同合作，共探数字化转型',tag:'产业协同',subtitle:'连接业务，汇聚发展合力'},
 {id:'ai-4',title:'企业数据治理，让数据发挥价值',tag:'数据治理',subtitle:'规范共享，支撑场景应用'},
].map(item=>({...item,image:portalNews.find(news=>news.id===item.id)!.image}));

export default function PortalBanner({onAction}:SceneProps){
 const {page,track,goToPage,bindings}=usePagedCarousel(cases.length);
 return <section className="portal-banner" aria-label="案例海报" aria-roledescription="轮播">
  <div className="portal-banner-track" ref={track} {...bindings} tabIndex={0} aria-label="左右滑动查看案例海报">
   {cases.map((item,index)=><div className="portal-banner-slide" key={item.id} inert={index!==page} role="group" aria-label={'案例 '+(index+1)+'，共 '+cases.length+' 个'}>
    <button className="portal-banner-case" aria-label={item.title+'，查看详情'} onClick={()=>onAction({type:'portal-news-detail',value:item.id})}>
     <img src={item.image} alt="" draggable={false}/><span className="portal-banner-shade"/>
     <span className="portal-banner-copy"><strong>{item.title}</strong><span className="portal-banner-caption"><span>{item.tag}</span><span>{item.subtitle}</span></span></span>
    </button>
   </div>)}
  </div>
  <nav className="portal-banner-pagination" aria-label="海报案例切换">{cases.map((item,index)=><button key={item.id} aria-label={'查看第'+(index+1)+'个案例'} aria-current={index===page?'page':undefined} onClick={()=>goToPage(index)}><span/></button>)}</nav>
 </section>;
}
