import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=new URL('../output/playwright/overview-typography/',import.meta.url);await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
const base='http://localhost:5317/';
try{
 await page.goto(base+'#/portal-overview');await page.locator('.route-portal-overview').waitFor();await page.waitForTimeout(1200);await page.evaluate(()=>document.fonts.ready);
 const styles=await page.evaluate(()=>{const read=id=>{const e=document.querySelector(`[data-node-id="${id}"]`);const s=e&&getComputedStyle(e);return e&&s?{font:s.font,fontSize:s.fontSize,lineHeight:s.lineHeight,fontWeight:s.fontWeight,letterSpacing:s.letterSpacing}:null};return{title:read('0:6646'),cardHeading:read('0:6258'),value:read('0:6203'),summary:read('0:6230'),taxHeading:read('0:6281'),innovationHeading:read('0:6487')}});
 if(styles.title.fontSize!=='18px'||styles.title.fontWeight!=='600'||styles.cardHeading.fontSize!=='16px'||styles.cardHeading.fontWeight!=='600'||styles.value.fontSize!=='18px'||styles.value.fontWeight!=='600'||styles.summary.fontWeight!=='600')throw new Error('Typography tokens drifted: '+JSON.stringify(styles));
 const widths={};for(const width of [320,375,430,1440]){await page.setViewportSize({width,height:812});await page.waitForTimeout(100);widths[width]={documentOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),routeOverflow:await page.locator('.route-portal-overview').evaluate(el=>el.scrollWidth>el.clientWidth)};if(widths[width].documentOverflow||widths[width].routeOverflow)throw new Error('overflow '+width)}
 await page.setViewportSize({width:375,height:812});await page.screenshot({path:fileURLToPath(new URL('final-375.png',output)),fullPage:true});
 const report={result:'passed',styles,widths,errors};await fs.writeFile(new URL('report.json',output),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
