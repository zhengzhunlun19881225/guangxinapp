import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {createPortal} from 'react-dom';
import {ArrowUp,Delete,Keyboard,Mic} from 'lucide-react';
import './PreviewKeyboard.css';

export default function PreviewKeyboard({device,insert,send,close,canSend}:{device:HTMLElement;insert:(key:string)=>void;send:()=>void;close:()=>void;canSend:boolean}){
 const closeRef=useRef(close);closeRef.current=close;
 const [shift,setShift]=useState(false),[numbers,setNumbers]=useState(false);
 useEffect(()=>{device.style.setProperty('--preview-keyboard-height','260px');const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeRef.current()}};document.addEventListener('keydown',key,true);return()=>{device.style.removeProperty('--preview-keyboard-height');document.removeEventListener('keydown',key,true)}},[device]);
 const rows=numbers?['1234567890','-/:;()$&@"','.,?!\'']:['qwertyuiop','asdfghjkl','zxcvbnm'];
 function type(value:string){insert(shift&&!numbers?value.toUpperCase():value);if(shift)setShift(false)}
 return createPortal(<section className="preview-keyboard" style={{zoom:'var(--app-zoom,1)'} as CSSProperties} aria-label="屏幕键盘" onPointerDown={event=>event.preventDefault()}>
  <div className="preview-keyboard-top"><span>{numbers?'数字与符号':'English'}</span><button type="button" aria-label="收起键盘" onClick={close}><Keyboard size={19}/></button></div>
  {rows.map((row,index)=><div className={'preview-keyboard-row row-'+index} key={index}>
   {index===2&&<button type="button" className="keyboard-function" aria-label={numbers?'切换字母键盘':'大写字母'} aria-pressed={shift} onClick={()=>numbers?setNumbers(false):setShift(!shift)}>{numbers?'ABC':<ArrowUp size={20} fill={shift?'currentColor':'none'}/>}</button>}
   {Array.from(row).map(key=><button type="button" key={key} aria-label={'输入 '+(shift&&!numbers?key.toUpperCase():key)} onClick={()=>type(key)}>{shift&&!numbers?key.toUpperCase():key}</button>)}
   {index===2&&<button type="button" className="keyboard-function" aria-label="删除一个字符" onClick={()=>insert('Backspace')}><Delete size={20}/></button>}
  </div>)}
  <div className="preview-keyboard-row keyboard-bottom"><button type="button" className="keyboard-function" onClick={()=>{setNumbers(!numbers);setShift(false)}}>{numbers?'ABC':'123'}</button><button type="button" className="keyboard-space" aria-label="空格" onClick={()=>insert(' ')}>空格</button><button type="button" className="keyboard-send" disabled={!canSend} onClick={send}>发送</button></div>
  <div className="keyboard-footer"><Mic size={18}/><span/></div>
 </section>,device);
}
