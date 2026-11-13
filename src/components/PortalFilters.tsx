import {useState,type FormEvent} from 'react';
import type {SceneProps} from './SceneAction';
import './PortalFilters.css';

export default function PortalFilters({onAction,company,year}:SceneProps&{company:string;year:string}){
  const active=company!=='全部企业'||year!=='2026年';
  return <>{[
    ['kpi','集团合并'],['tax','二级公司纳税情况'],['map','各省份年度累计实缴税金'],
  ].map(([section,title])=><button type="button" key={section}
    className={'portal-filter-button portal-filter-'+section}
    aria-label={title+'筛选'} aria-haspopup="dialog" aria-pressed={active}
    title={'当前：'+company+' · '+year}
    onClick={()=>onAction({type:'filter',value:title})}>
    <span className="portal-filter-icon" aria-hidden="true"/>
  </button>)}</>;
}

export function PortalFilterForm({company,year,onApply}:{company:string;year:string;onApply:(company:string,year:string)=>void}){
  const [draftCompany,setDraftCompany]=useState(company),[draftYear,setDraftYear]=useState(year);
  function apply(event:FormEvent){event.preventDefault();onApply(draftCompany,draftYear)}
  return <form className="filter-options" onSubmit={apply}>
    <label>企业<select aria-label="企业" value={draftCompany} onChange={event=>setDraftCompany(event.target.value)}>
      {['全部企业','集团合并','广新集团','广东省广新控股集团有限公司'].map(value=><option key={value}>{value}</option>)}
    </select></label>
    <label>年份<select aria-label="年份" value={draftYear} onChange={event=>setDraftYear(event.target.value)}>
      {['2026年','2025年','2024年'].map(value=><option key={value}>{value}</option>)}
    </select></label>
    <button className="primary-button" type="submit">应用筛选</button>
  </form>;
}
