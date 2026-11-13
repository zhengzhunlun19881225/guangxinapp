import {useState} from 'react';
import {Camera,ChevronDown,FileText,Globe,History,MessageCircle,Mic,Plus,Sparkles} from 'lucide-react';
import ShortcutCard from '../apps/ShortcutCard';
import PortalBanner from '../components/PortalBanner';
import HotspotManage from '../components/HotspotManage';
import type {HotspotSettings} from '../data/hotspotSubscriptions';
import './app-patterns.css';

type Props={id:string;message:(text:string)=>void};

/** Business examples share the actual App components, with local demo actions. */
export default function AppPatterns({id,message}:Props){
 const [text,setText]=useState(''),[category,setCategory]=useState('最新');
 const [settings,setSettings]=useState<HotspotSettings>({followed:['compute','competitor'],followedOnly:false,topics:[]});
 if(id==='system-grid'||id==='common-shortcuts')return <div className="spec-current-shortcut">
  <ShortcutCard kind={id==='system-grid'?'portal':'workbench'} origin={id==='system-grid'?'portal-leader':'workbench'} onAction={action=>message('示例操作：'+action.value)}/>
 </div>;
 if(id==='poster-cases'||id==='carousel')return <div className="spec-current-banner"><PortalBanner onAction={()=>message('已选择案例，可在广新门户查看对应详情')}/></div>;
 if(id==='follow-settings')return <div className="spec-current-follow"><HotspotManage settings={settings} onClose={()=>message('已取消示例编辑')} onSave={next=>{setSettings(next);message('示例关注设置已更新');return true}}/></div>;
 if(id==='chat-composer')return <div className="spec-current-composer">
  <div className="spec-composer-options"><button onClick={()=>message('当前模型 qwen3.8')}>qwen3.8 <ChevronDown size={16}/></button><button onClick={()=>message('示例已启用联网搜索')}><Globe size={16}/>联网搜索</button><button onClick={()=>message('当前使用智能问答')}><MessageCircle size={16}/>智能问答</button></div>
  <div className="spec-composer-input"><button aria-label="输入栏相机示例" onClick={()=>message('选择图片')}><span><Camera size={18}/></span></button><input aria-label="AI 问题示例" value={text} onChange={event=>setText(event.target.value)} placeholder="请输入您的问题"/><button aria-label="输入栏加号示例" onClick={()=>message('添加附件')}><span><Plus size={18}/></span></button><button aria-label="输入栏语音示例" onClick={()=>message(text?'已收到示例问题：'+text:'语音输入示例')}><span className="spec-composer-mic"><Mic size={18}/></span></button></div>
 </div>;
 if(id==='daily-brief')return <article className="spec-current-brief">
  <header><div><h3 className="spec-current-heading">AI今日简报</h3><button aria-label="简报详情示例" onClick={()=>message('每日简报·来源依据')}><FileText size={16}/></button></div><button aria-label="简报历史示例" onClick={()=>message('查看历史简报')}><History size={16}/></button></header>
  <h4>员工关怀</h4><img src="/assets/workbench/anniversary-care.png" alt="入职周年快乐"/><strong>今天是陈晓晓的入职 1 周年</strong><p>感谢一路以来的付出，送上真诚的感谢与鼓励。</p><footer><button className="compact-special-action" onClick={()=>message('感谢您的付出，祝入职周年快乐！')}><span><Sparkles size={14}/>AI 帮写感谢</span></button></footer>
 </article>;
 if(id==='adaptive-news'){
  const rows=category==='最新'?['青年创新工作坊，激发岗位创意','党建与业务融合，交流基层实践经验','主题学习交流，凝聚团队奋进力量']:category==='党建'?['党建与业务融合，交流基层实践经验']:[];
  return <div className="spec-adaptive-stage"><section className="spec-adaptive-news"><h3 className="spec-current-heading">集团综合资讯</h3><div role="tablist" aria-label="自适应资讯分类">{['最新','党建','暂无内容'].map(value=><button key={value} role="tab" aria-selected={category===value} onClick={()=>setCategory(value)}><span className="app-pill-label">{value}</span></button>)}</div><div className="spec-adaptive-rows">{rows.map((row,index)=><article key={row}><span>{index+1}</span><div><strong>{row}</strong><small>广新集团 · 2026-11-04</small></div></article>)}</div>{!rows.length&&<p className="spec-adaptive-empty">暂无资讯，稍后再来看看</p>}</section><div className="spec-adaptive-next">下一模块随内容自然上移</div></div>;
 }
 return null;
}
