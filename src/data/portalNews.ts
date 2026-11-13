import {readLocal} from '../data';
import content from './portalNewsContent.json';
import {subscriptionMatches,relatedMatches,type NewsSubscription} from './newsSubscription';

export const newsCategories=['推荐','我关注的','与我有关','集团要闻','行业趋势'] as const;
export type NewsCategory=typeof newsCategories[number];
const seeds=[
 ['产业协同合作，共探数字化转型新路径','集团要闻','skyline'],
 ['智慧园区建设，提升企业运营服务效率','集团要闻','campus'],
 ['绿色材料创新，拓展产业应用新空间','行业趋势','materials'],
 ['供应链协同，推动采购与物流高效衔接','集团要闻','industry'],
 ['企业数据治理：从规范建设到场景应用','政策法规','collaboration'],
 ['人工智能赋能办公，释放业务创新活力','行业趋势','campus'],
 ['新材料产学研协作，连接研发与应用需求','行业趋势','materials'],
 ['数字化项目建设，聚焦业务价值与协同','集团要闻','skyline'],
 ['企业知识管理，完善文档分类与共享机制','政策法规','campus'],
 ['低碳发展新方向，关注绿色制造实践','行业趋势','industry'],
 ['智能应用建设中的数据安全与权限管理','政策法规','collaboration'],
 ['规范电子文件归档，提升信息利用效率','政策法规','campus'],
];
// The same local demonstration articles and original photos as the PC portal.
export const portalNews=seeds.map(([title,category,image],index)=>({
 id:'ai-'+index,title,category,image:'/assets/portal-news/'+image+'.png',
 summary:content[index][0],paragraphs:content[index],
 date:`2026-11-${String(5-Math.floor(index/3)).padStart(2,'0')}`,
 source:'广新集团',followed:index%2===0,related:index%2===1,featured:index%2===0,
}));
export type NewsItem=typeof portalNews[number];
export function newsCategory(value:string|null):NewsCategory{
 return newsCategories.includes(value as NewsCategory)?value as NewsCategory:'推荐';
}
export function categoryNews(category:NewsCategory,subscription:NewsSubscription|null=null,query=''){
 const keyword=query.trim().toLocaleLowerCase();
 return portalNews.filter(item=>(category==='推荐'||(category==='我关注的'?(subscription?subscriptionMatches(item,subscription):item.followed):category==='与我有关'?(subscription?relatedMatches(item,subscription):item.related):item.category===category))&&`${item.title} ${item.paragraphs.join(' ')}`.toLocaleLowerCase().includes(keyword));
}

export type NewsFeedback='interested'|'less';
export type NewsFeedbackMap=Record<string,NewsFeedback>;
export function readNewsFeedback():NewsFeedbackMap{
 const saved:unknown=readLocal('news-feedback',{});
 if(!saved||typeof saved!=='object'||Array.isArray(saved))return {};
 return Object.fromEntries(Object.entries(saved).filter(([id,value])=>portalNews.some(item=>item.id===id)&&(value==='interested'||value==='less'))) as NewsFeedbackMap;
}
