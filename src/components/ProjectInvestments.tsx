import {useLayoutEffect,useRef,useState,type FormEvent} from 'react';
import './OverviewTables.css';
import './ProjectInvestments.css';

// Same demonstration records as the PC portal's PortalDataView.
export const projectInvestments=[
 {name:'智能制造装备升级项目',company:'广东某某科技股份有限公司',type:'智能制造',stage:'投资中',progress:75,profitRate:'16.80%'},
 {name:'高性能复合材料研发项目',company:'深圳某某创新研究院',type:'新材料',stage:'投资中',progress:55,profitRate:'21.40%'},
 {name:'新型生物药物研发项目',company:'北京某某生物科技有限公司',type:'生物医药',stage:'投后管理',progress:45,profitRate:'23.60%'},
 {name:'7nm芯片研发项目',company:'上海某某半导体有限公司',type:'集成电路',stage:'投资中',progress:35,profitRate:'--'},
 {name:'新型固态电池研发项目',company:'杭州某某新能源有限公司',type:'新能源',stage:'投资中',progress:25,profitRate:'18.90%'},
];
export type InvestmentFilters={type:string;company:string;stage:string;month:string};
export const defaultInvestmentFilters:InvestmentFilters={type:'',company:'',stage:'',month:'2026-09'};
export default function ProjectInvestments({onHeightChange,filters,onFilter,onReset}:{onHeightChange:(height:number)=>void;filters:InvestmentFilters;onFilter:()=>void;onReset:()=>void}){
 const {type,company,stage}=filters;
 const ref=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{const element=ref.current;if(!element)return;const measure=()=>onHeightChange(element.offsetHeight);measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect()},[onHeightChange]);
 const rows=projectInvestments.filter(row=>(!type||row.type===type)&&(!company||row.company===company)&&(!stage||row.stage===stage)).slice(0,5);
 return <section ref={ref} className="project-investments overview-table-card" aria-labelledby="project-investment-title">
  <header><h2 id="project-investment-title"><img src="/assets/workbench/section-accent.png" alt=""/>项目投资</h2><button className="investment-filter-button" type="button" aria-label="项目投资筛选" aria-haspopup="dialog" aria-pressed={!!(type||company||stage)} onClick={onFilter}><span className="portal-filter-icon" aria-hidden="true"/></button></header>
  <div className="investment-table-scroll" role="region" aria-label="项目投资数据，左右滑动查看全部指标" tabIndex={0}>
   <table className="overview-data-table"><caption className="sr-only">项目投资，2026年9月，共{rows.length}个项目</caption><thead><tr>{['项目名称','所属企业','项目阶段','预计IRR','预计投资回收期','投资完成率','投资利润率'].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead>
    <tbody>{rows.map(row=><tr key={row.name}><th scope="row">{row.name}</th><td>{row.company}</td><td><span className={'investment-stage '+(row.stage==='投后管理'?'is-managed':'')}>{row.stage}</span></td><td>18.50%</td><td>4.2 年</td><td><span className="investment-progress"><progress aria-label={row.name+'投资完成率'} max={100} value={row.progress}/><span>{row.progress}%</span></span></td><td>{row.profitRate}</td></tr>)}</tbody>
   </table>
   {!rows.length&&<p className="investment-empty" role="status">暂无符合条件的项目 <button onClick={onReset}>重置筛选</button></p>}
  </div>
  <p className="investment-swipe-hint">左右滑动查看完整数据</p>
 </section>;
}

export function InvestmentFilterForm({initial,onApply}:{initial:InvestmentFilters;onApply:(filters:InvestmentFilters)=>void}){
 const [draft,setDraft]=useState({...initial});
 function apply(event:FormEvent){event.preventDefault();onApply({...draft})}
 return <form className="filter-options investment-filter-form" onSubmit={apply}>
  <label>项目类型<select aria-label="项目类型" value={draft.type} onChange={event=>setDraft({...draft,type:event.target.value})}><option value="">全部项目类型</option>{projectInvestments.map(row=><option key={row.type}>{row.type}</option>)}</select></label>
  <label>所属企业<select aria-label="所属企业" value={draft.company} onChange={event=>setDraft({...draft,company:event.target.value})}><option value="">全部所属企业</option>{projectInvestments.map(row=><option key={row.company}>{row.company}</option>)}</select></label>
  <label>投资阶段<select aria-label="投资阶段" value={draft.stage} onChange={event=>setDraft({...draft,stage:event.target.value})}><option value="">全部投资阶段</option><option>投资中</option><option>投后管理</option></select></label>
  <label>投资月份<select aria-label="投资月份" value={draft.month} onChange={event=>setDraft({...draft,month:event.target.value})}><option value="2026-09">2026-09</option></select></label>
  <div className="investment-filter-actions"><button className="secondary-button" type="button" onClick={()=>setDraft({...defaultInvestmentFilters})}>重置</button><button className="primary-button" type="submit">应用筛选</button></div>
 </form>;
}
