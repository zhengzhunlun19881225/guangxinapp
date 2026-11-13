import type {ReactNode} from 'react';
import {Search} from 'lucide-react';
import './AppNavBar.css';

/** Keep the title centered while positioning actions by their visible icon edges. */
export default function AppNavBar({title,left,right,className='',label='顶部导航'}:{title:ReactNode;left?:ReactNode;right?:ReactNode;className?:string;label?:string}){
 return <nav className={'app-navbar '+className} aria-label={label}>
  <div className="app-navbar-left">{left}</div>
  <div className="app-navbar-center">{typeof title==='string'?<h1>{title}</h1>:title}</div>
  <div className="app-navbar-right">{right}</div>
 </nav>;
}

/** The narrow back glyph is aligned to the leading edge of its 22px visual box. */
export function NavBackIcon(){return <svg className="app-navbar-back-icon" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="m7 5-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}

export function NavMoreIcon(){return <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true"><circle cx="2" cy="11" r="2"/><circle cx="11" cy="11" r="2"/><circle cx="20" cy="11" r="2"/></svg>}

export function NavSearchIcon(){return <Search size={22} aria-hidden="true"/>}
