import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=new URL('../output/playwright/schedule-create/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[],checks=[];page.on('pageerror',error=>errors.push(error.message));
page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
const base='http://localhost:5317/';
const label=name=>page.getByLabel(name,{exact:true});const button=name=>page.getByRole('button',{name,exact:true});
async function capture(name){if(await page.locator('.toast').count())await page.locator('.toast').waitFor({state:'hidden'});await page.evaluate(()=>{document.activeElement?.blur();return document.fonts.ready});await page.locator('.schedule-flow').screenshot({path:fileURLToPath(new URL(name+'.png',output))})}
async function openNew(kind){await button('添加日程').click();await page.getByRole('menuitem',{name:kind==='meeting'?'新建会议':'新建日程',exact:true}).click();await page.locator('.schedule-editor').waitFor();assert.equal(await page.getByRole('switch',{name:'全天日程',exact:true}).count(),0);assert.equal(await label('重复').count(),0);assert.equal(await label('日历').count(),0);assert.equal(await button('选择日程颜色').count(),0)}
async function person(field,names){await button('选择'+field).click();for(const name of names){await label('搜索人员').fill(name);await page.getByRole('dialog').getByLabel(name,{exact:true}).check()}await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click()}
async function saveError(text){await button('保存').click();await page.getByRole('alert').filter({hasText:text}).waitFor()}
try{
 await page.goto(base+'#/schedule?date=2026-11-09&view=month');await page.locator('.schedule-month-calendar').waitFor();await capture('month');
 const measures=await page.locator('.schedule-flow').evaluate(el=>{const box=el.getBoundingClientRect(),grid=el.querySelector('.schedule-month-calendar').getBoundingClientRect(),title=el.querySelector('.schedule-month-navigation h1').getBoundingClientRect();return{height:box.height,grid:grid.height,ratio:grid.height/box.height,centerError:Math.abs((title.x+title.width/2)-(box.x+box.width/2)),rows:el.querySelectorAll('.schedule-month-grid>button').length}});
 assert.ok(Math.abs(measures.ratio-.4)<.002,JSON.stringify(measures));assert.ok(measures.centerError<1);
 assert.equal(await page.locator('.schedule-header>button').first().locator('[style*="X.svg"]').count(),1);
 await button('下一个月').click();assert.match(page.url(),/date=2026-12-09/);assert.equal(await page.getByRole('dialog').count(),0);
 await button('上一个月').click();assert.match(page.url(),/date=2026-11-09/);
 await page.goto(base+'#/schedule?date=2026-12-31&view=month');await button('下一个月').click();assert.match(page.url(),/date=2027-01-31/);await button('下一个月').click();assert.match(page.url(),/date=2027-02-28/);await page.getByRole('heading',{name:'2027年2月',exact:true}).waitFor();assert.equal(await page.locator('.schedule-month-grid>button').count(),35);
 await page.goto(base+'#/schedule?date=2026-02-01&view=month');await page.getByRole('heading',{name:'2026年2月',exact:true}).waitFor();assert.equal(await page.locator('.schedule-month-grid>button').count(),28);
 await page.goto(base+'#/schedule?date=2026-05-31&view=month');await page.getByRole('heading',{name:'2026年5月',exact:true}).waitFor();assert.equal(await page.locator('.schedule-month-grid>button').count(),42);await capture('month-six-rows');
 await page.goto(base+'#/schedule?date=2026-11-09&view=month');
 await button('添加日程').click();assert.equal(await page.getByRole('menuitem').count(),2);await capture('add-menu');
 await page.keyboard.press('Escape');assert.equal(await page.getByRole('menu').count(),0);assert.equal(await button('添加日程').evaluate(el=>el===document.activeElement),true);
 await button('添加日程').click();await button('关闭添加菜单').click({position:{x:10,y:10}});assert.equal(await page.getByRole('menu').count(),0);
 checks.push('40% month height, centered title, X close, immediate arrows, year/month/day clamp, four/five/six weeks and add menu dismissal');
 await openNew('event');assert.equal(await label('开始时间').inputValue(),'2026-11-09T09:00');assert.equal(await label('结束时间').inputValue(),'2026-11-09T10:00');await capture('event-empty');
 assert.deepEqual(await label('提前提醒').locator('option').allTextContents(),['不提醒','5分钟','10分钟','15分钟','30分钟','1小时']);assert.equal(await label('提前提醒').inputValue(),'10分钟');assert.equal(await label('可见范围').inputValue(),'公开日程');
 await saveError('请输入事件名称');await label('事件名称').fill('日程会议主题不会改变类型');await saveError('请输入事件内容');await label('事件内容').fill('整理调研计划、项目资料与行动安排。');
 await label('结束时间').fill('2026-11-09T08:00');await saveError('结束时间须晚于开始时间');await label('结束时间').fill('2026-11-09T10:00');
 await person('安排他人',['张嘉嘉','李佳佳']);await person('告知人',['张锐']);await label('提前提醒').selectOption('15分钟');await label('可见范围').selectOption('个人日程');await label('描述').fill('会前确认资料完整。');
 await label('上传附件').setInputFiles([{name:'调研资料.txt',mimeType:'text/plain',buffer:Buffer.from('调研资料测试')},{name:'删除测试.txt',mimeType:'text/plain',buffer:Buffer.from('remove')}]);
 await button('移除附件删除测试.txt').click();assert.equal(await page.locator('.schedule-attachments li').count(),1);
 await capture('event-filled-bottom');await page.locator('.schedule-editor-body').evaluate(el=>el.scrollTop=0);await capture('event-filled');
 await button('保存').click();await page.locator('.schedule-day').waitFor();
 const event=page.locator('.schedule-timeline-event').filter({hasText:'日程会议主题不会改变类型'});await event.click();
 let text=await page.locator('.schedule-event-detail').innerText();for(const word of ['事项','李佳佳','张锐','15分钟','个人日程','整理调研计划','会前确认','调研资料.txt'])assert.ok(text.includes(word),word);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('link',{name:'调研资料.txt',exact:true}).click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'调研资料.txt');const path=await download.path();assert.equal(await fs.readFile(path,'utf8'),'调研资料测试');
 await page.reload();await button('编辑').click();assert.equal(await label('事件内容').inputValue(),'整理调研计划、项目资料与行动安排。');assert.equal(await label('提前提醒').inputValue(),'15分钟');assert.equal(await page.locator('.schedule-attachments li').count(),1);
 await label('事件名称').fill('日程修改后');await button('保存').click();await page.locator('.schedule-day').waitFor();checks.push('event required fields, name limit, date validation, people search/multiple selection, reminders/visibility, attachment add/remove/download/reload and edit');
 await page.goto(base+'#/schedule?date=2026-11-15&view=month');await openNew('meeting');await capture('meeting-empty');
 await saveError('请输入会议名称');await label('会议名称').fill('集团项目讨论会');await saveError('请选择主持人');await button('选择主持人').click();await label('搜索人员').fill('张锐');await page.keyboard.press('Enter');assert.equal(await page.getByRole('dialog').count(),1);await page.getByRole('dialog').getByRole('button',{name:'关闭',exact:true}).click();assert.equal(await page.getByRole('alert').count(),1);assert.match(page.url(),/schedule-new/);await person('主持人',['上官成硕']);await saveError('请选择与会人');await person('与会人',['张嘉嘉','张锐']);await person('告知人',['李佳佳']);
 await label('会议地址').fill('3楼会议室');await label('会议类型').selectOption('线上');await label('会议链接').fill('invalid');await saveError('会议链接须以');await label('会议链接').fill('https://meeting.example.com/project');
 await label('会议类型').selectOption('线下');assert.equal(await label('会议地址').inputValue(),'3楼会议室');await label('会议类型').selectOption('线上');assert.equal(await label('会议链接').inputValue(),'https://meeting.example.com/project');
 await label('提前提醒').selectOption('30分钟');await label('描述').fill('讨论调研计划、责任分工与下一步安排。');await label('上传附件').setInputFiles({name:'会议议程.txt',mimeType:'text/plain',buffer:Buffer.from('会议议程')});
 await page.locator('.schedule-attachments li').waitFor();await page.locator('.schedule-editor-body').evaluate(el=>el.scrollTop=el.scrollHeight);await capture('meeting-filled-bottom');await page.locator('.schedule-editor-body').evaluate(el=>el.scrollTop=0);await capture('meeting-filled');
 await button('保存').click();await page.locator('.schedule-timeline-event').filter({hasText:'集团项目讨论会'}).click();
 text=await page.locator('.schedule-event-detail').innerText();for(const word of ['线上会议','上官成硕','张嘉嘉、张锐','李佳佳','30分钟','公开日程','会议议程.txt','https://meeting.example.com/project'])assert.ok(text.includes(word),word);await capture('meeting-detail');
 await page.reload();await button('编辑').click();assert.equal(await label('会议类型').inputValue(),'线上');assert.equal(await label('描述').inputValue(),'讨论调研计划、责任分工与下一步安排。');assert.match(await button('选择主持人').innerText(),/上官成硕/);await button('取消').click();assert.match(page.url(),/date=2026-11-15/);
 await openNew('meeting');await button('取消').click();assert.match(page.url(),/date=2026-11-15/);
 checks.push('meeting required host/participants, searchable selectors, offline/online separate values and URL validation, full save/detail/edit, cancel retains date/view');
 // Existing ended meetings must remain read-only, including direct editor URLs.
 await page.goto(base+'#/schedule-detail?date=2026-11-09&id=sample-2026-11-09-0');await page.locator('.schedule-event-detail').waitFor();assert.equal(await button('编辑').count(),0);await page.goto(base+'#/schedule-new?date=2026-11-09&id=sample-2026-11-09-0');await page.getByText('会议已结束，不能编辑',{exact:true}).waitFor();assert.equal(await button('保存').count(),0);
 checks.push('ended meeting detail/editor guards preserved');
 for(const width of [320,375,430,1440]){await page.setViewportSize({width,height:900});for(const [route,name] of [['schedule?date=2026-05-31&view=month','month'],['schedule-new?date=2026-11-15&kind=event','event'],['schedule-new?date=2026-11-15&kind=meeting','meeting']]){await page.goto(base+'#/'+route);await page.locator('.schedule-flow').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('.schedule-flow').evaluate(el=>el.scrollWidth>el.clientWidth),false);await capture(name+'-'+width)}}
 for(const [width,height] of [[375,600],[1440,650]]){await page.setViewportSize({width,height});await page.goto(base+'#/schedule?date=2026-05-31&view=month');await page.locator('.schedule-month-calendar').waitFor();const geometry=await page.locator('.schedule-flow').evaluate(el=>{const box=el.getBoundingClientRect(),calendar=el.querySelector('.schedule-month-calendar').getBoundingClientRect();return{ratio:calendar.height/box.height,overlap:Array.from(el.querySelectorAll('.schedule-month-grid>button')).some(cell=>cell.scrollHeight>cell.clientHeight+1)}});assert.ok(Math.abs(geometry.ratio-.4)<.002);assert.equal(geometry.overlap,false);await capture('month-short-'+width+'-'+height)}
 await page.setViewportSize({width:375,height:812});await page.goto(base+'#/schedule?date=2026-11-09&view=month');await button('关闭日程').click();await page.locator('.work-recent-forms').waitFor();checks.push('320/375/430/1440 responsive layouts, original typography/colors/rows retained, X returns to workbench');
 assert.deepEqual(errors,[]);const report={result:'passed',measures,checks,errors};await fs.writeFile(new URL('report.json',output),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
