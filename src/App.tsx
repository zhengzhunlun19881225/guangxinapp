import {lazy,Suspense,useCallback,useEffect,useLayoutEffect,useRef,useState,type ComponentType,type FormEvent,type CSSProperties} from 'react';
import manifest from './manifest.json';
import type {ComposerRequest} from './components/Composer';
import type {ComposerAttachment} from './components/attachmentStore';
import {assets} from './assets';
import {contacts,historyItems,mascot,questions,readLocal,roles,saveLocal,type Message} from './data';
import {Asset,Calendar,Composer,Directory,MessagingList,Search,Todo} from './components/Controls';
import type {Action,SceneProps} from './components/SceneAction';
import MobileSpec from './components/MobileSpec';
import ProfilePage,{ProfilePanel} from './components/ProfilePage';
import ToastMessage from './components/ToastMessage';
import RecentForms,{RecentFormsList,RecentFormEditor} from './components/RecentForms';
import DailyBrief from './components/DailyBrief';
import AnniversaryGreeting from './components/AnniversaryGreeting';
import {DailyBriefHistory,DailyBriefSources} from './components/BriefDialogs';
import PortalFilters,{PortalFilterForm} from './components/PortalFilters';
import ShortcutCard from './apps/ShortcutCard';
import OverlayScrollbars from './components/OverlayScrollbars';
import ResearchUpdates from './components/ResearchUpdates';
import ProjectInvestments,{InvestmentFilterForm,defaultInvestmentFilters,type InvestmentFilters} from './components/ProjectInvestments';
import {findWorkbenchTask} from './data/workbenchTasks';
import TodoDetail,{referenceTodos,TodoDetailList} from './components/TodoDetail';
import MeetingDetail from './components/MeetingDetail';
import CloseButton from './components/CloseButton';
import TravelDocuments from './components/TravelDocuments';
import ChatPage from './components/ChatPage';
import AppNavBar,{NavSearchIcon} from './components/AppNavBar';
import LeaderScenePortalToggle from './screens/LeaderScenePortalToggle';
import PortalNews,{PortalNewsPage,PortalNewsDetail} from './components/PortalNews';
import NewsSubscription from './components/NewsSubscription';
import GroupNews from './components/GroupNews';
import ServiceAlerts,{ServiceAlertsDetail} from './components/ServiceAlerts';
import HotspotTracking,{HotspotDetail,hotspotTitle} from './components/HotspotTracking';
import {readHotspotSettings} from './data/hotspotSubscriptions';
const GroupNewsDetail=lazy(()=>import('./components/GroupNewsDetail'));
const GroupNewsArticle=lazy(()=>import('./components/GroupNewsDetail').then(module=>({default:module.GroupNewsArticle})));
import {readSubscription} from './data/newsSubscription';
import {readNewsFeedback,type NewsFeedback} from './data/portalNews';
const ApplicationsPage=lazy(()=>import('./apps/ApplicationsPage'));
import {imRoutes,imTitles,initialGroups} from './im/data';
import {readScheduleEvents,scheduleRoutes,scheduleTitle,scheduleTitles} from './schedule/data';
import {featureRoutes,featureTitles,startShare} from './features/data';
const FeaturePages=lazy(()=>import('./features/FeaturePages'));
const SkillTreePicker=lazy(()=>import('./components/SkillTreePicker'));
const ImPages=lazy(()=>import('./im/ImPages'));
const SchedulePages=lazy(()=>import('./schedule/SchedulePages'));
const scenes:Record<string,ComponentType<SceneProps>>={
 chat:lazy(()=>import('./screens/ChatScene')),history:lazy(()=>import('./screens/HistoryScene')),
 skills:lazy(()=>import('./screens/SkillsScene')),agents:lazy(()=>import('./screens/AgentsScene')),
 contacts:lazy(()=>import('./screens/ContactsScene')),im:lazy(()=>import('./screens/ImScene')),
 'portal-overview':lazy(()=>import('./screens/OverviewScene')),workbench:lazy(()=>import('./screens/WorkbenchScene')),
 'portal-manager':lazy(()=>import('./screens/ManagerScene')),'portal-leader':lazy(()=>import('./screens/LeaderScene')),
 'portal-staff':lazy(()=>import('./screens/StaffScene'))};
const validRoutes=[...manifest.map(p=>p.route),'profile','canvases','mobile-spec','apps','portal-news','group-news-detail',...imRoutes,...scheduleRoutes,...featureRoutes];
const navMasks=['','nav-workbench.svg','nav-portal.svg','nav-im.svg','nav-profile.svg'];
function currentRoute(){
  const hashRoute=location.hash.replace(/^#\/?/,'').split('?')[0];
  const captureRoute=(new URLSearchParams(location.search).get('route')||'').split('?')[0];
  const r=hashRoute==='figmacapture'?captureRoute:hashRoute;
  return validRoutes.includes(r)?r:'chat';
}

function Modal({action,close,children}:{action:Action;close:()=>void;children:React.ReactNode}){
  const ref=useRef<HTMLDivElement>(null);
  const isArticle=action.type==='portal-news-detail'||action.type==='group-news-detail';
  const isRecord=['approve','todo-detail','meeting-detail'].includes(action.type);
  const recordTitle=action.type==='meeting-detail'?readScheduleEvents().find(event=>event.id===action.value):undefined;
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement;
    ref.current?.querySelector<HTMLElement>('button,input,select,textarea')?.focus();
    function key(e:KeyboardEvent){
      if(e.key==='Escape') close();
      if(e.key==='Tab'){
        const nodes=Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,textarea,a[href],[tabindex="0"]')||[]);
        if(!nodes.length)return;
        const first=nodes[0],last=nodes[nodes.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    }
    document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('keydown',key);previous?.focus()};
  },[close]);
  return <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)close()}}>
    <section className={'modal-sheet app-close-surface modal-'+action.type+(isArticle?' modal-article':'')+(isRecord?' modal-record':'')} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
      <header className={isArticle?'article-closebar':undefined}>{!isArticle&&<h2 id="modal-title">{isRecord?(recordTitle?scheduleTitle(recordTitle):findWorkbenchTask(action.value)?.title||action.value):action.type==='roles'?'切换门户':(action.type==='portal-news-detail'||action.type==='group-news-detail')?'资讯详情':action.type==='service-alerts'?(action.value==='all'?'全部智能提醒':'智能提醒详情'):action.type.startsWith('hotspot-')?hotspotTitle(action):action.value}</h2>}<CloseButton aria-label="关闭弹窗" onClick={close}/></header>
      <div className="modal-body">{children}</div>
    </section>
  </div>;
}

function DemoForm({title,onDone}:{title:string;onDone:(text:string)=>void}){
  const [name,setName]=useState(''),[reason,setReason]=useState(''),[start,setStart]=useState(''),[end,setEnd]=useState('');
  function submit(e:FormEvent){e.preventDefault();if(end&&start&&end<start)return;
    const item={title,name,reason,start,end,id:Date.now()};
    const saved=saveLocal('applications',[...readLocal<unknown[]>('applications',[]),item]);
    onDone(saved?'已保存'+title+'，可在“我的申请”中查看':'本机存储不可用，请保留填写内容');}
  return <form className="demo-form" onSubmit={submit}>
    <label>{title==='添加联系人'?'姓名或手机号':'申请人'}<input required value={name} onChange={e=>setName(e.target.value)} placeholder="请输入"/></label>
    {title!=='添加联系人'&&<div className="date-fields"><label>开始日期<input type="date" required value={start} onChange={e=>setStart(e.target.value)}/></label>
      <label>结束日期<input type="date" required min={start} value={end} onChange={e=>setEnd(e.target.value)}/></label></div>}
    <label>{title==='添加联系人'?'备注':'申请事由'}<textarea required value={reason} onChange={e=>setReason(e.target.value)} placeholder="请填写详细信息" rows={4}/></label>
    <p className="demo-note">填写内容保存在本机，用于交互演示。</p><button className="primary-button" type="submit">提交申请</button>
  </form>;
}
function Conversation({name}:{name:string}){
  const key='messages-'+name;
  const [messages,setMessages]=useState<Message[]>(()=>readLocal<Message[]>(key,[{role:'assistant',text:'下午1点30分有一个需求沟通会议，请提前准备好相关资料。'}]));
  const [text,setText]=useState('');
  function send(e:FormEvent){e.preventDefault();if(!text.trim())return;
    const next:Message[]=[...messages,{role:'user',text:text.trim()}];setMessages(next);saveLocal(key,next);setText('')}
  return <><div className="im-thread">{messages.map((m,i)=><div key={i} className={'message '+m.role}><small>{m.role==='user'?'我':name}</small><p>{m.text}</p></div>)}</div>
    <form className="im-send" onSubmit={send}><input aria-label="消息内容" placeholder="发送消息" value={text} onChange={e=>setText(e.target.value)}/><button className="primary-button" disabled={!text.trim()}>发送</button></form>
    <p className="demo-note">本机会话演示</p></>;
}

export default function App(){
  const [requestedRoute,setRoute]=useState(currentRoute),[modal,setModal]=useState<Action|null>(null),[toast,setToast]=useState('');
  const [requestedLocationKey,setLocationKey]=useState(()=>location.hash.startsWith('#figmacapture')?`#/${new URLSearchParams(location.search).get('route')||''}`:location.hash),[deviceHeight,setDeviceHeight]=useState(812);
  const [wideWorkspace,setWideWorkspace]=useState(()=>matchMedia('(min-width:1200px)').matches);
  const [preview,setPreview]=useState(()=>({route:currentRoute()==='mobile-spec'?'workbench':currentRoute(),locationKey:location.hash}));
  const previewRoute=wideWorkspace&&requestedRoute==='mobile-spec'?preview.route:requestedRoute;
  const route=readLocal<boolean>('im2-session',true)===false&&(previewRoute==='im'||previewRoute==='contacts'||imRoutes.includes(previewRoute)||(previewRoute.startsWith('im-')&&featureRoutes.includes(previewRoute)))?'im-login':previewRoute;
  const locationKey=wideWorkspace&&requestedRoute==='mobile-spec'?preview.locationKey:requestedLocationKey;
  const [zoom,setZoom]=useState(1),[historySearch,setHistorySearch]=useState(''),[selectedAgent,setSelectedAgent]=useState('');
  const [messages,setMessages]=useState<Message[]>(()=>readLocal<Message[]>('ai-messages',[]));
  const [skillTreeOpen,setSkillTreeOpen]=useState(false);
  const [composerMode,setComposerMode]=useState(()=>readLocal('composer-mode-v2',''));
  const [chatActive,setChatActive]=useState(()=>readLocal<Message[]>('ai-messages',[]).length>0),[composerRequest,setComposerRequest]=useState<ComposerRequest>({id:0,mode:''});
  const [savedHistory,setSavedHistory]=useState<string[]>(()=>readLocal<string[]>('history',[]));
  const [role,setRole]=useState(()=>readLocal('portal-role','portal-overview'));
  const [company,setCompany]=useState('全部企业'),[year,setYear]=useState('2026年');
  const [modalSearch,setModalSearch]=useState(''),[todoVersion,setTodoVersion]=useState(0),[mapScale,setMapScale]=useState(1);
  const [newsSubscription,setNewsSubscription]=useState(readSubscription);
  const [newsFeedback,setNewsFeedback]=useState(readNewsFeedback);
  const [hotspotTopic,setHotspotTopic]=useState('competitor');
  const [hiddenServiceAlerts,setHiddenServiceAlerts]=useState<string[]>([]);
  const [serviceAlertHeight,setServiceAlertHeight]=useState(310);
  const [groupNewsHeight,setGroupNewsHeight]=useState(594);
  const [investmentHeight,setInvestmentHeight]=useState(422);
  const [researchHeight,setResearchHeight]=useState(230);
  const [dailyBriefHeight,setDailyBriefHeight]=useState(720);
  const [investmentFilters,setInvestmentFilters]=useState<InvestmentFilters>({...defaultInvestmentFilters});
  const serviceAlertOffset=['portal-leader','portal-manager'].includes(route)?serviceAlertHeight-310:0;
  const groupNewsOffset=['portal-staff','portal-manager','portal-leader'].includes(route)?groupNewsHeight-594:0;
  const [hotspotSettings,setHotspotSettings]=useState(readHotspotSettings);
  const scroll=useRef<HTMLDivElement>(null),device=useRef<HTMLDivElement>(null);
  const navigate=useCallback((r:string)=>{setModal(null);if(r==='skill-tree'){setSkillTreeOpen(true);return}setSkillTreeOpen(false);if(r==='chat')setChatActive(false);location.hash='/'+r;setModal(null)},[]);
  const closeModal=useCallback(()=>setModal(null),[]);
  useEffect(()=>{const handler=()=>{const next=currentRoute();setRoute(next);if(next!=='mobile-spec')setPreview({route:next,locationKey:location.hash});setHistorySearch('');setModal(null);setSkillTreeOpen(false);setComposerRequest({id:0,mode:''});scroll.current?.scrollTo(0,0)};
    const locationHandler=()=>{setLocationKey(location.hash);handler()};
    window.addEventListener('hashchange',locationHandler);return()=>window.removeEventListener('hashchange',locationHandler)},[]);
  useEffect(()=>{const media=matchMedia('(min-width:1200px)');const update=()=>setWideWorkspace(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
  useEffect(()=>{if(wideWorkspace&&requestedRoute==='mobile-spec')document.querySelector<HTMLElement>('.desktop-spec-scroll')?.focus({preventScroll:true})},[wideWorkspace,requestedRoute]);
  useLayoutEffect(()=>{const observer=new ResizeObserver(entries=>{
    const baseline=parseFloat(getComputedStyle(entries[0].target).getPropertyValue('--app-design-width'));
    setZoom(entries[0].contentRect.width/baseline);
    setDeviceHeight(entries[0].contentRect.height);
  });
    if(device.current)observer.observe(device.current);return()=>observer.disconnect()},[]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),2500);return()=>clearTimeout(id)},[toast]);
  useEffect(()=>{document.title=(route==='apps'&&new URLSearchParams(locationKey.split('?')[1]).get('module')==='portal'?'添加系统':manifest.find(p=>p.route===route)?.name||imTitles[route]||featureTitles[route]||scheduleTitles[route]||({'profile':'我的','canvases':'全部画布','mobile-spec':'手机规范','apps':'添加应用','portal-news':'AI 智能资讯','group-news-detail':'资讯详情'}[route])||'我的')+' · 广智新 App'},[route,locationKey]);
  useEffect(()=>{setModalSearch('')},[modal?.type,modal?.value]);
  const notify=(s:string)=>setToast(s);
  function recordNewsFeedback(id:string,value:NewsFeedback){
    const next={...newsFeedback};
    if(next[id]===value)delete next[id];else next[id]=value;
    setNewsFeedback(next);
    const saved=saveLocal('news-feedback',next);
    notify(saved?(next[id]?(value==='interested'?'已标记为感兴趣':'已记录：减少此类'):'已取消偏好'):'已在本次会话记录，未能保存到本机');
  }
  function send(text:string,attachments?:ComposerAttachment[]){
    const answer='数据监测与优化策略\n\n一、关键指标\n为贯彻落实政府服务数字化转型要求，提升服务效率与质量，建议加快推进智能问答与反检系统建设。\n\n二、当前存在的问题\n两系统应协同联动，形成服务质检改进闭环机制，实现数据共享与动态优化。';
    const next:Message[]=[...messages,{role:'user',text,...(attachments?.length?{attachments:attachments.map(({text:_text,...item})=>item)}:{})},{role:'assistant',text:attachments?.length?'已收到 '+attachments.length+' 个附件。可点击文件卡片预览或下载。当前尚未连接附件分析服务，暂不能根据附件生成回答。':answer,...(attachments?.length?{plain:true}:{})}];
    if(!saveLocal('ai-messages',next)){notify('消息保存失败，请保留内容后重试');return false}
    setMessages(next);
    const hs=[text,...savedHistory.filter(v=>v!==text)];setSavedHistory(hs);saveLocal('history',hs);
    if(route!=='chat')navigate('chat');
    setChatActive(true);
    setTimeout(()=>scroll.current?.scrollTo({top:scroll.current.scrollHeight,behavior:'smooth'}),50);
    return true;
  }
  function draftComposer(text:string){
    saveLocal('composer-text',text);setSkillTreeOpen(false);
    if(route!=='chat')navigate('chat');
    setComposerRequest(value=>({id:value.id+1,mode:'',text}));
  }
  function startNewChat(){
    if(!saveLocal('ai-messages',[])){notify('新建对话失败，请重试');return}
    setMessages([]);setChatActive(false);setSelectedAgent('');navigate('chat');scroll.current?.scrollTo(0,0);
  }
  const onAction=(a:Action)=>{
    if(a.type==='new-chat'){startNewChat();return}
    if(a.type==='navigate'){navigate(a.value);return}
    if(a.type==='list'&&['知识库','云盘'].includes(a.value)){navigate(a.value==='知识库'?'knowledge':'cloud-drive');return}
    if(a.type==='composer-agent'||(a.type==='agent'&&['制作PPT','财务自动差旅'].includes(a.value))){setComposerRequest(value=>({id:value.id+1,mode:a.value==='制作PPT'?'PPT生成':a.value==='财务自动差旅'?'AI+财务自动差旅':a.value}));return}
    if(a.type==='agent'&&a.value.includes('智写')){if(route!=='chat'){saveLocal('composer-mode-v2','智能写作');setComposerMode('智能写作');navigate('chat')}else setComposerRequest(value=>({id:value.id+1,mode:'智能写作'}));return}
    if(a.type==='share-answer'){if(!startShare({kind:'text',title:'数据监测与优化策略',text:a.value},locationKey.replace(/^#\//,''),navigate))notify('无法创建分享，请重试');return}
    if(a.type==='conversation'){
      const groups=readLocal('im2-groups',initialGroups),group=groups.find(g=>g.name===a.value||(g.id==='original'&&a.value==='刘磊、胡磊、陈丽、胡可'));
      if(group&&(group.left||group.disbanded)){notify(group.disbanded?'该群聊已解散':'你已退出该群聊');return}
      navigate('im-chat?'+new URLSearchParams({name:a.value,origin:route==='contacts'?'contacts':'im',...(group?{group:group.id}:{})}).toString());return;
    }
    if(a.type==='list'&&['我的群组','发起群聊','企业通讯录','广新集团'].includes(a.value)){
      navigate((a.value==='我的群组'?'im-groups':a.value==='发起群聊'?'im-create-group':'im-enterprise')+'?'+new URLSearchParams({origin:route==='contacts'?'contacts':'im',...(a.value==='发起群聊'?{purpose:'create'}:{})}).toString());return;
    }
    if(a.type==='call'){navigate('im-meeting?'+new URLSearchParams({name:a.value,origin:'contacts'}).toString());return}
    if(a.type==='detail'&&referenceTodos.some(item=>item.title===a.value)){setModal({type:'todo-detail',value:a.value});return}
    if(a.type==='list'&&a.value==='统一待办'){setModal({type:'todo-list',value:'统一待办'});return}
    if(a.type==='question'){draftComposer(a.value);return}
    if(a.type==='attendance'){const t=new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});saveLocal('attendance',t);notify('打卡成功 '+t);return}
    if(a.type==='ignore-reminder'){notify('已忽略此条提醒');return}
    if(a.type==='sync-calendar'){saveLocal('synced-meeting',true);notify('会议已同步到我的日程');return}
    if(a.type==='external-app-tip'){notify(a.value);return}
    if(a.type==='suggestions')return;
    setModal(a);
  };
  const isDirectory=route==='agents'||route==='skills';
  const isMessaging=route==='im'||route==='contacts';
  const isChat=route==='chat'||route==='history';
  const isPortal=route.startsWith('portal-')&&route!=='portal-news';
  const isNews=route==='portal-news'||route==='group-news-detail';
  const isImSecondary=imRoutes.includes(route);
  const isSchedule=scheduleRoutes.includes(route);
  const isApps=route==='apps';
  const isFeature=featureRoutes.includes(route);
  const page=manifest.find(p=>p.route===route);
  const Scene=scenes[route]||scenes.chat;
  const sceneHeight=route==='chat'&&chatActive&&messages.length?Math.max(812,260+messages.reduce((n,m)=>n+100+Math.ceil(m.text.length/19)*24,0)):isChat||isDirectory?812:route==='workbench'?1415+dailyBriefHeight+10:(page?.height||812)+serviceAlertOffset+groupNewsOffset+(route==='portal-overview'?investmentHeight+10+researchHeight-230:0);
  const navItems=[{label:'小新AI',route:'chat',node:''},{label:'工作台',route:'workbench',node:route==='workbench'?'0:7104':'0:6603'},
    {label:'广新门户',route:role,node:isPortal?'0:6600':'0:7098'},{label:'IM',route:'im',node:isMessaging?'236:982':'0:7118'},{label:'我的',route:'profile',node:'0:7128'}];
  const historyRows=[...savedHistory,...historyItems].filter(s=>s.toLowerCase().includes(historySearch.toLowerCase()));
  const showNav=!isChat&&!isDirectory&&route!=='mobile-spec'&&!isImSecondary&&!isSchedule&&!isApps&&!isNews&&!isFeature;
  return <div className="app-shell"><OverlayScrollbars/>
    <aside className="desktop-rail" aria-label="App 页面导航">
      <a href="#/chat" className="rail-brand"><img src={mascot} alt="小新"/>广智新 <span>App</span></a>
      <p>移动端设计预览</p>
      {manifest.map(p=><a key={p.route} href={'#/'+p.route} aria-current={route===p.route?'page':undefined}>{p.name}</a>)}
      <a href="#/canvases" className="rail-all" aria-current={route==='canvases'?'page':undefined}>全部画布 · 11</a>
      <a href="#/mobile-spec" className="rail-spec" aria-current={requestedRoute==='mobile-spec'?'page':undefined}>手机规范</a>
      <small>375px 原稿 · 自适应移动端</small>
    </aside>
    <div className="device" ref={device} style={{'--app-zoom':zoom} as CSSProperties}>
      <div className="device-scroll" ref={scroll}>
        <main className={'artboard route-'+route} style={{zoom,paddingBottom:isFeature?0:undefined,minHeight:isImSecondary||isSchedule||isApps||isNews||isFeature?deviceHeight/zoom:sceneHeight-(['portal-leader','portal-overview'].includes(route)?48:0),'--service-alert-offset':serviceAlertOffset+'px','--group-news-offset':groupNewsOffset+'px','--investment-offset':(investmentHeight+10)+'px','--research-offset':(researchHeight-230)+'px'} as CSSProperties}>
          {route==='chat'?<ChatPage hideWelcome={!!composerMode||!!selectedAgent} active={chatActive} messages={messages} selectedAgent={selectedAgent} history={savedHistory} height={deviceHeight/zoom} onAction={onAction} onHome={()=>{setChatActive(false);scroll.current?.scrollTo(0,0)}} onClearAgent={()=>setSelectedAgent('')}/>:route==='group-news-detail'?<Suspense fallback={<div className="scene-loading">正在加载…</div>}><GroupNewsDetail locationKey={locationKey} height={deviceHeight/zoom} navigate={navigate}/></Suspense>:route==='portal-news'?<PortalNewsPage locationKey={locationKey} height={deviceHeight/zoom} navigate={navigate} onAction={onAction} subscription={newsSubscription}/>:isApps?<Suspense fallback={<div className="scene-loading">正在加载…</div>}><ApplicationsPage locationKey={locationKey} height={deviceHeight/zoom} navigate={navigate} onAction={onAction} notify={notify}/></Suspense>:isSchedule?<Suspense fallback={<div className="scene-loading">正在加载…</div>}><SchedulePages route={route} locationKey={locationKey} height={deviceHeight/zoom} navigate={navigate} notify={notify}/></Suspense>:isFeature?<Suspense fallback={<div className="scene-loading">正在加载…</div>}><FeaturePages key={locationKey} route={route} locationKey={locationKey} height={deviceHeight/zoom} navigate={navigate} notify={notify} ask={draftComposer}/></Suspense>:isImSecondary?<Suspense fallback={<div className="scene-loading">正在加载…</div>}><ImPages route={route} locationKey={locationKey} height={deviceHeight/zoom} navigate={navigate} notify={notify}/></Suspense>:route==='mobile-spec'?<MobileSpec/>:route==='profile'?<ProfilePage onAction={onAction} navigate={navigate}/>:route==='canvases'?<div className="canvas-index"><h1>App 全部画布</h1><p>共 11 张，点击进入对应页面</p>
            <div className="canvas-utilities"><a href="#/mobile-spec"><span>手机规范</span><small>375px · 颜色与字体层级</small><span aria-hidden="true">↗</span></a></div>
            {manifest.map((p,i)=><a href={'#/'+p.route} key={p.nodeId}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{p.name}</strong><small>375 × {p.height}</small></div><i>›</i></a>)}
          </div>:<>
            <div className="scene-layer" style={{height:sceneHeight}}><Suspense fallback={<div className="scene-loading"><img src={mascot} alt="正在加载"/></div>}>
              <Scene onAction={onAction} filters={{company,year,factor:(year==='2026年'?1:year==='2025年'?.91:.84)*(company==='全部企业'||company==='集团合并'?1:.72)}}/></Suspense></div>
            {isDirectory&&<Directory key={route} kind={route as 'agents'|'skills'} onAction={onAction}/>}
            {isMessaging&&<MessagingList key={route} kind={route as 'im'|'contacts'} onAction={onAction}/>}
            {(route==='workbench'||['portal-staff','portal-manager','portal-leader'].includes(route))&&<ShortcutCard key={route} kind={route==='workbench'?'workbench':'portal'} origin={route} onAction={onAction}/>}
            {['portal-staff','portal-manager','portal-leader'].includes(route)&&<><PortalNews key={'news-'+route} route={route} onAction={onAction} subscription={newsSubscription}/><GroupNews key={'group-'+route} route={route} onAction={onAction} onHeightChange={setGroupNewsHeight}/><HotspotTracking key={'hotspot-'+route} topicId={hotspotTopic} onTopicChange={setHotspotTopic} settings={hotspotSettings} onAction={onAction} notify={notify}/></>}
            {['portal-leader','portal-manager'].includes(route)&&<ServiceAlerts onHeightChange={setServiceAlertHeight} hidden={hiddenServiceAlerts} onIgnore={id=>setHiddenServiceAlerts(previous=>[...previous,id])} onAction={onAction}/>}
            {route==='workbench'&&<><Todo key={'todo-'+todoVersion} onAction={onAction}/><RecentForms onAction={onAction}/><Calendar key={'calendar-'+todoVersion} onAction={onAction}/><DailyBrief onAction={onAction} onHeightChange={setDailyBriefHeight}/></>}
            {isDirectory&&<button className="header-hit back-hit" aria-label="返回 AI 对话" onClick={()=>navigate('chat')}/>}
            {['workbench','portal-leader','portal-overview'].includes(route)?<AppNavBar className="app-scene-navbar" title={route==='workbench'?'工作台':<LeaderScenePortalToggle onAction={onAction} active={route as 'portal-leader'|'portal-overview'}/>} left={<button aria-label="切换门户角色" onClick={()=>setModal({type:'roles',value:'切换门户'})}><Asset node={route==='workbench'?'0:7080':route==='portal-overview'?'0:6645':'0:9244'} className="app-navbar-avatar"/></button>} right={<button aria-label="全局搜索" onClick={()=>setModal({type:'search',value:'全局搜索'})}><NavSearchIcon/></button>}/>:(isPortal||route==='workbench')&&<>
              <button className="header-hit avatar-hit" aria-label="切换门户角色" onClick={()=>setModal({type:'roles',value:'切换门户'})}/>
              <button className="header-hit search-hit" aria-label="全局搜索" onClick={()=>setModal({type:'search',value:'全局搜索'})}/>
            </>}
            {route==='portal-overview'&&<>
              <PortalFilters onAction={onAction} company={company} year={year}/>
              <ResearchUpdates onHeightChange={setResearchHeight} onAction={onAction}/>
              <ProjectInvestments onHeightChange={setInvestmentHeight} filters={investmentFilters} onFilter={()=>setModal({type:'investment-filter',value:'项目投资筛选'})} onReset={()=>setInvestmentFilters({...defaultInvestmentFilters})}/>
              <button className="map-zoom map-in" aria-label="放大税金地图" disabled={mapScale>=1.6} onClick={()=>setMapScale(Math.min(+(mapScale+.2).toFixed(1),1.6))}>+</button>
              <button className="map-zoom map-out" aria-label="缩小税金地图" disabled={mapScale<=.8} onClick={()=>setMapScale(Math.max(+(mapScale-.2).toFixed(1),.8))}>−</button>
              <style>{'[data-node-id="0:6351"]{transform:scale('+mapScale+');transform-origin:center}'}</style>
            </>}
          </>}
        </main>
      </div>
      {isChat&&route!=='history'&&<div className="fixed-composer" style={{zoom}}><Composer onSend={send} onAction={onAction} request={composerRequest} onModeChange={setComposerMode}/></div>}
      {isDirectory&&<div className="fixed-home" style={{zoom}}><div className="home-indicator"/></div>}
      {showNav&&<nav className="bottom-nav" aria-label="底部导航" style={{zoom}}>
        {navItems.map((item,i)=>{const active=route===item.route||(i===2&&isPortal)||(i===3&&isMessaging);
          const icon=active&&i!==0&&i!==4?navMasks[i].replace('.svg','-active.svg'):navMasks[i];
          return <button key={item.label} aria-current={active?'page':undefined} onClick={()=>navigate(item.route)} className={i===0?'mascot-nav':''}>
            {i===0?<img src="/assets/ui/xiaoxin-nav.png" alt=""/>:i===3&&active?<img src={'/assets/ui/'+icon} alt=""/>:<span className="nav-icon" aria-hidden style={{maskImage:'url("/assets/ui/'+icon+'")'}}/>}<span>{item.label}</span>
          </button>})}
        <div className="home-indicator"/>
      </nav>}
      {route==='history'&&<div className="history-runtime" style={{zoom}}>
        <button className="history-dismiss" aria-label="关闭历史记录" onClick={()=>navigate('chat')}/>
        <div className="history-drawer">
          <div className="history-search-row"><Search value={historySearch} onChange={setHistorySearch}/><button className="new-chat-button" aria-label="新建对话"
            onClick={startNewChat}>+</button></div>
          <div className="history-rows"><p>近7天</p>{historyRows.map((v,i)=><button key={v+i} onClick={()=>send(v)}>{v}</button>)}
            {!historyRows.length&&<p className="empty-state">未找到历史记录</p>}</div>
          <div className="history-tools">{['智能体·技能','知识库','数字员工管理','云盘'].map((v,i)=><button key={v}
            onClick={()=>i===0?navigate('agents'):onAction({type:'list',value:v})}><Asset node={['0:5002','0:5045','0:5017','0:5038'][i]}/>{v}<i>›</i></button>)}</div>
        </div>
      </div>}
      {skillTreeOpen&&device.current&&<Suspense fallback={null}><SkillTreePicker device={device.current} close={()=>setSkillTreeOpen(false)} share={()=>navigate('scheduled-shares')} ask={draftComposer}/></Suspense>}
      {toast&&<ToastMessage className="toast" text={toast} announce/>}
      {modal&&<Modal action={modal} close={closeModal}>
        {modal.type==='roles'?<div className="role-options">{roles.map(r=><button key={r.route} aria-pressed={role===r.route}
          onClick={()=>{setRole(r.route);saveLocal('portal-role',r.route);navigate(r.route)}}><strong>{r.name}</strong><small>{r.description}</small><i>{role===r.route?'✓':'›'}</i></button>)}</div>
        :modal.type==='agent'?<div className="agent-detail"><img src={mascot} alt="小新助手"/><h3>{modal.value}</h3><p>广新集团专属智能助手，协助整理信息、处理文档与提升工作效率。</p>
          <button className="primary-button" onClick={()=>{setSelectedAgent(modal.value);navigate('chat')}}>使用{modal.value}</button></div>
        :modal.type==='app-service'?<p className="empty-state">暂无相关记录</p>
        :modal.type==='ai-tools'?<div className="simple-list">{[['skill-tree','技能树'],['writing','智能写作'],['scheduled-shares','定时分享'],['knowledge','知识库'],['cloud-drive','云盘']].map(([r,label])=><button key={r} onClick={()=>navigate(r)}>{label}<span aria-hidden="true">›</span></button>)}</div>:modal.type==='daily-greeting'?<AnniversaryGreeting onSent={()=>{navigate('im-chat?'+new URLSearchParams({name:'陈晓晓',origin:'im'}));notify('祝福已发送')}}/>
        :modal.type==='daily-sources'?<DailyBriefSources/>
        :modal.type==='daily-history'?<DailyBriefHistory onAction={onAction}/>
        :modal.type==='service-alerts'?<ServiceAlertsDetail selectedId={modal.value} hidden={hiddenServiceAlerts} onRestore={()=>setHiddenServiceAlerts([])}/>
        :modal.type==='portal-news-detail'?<PortalNewsDetail id={modal.value} feedback={newsFeedback[modal.value]} onFeedback={value=>recordNewsFeedback(modal.value,value)}/>
        :modal.type==='group-news-detail'?<div className="group-detail-scroll"><Suspense fallback={<div className="scene-loading">正在加载…</div>}><GroupNewsArticle titleId="modal-title"/></Suspense></div>
        :modal.type==='news-subscription'?<NewsSubscription initial={newsSubscription} onClose={closeModal} onSave={settings=>{setNewsSubscription(settings);const query=new URLSearchParams(locationKey.split('?')[1]||'');navigate('portal-news?'+new URLSearchParams({origin:query.get('origin')||'portal-leader',category:'我关注的'}));notify('订阅已保存')}}/>
        :modal.type.startsWith('hotspot-')?<HotspotDetail key={modal.type+'-'+modal.value} action={modal} onAction={onAction} settings={hotspotSettings} onClose={closeModal} onSave={(next,close=true)=>{if(!saveLocal('hotspot-settings',next))return false;setHotspotSettings(next);if(close)closeModal();notify('关注设置已保存');return true}}/>
        :modal.type==='recent-forms'?<RecentFormsList onAction={onAction}/>
        :modal.type==='recent-form'?<RecentFormEditor key={modal.value} title={modal.value} onDone={s=>{notify(s);closeModal()}}/>
        :modal.type==='form'?<DemoForm title={modal.value} onDone={s=>{notify(s);closeModal()}}/>
        :modal.type==='conversation'?<Conversation key={modal.value} name={modal.value}/>
        :modal.type==='investment-filter'?<InvestmentFilterForm initial={investmentFilters} onApply={next=>{setInvestmentFilters(next);closeModal()}}/>
        :modal.type==='filter'?<PortalFilterForm company={company} year={year} onApply={(nextCompany,nextYear)=>{setCompany(nextCompany);setYear(nextYear);closeModal();notify('已切换为'+nextCompany+' · '+nextYear)}}/>
        :modal.type==='todo-list'?<TodoDetailList onAction={onAction}/>
        :modal.type==='meeting-detail'?<MeetingDetail key={modal.value} id={modal.value} onClose={closeModal} onEdit={event=>navigate('schedule-new?'+new URLSearchParams({id:event.id,date:event.start.slice(0,10),view:'day'}))} onDeleted={()=>{setTodoVersion(todoVersion+1);closeModal();notify('日程已删除')}}/>
        :['approve','todo-detail'].includes(modal.type)?<TodoDetail key={modal.value} title={modal.value} processable={modal.type==='approve'} onClose={closeModal}/>
        :modal.type==='travel-documents'?<TravelDocuments/>
        :modal.type==='applications'?<div className="simple-list">{readLocal<{title:string;name:string;start:string;reason:string}[]>('applications',[]).length?
          readLocal<{title:string;name:string;start:string;reason:string}[]>('applications',[]).map((a,i)=><article key={i}><h3>{a.title} · {a.name}</h3><small>{a.start}</small><p>{a.reason}</p></article>):<p className="empty-state">暂无申请记录</p>}</div>
        :modal.type==='attendance-record'?<p className="empty-state">{readLocal('attendance','')?'今日打卡时间：'+readLocal('attendance',''):'今日暂无打卡记录'}</p>
        :modal.type==='favorites'?<div className="simple-list">{readLocal<string[]>('favorites',[]).length?readLocal<string[]>('favorites',[]).map(v=><button key={v} onClick={()=>setModal({type:'detail',value:v})}>{v} ›</button>):<p className="empty-state">暂无收藏，打开文章后可加入收藏。</p>}</div>
        :modal.type==='profile-panel'?<ProfilePanel title={modal.value} notify={notify} close={closeModal}/>
        :modal.type==='about'?<div className="agent-detail"><img src={mascot} alt=""/><h3>广智新 App</h3><p>小新 AI · 工作台 · 广新门户 · IM</p><p>App 设计还原独立演示项目<br/>版本 1.0.0</p></div>
        :modal.type==='voice'?<div className="agent-detail"><Asset node="0:5159"/><h3>语音输入</h3><p>当前演示环境请使用键盘输入，也可通过手机输入法的语音按钮转文字。</p><button className="primary-button" onClick={closeModal}>开始输入</button></div>
        :modal.type==='call'?<div className="agent-detail"><img src={mascot} alt=""/><h3>{modal.value}</h3><p>电话功能需要连接企业通讯录服务。</p><button className="primary-button" onClick={closeModal}>返回通讯录</button></div>
        :['list','search','feed'].includes(modal.type)?<><Search value={modalSearch} onChange={setModalSearch}/>
          <div className="simple-list">{(modal.value.includes('通讯录')||modal.value.includes('集团')||modal.value.includes('群聊')?contacts.map(c=>c.name):questions)
            .filter(v=>v.includes(modalSearch)).map((v,i)=><button key={v+i} onClick={()=>setModal({type:contacts.some(c=>c.name===v)?'conversation':'detail',value:v})}><span>{v}</span><i>›</i></button>)}
          {modalSearch&&!questions.concat(contacts.map(c=>c.name)).some(v=>v.includes(modalSearch))&&<p className="empty-state">没有找到相关内容</p>}</div></>
        :<article className="detail-article"><span className="detail-tag">广新集团</span><h3>{modal.value}</h3><p className="detail-meta">集团综合管理部　2026-09-12</p>
          <p>各位同事：</p><p>为进一步推动集团高质量发展，现将相关工作事项通知如下。请各单位结合实际情况，认真组织落实，做好工作安排与沟通协同。</p>
          <p>一、明确工作目标，统筹安排重点任务。</p><p>二、加强协同联动，及时反馈工作进展。</p><p>三、做好资料整理，按要求完成相关工作。</p>
          <p className="demo-note">此正文为交互演示内容，正式内容需接入业务接口。</p>
          <button className="primary-button" onClick={()=>{const f=readLocal<string[]>('favorites',[]);if(!f.includes(modal.value))saveLocal('favorites',[...f,modal.value]);notify('已加入我的收藏')}}>收藏文章</button>
        </article>}
      </Modal>}
    </div>
    {wideWorkspace&&<aside className="desktop-spec-panel" aria-label="手机规范"><div className="desktop-spec-scroll" tabIndex={-1}><MobileSpec/></div></aside>}
    <div className="desktop-caption">广智新 App <span>独立移动端项目</span><button onClick={()=>navigate('canvases')}>查看全部 11 张画布 ↗</button></div>
  </div>;
}
