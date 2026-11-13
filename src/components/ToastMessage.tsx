import './ToastMessage.css';

export type ToastVariant='text'|'loading'|'info'|'success'|'warning'|'danger';

export default function ToastMessage({text,variant='text',className='',announce=false}:{text:string;variant?:ToastVariant;className?:string;announce?:boolean}){
 return <div className={'app-toast '+className} data-variant={variant} role={announce?'status':undefined} aria-busy={variant==='loading'||undefined}>
  {variant==='loading'&&<span className="app-toast-spinner" aria-hidden="true"/>}
  {variant!=='text'&&variant!=='loading'&&<span className="app-toast-icon" aria-hidden="true" style={{maskImage:`url(/assets/spec/feedback-${variant}.svg)`}}/>}
  <span className="app-toast-text">{text}</span>
 </div>;
}
