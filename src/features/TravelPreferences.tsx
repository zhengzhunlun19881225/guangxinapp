import {useState} from 'react';
import {BedDouble,Check,ChevronDown,MapPin,Plane,Sparkles,TrainFront,X} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import {FeatureShell,Sheet} from './UI';
import type {FeatureProps} from './data';
import './TravelPreferences.css';

const fields={
 city:{label:'常驻城市',options:['北京','上海','广州','深圳','杭州','南京','成都','重庆','武汉','西安'],single:true},
 trainTime:{label:'时间偏好',options:['0:00-6:00','6:00-12:00','12:00-18:00','18:00-24:00'],single:false},
 flightTime:{label:'时间偏好',options:['0:00-6:00','6:00-12:00','12:00-18:00','18:00-24:00'],single:false},
 airline:{label:'航司偏好',options:['春秋航空','南方航空','中国国航','东方航空','深圳航空','海南航空','厦门航空'],single:false},
 cabin:{label:'机型偏好',options:['经济舱','头等舱','商务舱'],single:false},
 hotelBrand:{label:'品牌偏好',options:['如家','汉庭','全季','亚朵','锦江之星','维也纳','希尔顿','万豪'],single:false},
 hotelLevel:{label:'级别',options:['5钻/星豪华','4钻/星高档','3钻/星舒适','2钻/星经济'],single:false},
 facilities:{label:'酒店设施',options:['免费wifi','免费停车场','健身房','洗衣房','游泳池'],single:false},
 breakfast:{label:'早餐',options:['含早餐','不含早餐','不限'],single:true},
};
type Field=keyof typeof fields;
type Preferences=Record<Field,string[]>;
const initial:Preferences={city:['北京'],trainTime:['6:00-12:00'],flightTime:['6:00-12:00','18:00-24:00'],airline:['春秋航空','南方航空','中国国航'],cabin:['经济舱','头等舱','商务舱'],hotelBrand:['如家','汉庭','全季','亚朵','锦江之星'],hotelLevel:['4钻/星高档','3钻/星舒适'],facilities:['免费wifi','免费停车场','健身房'],breakfast:[]};
const groups=[{title:'常驻地',icon:MapPin,keys:['city']},{title:'火车/动车',icon:TrainFront,keys:['trainTime']},{title:'飞机',icon:Plane,keys:['flightTime','airline','cabin']},{title:'酒店',icon:BedDouble,keys:['hotelBrand','hotelLevel','facilities','breakfast']}] as const;

function readPreferences(){
 const stored=readLocal<Partial<Preferences>>('profile-travel-v2',initial);
 return Object.fromEntries((Object.keys(fields) as Field[]).map(key=>[key,Array.isArray(stored[key])?stored[key]!.filter(value=>fields[key].options.includes(value)):initial[key]])) as Preferences;
}
export default function TravelPreferences({height,navigate,notify}:FeatureProps){
 const [preferences,setPreferences]=useState<Preferences>(readPreferences),[active,setActive]=useState<Field|null>(null),[analysis,setAnalysis]=useState(false);
 function toggle(key:Field,value:string){setPreferences(current=>({...current,[key]:fields[key].single?[value]:current[key].includes(value)?current[key].filter(item=>item!==value):[...current[key],value]}));if(fields[key].single)setActive(null)}
 function remove(key:Field,value:string){setPreferences(current=>({...current,[key]:current[key].filter(item=>item!==value)}))}
 function save(){if(!saveLocal('profile-travel-v2',preferences)){notify('保存失败，请重试');return}notify('差旅偏好已保存')}
 function reset(){setPreferences({city:[],trainTime:[],flightTime:[],airline:[],cabin:[],hotelBrand:[],hotelLevel:[],facilities:[],breakfast:[]});notify('已重置，保存后生效')}
 const labels:Record<Field,string>={city:'常驻城市',trainTime:'火车/动车时间偏好',flightTime:'飞机时间偏好',airline:'航司偏好',cabin:'机型偏好',hotelBrand:'酒店品牌偏好',hotelLevel:'酒店级别',facilities:'酒店设施',breakfast:'早餐'};
 return <FeatureShell className="travel-preferences" title="差旅偏好设置" height={height} back={()=>navigate('profile')} right={<button className="travel-analysis-trigger" onClick={()=>setAnalysis(true)}><Sparkles size={16}/><span>AI分析</span></button>} footer={<><button className="travel-reset" onClick={reset}>重置</button><button className="travel-save" onClick={save}>保存</button></>}>
  <div className="travel-preferences-card">{groups.map(group=><section className="travel-preferences-group" key={group.title} aria-label={group.title}><h2><group.icon size={17} strokeWidth={1.6}/>{group.title}</h2>{group.keys.map(key=>{
   const config=fields[key],values=preferences[key],shown=values.slice(0,2);
   return <div className="travel-preference-field" key={key}><label id={'travel-label-'+key}>{config.label}</label><div className="travel-preference-control">
    <button className="travel-preference-open" aria-label={'选择'+labels[key]} aria-expanded={active===key} aria-haspopup="dialog" onClick={()=>setActive(key)}>{config.single?<span className={values.length?'':'is-placeholder'}>{values[0]||'请选择'}</span>:!values.length?<span className="is-placeholder">请选择</span>:<span/>}<ChevronDown size={18} strokeWidth={1.5}/></button>
    {!config.single&&!!values.length&&<div className="travel-preference-chips">{shown.map(value=><span className="travel-preference-chip" key={value}><span>{value}</span><button aria-label={'移除'+labels[key]+value} onClick={()=>remove(key,value)}><X size={12}/></button></span>)}{values.length>2&&<span className="travel-preference-chip travel-preference-more">+{values.length-2}</span>}</div>}
   </div></div>;
  })}</section>)}</div>
  {active&&<Sheet title={labels[active]} close={()=>setActive(null)} footer={<button className="travel-save" onClick={()=>setActive(null)}>确定</button>}><div className="travel-preference-options" role={fields[active].single?'radiogroup':'group'} aria-label={labels[active]}>{fields[active].options.map(value=><button role={fields[active].single?'radio':'checkbox'} aria-checked={preferences[active].includes(value)} key={value} onClick={()=>toggle(active,value)}><span>{value}</span><span className={'travel-preference-option-check'+(fields[active].single?' is-radio':'')}>{preferences[active].includes(value)&&<Check size={14}/>}</span></button>)}</div></Sheet>}
  {analysis&&<Sheet title="AI分析" close={()=>setAnalysis(false)}><p className="travel-analysis-intro">根据当前设置整理的差旅偏好：</p><dl className="travel-analysis-summary">{(Object.keys(fields) as Field[]).filter(key=>preferences[key].length).map(key=><div key={key}><dt>{labels[key]}</dt><dd>{preferences[key].join('、')}</dd></div>)}</dl>{!Object.values(preferences).some(values=>values.length)&&<p className="travel-analysis-intro">请先选择差旅偏好。</p>}</Sheet>}
 </FeatureShell>;
}
