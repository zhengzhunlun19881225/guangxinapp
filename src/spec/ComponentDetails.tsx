import type {SpecItem} from './catalog';
import {componentDetails,detailFields} from './details';

export default function ComponentDetails({item}:{item:SpecItem}){
 const details=componentDetails(item);
 return <>
  <dl className="guide-demo-details" aria-label={item.name+'规范说明'}>{detailFields.map(([key,label])=><div key={key}><dt>{label}</dt><dd>{details[key]}</dd></div>)}</dl>
  <footer className="guide-demo-source"><strong>参考业务源码</strong>{details.source.split(' · ').map(path=><code key={path}>{path}</code>)}</footer>
 </>;
}
