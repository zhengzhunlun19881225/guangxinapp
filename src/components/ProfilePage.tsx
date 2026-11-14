import {Bell,ChevronRight,ScanLine} from 'lucide-react';
import {version} from '../../package.json';
import type {Action} from './SceneAction';
import {Asset} from './Controls';
import AppNavBar from './AppNavBar';
import ResourceIcon from './ResourceIcon';
import FeedbackForm from './FeedbackForm';
import './ProfilePage.css';

const groups=[
 [{label:'知识库',icon:'knowledge'},{label:'云盘',icon:'cloud-drive'},{label:'反馈',icon:'feedback'}],
 [{label:'差旅偏好',icon:'travel'},{label:'设置',icon:'settings'},{label:'使用帮助',icon:'help'},{label:'关于广智新',icon:'version'}],
];

export default function ProfilePage({onAction,navigate}:{onAction:(action:Action)=>void;navigate:(route:string)=>void}){
 function open(label:string){
  if(label==='知识库'||label==='云盘'){navigate(label==='知识库'?'knowledge':'cloud-drive');return}
  if(label==='设置'){navigate('im-preferences?origin=profile');return}
  if(label==='差旅偏好'){navigate('travel-preferences');return}
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

export function ProfilePanel({title,notify,close}:{title:string;notify:(text:string)=>void;close:()=>void}){
 if(title==='反馈')return <FeedbackForm onSaved={()=>{close();notify('反馈及附件已保存到本机')}}/>;
 if(title==='使用帮助')return <div className="profile-help">
  <details><summary>如何切换门户？</summary><p>进入工作台，点击右上角的角色切换入口，选择对应门户。</p></details>
  <details><summary>如何管理消息通知？</summary><p>在“我的”页面进入“设置”，调整消息通知、提示音和振动方式。</p></details>
 </div>;
 return <p className="empty-state">{title==='知识库'?'暂无知识库内容':title==='云盘'?'暂无云盘文件':'暂无新通知'}</p>;
}
