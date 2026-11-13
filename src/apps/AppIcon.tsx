import type {CSSProperties} from 'react';
import {commonAppCatalog,systemAppCatalog} from './pcCatalog';
import {WorkbenchVectorIcon,hasWorkbenchVector} from '../components/WorkbenchVectorIcon';
import type {Application} from './data';
// Mobile IDs retain saved preferences; aliases resolve to the original PC components.
const aliases:Record<string,string>={expense:'travel-expense',travel:'travel-request',invoice:'my-invoices',vehicle:'vehicle-request',leave:'leave-request',income:'income-proof',contract:'contract-draft',counterparty:'counterparty-admission',collaboration:'oa-collaboration',learning:'my-learning',courses:'course-center',treasury:'treasury-portal',funds:'treasury-fund-plan',analytics:'data','oa-system':'oa','bpm-system':'bpm','ai-platform':'ai-share','legal-system':'legal','audit-system':'audit','system-oa':'oa','system-ai':'ai-share','system-hr':'digital-hr','system-finance':'finance','system-legal':'legal','system-safety':'safety','system-learning':'zhixin','system-erp':'erp','system-audit':'audit','system-archive':'digital-archive','system-property':'property-rights','system-science':'science-innovation','system-discipline':'discipline','system-regulation':'key-sector-supervision','system-procurement':'procurement','system-reform':'reform','system-party':'party-building','system-4e':'finance-4e'};
export default function AppIcon({app,system=false}:{app:Application;system?:boolean}){
 const id=aliases[app.id]||app.id,definition=[...commonAppCatalog,...systemAppCatalog].find(a=>a.id===id);
 const Glyph=definition?.icon;
 return <span className="pc-app-icon" data-pc-icon={id} data-shape={system?'system':'application'} aria-hidden="true">
  {hasWorkbenchVector(id)?<WorkbenchVectorIcon name={id}/>:Glyph?<span className="pc-app-glyph" style={{background:`linear-gradient(145deg,${definition.color}aa,${definition.color})`} as CSSProperties}><Glyph size={22} strokeWidth={1.8}/></span>:null}
 </span>
}
