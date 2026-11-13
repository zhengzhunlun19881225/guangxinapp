import {useMemo, useState} from 'react';
import {CalendarDays, ChevronLeft, ChevronRight, Search} from 'lucide-react';
import './TravelDocuments.css';

type TravelDocument={id:string;applicant:string;date:string;type:string;amount:string;status:string};
const documents:TravelDocument[]=[
 {id:'GHG-BX2610240035',applicant:'曾珂',date:'-',type:'GHG-出差申请单',amount:'0 元',status:'草稿'},
 {id:'GHG-BX2610220005',applicant:'曾珂',date:'-',type:'GHG-出差申请单',amount:'0 元',status:'草稿'},
 {id:'GHG-BX2610220003',applicant:'曾珂',date:'-',type:'GHG-出差申请单',amount:'0 元',status:'草稿'},
];

function SummaryCard({item,onOpen}:{item:TravelDocument;onOpen:()=>void}){
 return <button className="travel-document-card" onClick={onOpen}>
  <header><strong>单据 · {item.id}</strong><ChevronRight size={21}/></header>
  <dl><div><dt>申请人：</dt><dd>{item.applicant}</dd></div><div><dt>单据日期：</dt><dd>{item.date}</dd></div><div><dt>单据类型：</dt><dd>{item.type}</dd></div><div><dt>金额：</dt><dd>{item.amount}</dd></div><div><dt>状态：</dt><dd>{item.status}</dd></div></dl>
 </button>;
}

export default function TravelDocuments(){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState<TravelDocument|null>(null);
 const filtered=useMemo(()=>documents.filter(item=>(item.id+item.applicant+item.type).includes(query)),[query]);
 return <div className="travel-documents">
  {selected?<>
   <div className="travel-detail-nav"><button aria-label="返回单据列表" onClick={()=>setSelected(null)}><ChevronLeft size={25}/></button><strong>详情</strong><span/></div>
   <div className="travel-detail-card"><header><strong>{selected.id}</strong><span>{selected.status}</span></header><dl><div><dt>申请人：</dt><dd>{selected.applicant}</dd></div><div><dt>单据日期：</dt><dd>{selected.date}</dd></div><div><dt>单据类型：</dt><dd>{selected.type}</dd></div><div><dt>金额：</dt><dd>{selected.amount}</dd></div></dl></div>
   <section className="travel-detail-section"><h3>基本信息</h3><dl><div><dt>业务类型</dt><dd>出差申请</dd></div><div><dt>核算主体</dt><dd>-</dd></div><div><dt>币种</dt><dd>人民币</dd></div><div><dt>摘要</dt><dd>-</dd></div><div><dt>途径及目的地</dt><dd>-</dd></div><div><dt>开始日期</dt><dd>-</dd></div></dl></section>
   <section className="travel-detail-section"><h3>状态信息</h3></section>
  </>:<>
   <div className="travel-document-search"><label><Search size={22}/><input aria-label="搜索单据" placeholder="搜索" value={query} onChange={event=>setQuery(event.target.value)}/></label><button aria-label="按日期筛选"><CalendarDays size={23}/></button></div>
   <div className="travel-document-list">{filtered.map(item=><SummaryCard key={item.id} item={item} onOpen={()=>setSelected(item)}/>)}{!filtered.length&&<p className="empty-state">暂无单据记录</p>}</div>
  </>}
 </div>;
}
