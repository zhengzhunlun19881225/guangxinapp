import {ChevronRight} from 'lucide-react';

export const dialogGroups=[
 {label:'基础用法',examples:[{id:'alert',label:'提示弹窗'},{id:'no-title',label:'提示弹窗（无标题）'},{id:'confirm',label:'确认弹窗'}]},
 {label:'圆角按钮样式',examples:[{id:'round-alert',label:'提示弹窗'},{id:'round-no-title',label:'提示弹窗（无标题）'}]},
 {label:'异步关闭',examples:[{id:'async',label:'异步关闭'}]},
 {label:'使用 Dialog 组件',examples:[{id:'component',label:'使用 Dialog 组件'}]},
];

export default function DialogDemo({open}:{open:(type:string)=>void}){
 return <div className="spec-dialog-examples">{dialogGroups.map(group=><section key={group.label}><h4>{group.label}</h4><div className="spec-action-examples">{group.examples.map(example=><button key={example.id} type="button" aria-label={group.label+' · '+example.label} onClick={()=>open('dialog:'+example.id)}><span>{example.label}</span><ChevronRight size={16} aria-hidden="true"/></button>)}</div></section>)}</div>;
}
