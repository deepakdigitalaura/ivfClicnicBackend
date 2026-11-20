# -*- coding: utf-8 -*-
"""Strip the baked-in name banner from four doctor photos and square them to 4:5.

The hero container is aspect-[4/5] with object-cover + object-top, so it crops
from the bottom. For images whose ratio is ~0.74 the crop (24-32px) lands just
short of the banner height (33-50px), leaving a sliced-off strip of pink with
half a line of text in it -- visible on these four pages and no others.

The banner is redundant anyway: the page already prints the doctor's name as an
H1 beside the photo.

So: cut the banner off, then trim a few pixels of width so the result is exactly
4:5 and the container crops nothing at all.

Writes alongside the originals as *.fixed.webp for review; pass --apply to
replace the real files (git keeps the originals either way).

Usage:  python fix_doctor_photos.py [--apply]
"""
import os
import sys

from PIL import Image, ImageFilter

DIR = r"C:\Claude Projects\BFI\ivfClicnicBackend\public\assets\doctors"
TARGET = 0.8          # 4:5
UPSCALE = 2           # these are thumbnails; give the browser real pixels to work with

FILES = [
    "Dr.-Nilesh-Jain-221x300.webp",
    "Dr.-Parnnika-Agarwal-221x300.webp",
    "Dr.-Deepali-Pandya-1-1.webp",
    "Dr.-Suman-Singh.webp",
]

apply = "--apply" in sys.argv


def is_bar_pink(c):
    r, g, b = c[:3]
    return r > 180 and r - g > 70 and r - b > 30


def bar_height(im):
    """Rows of banner at the bottom, counting rows where pink dominates even
    though white glyphs sit on top of it."""
    w, h = im.size
    px = im.load()
    xs = list(range(0, w, max(1, w // 40)))
    run = 0
    for y in range(h - 1, -1, -1):
        if sum(1 for x in xs if is_bar_pink(px[x, y])) >= len(xs) * 0.45:
            run += 1
        else:
            break
    # The banner's top edge is anti-aliased, and some files carry a stray rule
    # above it, so keep eating rows upward while any pink remains -- a single
    # leftover line of magenta is exactly the artefact we are removing.
    while run < h * 0.3:
        y = h - 1 - run
        if y < 0:
            break
        if sum(1 for x in xs if is_bar_pink(px[x, y])) >= len(xs) * 0.12:
            run += 1
        else:
            break
    return run


print("%-34s %-11s %-5s %-11s %s" % ("file", "before", "bar", "after", "note"))
for name in FILES:
    src = os.path.join(DIR, name)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    bar = bar_height(im)
    before = "%dx%d" % (w, h)
    if not bar:
        print("%-34s %-11s %-5s %-11s %s" % (name, "%dx%d" % (w, h), "-", "-", "no banner found - skipped"))
        continue

    # a little extra: the banner's soft top edge survives an exact cut
    bar += max(3, int(h * 0.03))
    im = im.crop((0, 0, w, h - bar))           # drop the banner
    w, h = im.size

    if w / h > TARGET:                          # too wide -> trim evenly off the sides
        new_w = int(round(h * TARGET))
        off = (w - new_w) // 2
        im = im.crop((off, 0, off + new_w, h))
    else:                                       # too tall -> trim off the bottom
        new_h = int(round(w / TARGET))
        im = im.crop((0, 0, w, new_h))

    w, h = im.size
    # Lanczos + a light unsharp beats the browser's own upscale of a thumbnail.
    # It does not invent detail -- genuinely sharp photos still need the originals.
    im = im.resize((w * UPSCALE, h * UPSCALE), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=85, threshold=3))

    out = src if apply else src.replace(".webp", ".fixed.webp")
    im.save(out, "webp", quality=90, method=6)
    print("%-34s %-11s %-5d %-11s ratio %.3f -> %s"
          % (name, before, bar, "%dx%d" % im.size, im.size[0] / im.size[1],
             os.path.basename(out)))

print("\n%s" % ("Applied to the real files." if apply else "[preview] wrote *.fixed.webp - nothing replaced yet."))
