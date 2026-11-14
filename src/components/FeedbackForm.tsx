import {useEffect,useRef,useState} from 'react';
import {FileText,Plus,X} from 'lucide-react';
import {saveLocal} from '../data';
import './FeedbackForm.css';

type Attachment={id:string;file:File;preview?:string};

async function saveFeedback(content:string,attachments:Attachment[]){
 const record={id:crypto.randomUUID(),content,savedAt:new Date().toISOString(),attachments:attachments.map(({file})=>({name:file.name,type:file.type,size:file.size,file}))};
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{
  const request=indexedDB.open('gx-app-feedback',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('feedback',{keyPath:'id'});
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(new Error('存储暂不可用'));
 });
 try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('feedback','readwrite');tx.objectStore('feedback').put(record);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}
 saveLocal('profile-feedback',{...record,attachments:record.attachments.map(({file,...metadata})=>metadata)});
}

export default function FeedbackForm({onSaved}:{onSaved:()=>void}){
 const [content,setContent]=useState(''),[attachments,setAttachments]=useState<Attachment[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const input=useRef<HTMLInputElement>(null),urls=useRef(new Set<string>());
 useEffect(()=>()=>{urls.current.forEach(url=>URL.revokeObjectURL(url))},[]);
 function add(files:FileList|null){
  if(!files)return;
  const next=[...attachments];let message='';
  for(const file of Array.from(files)){
   if(next.length>=5){message='最多添加 5 个附件';break}
   if(file.size>10*1024*1024){message='单个附件不能超过 10 MB';continue}
   if(next.some(item=>item.file.name===file.name&&item.file.size===file.size&&item.file.lastModified===file.lastModified))continue;
   const preview=file.type.startsWith('image/')?URL.createObjectURL(file):undefined;
   if(preview)urls.current.add(preview);
   next.push({id:crypto.randomUUID(),file,preview});
  }
  setAttachments(next);setError(message);if(input.current)input.current.value='';
 }
 function remove(item:Attachment){if(item.preview){URL.revokeObjectURL(item.preview);urls.current.delete(item.preview)}setAttachments(values=>values.filter(value=>value.id!==item.id));setError('')}
 async function submit(event:React.FormEvent){
  event.preventDefault();if(!content.trim()||busy)return;setBusy(true);setError('');
  try{await saveFeedback(content.trim(),attachments);onSaved()}catch{setError('反馈保存失败，请保留内容后重试')}finally{setBusy(false)}
 }
 return <form className="profile-feedback" onSubmit={submit}>
  <label className="profile-feedback-label" htmlFor="profile-feedback-content"><span aria-hidden="true">*</span> 意见反馈</label>
  <div className="profile-feedback-editor"><textarea id="profile-feedback-content" aria-label="意见反馈" placeholder="感谢您提出的想法、评论和建议" required maxLength={500} value={content} onChange={event=>setContent(event.target.value)}/><span className="profile-feedback-count">{content.length}/500</span></div>
  <div className="profile-feedback-attachments" aria-label="反馈附件">
   {attachments.map(item=><div className="profile-feedback-attachment" key={item.id}>{item.preview?<a href={item.preview} target="_blank" rel="noreferrer" aria-label={'预览附件'+item.file.name}><img src={item.preview} alt={item.file.name}/></a>:<span><FileText size={25}/></span>}<small title={item.file.name}>{item.file.name}</small><button type="button" disabled={busy} aria-label={'移除附件'+item.file.name} onClick={()=>remove(item)}><X size={13}/></button></div>)}
   {attachments.length<5&&<button type="button" className="profile-feedback-upload" disabled={busy} onClick={()=>input.current?.click()}><Plus size={24} strokeWidth={1}/><span>上传附件</span></button>}
   <input ref={input} type="file" multiple hidden aria-label="选择反馈附件" onChange={event=>add(event.target.files)} disabled={busy}/>
  </div>
  {error&&<p className="profile-feedback-error" role="alert">{error}</p>}
  <button className="profile-feedback-submit" type="submit" disabled={!content.trim()||busy} aria-busy={busy}>{busy?'保存中…':'提交'}</button>
 </form>;
}
