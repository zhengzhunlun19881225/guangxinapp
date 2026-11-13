import ToastMessage,{type ToastVariant} from '../components/ToastMessage';

const examples:{variant:ToastVariant;label:string;text:string}[]=[
 {variant:'text',label:'文字',text:'这是一条文字提示'},
 {variant:'loading',label:'加载',text:'加载中，请稍候…'},
 {variant:'info',label:'信息',text:'工作安排已更新，请及时查看。'},
 {variant:'success',label:'成功',text:'申请已提交成功。'},
 {variant:'warning',label:'警告',text:'系统即将升级，请及时保存资料。'},
 {variant:'danger',label:'错误',text:'数据加载失败，请稍后重试。'},
];

export default function ToastDemo({show}:{show:(text:string,variant:ToastVariant)=>void}){
 return <div className="spec-toast-examples">
  <div className="spec-toast-stack">{examples.map(item=><ToastMessage key={item.variant} variant={item.variant} text={item.text}/>)}</div>
  <div className="spec-button-grid">{examples.map(item=><button key={item.variant} className="spec-button spec-button-secondary" onClick={()=>show(item.text,item.variant)}>展示{item.label}提示</button>)}</div>
 </div>;
}
