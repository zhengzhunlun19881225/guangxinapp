"""Apply the approved mobile type and color roles to generated Figma scenes.

Run after prepare-scenes.py. Reference exports and image assets remain intact.
The operation is idempotent, so regeneration can safely apply it every time.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
MODULES = {'常用功能', '集团邮箱', 'AI每日简报', 'AI智能提醒', '系统导航',
           '最新通知', '最新公告', '二级公司纳税情况', '科研动态',
           '各省份年度累计实缴税金 (万元)', '集团重大科技创新项目实施进度',
           '一利五率+营收/利润', '营业收入与整体税负趋势', '当月实缴税款情况',
           'AI 主动服务与智能提醒'}
PAGES = {'广智新', '工作台', '广新门户', '您好，欢迎使用广智新 ~', '早上好，张嘉嘉'}
LIST_NODES = {'0:8714','0:8745','0:8776','0:8807','0:8839','0:8889','0:8927',
              '0:7049','0:7059','0:7069'}
PRIMARY = {'03091b','2b303b','1d2129','1e293b','374151','1f2329','334155','111827','1e2432'}
SECONDARY = {'4e5969','4b5563','475569','64748b','6b7280','7d93a8'}

def color(match):
    value = match[1].lower().lstrip('#')
    if value in PRIMARY: role = 'primary'
    elif value in SECONDARY: role = 'secondary'
    elif value in {'f53f3f','e11d48','e60012','ff482a','ff0000'}: role = 'brand'
    elif value in {'ff5700','ff9a2e','f59e0b','fbbf24','ff7d00'}: role = 'warning'
    elif value in {'2563eb','2049ee','006dff'}: role = 'blue'
    elif value in {'00b578','00be28'}: role = 'success'
    elif value == '722ed1': role = 'purple'
    elif value == '14c9c9': role = 'cyan'
    else: role = 'muted'
    return 'text-[var(--color-'+role+')]'

def normalize(path):
    code = path.read_text()
    # Normalize theme surfaces even when typography has already been applied.
    if path.stem in {'ChatScene', 'HistoryScene'}:
        code = code.replace('bg-[#ffeae5]', 'bg-[var(--color-brand-soft)]')
    if path.stem in {'ManagerSceneReminders', 'LeaderSceneReminders'}:
        code = code.replace('bg-[#f53f3f]', 'bg-[var(--color-brand)]')
    if path.stem == 'WorkbenchScene':
        code = code.replace('bg-[#f75a3b]', 'bg-[var(--color-brand)]')
    if 'app-type-' in code:
        path.write_text(code)
        return
    # Text color utilities also occur on containers and spans that own text.
    code = re.sub(r'text-\[(#[0-9a-fA-F]{6})\]', color, code)
    code = code.replace('text-black', 'text-[var(--color-primary)]').replace('text-red-500', 'text-[var(--color-brand)]')
    code = re.sub(r"font-\['(?:Roboto|Alibaba_PuHuiTi):Regular'\]", 'font-app', code)
    pattern = r'<(p|SceneAction|div|span)\b([^>]*?className=")([^"]+)("[^>]*>)'
    def apply(m):
        tag, before, classes, after = m.groups()
        start = m.end()
        inner = code[start:code.find('</'+tag+'>', start)]
        label = re.sub(r'<[^>]+>', '', inner).strip()
        size = re.search(r'text-\[([\d.]+)px\]', classes)
        if not size: return m[0]
        value = float(size[1])
        # Simulated iOS status bars use the platform's own typography.
        if tag == 'p' and '19:4' in label:
            return m[0]
        node = re.search(r'data-node-id="([^"]+)"', after)
        if label == '同步到日程': role = 'body'
        elif label == '忽略': role = 'function'
        elif node and node[1] in LIST_NODES: role = 'list'
        elif label in PAGES: role = 'page'
        elif label in MODULES: role = 'module'
        elif value >= 18: role = 'page'
        elif value >= 15: role = 'list'
        elif value >= 13.5: role = 'body'
        elif value >= 13: role = 'function'
        elif 'text-white' in classes: role = 'badge'
        elif 'color-secondary' in classes: role = 'secondary'
        else: role = 'helper'
        classes = re.sub(r'text-\[[\d.]+px\]', '', classes)
        leading = re.search(r'leading-\[([\d.]+)px\]', classes)
        # Center headings that originally used a tall line box as alignment.
        if leading and float(leading[1]) >= 30 and tag in {'p','SceneAction'}:
            target = {'page':26,'module':24,'list':24,'body':22,'link':22,'function':20,'helper':18,'secondary':18,'badge':14}[role]
            classes += ' mt-['+str(round((float(leading[1])-target)/2,3))+'px]!'
        classes = re.sub(r'leading-\[[^]]+\]', '', classes)
        classes += ' app-type-'+role
        return '<'+tag+before+classes+after
    code = re.sub(pattern, apply, code)
    # Nested lines inherit their typography role instead of retaining old 16px line boxes.
    code = re.sub(r'<(p|span) className="leading-\[[^]]+\]', r'<\1 className="app-inherit-leading', code)
    path.write_text(code)

if __name__ == '__main__':
    for file in (ROOT/'src/screens').glob('*.tsx'):
        normalize(file)
    print('Applied approved mobile typography and color roles.')
