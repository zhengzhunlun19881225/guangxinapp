import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=new URL('../output/playwright/mobile-spec/',import.meta.url);await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[],failed=[],checks=[];
page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)failed.push(response.url()+' '+response.status())});
const base=process.env.BASE_URL||'http://127.0.0.1:5317/';
const card=id=>page.locator('[data-component="'+id+'"]');
async function capture(name){
 await page.evaluate(async()=>{
  const urls=[...new Set(Array.from(document.querySelectorAll('.spec-icon')).map(el=>getComputedStyle(el).maskImage.match(/url\(["']?(.*?)["']?\)/)?.[1]).filter(Boolean))];
  await Promise.all(urls.map(url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(new Error('Icon failed: '+url));image.src=url}))); 
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 });
 await page.screenshot({path:fileURLToPath(new URL(name+'.png',output))});
}
async function category(name){await page.locator('.guide-categories').getByRole('button',{name,exact:true}).click();await page.waitForLoadState('networkidle')}
async function downloadSpec(){
 const link=page.getByRole('link',{name:'下载完整规范 MD 文档',exact:true});
 const [download]=await Promise.all([page.waitForEvent('download'),link.click()]);
 assert.equal(download.suggestedFilename(),'广智新App完整手机规范.md');
 const markdown=await fs.readFile(await download.path(),'utf8');
 assert.equal(markdown,await fs.readFile(new URL('../mobile-design-spec.md',import.meta.url),'utf8'));
 assert.equal((markdown.match(/^#### /gm)||[]).length,71);
 for(const field of ['用途与选择','结构与视觉','状态与交互','无障碍与焦点','边界与恢复'])assert.equal(markdown.split('- **'+field+'**：').length-1,71,field+' exported for every component');
 assert.match(markdown,/包含文字、加载、信息、成功、警告、错误六种效果/);assert.match(markdown,/通栏浅色底通知条/);
 assert.match(markdown,/相邻分类(?:视觉)?间距\s*16px/);assert.match(markdown,/## 状态与交互/);
 assert.doesNotMatch(markdown,/底部消息条|Snackbar|Alibaba|普惠体|PingFang|Microsoft YaHei|参考业务源码|接入约定|组件 ID|文档维护|桌面|PC|示例|演示|\b(?:src|docs|public|dist)\/|npm run|pnpm|--[a-z][\w-]+|aria-/);
 return markdown;
}
try{
 await page.goto(base+'#/mobile-spec');await page.locator('.mobile-guide-complete').waitFor();await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
 await capture('overview-375');assert.match(await page.locator('.guide-summary').innerText(),/75/);
 await downloadSpec();checks.push('App-only UTF-8 Markdown download: 9 categories, 71 components, five design guidance fields, foundation styles and interactions; excludes source, API, desktop preview and maintenance content');
 await page.locator('.guide-palette').screenshot({path:fileURLToPath(new URL('palette-375.png',output))});
 await page.locator('.guide-types').screenshot({path:fileURLToPath(new URL('typography-375.png',output))});
 const groups=[['基础原子',7],['App 组件',7],['导航',8],['按钮操作',5],['表单输入',14],['内容展示',13],['反馈弹窗',9],['移动交互',4],['配套规范',4]];
 for(const [label,count] of groups){
  await category(label);assert.equal(await page.locator('.guide-demo-card').count(),count,label);
  const descriptions=await page.locator('.guide-demo-card').evaluateAll(cards=>cards.map(card=>({id:card.dataset.component,labels:Array.from(card.querySelectorAll('.guide-demo-details dt')).map(el=>el.textContent),complete:Array.from(card.querySelectorAll('.guide-demo-details dd')).every(el=>el.textContent.trim().length>8),sources:card.querySelectorAll('.guide-demo-source code').length})));
  for(const detail of descriptions){assert.deepEqual(detail.labels,['用途与选择','结构与视觉','状态与交互','键盘与焦点','边界与恢复','接入约定'],detail.id);assert.ok(detail.complete&&detail.sources>0,detail.id+' complete guidance and source');}
  await page.evaluate(()=>Promise.all(Array.from(document.images).map(image=>image.decode().catch(()=>null))));
  assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.src)),[],label+' broken images');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,label+' overflow');
  await capture('category-'+label+'-375');
 }
 checks.push('all 9 categories, 71 component cards plus 4 foundation sections; each component includes six PC-style guidance fields and source references');

 await category('导航');assert.equal(await card('tabbar').getByRole('button').count(),5);
 const navEdges=await card('navbar').locator('.app-navbar').evaluate(el=>{const box=el.getBoundingClientRect(),left=el.querySelector('.app-navbar-left svg').getBoundingClientRect(),right=el.querySelector('.app-navbar-right svg').getBoundingClientRect();return [left.left-box.left,box.right-right.right]});assert.ok(navEdges.every(inset=>Math.abs(inset-15)<.5),'navbar visible edge insets');

 await card('tabbar').getByRole('button',{name:'IM',exact:true}).click();assert.match(await card('tabbar').locator('img.spec-nav-icon').getAttribute('src'),/nav-im-active/);
 const selectedSegment=card('segmented').getByRole('button',{name:'综合资讯',exact:true});
 assert.deepEqual(await card('segmented').locator('.spec-portal-segments').evaluate(el=>({width:getComputedStyle(el).width,gap:getComputedStyle(el).gap})),{width:'158px',gap:'0px'});assert.deepEqual(await card('segmented').locator('.spec-segments').evaluateAll(es=>es.map(el=>getComputedStyle(el).height)),['30px','30px']);
 assert.deepEqual(await selectedSegment.evaluate(el=>({color:getComputedStyle(el).color,weight:getComputedStyle(el).fontWeight})),{color:'rgb(3, 9, 27)',weight:'600'});
 await card('segmented').getByRole('button',{name:'总体情况',exact:true}).click();assert.equal(await card('segmented').getByRole('button',{name:'总体情况',exact:true}).getAttribute('aria-pressed'),'true');
 assert.equal(await card('scrollnav').locator('.app-pill-label').first().evaluate(el=>getComputedStyle(el).height),'28px');
 await category('App 组件');
 const glass=await card('system-grid').locator('.shortcut-card').evaluate(el=>({background:getComputedStyle(el).backgroundColor,blur:getComputedStyle(el).backdropFilter,columns:getComputedStyle(el.querySelector('.shortcut-grid')).gridTemplateColumns.split(' ').length}));
 assert.deepEqual(glass,{background:'rgba(255, 255, 255, 0.7)',blur:'blur(12px)',columns:5});
 assert.equal(await card('common-shortcuts').locator('.shortcut-grid').first().locator('button').count(),8);
 await card('system-grid').getByRole('button',{name:'第2页',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-component=system-grid] .shortcut-pagination button:nth-child(2)')?.getAttribute('aria-current')==='page');assert.equal(await card('system-grid').getByRole('button',{name:'第2页',exact:true}).getAttribute('aria-current'),'page');
 const poster=card('poster-cases');assert.equal(await poster.locator('.portal-banner-slide').count(),5);await poster.getByRole('button',{name:'查看第5个案例',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-component=poster-cases] .portal-banner-pagination button:nth-child(5)')?.getAttribute('aria-current')==='page');assert.equal(await poster.getByRole('button',{name:'查看第5个案例',exact:true}).getAttribute('aria-current'),'page');
 await card('chat-composer').getByRole('textbox').fill('帮我提交出差申请');
 assert.deepEqual(await page.locator('.spec-composer-options>button').evaluateAll(es=>es.map(el=>getComputedStyle(el).height)),['34px','34px','34px']);
 assert.deepEqual(await page.locator('.hotspot-manage-toolbar .news-sub-modes>button').evaluateAll(es=>es.map(el=>getComputedStyle(el).height)),['32px','32px']);
 assert.ok((await page.locator('.hotspot-follow-actions>button').evaluateAll(es=>es.map(el=>getComputedStyle(el).height))).every(height=>height==='28px'));
 const composer=await card('chat-composer').getByRole('button',{name:'输入栏相机示例'}).evaluate(el=>{const circle=el.querySelector('span').getBoundingClientRect(),svg=el.querySelector('svg').getBoundingClientRect();return{w:svg.width,h:svg.height,dx:Math.abs(svg.x+svg.width/2-circle.x-circle.width/2),dy:Math.abs(svg.y+svg.height/2-circle.y-circle.height/2)}});assert.equal(composer.w,18);assert.equal(composer.h,18);assert.ok(composer.dx<.6&&composer.dy<.6);
 const brief=card('daily-brief');assert.deepEqual(await brief.locator('header svg').evaluateAll(es=>es.map(el=>Number(el.getAttribute('width')))),[16,16]);assert.equal(await brief.locator('footer button').evaluate(el=>getComputedStyle(el).borderRadius),'999px');
 const adaptive=card('adaptive-news'),height=()=>adaptive.locator('.spec-adaptive-news').evaluate(el=>el.getBoundingClientRect().height),fullHeight=await height();await adaptive.getByRole('tab',{name:'党建',exact:true}).click();const oneHeight=await height();await adaptive.getByRole('tab',{name:'暂无内容',exact:true}).click();assert.ok(fullHeight>oneHeight&&oneHeight>await height());
 const savedSettings=await page.evaluate(()=>localStorage.getItem('gx-app-hotspot-settings'));
 const follow=card('follow-settings');await follow.getByRole('tab',{name:'AI 订阅',exact:true}).click();assert.equal(await follow.getByLabel('追踪需求').getAttribute('maxlength'),'4000');await follow.getByLabel('追踪需求').fill('关注国际油价和原油供需，排除广告');await follow.getByRole('button',{name:'AI生成订阅条件',exact:true}).click();assert.equal(await follow.getByLabel('主题名称',{exact:true}).inputValue(),'国际油价动态');await follow.getByRole('button',{name:'保存并关注',exact:true}).click();await follow.getByRole('button',{name:'取消关注国际油价动态',exact:true}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('gx-app-hotspot-settings')),savedSettings);
 await capture('current-app-patterns-375');checks.push('five App tabs, black bold header segments, five-column system paging, 70% glass, five poster cases, composer centering, 16px brief icons, adaptive heights and isolated AI follow settings');
 for(const width of [320,375,430]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'App examples overflow at '+width)}await page.setViewportSize({width:375,height:812});

 await page.getByRole('textbox',{name:'搜索组件或规范',exact:true}).fill('不存在的组件');await page.getByText('未找到相关组件',{exact:true}).waitFor();
 await page.getByRole('textbox',{name:'搜索组件或规范',exact:true}).fill('DatePicker');assert.equal(await page.locator('.guide-demo-card').count(),1);await downloadSpec();
 await page.getByRole('button',{name:'清空规范搜索',exact:true}).click();checks.push('Chinese/English catalog search, clear and empty state');
 await category('导航');await card('tabs').getByRole('tab',{name:'待办',exact:true}).click();assert.equal(await card('tabs').getByRole('tab',{name:'待办'}).getAttribute('aria-selected'),'true');
 await card('tabbar').getByRole('button',{name:'我的',exact:true}).click();assert.equal(await card('tabbar').getByRole('button',{name:'我的'}).getAttribute('aria-current'),'page');
 await card('indexbar').getByRole('button',{name:'D',exact:true}).click();assert.ok(await page.locator('.spec-index-content').evaluate(el=>el.scrollTop)>0);
 await card('drawer').getByRole('button').click();await page.getByRole('dialog',{name:'移动端菜单'}).waitFor();await capture('drawer-375');assert.equal(await page.locator('.mobile-guide-complete').evaluate(el=>el.inert),true);
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});checks.push('tabs, tabbar, index and drawer Escape/focus return');
 await category('表单输入');
 for(const id of ['input','textarea','search','datepicker']){
  const field=card(id).locator('input,textarea').first();await field.click();
  assert.equal(await field.evaluate(el=>getComputedStyle(el).outlineStyle),'none',id+' no blue focus outline');
  await card(id).locator('.guide-demo-surface').screenshot({path:fileURLToPath(new URL(id+'-focus-no-outline.png',output))});
  await field.blur();await page.mouse.move(0,0);
 }
 for(const [id,selector] of [['input','.spec-input-wrap'],['textarea','textarea']]){
  const field=card(id).locator(selector);await page.mouse.move(0,0);await page.locator(':focus').evaluateAll(elements=>elements.forEach(el=>el.blur()));
  await page.waitForTimeout(160);assert.equal(await field.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)',id+' default white');
  await field.hover();await page.waitForTimeout(160);assert.equal(await field.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(252, 252, 254)',id+' hover gray');
 }
 await page.mouse.move(0,0);
 assert.ok((await page.locator('.app-select-trigger').evaluateAll(es=>es.map(el=>getComputedStyle(el).backgroundColor))).every(color=>color==='rgb(255, 255, 255)'));
 await card('picker').getByRole('combobox').click();assert.equal(await card('picker').getByRole('combobox').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(252, 252, 254)');await page.keyboard.press('Escape');await card('input').getByRole('textbox').focus();await page.mouse.move(0,0);assert.equal(await card('picker').getByRole('combobox').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
 const dateInput=card('datepicker').getByLabel('规范日期时间');assert.equal(await dateInput.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');await dateInput.focus();await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-component=datepicker] input')).backgroundColor==='rgb(252, 252, 254)');await page.mouse.move(0,0);await dateInput.blur();await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-component=datepicker] input')).backgroundColor==='rgb(255, 255, 255)');
 await card('input').getByRole('textbox').fill('李佳佳');await card('input').getByRole('button',{name:'清空姓名'}).click();assert.equal(await card('input').getByRole('textbox').inputValue(),'');
 await card('switch').getByRole('switch').click();assert.equal(await card('switch').getByRole('switch').getAttribute('aria-checked'),'true');
 assert.equal(await card('checkbox').getByLabel('生活',{exact:true}).evaluate(el=>getComputedStyle(el).borderRadius),'4px');
 assert.ok((await card('chip').getByRole('button').evaluateAll(es=>es.map(el=>getComputedStyle(el).height))).every(height=>height==='40px'));
 await card('checkbox').getByLabel('生活',{exact:true}).check();assert.equal(await card('checkbox').getByLabel('生活').isChecked(),true);
 const choose=async(id,label,value)=>{await card(id).getByRole('combobox',{name:label,exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click()};
 await choose('picker','普通选择示例','紧急');assert.match(await card('picker').getByRole('combobox').innerText(),/紧急/);
 await choose('cascade','一级组织','子公司');await choose('cascade','二级部门','业务二部');assert.match(await card('cascade').getByLabel('二级部门').innerText(),/业务二部/);
 await choose('city','选择省份','浙江省');assert.match(await card('city').getByLabel('选择城市').innerText(),/杭州市/);await choose('city','选择城市','宁波市');
 await card('picker').getByRole('combobox').focus();await page.keyboard.press('ArrowDown');await page.getByRole('listbox').waitFor();assert.deepEqual(await page.getByRole('listbox').evaluate(el=>{const s=getComputedStyle(el);return[s.backgroundColor,s.borderTopWidth,s.borderRadius]}),['rgb(255, 255, 255)','1px','12px']);await page.keyboard.press('End');await page.keyboard.press('Escape');assert.match(await card('picker').getByRole('combobox').innerText(),/紧急/);assert.equal(await page.getByRole('listbox').count(),0);
 await card('picker').getByRole('combobox').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('End');await page.keyboard.press('Enter');assert.match(await card('picker').getByRole('combobox').innerText(),/重要/);

 await card('stepper').getByRole('button',{name:'增加数量'}).click();assert.equal(await card('stepper').getByRole('status',{name:'数量'}).innerText(),'1');
 await card('upload').locator('input[type=file]').setInputFiles(fileURLToPath(new URL('../public/assets/im/chat-photo.png',import.meta.url)));await card('upload').locator('.spec-upload-preview').waitFor();await card('upload').getByRole('button',{name:/移除文件/}).click();assert.equal(await card('upload').locator('.spec-file').count(),0);checks.push('inputs, checkbox, switch, cascade, city, stepper and image upload/removal');
 await category('内容展示');assert.equal(await card('tag').getByText('告警',{exact:true}).count(),1);assert.equal(await card('tag').getByText('未完成',{exact:true}).count(),1);
 const badge=card('badge');assert.deepEqual(await badge.locator('.spec-badge').first().evaluate(el=>{const s=getComputedStyle(el);return[s.height,s.minWidth,s.borderTopWidth,s.fontSize,s.lineHeight]}),['20px','28px','2px','12px','16px']);
 await badge.getByLabel('未读数量',{exact:true}).fill('100');const unread=badge.getByRole('button',{name:'消息，100条未读，点击标记已读',exact:true});assert.equal(await unread.locator('.spec-badge').innerText(),'99+');await unread.click();assert.equal(await badge.locator('.spec-badge-trigger').first().locator('.spec-badge').count(),0);
 await badge.getByLabel('显示零值',{exact:true}).check();assert.equal(await badge.locator('.spec-badge-trigger').first().locator('.spec-badge').innerText(),'0');await badge.getByRole('button',{name:'重置未读',exact:true}).click();await badge.locator('.spec-badge-demo').screenshot({path:fileURLToPath(new URL('badge-pc-reference.png',output))});
 await card('collapse').getByRole('button').click();assert.equal(await card('collapse').getByRole('button').getAttribute('aria-expanded'),'true');
 assert.equal(await card('carousel').locator('.portal-banner-slide').count(),5);
 await card('carousel').getByRole('button',{name:'查看第3个案例',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-component=carousel] .portal-banner-pagination button:nth-child(3)')?.getAttribute('aria-current')==='page');
 await card('countdown').getByRole('button').click();await page.waitForTimeout(1100);assert.notEqual(await card('countdown').locator('output').innerText(),'00:30');
 await card('imageviewer').getByRole('button').click();await page.getByRole('button',{name:'放大图片'}).click();assert.equal(await page.locator('.spec-image-toolbar output').innerText(),'125%');await capture('image-preview-375');
 const stage=await page.locator('.spec-image-stage').boundingBox(),cdp=await page.context().newCDPSession(page),cx=stage.x+stage.width/2,cy=stage.y+stage.height/2;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-25,y:cy,id:1},{x:cx+25,y:cy,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-50,y:cy,id:1},{x:cx+50,y:cy,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.ok(parseInt(await page.locator('.spec-image-toolbar output').innerText())>=200,'actual pinch zoom');await cdp.detach();await page.keyboard.press('Escape');checks.push('collapse, carousel, live countdown and image zoom');
 await category('反馈弹窗');assert.equal(await card('bubble-tips').locator('.spec-bubble').count(),5);assert.ok((await card('bubble-tips').locator('.spec-bubble').evaluateAll(es=>es.map(el=>el.getBoundingClientRect().height))).every(height=>Math.abs(height-32)<.5));assert.equal(await card('banner').locator('.spec-banner').count(),4);await card('banner').getByRole('button',{name:'关闭信息提示',exact:true}).click();assert.equal(await card('banner').locator('.spec-banner').count(),3);await card('banner').getByRole('button',{name:'恢复全部提示',exact:true}).click();assert.equal(await card('banner').locator('.spec-banner').count(),4);await card('bubble-tips').screenshot({path:fileURLToPath(new URL('bubble-five-directions.png',output))});
 assert.equal(await card('dialog').getByRole('button').count(),7);
 const dialogExamples=[['alert','基础用法 · 提示弹窗'],['no-title','基础用法 · 提示弹窗（无标题）'],['confirm','基础用法 · 确认弹窗'],['round-alert','圆角按钮样式 · 提示弹窗'],['round-no-title','圆角按钮样式 · 提示弹窗（无标题）'],['async','异步关闭 · 异步关闭'],['component','使用 Dialog 组件 · 使用 Dialog 组件']];
 for(const [id,label] of dialogExamples){
  const trigger=card('dialog').getByRole('button',{name:label,exact:true});await trigger.click();const dialog=page.getByRole('dialog');await dialog.waitFor();assert.equal(await dialog.getAttribute('aria-modal'),'true');assert.equal(await dialog.locator('h2').count(),id.includes('no-title')?0:1);assert.equal(await dialog.locator('footer button').count(),['confirm','async','component'].includes(id)?2:1);
  if(id.startsWith('round-')){const style=await dialog.locator('footer .is-primary>span').evaluate(el=>{const s=getComputedStyle(el);return{background:s.backgroundImage,height:s.height,radius:s.borderRadius,border:s.borderWidth}});assert.match(style.background,/linear-gradient/);assert.equal(style.height,'36px');assert.equal(style.radius,'999px');assert.equal(style.border,'0px')}
  if(id==='component'){await dialog.locator('img').evaluate(image=>image.decode());assert.ok(await dialog.locator('img').evaluate(image=>image.complete&&image.naturalWidth>0))}
  await capture('dialog-'+id+'-375');
  if(id==='async'){await dialog.getByRole('button',{name:'确认',exact:true}).click();assert.equal(await dialog.getAttribute('aria-busy'),'true');assert.equal(await dialog.getByRole('button',{name:'提交中',exact:true}).isDisabled(),true);await page.keyboard.press('Tab');assert.equal(await dialog.getByRole('button',{name:'取消',exact:true}).evaluate(el=>el===document.activeElement),true);await dialog.waitFor({state:'detached'});await page.getByRole('status').filter({hasText:'异步操作已完成'}).waitFor()}
  else if(id==='confirm')await dialog.getByRole('button',{name:'取消',exact:true}).click();
  else if(id==='no-title')await page.keyboard.press('Escape');
  else if(id==='round-no-title')await page.locator('.spec-overlay-dialog-example').click({position:{x:10,y:10}});
  else await dialog.getByRole('button',{name:'确认',exact:true}).click();
  await dialog.waitFor({state:'detached'});await page.waitForFunction(el=>el===document.activeElement,await trigger.elementHandle());
 }
 await card('dialog').getByRole('button',{name:'异步关闭 · 异步关闭',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'确认',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'取消',exact:true}).click();await card('dialog').getByRole('button',{name:'基础用法 · 提示弹窗',exact:true}).click();await page.waitForTimeout(1100);assert.equal(await page.getByRole('dialog').count(),1,'cancelled async task must not close the next dialog');await page.keyboard.press('Escape');
 checks.push('seven Dialog examples: titled/untitled alerts, confirmation, rounded buttons, async completion/cancellation and custom image component; focus return and dismissal');
 assert.equal(await card('actionsheet').getByRole('button').count(),6);
 for(const [id,label] of [['basic','基础用法'],['icons','展示图标'],['cancel','展示取消按钮'],['description','展示描述信息'],['states','选项状态'],['custom','自定义面板']]){
  const trigger=card('actionsheet').getByRole('button',{name:label,exact:true});await trigger.click();const sheet=page.getByRole('dialog',{name:'动作面板 · '+label,exact:true});await sheet.waitFor();assert.equal(await page.locator('.mobile-guide-complete').evaluate(el=>el.inert),true);
  if(id==='icons')assert.equal(await sheet.locator('.spec-sheet-option>svg').count(),3);
  if(id==='description'){assert.equal(await sheet.getByText('这是一段描述信息',{exact:true}).count(),1);assert.equal(await sheet.getByText('描述信息',{exact:true}).count(),1)}
  if(id==='states'){assert.equal(await sheet.getByRole('button',{name:'禁用选项',exact:true}).isDisabled(),true);assert.equal(await sheet.getByRole('button',{name:'加载中',exact:true}).isDisabled(),true);assert.equal(await sheet.getByRole('button',{name:'加载中',exact:true}).getAttribute('aria-busy'),'true');assert.equal(await sheet.getByRole('button',{name:'危险选项',exact:true}).evaluate(el=>getComputedStyle(el).color),'rgb(255, 0, 0)');const enabled=sheet.locator('button:not(:disabled)');await enabled.last().focus();await page.keyboard.press('Tab');assert.equal(await enabled.first().evaluate(el=>el===document.activeElement),true)}
  if(id==='custom'){assert.equal(await sheet.getByText('2026 年度工作安排',{exact:true}).count(),1);assert.equal(await sheet.locator('.spec-sheet-share-grid>button').count(),4)}
  await capture('actionsheet-'+id+'-375');
  if(id==='basic'||id==='icons'){await sheet.getByRole('button',{name:'选项一',exact:true}).click();await page.getByRole('status').filter({hasText:'已选择选项一'}).waitFor()}
  else if(id==='custom'){await sheet.getByRole('button',{name:'企业微信',exact:true}).click();await page.getByRole('status').filter({hasText:'已选择企业微信'}).waitFor()}
  else if(id==='cancel'){await sheet.getByRole('button',{name:'取消',exact:true}).click()}
  else if(id==='description'){await page.locator('.spec-overlay-actionsheet').click({position:{x:10,y:10}})}
  else await page.keyboard.press('Escape');
  await sheet.waitFor({state:'detached'});await page.waitForFunction(()=>!document.querySelector('.mobile-guide-complete').inert);await page.waitForFunction(el=>el===document.activeElement,await trigger.elementHandle());
 }
 checks.push('six action sheet variants: icons, cancellation, descriptions, disabled/loading/danger states, custom sharing; selection, backdrop, Escape, focus trap and focus return');
 assert.equal(await page.locator('[data-component=snackbar]').count(),0);assert.equal(await page.locator('[data-component=popover]').count(),0);assert.ok((await card('banner').locator('.spec-banner').evaluateAll(es=>es.map(el=>{const s=getComputedStyle(el);return s.height==='40px'&&s.backgroundColor!=='rgb(255, 255, 255)'&&s.borderRadius==='0px'&&s.borderTopWidth==='0px'&&s.boxShadow==='none'}))).every(Boolean));assert.ok((await card('banner').locator('.spec-banner-close').evaluateAll(es=>es.map(el=>el.getBoundingClientRect().height))).every(height=>height>=43.5));await card('banner').locator('.spec-banner-stack').screenshot({path:fileURLToPath(new URL('banner-semantic-strips.png',output))});
 assert.deepEqual(await card('toast').locator('.app-toast').evaluateAll(es=>es.map(el=>el.dataset.variant)),['text','loading','info','success','warning','danger']);assert.equal(await card('toast').locator('.app-toast button').count(),0);assert.equal(await card('toast').locator('.app-toast-icon').count(),4);
 for(const [label,variant] of [['信息','info'],['成功','success'],['警告','warning'],['错误','danger']]){await card('toast').getByRole('button',{name:'展示'+label+'提示',exact:true}).click();assert.equal(await page.locator('.spec-live-message.app-toast').getAttribute('data-variant'),variant)}
 await card('toast').getByRole('button',{name:'展示加载提示',exact:true}).click();assert.equal(await page.locator('.spec-live-message.app-toast').getAttribute('aria-busy'),'true');await page.waitForFunction(()=>document.querySelector('.spec-live-message')?.textContent==='加载完成');checks.push('six toast variants, four restored semantic icons, loading completion, and 40px banner strips with 44px close targets');
 await card('dropdown').getByRole('button').click();await card('dropdown').getByRole('menuitem',{name:'工作日历'}).click();await card('dropdown').getByRole('button',{name:'工作日历'}).waitFor();
 await card('guide').getByRole('button').click();await page.getByRole('dialog',{name:'快速认识组件规范'}).waitFor();await capture('guide-overlay-375');await page.keyboard.press('Escape');
 await card('loading').getByRole('button').click();await page.getByRole('dialog',{name:'加载中'}).waitFor();await page.getByRole('button',{name:'取消加载'}).click();checks.push('dialog, action sheet, dropdown, guide and cancellable loading');
 await category('移动交互');await card('refresh').getByRole('button',{name:'刷新示例列表'}).click();await page.getByText('工作通知 · 第 2 次更新',{exact:true}).waitFor();
 const pullBox=await page.locator('.spec-pull').boundingBox();await page.mouse.move(pullBox.x+70,pullBox.y+48);await page.mouse.down();await page.mouse.move(pullBox.x+70,pullBox.y+120,{steps:8});await page.mouse.up();await page.getByText('工作通知 · 第 3 次更新',{exact:true}).waitFor();
 await card('loadmore').getByRole('button',{name:'加载更多',exact:true}).click();await page.waitForTimeout(800);assert.ok(await page.locator('.spec-load-list>p').count()>=6);
 await page.locator('.spec-swipe-front').scrollIntoViewIfNeeded();const swipeBox=await page.locator('.spec-swipe-front').boundingBox();await page.mouse.move(swipeBox.x+swipeBox.width-65,swipeBox.y+30);await page.mouse.down();await page.mouse.move(swipeBox.x+35,swipeBox.y+30,{steps:6});await page.mouse.up();await card('swipe').getByRole('button',{name:'删除',exact:true}).click();await page.getByRole('status').filter({hasText:'记录已删除'}).waitFor();await page.locator('.spec-snackbar').getByRole('button',{name:'撤销'}).click();await card('swipe').getByText('项目调研通知',{exact:true}).waitFor();
 await page.locator('.spec-sticky-demo').evaluate(el=>el.scrollTop=80);checks.push('refresh, paged loading, swipe delete and undo, sticky scrolling');
 await category('配套规范');await card('gestures').getByRole('button').scrollIntoViewIfNeeded();const hold=await card('gestures').getByRole('button').boundingBox();await page.mouse.move(hold.x+hold.width/2,hold.y+hold.height/2);await page.mouse.down();await page.waitForTimeout(720);await page.mouse.up();await page.getByRole('dialog',{name:'更多操作'}).waitFor();await page.keyboard.press('Escape');checks.push('actual pull, swipe, long press and two-finger pinch gestures');await card('states').getByRole('textbox').fill('13800138000');assert.equal(await card('states').getByRole('textbox').getAttribute('aria-invalid'),'false');
 for(const width of [320,375,430,1440]){
  await page.setViewportSize({width,height:900});await category('按钮操作');await page.waitForTimeout(120);
  const downloadLink=page.getByRole('link',{name:'下载完整规范 MD 文档',exact:true});await downloadLink.scrollIntoViewIfNeeded();assert.ok((await downloadLink.boundingBox()).height>=43.5,'download target at '+width);if(width===1440)await downloadSpec();
  assert.deepEqual(await card('button-group').locator('.spec-segments').evaluate(el=>{const s=getComputedStyle(el);return{height:Math.round(parseFloat(s.height)),padding:s.padding,radius:s.borderRadius,background:s.backgroundColor}}),{height:36,padding:'2px',radius:'12px',background:'rgb(244, 245, 247)'});
  assert.ok((await card('button-group').locator('.spec-segments>button').evaluateAll(es=>es.map(el=>Math.round(parseFloat(getComputedStyle(el).height))))).every(height=>height===32));
  const tooSmall=await page.locator('.guide-demo-card button:visible:not([data-component=button-group] .spec-segments>button)').evaluateAll(buttons=>buttons.map(button=>({text:button.textContent,box:button.getBoundingClientRect()})).filter(({box})=>box.width<43.5||box.height<43.5).map(({text,box})=>({text,width:box.width,height:box.height})));
  assert.deepEqual(tooSmall,[],'44px actual touch targets at '+width);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await capture('buttons-'+width);
 }
 await page.setViewportSize({width:812,height:375});await category('表单输入');await page.waitForTimeout(150);assert.ok(await page.locator('.device').evaluate(el=>el.getBoundingClientRect().height)<=375);await capture('landscape-812');checks.push('320/375/430/1440 actual 44px button targets and landscape 812×375');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={result:'passed',checks,errors,failed};await fs.writeFile(new URL('report.json',output),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
