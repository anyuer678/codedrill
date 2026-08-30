# -*- coding: utf-8 -*-
"""codedrill T3 验收：全仓 Linux/linux_ 残留穷尽扫描（r4 口径）。"""
import os

results = {}
skip_dirs = {'node_modules', 'dist', '.git', 'coverage', 'build'}
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in skip_dirs]
    for f in files:
        if not f.endswith(('.js', '.vue', '.json', '.ts', '.html', '.mjs', '.css')):
            continue
        p = os.path.join(root, f).replace(os.sep, '/')
        try:
            content = open(p, encoding='utf-8').read()
        except Exception:
            continue
        hits = []
        for i, l in enumerate(content.splitlines(), 1):
            # 允许残留：题目 ID 前缀 linux_xxx（r4 决策保持不变）
            stripped = l.replace('linux_arr', '#').replace('linux_loop_q', '#').replace('linux_str', '#').replace('linux_cond', '#').replace('linux_func', '#')
            if 'Linux' in stripped or 'linux_' in stripped:
                hits.append((i, l.strip()[:90]))
        if hits:
            results[p] = hits

total = 0
for p, hits in sorted(results.items()):
    total += len(hits)
    print(f'--- {p} ({len(hits)})')
    for i, l in hits[:5]:
        print(f'   {i}: {l}')
print()
print('残留文件数:', len(results), '| 残留命中:', total)
print('bash_*.json:', sorted(f for f in os.listdir('core/questions') if f.startswith('bash_')))
print('linux_*.json 残留:', [f for f in os.listdir('core/questions') if f.startswith('linux_')] or '无')
