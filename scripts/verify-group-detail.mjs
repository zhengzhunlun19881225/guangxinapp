import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=new URL('../output/playwright/group-detail/',import.meta.url);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,timeout:60000,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:1,isMobile:true,hasTouch:true,acceptDownloads:true});
const page=await context.newPage(),base=process.env.BASE_URL||'http://localhost:5317/',errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
async function ready(){await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready)}
async function reopen(){await page.locator('.group-news-row').first().click();await page.getByRole('dialog',{name:/引领新兴产业浪潮/}).waitFor();await page.locator('.group-detail-article').waitFor()}
async function close(){await page.getByRole('button',{name:'关闭弹窗',exact:true}).click();await page.getByRole('dialog').waitFor({state:'detached'})}
async function shot(name,locator){await page.locator('.toast').waitFor({state:'hidden'});await page.waitForTimeout(950);await (locator||page).screenshot({path:fileURLToPath(new URL(name+'.png',out))})}
try{
 const cdp=await context.newCDPSession(page);
 for(const route of ['portal-staff','portal-manager','portal-leader']){
  await page.goto(base+'#/'+route);await page.locator('.portal-notices').waitFor();await ready();await page.locator('.portal-notices').scrollIntoViewIfNeeded();
  const layout=await page.evaluate(()=>{const news=document.querySelector('.portal-news').getBoundingClientRect(),track=document.querySelector('.portal-notices'),t=track.getBoundingClientRect(),group=document.querySelector('.group-news').getBoundingClientRect(),cards=[...track.children].map(e=>e.getBoundingClientRect());return{top:t.top-news.bottom,bottom:group.top-t.bottom,gap:cards[1].left-cards[0].right,client:track.clientWidth,offset:track.offsetWidth,scroll:track.scrollWidth,bar:getComputedStyle(track).scrollbarWidth}});
  assert.equal(layout.top,10);assert.equal(layout.bottom,10);assert.equal(layout.gap,10);assert.ok(layout.scroll>layout.client);assert.equal(layout.client,layout.offset);assert.equal(layout.bar,'none');await shot(route+'-notices');
  const track=page.locator('.portal-notices'),box=await track.boundingBox(),vertical=await page.locator('.device-scroll').evaluate(e=>e.scrollTop),start={x:box.x+300,y:box.y+120};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x-24*i,y:start.y}]});await page.waitForTimeout(20)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(450);
  assert.ok(await track.evaluate(e=>e.scrollLeft)>100,'finger left swipe reveals announcement');assert.ok(Math.abs(await page.locator('.device-scroll').evaluate(e=>e.scrollTop)-vertical)<2);await shot(route+'-notices-swiped');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+40,y:start.y}]});for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+40+24*i,y:start.y}]});await page.waitForTimeout(20)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(450);assert.ok(await track.evaluate(e=>e.scrollLeft)<2,'finger right swipe returns notification');
 }
 checks.push('all 3 portals: exact 10px above/below and between notification cards; actual finger swipes both directions; vertical scroll retained; no native gutter');
 await reopen();await ready();assert.equal(await page.locator('.group-detail-article>p').count(),4);assert.equal(await page.locator('.group-detail-article>img').count(),2);assert.match(await page.locator('.group-detail-article h2').textContent(),/引领新兴产业浪潮/);assert.equal(await page.locator('.group-detail-article time').textContent(),'2025-10-30 09:03');assert.match(await page.locator('.group-detail-meta>span').textContent(),/办公室\(集团总部\)/);
 await shot('top-375');assert.equal(await page.locator('.group-article-metrics').count(),0);assert.equal(await page.getByRole('button',{name:'点赞',exact:true}).count(),0);assert.equal(await page.getByText('发布单位：',{exact:false}).count(),0);
 const meta=await page.locator('.group-detail-meta').evaluate(e=>{const unit=e.querySelector('span').getBoundingClientRect(),time=e.querySelector('time').getBoundingClientRect();return {unit:unit.toJSON(),time:time.toJSON(),right:e.getBoundingClientRect().right}});assert.ok(meta.unit.left>meta.time.right);assert.equal(await page.locator('.group-detail-meta').evaluate(e=>getComputedStyle(e).borderBottomWidth),'0px');
 await page.locator('.group-detail-scroll').evaluate(e=>e.scrollTop=650);await shot('middle-375');await page.locator('.group-detail-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);await shot('bottom-375');
 for(const [i,link] of (await page.locator('.group-detail-attachments>a').all()).entries()){
  const downloadEvent=page.waitForEvent('download');await link.click();const download=await downloadEvent;assert.ok(download.suggestedFilename().endsWith('.pdf'));assert.equal(await download.failure(),null);const file=await download.path();const bytes=await fs.readFile(file);assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.ok(bytes.length>10000);await download.saveAs(fileURLToPath(new URL('download-'+i+'.pdf',out)));
 }
 checks.push('full reference title, publisher/time, 4 paragraphs and 2 original supplied photographs; left-aligned time followed by publisher without prefix or divider; no views/likes; 2 valid PDF downloads');
 await close();await page.setViewportSize({width:375,height:2100});await page.reload();await ready();await reopen();await page.locator('.group-detail-inline').scrollIntoViewIfNeeded();await page.locator('.group-detail-scroll').evaluate(e=>e.scrollTop=0);await shot('article-full',page.locator('.group-detail-article'));
 for(const width of [320,375,430,768,1440]){
  await close();await page.setViewportSize({width,height:900});await page.reload();await ready();await reopen();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('.group-detail-nav').count(),0);assert.equal(new URL(page.url()).hash,'#/portal-leader');const scroll=await page.locator('.group-detail-scroll').evaluate(e=>({client:e.clientWidth,offset:e.offsetWidth,bar:getComputedStyle(e).scrollbarWidth}));assert.equal(scroll.client,scroll.offset);assert.equal(scroll.bar,'none');const back=await page.getByRole('button',{name:'关闭弹窗'}).boundingBox();assert.equal(back.width,30);assert.equal(back.height,30);await shot('responsive-'+width);
 }
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});await reopen();await page.locator('.group-detail-attachments>a').last().focus();await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'关闭弹窗'}).evaluate(e=>document.activeElement===e),true);await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('.group-detail-attachments>a').last().evaluate(e=>document.activeElement===e),true);await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});
 checks.push('Escape closing and focus trap includes PDF download links');
 checks.push('320/375/430/768/1440 layouts, article modal without duplicate navbar/status bar, unchanged portal URL, non-reserving native scrollbars and readable full article');assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);const report={result:'passed',checks,errors,failed};await fs.writeFile(new URL('report.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
