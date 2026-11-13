"""Build local example downloads from the user-supplied group article reference."""
from pathlib import Path
import json, shutil
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from xml.sax.saxutils import escape
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'src/data/groupDetail.json').read_text())
assets=root/'public/assets/portal-news';out=root/'output/pdf';out.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Alibaba',str(root/'public/assets/fonts/Alibaba-PuHuiTi-Regular.ttf')))
title=ParagraphStyle('Title',fontName='Alibaba',fontSize=18,leading=27,textColor=colors.HexColor('#03091b'),spaceAfter=12,wordWrap='CJK')
body=ParagraphStyle('Body',fontName='Alibaba',fontSize=11,leading=20,textColor=colors.HexColor('#4e5969'),spaceAfter=14,wordWrap='CJK')
meta=ParagraphStyle('Meta',fontName='Alibaba',fontSize=9,leading=15,textColor=colors.HexColor('#878b99'),spaceAfter=12,wordWrap='CJK')
width=A4[0]-84
from PIL import Image as PILImage
def photo(name):
 path=assets/name;im=PILImage.open(path);return Image(str(path),width,width*im.height/im.width)
def footer(canvas,doc):
 canvas.saveState();canvas.setFont('Alibaba',8);canvas.setFillColor(colors.HexColor('#878b99'));canvas.drawString(42,25,'本地演示附件 · 内容依据提供的详情参考');canvas.drawRightString(A4[0]-42,25,str(doc.page));canvas.restoreState()
def build(name,story):
 path=out/name;doc=SimpleDocTemplate(str(path),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=38,bottomMargin=42,title=data['title'],author=data['publisher']);doc.build(story,onFirstPage=footer,onLaterPages=footer);shutil.copy2(path,assets/name)
header=[Paragraph(escape(data['title']),title),Paragraph(escape('发布单位：'+data['publisher']+'　'+data['publishedAt']),meta)]
story=header+[photo('group-detail-city.webp'),Spacer(1,16)]+[Paragraph(escape(p),body) for p in data['paragraphs'][:2]]+[PageBreak(),photo('group-detail-people.webp'),Spacer(1,16)]+[Paragraph(escape(p),body) for p in data['paragraphs'][2:]]
build('reference-article.pdf',story)
build('reference-article-images.pdf',[Paragraph(escape(data['title'])+' - 图文附件',title),Paragraph('本附件收录详情参考中的两张配图。',meta),photo('group-detail-city.webp'),Spacer(1,8),Paragraph('配图 1：城市产业园区',meta),photo('group-detail-people.webp'),Spacer(1,8),Paragraph('配图 2：交流活动配图',meta)])
from pypdf import PdfReader
for name in ['reference-article.pdf','reference-article-images.pdf']:
 reader=PdfReader(out/name);assert len(reader.pages)>0;assert data['title'].replace(' ','') in ''.join(p.extract_text() for p in reader.pages).replace(' ','').replace('\n','');print(name,len(reader.pages),'pages')
