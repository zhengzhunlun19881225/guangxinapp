// PC foreground implementation; mobile fallback background paint and icon slots are preserved.
import React, { useId, useMemo } from 'react';
import { commonAppCatalog, systemAppCatalog } from '../apps/pcCatalog';
import { workbenchSolidGlyphs } from './workbenchSolidGlyphs';

// Preserve reviewed Figma background paints; foreground style follows app scope.
const vectors=import.meta.glob<string>('../assets/workbench-vectors/*.svg',{query:'?raw',import:'default',eager:true});
const systemVectors=import.meta.glob<string>('../assets/system-navigation/*.svg',{query:'?raw',import:'default',eager:true});
const aliases:Record<string,string>={'custom-data':'legal','custom-service':'audit'};
const sourceFor=(name:string)=>vectors[`../assets/workbench-vectors/${aliases[name]||name}.svg`];
export const hasWorkbenchVector=(name:string)=>Boolean(sourceFor(name)||[...commonAppCatalog,...systemAppCatalog].some(app=>app.id===name));
export function WorkbenchVectorIcon({name,className=''}:{name:string;className?:string}) {
  const instance=useId().replace(/[^a-zA-Z0-9_-]/g,''), source=sourceFor(name);
  const common=commonAppCatalog.find(app=>app.id===name),app=common||systemAppCatalog.find(app=>app.id===name);
  const markup=useMemo(()=> (source||'').replace(/\bid="([^"]+)"/g,(_,id)=>`id="wb-${instance}-${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#wb-${instance}-${id})`),[source,instance]);
  const systemMarkup=!common&&systemVectors[`../assets/system-navigation/${name}.svg`];
  if(systemMarkup)return <span className={`wb-vector-icon wb-system-icon ${className}`} data-vector-icon={name} data-icon-style="outline" aria-hidden="true" dangerouslySetInnerHTML={{__html:systemMarkup}}/>;
  if(!app)return source?<span className={`wb-vector-icon ${className}`} data-vector-icon={name} aria-hidden="true" dangerouslySetInnerHTML={{__html:markup}}/>:null;
  const size=Number(source?.match(/viewBox="0 0 (\d+)/)?.[1]||34),Icon=app.icon;
  const background=markup.match(/<rect\b[^>]*\/>/)?.[0],defs=markup.match(/<defs>[\s\S]*?<\/defs>/)?.[0]||'';
  return <span className={`wb-vector-icon ${className}`} data-vector-icon={name} data-icon-style={common?'solid':'outline'} style={!source?{background:`linear-gradient(145deg,${app.color}aa,${app.color})`}:undefined} aria-hidden="true">
    <svg viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {background?<g dangerouslySetInnerHTML={{__html:background+defs}}/>:<rect width={size} height={size} rx={common?8:size/2} fill="none"/>}
      {common?<g transform={`translate(${(size-20)/2} ${(size-20)/2}) scale(${20/24})`}><path d={workbenchSolidGlyphs[name]} fill="white" fillRule="evenodd"/></g>:<Icon x={(size-20)/2} y={(size-20)/2} width={20} height={20} color="white" fill="none" strokeWidth={1.8}/>}
    </svg>
  </span>;
}
