import {contacts,imageFor} from '../data';
export const imAsset=(name:string)=>'/assets/im/'+name+'.png';
export type Person={id:string;name:string;job:string;avatar:string;nickname?:string};
export const people:Person[]=[
 {id:'shi',name:'石梁雅',job:'软件及通信解决方案部',avatar:imAsset('member-0')},
 {id:'dong',name:'董巧珑',job:'副总经理',avatar:imAsset('member-1')},
 {id:'guan',name:'官文',job:'会计',avatar:imAsset('member-2')},
 {id:'yue',name:'越秋',job:'副总经理',avatar:imAsset('member-3')},
 {id:'jin',name:'金刚保',job:'会计',avatar:imAsset('member-4')},
 {id:'fa',name:'法山娣',job:'会计',avatar:imAsset('member-5')},
 {id:'li',name:'李树洁',job:'开发工程师（应急指挥研发部-平台开发部）',avatar:imAsset('search-li-shujie')},
 ...contacts.map((p,i)=>({id:'contact-'+i,name:p.name,job:'广东省广新控股集团有限公司',avatar:imageFor(p.node)})),
 {id:'wu',name:'乌壮菲',nickname:'菲菲',job:'软件及通信解决方案部',avatar:imAsset('person-wu')},
 {id:'li-yu',name:'李玉',job:'开发工程师（应急指挥研发部-平台开发部）',avatar:imAsset('search-li-yu')},
 {id:'li-linhao',name:'李林浩',job:'开发工程师（应急指挥研发部-平台开发部）',avatar:imAsset('search-li-linhao')},
 {id:'li-min',name:'李敏',job:'开发工程师（应急指挥研发部-平台开发部）',avatar:imAsset('search-li-min')},
 {id:'li-shuren',name:'李树人',job:'开发工程师（应急指挥研发部-平台开发部）',avatar:imAsset('search-li-shuren')},
];
export const enterpriseDepartments=[
 {name:'董事会',count:9},{name:'财务部',count:8},{name:'经营管理部',count:12},{name:'质量管理部',count:23},
 {name:'软件及通信解决方案部',count:17},{name:'综合解决方案部',count:5},{name:'财务部',count:9},{name:'经营管理部',count:12},
 {name:'质量管理部',count:23},{name:'软件及通信解决方案部',count:17},{name:'综合解决方案部',count:5},{name:'综合解决方案部',count:5}
];
export const initialMembers:Person[]=['殷震东','拓晓','斯璐悦','呼惠','蓝蓓春','钟贵俊','尉婷婷','李琦','广超胜','乌壮菲'].map((name,i)=>({id:'group-member-'+i,name,job:i===0?'群主':'群成员',avatar:imAsset('group-member-'+i)}));
export const meetingPeople:Person[]=[{id:'host',name:'芦丽云',job:'软件及通信解决方案部',avatar:imAsset('meeting-host')},...people.map(p=>['shi','dong','guan'].includes(p.id)?{...p,avatar:imAsset('meeting-'+p.id)}:p)];
export type Group={id:string;name:string;created:boolean;members:Person[];avatar:string;left?:boolean;disbanded?:boolean};
export const initialGroups:Group[]=[
 {id:'business',name:'业务沟通组',created:true,members:initialMembers,avatar:imAsset('group-0')},
 {id:'customer',name:'客户沟通群',created:false,members:[...initialMembers,...people.slice(0,2)],avatar:imAsset('group-1')},
 {id:'original',name:'刘磊、胡磊、陈丽、胡可',created:false,members:initialMembers,avatar:imAsset('group-0')},
];
export type ChatMessage={id:string;side:'in'|'out';text?:string;image?:string;time?:string;read?:boolean;createdAt?:string;attachment?:{name:string;url:string;kind:string}};
export const initialMessages:ChatMessage[]=[
 {id:'1',side:'in',text:'少即是多'},
 {id:'2',side:'out',image:imAsset('chat-photo'),read:true},
 {id:'3',side:'in',text:'塑像本来就在石头里，我只是把不要的部分去掉',time:'14:28'},
 {id:'4',side:'in',text:'https://ant.design/components/overview-cn/'},
 {id:'5',side:'out',text:'暂时先这样',read:false},
];
export type Schedule={repeat:boolean;days:number[];start:string;end:string};
export const defaultSchedule:Schedule={repeat:false,days:[1,2,3,4,5],start:'2026-11-08T09:33',end:'2026-11-08T12:33'};
export type ChatSettings={pinned:boolean;quiet:boolean;blocked:boolean;mute:'off'|'always'|'scheduled';whitelist:string[];schedule:Schedule};
export const defaultSettings:ChatSettings={pinned:true,quiet:false,blocked:false,mute:'off',whitelist:[],schedule:defaultSchedule};
export const imRoutes=['im-preferences','im-account','im-login','im-chat','im-settings','im-groups','im-members','im-mute','im-whitelist','im-select','im-schedule','im-history','im-profile','im-enterprise','im-group-name','im-meeting','im-join','im-scan'];
export const imTitles:Record<string,string>={'im-preferences':'设置','im-account':'账号与安全','im-login':'IM 登录','im-chat':'聊天','im-settings':'聊天设置','im-groups':'我的群组','im-members':'群成员','im-mute':'群内禁言','im-whitelist':'白名单','im-select':'选择成员','im-schedule':'定时禁言','im-history':'聊天记录','im-profile':'联系人详情','im-enterprise':'企业通讯录','im-group-name':'群聊名称','im-meeting':'发起会议','im-join':'加入会议','im-scan':'扫一扫'};
