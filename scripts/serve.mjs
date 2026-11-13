/** Dependency-free preview of the supplied production build. */
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||5317);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf','.json':'application/json'};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=resolve(root,'.'+pathname);
  if(file!==resolve(root)&&!file.startsWith(resolve(root)+sep)){res.writeHead(403);res.end();return}
  if(pathname.endsWith('/'))file=resolve(file,'index.html');
  if(!(await stat(file)).isFile()){res.writeHead(404);res.end();return}
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream',
    'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('页面或资源不存在')}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'5317 端口已在使用，请打开现有预览，或设置 PORT 使用其他端口。':error.message);process.exitCode=1});
server.listen(port,'0.0.0.0',()=>console.log('广智新 App 独立预览：http://localhost:'+port+'/'));
