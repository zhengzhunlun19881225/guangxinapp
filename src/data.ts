import {nodeImages, assets} from './assets';
import {assetOverrides} from './assetOverrides';
export const imageFor = (id: string) => assetOverrides[id] || nodeImages[id];
export const mascot = assets.chat.img1;
export const historyItems = [
  '参加“数字化创新大赛”的通知', '参加“数字化创新大赛”的通知', '第一季度各区域销售业绩汇报',
  '我的出差报销标准', '工作日统计', '参加“数字化创新大赛”的通知', '数据监测与优化策略',
  '组织2026年度员工体检的通知', '我的出差报销标准', 'AIGC 如何重塑企业数字',
  '营业收入与整体税负趋势', '组织2026年度员工体检的通知', '2026年华为全联接大会',
  '关于集团2026年调研实施方案的讨论'];
export const questions = ['参加“数字化创新大赛”的通知','第一季度各区域销售业绩汇报',
  '参加“数字化创新大赛”','关于集团2026年调研实施方案的讨论','组织2026年度员工体检的通知'];
export const agents = [
  {name:'智能问答', icon:'0:5611',color:'blue',type:'热门',intro:'一句话描述功能的内容的一句话描述功能描述功能'},
  {name:'AI智写',icon:'0:5624',color:'purple',type:'常用',intro:'一句话描述功能的内容的一句话描述功能'},
  {name:'AI+财务自动差旅',icon:'0:5638',color:'purple',type:'常用',intro:'一句话描述功能的内容的一句话描述功能'},
  {name:'智能摘要',icon:'0:5653',color:'green',type:'热门',intro:'一句话描述功能的内容的一句话描述功能描述功能'},
  {name:'智能数据',icon:'0:5666',color:'orange',type:'默认',intro:'一句话描述功能的内容的一句话描述功能'},
  {name:'法智小新',icon:'0:5677',color:'cyan',type:'默认',intro:'一句话描述功能的内容的一句话描述功能描述功能'}];
export const skills = [
  {name:'表格工具',icon:'0:5470',color:'purple',type:'数据分析',intro:'一句话描述功能的内容的一句话描述功能...'},
  {name:'泰语翻译',icon:'0:5485',color:'green',type:'常用',intro:'一句话描述功能的内容的一句话描述功能描述功能'},
  {name:'天气查询',icon:'0:5498',color:'orange',type:'热门',intro:'一句话描述功能的内容的一句话描述功能...'},
  {name:'合同审查',icon:'0:5443',color:'blue',type:'法务',intro:'一句话描述功能的内容的一句话描述功能描述功能'},
  {name:'智能填表',icon:'0:5456',color:'purple',type:'常用',intro:'一句话描述功能的内容的一句话描述功能'},
  {name:'AI图片',icon:'0:5509',color:'cyan',type:'热门',intro:'一句话描述功能的内容的一句话描述功能...'}];
export const conversations = [
  {name:'AI数字员工',node:'0:5971',preview:'上午10点30分有一个非常紧急需求会议…',time:'09:30',unread:1},
  {name:'系统消息',node:'0:5962',preview:'你有 2 条待办消息',time:'09:30',unread:2},
  {name:'李密',node:'0:6003',preview:'下午1点30分有一个非常紧急需求会议…',time:'09:30',unread:2},
  {name:'刘磊、胡磊、陈丽、胡可',node:'0:5983',preview:'[@所有人] 下午1点半一个非常紧急需…',time:'09:10',unread:15},
  {name:'李密',node:'0:6023',preview:'下午1点30分有一个非常紧急需求会议…',time:'09:04',unread:2},
  {name:'姜德强',node:'0:5987',preview:'下午1点30分有一个非常紧急需求会议…',time:'昨天',unread:0},
  {name:'李杰',node:'0:5995',preview:'[链接] “四能”筑牢防线',time:'昨天',unread:0}];
export const contacts = [
  {name:'荆宁若',node:'303:5655'}, {name:'褚霞哲',node:'0:5819'},
  {name:'蒙浩',node:'0:5820'}, {name:'饶韵',node:'0:5821'},
  {name:'令狐克秋',node:'0:5822'}, {name:'邢韵',node:'0:5823'}];
export const roles = [
  {route:'portal-overview',name:'领导 · 总体情况',description:'经营指标、税负趋势、税金地图、科研进度'},
  {route:'portal-leader',name:'领导 · 综合资讯',description:'智能提醒、集团资讯与公告'},
  {route:'portal-manager',name:'中层门户',description:'系统导航、主动服务与业务资讯'},
  {route:'portal-staff',name:'员工门户',description:'常用系统、集团新闻与通知'}];

export type Message = {role:'user'|'assistant';text:string};
export function readLocal<T>(key:string, fallback:T):T {
  try {const value=localStorage.getItem('gx-app-'+key); return value ? JSON.parse(value) as T : fallback;}
  catch {return fallback;}
}
export function saveLocal(key:string,value:unknown) {
  try {localStorage.setItem('gx-app-'+key,JSON.stringify(value)); return true;}
  catch {return false;}
}
