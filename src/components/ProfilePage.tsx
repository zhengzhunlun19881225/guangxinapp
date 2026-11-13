import {useState} from 'react';
import {Bell,ChevronRight,ScanLine} from 'lucide-react';
import {version} from '../../package.json';
import {readLocal,saveLocal} from '../data';
import type {Action} from './SceneAction';
import {Asset} from './Controls';
import AppNavBar from './AppNavBar';
import ResourceIcon from './ResourceIcon';
import './ProfilePage.css';

const groups=[
 [{label:'知识库',icon:'knowledge'},{label:'云盘',icon:'cloud-drive'},{label:'反馈',icon:'feedback'}],
 [{label:'差旅偏好',icon:'travel'},{label:'设置',icon:'settings'},{label:'使用帮助',icon:'help'},{label:'关于广智新',icon:'version'}],
];

export default function ProfilePage({onAction,navigate}:{onAction:(action:Action)=>void;navigate:(route:string)=>void}){
 function open(label:string){
  if(label==='知识库'||label==='云盘'){navigate(label==='知识库'?'knowledge':'cloud-drive');return}
  if(label==='设置'){navigate('im-preferences?origin=profile');return}
  onAction({type:label==='关于广智新'?'about':'profile-panel',value:label});
 }
 return <div className="profile-page">
  <div className="native-status"><span>19:41</span><Asset node="0:5215"/></div>
  <AppNavBar className="profile-navbar" title="我的" right={<>
   <button aria-label="消息通知" onClick={()=>open('消息通知')}><Bell size={22}/></button>
   <button aria-label="扫一扫" onClick={()=>navigate('im-scan?origin=profile')}><ScanLine size={22}/></button>
  </>}/>
  <section className="profile-card"><Asset node="0:6645"/><div><h2>唐学文</h2><p>AI项目组-助理经理</p></div></section>
  <div className="profile-link-groups">{groups.map((items,index)=><section key={index} className="profile-links native-card" aria-label={index?'个人设置与帮助':'个人服务'}>
   {items.map(item=><button key={item.label} aria-label={item.label} onClick={()=>open(item.label)}>
    {item.icon==='knowledge'||item.icon==='cloud-drive'?<ResourceIcon name={item.icon} className="profile-link-icon"/>:<img className="profile-link-icon" src={'/assets/profile/'+item.icon+'.svg'} alt=""/>}
    <span className="profile-link-label">{item.label}</span>
    {item.icon==='version'&&<small className="profile-version">V{version}</small>}
    <ChevronRight size={18} aria-hidden="true"/>
   </button>)}
  </section>)}</div>
 </div>;
}

type TravelPreferences={transport:string;seat:string};
export function ProfilePanel({title,notify,close}:{title:string;notify:(text:string)=>void;close:()=>void}){
 const [feedback,setFeedback]=useState('');
 const [travel,setTravel]=useState(()=>readLocal<TravelPreferences>('profile-travel',{transport:'高铁',seat:'靠窗'}));
 function saved(key:string,value:unknown,text:string){
  if(!saveLocal(key,value)){notify('保存失败，请重试');return}
  close();notify(text);
 }
 if(title==='反馈')return <form className="demo-form" onSubmit={event=>{event.preventDefault();if(feedback.trim())saved('profile-feedback',{content:feedback.trim(),savedAt:new Date().toISOString()},'反馈已保存')}}>
  <label>反馈内容<textarea aria-label="反馈内容" placeholder="请描述遇到的问题或建议" maxLength={500} rows={5} value={feedback} onChange={event=>setFeedback(event.target.value)}/></label>
  <button className="primary-button" disabled={!feedback.trim()}>保存反馈</button>
 </form>;
 if(title==='差旅偏好')return <form className="demo-form profile-travel-form" onSubmit={event=>{event.preventDefault();saved('profile-travel',travel,'差旅偏好已保存')}}>
  <label>出行方式<select aria-label="出行方式" value={travel.transport} onChange={event=>setTravel({...travel,transport:event.target.value})}>{['高铁','飞机','不限'].map(value=><option key={value}>{value}</option>)}</select></label>
  <label>座位偏好<select aria-label="座位偏好" value={travel.seat} onChange={event=>setTravel({...travel,seat:event.target.value})}>{['靠窗','靠过道','不限'].map(value=><option key={value}>{value}</option>)}</select></label>
  <button className="primary-button">保存偏好</button>
 </form>;
 if(title==='使用帮助')return <div className="profile-help">
  <details><summary>如何切换门户？</summary><p>进入工作台，点击右上角的角色切换入口，选择对应门户。</p></details>
  <details><summary>如何管理消息通知？</summary><p>在“我的”页面进入“设置”，调整消息通知、提示音和振动方式。</p></details>
 </div>;
 return <p className="empty-state">{title==='知识库'?'暂无知识库内容':title==='云盘'?'暂无云盘文件':'暂无新通知'}</p>;
}
