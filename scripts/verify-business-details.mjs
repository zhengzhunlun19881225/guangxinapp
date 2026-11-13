import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},timezoneId:'Asia/Shanghai'});
const out=new URL('../output/playwright/business-details/',import.meta.url);await fs.mkdir(out,{recursive:true});
const base=process.env.BASE_URL||'http://localhost:5317/';
const errors=[],failed=[],checks=[];
page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)failed.push(response.url()+' '+response.status())});
const screenshot=async(name,locator)=>{await page.waitForTimeout(220);await (locator||page).screenshot({path:fileURLToPath(new URL(name+'.png',out))})};
const close=()=>page.getByRole('button',{name:'关闭弹窗',exact:true}).click();
async function readyOverview(){await page.goto(base+'#/portal-overview');await page.locator('[data-node-id="0:6203"]').waitFor();await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready)}
async function fixture(end='2026-11-08T10:00'){
 await page.goto(base+'#/workbench');await page.locator('.work-calendar').waitFor();
 await page.evaluate(end=>{
  const event={id:'sample-2026-11-08-0',title:'【线下会议】关于集团2026年调研实施方案的讨论',kind:'meeting',start:'2026-11-08T09:00',end,allDay:false,repeat:'不重复',reminder:'提前10分钟',location:'3楼会议室',participants:['张嘉嘉'],notes:'讨论调研计划、责任分工与下一步安排。',calendar:'我的日历',color:'green',creator:'上官成硕',host:'上官成硕',visibility:'公开日程',completed:false};
  localStorage.setItem('gx-app-schedule-events-v1',JSON.stringify([event]));
 },end);await page.reload();await page.locator('.calendar-event').first().waitFor();
}
try{
 await page.clock.install({time:new Date('2026-11-08T08:00:00+08:00')});
 await readyOverview();
 const investment=page.locator('.project-investments'),table=page.locator('.investment-table-scroll');
 assert.equal(await investment.locator('tbody tr').count(),5);assert.equal(await investment.locator('thead th').count(),7);
 await page.locator('.device-scroll').evaluate(el=>el.scrollTop=1280);
 await screenshot('investment-final',investment);
 const layout=await investment.evaluate(el=>({gap:document.querySelector('[data-node-id="0:6484"]').getBoundingClientRect().top-el.getBoundingClientRect().bottom,inner:el.querySelector('.investment-table-scroll').clientWidth,full:el.querySelector('.investment-table-scroll').scrollWidth}));
 assert.equal(layout.gap,10);assert.ok(layout.full>layout.inner);
 const bounds=await table.boundingBox(),cdp=await page.context().newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:bounds.x+bounds.width-20,y:bounds.y+90}]});
 for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:bounds.x+bounds.width-20-i*30,y:bounds.y+90}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(180);
 assert.ok(await table.evaluate(el=>el.scrollLeft)>50,'real touch swipe should scroll table');
 await table.evaluate(el=>el.scrollLeft=el.scrollWidth);await screenshot('investment-indicators-final',investment);
 assert.deepEqual(await investment.locator('progress').evaluateAll(nodes=>nodes.map(node=>node.value)),[75,55,45,35,25]);
 await page.getByRole('button',{name:'项目投资筛选',exact:true}).click();await page.getByLabel('投资阶段',{exact:true}).selectOption('投后管理');await page.getByRole('button',{name:'应用筛选',exact:true}).click();assert.equal(await investment.locator('tbody tr').count(),1);
 await page.getByRole('button',{name:'项目投资筛选',exact:true}).click();await page.getByLabel('项目类型',{exact:true}).selectOption('新能源');await page.getByRole('button',{name:'应用筛选',exact:true}).click();await page.getByText('暂无符合条件的项目',{exact:false}).waitFor();
 await page.getByRole('button',{name:'重置筛选',exact:true}).click();assert.equal(await investment.locator('tbody tr').count(),5);
 checks.push('five source investment records, seven indicators, real touch scrolling, stage/type filters, empty and reset, 10px following gap');
 await page.locator('.device-scroll').evaluate(el=>el.scrollTop=690);await screenshot('map-final',page.locator('.province-tax-card'));
 const map=page.locator('[data-node-id="0:6351"]');assert.equal(await map.locator('img').getAttribute('src'),'/assets/record-details/province-tax-map.png');
 assert.equal(await page.locator('.province-tax-label').count(),5);
 const zoom=await page.getByRole('button',{name:'放大税金地图',exact:true}).boundingBox(),card=await page.locator('.province-tax-card').boundingBox();assert.ok(zoom.x<card.x+40,'zoom must be on left');
 await page.getByRole('button',{name:'放大税金地图',exact:true}).click();await page.waitForTimeout(240);assert.match(await map.evaluate(el=>getComputedStyle(el).transform),/1.2/);
 await page.getByRole('button',{name:'放大税金地图',exact:true}).click();await page.getByRole('button',{name:'放大税金地图',exact:true}).click();assert.ok(await page.getByRole('button',{name:'放大税金地图',exact:true}).isDisabled());
 checks.push('PC red map asset, five labels, left zoom, zoom limit');
 await page.goto(base+'#/workbench');await page.locator('.work-todo').getByRole('button',{name:'更多 ›',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:/关于集团2026年调研实施方案的讨论/}).first().click();
 assert.deepEqual(await page.locator('.record-details dt').allTextContents(),['类型','数据来源','发起时间','发起人','内容']);
 assert.match(await page.getByRole('dialog').innerText(),/协同办公（演示）/);assert.match(await page.getByRole('dialog').innerText(),/请相关部门补充调研建议/);
 await screenshot('todo-final',page.getByRole('dialog'));await close();
 await page.locator('.todo-row').first().click();await page.getByRole('button',{name:'同意',exact:true}).click();assert.equal(await page.locator('.todo-row').count(),3);
 await page.getByRole('button',{name:'已办',exact:true}).click();await page.locator('.todo-row').first().click();assert.equal(await page.getByRole('button',{name:'同意',exact:true}).count(),0);await close();
 await page.clock.fastForward(3500);await page.locator('.calendar-event').first().click();await screenshot('meeting-ended-final',page.getByRole('dialog'));
 assert.deepEqual(await page.locator('.record-details dt').allTextContents(),['时间','发起人','主持人','会议地址','与会人员','提前提醒','可见范围','描述']);
 assert.equal(await page.getByRole('dialog').getByRole('button',{name:'编辑',exact:true}).count(),0);assert.equal(await page.getByRole('dialog').getByRole('button',{name:'删除',exact:true}).count(),0);await close();
 checks.push('todo source fields and full content, existing approval completes, completed todo read-only, ended meeting read-only with all eight fields');
 await fixture();await page.locator('.calendar-event').first().click();await screenshot('meeting-upcoming-final',page.getByRole('dialog'));
 await page.getByRole('dialog').getByRole('button',{name:'编辑',exact:true}).click();
 await page.getByLabel('会议名称',{exact:true}).fill('会议编辑验证');await page.getByLabel('会议地址',{exact:true}).fill('5楼会议室');await page.getByRole('button',{name:'选择主持人',exact:true}).click();await page.getByRole('dialog').getByLabel('张锐',{exact:true}).check();await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click();
 await page.getByLabel('描述',{exact:true}).fill('核对调研议题与资料。');await page.getByRole('button',{name:'保存',exact:true}).click();
 await page.locator('.schedule-timeline-event').filter({hasText:'会议编辑验证'}).click();assert.match(await page.locator('.schedule-event-detail').innerText(),/5楼会议室/);assert.match(await page.locator('.schedule-event-detail').innerText(),/张锐/);
 await page.reload();await page.getByRole('button',{name:'删除日程',exact:true}).waitFor();await screenshot('meeting-edited-final',page.locator('.schedule-flow'));
 await page.getByRole('button',{name:'删除日程',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'取消',exact:true}).click();assert.equal(await page.locator('.schedule-event-detail').count(),1);
 await page.getByRole('button',{name:'删除日程',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'删除',exact:true}).click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('gx-app-schedule-events-v1')).length),0);
 checks.push('upcoming meeting edit, host/location/description persisted on reload, confirmed delete and cancel');
 await fixture();await page.locator('.calendar-event').first().click();await page.getByRole('dialog').getByRole('button',{name:'删除',exact:true}).click();await page.getByRole('button',{name:'取消',exact:true}).click();assert.equal(await page.locator('.calendar-event').count(),1);
 await page.getByRole('dialog').getByRole('button',{name:'删除',exact:true}).click();await page.getByRole('button',{name:'确认删除',exact:true}).click();assert.equal(await page.locator('.calendar-event').count(),0);
 await fixture('2026-11-08T07:59');await page.locator('.calendar-event').first().click();assert.equal(await page.getByRole('dialog').getByRole('button',{name:'编辑',exact:true}).count(),0);await close();
 await page.goto(base+'#/schedule-new?date=2026-11-08&id=sample-2026-11-08-0');await page.getByText('会议已结束，不能编辑',{exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'保存',exact:true}).count(),0);
 // An open meeting crosses its end time: controls disappear without reopening.
 await fixture('2026-11-08T08:01');await page.locator('.calendar-event').first().click();assert.equal(await page.getByRole('dialog').getByRole('button',{name:'编辑',exact:true}).count(),1);
 await page.clock.fastForward(61000);assert.equal(await page.getByRole('dialog').getByRole('button',{name:'编辑',exact:true}).count(),0);await close();
 checks.push('modal confirmed delete updates list, timestamp-based ended guard, direct editor guard, live expiry hides actions');
 const responsive=[];
 for(const width of [320,375,430,768,1440]){
  await page.setViewportSize({width,height:900});await readyOverview();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const gap=await page.locator('.project-investments').evaluate(el=>document.querySelector('[data-node-id="0:6484"]').getBoundingClientRect().top-el.getBoundingClientRect().bottom);assert.ok(gap>=8);
  for(const route of ['portal-overview','portal-leader','workbench']){
   await page.goto(base+'#/'+route);await page.locator('.bottom-nav').waitFor();await page.waitForLoadState('networkidle');
   await page.locator('.device-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);await page.waitForTimeout(100);
   const bounded=await page.evaluate(()=>{
    const nav=document.querySelector('.bottom-nav').getBoundingClientRect(),device=document.querySelector('.device').getBoundingClientRect();
    const bars=[...document.querySelectorAll('.app-scrollbar-thumb.is-scrolling[data-axis="vertical"]')].map(el=>el.getBoundingClientRect());
    return bars.length>0&&bars.every(bar=>bar.bottom<=nav.top+0.5&&bar.top>=device.top-0.5);
   });assert.ok(bounded,'scrollbar overlaps navigation '+width+' '+route);
   if(width===375&&route==='portal-leader')await screenshot('scrollbar-final');
  }
  await page.goto(base+'#/workbench');await page.locator('.work-todo').getByRole('button',{name:'更多 ›',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:/关于集团2026年调研实施方案的讨论/}).first().click();
  const overflow=await page.getByRole('dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1||el.querySelector('.modal-body').scrollWidth>el.querySelector('.modal-body').clientWidth+1);assert.equal(overflow,false);await close();
  responsive.push(width);
 }
 checks.push('320/375/430/768/1440: module gap, dialog wrapping, scrolling indicators stay above bottom navigation on all three pages');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={result:'passed',checks,responsive,errors,failed};await fs.writeFile(new URL('report.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
