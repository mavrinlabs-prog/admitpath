"""Truncate article titles in data/articles.ts to 60 chars max."""
import re, os

path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'articles.ts')
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def shorten_title(match):
    prefix = match.group(1)
    title = match.group(2)
    if len(title) <= 60:
        return match.group(0)

    # Strategy: remove parenthetical suffixes first
    shortened = re.sub(r'\s*\([^)]+\)\s*$', '', title)
    if len(shortened) <= 60 and len(shortened) > 20:
        return f'{prefix}"{shortened}"'

    # Remove subtitle after colon/dash
    parts = re.split(r'[:—–]', title)
    if len(parts) > 1 and len(parts[0].strip()) <= 60 and len(parts[0].strip()) > 20:
        return f'{prefix}"{parts[0].strip()}"'

    # Last resort: truncate at word boundary
    truncated = title[:57]
    last_space = truncated.rfind(' ')
    if last_space > 30:
        truncated = truncated[:last_space]
    return f'{prefix}"{truncated}..."'

# Match title: "..." lines (only the title field, not h1 or description)
result = re.sub(r'(    title: )"(.+?)"', shorten_title, content)

fixes = 0
old_titles = re.findall(r'    title: "(.+?)"', content)
new_titles = re.findall(r'    title: "(.+?)"', result)
for old, new in zip(old_titles, new_titles):
    if old != new:
        fixes += 1
        print(f'  {len(old)}->"{len(new)}" : {new}')

if fixes:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(result)
    print(f'\nFixed {fixes} titles')
else:
    print('No titles needed fixing')
