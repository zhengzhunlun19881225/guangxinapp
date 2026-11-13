import './ProvinceTaxMap.css';
const provinces=[
 {name:'北京',value:'45,678',color:'#ffa785',x:213,y:76},
 {name:'山东',value:'62,340',color:'#f75a3b',x:241,y:102},
 {name:'江苏',value:'98,760',color:'#f75a3b',x:250,y:124},
 {name:'上海',value:'58,920',color:'#ff8972',x:255,y:146},
 {name:'广东',value:'125,680',color:'#f53f3f',x:177,y:210},
];
export default function ProvinceTaxMap(){
 return <section className="province-tax-card" data-node-id="0:6348" aria-labelledby="province-tax-title">
  <header><h2 id="province-tax-title"><img src="/assets/workbench/section-accent.png" alt=""/>各省份年度累计实缴税金 (万元)</h2></header>
  <div className="province-tax-viewport"><div className="province-tax-content" data-node-id="0:6351">
   <img className="province-tax-image" src="/assets/record-details/province-tax-map.png" alt="中国各省份年度累计实缴税金分布"/>
   {provinces.map(province=><div className="province-tax-label" key={province.name} style={{left:province.x/357*100+'%',top:province.y/250*100+'%'}}><i style={{background:province.color}}/><span>{province.name}</span><span>{province.value}</span></div>)}
  </div></div>
  <div className="province-tax-scale"><span>高</span><i/><span>低</span></div>
  <div className="province-tax-legend">{['北京','上海','江苏','山东','广东'].map(name=>{const province=provinces.find(item=>item.name===name)!;return <span key={name}><i style={{background:province.color}}/>{name}</span>})}</div>
 </section>;
}
