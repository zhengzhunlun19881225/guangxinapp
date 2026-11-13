import {spawn} from 'node:child_process';
import {once} from 'node:events';
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'5318'},stdio:['ignore','pipe','pipe']});
try{
 await Promise.race([once(server.stdout,'data'),once(server,'exit').then(()=>{throw Error('Production preview failed to start')})]);
 process.env.BASE_URL='http://127.0.0.1:5318/';
 if(process.env.CHECK_SERVICE_AND_CORE==='1'){await import('./verify-service-alerts.mjs');await import('./verify-browser.mjs')}
 else if(process.env.CHECK_SERVICE_ONLY==='1')await import('./verify-service-alerts.mjs');
 else if(process.env.CHECK_HOTSPOTS_ONLY==='1')await import('./verify-hotspots.mjs');
 else if(process.env.CHECK_GROUP_DETAIL_ONLY==='1')await import('./verify-group-detail.mjs');
 else if(process.env.CHECK_GROUP_NEWS_ONLY==='1')await import('./verify-group-news.mjs');
 else if(process.env.CHECK_NEWS_AND_CORE==='1'){await import('./verify-portal-news.mjs');await import('./verify-news-tools.mjs');await import('./verify-browser.mjs')}
 else if(process.env.CHECK_APPS_AND_CORE==='1'){await import('./verify-apps.mjs');await import('./verify-browser.mjs')}
 else if(process.env.CHECK_NEWS_ONLY==='1'){await import('./verify-portal-news.mjs');await import('./verify-news-tools.mjs')}
 else if(process.env.CHECK_NEWS_TOOLS_ONLY==='1')await import('./verify-news-tools.mjs');
 else if(process.env.CHECK_APP_REFINEMENT_ONLY==='1')await import('./verify-app-refinement.mjs');
 else if(process.env.CHECK_APPS_ONLY==='1')await import('./verify-apps.mjs');
 else if(process.env.CHECK_PORTAL_FILTERS_ONLY==='1')await import('./verify-portal-filters.mjs');
 else if(process.env.CHECK_THEME_ONLY==='1')await import('./verify-theme.mjs');
 else if(process.env.CHECK_SPEC_ONLY==='1')await import('./verify-spec.mjs');
 else if(process.env.CHECK_SCHEDULE_ONLY==='1')await import('./verify-schedule.mjs');
 else if(process.env.CHECK_WORKBENCH_ONLY==='1')await import('./verify-workbench.mjs');
 else if(process.env.CHECK_MAP_ONLY==='1')await import('./verify-map.mjs');
 else if(process.env.CHECK_IM_ONLY==='1')await import('./verify-im.mjs');
 else await import('./verify-browser.mjs');
}finally{server.kill()}
