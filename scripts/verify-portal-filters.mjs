import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=new URL('../output/playwright/portal-filters/',import.meta.url);await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});const base=process.env.BASE_URL||'http://localhost:5317/';const errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status())});
async function shot(name){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.querySelectorAll('.modal-sheet')).flatMap(e=>e.getAnimations()).map(a=>a.finished.catch(()=>null)));await Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>null)));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});await page.screenshot({path:fileURLToPath(new URL(name+'.png',output))})}
try{
 await page.goto(base+'#/portal-overview');await page.locator('[data-node-id="0:6203"]').waitFor();await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('.portal-filter-button').count(),3);assert.equal(await page.locator('[data-node-id="0:6260"],[data-node-id="0:6283"],[data-node-id="0:6357"]').count(),0);
 await shot('overview-375');const original=await page.locator('[data-node-id="0:6203"]').innerText();
 const names=['集团合并','二级公司纳税情况','各省份年度累计实缴税金'];
 for(const name of names){
  await page.getByRole('button',{name:name+'筛选',exact:true}).click();await page.getByRole('dialog',{name,exact:true}).waitFor();
  assert.equal(await page.locator('.filter-options select').count(),2);await shot(name==='集团合并'?'sheet-default-375':'sheet-'+name+'-375');
  await page.getByLabel('企业',{exact:true}).selectOption('广新集团');await page.getByLabel('年份',{exact:true}).selectOption('2024年');
  assert.equal(await page.locator('[data-node-id="0:6203"]').innerText(),original,'draft must not apply');
  await page.getByRole('button',{name:'关闭弹窗',exact:true}).click();
  await page.getByRole('button',{name:name+'筛选',exact:true}).click();assert.equal(await page.getByLabel('企业',{exact:true}).inputValue(),'全部企业');assert.equal(await page.getByLabel('年份',{exact:true}).inputValue(),'2026年');await page.keyboard.press('Escape');
 }
 checks.push('three filter buttons replace all inline enterprise/year dropdowns; each opens the two-field bottom sheet');checks.push('draft selection and close/Escape preserve applied values');
 await page.getByRole('button',{name:'集团合并筛选',exact:true}).click();await page.getByLabel('企业',{exact:true}).selectOption('广新集团');await page.getByLabel('年份',{exact:true}).selectOption('2025年');await page.getByRole('button',{name:'应用筛选',exact:true}).click();await page.getByRole('dialog').waitFor({state:'detached'});assert.notEqual(await page.locator('[data-node-id="0:6203"]').innerText(),original);assert.equal(await page.locator('.portal-filter-button[aria-pressed=true]').count(),3);
 await page.getByRole('button',{name:'二级公司纳税情况筛选',exact:true}).click();assert.equal(await page.getByLabel('企业',{exact:true}).inputValue(),'广新集团');assert.equal(await page.getByLabel('年份',{exact:true}).inputValue(),'2025年');await page.getByRole('button',{name:'关闭弹窗',exact:true}).click();checks.push('apply updates existing metric calculation and all entry points reopen with applied values');
 await page.getByRole('button',{name:'各省份年度累计实缴税金筛选',exact:true}).click();await page.getByLabel('企业',{exact:true}).selectOption('全部企业');await page.getByLabel('年份',{exact:true}).selectOption('2026年');await page.getByRole('button',{name:'应用筛选',exact:true}).click();assert.equal(await page.locator('[data-node-id="0:6203"]').innerText(),original);
 await page.locator('.device-scroll').evaluate(e=>e.scrollTop=650);await shot('map-375');await page.getByRole('button',{name:'放大税金地图',exact:true}).click();assert.match(await page.locator('[data-node-id="0:6351"]').evaluate(e=>getComputedStyle(e).transform),/1.2/);checks.push('reset via default selection and original map zoom preserved');
 for(const width of [320,375,430,1440]){
  await page.setViewportSize({width,height:900});await page.locator('.device-scroll').evaluate(e=>e.scrollTop=0);await page.waitForTimeout(120);
  const boxes=await page.locator('.portal-filter-button').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));assert.ok(boxes.every(r=>r.width>=43.5&&r.height>=43.5),'actual 44px buttons at '+width);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.getByRole('button',{name:'集团合并筛选',exact:true}).click();const box=await page.getByRole('dialog').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+.5);await shot('sheet-'+width);await page.keyboard.press('Escape');
 }
 checks.push('320/375/430/1440 responsive sheet and actual 44px filter button targets');assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);const report={result:'passed',checks,errors,failed};await fs.writeFile(new URL('report.json',output),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
