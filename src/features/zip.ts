// Store entries without compression so browser downloads work without a server.
const encoder=new TextEncoder();
function crc32(bytes:Uint8Array){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
export async function resourceZip(files:{name:string;url:string}[]){
 const entries=await Promise.all(files.map(async(file,index)=>{const response=await fetch(file.url);if(!response.ok)throw new Error('下载失败：'+file.name);return{name:encoder.encode((index+1)+'-'+file.name.replace(/[\\/:*?"<>|]/g,'_')),bytes:new Uint8Array(await response.arrayBuffer())}}));
 const chunks:Uint8Array[]=[],central:Uint8Array[]=[];let offset=0;
 for(const entry of entries){const crc=crc32(entry.bytes),header=new Uint8Array(30+entry.name.length),view=new DataView(header.buffer);view.setUint32(0,0x04034b50,true);view.setUint16(4,20,true);view.setUint16(6,0x0800,true);view.setUint32(14,crc,true);view.setUint32(18,entry.bytes.length,true);view.setUint32(22,entry.bytes.length,true);view.setUint16(26,entry.name.length,true);header.set(entry.name,30);chunks.push(header,entry.bytes);
  const record=new Uint8Array(46+entry.name.length),recordView=new DataView(record.buffer);recordView.setUint32(0,0x02014b50,true);recordView.setUint16(4,20,true);recordView.setUint16(6,20,true);recordView.setUint16(8,0x0800,true);recordView.setUint32(16,crc,true);recordView.setUint32(20,entry.bytes.length,true);recordView.setUint32(24,entry.bytes.length,true);recordView.setUint16(28,entry.name.length,true);recordView.setUint32(42,offset,true);record.set(entry.name,46);central.push(record);offset+=header.length+entry.bytes.length;
 }
 const size=central.reduce((n,entry)=>n+entry.length,0),end=new Uint8Array(22),view=new DataView(end.buffer);view.setUint32(0,0x06054b50,true);view.setUint16(8,entries.length,true);view.setUint16(10,entries.length,true);view.setUint32(12,size,true);view.setUint32(16,offset,true);
 return new Blob([...chunks,...central,end] as BlobPart[],{type:'application/zip'});
}
