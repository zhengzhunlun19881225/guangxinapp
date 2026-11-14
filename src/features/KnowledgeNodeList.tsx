import {ChevronRight,FolderOpen} from 'lucide-react';
import {Empty,Mark} from './UI';
import ResourceBrowserIcon from './ResourceBrowserIcon';
import {knowledgeFileIds,type KnowledgeNode} from './knowledgeCatalog';
import type {Resource} from './data';
import './KnowledgeNodeList.css';

export default function KnowledgeNodeList({nodes,resources,scope,query,onFiles,onChildren}:{nodes:KnowledgeNode[];resources:Resource[];scope:string;query:string;onFiles:(node:KnowledgeNode)=>void;onChildren:(node:KnowledgeNode)=>void}){
 const label=scope==='组织'?'组织名称':scope==='团队'?'团队名称':'知识库名称';
 return <>
  <div className="knowledge-node-columns" aria-hidden="true"><span>{label}</span><span>本级文件</span><span>下级</span></div>
  <div className="knowledge-node-list" aria-label={label+'列表'}>{nodes.map(node=>{
   const ids=knowledgeFileIds(node),count=resources.filter(file=>ids.includes(file.id)).length,hasChildren=!!node.children?.length;
   return <div className="knowledge-node-row" key={node.id}>
    <button type="button" className="knowledge-node-name" aria-label={node.name+'('+count+')'} title={node.name} onClick={()=>node.kind==='library'?onFiles(node):onChildren(node)}><ResourceBrowserIcon kind={node.kind}/><span><strong><Mark text={node.name} query={query}/></strong>{node.description&&<small>{node.description}</small>}</span></button>
    <button type="button" className="knowledge-node-files" aria-label={'查看'+node.name+'本级文件，'+count+'个文件'} onClick={()=>onFiles(node)}><FolderOpen size={18}/><span>{count}</span></button>
    <div className="knowledge-node-children-cell">{hasChildren&&<button type="button" className="knowledge-node-children" aria-label={'进入'+node.name+'下级'} onClick={()=>onChildren(node)}><ChevronRight size={17}/></button>}</div>
   </div>
  })}{!nodes.length&&<Empty>{query?'未找到相关内容':'暂无下级内容'}</Empty>}</div>
 </>;
}
