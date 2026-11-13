import {useEffect,useRef,useState,type Ref} from 'react';
import Dialog,{type DialogAction} from '../components/Dialog';
import {dialogGroups} from './DialogDemo';

export default function DialogExample({variant,dialogRef,close,message}:{variant:string;dialogRef:Ref<HTMLElement>;close:()=>void;message:(text:string)=>void}){
 const [busy,setBusy]=useState(false),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const example=dialogGroups.flatMap(group=>group.examples).find(item=>item.id===variant)!;
 const untitled=variant==='no-title'||variant==='round-no-title',round=variant.startsWith('round-');
 const confirm=variant==='confirm'||variant==='async'||variant==='component';
 const accept=()=>{
  if(busy)return;
  if(variant==='async'){setBusy(true);timer.current=setTimeout(()=>{close();message('异步操作已完成')},1000)}
  else{close();message(confirm?'已确认操作':'已阅读提示')}
 };
 const actions:DialogAction[]=[...(confirm?[{label:'取消',onClick:close}]:[]),{label:busy?'提交中':'确认',onClick:accept,primary:true,loading:busy}];
 return <Dialog ref={dialogRef} label={example.label+(round?' · 圆角按钮':'')} title={untitled?undefined:'标题'} actions={actions} buttonStyle={round?'round':'default'} busy={busy}>
  {variant==='component'?<img className="app-dialog-example-image" src="/assets/spec/dialog-tablets.png" alt="平板设备展示"/>:<p>{untitled?'生命远不止连轴转和忙到极限，人类的体验远比这辽阔、丰富得多。':confirm?'如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。':'代码是写出来给人看的，附带能在机器上运行。'}</p>}
 </Dialog>;
}
