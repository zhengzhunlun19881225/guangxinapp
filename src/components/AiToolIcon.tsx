type AiToolIconName='more'|'knowledge'|'smart-data'|'qa'|'data'|'share';

/** Original supplied SVG artwork, tinted with the control's current color. */
export default function AiToolIcon({name,size=16}:{name:AiToolIconName;size?:number}){
 return <span className="ai-tool-icon" data-ai-icon={name} aria-hidden="true" style={{display:'inline-block',width:size,height:size,flexShrink:0,backgroundColor:'currentColor',mask:`url('/assets/ui/ai-tools/${name}.svg') center / contain no-repeat`}}/>;
}
