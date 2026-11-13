import type {NewsItem} from './portalNews';
import partyContent from './groupNewsContent.json';

export const groupCategories=['最新','最热','焦点','党建'] as const;
export type GroupCategory=typeof groupCategories[number];
export type GroupNewsItem=NewsItem & {lines:string[];displayDate:string};
const seeds:[string[],string,string][]=[
 [['美国参议院下周将审议','重磅加密货币监管法案'],'dfeddcb7-bd05-4b4d-af3e-9873d0f1ae52.png','4小时前'],
 [['“史上最严”医药代表新','规落地，行贿3万即入','刑。严禁...'],'e84ad16d-435d-4806-af40-e760a9396377.png','4小时前'],
 [['新加坡将用鞭刑惩治校','园霸凌者'],'1a1d8f44-7c9b-4d99-8b7b-1d4ab7b95fce.png','2024-04-12'],
 [['“开门杀”事故赔偿有司','法解释了！'],'fd08b93b-bf37-4465-84c8-114892a9d7db.png','2024-04-12'],
 [['工信部批复6G技术频…'],'c870548d-6f64-459c-a5f9-f28f682fb0c3.png','2024-04-12'],
];
// Headline/image examples supplied by the original mobile design. No unpublished
// article body or legal guidance is generated from these headlines.
export const groupHeadlines:GroupNewsItem[]=seeds.map(([lines,image,displayDate],index)=>({
 id:'group-'+index,title:lines.join(''),lines,image:'/assets/figma/'+image,
 category:'集团资讯',summary:'',paragraphs:[],source:'广新集团',
 date:index<2?'2026-11-08':'2024-04-12',displayDate,
 followed:false,related:false,featured:false,
}));
const partyTitles=['青年创新工作坊，激发岗位创意','党建与业务融合，交流基层实践经验','主题学习交流，凝聚团队奋进力量'];
const partyPhotos=[seeds[1][1],seeds[2][1],seeds[2][1]];
export const partyNews:GroupNewsItem[]=partyTitles.map((title,index)=>({
 id:'party-'+index,title,lines:[title],image:'/assets/figma/'+partyPhotos[index],category:'党建',
 summary:partyContent[index][0],paragraphs:partyContent[index],source:'广新集团',
 date:'2026-11-04',displayDate:'2026-11-04',followed:false,related:false,featured:false,
}));
export function groupCategory(value:string|null):GroupCategory{return groupCategories.includes(value as GroupCategory)?value as GroupCategory:'最新'}
export function categoryGroupNews(category:GroupCategory,query=''){
 const items=category==='党建'?partyNews:category==='最热'?[1,0,4,2,3].map(index=>groupHeadlines[index]):category==='焦点'?[0,1,4].map(index=>groupHeadlines[index]):groupHeadlines;
 const keyword=query.trim().toLocaleLowerCase();
 return items.filter(item=>`${item.title} ${item.paragraphs.join(' ')}`.toLocaleLowerCase().includes(keyword));
}
