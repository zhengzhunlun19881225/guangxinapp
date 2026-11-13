import {readLocal,saveLocal} from '../data';
import type {Action} from '../components/SceneAction';
import {commonAppCatalog,systemAppCatalog,type WorkbenchApp} from './pcCatalog';
export type ShortcutKind='workbench'|'portal';
export const systemColumns=5;
export type Application={id:string;name:string;category:string;action:Action};
// Keep mobile identifiers so valid saved ordering and form actions survive.
const commonIds:Record<string,string>={'travel-expense':'expense','travel-request':'travel','my-invoices':'invoice','vehicle-request':'vehicle','leave-request':'leave','income-proof':'income','contract-draft':'contract','counterparty-admission':'counterparty','oa-collaboration':'collaboration','my-learning':'learning','course-center':'courses','treasury-portal':'treasury','treasury-fund-plan':'funds'};
const systemIds:Record<string,string>={oa:'system-oa','ai-share':'system-ai','digital-hr':'system-hr',finance:'system-finance',legal:'system-legal',safety:'system-safety',zhixin:'system-learning',erp:'system-erp',audit:'system-audit','digital-archive':'system-archive','property-rights':'system-property','science-innovation':'system-science',discipline:'system-discipline','key-sector-supervision':'system-regulation',procurement:'system-procurement',reform:'system-reform','party-building':'system-party','finance-4e':'system-4e'};
const formIds=new Set(['travel','vehicle','leave','overtime']);
function mobileApp(app:WorkbenchApp,kind:ShortcutKind):Application{
 const id=(kind==='workbench'?commonIds:systemIds)[app.id]||app.id;
 return {id,name:app.name,category:app.category,action:id==='system-ai'?{type:'navigate',value:'agents'}:{type:formIds.has(id)?'form':'app-service',value:app.name}};
}
// Membership, category order and default selections follow PC; mobile labels use the shared catalog.
export const catalog=commonAppCatalog.map(app=>mobileApp(app,'workbench'));
export const categories=[...new Set(commonAppCatalog.map(app=>app.category))];
export const systems=systemAppCatalog.map(app=>mobileApp(app,'portal'));
export const allApps=[...catalog,...systems];
export const appById=Object.fromEntries(allApps.map(app=>[app.id,app]));
export const defaults:Record<ShortcutKind,string[]>={workbench:catalog.map(app=>app.id),portal:systems.map(app=>app.id)};
const portalAliases:Record<string,string>={'oa-system':'system-oa','ai-platform':'system-ai','legal-system':'system-legal','audit-system':'system-audit'};
function normalizeApps(kind:ShortcutKind,ids:unknown[],completeRetired=false){
 const aliases=kind==='portal'?{...systemIds,...portalAliases}:commonIds;
 const allowed=new Set(defaults[kind]),mapped=ids.filter((id):id is string=>typeof id==='string').map(id=>aliases[id]||id);
 const valid=[...new Set(mapped.filter(id=>allowed.has(id)))];
 // Like PC: retire obsolete entries, retain surviving order, then fill its directory.
 // An intentionally empty or valid customized selection remains intact.
 return completeRetired&&mapped.some(id=>!allowed.has(id))?[...new Set([...valid,...defaults[kind]])]:valid;
}
export function loadApps(kind:ShortcutKind):string[]{
 const data=readLocal<unknown>('app-shortcuts-v1-'+kind,defaults[kind]);
 return Array.isArray(data)?normalizeApps(kind,data,true):[...defaults[kind]];
}
export function saveApps(kind:ShortcutKind,ids:string[]){return saveLocal('app-shortcuts-v1-'+kind,normalizeApps(kind,ids))}
export function moveApp(ids:string[],from:number,to:number){const next=[...ids];if(from<0||to<0||to>=ids.length)return next;const [id]=next.splice(from,1);next.splice(to,0,id);return next}
