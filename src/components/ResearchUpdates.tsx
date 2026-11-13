import {useLayoutEffect,useRef} from 'react';
import type {Action} from './SceneAction';
import './OverviewTables.css';

// Existing mobile records, with the complete update text from the PC portal.
export const researchUpdates=[
 {company:'广新集团',category:'智能算法',update:'成功研发新一代智能算法模型'},
 {company:'广新集团',category:'复合材料',update:'高性能复合材料项目进入中试阶段'},
 {company:'广新集团',category:'智能算法',update:'新型生物药物临床试验申请获批'},
 {company:'广新集团',category:'复合材料',update:'7nm芯片研发取得重大突破'},
];

export default function ResearchUpdates({onHeightChange,onAction}:{onHeightChange:(height:number)=>void;onAction:(action:Action)=>void}){
 const ref=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{const element=ref.current;if(!element)return;const measure=()=>onHeightChange(element.offsetHeight);measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect()},[onHeightChange]);
 return <section ref={ref} className="research-updates overview-table-card" aria-labelledby="research-updates-title">
  <header><h2 id="research-updates-title"><img src="/assets/workbench/section-accent.png" alt=""/>科研动态</h2></header>
  <div className="research-table-scroll" role="region" aria-label="科研动态，左右滑动查看完整内容" tabIndex={0}>
  <table className="overview-data-table research-updates-table">
   <caption className="sr-only">科研动态，最多展示5条</caption>
   <colgroup><col className="research-company"/><col className="research-category"/><col/></colgroup>
   <thead><tr><th scope="col">企业名称</th><th scope="col">类别</th><th scope="col">最新动态</th></tr></thead>
   <tbody>{researchUpdates.slice(0,5).map(row=><tr key={row.update}><th scope="row">{row.company}</th><td>{row.category}</td><td><button type="button" onClick={()=>onAction({type:'detail',value:row.update})}>{row.update}</button></td></tr>)}</tbody>
  </table>
  </div>
 </section>;
}
