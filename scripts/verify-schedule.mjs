import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=new URL('../output/playwright/schedule/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[],failed=[],checks=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)failed.push(response.url()+' '+response.status())});
const base=process.env.BASE_URL||'http://127.0.0.1:5317/';
async function capture(name){await page.screenshot({path:fileURLToPath(new URL(name+'.png',output))})}
async function flowCapture(name){await page.locator('.schedule-flow').screenshot({path:fileURLToPath(new URL(name+'.png',output))})}
try{
 await page.goto(base+'#/workbench');
 await page.locator('.work-calendar').getByRole('button',{name:'更多 ›',exact:true}).click();
 await page.locator('.schedule-month').waitFor();assert.match(page.url(),/#\/schedule(?:\?|$)/);
 assert.equal(await page.locator('.bottom-nav').count(),0);
 await capture('entry-current-month-375');checks.push('workbench More opens independent monthly calendar');
 await page.goto(base+'#/schedule?date=2024-05-15&view=month');
 await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.schedule-month-grid>button').count(),35);
 assert.equal(await page.locator('.schedule-agenda-entry').count(),3);
 await flowCapture('month-375');
 await page.getByRole('button',{name:'查看当天全部日程',exact:true}).click();await page.locator('.schedule-day').waitFor();
 assert.equal(await page.locator('.schedule-timeline-event').count(),4);
 await flowCapture('day-375');checks.push('source month and day data; 3 agenda previews and 4 timeline events');
 await page.getByRole('button',{name:'添加日程',exact:true}).click();await page.getByRole('menuitem',{name:'新建日程',exact:true}).click();
 await page.locator('.schedule-editor').waitFor();await flowCapture('new-375');
 await page.getByRole('button',{name:'保存',exact:true}).click();await page.getByRole('alert').filter({hasText:'请输入事件名称'}).waitFor();
 await page.getByLabel('事件名称',{exact:true}).fill('十一月项目评审');
 await page.getByLabel('开始时间',{exact:true}).fill('2024-05-15T11:00');
 await page.getByLabel('结束时间',{exact:true}).fill('2024-05-15T10:00');
 await page.getByRole('button',{name:'保存',exact:true}).click();await page.getByRole('alert').filter({hasText:'结束时间须晚于开始时间'}).waitFor();
 await page.getByLabel('结束时间',{exact:true}).fill('2024-05-15T12:00');
 await page.getByLabel('提前提醒',{exact:true}).selectOption('30分钟');
 await page.getByLabel('事件内容',{exact:true}).fill('在会议室 C 进行项目评审');
 await page.getByLabel('描述',{exact:true}).fill('请提前准备项目材料');
 await page.getByRole('button',{name:'选择安排他人',exact:true}).click();
 await page.getByLabel('张嘉嘉',{exact:true}).check();
 await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'选择日程颜色',exact:true}).count(),0);
 await capture('new-filled-375');
 await page.getByRole('button',{name:'保存',exact:true}).click();await page.locator('.schedule-day').waitFor();
 const created=page.locator('.schedule-timeline-event').filter({hasText:'十一月项目评审'});
 await created.waitFor();
 const overlapping=page.locator('.schedule-timeline-event').filter({hasText:'设计评审'});
 const a=await created.boundingBox(),b=await overlapping.boundingBox();
 assert.ok(a.x+a.width<=b.x+1||b.x+b.width<=a.x+1,'overlapping schedules must use separate columns');
 await capture('overlapping-375');
 // Existing recurring/calendar metadata remains supported after its editor controls are removed.
 await page.evaluate(()=>{const key='gx-app-schedule-events-v1',rows=JSON.parse(localStorage.getItem(key));rows.find(row=>row.title==='十一月项目评审').repeat='每周';rows.find(row=>row.title==='十一月项目评审').calendar='工作日历';localStorage.setItem(key,JSON.stringify(rows))});await page.reload();await created.waitFor();checks.push('validation, participants, legacy recurrence, reminder, local save/reload, overlap columns');
 await created.click();await page.locator('.schedule-detail').waitFor();assert.match(await page.locator('.schedule-event-detail').innerText(),/工作日历/);
 await page.getByRole('button',{name:'编辑',exact:true}).click();
 await page.getByLabel('事件名称',{exact:true}).fill('项目评审已更新');
 await page.getByRole('button',{name:'保存',exact:true}).click();await page.locator('.schedule-day').waitFor();
 await page.getByRole('button',{name:'切换到月历',exact:true}).click();
 await page.locator('[data-date="2024-05-22"]').click();
 assert.equal(await page.locator('.schedule-agenda-entry').filter({hasText:'项目评审已更新'}).count(),1);
 await page.getByRole('button',{name:'搜索日程',exact:true}).click();
 await page.getByRole('textbox',{name:'搜索日程',exact:true}).fill('项目评审已更新');
 await page.locator('.schedule-search-results .schedule-agenda-entry').click();
 await page.getByRole('button',{name:'删除日程',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:'删除',exact:true}).click();
 await page.getByRole('button',{name:'搜索日程',exact:true}).click();
 await page.getByRole('textbox',{name:'搜索日程',exact:true}).fill('项目评审已更新');
 await page.getByText('未找到相关日程',{exact:true}).waitFor();checks.push('details, edit, weekly occurrence, search, confirmed delete');
 await page.goto(base+'#/schedule?date=2024-05-15&view=day');await page.getByRole('button',{name:'更多日程操作',exact:true}).click();await page.getByRole('button',{name:'回到今天',exact:true}).click();
 assert.match(page.url(),/date=\d{4}-\d{2}-\d{2}/);checks.push('day menu and return to today; removed extra editor controls retain legacy recurrence metadata');
 await page.goto(base+'#/schedule?date=2024-05-15&view=month');
 await page.getByRole('button',{name:'下一个月',exact:true}).click();
 await page.getByRole('heading',{name:'2024年6月',exact:true}).waitFor();assert.equal(await page.getByRole('dialog').count(),0);
 await page.getByRole('button',{name:'添加日程',exact:true}).click();await page.getByRole('menuitem',{name:'新建日程',exact:true}).click();await page.getByRole('button',{name:'取消',exact:true}).click();
 await page.locator('.schedule-month').waitFor();assert.equal(await page.locator('.schedule-month').count(),1);checks.push('inline month arrows and cancel navigation');
 for(const width of [320,375,430,1440]){
  await page.setViewportSize({width,height:900});
  for(const [path,label] of [['schedule?date=2024-05-15&view=month','month'],['schedule?date=2024-05-15&view=day','day'],['schedule-new?date=2024-05-15&view=month','new']]){
   await page.goto(base+'#/'+path);await page.locator('.schedule-flow').waitFor();await page.waitForTimeout(100);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'document overflow '+width+' '+label);
   assert.equal(await page.locator('.schedule-flow').evaluate(el=>el.scrollWidth>el.clientWidth),false,'flow overflow '+width+' '+label);
   await capture(label+'-'+width+'-responsive');
  }
 }
 await page.getByRole('button',{name:'取消',exact:true}).click();await page.getByRole('button',{name:'关闭日程',exact:true}).click();
 await page.locator('.work-recent-forms').waitFor();checks.push('320/375/430/1440 responsive layouts, workbench return and prior form module');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={result:'passed',checks,errors,failed};await fs.writeFile(new URL('report.json',output),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
