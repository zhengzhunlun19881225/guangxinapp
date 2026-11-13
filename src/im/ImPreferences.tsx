import {useState} from 'react';
import {Check,ChevronRight} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import {defaultImAccount,readImPreferences,saveImPreferences,type ImAccount,type ImPreferences} from './preferences';

type Props={route:string;go:(route:string)=>void;notify:(message:string)=>void;logout:()=>void};
export default function ImPreferences({route,go,notify,logout}:Props){
 const [settings,setSettings]=useState(readImPreferences),[account,setAccount]=useState(()=>readLocal<ImAccount>('im2-account',defaultImAccount));
 const [nickname,setNickname]=useState(account.nickname);
 function update(change:Partial<ImPreferences>){const next={...settings,...change};if(!saveImPreferences(next)){notify('保存失败，请重试');return}setSettings(next)}
 function toggle(label:string,key:'notifications'|'sound'){return <div className="im2-row"><span>{label}</span><button type="button" className="im2-switch" role="switch" aria-label={label} aria-checked={settings[key]} disabled={key==='sound'&&!settings.notifications} onClick={()=>update({[key]:!settings[key]})}><span/></button></div>}
 if(route==='im-account')return <>
  <section className="im2-card"><div className="im2-row"><span>账号</span><span className="im2-row-value">{account.name}</span></div><label className="im2-name-field"><span>昵称</span><input aria-label="账号昵称" maxLength={30} value={nickname} onChange={event=>setNickname(event.target.value)}/></label></section>
  <button className="im2-primary im2-wide" disabled={!nickname.trim()} onClick={()=>{const next={...account,nickname:nickname.trim()};if(saveLocal('im2-account',next)){setAccount(next);notify('昵称已保存')}else notify('保存失败，请重试')}}>保存昵称</button>
  <p className="im2-help im2-preferences-note">当前为本机演示账号。密码与登录设备管理需连接企业账号服务。</p>
 </>;
 if(route==='im-login')return <section className="im2-card im2-login"><img src="/assets/im/self-admin.png" alt=""/><h2>已退出 IM</h2><p>本机聊天记录和设置已保留</p><button className="im2-primary" onClick={()=>{if(!saveLocal('im2-session',true)){notify('进入失败，请重试');return}go('im');notify('已进入本机 IM 演示')}}>进入 IM 演示</button></section>;
 return <>
  <section className="im2-card">{toggle('开启消息通知','notifications')}{toggle('开启消息提示音','sound')}
   <div className="im2-row im2-alert-options"><span>提示音方式</span><div role="radiogroup" aria-label="提示音方式">{([['vibrate','振动'],['sound-vibrate','铃声+振动']] as const).map(([value,label])=><button role="radio" type="button" key={value} aria-checked={settings.alertMode===value} disabled={!settings.notifications||!settings.sound} onClick={()=>update({alertMode:value})}><span>{settings.alertMode===value&&<Check size={13}/>}</span>{label}</button>)}</div></div>
   <button className="im2-row" onClick={()=>go('im-account')}><span>账号与安全</span><ChevronRight size={17}/></button>
  </section>
  <section className="im2-card im2-danger"><button onClick={logout}>退出登录</button></section>
 </>;
}
