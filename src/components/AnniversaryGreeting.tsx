import {useEffect,useId,useRef,useState} from 'react';
import {RefreshCw,Smile} from 'lucide-react';
import {greetingTones} from '../data/dailyBrief';
import {sendAnniversaryGreeting} from '../im/greetings';
import './AnniversaryGreeting.css';

export default function AnniversaryGreeting({onSent}:{onSent:()=>void}){
 const [tone,setTone]=useState<keyof typeof greetingTones>('简洁明了'),[variant,setVariant]=useState(0);
 const [text,setText]=useState(greetingTones['简洁明了'][0]),[emojiOpen,setEmojiOpen]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const input=useRef<HTMLTextAreaElement>(null),sending=useRef(false),sentTimer=useRef<ReturnType<typeof setTimeout>|null>(null),selection=useRef({start:text.length,end:text.length}),id=useId();
 useEffect(()=>()=>{if(sentTimer.current)clearTimeout(sentTimer.current)},[]);
 function updateText(next:string){setText(next);selection.current={start:next.length,end:next.length};setError('')}
 function toggleEmoji(){if(!emojiOpen&&input.current)selection.current={start:input.current.selectionStart,end:input.current.selectionEnd};setEmojiOpen(!emojiOpen)}
 function insertEmoji(emoji:string){
  const {start,end}=selection.current,next=text.slice(0,start)+emoji+text.slice(end);
  if(next.length>200)return;
  updateText(next);setEmojiOpen(false);
  requestAnimationFrame(()=>{input.current?.focus();input.current?.setSelectionRange(start+emoji.length,start+emoji.length)})
 }
 function send(){
  if(sending.current||!text.trim()||text.length>200)return;
  sending.current=true;setBusy(true);setError('');
  // Keep the dialog in place through a repeated tap so it cannot hit the page below.
  try{sendAnniversaryGreeting(text);sentTimer.current=setTimeout(onSent,350)}catch(reason){setError(reason instanceof Error?reason.message:'发送未成功，请重试。');sending.current=false;setBusy(false)}
 }
 return <div className="anniversary-greeting">
  <div className="anniversary-greeting-body">
   <img className="anniversary-greeting-banner" src="/assets/workbench/anniversary-care.png" alt="入职周年快乐，感恩同行，未来可期"/>
   <div className="greeting-writing-heading"><h3>写一条给陈晓晓的入职周年祝福</h3><button className="greeting-refresh" onClick={()=>{const next=(variant+1)%greetingTones[tone].length;setVariant(next);updateText(greetingTones[tone][next])}}><RefreshCw size={14}/>换一换</button></div>
   <div className="greeting-tone-toolbar"><div className="greeting-tones" role="group" aria-label="祝福语气">{(Object.keys(greetingTones) as (keyof typeof greetingTones)[]).map(label=><button key={label} aria-pressed={tone===label} onClick={()=>{setTone(label);setVariant(0);updateText(greetingTones[label][0])}}><span>{label}</span></button>)}</div></div>
   <div className="anniversary-greeting-editor">
    <textarea ref={input} aria-label="祝福内容" aria-describedby={id+'-count'} maxLength={200} value={text} onChange={event=>{setText(event.target.value);setError('')}} onSelect={event=>{selection.current={start:event.currentTarget.selectionStart,end:event.currentTarget.selectionEnd}}}/>
    <div className="greeting-editor-tools"><div className="greeting-emoji"><button aria-label="添加表情" aria-expanded={emojiOpen} aria-controls={id+'-emoji'} onClick={toggleEmoji}><Smile size={20}/></button>{emojiOpen&&<div id={id+'-emoji'} className="greeting-emoji-picker" role="group" aria-label="选择表情">{['🎉','🎂','🌟','❤️','👏','😊'].map(emoji=><button key={emoji} aria-label={'插入 '+emoji} disabled={text.length-(selection.current.end-selection.current.start)+emoji.length>200} onClick={()=>insertEmoji(emoji)}>{emoji}</button>)}</div>}</div><small id={id+'-count'}>{text.length}/200</small></div>
   </div>
   {error&&<p className="greeting-send-error" role="alert">{error}</p>}
  </div>
  <footer className="anniversary-greeting-footer"><span>发送给：陈晓晓</span><button className="primary-button" disabled={busy||!text.trim()||text.length>200} onClick={send}>{busy?'发送中…':'发送IM祝福'}</button></footer>
 </div>;
}
