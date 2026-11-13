import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const page=await browser.newPage({viewport:{width:375,height:812}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:5317/')+'#/portal-overview');
 const map=page.locator('[data-node-id="0:6351"] img');
 await map.waitFor();await map.evaluate(img=>img.decode());
 assert((await map.evaluate(img=>img.naturalWidth))>100,'Map must contain the original full-size map');
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('.device-scroll').evaluate(el=>el.scrollTop=650);
 const output=new URL('../output/playwright/',import.meta.url);
 await page.screenshot({path:fileURLToPath(new URL('portal-overview-scroll-375.png',output))});
 await page.getByRole('button',{name:'放大税金地图',exact:true}).click();
 assert.match(await map.locator('..').evaluate(el=>getComputedStyle(el).transform),/1.2/);
 assert.deepEqual(errors,[]);
 await fs.writeFile(new URL('verification-map.json',output),JSON.stringify({mapLoaded:true,zoomPassed:true,errors},null,2));
 console.log('PASS production map rendering and zoom');
}finally{await browser.close()}
