import {FileArchive,FileText,Image,Music,Video} from 'lucide-react';

export default function ResourceBrowserIcon({kind,name=''}:{kind:string;name?:string}){
 const artwork=['folder','library','team'].includes(kind)?kind:kind==='pdf'||/\.pdf$/i.test(name)?'pdf':kind==='word'||/\.docx?$/i.test(name)?'word':null;
 if(artwork)return <img className="resource-browser-icon is-artwork" src={'/assets/ui/resource-'+artwork+'.png'} width={40} height={40} alt="" aria-hidden="true"/>;
 if(kind==='organization')return <svg className="resource-browser-icon is-outlined" viewBox="0 0 40 40" aria-hidden="true"><path d="m9 25 11-6 11 6-11 6Z" fill="#1686ff"/><path d="m9 20 11-6 11 6-11 6Z" fill="#8ee9ee"/><path d="m9 15 11-6 11 6-11 6Z" fill="#48cfdc"/></svg>;
 const Icon=kind==='image'?Image:kind==='video'?Video:kind==='audio'?Music:kind==='archive'?FileArchive:FileText;
 return <span className={'resource-browser-icon is-'+kind} aria-hidden="true">{kind==='text'?<span>T</span>:<Icon size={28} strokeWidth={1.8}/>}</span>;
}
