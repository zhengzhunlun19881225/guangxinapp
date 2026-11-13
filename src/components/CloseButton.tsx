import type {ButtonHTMLAttributes} from 'react';
import {X} from 'lucide-react';

/** Shared App close control: 30px visual, 20px icon, 44px touch target. */
export default function CloseButton({className='',...props}:Omit<ButtonHTMLAttributes<HTMLButtonElement>,'children'>){
 return <button type="button" aria-label="关闭" {...props} className={'app-close-button '+className}><X aria-hidden="true" size={20} strokeWidth={2}/></button>;
}
