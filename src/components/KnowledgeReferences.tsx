import {useState} from 'react';
import {X} from 'lucide-react';
import ResourceBrowserIcon from '../features/ResourceBrowserIcon';
import type {Resource} from '../features/data';
import KnowledgePicker from './KnowledgePicker';
import './ComposerAttachments.css';

export default function KnowledgeReferenceCard({file,device,expanded,remove}:{file:Resource;device:HTMLElement|null;expanded:boolean;remove:(id:string)=>void}){
 const [preview,setPreview]=useState(false);
 return <>
  <article className="composer-attachment-card" data-source="knowledge">
   <button type="button" className="composer-attachment-main" aria-label={'预览知识库文档 '+file.name} onClick={()=>setPreview(true)}><ResourceBrowserIcon kind={/\.(txt|csv|md|json)$/i.test(file.name)?'text':file.kind} name={file.name}/><span><strong title={file.name}>{file.name}</strong><small>{file.size}{expanded&&<span className="composer-attachment-source-tag is-knowledge" aria-label="来源：知识库">知识库</span>}</small></span></button>
   <button type="button" className="composer-attachment-remove" aria-label={'移除知识库文档'+file.name} onClick={()=>remove(file.id)}><X size={12}/></button>
  </article>
  {device&&preview&&<KnowledgePicker device={device} previewFile={file} close={()=>setPreview(false)} choose={()=>{}}/>}
 </>;
}
