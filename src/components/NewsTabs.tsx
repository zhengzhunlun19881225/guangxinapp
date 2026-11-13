export function NewsTabs<T extends string>({categories,category,onChange,panelId}:{categories:readonly T[];category:T;onChange:(value:T)=>void;panelId:string}){
 return <div className="portal-news-tabs" role="tablist" aria-label="资讯分类">
  {categories.map((name,index)=><button key={name} id={panelId+'-tab-'+index} type="button" role="tab" aria-selected={category===name} aria-controls={panelId} tabIndex={category===name?0:-1}
   onClick={()=>onChange(name)} onKeyDown={event=>{
    const target=event.key==='Home'?0:event.key==='End'?categories.length-1:event.key==='ArrowRight'?(index+1)%categories.length:event.key==='ArrowLeft'?(index+categories.length-1)%categories.length:-1;
    if(target<0)return;event.preventDefault();onChange(categories[target]);
    const button=event.currentTarget.parentElement?.children[target] as HTMLButtonElement|undefined;
    button?.focus();button?.scrollIntoView({block:'nearest',inline:'nearest'});
   }}><span className="app-pill-label">{name}</span></button>)}
 </div>;
}
