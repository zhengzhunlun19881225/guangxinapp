/** Supplied 48px artwork rendered at the App's existing icon sizes. */
export default function ResourceIcon({name,size=24,className=''}:{name:'knowledge'|'cloud-drive'|'book';size?:number;className?:string}){
 return <img src={'/assets/ui/icon-'+name+'.png'} alt="" aria-hidden="true" className={'app-resource-icon '+className} width={size} height={size} style={{width:size,height:size,objectFit:'contain',flexShrink:0,display:'block'}}/>;
}
