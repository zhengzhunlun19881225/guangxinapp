import {useRef} from 'react';
import ComposerSheet from './ComposerSheet';
import './PromptPicker.css';

type PromptTemplate={name:string;description:string;scope:string;prompt:string};
const scopes=['全部','通用','专用','个人'];
const writingPrompts:PromptTemplate[]=[
 {name:'领导总结讲话稿',description:'用于撰写会议结束总结',scope:'通用',prompt:'请撰写一份会议总结讲话稿，包含工作回顾、主要成果和下一步要求。'},
 {name:'领导开场讲话稿',description:'用于撰写会议开场讲话',scope:'通用',prompt:'请撰写一份会议开场讲话稿，包含会议背景、目标和重点议程。'},
 {name:'专题调研报告',description:'用于向上级汇报调研情况',scope:'专用',prompt:'请撰写一份专题调研报告，包含调研背景、现状分析、发现问题和工作建议。'},
 {name:'周报总结',description:'梳理本周成果与下周计划',scope:'个人',prompt:'请整理本周工作总结，包含已完成工作、问题风险和下周计划。'},
 {name:'会议纪要',description:'整理讨论结论、责任人与完成节点',scope:'通用',prompt:'请根据会议记录整理会议纪要，列出讨论事项、决策结论、负责人和截止时间，未提供的信息标为待确认。'},
 {name:'活动通知',description:'明确活动安排和报名要求',scope:'通用',prompt:'请起草一份活动通知，包含活动主题、时间地点、参加对象、报名方式和注意事项。'},
 {name:'项目立项报告',description:'说明项目目标、资源及实施计划',scope:'专用',prompt:'请编写项目立项报告，包含背景、目标、建设内容、资源预算、实施节点和风险控制。'},
 {name:'经营分析报告',description:'分析经营指标与业务变化',scope:'专用',prompt:'请根据提供的经营数据撰写分析报告，比较收入、成本、利润与目标完成情况，数据缺失时标明待补充。'},
 {name:'风险排查清单',description:'识别业务风险并整理整改措施',scope:'专用',prompt:'请根据提供的业务材料整理风险排查清单，包含风险描述、影响、整改措施、责任人和完成期限。'},
 {name:'个人述职报告',description:'汇总履职成果与能力提升计划',scope:'个人',prompt:'请撰写个人述职报告，包含岗位职责、主要成果、存在不足和下一阶段计划。'},
 {name:'月度工作计划',description:'安排月度目标、任务和关键节点',scope:'个人',prompt:'请整理月度工作计划，按目标、重点任务、时间节点、协同需求和验收标准列出安排。'},
 {name:'邮件润色',description:'让工作邮件简洁清晰、表达得体',scope:'个人',prompt:'请润色以下工作邮件，保留原意，明确背景、诉求和回复期限，使用简洁礼貌的表达。'},
];

const travelPrompts:PromptTemplate[]=[
 {name:'出差申请',description:'整理目的地、出差日期和事由',scope:'通用',prompt:'请整理一份出差申请，包含出差人员、目的地、起止日期、出差事由和预计费用。'},
 {name:'差旅费用报销',description:'整理交通、住宿及补贴明细',scope:'通用',prompt:'请整理差旅报销材料清单，按交通、住宿、餐费及补贴分类，列出金额和待补充凭证。'},
 {name:'差旅费用标准查询',description:'梳理制度中的适用标准',scope:'专用',prompt:'请根据提供的差旅制度梳理交通、住宿和补贴标准，标明适用人员与待确认事项。'},
 {name:'我的差旅计划',description:'规划行程与待办事项',scope:'个人',prompt:'请整理我的差旅行程计划，包含出发与返程安排、会议事项、联系人和待办清单。'},
];

export default function PromptPicker({device,scope,setScope,close,choose,kind='writing'}:{kind?:'writing'|'travel';device:HTMLElement;scope:string;setScope:(value:string)=>void;close:()=>void;choose:(prompt:string)=>void}){
 const prompts=kind==='travel'?travelPrompts:writingPrompts;
 const dialog=useRef<HTMLElement>(null),content=useRef<HTMLDivElement>(null);
 return <ComposerSheet device={device} title="提示词模板" closeLabel="关闭提示词模板" close={close} dialogRef={dialog}>
   <div className="composer-picker-categories" role="tablist" aria-label="模板范围">{scopes.map((value,index)=><button key={value} type="button" role="tab" aria-selected={scope===value} tabIndex={scope===value?0:-1} onClick={()=>{setScope(value);content.current?.scrollTo(0,0)}} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?scopes.length-1:(index+(event.key==='ArrowRight'?1:-1)+scopes.length)%scopes.length;setScope(scopes[next]);(event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();content.current?.scrollTo(0,0)}}><span className="app-pill-label">{value}</span></button>)}</div>
   <div className="composer-picker-content" ref={content}><div className="prompt-picker-list" role="tabpanel" aria-label={scope}>{prompts.filter(item=>scope==='全部'||item.scope===scope).map(item=><article key={item.name}>
    <button type="button" className="prompt-picker-choose" aria-label={'使用'+item.name} onClick={()=>choose(item.prompt)}><span><strong>{item.name}</strong><small>{item.scope}</small></span><span>{item.description}</span></button>
   </article>)}</div></div>
 </ComposerSheet>;
}
