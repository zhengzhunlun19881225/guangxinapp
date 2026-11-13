import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const p=await b.newPage({viewport:{width:375,height:812},deviceScaleFactor:1,reducedMotion:'reduce'});
let captureRevision=0;
const out=fileURLToPath(new URL('../output/playwright/im-secondary/',import.meta.url));
await fs.mkdir(out,{recursive:true});
const base=process.env.BASE_URL||'http://localhost:5317/';
const errors=[],failed=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
async function open(route,height=812){await p.setViewportSize({width:375,height});await p.goto(base+'?visual='+ ++captureRevision+'#/'+route);await p.locator('.im2-flow').waitFor();await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready)}
async function shot(n){if(await p.locator('.toast').count())await p.locator('.toast').waitFor({state:'hidden'});await p.evaluate(()=>Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>null))));assert.deepEqual(await p.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[]);await p.screenshot({path:out+'visual-'+n+'.png',animations:'disabled'})}
try{
 await open('im-chat?name='+encodeURIComponent('石梁雅'));await shot('01');
 await open('im-groups?origin=contacts');await shot('04');
 await open('im-settings?name='+encodeURIComponent('乌壮菲'));await shot('08');
 await open('im-settings?group=business',933);await shot('09');
 await open('im-mute?group=business',816);await p.getByRole('radio',{name:'始终禁言',exact:true}).click();await shot('05');
 await p.getByRole('button',{name:/白名单/}).click();await p.locator('.im2-im-whitelist').waitFor();await shot('06');
 await p.getByRole('button',{name:'添加成员',exact:true}).click();await p.locator('.im2-im-select').waitFor();for(const name of ['官文','金刚保','李树洁'])await p.getByRole('checkbox',{name:'选择'+name,exact:true}).check();await shot('07');
 for(const name of ['官文','金刚保','李树洁'])await p.getByRole('checkbox',{name:'选择'+name,exact:true}).uncheck();for(const name of ['石梁雅','董巧珑','越秋'])await p.getByRole('checkbox',{name:'选择'+name,exact:true}).check();await p.locator('.im2-selection-footer').getByRole('button',{name:'确定',exact:true}).click();await p.locator('.im2-im-whitelist').waitFor();await shot('12');await p.getByRole('button',{name:'返回',exact:true}).click();await p.locator('.im2-im-mute').waitFor();await shot('05');await p.getByRole('button',{name:/白名单/}).click();await p.locator('.im2-im-whitelist').waitFor();
 await p.getByRole('button',{name:'返回',exact:true}).click();await p.getByRole('radio',{name:'定时禁言',exact:true}).click();await p.locator('.im2-im-schedule').waitFor();await shot('14');
 await p.getByRole('switch',{name:'重复周期',exact:true}).click();await shot('15');await p.getByRole('button',{name:'完成',exact:true}).click();await p.locator('.im2-im-mute').waitFor();await p.getByRole('button',{name:/白名单/}).click();await p.locator('.im2-im-whitelist').waitFor();for(const name of ['石梁雅','董巧珑','越秋'])await p.getByRole('button',{name:'移除'+name,exact:true}).click();await p.getByRole('button',{name:'返回',exact:true}).click();await p.locator('.im2-im-mute').waitFor();await shot('13');
 await open('im-select?purpose=create',816);for(const name of ['官文','金刚保','李树洁'])await p.getByRole('checkbox',{name:'选择'+name,exact:true}).check();await shot('10');
 for(const name of ['官文','金刚保','李树洁'])await p.getByRole('checkbox',{name:'选择'+name,exact:true}).uncheck();for(const name of ['石梁雅','董巧珑','越秋'])await p.getByRole('checkbox',{name:'选择'+name,exact:true}).check();await p.locator('.im2-selection-footer>button').first().click();await p.getByRole('dialog').waitFor();await shot('11');
 await open('im-meeting');await shot('16');await open('im-join');await shot('17');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);await fs.writeFile(out+'visual-verification.json',JSON.stringify({capturedStates:15,errors,failed},null,2));console.log('Captured 15 matching reference states; no page or resource errors');
}finally{await b.close()}
