import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const pages=JSON.parse(await fs.readFile(new URL('../src/manifest.json',import.meta.url),'utf8'));
const output=new URL('../output/playwright/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[],failed=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status())});
const base=process.env.BASE_URL||'http://127.0.0.1:5317/';
try{
 for(const p of pages){
  await page.goto(base+'#/'+p.route);await page.locator('.route-'+p.route).waitFor();
  await page.locator('.scene-layer [data-node-id="'+p.nodeId+'"]').first().waitFor();
  await page.waitForLoadState('networkidle');
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>Promise.all(Array.from(document.images).filter(i=>i.complete||i.loading!=='lazy').map(i=>i.decode().catch(()=>null))));
  await page.screenshot({path:fileURLToPath(new URL(p.route+'-375.png',output))});
  const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>(i.complete&&i.naturalWidth===0)||(!i.complete&&i.loading!=='lazy')).map(i=>i.src));
  assert.deepEqual(broken,[],p.route+' has broken images');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,p.route+' horizontal overflow');
  if(p.height>900){await page.locator('.device-scroll').evaluate(el=>el.scrollTop=650);await page.screenshot({path:fileURLToPath(new URL(p.route+'-scroll-375.png',output))})}
  results.push('render '+p.route);
 }
 // Check the actual rendered roles at the approved 375px design width.
 async function typography(selector,expected){
  const actual=await page.locator(selector).first().evaluate(el=>{
   const s=getComputedStyle(el);return [s.fontSize,s.lineHeight,s.fontWeight,s.color];
  });
  assert.deepEqual(actual,expected,'mobile specification: '+selector);
 }
 await page.goto(base+'#/im');await page.locator('.conversation-row').first().waitFor();
 assert.equal(await page.locator('.artboard').evaluate(el=>el.getBoundingClientRect().width),375);
 await typography('.conversation-info strong',['16px','24px','400','rgb(3, 9, 27)']);
 await typography('.conversation-info>span',['12px','18px','400','rgb(78, 89, 105)']);
 await typography('.conversation-row time',['12px','18px','400','rgb(135, 139, 153)']);
 await typography('.badge',['10px','14px','400','rgb(255, 255, 255)']);
 assert.equal(await page.locator('.badge').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 0, 0)');
 assert.equal(await page.locator('.bottom-nav>button[aria-current] .nav-icon').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 0, 0)');
 await page.goto(base+'#/workbench');await page.locator('.work-todo h2').waitFor();
 await typography('.work-todo h2',['16px','24px','500','rgb(3, 9, 27)']);
 await typography('.todo-row strong',['14px','22px','400','rgb(3, 9, 27)']);
 await page.locator('[data-node-id="0:7081"]').waitFor();
 await typography('[data-node-id="0:7081"]',['18px','26px','400','rgb(3, 9, 27)']);
 await typography('[data-node-id="0:6734"]',['13px','20px','400','rgb(78, 89, 105)']);
 results.push('375px baseline; approved page/module/list/body/function/helper/badge typography and colors');
 await page.goto(base+'#/skills');await page.getByRole('textbox',{name:'搜索',exact:true}).fill('合同');
 assert.equal(await page.locator('.directory-row').count(),1);await page.locator('.directory-row').click();
 await page.getByRole('button',{name:'使用合同审查',exact:true}).click();assert.match(page.url(),/#\/chat/);
 await page.getByRole('textbox',{name:'请输入您的问题',exact:true}).fill('检查合同付款条款');
 await page.getByRole('button',{name:'发送消息',exact:true}).click();assert.equal(await page.locator('.ai-messages .message').count(),2);
 await page.getByRole('button',{name:'打开历史记录',exact:true}).click();
 await page.locator('.history-search-row input').fill('检查合同');assert.equal(await page.locator('.history-rows>button').count(),1);
 await page.getByRole('button',{name:'新建对话',exact:true}).click();assert.equal(await page.locator('.ai-messages').count(),0);
 results.push('skills search, agent selection, AI messaging, persisted history, new conversation');
 await page.goto(base+'#/im');await page.locator('.conversation-row').first().click();
 await page.getByRole('textbox',{name:'消息内容',exact:true}).fill('收到，谢谢');await page.getByRole('button',{name:'发送消息',exact:true}).click();
 assert.match(await page.locator('.im2-messages').innerText(),/收到，谢谢/);await page.getByRole('button',{name:'返回',exact:true}).click();
 results.push('IM local send');
 await page.goto(base+'#/workbench');
 await page.getByRole('button',{name:'切换门户角色',exact:true}).click();await page.getByRole('button',{name:/员工门户/}).click();
 assert.match(page.url(),/#\/portal-staff/);await page.getByRole('button',{name:'我的',exact:true}).click();
 await page.getByRole('button',{name:/全部画布/}).click();await page.locator('.canvas-index>a').first().waitFor();assert.equal(await page.locator('.canvas-index>a').count(),11);
 results.push('role switching, bottom navigation, all 11 canvas links');
 await page.goto(base+'#/portal-overview');await page.locator('[data-node-id="0:6203"]').waitFor();
 const originalMetric=await page.locator('[data-node-id="0:6203"]').innerText();
 await page.getByRole('button',{name:'二级公司纳税情况筛选',exact:true}).click();
 await page.locator('.filter-options select').last().selectOption('2025年');
 await page.getByRole('button',{name:'应用筛选',exact:true}).click();
 assert.notEqual(await page.locator('[data-node-id="0:6203"]').innerText(),originalMetric);
 await page.locator('.device-scroll').evaluate(el=>el.scrollTop=650);
 await page.getByRole('button',{name:'放大税金地图',exact:true}).click();
 assert.match(await page.locator('[data-node-id="0:6351"]').getAttribute('style')||await page.locator('[data-node-id="0:6351"]').evaluate(el=>getComputedStyle(el).transform),/1.2/);
 results.push('enterprise/year filter updates metrics; map zoom changes map transform');
 await page.goto(base+'#/workbench');await page.locator('.todo-row').first().click();
 await page.getByRole('button',{name:'同意',exact:true}).click();assert.equal(await page.locator('.todo-row').count(),3);
 await page.getByRole('button',{name:'已办',exact:true}).click();assert.equal(await page.locator('.todo-row').count(),3);
 assert.equal(await page.locator('.todo-row em').first().evaluate(el=>getComputedStyle(el).color),'rgb(0, 181, 120)');
 await page.locator('[data-node-id="0:6734"]').click();
 const form=page.locator('.demo-form');await form.locator('input').nth(0).fill('张嘉嘉');
 await form.locator('input[type=date]').nth(0).fill('2026-11-08');
 await form.locator('input[type=date]').nth(1).fill('2026-11-09');
 await form.locator('textarea').fill('前往广州参加业务会议');
 await page.getByRole('button',{name:'提交申请',exact:true}).click();
 await page.getByRole('button',{name:'我的',exact:true}).click();
 await page.getByRole('button',{name:/我的申请/}).click();
 assert.match(await page.locator('.modal-body').innerText(),/前往广州参加业务会议/);
 await page.getByRole('button',{name:'关闭弹窗',exact:true}).click();
 results.push('approval state persists; travel form saves to application records');
 for(const width of [320,390,430,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base+'#/workbench');
  await page.locator('.route-workbench [data-node-id="0:6655"]').waitFor();await page.waitForLoadState('networkidle');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'overflow '+width);
  const box=await page.locator('.bottom-nav').boundingBox();assert(box.x>=-1&&box.x+box.width<=width+1,'navigation bounds '+width);
  await page.screenshot({path:fileURLToPath(new URL('workbench-'+width+'.png',output))});
 }
 results.push('responsive 320, 390, 430, 768, 1440');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 await fs.writeFile(new URL('verification.json',output),JSON.stringify({results,errors,failed},null,2));
 console.log(JSON.stringify({results,errors,failed},null,2));
}finally{await browser.close()}
