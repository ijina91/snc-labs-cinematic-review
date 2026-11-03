"""Subset licensed font sources previously downloaded to artifacts/font-sources.
Run with a Python environment containing fonttools[woff]. Production builds do
not need Python: the generated WOFF2 files and OFL notices are committed.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
files = [root / 'index.html', *root.glob('src/**/*.js')]
text = ''.join(p.read_text(encoding='utf-8-sig') for p in files)
text += ''.join(chr(c) for c in range(32, 256)) + '↗↘↓↑＋＝☆·…안전작업허가공개프로젝트연결다시불러오기시스템환경개발운영'
for source, output, family, style in [
    ('Pretendard-Regular.woff2', 'snc-sans-regular.woff2', 'SNC Sans', 'Regular'),
    ('Pretendard-Bold.woff2', 'snc-sans-bold.woff2', 'SNC Sans', 'Bold'),
    ('InterTight.ttf', 'snc-display.woff2', 'SNC Display', 'Regular'),
]:
    font = TTFont(root / 'artifacts/font-sources' / source)
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    processor = subset.Subsetter(options=options)
    processor.populate(text=text if family == 'SNC Sans' else ''.join(chr(c) for c in range(32, 256)) + '↗↘↓↑☆·’')
    processor.subset(font)
    # OFL reserved names are not used for modified/subset font families.
    values = {1: family, 2: style, 3: f'{family}-{style}-subset', 4: f'{family} {style}', 6: family.replace(' ', '') + '-' + style, 16: family, 17: style}
    for record in font['name'].names:
        if record.nameID in values:
            record.string = values[record.nameID].encode(record.getEncoding(), errors='replace')
    font.flavor = 'woff2'
    target = root / 'public/assets/fonts' / output
    font.save(target)
    print(f'{output}: {target.stat().st_size} bytes')
