import {useState} from 'react';
import {BookOpen,ChevronRight,Eye,FileText} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import {Empty,FeatureSearch,FeatureShell,FeatureTabs,Mark,Sheet} from './UI';
import SkillTreeContent from './SkillTreeContent';
import {download,libraries,queryFor,readResources,routeTo,startShare,type FeatureProps,type Resource} from './data';

export function SkillTree({height,navigate,ask}:{height:number;navigate:FeatureProps['navigate'];ask:(text:string)=>void}){
 return <FeatureShell title="技能树" height={height} back={()=>navigate('chat')} right={<button className="feature-text" onClick={()=>navigate('scheduled-shares')}>定时分享</button>}><SkillTreeContent ask={ask}/></FeatureShell>;
}

export default function KnowledgePage({route,locationKey,height,navigate,notify}:FeatureProps){
 const query=queryFor(locationKey),fileView=route==='knowledge-files',library=libraries.find(item=>item.id===query.get('library'))||libraries[0];
 const [scope,setScope]=useState(query.get('scope')||'组织'),[department,setDepartment]=useState(query.get('department')||''),[search,setSearch]=useState(''),[selected,setSelected]=useState<string[]>(()=>readLocal('writing-knowledge',[])),[preview,setPreview]=useState<Resource|null>(null),[text,setText]=useState('');
 const returnTo=query.get('return')||'profile',selecting=query.get('select')==='writing';
 const visible=libraries.filter(item=>item.scope===scope&&(!department||item.department===department)&&(!search||(item.name+item.description).includes(search)));
 const files=readResources().filter(file=>['document','archive'].includes(file.kind)&&file.name.includes(search));
 function toggle(id:string){setSelected(values=>values.includes(id)?values.filter(item=>item!==id):[...values,id])}
 async function openPreview(file:Resource){setPreview(file);setText('');if(!file.url.endsWith('.pdf')){if(file.kind==='document'){try{const result=await fetch(file.url);if(!result.ok)throw new Error();setText(await result.text())}catch{setText('内容加载失败，请关闭后重试。')}}}}
 function confirm(){if(!saveLocal('writing-knowledge',selected)){notify('保存失败，请重试');return}notify('已选择'+selected.length+'份文档');navigate(returnTo)}
 return <FeatureShell title={fileView?library.name:'知识库'} height={height} back={()=>fileView?navigate(routeTo('knowledge',{scope,department,return:returnTo,...(selecting?{select:'writing'}:{})})):navigate(returnTo)} footer={fileView?<><button className="feature-selected-count" onClick={()=>{const ids=files.map(file=>file.id);setSelected(ids.every(id=>selected.includes(id))?selected.filter(id=>!ids.includes(id)):[...new Set([...selected,...ids])])}}>全选</button><span className="feature-selected-count">已选择 {selected.length} 份</span><button className="feature-primary" onClick={confirm}>确定{selected.length||''}</button></>:undefined}>
  {!fileView&&<FeatureTabs label="知识库范围" segmented items={['通用','组织','团队','个人']} value={scope} onChange={value=>{setScope(value);setDepartment('');setSearch('')}}/>}
  <FeatureSearch placeholder={fileView?'搜索知识库文档':'搜索知识库'} value={search} onChange={setSearch}/>
  {!fileView&&scope==='组织'&&<nav className="feature-breadcrumb" aria-label="知识库位置"><button onClick={()=>setDepartment('')}>集团</button>{department&&<><ChevronRight size={14}/><span>{department}</span></>}</nav>}
  <section className="feature-surface">
   {fileView?files.map(file=><div className="feature-file-row" key={file.id}><button className="feature-row" aria-label={'选择'+file.name} aria-pressed={selected.includes(file.id)} onClick={()=>toggle(file.id)}><span className={'feature-check is-square'+(selected.includes(file.id)?' is-checked':'')}>{selected.includes(file.id)&&'✓'}</span><span className="feature-file-icon"><FileText size={24}/></span><span><strong><Mark text={file.name} query={search}/></strong><small>{file.size}</small></span></button><button className="feature-icon-button" aria-label={'预览'+file.name} onClick={()=>openPreview(file)}><Eye size={18}/></button></div>):visible.map(item=><button className="feature-row" key={item.id} onClick={()=>navigate(routeTo('knowledge-files',{library:item.id,scope,department,return:returnTo,...(selecting?{select:'writing'}:{})}))}><img className="feature-library-icon" src="/assets/profile/knowledge.svg" alt=""/><span><strong><Mark text={item.name} query={search}/></strong><small>{item.description}</small></span><ChevronRight size={18}/></button>)}
   {!fileView&&scope==='组织'&&!department&&!search&&<><p className="feature-section-label">按组织浏览</p>{['财务部','研发部'].map(name=><button className="feature-row" key={name} onClick={()=>setDepartment(name)}><BookOpen size={20}/><span>{name}</span><ChevronRight size={18}/></button>)}</>}
   {(fileView?!files.length:!visible.length)&&<Empty>{search?'未找到相关内容':'暂无知识库'}</Empty>}
  </section>
  {preview&&<Sheet title={preview.name} close={()=>setPreview(null)} footer={<><button className="feature-secondary" onClick={()=>{if(!startShare({kind:'file',title:preview.name,url:preview.url},locationKey.replace(/^#\//,''),navigate))notify('无法创建分享，请重试')}}>转发</button><button className="feature-primary" onClick={()=>download(preview.url,preview.name)}>下载</button></>}>
   {preview.url.endsWith('.pdf')?<iframe title={preview.name} src={preview.url} style={{width:'100%',height:'50vh',border:0}}/>:<pre className="feature-document">{text||'可下载此文件查看完整内容。'}</pre>}
  </Sheet>}
 </FeatureShell>;
}
