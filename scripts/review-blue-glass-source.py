"""Inspect an actually downloaded source. No generation or automatic adoption."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import shutil
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageStat

parser = argparse.ArgumentParser()
parser.add_argument('segment')
parser.add_argument('--job-id', required=True)
parser.add_argument('--download', type=Path)
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent / 'artifacts/frame-redesign-v2'
manifest_path = root / 'production.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
if not re.fullmatch(r'\d{2}-\d{2}', args.segment):
    raise ValueError('Expected a recorded segment such as 03-04.')
record = next(s for s in manifest['segments'] if f"{s['from']}-{s['to']}" == args.segment)
if record.get('job_id') not in (None, args.job_id):
    raise ValueError('Preserve the recorded original; use a separate version for another job.')

def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()

source = root / 'originals' / f'{args.segment}.mp4'
source.parent.mkdir(exist_ok=True)
if args.download:
    if source.exists() and digest(source) != digest(args.download):
        raise ValueError('Refusing to replace a different original.')
    if not source.exists():
        shutil.copy2(args.download, source)
record.update(job_id=args.job_id, sha256=digest(source), bytes=source.stat().st_size,
              state='DOWNLOADED_AWAITING_VISUAL_REVIEW')

def save():
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')

save()
decoded = subprocess.run([args.ffmpeg, '-hide_banner', '-threads', '1', '-i', str(source),
                          '-vf', 'showinfo', '-f', 'null', '-'], capture_output=True, text=True)
(root / f'decode-{args.segment}.txt').write_text(decoded.stderr, encoding='utf-8')
pts = [float(t) for t in re.findall(r'pts_time:([0-9.]+)', decoded.stderr)]
record['full_decode'] = decoded.returncode == 0 and len(pts) > 1
if not record['full_decode']:
    record['state'] = 'DECODE_FAILED'
    save()
    raise RuntimeError('Full decode failed; inspect the saved log.')
fps = (len(pts) - 1) / (pts[-1] - pts[0])
record.update(decoded_frames=len(pts), decoded_fps=fps, last_frame_pts=pts[-1],
              decoded_duration=pts[-1] + 1 / fps)

directory = root / f'review-{args.segment}'
directory.mkdir(exist_ok=True)
times = [pts[-1] * fraction for fraction in [0, .07, .16, .26, .4, .54, .7, .86, .96]]
times.append(max(0, pts[-1] - .25 / fps))
sheet = Image.new('RGB', (1600, 1208), (5, 8, 14))
draw = ImageDraw.Draw(sheet)
for i, time in enumerate(times):
    frame = directory / f'{i:02}.png'
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-threads', '1',
                    '-ss', str(time), '-i', str(source), '-frames:v', '1', '-threads', '1',
                    '-y', str(frame)], check=True)
    with Image.open(frame) as image:
        image.thumbnail((533, 282))
        x, y = (i % 3) * 533, (i // 3) * 302
        sheet.paste(image, (x, y + 20))
        draw.text((x + 10, y + 3), f'{time:.3f}s', fill='white')
sheet.save(root / f'review-{args.segment}.jpg', quality=91)
record['candidate_next_frame'] = str((directory / '09.png').relative_to(root))
if record.get('start_frame'):
    with Image.open(root / record['start_frame']) as previous, Image.open(directory / '00.png') as current:
        if previous.size == current.size:
            stats = ImageStat.Stat(ImageChops.difference(previous.convert('RGB'), current.convert('RGB')))
            record['join_rgb_rmse'] = math.sqrt(sum(x*x for x in stats.rms) / 3)
        else:
            record['join_review'] = 'SIZE_MISMATCH_REQUIRES_INSPECTION'
save()
print(json.dumps({k: record[k] for k in ['state', 'job_id', 'bytes', 'sha256',
                 'full_decode', 'decoded_frames', 'decoded_fps', 'decoded_duration']}, ensure_ascii=True))
