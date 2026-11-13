import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=new URL('../output/playwright/im-additions/',import.meta.url);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:375,height:812},timezoneId:'America/Los_Angeles'}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
const base='http://127.0.0.1:5317/#/';
const open=async route=>{await page.goto(base+route);await page.waitForLoadState('networkidle')};
const shot=async name=>page.screenshot({path:new URL(name+'.png',out).pathname});
try{
 await page.goto(base+'im');await page.evaluate(()=>localStorage.clear());
 await open('im');await page.getByRole('button',{name:'添加联系人或群聊',exact:true}).click();await page.getByRole('button',{name:'设置',exact:true}).click();await page.locator('.im2-im-preferences').waitFor();
 await page.getByRole('radio',{name:'振动',exact:true}).click();await page.getByRole('switch',{name:'开启消息通知',exact:true}).click();assert.equal(await page.getByRole('switch',{name:'开启消息提示音',exact:true}).isDisabled(),true);assert.equal(await page.getByRole('radio',{name:'振动',exact:true}).isDisabled(),true);
 await page.reload();await page.locator('.im2-im-preferences').waitFor();assert.equal(await page.getByRole('switch',{name:'开启消息通知',exact:true}).getAttribute('aria-checked'),'false');await page.getByRole('switch',{name:'开启消息通知',exact:true}).click();assert.equal(await page.getByRole('radio',{name:'振动',exact:true}).getAttribute('aria-checked'),'true');await shot('preferences-375');
 await page.getByRole('button',{name:'账号与安全',exact:true}).click();await page.getByRole('textbox',{name:'账号昵称',exact:true}).fill('测试管理员');await page.getByRole('button',{name:'保存昵称',exact:true}).click();await page.reload();assert.equal(await page.getByRole('textbox',{name:'账号昵称',exact:true}).inputValue(),'测试管理员');await page.getByRole('button',{name:'返回',exact:true}).click();
 await page.getByRole('button',{name:'退出登录',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'取消',exact:true}).click();assert.equal(await page.getByRole('dialog').count(),0);await page.getByRole('button',{name:'退出登录',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click();await page.locator('.im2-im-login').waitFor();await open('im-chat?name=石梁雅');await page.locator('.im2-im-login').waitFor();await page.getByRole('button',{name:'进入 IM 演示',exact:true}).click();await page.locator('.im-list').waitFor();
 await open('im-chat?name=姜德强');await page.getByRole('textbox',{name:'消息内容',exact:true}).fill('列表联动验收');await page.getByRole('button',{name:'发送消息',exact:true}).click();await page.getByRole('button',{name:'聊天设置',exact:true}).click();
 const pin=page.getByRole('switch',{name:'置顶聊天',exact:true});if(await pin.getAttribute('aria-checked')==='true')await pin.click();await pin.click();await page.getByRole('switch',{name:'消息免打扰',exact:true}).click();await open('im');const first=page.locator('.conversation-row').first();assert.match(await first.innerText(),/姜德强/);assert.match(await first.innerText(),/列表联动验收/);assert.equal(await first.locator('[aria-label=已置顶]').count(),1);assert.equal(await first.locator('[aria-label=免打扰]').count(),1);assert.equal(await first.locator('.badge').count(),0);await shot('conversation-linked-375');
 await first.click();await page.getByRole('button',{name:'聊天设置',exact:true}).click();await page.getByRole('button',{name:'拉黑',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click();await page.getByRole('button',{name:'返回',exact:true}).click();await page.getByRole('textbox',{name:'消息内容',exact:true}).fill('应被拦截');await page.getByRole('button',{name:'发送消息',exact:true}).click();assert.doesNotMatch(await page.locator('.im2-messages').innerText(),/应被拦截/);assert.equal(await page.getByRole('textbox',{name:'消息内容',exact:true}).inputValue(),'应被拦截');
 // Thursday 09:30 Beijing, Wednesday 17:30 in the browser's configured timezone.
 await page.clock.install({time:new Date('2026-11-12T01:30:00Z')});
 await page.evaluate(()=>{localStorage.setItem('gx-app-im2-settings',JSON.stringify({'group-customer':{pinned:false,quiet:false,blocked:false,mute:'scheduled',whitelist:[],schedule:{repeat:true,days:[4],start:'2026-11-12T09:00',end:'2026-11-12T12:00'}}}))});
 await page.reload();
 await open('im-chat?group=customer');await page.getByRole('textbox',{name:'消息内容',exact:true}).fill('禁言时段测试');await page.getByRole('button',{name:'发送消息',exact:true}).click();assert.doesNotMatch(await page.locator('.im2-messages').innerText(),/禁言时段测试/);assert.equal(await page.getByRole('textbox',{name:'消息内容',exact:true}).inputValue(),'禁言时段测试');
 await page.clock.setFixedTime(new Date('2026-11-12T04:00:00Z'));await page.getByRole('button',{name:'发送消息',exact:true}).click();assert.match(await page.locator('.im2-messages').innerText(),/禁言时段测试/);
 await page.clock.resume();
 for(const width of [320,375,430,1440]){await page.setViewportSize({width,height:900});await open('im-preferences');assert.equal(await page.locator('.im2-body').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await shot('preferences-'+width)}
 assert.deepEqual(errors,[]);console.log('PASS: global preferences and persistence, account nickname, logout/cancel/reentry guard, list pin/quiet/latest message, block sending, Beijing scheduled mute boundaries, 320–1440px layouts');
}finally{await browser.close()}
