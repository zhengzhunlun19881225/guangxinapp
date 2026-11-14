import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,Check,ChevronRight,Eye,FolderOpen} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import {Empty,FeatureSearch,FeatureTabs,Mark} from '../features/UI';
import ResourceBrowserIcon from '../features/ResourceBrowserIcon';
import {knowledgePath,type KnowledgeNode} from '../features/knowledgeCatalog';
import {readResources,type Resource} from '../features/data';
import ComposerSheet from './ComposerSheet';
import '../features/resource-browser.css';
import './KnowledgePicker.css';

export default function KnowledgePicker({device,close,choose}:{device:HTMLElement;close:()=>void;choose:(ids:string[])=>void}){
 const resources=readResources(),[scope,setScope]=useState('通用'),[ids,setIds]=useState<string[]>([]),[library,setLibrary]=useState<KnowledgeNode|null>(null),[query,setQuery]=useState(''),[selected,setSelected]=useState<string[]>(()=>readLocal<string[]>('writing-knowledge',[]).filter(id=>resources.some(file=>file.id===id))),[preview,setPreview]=useState<Resource|null>(null),[text,setText]=useState(''),[loading,setLoading]=useState(false),[error,setError]=useState('');
 const dialog=useRef<HTMLElement>(null),{nodes,path}=knowledgePath(ids,scope),files=resources.filter(file=>library?.resourceIds?.includes(file.id)&&file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())),visible=nodes.filter(node=>(node.name+(node.description||'')).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 useEffect(()=>{if(!preview)return;setText('');setError('');if(!/\.(txt|csv|md|json)$/i.test(preview.name)){setLoading(false);return}let active=true;const controller=new AbortController();setLoading(true);const timer=setTimeout(()=>controller.abort(),15000);fetch(preview.url,{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error();return response.text()}).then(value=>{if(active)setText(value)}).catch(()=>{if(active)setError('文档读取失败，可下载查看或重新打开预览')}).finally(()=>{clearTimeout(timer);if(active)setLoading(false)});return()=>{active=false;clearTimeout(timer);controller.abort()}},[preview]);
 function browse(next:string[]){setIds(next);setLibrary(null);setQuery('');setError('')}
 function open(node:KnowledgeNode){setQuery('');node.kind==='library'?setLibrary(node):browse([...ids,node.id])}
 function count(node:KnowledgeNode){return node.kind==='library'?resources.filter(file=>node.resourceIds?.includes(file.id)).length:(node.children||[]).filter(item=>item.kind==='library').length}
 function toggle(id:string){setSelected(values=>values.includes(id)?values.filter(value=>value!==id):[...values,id]);setError('')}
 function confirm(){if(!saveLocal('writing-knowledge',selected)){setError('选择保存失败，请重试');return}choose(selected)}
 function back(){if(preview){setPreview(null);setError('')}else if(library){setLibrary(null);setQuery('')}else browse(ids.slice(0,-1))}
 const leavePreview=()=>{setPreview(null);setError('')};
 const closeCurrent=()=>preview?leavePreview():close();
 return <ComposerSheet device={device} title={preview?'文档预览':'知识库'} closeLabel={preview?'关闭文档预览':'关闭知识库'} close={closeCurrent} escape={closeCurrent} dialogRef={dialog}>
  {preview?<div className="knowledge-picker-preview"><button type="button" className="knowledge-picker-back" onClick={leavePreview}><ArrowLeft size={18}/>返回选择</button><h3>{preview.name}</h3>{loading?<p role="status">正在读取文档…</p>:error?<p role="alert">{error}</p>:text?<pre>{text}</pre>:/\.pdf$/i.test(preview.name)?<iframe src={preview.url} title={preview.name} sandbox=""/>:<p>此格式暂不支持内容预览，可下载后查看</p>}<a href={preview.url} download={preview.name}>下载文档</a></div>:<div className="knowledge-picker">
   <FeatureTabs label="知识库范围" segmented items={['通用','组织','团队','个人']} value={scope} onChange={next=>{setScope(next);browse([])}}/>
   <FeatureSearch value={query} onChange={setQuery} placeholder={library?'搜索知识库文档':'搜索'+scope+'知识库'}/>
   {(path.length>0||library)&&<nav className="knowledge-picker-crumbs" aria-label="知识库位置"><button type="button" className="knowledge-picker-back" aria-label="返回上一级" onClick={back}><ArrowLeft size={17}/></button><button type="button" onClick={()=>browse([])}>{scope}</button>{path.map((node,index)=><span key={node.id}><ChevronRight size={12}/><button type="button" onClick={()=>browse(path.slice(0,index+1).map(value=>value.id))}>{node.name}</button></span>)}{library&&<span><ChevronRight size={12}/>{library.name}</span>}</nav>}
   <div className="knowledge-picker-list">{library?files.map(file=><div className="knowledge-picker-row" key={file.id}><button type="button" className="knowledge-picker-open" role="checkbox" aria-checked={selected.includes(file.id)} aria-label={'选择'+file.name} onClick={()=>toggle(file.id)}><i className={'knowledge-picker-check'+(selected.includes(file.id)?' is-checked':'')}>{selected.includes(file.id)&&<Check size={14}/>}</i><ResourceBrowserIcon kind={file.name.endsWith('.txt')?'text':file.kind}/><span><strong><Mark text={file.name} query={query}/></strong><small>{file.size}</small></span></button><button type="button" className="knowledge-picker-preview-button" aria-label={'预览'+file.name} onClick={()=>setPreview(file)}><Eye size={18}/></button></div>):visible.map(node=><button className="knowledge-picker-row knowledge-picker-open" type="button" key={node.id} onClick={()=>open(node)}><ResourceBrowserIcon kind={node.kind}/><span><strong><Mark text={node.name+'('+count(node)+')'} query={query}/>{node.kind!=='library'&&count(node)>0&&<FolderOpen size={16}/>}</strong>{node.description&&<small>{node.description}</small>}</span><ChevronRight size={16}/></button>)}{(library?!files.length:!visible.length)&&<Empty>{query?'未找到相关内容':'暂无知识库内容'}</Empty>}</div>
   {error&&<p className="knowledge-picker-error" role="alert">{error}</p>}
   <footer className="knowledge-picker-footer"><div><span>已选择 {selected.length} 份文档</span><button type="button" disabled={!selected.length} onClick={()=>setSelected([])}>清空</button></div><div><button type="button" className="knowledge-picker-cancel" onClick={close}>取消</button><button type="button" className="knowledge-picker-confirm" onClick={confirm}>确定{selected.length?'（'+selected.length+'）':''}</button></div></footer>
  </div>}
 </ComposerSheet>;
}
