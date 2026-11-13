import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,Check} from 'lucide-react';
import ComposerSheet from './ComposerSheet';
import './PptPicker.css';

const categories=['全部模板','通用商务','工作汇报','金融投资','战略咨询','培训教学','学术研究','宣传展示'];
export const pptTemplates=[
 {name:'通用商务',category:'通用商务',cover:'business'},
 {name:'经营汇报',category:'工作汇报',cover:'annual'},
 {name:'咨询方案',category:'战略咨询',cover:'consulting'},
 {name:'培训教学',category:'培训教学',cover:'training'},
 {name:'学术研究',category:'学术研究',cover:'research'},
 {name:'宣传展示',category:'宣传展示',cover:'showcase'},
 {name:'青绿学术答辩',category:'学术研究',cover:'thesis'},
 {name:'靛蓝决策分析',category:'金融投资',cover:'finance'},
 {name:'车队运营复盘',category:'工作汇报',cover:'fleet'},
 {name:'可持续发展报告',category:'通用商务',cover:'impact'},
];
export type PptTemplate=typeof pptTemplates[number];

export default function PptPicker({device,selected,close,choose}:{device:HTMLElement;selected:string;close:()=>void;choose:(template:PptTemplate)=>void}){
 const [category,setCategory]=useState('全部模板'),[preview,setPreview]=useState<PptTemplate|null>(null);
 const dialog=useRef<HTMLElement>(null),content=useRef<HTMLDivElement>(null),trigger=useRef('');
 useEffect(()=>{content.current?.scrollTo(0,0);if(preview)dialog.current?.querySelector<HTMLElement>('.ppt-preview-back')?.focus({preventScroll:true});else Array.from(dialog.current?.querySelectorAll<HTMLElement>('button')||[]).find(button=>button.getAttribute('aria-label')===trigger.current)?.focus({preventScroll:true})},[preview]);
 return <ComposerSheet device={device} title={preview?'PPT模板预览':'PPT生成'} closeLabel="关闭PPT生成" close={close} escape={()=>preview?setPreview(null):close()} dialogRef={dialog}>
   {preview?<>
    <div className="composer-picker-content ppt-preview" ref={content}>
     <button type="button" className="ppt-preview-back" onClick={()=>setPreview(null)}><ArrowLeft size={18}/>返回模板列表</button>
     <img src={'/assets/ppt/'+preview.cover+'.webp'} alt={preview.name+'模板封面'}/>
     <h3>{preview.name}</h3><p>{preview.category} · 演示结构</p>
     <ol>{['封面与主题','背景与目标','现状分析','重点工作与行动计划','总结与展望'].map(item=><li key={item}>{item}</li>)}</ol>
    </div>
    <footer className="ppt-preview-footer"><p>选用后生成可编辑的演示大纲</p><button type="button" onClick={()=>choose(preview)}>使用此模板</button></footer>
   </>:<>
    <div className="composer-picker-categories" role="tablist" aria-label="PPT模板分类">{categories.map((value,index)=><button type="button" role="tab" aria-selected={category===value} tabIndex={category===value?0:-1} key={value} onClick={()=>{setCategory(value);content.current?.scrollTo(0,0)}} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?categories.length-1:(index+(event.key==='ArrowRight'?1:-1)+categories.length)%categories.length;setCategory(categories[next]);const button=event.currentTarget.parentElement?.children[next] as HTMLElement;button?.focus();button?.scrollIntoView({block:'nearest',inline:'nearest'});content.current?.scrollTo(0,0)}}><span>{value}</span></button>)}</div>
    <div className="composer-picker-content" ref={content}>
     <div className="ppt-picker-grid" role="tabpanel" aria-label={category}>{pptTemplates.filter(item=>category==='全部模板'||item.category===category).map(item=><article key={item.name} className={selected===item.name?'is-selected':''}>
      <button type="button" className="ppt-picker-cover" aria-label={'选择'+item.name+'模板'} onClick={()=>choose(item)}><img src={'/assets/ppt/'+item.cover+'.webp'} alt={item.name+'模板封面'}/>{selected===item.name&&<span className="ppt-selected"><Check size={14}/>已选</span>}</button>
      <footer><span>{item.name}</span><button type="button" aria-label={'预览'+item.name} onClick={event=>{trigger.current=event.currentTarget.getAttribute('aria-label')||'';setPreview(item)}}>预览</button></footer>
     </article>)}</div>
    </div>
   </>}
 </ComposerSheet>;
}
