import {useId,useRef,useState,type FormEvent} from 'react';
import {ChevronLeft,Sparkles,Star} from 'lucide-react';
import {emptyTopic,hotspotSources,hotspotTopics,interpretHotspotPrompt,normalizedTopicName,type FollowTopic,type HotspotSettings,type TopicInput} from '../data/hotspotSubscriptions';
import './NewsSubscription.css';
import './HotspotManage.css';

type Props={settings:HotspotSettings;onSave:(settings:HotspotSettings,close?:boolean)=>boolean;onClose:()=>void};
export default function HotspotManage({settings,onSave,onClose}:Props){
 const [mode,setMode]=useState<'manual'|'ai'>('manual'),[editingId,setEditingId]=useState<string|null>(null);
 const [draft,setDraft]=useState<TopicInput>(emptyTopic),[prompt,setPrompt]=useState(settings.lastPrompt||''),[result,setResult]=useState<TopicInput|null>(null),[error,setError]=useState('');
 const creating=editingId!==null;
 const id=useId(),body=useRef<HTMLDivElement>(null),nameInput=useRef<HTMLInputElement>(null);
 const topics=hotspotTopics(settings),followed=topics.filter(topic=>settings.followed.includes(topic.id)),available=topics.filter(topic=>!settings.followed.includes(topic.id));
 function changeMode(next:typeof mode){setMode(next);setEditingId(null);setError('');body.current?.scrollTo(0,0)}
 function persist(next:HotspotSettings){if(!onSave(next,false)){setError('保存失败，已保留当前设置，请重试。');return false}setError('');return true}
 function toggle(topic:FollowTopic){persist({...settings,followed:settings.followed.includes(topic.id)?settings.followed.filter(key=>key!==topic.id):[...settings.followed,topic.id]})}
 function edit(topic:FollowTopic){setMode('manual');setEditingId(topic.id);setDraft({label:topic.label,keywords:topic.keywords,source:topic.source,excludedKeywords:topic.excludedKeywords});setError('');body.current?.scrollTo(0,0);requestAnimationFrame(()=>nameInput.current?.focus())}
 function saveTopic(event:FormEvent,ai=false){
  event.preventDefault();const fields=ai?result:draft;if(!fields)return;
  const clean={...fields,label:fields.label.trim(),keywords:fields.keywords.trim(),excludedKeywords:fields.excludedKeywords.trim()};
  if(!clean.label){setError('请输入主题名称。');nameInput.current?.focus();return}
  if(!clean.keywords){setError('请输入匹配关键词。');body.current?.querySelector<HTMLInputElement>('[aria-label="匹配关键词"]')?.focus();return}
  const duplicate=topics.find(topic=>topic.id!==(ai?null:editingId)&&normalizedTopicName(topic.label)===normalizedTopicName(clean.label));
  if(duplicate&&!ai){setError('该主题已存在，请使用其他名称。');return}
  const key=ai?(duplicate?.id||'custom-'+crypto.randomUUID()):editingId!,original=topics.find(topic=>topic.id===key);
  const topic:FollowTopic={...clean,id:key,change:original?.change||'示例追踪条件已建立',createdAt:original?.createdAt||new Date().toISOString(),origin:ai?'ai':original?.origin||'manual'};
  if(!persist({...settings,topics:[...(settings.topics||[]).filter(item=>item.id!==key),topic],followed:[...new Set([...settings.followed,key])],...(ai?{lastPrompt:prompt}:{})}))return;
  setEditingId(null);setMode('manual');setResult(null);setDraft(emptyTopic());body.current?.scrollTo(0,0);
 }
 function fields(value:TopicInput,update:(next:TopicInput)=>void){return <div className="hotspot-topic-fields">
  <label className="news-sub-field"><span>主题名称</span><input ref={nameInput} aria-label="主题名称" aria-required="true" maxLength={60} placeholder="例如：人工智能+制造、企业名称或政策名称" value={value.label} onChange={event=>{update({...value,label:event.target.value});setError('')}}/></label>
  <label className="news-sub-field"><span>匹配关键词</span><input aria-label="匹配关键词" aria-required="true" maxLength={300} placeholder="多个词用逗号分隔" value={value.keywords} onChange={event=>{update({...value,keywords:event.target.value});setError('')}}/></label>
  <label className="news-sub-field"><span>来源范围</span><select aria-label="来源范围" value={value.source} onChange={event=>update({...value,source:event.target.value})}>{hotspotSources.map(source=><option key={source}>{source}</option>)}</select></label>
  <label className="news-sub-field"><span>排除关键词 <small>选填</small></span><input aria-label="排除关键词" maxLength={300} placeholder="例如：股价、营销广告" value={value.excludedKeywords} onChange={event=>update({...value,excludedKeywords:event.target.value})}/></label>
 </div>}
 function card(topic:FollowTopic,active:boolean){return <article className="hotspot-follow-card" key={topic.id}>
  <div className="hotspot-follow-copy"><h3>{topic.label}</h3><p>关注条件：{topic.keywords}</p>{topic.excludedKeywords&&<p>排除：{topic.excludedKeywords}</p>}</div>
  <div className="hotspot-follow-actions"><button type="button" aria-label={(active?'取消关注':'关注')+topic.label} aria-pressed={active} className="hotspot-follow-action" onClick={()=>toggle(topic)}><Star size={14} fill={active?'currentColor':'none'}/>{active?'已关注':'关注主题'}</button>{active&&<button type="button" className="hotspot-follow-edit" aria-label={'编辑'+topic.label} onClick={()=>edit(topic)}>编辑</button>}</div>
 </article>}
 return <div className={'hotspot-manager'+(creating?' is-creating':'')}>
  <div className="hotspot-manager-body" ref={body}>
   {!creating&&<div className="hotspot-manage-toolbar"><div className="news-sub-modes" role="tablist" aria-label="热点关注方式">{(['manual','ai'] as const).map(tab=><button type="button" role="tab" id={id+'-'+tab} aria-controls={id+'-panel-'+tab} aria-selected={mode===tab} tabIndex={mode===tab?0:-1} key={tab} onClick={()=>changeMode(tab)} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?'manual':event.key==='End'?'ai':mode==='manual'?'ai':'manual';changeMode(next);document.getElementById(id+'-'+next)?.focus()}}>{tab==='ai'&&<Sparkles size={14}/>} {tab==='manual'?'已关注主题':'AI 订阅'}</button>)}</div></div>}
   <div role={creating?undefined:'tabpanel'} aria-labelledby={creating?undefined:id+'-'+mode} id={id+'-panel-'+mode}>
    {mode==='manual'?(creating?<form id={id+'-new'} noValidate onSubmit={event=>saveTopic(event)}><button type="button" className="hotspot-manage-back" onClick={()=>{setEditingId(null);setError('')}}><ChevronLeft size={18}/>返回</button><h3 className="hotspot-manage-subtitle">编辑关注主题</h3>{fields(draft,setDraft)}</form>:<>

     {followed.length?<div aria-label="已关注主题列表">{followed.map(topic=>card(topic,true))}</div>:<p className="hotspot-manage-empty">暂无关注主题，可关注下方主题或使用 AI 订阅。</p>}
     {!!available.length&&<><h3 className="hotspot-manage-subtitle">可关注主题</h3><div aria-label="可关注主题列表">{available.map(topic=>card(topic,false))}</div></>}
    </>):<form id={id+'-form-ai'} noValidate onSubmit={event=>saveTopic(event,true)}>
     <h3 className="news-sub-ai-heading">用自然语言描述关注内容</h3><p className="hotspot-ai-help">AI仅生成可编辑条件，确认保存后才会关注。</p>
     <label className="news-sub-prompt"><textarea aria-label="追踪需求" aria-describedby={id+'-count'} maxLength={4000} value={prompt} placeholder="描述你想持续关注的内容，例如：国际油价变化、原油供需和相关政策，排除广告与无关报道。" onChange={event=>{setPrompt(event.target.value);setResult(null);setError('')}}/><small id={id+'-count'}>{prompt.length} / 4000</small></label>
     <button type="button" className="news-sub-generate hotspot-generate" disabled={!prompt.trim()} onClick={()=>{const next=interpretHotspotPrompt(prompt);setResult(next);setError(next?'':'未识别到追踪主题，请补充想关注的行业、政策或企业。')}}><Sparkles size={12}/>AI生成订阅条件</button>
     {result&&<section className="hotspot-generated" aria-label="生成的追踪条件"><p role="status">追踪条件已生成，请检查并修改，保存后生效。</p>{fields(result,setResult)}</section>}
    </form>}
   </div>
  </div>
  {(creating||(mode==='ai'&&result)||error)&&<footer className="hotspot-manager-footer">{error&&<p role="alert" className="hotspot-manage-error">{error}</p>}{(creating||(mode==='ai'&&result))&&<div><button type="button" className="secondary-button" onClick={()=>mode==='manual'?(setEditingId(null),setError('')):onClose()}>取消</button><button type="submit" form={id+(mode==='ai'?'-form-ai':'-new')} className="primary-button" disabled={mode==='ai'&&!result}>{mode==='ai'?'保存并关注':'保存'}</button></div>}</footer>}
 </div>;
}
