#!/usr/bin/env python3
"""Publish an already verified dist directory; never execute builds as root."""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import tempfile

p = argparse.ArgumentParser()
p.add_argument('dist', type=Path)
p.add_argument('revision')
p.add_argument('--root', type=Path, required=True)
a = p.parse_args()
if not re.fullmatch(r'[0-9a-f]{40}', a.revision):
    p.error('Expected a full Git commit SHA')
if not (a.dist / 'index.html').is_file():
    p.error('Missing index.html')
if any(f.is_symlink() or f.name.startswith('.') for f in a.dist.rglob('*')):
    p.error('Build contains symlinks or hidden files')
a.root.mkdir(parents=True, exist_ok=True)
releases = a.root / 'releases'
releases.mkdir(exist_ok=True)
release = releases / a.revision
if release.exists():
    p.error('Release already exists; use the existing release for rollback')
stage = Path(tempfile.mkdtemp(prefix='.stage-', dir=releases))
try:
    shutil.copytree(a.dist, stage, dirs_exist_ok=True)
    (stage / 'release.json').write_text(json.dumps({'revision': a.revision}) + '\n')
    stage.rename(release)
finally:
    if stage.exists():
        shutil.rmtree(stage)
current = a.root / 'current'
previous = a.root / 'previous'
if current.is_symlink():
    pending = a.root / '.previous-next'
    pending.symlink_to(os.readlink(current))
    pending.replace(previous)
pending = a.root / '.current-next'
pending.symlink_to(Path('releases') / a.revision)
pending.replace(current)
print('Published revision:', a.revision)
