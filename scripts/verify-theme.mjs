import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const before=process.env.CAPTURE_THEME_BEFORE==='1';
const output=new URL('../output/playwright/theme-update/'+(before?'before/':'after/'),import.meta.url);await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[],failed=[],results=[];const base=process.env.BASE_URL||'http://localhost:5317/';
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status())});
const allowed=['rgb(3, 9, 27)','rgb(78, 89, 105)','rgb(135, 139, 153)','rgb(255, 0, 0)','rgb(0, 109, 255)','rgb(0, 181, 120)','rgb(255, 125, 0)','rgb(114, 46, 209)','rgb(20, 201, 201)','rgb(255, 255, 255)'];
async function capture(name){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>null)));const urls=[...new Set(Array.from(document.querySelectorAll('.spec-icon,.im2-icon,.schedule-icon')).map(e=>getComputedStyle(e).maskImage.match(/url\(["']?(.*?)["']?\)/)?.[1]).filter(Boolean))];await Promise.all(urls.map(url=>new Promise(resolve=>{const i=new Image();i.onload=resolve;i.onerror=resolve;i.src=url})));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});await page.screenshot({path:fileURLToPath(new URL(name+'.png',output))})}
async function open(route){await page.goto(base+'#/'+route);await page.locator('.route-'+route.split('?')[0]).waitFor();await page.waitForLoadState('networkidle');if(route.startsWith('schedule'))await page.locator('.schedule-flow').waitFor();else if(route.startsWith('im-'))await page.locator('.im2-flow').waitFor();else if(route==='mobile-spec')await page.locator('.mobile-guide').waitFor();else if(route==='profile')await page.locator('.profile-page').waitFor();else await page.locator('.scene-layer>div[data-node-id]').first().waitFor()}
async function expectColor(selector,property,value){const colors=await page.locator(selector).evaluateAll((es,key)=>es.map(e=>getComputedStyle(e)[key]),property);assert.ok(colors.length,selector+' exists');assert.ok(colors.every(color=>color===value),selector+' '+property+': '+colors.join(','))}
async function themeState(route){
 const red='rgb(255, 0, 0)',blue='rgb(0, 109, 255)',primary='rgb(3, 9, 27)',muted='rgb(135, 139, 153)';
 if(route==='profile'){await expectColor('.profile-links>button','color',primary);await expectColor('.profile-links>button>span','color',muted)}
 if(route==='workbench')await expectColor('.todo-tabs button[aria-pressed=true]','color',red);
 if(route==='im-groups'){await expectColor('.im2-tabs>button[aria-selected=true]','color',red)}
 if(route==='im-meeting'){await expectColor('.im2-meeting-footer>button','backgroundColor',red);await expectColor('.im2-switch[aria-checked=true]','backgroundColor',red)}
 if(route==='schedule'){await expectColor('.schedule-selected>span','backgroundColor',red);await expectColor('.schedule-add','backgroundColor',red)}
 if(route==='schedule-new'){await expectColor('.schedule-save','color',red);await page.getByRole('switch').click();await expectColor('.schedule-switch[aria-checked=true]','backgroundColor',red);await page.getByRole('switch').click()}
 if(route==='spec-按钮操作'){await expectColor('.spec-button-primary:not(:disabled)','backgroundColor',red);await expectColor('.spec-button-text','color',blue);await expectColor('.spec-fab','backgroundColor',red)}
 if(route==='spec-表单输入'){await expectColor('.spec-choices input','accentColor',red);await page.locator('.spec-switch-target').click();await expectColor('.spec-switch-target[aria-checked=true] .spec-switch','backgroundColor',red);await page.locator('.spec-switch-target').click()}
}
async function audit(name){const unexpected=await page.locator('.artboard').evaluate((root,allowed)=>Array.from(root.querySelectorAll('*')).filter(el=>Array.from(el.childNodes).some(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim())&&el.getBoundingClientRect().width&&getComputedStyle(el).visibility!=='hidden'&&!el.closest('.im2-status,.schedule-status,.native-status,[data-name="Time Style"]')).map(el=>({text:el.textContent.trim().slice(0,35),color:getComputedStyle(el).color,selector:el.className})).filter(el=>!allowed.includes(el.color)),allowed);results.push({name,unexpected});if(!before)assert.deepEqual(unexpected,[],name+' text palette')}
try{for(const route of ['profile','chat','skills','im','contacts','workbench','portal-overview','portal-leader','portal-manager','portal-staff','schedule','schedule-new','im-groups','im-meeting']){await open(route);if(!before)await themeState(route);await capture(route);await audit(route);if(route==='workbench'){await page.locator('.device-scroll').evaluate(e=>e.scrollTop=1000);await capture('workbench-schedule')}}
 await open('mobile-spec');for(const category of ['按钮操作','表单输入','内容展示','反馈弹窗']){await page.locator('.guide-categories').getByRole('button',{name:category,exact:true}).click();await page.waitForLoadState('networkidle');if(!before)await themeState('spec-'+category);await capture('spec-'+category);await audit('spec-'+category)}
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);await fs.writeFile(new URL('report.json',output),JSON.stringify({result:before?'baseline':'passed',results,errors,failed},null,2));console.log(JSON.stringify({result:before?'baseline':'passed',colors:results.filter(r=>r.unexpected.length),errors,failed},null,2));
}finally{await browser.close()}
