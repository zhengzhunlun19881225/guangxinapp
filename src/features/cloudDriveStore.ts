import type {Resource} from './data';

type DriveRecord={id:string;folder:string;file:File;createdAt:string};
export type DriveUpload={resource:Resource;folder:string};
async function openStore(){return new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('gx-app-cloud-drive',1);request.onupgradeneeded=()=>request.result.createObjectStore('files',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('存储暂不可用'))})}
function dataUrl(file:Blob){return new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)})}
function fileKind(file:File):Resource['kind']{
 if(file.type.startsWith('image/'))return 'image';if(file.type.startsWith('video/'))return 'video';if(file.type.startsWith('audio/'))return 'audio';
 if(/\.(zip|rar|7z|tar|gz)$/i.test(file.name))return 'archive';if(file.type.startsWith('text/')||/\.(pdf|docx?|xlsx?|pptx?|txt|csv|md|json)$/i.test(file.name))return 'document';return 'other';
}
function sizeLabel(bytes:number){return bytes<1024?bytes+' B':bytes<1024*1024?(bytes/1024).toFixed(2)+' KB':(bytes/1024/1024).toFixed(2)+' MB'}
async function resource(record:DriveRecord):Promise<DriveUpload>{return {folder:record.folder,resource:{id:record.id,name:record.file.name,url:await dataUrl(record.file),kind:fileKind(record.file),date:record.createdAt.slice(0,10),sender:'我',avatar:'/assets/im/self-avatar.png',size:sizeLabel(record.file.size)}}}
export async function loadDriveUploads(){
 const db=await openStore();
 try{const records=await new Promise<DriveRecord[]>((resolve,reject)=>{const request=db.transaction('files').objectStore('files').getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});return await Promise.all(records.map(resource))}finally{db.close()}
}
export async function storeDriveUploads(files:File[],folder:string){
 const records=files.map(file=>({id:'drive-upload-'+crypto.randomUUID(),folder,file,createdAt:new Date().toISOString()})),resources=await Promise.all(records.map(resource));
 const db=await openStore();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('files','readwrite');records.forEach(record=>tx.objectStore('files').add(record));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}
 return resources;
}
