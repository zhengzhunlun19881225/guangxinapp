import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[],failed=[],checks=[];
const output=new URL('../output/playwright/investment-filters/',import.meta.url);await fs.mkdir(output,{recursive:true});
page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)failed.push(response.url())});
const open=()=>page.getByRole('button',{name:'项目投资筛选',exact:true}).click();
const apply=()=>page.getByRole('button',{name:'应用筛选',exact:true}).click();
const close=()=>page.getByRole('button',{name:'关闭弹窗',exact:true}).click();
async function shot(name,locator=page){await page.waitForTimeout(220);await locator.screenshot({path:fileURLToPath(new URL(name+'.png',output))})}
try{
 await page.goto((process.env.BASE_URL||'http://localhost:5317/')+'#/portal-overview');await page.locator('[data-node-id="0:6203"]').waitFor();await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
 const card=page.locator('.project-investments');assert.equal(await card.locator('select').count(),0);assert.equal(await card.locator('tbody tr').count(),5);
 await page.locator('.device-scroll').evaluate(el=>el.scrollTop=1270);await shot('card-final',card);
 await open();assert.equal(await page.getByRole('dialog').locator('select').count(),4);await shot('sheet-final',page.getByRole('dialog'));
 await page.getByLabel('投资阶段',{exact:true}).selectOption('投后管理');assert.equal(await card.locator('tbody tr').count(),5);await close();await open();assert.equal(await page.getByLabel('投资阶段',{exact:true}).inputValue(),'');
 await page.getByLabel('投资阶段',{exact:true}).selectOption('投后管理');await apply();assert.equal(await card.locator('tbody tr').count(),1);assert.equal(await page.getByRole('button',{name:'项目投资筛选',exact:true}).getAttribute('aria-pressed'),'true');
 await open();assert.equal(await page.getByLabel('投资阶段',{exact:true}).inputValue(),'投后管理');await page.getByLabel('项目类型',{exact:true}).selectOption('新能源');await page.keyboard.press('Escape');
 assert.equal(await page.getByRole('button',{name:'项目投资筛选',exact:true}).evaluate(el=>el===document.activeElement),true);assert.equal(await card.locator('tbody tr').count(),1);
 await open();await page.getByLabel('项目类型',{exact:true}).selectOption('新能源');await apply();await page.getByRole('status').filter({hasText:'暂无符合条件的项目'}).waitFor();
 await page.getByRole('button',{name:'重置筛选',exact:true}).click();assert.equal(await card.locator('tbody tr').count(),5);
 await open();await page.getByLabel('所属企业',{exact:true}).selectOption('深圳某某创新研究院');await apply();assert.equal(await card.locator('tbody tr').count(),1);
 await open();await page.getByRole('button',{name:'重置',exact:true}).click();assert.equal(await page.getByLabel('所属企业',{exact:true}).inputValue(),'');assert.equal(await page.getByLabel('投资月份',{exact:true}).inputValue(),'2026-09');await apply();assert.equal(await card.locator('tbody tr').count(),5);
 checks.push('four hidden fields in header-triggered modal; draft, close, apply, reopen, Escape focus restoration; combined empty result and reset; company filter and form reset');
 for(const label of ['集团合并筛选','二级公司纳税情况筛选','各省份年度累计实缴税金筛选']){await page.getByRole('button',{name:label,exact:true}).click();assert.equal(await page.locator('.filter-options select').count(),2);await close()}
 const widths=[320,375,430,768,1440];
 for(const width of widths){
  await page.setViewportSize({width,height:900});await page.locator('.device-scroll').evaluate(el=>el.scrollTop=1270);await page.waitForTimeout(100);
  const buttons=await page.locator('.portal-filter-button,.investment-filter-button').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect(),s=getComputedStyle(node),icon=getComputedStyle(node.querySelector('.portal-filter-icon'));return {width:r.width,height:r.height,iconWidth:icon.width,iconHeight:icon.height,text:node.innerText,border:s.borderWidth,background:s.backgroundColor}}));
  assert.equal(buttons.length,4);for(const b of buttons){assert.ok(b.width>=43.5&&b.height>=43.5);assert.ok(Math.abs(parseFloat(b.iconWidth)-16)<.1);assert.ok(Math.abs(parseFloat(b.iconHeight)-16)<.1);assert.equal(b.text,'');assert.equal(b.border,'0px');assert.equal(b.background,'rgba(0, 0, 0, 0)')}
  const gap=await card.evaluate(el=>document.querySelector('[data-node-id="0:6484"]').getBoundingClientRect().top-el.getBoundingClientRect().bottom);assert.ok(gap>=8,'following module should keep 10px design gap');
  await open();const overflow=await page.getByRole('dialog').evaluate(el=>el.querySelector('.modal-body').scrollWidth>el.querySelector('.modal-body').clientWidth+1);assert.equal(overflow,false);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await shot('sheet-'+width,page.getByRole('dialog'));await close();
 }
 checks.push('all four filter icons 16px, no text/border/background, 44px actual targets; original three entry flows preserved; 320/375/430/768/1440 dialog and module spacing');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);const report={result:'passed',checks,widths,errors,failed};await fs.writeFile(new URL('report.json',output),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
