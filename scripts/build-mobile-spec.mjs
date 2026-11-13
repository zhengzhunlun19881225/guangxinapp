import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {catalog,categories} from '../src/spec/catalog.ts';
import {componentDetails} from '../src/spec/details.ts';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
// The download contains App design rules; engineering references stay in the online guide.
const documentFields=[['usage','用途与选择'],['visual','结构与视觉'],['behavior','状态与交互'],['keyboard','无障碍与焦点'],['boundaries','边界与恢复']];
const documentOverrides={
 'follow-settings':{visual:catalog.app.find(item=>item.id==='follow-settings').rule.replace('示例设置仅在本页生效。','')},
 carousel:{visual:'门户海报包含5个案例，支持左右滑动、圆点切换及点击查看案例；海报圆点为白色。常用功能与系统入口另用红色12×3px选中胶囊、灰色6×3px未选中胶囊，间距4px，均为全圆角。'},
 collapse:{visual:'整行标题可点，展开状态通过箭头方向与可访问状态表达。',behavior:'点击标题展开或收起；箭头与展开状态同步更新。'},
 toast:{behavior:'文字及四种语义提示约2.5秒自动消失；加载提示随任务结束更新或关闭。新消息替换当前提示，不显示关闭按钮。'},
 dialog:{visual:'包含有标题提示、无标题提示、确认弹窗、圆角按钮样式、异步关闭和自定义内容。白底、16px圆角、基准宽320px，标题居中18/26、600，正文14/22；基础操作栏48px高，基础确认按钮使用功能蓝；圆角按钮主体36px并保留44px热区，圆角确认按钮使用品牌渐变。',behavior:'提示弹窗仅提供确认；确认弹窗提供取消与确认。异步提交中禁用确认，完成后关闭；取消、点击遮罩或按返回键退出时中止等待。'},
 actionsheet:{visual:'包含基础用法、图标选项、取消按钮、描述信息、选项状态与自定义面板。白底、顶部22px圆角；选项至少56px高、16/24正文，图标20px；面板描述14/22、选项描述12/18，取消按钮52px高，以8px灰色间隔分组。禁用浅灰、加载红色渐变、危险选项红色。',behavior:'点击可用选项后反馈并关闭；禁用与加载项不执行操作。取消独立分组，点击遮罩或按返回键均可退出；自定义面板支持文档预览及分享入口。'},
 banner:{behavior:'每条可独立关闭，重要消息不按计时自动消失。',keyboard:'关闭按钮可通过辅助操作激活；新消息按紧急程度播报，不抢焦点或重复打断。',boundaries:'保持40px单行，超长文字省略且保留完整内容供辅助技术读取；关闭不影响其他消息，关闭按钮独立保留44px热区，关键阻断问题保留恢复入口。'},
 touch:{visual:'操作热区至少44×44px；图标本身可以更小。',boundaries:'窄屏和缩放后仍保持至少44×44px；边缘热区不能超出容器。'},
 responsive:{usage:'在手机不同屏幕宽度与横竖屏中保持一致的信息与操作顺序。'},
 countdown:{boundaries:'从后台恢复后按目标时间校正；离开页面后停止计时，禁止显示负数。'},
};
function appRule(text){
 return text.replaceAll('系统入口复用 PC 黑红线性图标','系统入口使用黑红线性图标')
  .replaceAll('参考PC：','').replaceAll('按PC统一状态标签：','状态标签：')
  .replaceAll('复用门户的 5 个案例','门户展示5个海报案例').replaceAll('复用通讯录真实头像','使用通讯录头像')
  .replaceAll('与当前工作台、广新门户和 AI 对话页同步，复用实际业务组件。','适用于工作台、广新门户和AI对话页。')
  .replaceAll('切换项均可聚焦激活；用 aria-selected 或 aria-pressed 表达当前值。','切换项均可聚焦激活，辅助技术应读出当前选中项。')
  .replaceAll('用 aria-current 表达当前页面','辅助技术应读出当前页面').replaceAll('通过 aria-checked 说明状态','辅助技术应读出开关状态')
  .replaceAll('纯提示关联 aria-describedby','辅助技术应能读取关联提示').replaceAll('错误通过 aria-invalid / 描述关联','错误应与对应字段关联并可被读屏读取')
  .replaceAll('使用 status 播报','使用读屏播报').replaceAll('标记 busy','说明加载状态').replaceAll('使用 busy / status 反馈','通过读屏反馈加载状态')
  .replaceAll('接入时补齐方向键切换','支持方向键切换').replaceAll('菜单接入应支持','菜单应支持')
  .replaceAll('危险操作接入真实业务前按风险确认','危险操作执行前按风险确认').replaceAll('CSS px','px');
}
const table=(headers,rows)=>{
 const escape=value=>String(value).replaceAll('|','\\|').replaceAll('\n','<br>');
 return [headers,headers.map(()=>'---'),...rows].map(row=>'| '+row.map(escape).join(' | ')+' |').join('\n')+'\n';
};
const components=Object.values(catalog).flat();
if(new Set(components.map(item=>item.id)).size!==components.length)throw new Error('Duplicate specification component ID');
if(categories.length!==Object.keys(catalog).length)throw new Error('Specification category mismatch');
let markdown=(await read('docs/mobile-spec-foundations.md'))
 .replaceAll('{{componentCount}}',String(components.length)).replaceAll('{{categoryCount}}',String(categories.length)).trimEnd()+'\n\n';

markdown+='## 组件规范\n\n'+categories.length+'类、'+components.length+'项组件，按用途、视觉、状态、无障碍与边界行为说明。\n\n';
for(const [index,category] of categories.entries()){
 const items=catalog[category.id];
 if(!items?.length)throw new Error('Empty specification category: '+category.id);
 markdown+='### '+(index+1)+'. '+category.label+'\n\n'+appRule(category.description)+'\n\n';
 markdown+=table(['组件','英文'],items.map(item=>[item.name,item.en]))+'\n';
 for(const item of items){
  const details={...componentDetails(item),...documentOverrides[item.id]};
  markdown+='#### '+item.name+'（'+item.en+'）\n\n';
  for(const [key,label] of documentFields){
   if(!details[key]?.trim())throw new Error('Missing specification field: '+item.id+'.'+key);
   markdown+='- **'+label+'**：'+appRule(details[key])+'\n';
  }
  markdown+='\n';
 }
}
markdown+=await read('docs/mobile-spec-interactions.md');
if([...markdown.matchAll(/^#### /gm)].length!==components.length)throw new Error('Incomplete specification export');
await mkdir(new URL('public/',root),{recursive:true});
for(const path of ['mobile-design-spec.md','public/mobile-design-spec.md'])await writeFile(new URL(path,root),markdown,'utf8');
console.log('Generated App design specification: '+categories.length+' categories, '+components.length+' components → '+fileURLToPath(new URL('public/mobile-design-spec.md',root)));
