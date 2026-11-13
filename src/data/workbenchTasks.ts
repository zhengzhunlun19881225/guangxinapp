import {readLocal} from '../data';
export type TaskKind='pending'|'completed'|'messages';
export type WorkbenchTask={id:string;kind:TaskKind;title:string;author:string;time:string;status:string};
// Content fixtures from the PC workbench. Each occurrence has its own identity.
const initial:Record<TaskKind,string[][]>={
 pending:[['关于集团2026年调研实施方案的讨论','上官成硕','1小时前','正常'],['年度新品研发规划汇报-研发周期推广规划','张锐','1小时前','正常'],['关于广新产业园AI智能管控系统项目申请事项','李佳佳','2026-10-29','正常'],['关于集团2026年调研实施方案的讨论','李佳佳','2026-10-29','正常']],
 completed:[['年度采购计划审批','张锐','2026-10-28','已完成'],['第三季度项目验收申请','李佳佳','2026-10-27','已完成']],
 messages:[['关于集团2026年调研实施方案的通知','上官成硕','1小时前','未读'],['开发管理系统日报提交提醒','张锐','2小时前','未读'],['本周项目进展汇总已更新','李佳佳','2026-10-29','已读']],
};

export const workbenchTasks:WorkbenchTask[]=Object.entries(initial).flatMap(([kind,rows])=>rows.map(([title,author,time,status],index)=>({id:`${kind}-${index}`,kind:kind as TaskKind,title,author,time,status})));
export function readWorkbenchTasks():WorkbenchTask[]{
 const completed=readLocal<string[]>('completed-todos',[]);
 return workbenchTasks.map(task=>task.kind==='pending'&&completed.includes(task.id)?{...task,kind:'completed',status:'已完成'}:task);
}
export const taskCategory=(kind:TaskKind)=>kind==='pending'?'待办':kind==='completed'?'已办':'消息';
export const findWorkbenchTask=(value:string)=>readWorkbenchTasks().find(task=>task.id===value)||readWorkbenchTasks().find(task=>task.title===value);
