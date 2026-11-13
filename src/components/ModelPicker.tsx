import {useRef} from 'react';
import ComposerSheet from './ComposerSheet';
import './ModelPicker.css';

export const models=[
 {name:'qwen3.6-27b-w8a8',provider:'Aether'},
 {name:'qwen3.8-27b-w8a8',provider:'Aether'},
 {name:'deepseek-v4-flash',provider:'Aether'},
 {name:'qwen3.8-27b-coder390-w8a8',provider:'Aether'},
 {name:'qwen3.5-27b-154',provider:'Aether'},
 {name:'qwen3.5-27b',provider:'OpenAI-API-Compatible'},
 {name:'gpt-5.5',provider:'OpenAI-API-Compatible'},
];
export function normalizeModel(value:string){return models.some(model=>model.name===value)?value:value==='DeepSeek V3'?'deepseek-v4-flash':'qwen3.8-27b-w8a8'}
export default function ModelPicker({device,selected,close,choose}:{device:HTMLElement;selected:string;close:()=>void;choose:(name:string)=>void}){
 const dialog=useRef<HTMLElement>(null);
 return <ComposerSheet device={device} title="选择模型" closeLabel="关闭选择模型" close={close} dialogRef={dialog} compact>
  <div className="model-picker-list" role="listbox" aria-label="可选模型">{models.map((model,index)=><button key={model.name} type="button" role="option" aria-selected={selected===model.name} onClick={()=>choose(model.name)} onKeyDown={event=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?models.length-1:(index+(event.key==='ArrowDown'?1:-1)+models.length)%models.length;(event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus()}}>
   <img src={model.provider==='Aether'?'/assets/ui/model-aether.png':'/assets/ui/model-compatible.png'} alt=""/>
   <span><strong>{model.name}</strong><small>{model.provider}</small></span>
  </button>)}</div>
 </ComposerSheet>;
}
