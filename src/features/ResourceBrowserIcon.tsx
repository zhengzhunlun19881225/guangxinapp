import {useId} from 'react';
import {FileArchive,FileText,Image,Music,Users,Video} from 'lucide-react';

export default function ResourceBrowserIcon({kind}:{kind:string}){
 const id=useId();
 if(kind==='folder')return <svg className="resource-browser-icon" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id={id} x2="0" y2="1"><stop stopColor="#ffc52b"/><stop offset="1" stopColor="#ff8000"/></linearGradient></defs><path d="M2 9a3 3 0 0 1 3-3h12l3 4h15a3 3 0 0 1 3 3v19H2Z" fill="#ff8500"/><path d="M4 13h31v18H4Z" fill="white"/><path d="M6 15h31a2 2 0 0 1 2 2l-4 17H1Z" fill={'url(#'+id+')'}/><path d="M24 19h8m-9 3h8m-9 3h8" stroke="white" strokeWidth="1.4"/></svg>;
 if(kind==='organization')return <svg className="resource-browser-icon is-outlined" viewBox="0 0 40 40" aria-hidden="true"><path d="m9 25 11-6 11 6-11 6Z" fill="#1686ff"/><path d="m9 20 11-6 11 6-11 6Z" fill="#8ee9ee"/><path d="m9 15 11-6 11 6-11 6Z" fill="#48cfdc"/></svg>;
 if(kind==='library')return <svg className="resource-browser-icon" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id={id} x2="1" y2="1"><stop stopColor="#a9e9ff"/><stop offset="1" stopColor="#478dff"/></linearGradient></defs><rect width="40" height="40" rx="8" fill={'url(#'+id+')'}/><path d="m5 10 22-6 8 5-22 7Z" fill="#d5fbff"/><path d="M5 10v25l8 4V16Z" fill="#37cbd9"/><path d="m13 16 22-7v25l-22 5Z" fill="#1268ed"/><path d="m9 12 21-7M13 14l20-6" stroke="#72baff"/><path d="m19 22 10-3m-10 8 10-3m-10 8 7-2" stroke="white" strokeWidth="1.5"/><path d="m11 14 4 1v24l-4-1Z" fill="#9be557"/></svg>;
 const Icon=kind==='team'?Users:kind==='image'?Image:kind==='video'?Video:kind==='audio'?Music:kind==='archive'?FileArchive:FileText;
 return <span className={'resource-browser-icon is-'+kind} aria-hidden="true">{kind==='text'?<span>T</span>:kind==='word'?<span>W</span>:<Icon size={28} strokeWidth={1.8}/>}</span>;
}
