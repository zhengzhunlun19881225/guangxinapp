"""Adapt Figma reference geometry to the standalone React application.

Reference exports stay untouched in design-reference/. Shared live controls are
owned by the application; exported illustrations and charts retain their bytes.
"""
import pathlib, re, json, xml.etree.ElementTree as ET, shutil
root = pathlib.Path(__file__).resolve().parents[1]
src = root / 'src/screens'
src.mkdir(parents=True, exist_ok=True)
xml = (root/'design-reference/app.xml').read_text().split('</canvas>')[0]+'</canvas>'
canvas = ET.fromstring(xml)
overrides=json.loads((root/'design-reference/node-overrides.json').read_text()) if (root/'design-reference/node-overrides.json').exists() else {}
(root/'src/assetOverrides.ts').write_text('export const assetOverrides: Record<string,string> = '+json.dumps(overrides)+';\n')
pages = [
 ('chat','0:5137','ChatScene',812), ('history','0:4808','HistoryScene',812),
 ('skills','0:5372','SkillsScene',812), ('agents','0:5540','AgentsScene',812),
 ('contacts','0:5708','ContactsScene',816), ('im','0:5932','ImScene',816),
 ('portal-overview','0:6156','OverviewScene',1698), ('workbench','0:6655','WorkbenchScene',1425),
 ('portal-manager','0:7256','ManagerScene',2539), ('portal-leader','0:7975','LeaderScene',2571),
 ('portal-staff','0:8620','StaffScene',2216)]
remove = {
 'chat':['0:5145','0:5160','0:5191','236:669','0:5353','0:5363','0:5291'],
 'agents':['0:5564','0:5597','0:5701','236:664'],
 'skills':['0:5396','0:5429','0:5533','236:674'],
 'contacts':['0:5732','0:5765','281:5641','0:5851','0:5858','79:10480'],
 'im':['0:5956','0:6042','0:6075','0:6082','236:959'],
 'workbench':['0:6713','0:6714','0:6721','0:6774','0:6828','0:6834','0:7090','0:6837','0:6943','0:7030','0:7147','0:7193'],
 'portal-overview':['0:6591','0:6260','0:6283','0:6357'],
 'portal-manager':['236:905','0:7402'],
 'portal-leader':['236:689'],
 'portal-staff':['0:9167','236:797','0:8945','0:8858','0:8683']}
def region(code, node):
 m=re.search(r'<(div|p)\b[^>]*data-node-id="'+re.escape(node)+r'"[^>]*>',code)
 if not m: return None
 tag=m.group(1)
 if m.group().endswith('/>'): return (m.start(),m.end())
 depth=1
 for t in re.finditer(r'</?'+tag+r'\b[^>]*>',code[m.end():]):
  if t.group().startswith('</'): depth-=1
  elif not t.group().endswith('/>'): depth+=1
  if depth==0: return (m.start(),m.end()+t.end())
 return None
def wrap_notices(code):
 panels=[]; spans=[]
 for node in ['0:9027','0:9072']:
  span=region(code,node)
  if not span: return code
  a,b=span
  panel=code[a:b]
  panel=re.sub(r'className="[^"]+"', 'className="relative h-[225px] shrink-0 overflow-clip w-[236px]"',panel,count=1)
  panels.append(panel)
  wrapper=re.search(r'<div className="absolute left-0 w-\[375px\]" style=\{\{top:\d+\}\}>$',code[:a])
  if wrapper and code[b:].startswith('</div>'): a,b=wrapper.start(),b+6
  spans.append((a,b))
 track='<section className="portal-notices" aria-label="通知公告，左右滑动查看" tabIndex={0}>'+''.join(panels)+'</section>'
 for i in [1,0]:
  a,b=spans[i];code=code[:a]+(track if i==0 else '')+code[b:]
 return code

def action(label):
 nav={'通讯录':'contacts','总体情况':'portal-overview','综合资讯':'portal-leader','智数':'portal-overview','AI共享平台':'agents'}
 agents=['AI智写','AI查询','AI PPT','咨询问答','制作PPT','创作文档','分析数据']
 if label in nav: return 'navigate',nav[label]
 if label in agents: return 'agent',label
 if label in ['出差申请','加班申请','请休假']: return 'form',label
 if label=='打卡': return 'attendance','打卡'
 if label in ['知识库','更多','最新通知','最新公告']: return 'list',label
 if label.endswith('系统'): return 'list',label
 if label in ['最近记录','热门问答','常用问题']: return 'suggestions',label
 if label in ['集团合并','全部企业','2026年']: return 'filter',label
 if label in ['推荐','我关注的','与我有关','行业趋势','最新','最热','焦点','党建']: return 'feed',label
 if len(label)>9 and not label.startswith(('一句话','从需求','AI为您','您好','2万','19:','11:')): return 'detail',label
 return None
node_images={}
asset_aliases={}
for route,node,name,height in pages:
 code=(root/f'design-reference/{node.replace(":","-")}.tsx').read_text()
 aliases=dict(re.findall(r'const (\w+) = "(https://[^"]+)";',code))
 asset_aliases[route]={k:'/assets/figma/'+u.rsplit('/',1)[1] for k,u in aliases.items()}
 f=next(n for n in canvas if n.get('id')==node)
 for element in f.iter():
  area=region(code,element.get('id',''))
  if area:
   matches=re.findall(r'src=\{(\w+)\}',code[area[0]:area[1]])
   if matches and matches[0] in aliases:
    node_images[element.get('id')]='/assets/figma/'+aliases[matches[0]].rsplit('/',1)[1]
 for n in remove.get(route,[]):
  area=region(code,n)
  if area: code=code[:area[0]]+code[area[1]:]
 # Leave room for the shared live AI news section (374px, formerly 326px).
 if route=='portal-staff':
  for nid,old,new in [('0:9027',731,779),('0:9072',731,779),('0:8683',968,1016)]:
   area=region(code,nid)
   if area:
    part=code[area[0]:area[1]].replace(f'top-[{old}px]',f'top-[{new}px]',1)
    code=code[:area[0]]+part+code[area[1]:]
 for t in f.iter('text'):
  label=t.get('name','')
  a=action(label)
  if not a: continue
  area=region(code,t.get('id'))
  if not area: continue
  content=code[area[0]:area[1]]
  if content.startswith('<p'):
   content=content.replace('<p ', '<SceneAction onAction={onAction} action={'+json.dumps({'type':a[0],'value':a[1]},ensure_ascii=False)+'} ',1)
   content=re.sub(r'</p>$','</SceneAction>',content)
   code=code[:area[0]]+content+code[area[1]:]
 code=re.sub(r'https://www.figma.com/api/mcp/asset/([\w.-]+)',r'/assets/figma/\1',code)
 if route=='chat':
  for image_node in ['0:5312','0:5327','0:5298','0:5343']:
   area=region(code,image_node)
   if area and image_node in overrides:
    code=code[:area[0]]+'<img className="absolute left-0 top-0 h-[97.588px] w-[126.636px] pointer-events-none" alt="" src="'+overrides[image_node]+'"/>'+code[area[1]:]
 if route=='portal-overview':
  for nid,value in [('0:6203','345.67'),('0:6210','5678.90'),('0:6217','345.67'),('0:6224','123.45')]:
   code=re.sub(r'(data-node-id="'+nid+r'"[^>]*>)\s*[^<]*?(</p>)',
       lambda m:m.group(1)+'{('+value+' * (filters?.factor ?? 1)).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}'+m.group(2),code)
  code=re.sub(r'>\s*2026年\s*</',r'>{filters?.year ?? "2026年"}</',code)
  code=re.sub(r'>\s*全部企业\s*</',r'>{filters?.company ?? "全部企业"}</',code)
  for nid,asset_node in [('0:6181','0:8001'),('0:6351','0:6351')]:
   area=region(code,nid)
   if area and asset_node in overrides:
    part=code[area[0]:area[1]]
    part=re.sub(r'src=\{\w+\}', 'src="'+overrides[asset_node]+'"', part)
    code=code[:area[0]]+part+code[area[1]:]
  code=re.sub(r'export default function \w+\(\) \{',f'export default function {name}({{onAction,filters}}: SceneProps) {{',code)
 code=re.sub(r'export default function \w+\(\) \{',f'export default function {name}({{onAction}}: SceneProps) {{',code)
 # Match the real font family instead of the export tool's Figma-only alias.
 code=code.replace("font-['Alibaba_PuHuiTi:Regular']","font-app")
 code='import {SceneAction, type SceneProps} from "../components/SceneAction";\n'+code
 if route=='portal-staff': code=wrap_notices(code)
 (src/f'{name}.tsx').write_text(code)
# Shared portal sections are identical in the source designs. Compose the two
# larger canvases from these sections plus each canvas's own exported reminders.
for route,node,name,reminder_node in [
 ('portal-leader','0:7975','LeaderScene','0:8111'),
 ('portal-manager','0:7256','ManagerScene','0:7319')]:
 code=(src/'StaffScene.tsx').read_text()
 code=code.replace('function StaffScene','function '+name).replace('data-node-id="0:8620"','data-node-id="'+node+'"')
 shifts={'0:8646':42 if route=='portal-leader' else 0,
         '0:9167':40 if route=='portal-leader' else 0,
         '0:8858':355 if route=='portal-leader' else 323,
         '0:8683':345 if route=='portal-leader' else 317}
 for child,shift in shifts.items():
  if shift==0: continue
  area=region(code,child)
  if area:
   part=code[area[0]:area[1]]
   part='<div className="absolute left-0 w-[375px]" style={{top:'+str(shift)+'}}>'+part+'</div>'
   code=code[:area[0]]+part+code[area[1]:]
 fragments=[] # Native ServiceAlerts replaces the exported reminder content.
 if route=='portal-leader':
  fragments += [('0:8548','PortalToggle'),('0:8001','PortalIllustration')]
 imports=[]
 additions=[]
 for fid,suffix in fragments:
  raw=(root/f'design-reference/{fid.replace(":","-")}.tsx').read_text()
  fcode=re.sub(r'https://www.figma.com/api/mcp/asset/([\w.-]+)',r'/assets/figma/\1',raw)
  fcode=fcode.replace("font-['Alibaba_PuHuiTi:Regular']","font-app")
  cname=name+suffix
  fcode=re.sub(r'export default function \w+\(\) \{',f'export default function {cname}({{onAction}}: SceneProps) {{',fcode)
  if suffix=='Reminders':
   for label,typ in [('忽略','ignore-reminder'),('同步到日程','sync-calendar')]:
    pattern=r'<p ([^>]+)>\s*'+label+r'\s*</p>'
    fcode=re.sub(pattern,lambda m:'<SceneAction onAction={onAction} action={{type:"'+typ+'",value:"'+label+'"}} '+m.group(1)+'>'+label+'</SceneAction>',fcode)
  if suffix=='PortalToggle':
   fcode=fcode.replace('<p ','<SceneAction onAction={onAction} action={{type:"navigate",value:"portal-leader"}} ',1)
   fcode=fcode.replace('</p>','</SceneAction>',1)
   start=fcode.find('<p ')
   fcode=fcode[:start]+fcode[start:].replace('<p ','<SceneAction onAction={onAction} action={{type:"navigate",value:"portal-overview"}} ',1).replace('</p>','</SceneAction>',1)
  if suffix=='PortalIllustration' and '0:8001' in overrides:
   fcode=re.sub(r'const img = "[^"]+";', 'const img = "'+overrides['0:8001']+'";',fcode)
  (src/f'{cname}.tsx').write_text('import {SceneAction,type SceneProps} from "../components/SceneAction";\n'+fcode)
  imports.append(f'import {cname} from "./{cname}";')
  if suffix=='PortalToggle':
   additions.append('<div className="absolute left-[108px] top-[96px] h-[30px] w-[158px]"><'+cname+' onAction={onAction}/></div>')
  elif suffix=='PortalIllustration':
   illustration='<div className="absolute left-[237px] top-[81px] size-[123px] pointer-events-none mix-blend-multiply"><'+cname+' onAction={onAction}/></div>'
   foreground=code.find('<div className="absolute left-0 w-[375px]" style={{top:42}}>')
   if foreground>=0: code=code[:foreground]+illustration+code[foreground:]
  else: additions.append('<'+cname+' onAction={onAction}/>')
 end=code.rfind('    </div>')
 code=code[:end]+'\n'.join(additions)+'\n'+code[end:]
 (src/f'{name}.tsx').write_text('\n'.join(imports)+'\n'+code)
manifest=[dict(route=r,nodeId=n,component=c,height=h,name=next(f.get('name') for f in canvas if f.get('id')==n)) for r,n,c,h in pages]
(root/'src/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(root/'src/assets.ts').write_text('export const assets = '+json.dumps(asset_aliases,ensure_ascii=False,indent=2)+' as const;\nexport const nodeImages: Record<string,string> = '+json.dumps(node_images,ensure_ascii=False,indent=2)+';\n')
fonts=root/'public/assets/fonts'; fonts.mkdir(parents=True,exist_ok=True)
font=root.parent/'guangxin-preview-20261104/public/assets/fonts/Alibaba-PuHuiTi-Regular-Web.ttf'
shutil.copy2(font,fonts/'Alibaba-PuHuiTi-Regular.ttf')
asset_urls=set()
for f in (root/'design-reference').glob('*.tsx'):
 asset_urls.update(re.findall(r'https://www.figma.com/api/mcp/asset/[\w.-]+',f.read_text()))
(root/'design-reference/assets.json').write_text(json.dumps(sorted(asset_urls)))
print(f'Prepared {len(pages)} App scenes and {len(node_images)} asset bindings.')
import runpy
runpy.run_path(str(root/'scripts/apply-mobile-spec.py'),run_name='__main__')
