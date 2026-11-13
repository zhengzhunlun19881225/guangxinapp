import {Fragment,useState} from 'react';
import {Bell,X} from 'lucide-react';

const notices=[
 {tone:'warning',name:'警告',icon:'warning',short:'注意，这是一条提醒消息。'},
 {tone:'info',name:'信息',icon:'info',short:'工作安排已更新，请及时查看。'},
 {tone:'success',name:'成功',icon:'success',short:'申请已提交成功。'},
 {tone:'danger',name:'错误',icon:'danger',short:'网络连接不可用，请检查网络设置。'},
];

export default function BannerDemo(){
 const [dismissed,setDismissed]=useState<string[]>([]);
 return <div className="spec-banner-examples"><section>
  <div className="spec-banner-stack">{notices.map((item,index)=>{
   const key=item.tone;
   return <Fragment key={key}>{index===1&&<p className="spec-banner-group-label">其他通知类型</p>}{dismissed.includes(key)?null:<div className="spec-banner" data-tone={item.tone}>
    {item.tone==='warning'?<Bell className="spec-banner-bell" size={18} fill="currentColor" strokeWidth={1.5} aria-hidden="true"/>:<span className="spec-banner-icon" aria-hidden="true" style={{maskImage:`url(/assets/spec/feedback-${item.icon}.svg)`}}/>}
    <div className="spec-banner-copy"><p title={item.short}>{item.short}</p></div>
    <button className="spec-banner-close" aria-label={'关闭'+item.name+'提示'} onClick={()=>setDismissed(previous=>[...previous,key])}><X size={18} aria-hidden="true"/></button>
   </div>}</Fragment>;
  })}</div>
 </section><button className="spec-button spec-button-text" disabled={!dismissed.length} onClick={()=>setDismissed([])}>恢复全部提示</button></div>;
}
