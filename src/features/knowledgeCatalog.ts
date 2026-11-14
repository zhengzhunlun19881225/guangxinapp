export type KnowledgeNode={id:string;name:string;kind:'library'|'organization'|'team';description?:string;resourceIds?:string[];children?:KnowledgeNode[]};
const library=(id:string,name:string,resourceIds:string[]=[],description?:string):KnowledgeNode=>({id,name,kind:'library',resourceIds,description});
export const knowledgeCatalog:Record<string,KnowledgeNode[]>={
 通用:[library('solar','光伏知识库',[],'用于演示光伏相关知识的问答'),library('approval','测试审批001'),library('indonesia','印尼测试',['report','table']),library('general','通用',['brief','archive'])],
 组织:[{id:'xingwang',name:'星网信通',kind:'organization',children:[library('xingwang-library','星网信通知识库',['report']),{id:'president',name:'1总裁办',kind:'organization',children:[]},{id:'longjun',name:'龙俊杰·两人公司',kind:'organization',children:[library('longjun-library','公司知识库',['table'])]},{id:'test-dept',name:'测试部门群',kind:'organization',children:[]},{id:'cs1aaa',name:'cs1aaa',kind:'organization',children:['333333','44444444','MY_NOCC','cs18888'].map((name,i)=>({id:'cs1aaa-'+i,name,kind:'organization',children:[]}))},...['2财务部','3经营管理部','4通信解决方案部'].map((name,i):KnowledgeNode=>({id:'department-'+i,name,kind:'organization',children:[]}))]},{id:'guangxin',name:'广新集团',kind:'organization',children:[]}],
 团队:['omy-test','龙俊杰','omy-测试','测试111测试团队名称测试团队名称','cs123123测试团队名称','cs123测试团队名称测试团队名称','测试团队','测试团队名称测试团队名称','wenqiang1测试'].map((name,i)=>({id:'team-'+i,name,kind:'team',children:[library('team-library-'+i,name+'知识库',['report'])]})),
 个人:[library('personal-long','测试一下啊长文本会显示异常不呀测试知识库'),library('hyl-test13','hyl-test13'),library('cp-test24','cp-test24',['report','table','brief','archive']),library('personal-wenqiang','文强4测试123123',['report','table','brief','archive'])],
};
export function knowledgePath(ids:string[],scope:string){let nodes=knowledgeCatalog[scope]||[],path:KnowledgeNode[]=[];for(const id of ids){const node=nodes.find(item=>item.id===id);if(!node)break;path.push(node);nodes=node.children||[]}return {path,nodes}}
export function findKnowledge(id:string):KnowledgeNode|undefined{function find(nodes:KnowledgeNode[]):KnowledgeNode|undefined{for(const node of nodes){if(node.id===id)return node;const match=find(node.children||[]);if(match)return match}}return find(Object.values(knowledgeCatalog).flat())}

// Files in this node's own libraries belong to the current level; deeper nodes are excluded.
export function knowledgeFileIds(node:KnowledgeNode):string[]{return [...new Set([...(node.resourceIds||[]),...(node.children||[]).filter(child=>child.kind==='library').flatMap(child=>child.resourceIds||[])])]}
