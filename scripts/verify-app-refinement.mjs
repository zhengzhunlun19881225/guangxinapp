import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=new URL('../output/playwright/app-refinement/',import.meta.url);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const page=await context.newPage(),cdp=await context.newCDPSession(page),errors=[],failed=[],checks=[],base=process.env.BASE_URL||'http://localhost:5317/';
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
async function shot(name){await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:fileURLToPath(new URL(name+'.png',out))})}
async function current(){return page.locator('.my-apps .application-tile').evaluateAll(es=>es.map(e=>e.dataset.appId))}
async function finger(type,x,y){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{x,y,radiusX:5,radiusY:5,force:1}]})}
async function noSelected(){const selected=await current(),available=await page.locator('.application-catalog .application-tile').evaluateAll(es=>es.map(e=>e.dataset.appId));assert.ok(available.every(id=>!selected.includes(id)),'selected entries excluded from lower catalog')}
try{
 for(const [module,removable,newId] of [['workbench','travel','expense'],['portal','system-oa','system-hr']]){
  await page.goto(base+'#/apps?module='+module+'&origin='+ (module==='portal'?'portal-leader':'workbench'));await page.getByRole('button',{name:'编辑',exact:true}).waitFor();await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('.applications-nav').evaluate(e=>getComputedStyle(e).backgroundColor),'rgba(0, 0, 0, 0)');
  assert.equal(await page.locator('.applications-page .application-main img').count(),0);assert.equal(await page.locator('.applications-page .pc-app-icon').evaluateAll(es=>es.every(e=>e.querySelector('svg')&&!e.querySelector('image'))),true);
  const metrics=await page.locator('.my-apps .application-main').first().evaluate(e=>{const icon=e.querySelector('.pc-app-icon'),label=e.querySelector(':scope>span:not(.pc-app-icon)'),i=getComputedStyle(icon),t=getComputedStyle(label);return {width:i.width,height:i.height,radius:i.borderRadius,size:t.fontSize,line:t.lineHeight,color:t.color}});assert.deepEqual(metrics,{width:module==='portal'?'32px':'34px',height:module==='portal'?'32px':'34px',radius:module==='portal'?'50%':'8px',size:'13px',line:'20px',color:'rgb(78, 89, 105)'});await shot(module+'-default');await page.getByRole('button',{name:'编辑',exact:true}).click();await noSelected();assert.equal(await page.getByRole('button',{name:'前移',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'后移',exact:true}).count(),0);
  const initial=await current();const removeButton=page.locator('.my-apps [data-app-id="'+removable+'"] .application-edit-control');await removeButton.click();assert.equal(await page.locator('.application-catalog [data-app-id="'+removable+'"]').count(),1);await page.locator('.application-catalog [data-app-id="'+removable+'"] .application-main').click();assert.equal(await page.locator('.application-catalog [data-app-id="'+removable+'"]').count(),0);await noSelected();
  await page.getByRole('button',{name:'取消编辑',exact:true}).click();assert.deepEqual(await current(),initial);await page.getByRole('button',{name:'编辑',exact:true}).click();
  await page.locator('.applications-scroll').evaluate(e=>e.scrollTop=0);const a=await page.locator('.my-apps .application-main').nth(0).boundingBox(),b=await page.locator('.my-apps .application-main').nth(3).boundingBox();
  const start={x:a.x+a.width/2,y:a.y+a.height/2},end={x:b.x+b.width/2,y:b.y+b.height/2};
  await finger('touchStart',start.x,start.y);for(let i=1;i<=10;i++){await finger('touchMove',start.x+(end.x-start.x)*i/10,start.y+(end.y-start.y)*i/10);await page.waitForTimeout(20)}
  assert.equal(await page.locator('.application-drag-preview').count(),1,'finger-following preview: '+JSON.stringify(await current()));await shot(module+'-finger-drag');await finger('touchEnd');assert.equal(await page.locator('.application-drag-preview').count(),0);assert.equal((await current())[3],initial[0],'actual touch reorder across columns');
  await page.locator('.application-catalog [data-app-id="'+newId+'"] .application-main').click();await noSelected();await page.getByRole('button',{name:'保存',exact:true}).click();const saved=await current();await page.reload();await page.getByRole('button',{name:'编辑',exact:true}).waitFor();assert.deepEqual(await current(),saved);await page.getByRole('button',{name:'编辑',exact:true}).click();await noSelected();
  await page.getByRole('status').waitFor({state:'detached'});await page.locator('.applications-scroll').evaluate(e=>e.scrollTop=0);await page.waitForTimeout(1050);await shot(module+'-editing');
  const badges=await page.locator('.application-edit-control').evaluateAll(es=>es.map(e=>{const hit=e.getBoundingClientRect(),badge=e.firstElementChild.getBoundingClientRect(),icon=e.parentElement.querySelector('.pc-app-icon').getBoundingClientRect();return {hit:hit.toJSON(),badge:badge.toJSON(),icon:icon.toJSON(),color:getComputedStyle(e.firstElementChild).backgroundColor,remove:e.classList.contains('remove')}}));
  assert.ok(badges.every(e=>e.hit.width>=43.5&&e.hit.height>=43.5));assert.ok(badges.every(e=>Math.abs(e.badge.right-e.icon.right-7)<1&&Math.abs(e.badge.top-e.icon.top+6)<1),'PC badge alignment relative to artwork');assert.ok(badges.every(e=>e.color===(e.remove?'rgb(244, 82, 102)':'rgb(255, 107, 61)')));
  checks.push(module+': hidden selected library, remove/add return, cancel, actual touch drag, save/reload, PC SVG icons and badge alignment');
 }
 // Use the full app catalog so scrolling exists even in the tallest tested viewport.
 await page.goto(base+'#/apps?module=workbench&origin=workbench');await page.getByRole('button',{name:'编辑',exact:true}).waitFor();
 for(const width of [320,375,430,1440]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(100);const scroll=page.locator('.applications-scroll');
  const before=await scroll.evaluate(e=>({client:e.clientWidth,offset:e.offsetWidth,rect:e.getBoundingClientRect().toJSON(),style:getComputedStyle(e).scrollbarWidth,gutter:getComputedStyle(e).scrollbarGutter}));assert.equal(before.client,before.offset);assert.equal(before.style,'none');assert.equal(before.gutter,'auto');
  await scroll.evaluate(e=>e.scrollTop=0);await page.waitForTimeout(1050);assert.equal(await page.locator('.app-scrollbar-thumb.is-scrolling').count(),0,'hidden while idle');
  await scroll.evaluate(e=>e.scrollTop=140);await page.locator('.app-scrollbar-thumb.is-scrolling[data-axis=vertical]').first().waitFor();const bars=await page.locator('.app-scrollbar-thumb.is-scrolling').evaluateAll(es=>es.map(e=>({r:e.getBoundingClientRect().toJSON(),position:getComputedStyle(e).position,events:getComputedStyle(e).pointerEvents})));assert.ok(bars.every(e=>e.r.width===3&&e.position==='fixed'&&e.events==='none'));assert.equal(await scroll.evaluate(e=>e.clientWidth),before.client);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await shot('scrolling-'+width);await page.waitForTimeout(1050);assert.equal(await page.locator('.app-scrollbar-thumb.is-scrolling').count(),0);
 }
 checks.push('320/375/430/1440: native scrollbar hidden, gutter zero, 3px floating indicators only while scrolling, no layout change or horizontal overflow');
 await page.setViewportSize({width:375,height:812});
 for(const [route,selector] of [['workbench','.device-scroll'],['mobile-spec','.device-scroll'],['im-members?group=original&name=业务沟通组','.im2-body'],['schedule-new','.schedule-editor-body']]){
  await page.goto(base+'#/'+route);await page.locator(selector).waitFor();await page.waitForLoadState('networkidle');const rules=await page.locator(selector).first().evaluate(e=>({width:getComputedStyle(e).scrollbarWidth,gutter:getComputedStyle(e).scrollbarGutter}));assert.deepEqual(rules,{width:'none',gutter:'auto'});await page.locator(selector).first().evaluate(e=>e.scrollTop=180);await page.waitForTimeout(50);await shot('global-'+route.split('?')[0]);
 }
 const duplicates=await page.locator('[id]').evaluateAll(es=>es.map(e=>e.id).filter((id,i,ids)=>ids.indexOf(id)!==i));assert.deepEqual(duplicates,[]);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);checks.push('global workbench, specification, IM and schedule scrolling regression; no console or HTTP errors');
 const report={result:'passed',checks,errors,failed};await fs.writeFile(new URL('report.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
