import type {SceneProps} from "../components/SceneAction";
export default function LeaderScenePortalToggle({onAction,active='portal-leader'}:SceneProps&{active?:'portal-overview'|'portal-leader'}){
 return <div className="segmented portal-header-tabs" role="tablist" aria-label="门户视图">
  {([{route:'portal-overview',label:'总体情况'},{route:'portal-leader',label:'综合资讯'}] as const).map(item=><button key={item.route} role="tab" aria-selected={active===item.route} onClick={()=>onAction({type:'navigate',value:item.route})}>{item.label}</button>)}
 </div>;
}
