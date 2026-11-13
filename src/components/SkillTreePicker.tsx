import {useRef} from 'react';
import ComposerSheet from './ComposerSheet';
import SkillTreeContent from '../features/SkillTreeContent';
import './SkillTreePicker.css';

export default function SkillTreePicker({device,close,share,ask}:{device:HTMLElement;close:()=>void;share:()=>void;ask:(text:string)=>void}){
 const dialog=useRef<HTMLElement>(null);
 return <ComposerSheet device={device} title="技能树" closeLabel="关闭技能树" close={close} dialogRef={dialog}>
  <div className="skill-tree-picker-actions"><button className="feature-text" onClick={share}>定时分享</button></div>
  <div className="composer-picker-content skill-tree-picker-content"><SkillTreeContent ask={ask}/></div>
 </ComposerSheet>;
}
