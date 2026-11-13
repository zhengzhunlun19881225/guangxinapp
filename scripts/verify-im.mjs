import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=new URL('../output/playwright/im-secondary/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status())});
const base=process.env.BASE_URL||'http://localhost:5317/';
async function open(route){await page.goto(base+'#/'+route);await page.locator('.route-'+route.split('?')[0]).waitFor();if(route.startsWith('im-'))await page.locator('.im2-flow').waitFor();else{const roots={im:'0:5932',contacts:'0:5708'};if(roots[route])await page.locator('.scene-layer [data-node-id="'+roots[route]+'"]').first().waitFor()}await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready)}
async function screenshot(name){if(await page.locator('.scene-loading').count())await page.locator('.scene-loading').waitFor({state:'hidden'});if(await page.locator('.toast').count())await page.locator('.toast').waitFor({state:'hidden'});await page.evaluate(()=>Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>null))));await page.screenshot({path:fileURLToPath(new URL(name+'.png',output))})}
async function routeIs(route){await page.locator('.route-'+route+' .im2-'+route).waitFor();assert.match(page.url(),new RegExp('#/'+route+'(?:\\?|$)'))}
async function checkImages(){assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[])}
const back=()=>page.getByRole('button',{name:'返回',exact:true}).click();
try{
 for(const route of ['im','contacts']){await open(route);await screenshot('primary-'+route+'-after');await checkImages()}
 await open('contacts');await page.getByRole('button',{name:/我的群组/}).click();await routeIs('im-groups');await screenshot('04-groups');
 await page.getByRole('tab',{name:'我创建的',exact:true}).click();assert.equal(await page.locator('.im2-group-list>.im2-person-row').count(),1);
 await page.getByRole('tab',{name:'我加入的',exact:true}).click();await page.getByRole('textbox',{name:'搜索群组',exact:true}).fill('不存在的群');assert.match(await page.locator('.im2-body').innerText(),/未找到相关群组/);await page.getByRole('textbox',{name:'搜索群组',exact:true}).fill('');
 await page.getByRole('button',{name:/业务沟通组 \(10\)/}).click();await routeIs('im-chat');await page.getByRole('button',{name:'聊天设置',exact:true}).click();await routeIs('im-settings');await screenshot('09-group-settings');
 await page.getByRole('switch',{name:'消息免打扰',exact:true}).click();assert.equal(await page.getByRole('switch',{name:'消息免打扰',exact:true}).getAttribute('aria-checked'),'true');
 await page.getByRole('button',{name:'群内禁言',exact:true}).click();await page.getByRole('radio',{name:'始终禁言',exact:true}).click();await screenshot('05-mute-always');
 await page.getByRole('button',{name:/白名单/}).click();await routeIs('im-whitelist');await screenshot('06-whitelist-empty');
 await page.getByRole('button',{name:'添加成员',exact:true}).click();await routeIs('im-select');
 for(const name of ['石梁雅','董巧珑','越秋'])await page.getByRole('checkbox',{name:'选择'+name,exact:true}).check();
 await screenshot('07-select-members');
 await page.getByRole('button',{name:/已选择/}).click();assert.equal(await page.getByRole('dialog').count(),1);await screenshot('11-selected-sheet');
 await page.getByRole('button',{name:'取消选择董巧珑',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/已选择 \(2\)/);
 await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click();await page.getByRole('checkbox',{name:'选择董巧珑',exact:true}).check();
 await page.locator('.im2-selection-footer').getByRole('button',{name:'确定',exact:true}).click();await routeIs('im-whitelist');assert.equal(await page.locator('.im2-person-row').count(),3);await screenshot('12-whitelist-filled');
 await page.reload();await page.locator('.im2-person-row').first().waitFor();assert.equal(await page.locator('.im2-person-row').count(),3);
 await page.getByRole('button',{name:'移除越秋',exact:true}).click();assert.equal(await page.locator('.im2-person-row').count(),2);
 await back();await routeIs('im-mute');await page.getByRole('radio',{name:'定时禁言',exact:true}).click();await routeIs('im-schedule');await screenshot('14-schedule-once');
 await back();await routeIs('im-mute');assert.equal(await page.getByRole('radio',{name:'始终禁言',exact:true}).getAttribute('aria-checked'),'true');
 await page.getByRole('radio',{name:'定时禁言',exact:true}).click();await page.getByRole('switch',{name:'重复周期',exact:true}).click();await screenshot('15-schedule-repeat');
 await page.locator('input[aria-label="结束时间"]').fill('08:00');await page.getByRole('button',{name:'完成',exact:true}).click();assert.match(await page.getByRole('alert').innerText(),/结束时间须晚于/);
 await page.locator('input[aria-label="结束时间"]').fill('12:33');await page.getByRole('button',{name:'完成',exact:true}).click();await routeIs('im-mute');assert.equal(await page.getByRole('radio',{name:'定时禁言',exact:true}).getAttribute('aria-checked'),'true');await screenshot('13-mute-scheduled');
 await back();await page.getByRole('button',{name:'查看更多群员',exact:true}).click();await routeIs('im-members');assert.equal(await page.locator('.im2-person-row').count(),10);await back();
 await page.locator('.im2-row').filter({hasText:'群聊名称'}).click();await routeIs('im-group-name');await page.getByRole('textbox',{name:'群聊名称',exact:true}).fill('业务沟通组 · 已更新');await page.getByRole('button',{name:'保存',exact:true}).click();assert.match(await page.locator('.im2-group-settings').innerText(),/业务沟通组 · 已更新/);
 checks.push('groups/tabs/search; settings persisted; whitelist selection/drawer/remove/persist; schedule validation/cancel/repeat/save; members and rename');
 await open('im-chat?name='+encodeURIComponent('石梁雅'));await screenshot('01-chat');await page.getByRole('textbox',{name:'消息内容',exact:true}).fill('验收消息');await page.getByRole('button',{name:'发送消息',exact:true}).click();assert.match(await page.locator('.im2-messages').innerText(),/验收消息/);
 await page.getByRole('button',{name:'查看聊天图片',exact:true}).first().click();assert.equal(await page.getByRole('dialog',{name:'聊天图片',exact:true}).count(),1);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
 await page.getByRole('button',{name:'聊天设置',exact:true}).click();await screenshot('08-person-settings');await page.getByRole('button',{name:'聊天记录',exact:true}).click();await page.getByRole('textbox',{name:'搜索聊天记录',exact:true}).fill('验收消息');assert.equal(await page.locator('.im2-record').count(),1);
 checks.push('single chat send, image preview/Escape, chat history search');
 await open('im-groups?origin=contacts');await page.getByRole('button',{name:'创建群',exact:true}).click();await page.getByRole('checkbox',{name:'选择石梁雅',exact:true}).check();await page.getByRole('checkbox',{name:'选择官文',exact:true}).check();await screenshot('10-create-selection');await page.locator('.im2-selection-footer').getByRole('button',{name:'确定',exact:true}).click();await routeIs('im-chat');await page.getByRole('button',{name:'聊天设置',exact:true}).click();await routeIs('im-settings');assert.equal(await page.locator('.im2-members-grid .im2-avatar').count(),3);
 await page.getByRole('button',{name:'添加群成员',exact:true}).click();await page.getByRole('checkbox',{name:'选择越秋',exact:true}).check();await page.locator('.im2-selection-footer').getByRole('button',{name:'确定',exact:true}).click();await routeIs('im-settings');assert.equal(await page.locator('.im2-members-grid .im2-avatar').count(),4);
 await page.getByRole('button',{name:'移除群成员',exact:true}).click();assert.equal(await page.getByRole('checkbox',{name:'选择我',exact:true}).isDisabled(),true);await page.getByRole('checkbox',{name:'选择越秋',exact:true}).check();await page.locator('.im2-selection-footer').getByRole('button',{name:'确定',exact:true}).click();await routeIs('im-settings');assert.equal(await page.locator('.im2-members-grid .im2-avatar').count(),3);
 await page.getByRole('button',{name:'解散群聊',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'取消',exact:true}).click();assert.equal(await page.getByRole('dialog').count(),0);await page.getByRole('button',{name:'解散群聊',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click();await routeIs('im-groups');
 checks.push('create group, add/remove members, owner protected, cancel/confirm disband');
 await open('im');await page.getByRole('button',{name:'添加联系人或群聊',exact:true}).click();await page.getByRole('button',{name:'加入会议',exact:true}).click();await routeIs('im-join');assert.equal(await page.getByRole('button',{name:'加入会议',exact:true}).isDisabled(),true);await screenshot('17-join-meeting');await page.getByRole('textbox',{name:'会议ID',exact:true}).fill('123456789');assert.equal(await page.getByRole('button',{name:'加入会议',exact:true}).isEnabled(),true);await page.getByRole('switch',{name:'摄像头',exact:true}).click();await page.getByRole('button',{name:'加入会议',exact:true}).click();assert.match(await page.locator('.im2-body').innerText(),/本地会议预览/);await page.getByRole('button',{name:'结束预览',exact:true}).click();
 await open('im-meeting');await screenshot('16-start-meeting');await page.locator('.im2-meeting-participants>.im2-row').click();await page.getByRole('checkbox',{name:'选择官文',exact:true}).uncheck();await page.locator('.im2-selection-footer').getByRole('button',{name:'确定',exact:true}).click();assert.match(await page.locator('.im2-meeting-participants>.im2-row').innerText(),/8人/);await page.getByRole('button',{name:'开始会议',exact:true}).click();assert.match(await page.locator('.im2-body').innerText(),/本地会议预览/);
 checks.push('plus menu/meeting entry; numeric ID validation; mic/camera toggles; meeting participants; start/join/end local preview');
 await open('im-enterprise?origin=contacts');await page.getByRole('textbox',{name:'搜索企业联系人',exact:true}).fill('石梁雅');assert.equal(await page.locator('.im2-person-row').count(),1);await page.locator('.im2-person-row').click();await routeIs('im-profile');await page.getByRole('button',{name:'发消息',exact:true}).click();await routeIs('im-chat');
 checks.push('enterprise directory search/profile/send message');
 for(const width of [320,375,390,430,1440]){
  await page.setViewportSize({width,height:width===1440?1000:812});
  for(const route of ['im-chat','im-groups','im-settings?group=business','im-select?purpose=whitelist&group=business','im-schedule?group=business','im-meeting','im-join']){
   await open(route);await checkImages();const bounds=await page.locator('.im2-flow').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('.im2-body').evaluate(el=>el.scrollWidth>el.clientWidth+1),false,route+' internal overflow');
   const footer=page.locator('.im2-home');const box=await footer.boundingBox();assert.ok(box.y+box.height<= (width===1440?1000:812)+1,route+' home indicator clipped');
  }
  checks.push(width+'px responsive boundaries, internal overflow, fixed controls, assets');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 await fs.writeFile(new URL('verification.json',output),JSON.stringify({checks,errors,failed},null,2));console.log(JSON.stringify({checks,errors,failed},null,2));
}finally{await browser.close()}
