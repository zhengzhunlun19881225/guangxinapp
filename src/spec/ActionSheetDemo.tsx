import {ChevronRight} from 'lucide-react';

export const actionSheetExamples=[
 {id:'basic',label:'基础用法'},
 {id:'icons',label:'展示图标'},
 {id:'cancel',label:'展示取消按钮'},
 {id:'description',label:'展示描述信息'},
 {id:'states',label:'选项状态'},
 {id:'custom',label:'自定义面板'},
] as const;

export default function ActionSheetDemo({open}:{open:(type:string)=>void}){
 return <div className="spec-action-examples">{actionSheetExamples.map(example=><button type="button" key={example.id} onClick={()=>open('actionsheet:'+example.id)}><span>{example.label}</span><ChevronRight size={16} aria-hidden="true"/></button>)}</div>;
}
