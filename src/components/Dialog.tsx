import {forwardRef,useId,type ReactNode} from 'react';
import './Dialog.css';

export type DialogAction={label:string;onClick:()=>void;primary?:boolean;disabled?:boolean;loading?:boolean};
type Props={title?:string;label:string;children:ReactNode;actions:DialogAction[];buttonStyle?:'default'|'round';busy?:boolean};

/** Dialog surface; its overlay host manages dismissal, focus and scroll locking. */
const Dialog=forwardRef<HTMLElement,Props>(function Dialog({title,label,children,actions,buttonStyle='default',busy=false},ref){
 const contentId=useId();
 return <section ref={ref} className={'app-dialog'+(!title?' app-dialog-untitled':'')} role="dialog" aria-modal="true" aria-label={label} aria-describedby={contentId} aria-busy={busy||undefined}>
  {title&&<h2>{title}</h2>}
  <div className="app-dialog-body" id={contentId}>{children}</div>
  <footer className={'app-dialog-footer is-'+buttonStyle}>{actions.map(action=><button type="button" key={action.label} className={action.primary?'is-primary':''} disabled={action.disabled||action.loading} aria-busy={action.loading||undefined} onClick={action.onClick}><span>{action.loading&&<i className="app-dialog-spinner" aria-hidden="true"/>}{action.label}</span></button>)}</footer>
 </section>;
});
export default Dialog;
