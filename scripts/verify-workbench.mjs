import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=new URL('../output/playwright/workbench-update/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status())});
const base=process.env.BASE_URL||'http://127.0.0.1:5317/';
try {
  await page.goto(base+'#/workbench');
  await page.locator('.work-recent-forms').waitFor();
  await page.waitForLoadState('networkidle');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:fileURLToPath(new URL('top-375.png',output))});
  assert.equal(await page.locator('.work-recent-forms .recent-form-entry').count(),5);
  assert.equal(await page.locator('[data-node-id="0:7030"],[data-node-id="0:7147"],[data-node-id="0:7193"]').count(),0);
  assert.doesNotMatch(await page.locator('.route-workbench').innerText(),/集团邮箱|AI每日简报|AI智能提醒/);
  const bounds=await page.evaluate(()=>['.work-todo','.work-recent-forms','.work-calendar'].map(selector=>{
    const el=document.querySelector(selector),r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width};
  }));
  assert.equal(bounds[1].width,355);
  assert.ok(bounds[0].bottom<bounds[1].top&&bounds[1].bottom<bounds[2].top,'workbench cards must not overlap');
  await page.locator('.device-scroll').evaluate(el=>el.scrollTop=660);
  await page.screenshot({path:fileURLToPath(new URL('forms-calendar-375.png',output))});
  await page.locator('.work-recent-forms').screenshot({path:fileURLToPath(new URL('recent-forms-375.png',output))});
  const columns=await page.locator('.work-recent-forms .recent-form-entry').evaluateAll(es=>es.map(e=>({left:e.getBoundingClientRect().left,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
  assert.ok(columns.every(b=>Math.abs(b.left-columns[0].left)<1&&Math.abs(b.width-columns[0].width)<1&&b.height>=44),'one full-width column with 44px rows');
  const names=await page.locator('.work-recent-forms .recent-form-entry').evaluateAll(buttons=>buttons.map(b=>b.title));
  for (const name of names) {
    await page.locator('.work-recent-forms').getByRole('button',{name,exact:true}).click();
    await page.getByRole('dialog').waitFor();
    assert.equal(await page.locator('#modal-title').innerText(),name);
    assert.ok(await page.locator('.modal-recent-form input[required]').count()>=3);
    await page.getByRole('button',{name:'关闭弹窗',exact:true}).click();
  }
  await page.locator('.work-recent-forms').getByRole('button',{name:'更多 ›',exact:true}).click();
  assert.equal(await page.locator('.recent-forms-list .recent-form-entry').count(),10,'More retains all ten entries');
  await page.locator('.recent-forms-list input').fill('用车');
  assert.equal(await page.locator('.recent-forms-list .recent-form-entry').count(),2);
  await page.locator('.recent-forms-list input').fill('不存在');
  await page.getByText('未找到相关表单',{exact:true}).waitFor();
  await page.locator('.recent-forms-list input').fill('数据测试');
  await page.locator('.recent-forms-list .recent-form-entry').click();
  for(const [label,value] of Object.entries({'填报人':'张三','所属部门':'综合管理部','统计月份':'2026-11','填报说明':'十一月业务数据汇总'})) {
    await page.getByLabel(label,{exact:true}).fill(value);
  }
  await page.getByRole('button',{name:'保存表单',exact:true}).click();
  await page.getByRole('status').filter({hasText:'表单已保存'}).waitFor();
  await page.reload();
  await page.locator('.work-recent-forms').getByRole('button',{name:'数据测试',exact:true}).click();
  assert.equal(await page.getByLabel('填报人',{exact:true}).inputValue(),'张三');
  await page.screenshot({path:fileURLToPath(new URL('saved-form-375.png',output))});
  await page.getByRole('button',{name:'关闭弹窗',exact:true}).click();
  const responsive=[];
  for(const width of [320,375,430,1440]){
    await page.setViewportSize({width,height:900});
    await page.locator('.device-scroll').evaluate(el=>el.scrollTop=660);
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow at '+width);
    const clipped=await page.evaluate(()=>{
      const card=document.querySelector('.work-recent-forms').getBoundingClientRect();
      return [...document.querySelectorAll('.work-recent-forms .recent-form-entry')].some(el=>{
        const r=el.getBoundingClientRect();return r.left<card.left||r.right>card.right;
      });
    });
    assert.equal(clipped,false,'clipped form button at '+width);
    await page.screenshot({path:fileURLToPath(new URL('responsive-'+width+'.png',output))});
    responsive.push(width);
  }
  const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));
  assert.deepEqual(broken,[]);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  const report={result:'passed',forms:names.length,removed:['集团邮箱','AI每日简报','AI智能提醒'],responsive,checks:['card order and spacing','single column, max five home entries, all ten in More','search and empty state','save and reload persistence','no horizontal overflow or broken images','no browser errors']};
  await fs.writeFile(new URL('report.json',output),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} finally {await browser.close()}
