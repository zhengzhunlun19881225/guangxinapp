import {readLocal,saveLocal} from '../data';
export type AttachmentSource='本地文件'|'云盘'|'聊天文件'|'照片'|'拍摄';
export type ComposerAttachment={id:string;name:string;size:number;type:string;source:AttachmentSource;status:'ready'|'unparsed'|'error';text?:string};
export type StoredAttachment=ComposerAttachment&{file:Blob;fingerprint:string;checksum?:string};
export const attachmentLimit=5,attachmentMaxBytes=20*1024*1024;
export const attachmentSize=(bytes:number)=>bytes<1024?bytes+' B':bytes<1024*1024?(bytes/1024).toFixed(2)+' KB':(bytes/1024/1024).toFixed(2)+' MB';
async function db(){return new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('gx-app-composer-attachments',1);request.onupgradeneeded=()=>request.result.createObjectStore('files',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('附件存储暂不可用'))})}
export async function attachmentRecord(id:string){const store=await db();try{return await new Promise<StoredAttachment|undefined>((resolve,reject)=>{const request=store.transaction('files').objectStore('files').get(id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}finally{store.close()}}
export async function saveAttachment(record:StoredAttachment){const store=await db();try{await new Promise<void>((resolve,reject)=>{const tx=store.transaction('files','readwrite');tx.objectStore('files').put(record);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{store.close()}}
export async function deleteAttachment(id:string){const store=await db();try{await new Promise<void>((resolve,reject)=>{const tx=store.transaction('files','readwrite');tx.objectStore('files').delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{store.close()}}
export async function loadAttachmentDraft(){const ids=readLocal<string[]>('composer-attachment-draft',[]);const values=await Promise.all(ids.map(attachmentRecord));return values.filter((value):value is StoredAttachment=>!!value)}
export function saveAttachmentDraft(values:StoredAttachment[]){return saveLocal('composer-attachment-draft',values.map(item=>item.id))}
export async function makeAttachment(file:Blob,name:string,source:AttachmentSource,fingerprint:string):Promise<StoredAttachment>{
 const record:StoredAttachment={id:crypto.randomUUID(),name,size:file.size,type:file.type,source,status:'unparsed',file,fingerprint};
 if(crypto.subtle)record.checksum=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
 if(file.type.startsWith('image/'))record.status='ready';
 else if(/^text\//.test(file.type)||/\.(txt|md|csv|json)$/i.test(name))try{const text=await file.text();if(text.includes('\0'))record.status='error';else{record.status='ready';record.text=text.slice(0,100000)}}catch{record.status='error'}
 return record;
}
export const attachmentMetadata=({file:_file,fingerprint:_fingerprint,checksum:_checksum,...metadata}:StoredAttachment):ComposerAttachment=>metadata;
