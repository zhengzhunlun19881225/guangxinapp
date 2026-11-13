import type {ReactNode} from 'react';
import './RecordDetails.css';

export const recordIcons={record:'application-solid',date:'calendar-solid',details:'details-solid',person:'person-solid',location:'location',reminder:'reminder',visibility:'visibility'};
export type RecordField={label:string;value:ReactNode;icon:keyof typeof recordIcons};
export function RecordTags({items}:{items:{label:string;tone?:'success'|'info'|'danger'}[]}){return <div className="record-tags">{items.map(item=><span key={item.label} className={item.tone?'is-'+item.tone:''}>{item.label}</span>)}</div>}
export default function RecordDetails({fields,children}:{fields:RecordField[];children?:ReactNode}){
 return <div className="record-details"><dl>{fields.map(field=><div key={field.label}><dt><span aria-hidden="true" style={{maskImage:`url(/assets/record-details/${recordIcons[field.icon]}.svg)`}}/>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>{children}</div>;
}
