import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const output='output/playwright/desktop-workspace';await fs.mkdir(output,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1822,height:976}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:5317/')+'#/mobile-spec');
 await page.locator('.device .route-workbench').waitFor();await page.locator('.desktop-spec-panel .mobile-guide').waitFor();
 await page.evaluate(()=>document.fonts.ready);
 const bounds=selector=>page.locator(selector).boundingBox();
 for(const width of [1822,1440,1200]){
  await page.setViewportSize({width,height:976});
  const rail=await bounds('.desktop-rail'),phone=await bounds('.device'),spec=await bounds('.desktop-spec-panel');
  assert.equal(rail.x,24);assert.equal(phone.x,228);assert.equal(phone.width,375);assert.equal(spec.x,627);assert.ok(spec.width>=540);
  assert.equal(await page.locator('.mobile-guide').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'desktop overflow '+width);
 }
 await page.setViewportSize({width:1822,height:976});
 await page.screenshot({path:output+'/overview-1822.png'});
 await page.locator('.desktop-rail a[href="#/portal-leader"]').click();await page.locator('.device .route-portal-leader').waitFor();
 await page.locator('.desktop-rail a[href="#/mobile-spec"]').click();assert.equal(await page.locator('.device .route-portal-leader').count(),1);
 const guide=page.locator('.desktop-spec-panel');
 await guide.locator('.guide-categories').getByRole('button',{name:'App 组件',exact:true}).click();
 await page.screenshot({path:output+'/app-components-1822.png'});
 const phoneScroll=await page.locator('.device-scroll').evaluate(el=>el.scrollTop);
 await page.locator('.desktop-spec-scroll').evaluate(el=>el.scrollTo(0,el.scrollHeight));
 assert.equal(await page.locator('.device-scroll').evaluate(el=>el.scrollTop),phoneScroll);
 await guide.getByRole('button',{name:'返回顶部',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.desktop-spec-scroll').scrollTop<2,{},{timeout:3000});
 await guide.locator('.guide-categories').getByRole('button',{name:'反馈弹窗',exact:true}).click();
 await guide.locator('[data-component="dialog"]').getByRole('button').click();
 assert.equal(await guide.getByRole('dialog').count(),1);assert.equal(await page.locator('.device .spec-overlay').count(),0);
 await page.keyboard.press('Escape');await guide.getByRole('dialog').waitFor({state:'detached'});
 await page.evaluate(()=>{location.hash='/apps?module=portal&origin=portal-leader'});await page.locator('.device .route-apps').waitFor();
 await page.locator('.desktop-rail a[href="#/mobile-spec"]').click();await page.locator('.device .applications-card').first().waitFor();
 assert.match(await page.locator('.device').innerText(),/我的系统/);
 await page.setViewportSize({width:375,height:812});await page.locator('.device .route-mobile-spec').waitFor();
 assert.equal(await page.locator('.desktop-spec-panel').count(),0);assert.equal(await page.locator('.mobile-guide').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:output+'/mobile-375.png'});
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,checks:['1822/1440/1200 desktop geometry','live preview and route preservation','independent guide scrolling and return to top','guide dialog stays in right panel','secondary route query preserved','single mobile guide at 375px','no browser errors']}));
}finally{await browser.close()}
