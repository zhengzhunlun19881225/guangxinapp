import {useId,useRef,useState,type FormEvent} from 'react';
import {ChevronDown,RotateCcw,Sparkles} from 'lucide-react';
import {defaultSubscription,generateSubscription,subscriptionKey,subscriptionOptions,type ChoiceKey,type NewsSubscription as Settings} from '../data/newsSubscription';
import './NewsSubscription.css';

export default function NewsSubscription({initial,onClose,onSave}:{initial:Settings|null;onClose:()=>void;onSave:(settings:Settings)=>void}){
 const [draft,setDraft]=useState<Settings>(()=>structuredClone(initial||defaultSubscription())),[mode,setMode]=useState<'manual'|'ai'>('manual');
 const [advanced,setAdvanced]=useState(true),[prompt,setPrompt]=useState(''),[recognized,setRecognized]=useState<string[]>([]),[error,setError]=useState(''),[notice,setNotice]=useState(''),[invalid,setInvalid]=useState<ChoiceKey|null>(null);
 const id=useId(),content=useRef<HTMLDivElement>(null);
 function update<K extends keyof Settings>(key:K,value:Settings[K]){setDraft(current=>({...current,[key]:value}));setError('');setInvalid(null);setNotice('')}
 function changeMode(next:'manual'|'ai'){setMode(next);setError('');setInvalid(null);content.current?.scrollTo({top:0})}
 function changePrompt(value:string){setPrompt(value);setRecognized([]);setError('');setNotice('')}
 function generate(){const result=generateSubscription(prompt,draft);if(!result){setError('未识别到订阅条件，请补充行业、主题、地区或更新频率。');return}setDraft(result.settings);setRecognized(result.recognized);setError('');setNotice('')}
 function submit(event:FormEvent){event.preventDefault();
  if(mode==='ai'&&!recognized.length){setError('请先生成订阅条件。');return}
  for(const key of ['industries','topics'] as const){if(!draft[key].length){setMode('manual');setInvalid(key);setError('请至少选择一个关注'+(key==='industries'?'行业':'主题')+'。');requestAnimationFrame(()=>{const field=document.getElementById(id+'-'+key);field?.scrollIntoView({block:'nearest'});field?.querySelector<HTMLInputElement>('input')?.focus({preventScroll:true})});return}}
  try{localStorage.setItem(subscriptionKey,JSON.stringify(draft));onSave(draft)}catch{setError('保存失败，已保留当前设置，请重试。')}
 }
 function choices(key:ChoiceKey,title:string,required=false){return <fieldset className="news-sub-choice" id={id+'-'+key} aria-invalid={invalid===key||undefined} aria-describedby={invalid===key?id+'-error':undefined}>
  <legend>{title}{required&&<span>必选 · 可多选</span>}</legend><div>{subscriptionOptions[key].map(option=><label key={option} className={draft[key].includes(option)?'is-selected':''}><input type="checkbox" checked={draft[key].includes(option)} onChange={event=>update(key,event.target.checked?[...draft[key],option]:draft[key].filter(value=>value!==option))}/><span>{option}</span></label>)}</div>
 </fieldset>}
 function field(key:'keywords'|'related'|'blockedKeywords'|'blockedSources',label:string,placeholder:string){return <label className="news-sub-field"><span>{label}</span><input value={draft[key]} maxLength={300} placeholder={placeholder} onChange={event=>update(key,event.target.value)}/></label>}
 return <form className="news-subscription" onSubmit={submit}>
  <div className="news-sub-content" ref={content}>
   <div className="news-sub-modes" role="tablist" aria-label="订阅方式">{(['manual','ai'] as const).map(tab=><button key={tab} type="button" role="tab" aria-selected={mode===tab} id={id+'-tab-'+tab} aria-controls={id+'-panel-'+tab} tabIndex={mode===tab?0:-1} onClick={()=>changeMode(tab)} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?'manual':event.key==='End'?'ai':mode==='manual'?'ai':'manual';changeMode(next);document.getElementById(id+'-tab-'+next)?.focus()}}><span>{tab==='manual'?'手动订阅':'AI 订阅'}</span></button>)}</div>
   <div className="news-sub-panel" id={id+'-panel-'+mode} role="tabpanel" aria-labelledby={id+'-tab-'+mode}>
    {mode==='manual'?<>
     {choices('industries','关注行业',true)}{choices('topics','关注主题',true)}{field('keywords','关键词订阅','例如：广新集团、AIGC、产业链协同')}
     <button type="button" className="news-sub-advanced-toggle" aria-expanded={advanced} aria-controls={id+'-advanced'} onClick={()=>setAdvanced(!advanced)}><ChevronDown size={16} className={advanced?'is-open':''}/>高级设置：来源、屏蔽与提醒</button>
     {advanced&&<div id={id+'-advanced'} className="news-sub-advanced">
      {choices('regions','关注地区')}{choices('contentTypes','内容类型')}{choices('sources','来源偏好')}
      {field('related','与我有关','填写岗位或业务领域，例如：供应链、新材料')}
      {field('blockedKeywords','屏蔽关键词','例如：娱乐，以逗号分隔')}{field('blockedSources','屏蔽来源','输入媒体名称，以逗号分隔')}
      <label className="news-sub-check"><input type="checkbox" checked={draft.personalized} onChange={event=>update('personalized',event.target.checked)}/>允许根据阅读行为优化推荐</label>
      <label className="news-sub-field"><span>更新频率</span><select aria-label="更新频率" value={draft.frequency} onChange={event=>update('frequency',event.target.value)}>{['每日更新','每周更新','实时更新'].map(value=><option key={value}>{value}</option>)}</select></label>
      <label className="news-sub-field"><span>提醒方式</span><select aria-label="提醒方式" value={draft.reminder} onChange={event=>update('reminder',event.target.value)}><option>仅页面展示</option></select></label>
      <label className="news-sub-check"><input type="checkbox" checked={draft.important} onChange={event=>update('important',event.target.checked)}/>重大资讯单独提醒</label>
     </div>}
    </>:<>
     <h3 className="news-sub-ai-heading"><Sparkles size={18}/>用一句话告诉 AI，你想关注什么</h3>
     <label className="news-sub-prompt"><textarea aria-label="订阅需求" aria-describedby={id+'-count'} value={prompt} maxLength={500} onChange={event=>changePrompt(event.target.value)} placeholder="例如：关注人工智能、制造业和国产算力，每天更新"/><small id={id+'-count'}>{prompt.length} / 500</small></label>
     <button className="news-sub-generate" type="button" disabled={!prompt.trim()} onClick={generate}><Sparkles size={12}/>生成订阅条件</button>
     {!!recognized.length&&<section className="news-sub-result" aria-label="生成的订阅条件"><header><h3>已生成订阅条件</h3><button type="button" onClick={()=>{changeMode('manual');setAdvanced(true)}}>编辑条件</button></header><p role="status">已识别：{recognized.join('、')}</p><dl><dt>行业 / 主题</dt><dd>{draft.industries.join('、')} / {draft.topics.join('、')}</dd><dt>关键词</dt><dd>{draft.keywords||'不限'}</dd><dt>地区 / 来源</dt><dd>{draft.regions.join('、')||'不限'} / {draft.sources.join('、')||'不限'}</dd><dt>屏蔽 / 更新</dt><dd>{draft.blockedKeywords||'无'} / {draft.frequency}</dd></dl><p className="news-sub-helper">确认后点击“保存”生效。</p></section>}
    </>}
   </div>
  </div>
  <footer className="news-sub-footer">{error&&<p className="news-sub-error" role="alert" id={id+'-error'}>{error}</p>}{notice&&<p className="news-sub-helper" role="status">{notice}</p>}
   <button className="news-sub-reset" type="button" onClick={()=>{setDraft(defaultSubscription());setPrompt('');setRecognized([]);setError('');setInvalid(null);setNotice('已恢复默认，保存后生效。')}}><RotateCcw size={14}/>恢复默认</button>
   <div><button className="secondary-button" type="button" onClick={onClose}>取消</button><button className="primary-button" type="submit" disabled={mode==='ai'&&!recognized.length}>保存</button></div>
  </footer>
 </form>;
}
