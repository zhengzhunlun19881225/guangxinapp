import {useState,type FormEvent} from 'react';
import type {SceneProps} from './SceneAction';
import {Search} from './Controls';
import {readLocal,saveLocal} from '../data';
import './RecentForms.css';

export const recentFormNames=[
  '进出口业务统计表','数据测试','服务中心车辆报修申请','纺织股份用车申请单',
  '日合规审查表','纺织股份信息系统申请','业务进出口情况统计表',
  '信息系统群组变更申请','业务进出口情况月报','纺织股份用车审批表',
];

function FormButton({name,onAction}:{name:string}&SceneProps){
  return <button className="recent-form-entry" title={name} onClick={()=>onAction({type:'recent-form',value:name})}>
    <img src="/assets/workbench/spreadsheet.png" alt=""/><span>{name}</span>
  </button>;
}

export default function RecentForms({onAction}:SceneProps){
  return <section className="work-recent-forms" aria-labelledby="recent-forms-heading">
    <header><h2 id="recent-forms-heading"><img src="/assets/workbench/section-accent.png" alt=""/>最近使用表单</h2>
      <button onClick={()=>onAction({type:'recent-forms',value:'最近使用表单'})}>更多 ›</button></header>
    <div className="recent-forms-grid">{recentFormNames.slice(0,5).map(name=><FormButton key={name} name={name} onAction={onAction}/>)}</div>
  </section>;
}

export function RecentFormsList({onAction}:SceneProps){
  const [query,setQuery]=useState('');
  const matches=recentFormNames.filter(name=>name.includes(query.trim()));
  return <div className="recent-forms-list"><Search value={query} onChange={setQuery}/>
    {matches.map(name=><FormButton key={name} name={name} onAction={onAction}/>)}
    {!matches.length&&<p className="empty-state">未找到相关表单</p>}
  </div>;
}

export function RecentFormEditor({title,onDone}:{title:string;onDone:(message:string)=>void}){
  const storageKey='workbench-form-'+title;
  const [values,setValues]=useState<Record<string,string>>(()=>readLocal(storageKey,{}));
  const fields=title.includes('用车')?['申请人','用车日期','目的地','用车事由']:
    title.includes('报修')?['申请人','车牌号','故障描述']:
    title.includes('系统')?['申请人','所属部门','系统名称','申请说明']:
    title.includes('合规')?['填报人','审查日期','审查事项','审查意见']:
    ['填报人','所属部门','统计月份','填报说明'];
  function submit(event:FormEvent){
    event.preventDefault();
    onDone(saveLocal(storageKey,values)?'表单已保存':'保存失败，请重试');
  }
  return <form className="demo-form" onSubmit={submit}>
    {fields.map(field=><label key={field}>{field}
      <input required value={values[field]||''} type={field.includes('日期')?'date':field.includes('月份')?'month':'text'}
        autoComplete="off" placeholder={'请输入'+field} onChange={event=>setValues({...values,[field]:event.target.value})}/>
    </label>)}
    <p className="demo-note">表单演示，填写内容仅保存在本机。</p>
    <button className="primary-button" type="submit">保存表单</button>
  </form>;
}
