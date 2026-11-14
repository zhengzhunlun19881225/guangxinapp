import {useState} from 'react';
import {ChevronRight,Eye} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import {Empty,FeatureSearch,FeatureShell,FeatureTabs,Mark,Sheet} from './UI';
import AppNavBar,{NavBackIcon} from '../components/AppNavBar';
import SkillTreeContent from './SkillTreeContent';
import ResourceBrowserIcon from './ResourceBrowserIcon';
import KnowledgeNodeList from './KnowledgeNodeList';
import {findKnowledge,knowledgeFileIds,knowledgePath,type KnowledgeNode} from './knowledgeCatalog';
import {download,libraries,queryFor,readResources,routeTo,startShare,type FeatureProps,type Resource} from './data';
import './resource-browser.css';

export function SkillTree({height,navigate,ask}:{height:number;navigate:FeatureProps['navigate'];ask:(text:string)=>void}){
 return <FeatureShell title="技能树" height={height} back={()=>navigate('chat')} right={<button className="feature-text" onClick={()=>navigate('scheduled-shares')}>定时分享</button>}><SkillTreeContent ask={ask}/></FeatureShell>;
}
export default function KnowledgePage({route,locationKey,height,navigate,notify}:FeatureProps){
 const query=queryFor(locationKey),fileView=route==='knowledge-files',scope=['通用','组织','团队','个人'].includes(query.get('scope')||'')?query.get('scope')!:'通用';
 const {path,nodes}=knowledgePath((query.get('path')||'').split('/').filter(Boolean),scope);
 const library=findKnowledge(query.get('library')||'')||libraries.find(item=>item.id===query.get('library'))||libraries[0];
 const [search,setSearch]=useState(''),[selected,setSelected]=useState<string[]>(()=>readLocal('writing-knowledge',[])),[preview,setPreview]=useState<Resource|null>(null),[text,setText]=useState('');
 const returnTo=query.get('return')||'profile',selecting=query.get('select')==='writing',resources=readResources();
 const fileIds='kind' in library?knowledgeFileIds(library):undefined;
 const files=resources.filter(file=>(fileIds?fileIds.includes(file.id):['document','archive'].includes(file.kind))&&file.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
 const visible=nodes.filter(item=>(item.name+(item.description||'')).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
 const context={scope,path:path.map(node=>node.id).join('/'),return:returnTo,...(selecting?{select:'writing'}:{})};
 function browse(ids:string[]=[],nextScope=scope){setSearch('');navigate(routeTo('knowledge',{...context,scope:nextScope,path:ids.join('/')}))}
 function openFiles(node:KnowledgeNode){setSearch('');navigate(routeTo('knowledge-files',{...context,library:node.id}))}
 function openChildren(node:KnowledgeNode){browse([...path.map(item=>item.id),node.id])}
 function toggle(id:string){setSelected(values=>values.includes(id)?values.filter(item=>item!==id):[...values,id])}
 async function openPreview(file:Resource){setPreview(file);setText('');if(file.kind==='document'&&!file.url.endsWith('.pdf'))try{const result=await fetch(file.url);if(!result.ok)throw new Error();setText(await result.text())}catch{setText('内容加载失败，请关闭后重试。')}}
 function confirm(){if(!saveLocal('writing-knowledge',selected)){notify('保存失败，请重试');return}notify('已选择'+selected.length+'份文档');navigate(returnTo)}
 function back(){fileView?browse(path.map(node=>node.id)):path.length?browse(path.slice(0,-1).map(node=>node.id)):navigate(returnTo)}
 const placeholder=fileView?'搜索知识库文档':scope==='个人'?'搜索个人知识库':scope==='通用'?'搜索通用知识库':path.length?'搜索当前部门下的知识库':'搜索'+scope+'知识库';
 const header=<><AppNavBar className="feature-navbar" title={fileView?library.name:'知识库'} left={<button aria-label="返回" onClick={back}><NavBackIcon/></button>}/><div className="resource-browser-header">
  {!fileView&&<FeatureTabs label="知识库范围" segmented items={['通用','组织','团队','个人']} value={scope} onChange={next=>browse([],next)}/>}
  {<div className="resource-browser-search"><FeatureSearch placeholder={placeholder} value={search} onChange={setSearch}/></div>}
  {path.length>0&&<nav className="resource-browser-crumbs" aria-label="知识库位置"><button onClick={()=>browse()}>{scope}</button>{path.map((node,index)=><span key={node.id} style={{display:'inline-flex',alignItems:'center',gap:3}}><ChevronRight size={12}/>{index<path.length-1||fileView?<button onClick={()=>browse(path.slice(0,index+1).map(item=>item.id))}>{node.name}</button>:<span>{node.name}</span>}</span>)}</nav>}
 </div></>;
 return <FeatureShell className="resource-browser knowledge-page" title="知识库" header={header} height={height} back={back} footer={fileView&&selecting?<><button className="feature-selected-count" onClick={()=>{const ids=files.map(file=>file.id);setSelected(ids.every(id=>selected.includes(id))?selected.filter(id=>!ids.includes(id)):[...new Set([...selected,...ids])])}}>全选</button><span className="feature-selected-count">已选择 {selected.length} 份</span><button className="feature-primary" onClick={confirm}>确定{selected.length||''}</button></>:undefined}>
  {fileView?<div className="resource-browser-list">{files.map(file=><div className="resource-browser-row" key={file.id}><button className="resource-browser-open" aria-label={(selecting?'选择':'查看')+file.name} aria-pressed={selecting?selected.includes(file.id):undefined} onClick={()=>selecting?toggle(file.id):openPreview(file)}>{selecting&&<span className={'feature-check is-square'+(selected.includes(file.id)?' is-checked':'')}>{selected.includes(file.id)&&'✓'}</span>}<ResourceBrowserIcon kind={file.name.endsWith('.txt')?'text':file.kind}/><span className="resource-browser-copy"><strong><Mark text={file.name} query={search}/></strong><small>{file.size}</small></span></button><button className="resource-browser-preview" aria-label={'预览'+file.name} onClick={()=>openPreview(file)}><Eye size={17}/></button></div>)}{!files.length&&<Empty>{search?'未找到相关内容':'暂无文档'}</Empty>}</div>:<KnowledgeNodeList nodes={visible} resources={resources} scope={scope} query={search} onFiles={openFiles} onChildren={openChildren}/>}

  {preview&&<Sheet title={preview.name} close={()=>setPreview(null)} footer={<><button className="feature-secondary" onClick={()=>{if(!startShare({kind:'file',title:preview.name,url:preview.url},locationKey.replace(/^#\//,''),navigate))notify('无法创建分享，请重试')}}>转发</button><button className="feature-primary" onClick={()=>download(preview.url,preview.name)}>下载</button></>}>
   {preview.url.endsWith('.pdf')?<iframe title={preview.name} src={preview.url} style={{width:'100%',height:'50vh',border:0}}/>:<pre className="feature-document">{text||'可下载此文件查看完整内容。'}</pre>}
  </Sheet>}
 </FeatureShell>;
}
