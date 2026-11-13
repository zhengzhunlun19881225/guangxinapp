import {readLocal,saveLocal} from '../data';
import type {ChatMessage,ChatSettings} from './data';

const recipient='person-陈晓晓';

export function sendAnniversaryGreeting(text:string){
 const content=text.trim();
 if(!content||content.length>200)throw new Error('请填写 200 字以内的祝福内容。');
 const settings=readLocal<Record<string,Partial<ChatSettings>>>('im2-settings',{});
 if(settings[recipient]?.blocked)throw new Error('请先在聊天设置中解除拉黑，再发送祝福。');
 const store=readLocal<Record<string,ChatMessage[]>>('im2-messages',{});
 const message:ChatMessage={id:crypto.randomUUID(),side:'out',text:content,read:false,time:new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())};
 if(!saveLocal('im2-messages',{...store,[recipient]:[...(store[recipient]||[]),message]}))throw new Error('发送未成功，请重试。');
}

export function readAnniversaryConversation(){
 const messages=readLocal<Record<string,ChatMessage[]>>('im2-messages',{})[recipient];
 const last=messages?.at(-1);
 return last?{name:'陈晓晓',node:'0:5819',preview:last.text||(last.image?'[图片]':''),time:last.time||'',unread:0}:null;
}
