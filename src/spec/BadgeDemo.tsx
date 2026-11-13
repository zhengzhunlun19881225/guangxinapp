import {useState} from 'react';
import {Bell} from 'lucide-react';

function Count({count}:{count:number}){return <span className="spec-badge" aria-hidden="true">{count>99?'99+':count}</span>}
export default function BadgeDemo(){
 const [count,setCount]=useState(5),[showZero,setShowZero]=useState(false),[dot,setDot]=useState(true);
 return <div className="spec-badge-demo">
  <h4>计数徽标</h4><div className="spec-badge-samples">{[99,100].map(value=><span key={value} className="spec-badge-square" role="img" aria-label={value>99?'未读超过99条':'未读99条'}><Count count={value}/></span>)}</div>
  <h4>小红点</h4><div className="spec-badge-samples"><span className="spec-badge-square" role="img" aria-label="有新消息"><i className="spec-red-dot" aria-hidden="true"/></span></div>
  <p className="spec-demo-note">主题红 · 99 封顶 · 白色描边 · 右上角定位</p>
  <h4>交互示例</h4><div className="spec-badge-controls"><label className="spec-input-label">未读数量<input aria-label="未读数量" type="number" min={0} max={9999} value={count} onChange={event=>setCount(Math.max(0,Math.min(9999,Math.floor(Number(event.target.value)||0))))}/></label><label className="spec-badge-zero"><input type="checkbox" checked={showZero} onChange={event=>setShowZero(event.target.checked)}/>显示零值</label></div>
  <div className="spec-badge-samples">
   <button className="spec-badge-trigger" aria-label={`消息，${count}条未读，点击标记已读`} onClick={()=>setCount(0)}><span className="spec-badge-square"><Bell size={20} aria-hidden="true"/>{(count>0||showZero)&&<Count count={count}/>}</span></button>
   <button className="spec-badge-trigger" aria-label={dot?'有新提醒，点击标记已读':'暂无新提醒'} onClick={()=>setDot(false)}><span className="spec-badge-square"><Bell size={20} aria-hidden="true"/>{dot&&<i className="spec-red-dot" aria-hidden="true"/>}</span></button>
   <button className="spec-button spec-button-plain" onClick={()=>{setCount(5);setDot(true)}}>重置未读</button>
  </div><p className="spec-demo-note" role="status">未读 {count} 条；{dot?'有新提醒':'提醒已读'}。零值默认隐藏。</p>
 </div>;
}
