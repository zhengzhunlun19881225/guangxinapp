import {useEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,MessageCircleQuestion} from 'lucide-react';
import {Empty,FeatureSearch,FeatureTabs,Mark} from './UI';
import '../components/PillTabs.css';
import './SkillTreeContent.css';

const skillQuestions:Record<string,string[]>={
 财务:['营业收入与利润变化趋势','年度财务报表汇总','经营现金流分析','各企业费用支出情况','资产负债结构分析','预算执行进度','应收账款周转情况','投资回报与风险分析','财务指标同比分析'],
 人力:['人员主要集中在哪些业务领域','人才团队与管理人员年龄分布','30岁以下人员占比','各企业人员入职、离职及变化情况','员工学历结构分布','关键岗位人员情况','人才培养计划完成情况','员工绩效考核分析','人员成本变化趋势'],
 投资:['重点投资项目进展','投资组合收益分析','项目资金投入情况','年度投资计划完成情况','投资风险监测','项目投后评价','产业布局与投资方向','投资项目退出情况','项目关键里程碑'],
 资产:['固定资产分布情况','闲置资产盘活进展','资产使用效率','资产处置进度','资产折旧与账面价值','资产租赁收入','重点资产风险','资产清查结果','资产结构变化'],
 产权:['产权登记办理进度','企业股权结构','产权交易项目情况','国有股权变动记录','产权管理风险','股权投资分布','企业增资与减资情况','产权登记资料完整性','产权事项办理指南'],
};
export default function SkillTreeContent({ask}:{ask:(text:string)=>void}){
 const [category,setCategory]=useState('财务'),[type,setType]=useState('全部'),[query,setQuery]=useState(''),[page,setPage]=useState(1);
 const list=useRef<HTMLDivElement>(null);
 useEffect(()=>{list.current?.scrollTo(0,0)},[category,type,query,page]);
 const types=['全部','经营分析','数据统计','办事指南'];
 const all=['集团','各企业','季度','年度'].flatMap((scope,group)=>skillQuestions[category].map((text,i)=>({id:group+'-'+i,text:scope+text,type:types[1+(i+group)%3]})));
 const filtered=all.filter(q=>(type==='全部'||q.type===type)&&q.text.includes(query));const count=Math.max(1,Math.ceil(filtered.length/9));
 return <div className="skill-tree-content">
  <FeatureSearch placeholder="搜索技能问题" value={query} onChange={value=>{setQuery(value);setPage(1)}}/>
  <section className="feature-surface feature-skills-card"><FeatureTabs label="技能领域" items={Object.keys(skillQuestions)} value={category} onChange={value=>{setCategory(value);setPage(1)}}/>
   <div className="skill-tree-types" role="tablist" aria-label="问题类别">{types.map(item=><button key={item} role="tab" aria-selected={type===item} onClick={()=>{setType(item);setPage(1)}}><span className="app-pill-label">{item}</span></button>)}</div>
   <div className="skill-tree-questions" ref={list}>{filtered.slice((page-1)*9,page*9).map(q=><button className="feature-question" key={q.id} onClick={()=>ask(q.text)}><MessageCircleQuestion size={16}/><span><Mark text={q.text} query={query}/></span></button>)}{!filtered.length&&<Empty>未找到相关技能问题</Empty>}</div>
   <nav className="feature-pagination" aria-label="技能分页"><button aria-label="上一页" disabled={page===1} onClick={()=>setPage(page-1)}><ChevronLeft size={18}/></button>{Array.from({length:count},(_,i)=><button key={i} aria-label={'第'+(i+1)+'页'} aria-current={page===i+1?'page':undefined} onClick={()=>setPage(i+1)}>{i+1}</button>)}<button aria-label="下一页" disabled={page===count} onClick={()=>setPage(page+1)}><ChevronRight size={18}/></button></nav>
  </section>
 </div>;
}

