import {workbenchTasks,readWorkbenchTasks,findWorkbenchTask,taskCategory} from '../data/workbenchTasks';
import {readLocal} from '../data';
import {todoDetailsFor} from '../data/todoDetails';
import type {Action} from './SceneAction';
import RecordDetails,{RecordTags} from './RecordDetails';

export const referenceTodos=workbenchTasks.filter(task=>task.kind==='pending').map(task=>({...task,creator:task.author}));
const originalTitles=['李俊发起的“项目审批”','刘洋发起的“产品调价申请”','张锐发起的“公文审批”'];
export function TodoDetailList({onAction}:{onAction:(action:Action)=>void}){
 return <div className="todo-detail-list">{readWorkbenchTasks().map(task=><button key={task.id} onClick={()=>onAction({type:task.kind==='pending'?'approve':'todo-detail',value:task.id})}><strong>[系统来源] {task.title}</strong><small>{taskCategory(task.kind)} · 发起人 {task.author} · {task.time} · {task.status}</small></button>)}</div>;
}
export default function TodoDetail({title,processable,onClose}:{title:string;processable:boolean;onClose:()=>void}){
 const task=findWorkbenchTask(title),subject=task?.title||title,reference=referenceTodos.find(item=>item.title===subject),index=originalTitles.indexOf(subject),completed=task?.kind==='completed'||readLocal<string[]>('completed-todos',[]).includes(title),message=task?.kind==='messages'||subject==='第一季度各区域销售业绩汇报通知';
 const category=message?'消息':completed?'已办':'待办';
 const details=todoDetailsFor(subject,message?'通知':reference?'协同':'审批');
 const content=task||reference||message?details.content:index===0?'请核对项目建设范围、实施计划与预算安排，确认申请材料齐全后办理审批。':index===1?'请核对产品调价范围、价格依据和生效时间，并结合业务安排提出审批意见。':'请核对公文内容、发文范围和办理要求，确认后提交审批意见。';
 return <><RecordTags items={[{label:category},{label:task?.status||(completed?'已完成':message?'已读':'正常'),tone:completed||!message?'success':'info'}]}/><RecordDetails fields={[
  {label:'类型',value:details.type,icon:'record'},
  {label:'数据来源',value:details.source,icon:'location'},
  {label:'发起时间',value:task?.time||reference?.time||'1小时前',icon:'date'},
  {label:'发起人',value:task?.author||reference?.creator||['张锐','李昊阳','张文献'][Math.max(0,index)],icon:'person'},
  {label:'内容',value:content,icon:'details'},
 ]}>
  {(!processable||completed||message)&&<div className="record-footer"><button className="secondary-button" onClick={onClose}>关闭</button></div>}
 </RecordDetails></>;
}
