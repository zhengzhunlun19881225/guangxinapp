import type {Message} from '../data';
import type {ComposerAttachment} from '../components/attachmentStore';

const reply=(title:string,body:string):Message=>({role:'assistant',title,text:title+'\n\n'+body});
const lastAnswer=(history:Message[])=>[...history].reverse().find(message=>message.role==='assistant');

// Local demo replies use explicit intents; business facts must come from supplied material.
export function createDemoReply(question:string,history:Message[]=[],attachments:ComposerAttachment[]=[]):Message{
 const text=question.trim(),q=text.replace(/[\s，。！？!?]/g,'');
 const previous=lastAnswer(history);
 if(/^(再|请|能不能)?(简短|精简|简洁|缩短|用一句话|一句话)/.test(q)&&previous){
  const body=previous.text.replace(previous.title||'','').trim();
  const sentences=body.split(/(?<=[。！？])/).map(value=>value.trim()).filter(Boolean);
  return reply('简要回复',sentences.slice(0,2).join('')||body.slice(0,160));
 }
 if(attachments.length){
  const readable=attachments.filter(item=>item.text?.trim());
  if(!readable.length)return reply('请补充可读取的材料',`已收到：${attachments.map(item=>item.name).join('、')}。\n\n请粘贴与“${text}”相关的正文，或提供 TXT、Markdown、CSV 等文本文件，便于提取内容。图片和扫描文档目前仅支持预览。`);
  const keywords=q.replace(/请|帮我|根据|材料|文件|文档|总结|提取|分析|要点|内容/g,'').match(/[\u4e00-\u9fff]{2,}|[a-z0-9]+/gi)||[];
  const passages=readable.flatMap(item=>(item.text||'').split(/\n+|(?<=[。！？；])/).map(value=>value.trim()).filter(Boolean).map((value,index)=>({value,source:item.name,index,score:keywords.filter(word=>value.includes(word)).length})))
   .sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,6);
  const result=reply(/政策/.test(q)?'政策材料摘录':'材料相关内容',`针对“${text}”，从所提供文件中提取如下内容：\n\n`+passages.map((item,index)=>`${index+1}. ${item.value.slice(0,360)}（${item.source}）`).join('\n\n')+'\n\n以上为原文摘录，具体结论以完整材料为准。');
  result.references=readable.map(({id,name})=>({id,name}));return result;
 }
 if(/你是谁|你的?(身份|名字)|你叫什么|介绍(一下)?你自己|你是什么/.test(q))return reply('关于广智新','我是广智新，你的办公助手，可以协助起草通知、整理工作汇报、梳理材料和规划任务。\n\n告诉我具体事项、对象和要求，我会按你的问题提供相应内容。');
 if(/^(的身份|身份|谁的身份)$/.test(q))return reply('请补充说明','你想了解谁的身份？如果是在问我，我是广智新办公助手。');
 if(/^(你好|您好|嗨|hello|hi)$/i.test(q))return reply('你好','你好！今天需要我协助起草文稿、整理材料，还是分析一个具体问题？');
 if(/^(谢谢|多谢|感谢|好的谢谢)/.test(q))return reply('不客气','不客气，有需要可以继续告诉我。');
 if(/你(能|可以|会)(做|帮)|功能|使用方法/.test(q))return reply('我可以这样协助你','1. 文稿起草：通知、讲话稿、工作邮件。\n2. 材料整理：摘要、会议纪要、任务清单。\n3. 汇报规划：工作周报、经营汇报框架。\n\n你可以直接说“帮我写一份活动通知”，并补充时间、对象和活动要求。');
 if(/通知|公告/.test(q)){
  const quoted=text.match(/[“「《"]([^”」》"]+)[”」》"]/),topic=quoted?.[1]||text.replace(/^(请|帮我|麻烦|起草|撰写|写一份|写个|关于|组织|参加|一份)+/g,'').replace(/(的)?(通知|公告).*$/,'').trim()||'活动';
  const date=text.match(/\d{4}年\d{1,2}月\d{1,2}日|\d{1,2}月\d{1,2}日/)?.[0]||'[待填写]';
  return reply(`关于${/参加|大赛/.test(text)?'参加':'开展'}“${topic}”的通知`,`各部门、各单位：\n\n为有序开展“${topic}”相关工作，现将安排通知如下：\n\n一、时间与地点\n活动时间：${date}；地点或参与方式：[待填写]。\n\n二、参加对象\n[请填写适用部门、人员及报名条件]。\n\n三、工作要求\n请各部门做好组织与对接工作，于[截止日期]前提交[报名信息或相关材料]。\n\n四、联系方式\n联系人及电话：[待填写]。\n\n[发布单位]\n[发布日期]`);
 }
 if(/销售|业绩|经营分析|营业收入|税负/.test(q)){
  const period=text.match(/第[一二三四1-4]季度|本季度|本月|上半年|下半年|年度/)?.[0]||'本期';
  return reply(`${period}${/销售|业绩/.test(q)?'销售业绩汇报':'经营分析'}框架`,`目前未提供${period}的实际业务数据，以下为可填写的汇报结构：\n\n一、总体情况\n收入、目标完成率、同比和环比：[待补充]。\n\n二、${/区域/.test(q)?'各区域':'业务分项'}表现\n按业务单元列出目标、实际完成额、差额及主要原因。\n\n三、问题分析\n核对订单、交付、回款及成本变化，区分一次性因素和持续性因素。\n\n四、后续安排\n为未达目标的项目确定措施、责任人和完成期限。\n\n请提供相关报表，我可以继续整理具体指标和差异。`);
 }
 if(/政策|制度|合规/.test(q))return reply('政策要求梳理','请提供政策名称、原文或需要梳理的条款。收到材料后，我会按“适用对象、核心要求、实施时间、责任部门、办理材料、待确认事项”逐项整理。\n\n如果需要对照企业现状，请同时说明业务场景和关注的问题。');
 if(/报销|差旅|出差/.test(q))return reply('差旅与报销准备','请先确认出差人员、目的地、起止时间和业务事由。\n\n报销一般需整理：出差审批记录、交通凭证、住宿发票、费用明细及支付凭证。\n\n交通等级、住宿限额和补贴金额需要以你所在单位的现行制度为准。请提供相关制度或费用明细，我再按条款逐项核对。');
 if(/周报|周总结|本周工作|工作总结|述职|月报/.test(q))return reply(/述职/.test(q)?'述职报告提纲':'工作总结提纲','一、已完成工作\n按任务列出完成情况、具体成果与交付物。\n\n二、问题与风险\n说明未完成事项、原因和需要的支持。\n\n三、下一步计划\n按优先级明确任务、负责人和完成时间。\n\n请补充你的岗位、工作周期和主要事项，我会据此整理成完整文稿。');
 if(/会议|纪要/.test(q))return reply('会议纪要整理','请提供会议记录或讨论要点。我会整理为：\n\n1. 会议主题、时间与参会人。\n2. 各议题的主要意见和决定。\n3. 待办任务、负责人和完成期限。\n4. 尚未达成一致、需要后续确认的事项。');
 if(/摘要|提炼|总结|提取|材料|文档/.test(q))return reply('请提供待整理的正文',`你希望“${text}”。请粘贴原文或上传可读取的文本文件，并说明需要简要概括、结论提取，还是关键数据与待办清单。`);
 if(/数字化|AIGC|人工智能/.test(q))return reply('企业数字化应用思路','可以从具体业务任务入手：\n\n1. 知识查询：整理制度与业务文档，提供可追溯的检索结果。\n2. 文稿协作：辅助起草通知、会议纪要及工作汇报，由业务人员审核。\n3. 流程优化：识别重复录入和跨系统协作环节，逐步试点。\n\n建议先明确一个场景，再评估数据权限、输出质量、人工复核和实际节省的时间。');
 if(/数据监测|优化策略/.test(q))return reply('数据监测与优化建议','一、明确监测目标\n先确定业务目标，选择与目标对应的指标及统计口径。\n\n二、检查数据质量\n核对来源、更新频率、缺失值与异常值，避免用口径不一致的数据作比较。\n\n三、建立反馈机制\n为异常设置责任人与处理时限，记录措施，并持续比较改进前后的结果。\n\n请补充业务场景和当前指标，我可以进一步细化。');
 return reply('请补充具体需求',`关于“${text}”，请再说明你想了解什么，或希望我完成哪项工作。\n\n例如：解释一个概念、起草一份文稿，或整理一段材料；有相关背景或原文也可以一并提供。`);
}

export function normalizeDemoMessages(messages:Message[]):Message[]{
 return messages.map((message,index)=>{
  if(message.role!=='assistant'||!message.text.startsWith('数据监测与优化策略\n\n一、关键指标\n为贯彻落实政府服务数字化转型要求'))return message;
  const question=messages[index-1];
  return question?.role==='user'?createDemoReply(question.text,messages.slice(0,index-1),question.attachments):message;
 });
}
