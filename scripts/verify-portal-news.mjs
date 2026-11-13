import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=new URL('../output/playwright/portal-news/',import.meta.url);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const page=await context.newPage(),cdp=await context.newCDPSession(page),errors=[],failed=[],checks=[],base=process.env.BASE_URL||'http://localhost:5317/';
page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)failed.push(response.url())});
async function shot(name,locator){await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);await (locator||page).screenshot({path:fileURLToPath(new URL(name+'.png',out))})}
async function ready(){await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready)}
try{
 for(const route of ['portal-leader','portal-manager','portal-staff']){
  await page.goto(base+'#/'+route);await page.locator('.portal-news').waitFor();await page.locator('[data-node-id="'+({'portal-leader':'0:7975','portal-manager':'0:7256','portal-staff':'0:8620'}[route])+'"]').waitFor({state:'visible'});await ready();
  const section=page.locator('.portal-news');await section.scrollIntoViewIfNeeded();await page.locator('.device-scroll').evaluate(e=>e.scrollTop+=120);await page.waitForTimeout(100);
  assert.equal(await section.getByRole('tab').count(),5);assert.equal(await section.getByRole('tab',{name:'推荐',exact:true}).getAttribute('aria-selected'),'true');
  assert.equal(await section.locator('.portal-news-card').count(),12);assert.equal(await page.locator('[data-node-id="0:8858"]').count(),0);
  const bounds=await page.evaluate(()=>{const news=document.querySelector('.portal-news').getBoundingClientRect(),fund=document.querySelector('[data-node-id="0:9027"]').getBoundingClientRect();return {news:news.toJSON(),fund:fund.toJSON()}});assert.ok(bounds.news.bottom<=bounds.fund.top,route+': no overlap '+JSON.stringify(bounds));
  await shot(route+'-section',section);await shot(route+'-page');
  for(const [category,count] of [['我关注的',6],['与我有关',6],['集团要闻',4],['行业趋势',4]]){
   await section.getByRole('tab',{name:category,exact:true}).click();assert.equal(await section.locator('.portal-news-card').count(),count);
   if(category==='行业趋势')assert.ok((await section.locator('.portal-news-tags>span:first-child').allTextContents()).every(text=>text===category));
  }
  await section.getByRole('tab',{name:'推荐',exact:true}).click();await section.getByRole('tab',{name:'推荐',exact:true}).press('ArrowRight');assert.equal(await section.getByRole('tab',{name:'我关注的',exact:true}).getAttribute('aria-selected'),'true');await section.getByRole('tab',{name:'我关注的',exact:true}).press('Home');
  const photo=section.locator('.portal-news-photo').first();await photo.waitFor();assert.equal(await photo.evaluate(e=>e.complete&&e.naturalWidth>0),true);
  await section.getByRole('button',{name:'更多AI智能资讯'}).click();await page.locator('.portal-news-page').waitFor();assert.ok(page.url().includes('origin='+route));assert.equal(await page.locator('.bottom-nav').count(),0);assert.equal(await page.locator('.portal-news-row').count(),12);
  await page.getByRole('button',{name:'产业协同合作，共探数字化转型新路径',exact:true}).click();await page.getByRole('dialog').waitFor();assert.equal(await page.locator('.portal-news-article>p').count(),4);assert.ok((await page.locator('.portal-news-article>p').first().textContent()).startsWith('业务协同是数字化转型的起点'));
  if(route==='portal-leader')await shot('article');await page.getByRole('button',{name:'关闭弹窗'}).click();assert.equal(await page.getByRole('dialog').count(),0);await page.getByRole('button',{name:'返回门户'}).click();await section.waitFor();assert.equal(new URL(page.url()).hash,'#/'+route);
  checks.push(route+': 5 categories, matching datasets, keyboard tabs, More list, 4-paragraph article, close and return; adjacent layout preserved');
 }
 await page.goto(base+'#/portal-leader');await ready();await page.locator('.portal-news').scrollIntoViewIfNeeded();await page.locator('.device-scroll').evaluate(e=>e.scrollTop+=120);await page.waitForTimeout(200);
 const track=page.locator('.portal-news-track'),box=await track.boundingBox(),start={x:box.x+box.width-30,y:box.y+55},end={x:box.x+20,y:box.y+55};
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...start,radiusX:5,radiusY:5}]});
 for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+(end.x-start.x)*i/12,y:start.y,radiusX:5,radiusY:5}]});await page.waitForTimeout(20)}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(400);assert.ok(await track.evaluate(e=>e.scrollLeft)>100,'actual finger swipe carousel');await shot('touch-swiped',page.locator('.portal-news'));await page.locator('.portal-news').getByRole('tab',{name:'集团要闻',exact:true}).click();assert.equal(await track.evaluate(e=>e.scrollLeft),0);await page.getByRole('button',{name:'更多AI智能资讯'}).click();await page.locator('.portal-news-page').waitFor();assert.equal(await page.getByRole('tab',{name:'集团要闻',exact:true}).getAttribute('aria-selected'),'true');assert.equal(await page.locator('.portal-news-row').count(),4);
 await page.getByRole('tab',{name:'推荐',exact:true}).click();await ready();
 const rowMetrics=await page.locator('.portal-news-row').evaluateAll(es=>es.map((e,i)=>{const box=e.getBoundingClientRect(),photo=e.querySelector('img').getBoundingClientRect(),next=es[i+1]?.getBoundingClientRect();return {ratio:photo.width/photo.height,border:getComputedStyle(e).borderBottomWidth,gap:next?next.top-box.bottom:null}}));
 assert.ok(rowMetrics.every(e=>Math.abs(e.ratio-4/3)<0.001&&e.border==='0px'&&(e.gap===null||e.gap===32)),'4:3 photos, no dividers, exact 32px between rows');await fs.writeFile(new URL('list-layout-metrics.json',out),JSON.stringify(rowMetrics,null,2));await shot('list-375');
 const list=page.locator('.portal-news-list');await shot('list-content-375',page.locator('.portal-news-page'));
 await page.getByRole('tab',{name:'行业趋势',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.portal-news-row').length===4);assert.equal(await page.locator('.portal-news-row').count(),4);await shot('industry-list');await page.getByRole('tab',{name:'推荐',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.portal-news-row').length===12);
 for(const width of [320,375,430,768,1440]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const metrics=await list.evaluate(e=>({client:e.clientWidth,offset:e.offsetWidth,bar:getComputedStyle(e).scrollbarWidth}));assert.equal(metrics.client,metrics.offset);assert.equal(metrics.bar,'none');
  await list.evaluate(e=>e.scrollTop=0);await page.waitForTimeout(1050);assert.equal(await page.locator('.app-scrollbar-thumb.is-scrolling').count(),0);await list.evaluate(e=>e.scrollTop=200);await page.waitForTimeout(50);assert.equal(await list.evaluate(e=>e.clientWidth),metrics.client);
  const row=page.locator('.portal-news-row').nth(2);await row.click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'关闭弹窗'}).click();assert.ok(await list.evaluate(e=>e.scrollTop)>0,'article close preserves list position');await list.evaluate(e=>e.scrollTop=0);await page.waitForTimeout(1050);await shot('list-'+width);
 }
 checks.push('real CDP finger swipe; category change resets carousel; More preserves selected category; 320/375/430/768/1440 list layout, scroll position and hidden overlay scrollbars');
 await page.setViewportSize({width:375,height:812});await page.goto(base+'#/portal-news?origin=portal-leader&category=推荐');await ready();
 const listBox=await page.locator('.portal-news-tabs').boundingBox();await page.screenshot({path:fileURLToPath(new URL('list-reference-crop.png',out)),clip:{x:0,y:listBox.y,width:375,height:187}});
 const firstTitle='产业协同合作，共探数字化转型新路径';
 for(const width of [375,320,430,768,1440]){
  await page.setViewportSize({width,height:812});await page.getByRole('button',{name:firstTitle,exact:true}).click();await page.getByRole('dialog').waitFor();
  const layout=await page.locator('.portal-news-article').evaluate(e=>{const title=e.querySelector('h3').getBoundingClientRect(),tags=e.querySelector('.portal-news-tags').getBoundingClientRect(),meta=e.querySelector('.portal-news-article-meta').getBoundingClientRect(),feedback=e.querySelector('.portal-news-feedback').getBoundingClientRect(),date=e.querySelector('time').getBoundingClientRect(),bounds=e.getBoundingClientRect();return {title:title.toJSON(),tags:tags.toJSON(),meta:meta.toJSON(),feedback:feedback.toJSON(),date:date.toJSON(),bounds:bounds.toJSON(),buttons:[...e.querySelectorAll('.portal-news-feedback>button')].map(b=>b.getBoundingClientRect().toJSON())}});
  assert.equal(await page.getByRole('heading',{name:'资讯详情',exact:true}).count(),0);assert.equal(await page.getByRole('dialog',{name:firstTitle,exact:true}).count(),1);assert.ok(layout.tags.top>=layout.title.bottom);assert.ok(layout.meta.top>=layout.tags.bottom);assert.ok(layout.feedback.left>=layout.date.right);assert.ok(layout.feedback.right<=layout.bounds.right+1);assert.ok(layout.buttons.every(b=>b.height>=44));assert.equal(await page.getByRole('button',{name:'减少此类内容',exact:true}).count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await shot('article-feedback-'+width);await page.getByRole('button',{name:'关闭弹窗'}).click();
 }
 await page.getByRole('button',{name:firstTitle,exact:true}).click();const interested=page.getByRole('button',{name:'感兴趣',exact:true}),less=page.getByRole('button',{name:'减少此类',exact:true});
 assert.equal(await interested.getAttribute('aria-pressed'),'false');await interested.click();assert.equal(await interested.getAttribute('aria-pressed'),'true');await less.click();assert.equal(await less.getAttribute('aria-pressed'),'true');assert.equal(await interested.getAttribute('aria-pressed'),'false');await page.getByRole('button',{name:'关闭弹窗'}).click();
 await page.reload();await ready();await page.getByRole('button',{name:firstTitle,exact:true}).click();assert.equal(await less.getAttribute('aria-pressed'),'true');await less.click();assert.equal(await less.getAttribute('aria-pressed'),'false');
 await interested.click();await page.getByRole('button',{name:'关闭弹窗'}).click();await page.getByRole('button',{name:'智慧园区建设，提升企业运营服务效率',exact:true}).click();assert.equal(await interested.getAttribute('aria-pressed'),'false');assert.equal(await less.getAttribute('aria-pressed'),'false');await page.getByRole('button',{name:'关闭弹窗'}).click();
 await page.getByRole('button',{name:firstTitle,exact:true}).click();await interested.click();await page.evaluate(()=>{window.__feedbackSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('unavailable')}});await less.click();assert.equal(await less.getAttribute('aria-pressed'),'true');await page.getByRole('status').filter({hasText:'已在本次会话记录，未能保存到本机'}).waitFor();await page.getByRole('button',{name:'关闭弹窗'}).click();await page.getByRole('button',{name:firstTitle,exact:true}).click();assert.equal(await less.getAttribute('aria-pressed'),'true');await page.evaluate(()=>{Storage.prototype.setItem=window.__feedbackSetItem});await less.click();await page.getByRole('button',{name:'关闭弹窗'}).click();
 checks.push('article tags below title; PC SVG preference pills at metadata right, exact reduced copy and 44px hit areas across 320/375/430/768/1440; mutually exclusive feedback, repeat-to-cancel, per-article isolation, reload persistence and storage failure retains session preference');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);const report={result:'passed',checks,errors,failed};await fs.writeFile(new URL('report.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
