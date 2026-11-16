import {useState} from 'react';
import {readLocal,saveLocal} from '../data';
import './AnswerFeedback.css';

type Kind='positive'|'negative';
const positiveTags=['准确理解问题','完成任务能力强','有帮助','文风好','响应迅速','有创新和惊喜','有深度和广度'];
const negativeTags=['没有理解问题','没有完成任务','废话太多','文风不好','编造事实','回答时间久','回答机械/刻板','逻辑混乱','上下文遗忘'];

export default function AnswerFeedback({kind,onCancel,onSaved}:{kind:Kind;onCancel:()=>void;onSaved:()=>void}){
 const positive=kind==='positive',min=positive?60:0,max=positive?100:60;
 const [score,setScore]=useState(positive?90:50),[tags,setTags]=useState<string[]>([]),[comment,setComment]=useState('');
 const choices=positive?positiveTags:negativeTags;
 function submit(event:React.FormEvent){
  event.preventDefault();
  const previous=readLocal<unknown[]>('answer-feedback',[]);
  const next=Array.isArray(previous)?previous:[];
  const saved=saveLocal('answer-feedback',[...next,{id:crypto.randomUUID(),kind,score,tags,comment:comment.trim(),savedAt:new Date().toISOString()}]);
  if(saved)onSaved();
 }
 function toggleTag(tag:string){setTags(current=>current.includes(tag)?current.filter(value=>value!==tag):[...current,tag])}
 return <form className={'answer-feedback '+(positive?'is-positive':'is-negative')} onSubmit={submit}>
  <div className="answer-feedback-rating"><label htmlFor="answer-feedback-score"><span><b>*</b> 本次评分</span><output>{score} 分</output></label>
   <input id="answer-feedback-score" type="range" min={min} max={max} value={score} onChange={event=>setScore(Number(event.target.value))} style={{'--range-progress':((score-min)/(max-min)*100)+'%'} as React.CSSProperties}/>
   <div className="answer-feedback-scale"><span>{min}</span><span>{max}</span></div>
  </div>
  <div className="answer-feedback-tags" aria-label="反馈原因">{choices.map(tag=><button type="button" key={tag} aria-pressed={tags.includes(tag)} onClick={()=>toggleTag(tag)}>{tag}</button>)}</div>
  <div className="answer-feedback-editor"><textarea aria-label="反馈内容" maxLength={500} placeholder={positive?'你觉得什么让你满意?':'你觉得什么让你不满意?'} value={comment} onChange={event=>setComment(event.target.value)}/><span>{comment.length}/500</span></div>
  <footer><button type="button" onClick={onCancel}>取消</button><button type="submit">确认</button></footer>
 </form>;
}
