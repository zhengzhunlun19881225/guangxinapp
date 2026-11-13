import {readLocal} from '../data';
import {HOTSPOT_EVENTS,HOTSPOT_TOPICS,type HotspotEvent} from './hotspotTracking';

export const hotspotSources=['全部公开来源','官方媒体、行业媒体','政府网站','企业官网、行业媒体','企业官网','官方媒体','行业媒体','研究机构'];
export type FollowTopic={id:string;label:string;keywords:string;source:string;excludedKeywords:string;change:string;createdAt?:string;origin?:'manual'|'ai'};
export type TopicInput=Pick<FollowTopic,'label'|'keywords'|'source'|'excludedKeywords'>;
export type HotspotSettings={followed:string[];followedOnly:boolean;topics?:FollowTopic[];lastPrompt?:string};
const metadata:Record<string,[string,string]>={ai:['人工智能+制造,落地项目,技术进展','全部公开来源'],compute:['国产芯片,算力,适配','官方媒体、行业媒体'],policy:['数字化转型,政策实施','政府网站'],competitor:['竞争对手,产品发布,业务合作','企业官网、行业媒体'],expert:['文件对比,差异核验','官方媒体、行业媒体']};
export function hotspotTopics(settings:HotspotSettings):FollowTopic[]{
 const custom=settings.topics||[];
 return [...HOTSPOT_TOPICS.map(topic=>({keywords:metadata[topic.id][0],source:metadata[topic.id][1],excludedKeywords:'',...topic,...custom.find(item=>item.id===topic.id)})),...custom.filter(item=>!HOTSPOT_TOPICS.some(topic=>topic.id===item.id))];
}
export function readHotspotSettings():HotspotSettings{
 const raw=readLocal<unknown>('hotspot-settings',null);
 if(!raw||typeof raw!=='object')return{followed:[],followedOnly:false,topics:[]};
 const value=raw as Partial<HotspotSettings>,seen=new Set<string>();
 const topics=Array.isArray(value.topics)?value.topics.filter((topic):topic is FollowTopic=>!!topic&&typeof topic.id==='string'&&typeof topic.label==='string'&&typeof topic.keywords==='string'&&!seen.has(topic.id)&&!!seen.add(topic.id)).map(topic=>({...topic,label:topic.label.slice(0,60),keywords:topic.keywords.slice(0,300),source:hotspotSources.includes(topic.source)?topic.source:hotspotSources[0],excludedKeywords:typeof topic.excludedKeywords==='string'?topic.excludedKeywords.slice(0,300):'',change:typeof topic.change==='string'?topic.change:'示例追踪条件已建立'})):[];
 const ids=new Set(hotspotTopics({followed:[],followedOnly:false,topics}).map(topic=>topic.id));
 return{topics,followed:Array.isArray(value.followed)?[...new Set(value.followed.filter(id=>typeof id==='string'&&ids.has(id)))]:[],followedOnly:value.followedOnly===true,lastPrompt:typeof value.lastPrompt==='string'?value.lastPrompt.slice(0,4000):''};
}
export const emptyTopic=():TopicInput=>({label:'',keywords:'',source:hotspotSources[0],excludedKeywords:''});
export function interpretHotspotPrompt(prompt:string):TopicInput|null{
 const positive=prompt.replace(/(?:不要|排除|屏蔽)[^，。；\n]+/g,'');
 const blocked=[...prompt.matchAll(/(?:不要|排除|屏蔽)([^，。；\n]+)/g)].map(match=>match[1].trim()).join(', ');
 const source=positive.includes('政府网站')?'政府网站':positive.includes('企业官网')?(positive.includes('行业媒体')?'企业官网、行业媒体':'企业官网'):positive.includes('官方媒体')?(positive.includes('行业媒体')?'官方媒体、行业媒体':'官方媒体'):positive.includes('行业媒体')?'行业媒体':positive.includes('研究机构')?'研究机构':'全部公开来源';
 let label='',terms:string[]=[];
 if(/国际油价|原油|布伦特|Brent|WTI|OPEC/i.test(positive)){label='国际油价动态';terms=['国际油价','原油价格','Brent原油','WTI原油','原油供需','原油库存','OPEC']}
 else if(/人工智能|制造|\bAI\b|AIGC/i.test(positive)){label='人工智能+制造';terms=['人工智能+制造']}
 else if(/算力|芯片|适配/.test(positive)){label='国产算力';terms=['国产芯片','算力','适配']}
 else if(/政策|申报|实施安排/.test(positive)){label=positive.includes('新材料')?(positive.includes('广东')?'广东新材料政策':'新材料政策'):'某项政策';terms=[...(positive.includes('广东')?['广东']:[]),...(positive.includes('新材料')?['新材料']:[]),'政策发布','实施进展']}
 else if(/竞争对手|企业|公司|公告/.test(positive.replace(/企业官网/g,''))){label='某家竞争对手';terms=['竞争对手','产品发布','业务合作']}
 else if(/文本对比|文件对比|差异|核验文件/.test(positive)){label='文本对比专家';terms=['文件对比','差异核验']}
 else{const match=positive.match(/(?:持续)?(?:追踪|关注|跟踪)(.+?)(?:的|，|。|；|$)/);if(match){label=match[1].trim().slice(0,60);terms=[label]}}
 if(!label)return null;
 for(const term of ['落地项目','技术进展','生态合作','芯片适配','供应链','实施进展'])if(positive.includes(term)&&!terms.includes(term))terms.push(term);
 return{label,keywords:terms.join(', '),source,excludedKeywords:blocked};
}
export const normalizedTopicName=(value:string)=>value.trim().replace(/[+·\s]/g,'').toLowerCase();
export function hotspotEvents(settings:HotspotSettings,id:string):HotspotEvent[]{
 const builtIn=HOTSPOT_EVENTS.filter(event=>event.topicId===id);
 if(builtIn.length)return builtIn.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
 const topic=hotspotTopics(settings).find(item=>item.id===id);if(!topic)return[];
 const time=topic.createdAt&&Number.isFinite(Date.parse(topic.createdAt))?Date.parse(topic.createdAt):Date.parse('2026-11-09T09:00:00+08:00');
 return ['后续追踪建议','示例信息核验','示例线索整理'].map((title,index)=>({id:id+'-demo-'+index,topicId:id,title,publishedAt:new Date(time-index*60000).toLocaleString('sv-SE',{timeZone:'Asia/Shanghai'}).slice(0,16),category:index===0?'analysis':index===1?'fact':'media',major:false,stage:'示例进展',summary:index===0?`围绕“${topic.label}”持续关注${topic.keywords}。当前为示例进展，暂无实际采集结果。`:index===1?'示例节点展示材料核验步骤，不代表已发生的真实事件。':`按“${topic.source}”整理示例线索，供预览追踪时间线。`,detail:`当前主题的匹配关键词：${topic.keywords}。排除关键词：${topic.excludedKeywords||'无'}。这些记录用于演示追踪流程。`,nextCheck:'核对原始材料、适用范围与后续进展。',sources:[{id:id+'-demo-source-'+index,title:'主题示例材料',type:'本地演示材料',excerpt:'由已保存的主题条件生成，用于预览，不是实际采集的新闻来源。'}]}));
}
