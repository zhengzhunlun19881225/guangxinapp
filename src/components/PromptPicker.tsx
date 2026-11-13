import {useEffect,useRef,useState} from 'react';
import {ArrowLeft} from 'lucide-react';
import ComposerSheet from './ComposerSheet';
import './PromptPicker.css';

type PromptTemplate={name:string;description:string;scope:string;prompt:string};
const scopes=['全部','通用','专用','个人'];
const writingPrompts:PromptTemplate[]=[
 {name:'领导总结讲话稿',description:'用于撰写会议结束总结',scope:'通用',prompt:'请撰写一份会议总结讲话稿，包含工作回顾、主要成果和下一步要求。'},
 {name:'领导开场讲话稿',description:'用于撰写会议开场讲话',scope:'通用',prompt:'请撰写一份会议开场讲话稿，包含会议背景、目标和重点议程。'},
 {name:'专题调研报告',description:'用于向上级汇报调研情况',scope:'专用',prompt:'请撰写一份专题调研报告，包含调研背景、现状分析、发现问题和工作建议。'},
 {name:'周报总结',description:'梳理本周成果与下周计划',scope:'个人',prompt:'请整理本周工作总结，包含已完成工作、问题风险和下周计划。'},
];

const travelPrompts:PromptTemplate[]=[
 {name:'出差申请',description:'整理目的地、出差日期和事由',scope:'通用',prompt:'请整理一份出差申请，包含出差人员、目的地、起止日期、出差事由和预计费用。'},
 {name:'差旅费用报销',description:'整理交通、住宿及补贴明细',scope:'通用',prompt:'请整理差旅报销材料清单，按交通、住宿、餐费及补贴分类，列出金额和待补充凭证。'},
 {name:'差旅费用标准查询',description:'梳理制度中的适用标准',scope:'专用',prompt:'请根据提供的差旅制度梳理交通、住宿和补贴标准，标明适用人员与待确认事项。'},
 {name:'我的差旅计划',description:'规划行程与待办事项',scope:'个人',prompt:'请整理我的差旅行程计划，包含出发与返程安排、会议事项、联系人和待办清单。'},
];

export default function PromptPicker({device,scope,setScope,close,choose,kind='writing'}:{kind?:'writing'|'travel';device:HTMLElement;scope:string;setScope:(value:string)=>void;close:()=>void;choose:(prompt:string)=>void}){
 const prompts=kind==='travel'?travelPrompts:writingPrompts;
 const [preview,setPreview]=useState<PromptTemplate|null>(null),dialog=useRef<HTMLElement>(null),content=useRef<HTMLDivElement>(null),trigger=useRef('');
 useEffect(()=>{content.current?.scrollTo(0,0);if(preview)dialog.current?.querySelector<HTMLElement>('.prompt-preview-back')?.focus({preventScroll:true});else Array.from(dialog.current?.querySelectorAll<HTMLElement>('button')||[]).find(button=>button.getAttribute('aria-label')===trigger.current)?.focus({preventScroll:true})},[preview]);
 return <ComposerSheet device={device} title={preview?'提示词预览':'提示词模板'} closeLabel="关闭提示词模板" close={close} escape={()=>preview?setPreview(null):close()} dialogRef={dialog}>
  {preview?<>
   <div className="composer-picker-content prompt-picker-preview" ref={content}>
    <button type="button" className="prompt-preview-back" onClick={()=>setPreview(null)}><ArrowLeft size={18}/>返回模板列表</button>
    <div className="prompt-preview-heading"><h3>{preview.name}</h3><small>{preview.scope}</small></div>
    <p>{preview.description}</p><div className="prompt-preview-text">{preview.prompt}</div>
   </div>
   <footer className="prompt-picker-footer"><button type="button" onClick={()=>choose(preview.prompt)}>使用此模板</button></footer>
  </>:<>
   <div className="composer-picker-categories" role="tablist" aria-label="模板范围">{scopes.map((value,index)=><button key={value} type="button" role="tab" aria-selected={scope===value} tabIndex={scope===value?0:-1} onClick={()=>{setScope(value);content.current?.scrollTo(0,0)}} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?scopes.length-1:(index+(event.key==='ArrowRight'?1:-1)+scopes.length)%scopes.length;setScope(scopes[next]);(event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();content.current?.scrollTo(0,0)}}><span>{value}</span></button>)}</div>
   <div className="composer-picker-content" ref={content}><div className="prompt-picker-list" role="tabpanel" aria-label={scope}>{prompts.filter(item=>scope==='全部'||item.scope===scope).map(item=><article key={item.name}>
    <button type="button" className="prompt-picker-choose" aria-label={'使用'+item.name} onClick={()=>choose(item.prompt)}><span><strong>{item.name}</strong><small>{item.scope}</small></span><span>{item.description}</span></button>
    <button type="button" className="prompt-picker-preview-button" aria-label={'预览'+item.name} onClick={event=>{trigger.current=event.currentTarget.getAttribute('aria-label')||'';setPreview(item)}}>预览</button>
   </article>)}</div></div>
  </>}
 </ComposerSheet>;
}
