import {readLocal} from '../data';
import {loadDriveUploads} from './cloudDriveStore';
import {readResources,readRecipients,readChatMessages,type Resource} from './data';
export type AttachmentResource=Resource&{folder:string};
export async function driveAttachmentSources(){
 const uploads=await loadDriveUploads();const catalog=readLocal<{folders:string[];hiddenFolders:string[];hiddenFiles:string[];locations?:Record<string,string>}>('cloud-drive-catalog',{folders:[],hiddenFolders:[],hiddenFiles:readLocal('hidden-resources-cloud-drive',[])});
 const initial=['111','222','1112','1112车','111222','紧急','我的文件','呜呜呜呜'];
 const folders=[...new Set([...initial,...catalog.folders])].filter(path=>!catalog.hiddenFolders.some(hidden=>path===hidden||path.startsWith(hidden+'/')));
 const files=[...readResources(),...uploads.map(item=>item.resource)].filter(file=>!catalog.hiddenFiles.includes(file.id)).map(file=>({...file,folder:catalog.locations?.[file.id]??uploads.find(item=>item.resource.id===file.id)?.folder??(file.id==='photo-0'||['report','table','brief'].includes(file.id)?'222':file.id.startsWith('photo-')&&Number(file.id.slice(6))<15?initial.filter(value=>value!=='222')[Math.floor((Number(file.id.slice(6))-1)/2)]||'':'')}));
 return {folders,files};
}
export function chatAttachmentSources():AttachmentResource[]{
 const shared=readResources().map(file=>({...file,folder:''}));
 const messages=readRecipients().flatMap(recipient=>readChatMessages(recipient.id).flatMap(message=>message.attachment?[{id:'chat-'+message.id,name:message.attachment.name,url:message.attachment.url,kind:(['image','video','audio','archive','document'].includes(message.attachment.kind)?message.attachment.kind:'other') as Resource['kind'],date:(message.createdAt||'').slice(0,10),sender:recipient.name,avatar:recipient.avatar,size:'文件',folder:''}]:message.image?[{id:'chat-'+message.id,name:'聊天图片.jpg',url:message.image,kind:'image' as const,date:(message.createdAt||'').slice(0,10),sender:recipient.name,avatar:recipient.avatar,size:'图片',folder:''}]:[]));
 return [...new Map([...messages,...shared].map(file=>[file.url+'|'+file.name,file])).values()];
}
