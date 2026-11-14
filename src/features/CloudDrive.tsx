import {useEffect,useRef,useState} from 'react';
import {Check,ChevronRight,Download,Eye,FileUp,FolderInput,FolderPlus,Plus,Share2,SquarePen,Trash2} from 'lucide-react';
import {readLocal,saveLocal} from '../data';
import AppNavBar,{NavBackIcon} from '../components/AppNavBar';
import ResourceBrowserIcon from './ResourceBrowserIcon';
import {Empty,FeatureSearch,FeatureShell,Sheet} from './UI';
import {download,queryFor,readResources,routeTo,startShare,type FeatureProps,type Resource} from './data';
import {loadDriveUploads,storeDriveUploads,type DriveUpload} from './cloudDriveStore';
import {resourceZip} from './zip';
import './resource-browser.css';
import './CloudDrive.css';

const initialFolders=['111','222','1112','1112车','111222','紧急','我的文件','呜呜呜呜'];
type Catalog={folders:string[];hiddenFolders:string[];hiddenFiles:string[];locations?:Record<string,string>};
const parentFolder=(path:string)=>path.split('/').slice(0,-1).join('/');
const folderName=(path:string)=>path.split('/').at(-1)||'';
const inside=(path:string,parent:string)=>path===parent||path.startsWith(parent+'/');
const isPdf=(file:Resource)=>/\.pdf$/i.test(file.name);
export default function CloudDrive({locationKey,height,navigate,notify}:FeatureProps){
 const query=queryFor(locationKey),folder=query.get('folder')||'',back=query.get('return')||'profile';
 const [catalog,setCatalog]=useState<Catalog>(()=>readLocal('cloud-drive-catalog',{folders:[],hiddenFolders:[],hiddenFiles:readLocal('hidden-resources-cloud-drive',[])}));
 const [uploads,setUploads]=useState<DriveUpload[]>([]),[loading,setLoading]=useState(true),[search,setSearch]=useState(''),[editing,setEditing]=useState(false),[selected,setSelected]=useState<string[]>([]),[selectedFolders,setSelectedFolders]=useState<string[]>([]),[menu,setMenu]=useState(false),[newFolder,setNewFolder]=useState(false),[name,setName]=useState(''),[folderError,setFolderError]=useState(''),[busy,setBusy]=useState(false),[preview,setPreview]=useState<Resource|null>(null),[previewText,setPreviewText]=useState(''),[deleting,setDeleting]=useState(false),[favorites,setFavorites]=useState<string[]>(()=>readLocal('resource-favorites',[]));
 const [moving,setMoving]=useState(false),[moveTarget,setMoveTarget]=useState(''),[moveError,setMoveError]=useState('');
 const fileInput=useRef<HTMLInputElement>(null),menuWrap=useRef<HTMLDivElement>(null),menuButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{let active=true;loadDriveUploads().then(values=>{if(active)setUploads(values)}).catch(()=>{if(active)notify('本机文件加载失败，请刷新重试')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 useEffect(()=>{
  if(!menu)return;
  const items=()=>Array.from(menuWrap.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')||[]);
  items()[0]?.focus();
  function outside(event:PointerEvent){if(!menuWrap.current?.contains(event.target as Node))setMenu(false)}
  function key(event:KeyboardEvent){if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setMenu(false);menuButton.current?.focus()}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const all=items(),index=all.indexOf(document.activeElement as HTMLButtonElement);all[event.key==='Home'?0:event.key==='End'?all.length-1:(index+(event.key==='ArrowDown'?1:-1)+all.length)%all.length]?.focus()}}
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key)};
 },[menu]);
 const allFolders=[...new Set([...initialFolders,...catalog.folders])].filter(path=>!catalog.hiddenFolders.some(hidden=>inside(path,hidden)));
 function folderFor(file:Resource){return catalog.locations?.[file.id]??uploads.find(item=>item.resource.id===file.id)?.folder??(file.id==='photo-0'||['report','table','brief'].includes(file.id)?'222':file.id.startsWith('photo-')&&Number(file.id.slice(6))<15?initialFolders.filter(value=>value!=='222')[Math.floor((Number(file.id.slice(6))-1)/2)]||'':'')}
 const allFiles=[...readResources(),...uploads.map(item=>item.resource)].filter(file=>!catalog.hiddenFiles.includes(file.id));
 const matches=(value:string)=>value.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
 const files=allFiles.filter(file=>search.trim()?matches(file.name):folderFor(file)===folder).sort((a,b)=>b.date.localeCompare(a.date));
 const folders=allFolders.filter(path=>search.trim()?matches(folderName(path)):parentFolder(path)===folder);
 const selectedFiles=allFiles.filter(file=>selected.includes(file.id)||selectedFolders.some(path=>inside(folderFor(file),path))),selectionCount=selected.length+selectedFolders.length;
 function openFolder(path:string){navigate(routeTo('cloud-drive',{folder:path,...(query.get('return')?{return:back}:{})}))}
 function saveCatalog(next:Catalog){if(!saveLocal('cloud-drive-catalog',next)){notify('保存失败，请重试');return false}setCatalog(next);return true}
 function toggle(id:string){setSelected(values=>values.includes(id)?values.filter(value=>value!==id):[...values,id])}
 function selectAll(){const all=files.every(file=>selected.includes(file.id))&&folders.every(path=>selectedFolders.includes(path));setSelected(all?[]:files.map(file=>file.id));setSelectedFolders(all?[]:folders)}
 function createFolder(event:React.FormEvent){
  event.preventDefault();const trimmed=name.trim();if(!trimmed){setFolderError('请输入文件夹名称');return}if(/[\\/:*?"<>|\u0000-\u001f]/.test(trimmed)){setFolderError('文件夹名称不能包含斜杠或特殊字符');return}
  const path=folder?folder+'/'+trimmed:trimmed;if(allFolders.some(item=>item.toLocaleLowerCase()===path.toLocaleLowerCase())){setFolderError('当前目录已存在同名文件夹');return}
  if(!saveCatalog({...catalog,folders:[...new Set([...catalog.folders,path])],hiddenFolders:catalog.hiddenFolders.filter(value=>value!==path)}))return;
  setSearch('');setNewFolder(false);setName('');notify('文件夹已创建');
 }
 async function upload(files:FileList|null){
  if(!files?.length)return;const values=Array.from(files);if(fileInput.current)fileInput.current.value='';
  if(values.some(file=>file.size>20*1024*1024)){notify('单个文件不能超过 20 MB');return}
  setBusy(true);try{const added=await storeDriveUploads(values,folder);setUploads(current=>[...current,...added]);setSearch('');notify('已添加 '+added.length+' 个文件到本机云盘')}catch{notify('文件保存失败，请重试')}finally{setBusy(false)}
 }
 async function show(file:Resource){setPreview(file);setPreviewText('');if(file.kind==='document'&&!isPdf(file)&&/\.(txt|csv|md|json)$/i.test(file.name))try{const response=await fetch(file.url);if(!response.ok)throw new Error();setPreviewText(await response.text())}catch{setPreviewText('内容加载失败，请关闭后重试。')}}
 function share(items:Resource[]){if(!items.length)return;const first=items[0],payload=items.length===1?{kind:first.kind==='image'?'image' as const:'file' as const,title:first.name,url:first.url,fileKind:first.kind}:{kind:'file' as const,title:items.length+'份云盘资料',items:items.map(file=>({title:file.name,url:file.url,kind:file.kind}))};if(!startShare(payload,locationKey.replace(/^#\//,''),navigate))notify('无法创建分享，请重试')}
 function favorite(items:Resource[]){const ids=items.map(file=>file.id),remove=ids.every(id=>favorites.includes(id)),next=remove?favorites.filter(id=>!ids.includes(id)):[...new Set([...favorites,...ids])];if(saveLocal('resource-favorites',next)){setFavorites(next);notify(remove?'已取消收藏':'已收藏')}else notify('收藏失败，请重试')}
 async function saveFiles(items:Resource[]){if(!items.length)return;if(items.length===1){download(items[0].url,items[0].name);return}setBusy(true);try{const blob=await resourceZip(items),url=URL.createObjectURL(blob);download(url,'云盘资料.zip');setTimeout(()=>URL.revokeObjectURL(url),1000)}catch{notify('下载失败，请稍后重试')}finally{setBusy(false)}}
 function remove(){if(!saveCatalog({...catalog,hiddenFiles:[...new Set([...catalog.hiddenFiles,...selectedFiles.map(file=>file.id)])],hiddenFolders:[...new Set([...catalog.hiddenFolders,...selectedFolders])]}))return;setDeleting(false);setSelected([]);setSelectedFolders([]);notify('已从云盘列表删除')}
 const movingRoots=selectedFolders.filter(path=>!selectedFolders.some(other=>other!==path&&inside(path,other)));
 const canMove=!movingRoots.some(path=>inside(moveTarget,path))&&(movingRoots.some(path=>parentFolder(path)!==moveTarget)||selectedFiles.some(file=>selected.includes(file.id)&&folderFor(file)!==moveTarget));
 function move(){
  if(!canMove)return;
  const roots=movingRoots.filter(path=>parentFolder(path)!==moveTarget),destinations=roots.map(path=>(moveTarget?moveTarget+'/':'')+folderName(path));
  if(destinations.some((path,index)=>allFolders.some(existing=>existing.toLocaleLowerCase()===path.toLocaleLowerCase()&&existing!==roots[index]))||new Set(destinations.map(path=>path.toLocaleLowerCase())).size!==destinations.length){setMoveError('目标位置已存在同名文件夹，请选择其他位置');return}
  const remap=(path:string)=>{const index=roots.findIndex(root=>inside(path,root));return index<0?path:destinations[index]+path.slice(roots[index].length)};
  const locations={...catalog.locations};selectedFiles.forEach(file=>{const current=folderFor(file),mapped=remap(current);if(mapped!==current)locations[file.id]=mapped;else if(selected.includes(file.id))locations[file.id]=moveTarget});
  const movedPaths=allFolders.filter(path=>roots.some(root=>inside(path,root))).map(remap);
  if(!saveCatalog({...catalog,locations,folders:[...new Set([...catalog.folders,...movedPaths])],hiddenFolders:[...new Set([...catalog.hiddenFolders.filter(path=>!movedPaths.includes(path)),...roots])]}))return;
  setMoving(false);setSelected([]);setSelectedFolders([]);notify('已移动到'+(moveTarget?folderName(moveTarget):'根目录'));
 }
 const check=(checked:boolean)=><span className={'feature-check'+(checked?' is-checked':'')}>{checked&&<Check size={14}/>}</span>;
 const header=<><AppNavBar className="feature-navbar" title="云盘" left={<button aria-label="返回" onClick={()=>folder?openFolder(parentFolder(folder)):navigate(back)}><NavBackIcon/></button>} right={<>
  <button aria-label={editing?'完成编辑':'编辑云盘'} aria-pressed={editing} disabled={busy||loading} onClick={()=>{setMenu(false);setEditing(!editing);setSelected([]);setSelectedFolders([])}}>{editing?<Check size={22}/>:<SquarePen size={22}/>}</button>
  <div className="cloud-drive-add-wrap" ref={menuWrap} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setMenu(false)}}><button ref={menuButton} aria-label="添加" aria-haspopup="menu" aria-expanded={menu} aria-controls="cloud-drive-add-menu" disabled={editing||busy||loading} onClick={()=>setMenu(value=>!value)}><Plus size={22}/></button>{menu&&<div className="cloud-drive-add-menu" id="cloud-drive-add-menu" role="menu" aria-label="添加内容"><button role="menuitem" onClick={()=>{setMenu(false);fileInput.current?.click()}}><FileUp size={20}/><span>上传文件</span></button><button role="menuitem" onClick={()=>{setMenu(false);setName('');setFolderError('');setNewFolder(true)}}><FolderPlus size={20}/><span>新增文件夹</span></button></div>}</div>
 </>}/><div className="resource-browser-header"><div className="resource-browser-search"><FeatureSearch placeholder="全局搜索文件" value={search} onChange={value=>{setSearch(value);setSelected([]);setSelectedFolders([])}}/></div>{folder&&<nav className="resource-browser-crumbs" aria-label="云盘位置"><button onClick={()=>openFolder('')}>根目录</button>{folder.split('/').map((part,index,parts)=><span className="cloud-drive-crumb" key={index}><ChevronRight size={12}/>{index<parts.length-1?<button onClick={()=>openFolder(parts.slice(0,index+1).join('/'))}>{part}</button>:<span>{part}</span>}</span>)}</nav>}{editing&&<div className="resource-browser-select-all"><button onClick={selectAll}>全选</button><span>已选择 {selectionCount} 项</span></div>}</div></>;
 const toolbar=<div className="feature-media-actions"><button disabled={!selectedFiles.length||busy} onClick={()=>share(selectedFiles)}><Share2 size={22}/>转发</button><button disabled={!selectionCount||busy} onClick={()=>{setMoveTarget(folder);setMoveError('');setMoving(true)}}><FolderInput size={22}/>移动</button><button disabled={!selectionCount||busy} onClick={()=>setDeleting(true)}><Trash2 size={22}/>删除</button><button disabled={!selectedFiles.length||busy} onClick={()=>saveFiles(selectedFiles)}><Download size={22}/>{busy?'打包中':'下载'}</button></div>;
 return <FeatureShell className="resource-browser cloud-drive-page" title="云盘" height={height} back={()=>navigate(back)} header={header} footer={editing?toolbar:undefined}>
  <input ref={fileInput} type="file" multiple hidden aria-label="上传云盘文件" onChange={event=>upload(event.target.files)} disabled={busy}/>
  {busy&&!editing&&<p className="cloud-drive-progress" role="status">正在保存文件…</p>}
  <div className="resource-browser-list">{folders.map(path=><div className="resource-browser-row" key={path}><button className="resource-browser-open" aria-label={'打开文件夹'+folderName(path)} aria-pressed={editing?selectedFolders.includes(path):undefined} onClick={()=>editing?setSelectedFolders(current=>current.includes(path)?current.filter(value=>value!==path):[...current,path]):openFolder(path)}>{editing&&check(selectedFolders.includes(path))}<ResourceBrowserIcon kind="folder"/><span className="resource-browser-copy"><strong>{folderName(path)}</strong>{search.trim()&&parentFolder(path)&&<small>{parentFolder(path)}</small>}</span><ChevronRight className="resource-browser-chevron" size={16}/></button></div>)}{files.map(file=><div className="resource-browser-row" key={file.id}><button className="resource-browser-open" aria-label={(editing?'选择':'查看')+file.name} aria-pressed={editing?selected.includes(file.id):undefined} onClick={()=>editing?toggle(file.id):show(file)}>{editing&&check(selected.includes(file.id))}<ResourceBrowserIcon kind={/\.txt$/i.test(file.name)?'text':/\.docx?$/i.test(file.name)?'word':file.kind}/><span className="resource-browser-copy"><strong>{file.name}</strong><small>{file.size}{favorites.includes(file.id)?' · 已收藏':''}</small></span></button><button className="resource-browser-preview" aria-label={'预览'+file.name} onClick={()=>show(file)}><Eye size={17}/></button></div>)}{!files.length&&!folders.length&&<Empty>{loading?'正在加载文件…':search.trim()?'未找到相关文件':'此文件夹暂无文件'}</Empty>}</div>
  {newFolder&&<Sheet compact title="新增文件夹" close={()=>setNewFolder(false)} footer={<><button className="feature-secondary" onClick={()=>setNewFolder(false)}>取消</button><button className="feature-primary" type="submit" form="cloud-drive-folder-form" disabled={!name.trim()}>创建</button></>}><form className="cloud-drive-folder-form" id="cloud-drive-folder-form" onSubmit={createFolder}><label htmlFor="cloud-drive-folder-name">文件夹名称</label><input id="cloud-drive-folder-name" placeholder="请输入文件夹名称" maxLength={80} value={name} onChange={event=>{setName(event.target.value);setFolderError('')}}/>{folderError&&<p role="alert">{folderError}</p>}</form></Sheet>}
  {moving&&<Sheet title="移动到" close={()=>setMoving(false)} footer={<><button className="feature-secondary" onClick={()=>setMoving(false)}>取消</button><button className="feature-primary" disabled={!canMove} onClick={move}>移动到此处</button></>}><nav className="cloud-drive-move-crumbs" aria-label="移动目标"><button onClick={()=>{setMoveTarget('');setMoveError('')}}>根目录</button>{moveTarget&&moveTarget.split('/').map((part,index,parts)=><span className="cloud-drive-crumb" key={index}><ChevronRight size={12}/><button onClick={()=>{setMoveTarget(parts.slice(0,index+1).join('/'));setMoveError('')}}>{part}</button></span>)}</nav>{moveError&&<p className="cloud-drive-move-error" role="alert">{moveError}</p>}<div className="cloud-drive-destinations">{allFolders.filter(path=>parentFolder(path)===moveTarget).map(path=><button key={path} aria-label={'进入'+folderName(path)} disabled={movingRoots.some(root=>inside(path,root))} onClick={()=>{setMoveTarget(path);setMoveError('')}}><ResourceBrowserIcon kind="folder"/><span>{folderName(path)}</span><ChevronRight size={16}/></button>)}</div>{!allFolders.some(path=>parentFolder(path)===moveTarget)&&<Empty>当前目录没有子文件夹</Empty>}</Sheet>}
  {preview&&<Sheet title={preview.name} close={()=>setPreview(null)} footer={<><button className="feature-secondary" onClick={()=>share([preview])}>转发</button><button className="feature-secondary" onClick={()=>favorite([preview])}>{favorites.includes(preview.id)?'取消收藏':'收藏'}</button><button className="feature-primary" onClick={()=>saveFiles([preview])}>下载</button></>}>{preview.kind==='image'?<img className="feature-media-preview" src={preview.url} alt={preview.name}/>:preview.kind==='video'?<video className="feature-media-preview" src={preview.url} controls preload="metadata"/>:preview.kind==='audio'?<audio src={preview.url} controls style={{maxWidth:'100%'}}/>:isPdf(preview)?<iframe title={preview.name} src={preview.url} style={{width:'100%',height:'50vh',border:0}}/>:<pre className="feature-document">{previewText||'下载文件可查看完整内容。'}</pre>}</Sheet>}
  {deleting&&<Sheet compact title="删除所选资料" close={()=>setDeleting(false)} footer={<><button className="feature-secondary" onClick={()=>setDeleting(false)}>取消</button><button className="feature-primary" onClick={remove}>删除</button></>}><p>{selectedFolders.length?'将移除所选文件夹及其中的文件。':'将从当前云盘列表移除 '+selectedFiles.length+' 份文件。'}</p></Sheet>}
 </FeatureShell>;
}
