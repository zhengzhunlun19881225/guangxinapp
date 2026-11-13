"""Download exact, unmodified Figma exports for this standalone App."""
import concurrent.futures, json, pathlib, subprocess, time
root = pathlib.Path(__file__).resolve().parents[1]
assets = json.loads((root / 'design-reference/assets.json').read_text())
extra = root / 'design-reference/asset-overrides.json'
if extra.exists():
    assets = list(set(assets + json.loads(extra.read_text())))
dest = root / 'public/assets/figma'
dest.mkdir(parents=True, exist_ok=True)
def fetch(url):
    target = dest / url.rsplit('/', 1)[1]
    if target.exists() and target.stat().st_size > 0:
        return
    for attempt in range(3):
        try:
            data = subprocess.check_output(['curl', '-fsSL', '--max-time', '45', url])
            if not data or data.startswith(b'<!DOCTYPE'):
                raise ValueError('Invalid asset response')
            target.write_bytes(data)
            return
        except Exception:
            if attempt == 2: raise
            time.sleep(1)
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    list(pool.map(fetch, assets))
print(f'Downloaded {len(assets)} original Figma assets.')
