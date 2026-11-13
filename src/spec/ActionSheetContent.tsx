import {Bookmark,FileText,Link,MessageCircle,Share2,UsersRound} from 'lucide-react';
type SheetOption={label:string;description?:string;disabled?:boolean;loading?:boolean;danger?:boolean};

export default function ActionSheetContent({variant,close,message}:{variant:string;close:()=>void;message:(text:string)=>void}){
 const choose=(label:string)=>{close();message('已选择'+label)};
 const cancel=['cancel','description','states','custom'].includes(variant);
 const options:SheetOption[]=variant==='states'
  ?[{label:'正常选项'},{label:'禁用选项',disabled:true},{label:'加载中',loading:true},{label:'危险选项',danger:true}]
  :[{label:'选项一'},{label:'选项二'},{label:'选项三',description:variant==='description'?'描述信息':undefined}];
 const icons=[FileText,Link,Share2];
 return <>
  {variant==='description'&&<p className="spec-sheet-description">这是一段描述信息</p>}
  {variant==='custom'?<div className="spec-sheet-custom">
   <h3>分享给同事</h3><p>选择分享方式</p>
   <div className="spec-sheet-preview"><FileText size={26} aria-hidden="true"/><div><strong>2026 年度工作安排</strong><span>工作文档 · PDF</span></div></div>
   <div className="spec-sheet-share-grid">{[{label:'企业微信',Icon:MessageCircle},{label:'联系人',Icon:UsersRound},{label:'收藏',Icon:Bookmark},{label:'复制链接',Icon:Link}].map(({label,Icon})=><button type="button" key={label} onClick={()=>choose(label)}><span><Icon size={22} aria-hidden="true"/></span>{label}</button>)}</div>
  </div>:<div className={'spec-sheet-options'+(variant==='icons'?' has-icons':'')}>{options.map((option,index)=>{
   const Icon=icons[index%icons.length];
   return <button type="button" className={'spec-sheet-option'+(option.danger?' is-danger':'')+(option.loading?' is-loading':'')} key={option.label} disabled={option.disabled||option.loading} aria-busy={option.loading||undefined} onClick={()=>choose(option.label)}>
    {variant==='icons'&&<Icon size={20} aria-hidden="true"/>}
    {option.loading&&<span className="spec-sheet-spinner" aria-hidden="true"/>}
    <span>{option.label}{option.description&&<small>{option.description}</small>}</span>
   </button>;
  })}</div>}
  {cancel&&<div className="spec-sheet-cancel"><button type="button" onClick={close}>取消</button></div>}
 </>;
}
