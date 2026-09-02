#!/usr/bin/env python3
"""
Generates the placeholder imagery under `public/images/`.

These are NOT photographs of real scooters or real people. They are
deliberately abstract, brand-coloured stand-ins that carry the correct aspect
ratios and a visible "PLACEHOLDER" label, so the layout can be judged with
images in place and nobody mistakes one for final artwork. Replace the files
with real photography and delete nothing else — the data files already point at
these paths.

Run:  python3 scripts/generate-placeholder-images.py
"""

from __future__ import annotations

import math
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "images")

SANS = "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"

INK = (20, 23, 28)
PAPER = (250, 250, 251)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def backdrop(w: int, h: int, accent: tuple[int, int, int], dark: bool) -> Image.Image:
    """Soft vertical wash plus the diagonal hatch used by the on-screen placeholder."""
    base = INK if dark else PAPER
    img = Image.new("RGB", (w, h), base)
    draw = ImageDraw.Draw(img, "RGBA")

    # Vertical wash towards the accent, strongest at the bottom.
    for y in range(h):
        t = (y / h) ** 1.6
        strength = 0.20 if dark else 0.13
        draw.line(
            [(0, y), (w, y)],
            fill=tuple(round(base[i] + (accent[i] - base[i]) * t * strength) for i in range(3)),
        )

    # Diagonal hatch, very low contrast.
    hatch = (255, 255, 255, 10) if dark else (20, 23, 28, 9)
    step = max(18, w // 46)
    for x in range(-h, w + h, step):
        draw.line([(x, 0), (x + h, h)], fill=hatch, width=1)

    return img


def label(
    img: Image.Image,
    title: str,
    sub: str,
    accent: tuple[int, int, int],
    dark: bool,
    caption: bool = True,
) -> None:
    """Chip always; the written caption only where the UI does not already say it.

    A lineup card prints the model name directly under the image and a team
    card prints the role, so burning the same words into the artwork just
    reads as a duplicate. Hero, gallery and OG images have no such caption
    beside them, so they keep it.
    """
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = img.size
    pad = round(w * 0.045)
    fg = (255, 255, 255) if dark else INK
    muted = (255, 255, 255, 150) if dark else (20, 23, 28, 130)

    if caption:
        draw.text((pad, h - pad - round(w * 0.052)), title, font=font(SANS_BOLD, round(w * 0.038)), fill=fg)
        draw.text((pad, h - pad - round(w * 0.008)), sub, font=font(SANS, round(w * 0.022)), fill=muted)

    # Corner chip so the image is unmistakably a placeholder at a glance.
    chip = "PLACEHOLDER"
    f = font(SANS_BOLD, round(w * 0.017))
    tw = draw.textlength(chip, font=f)
    bw, bh = tw + round(w * 0.028), round(w * 0.038)
    draw.rounded_rectangle([w - pad - bw, pad, w - pad, pad + bh], radius=bh // 2, fill=accent + (235,))
    draw.text((w - pad - bw + round(w * 0.014), pad + bh * 0.28), chip, font=f, fill=(255, 255, 255))


def _stamp(
    img: Image.Image,
    mask: Image.Image,
    fill: tuple[int, int, int],
    alpha: int,
    outline: Image.Image | None = None,
    outline_fill: tuple[int, int, int] | None = None,
    outline_alpha: int = 0,
) -> None:
    """Composites a silhouette through a single mask.

    Drawing overlapping translucent shapes one by one double-darkens wherever
    they intersect — a seat over a body, a neck over a head — which shows up as
    seams. Building the whole silhouette in a mask first and compositing once
    keeps the fill perfectly even.
    """
    flat = Image.new("RGB", img.size, fill)
    img.paste(flat, (0, 0), mask.point(lambda v: (v * alpha) // 255))

    if outline is not None and outline_fill is not None:
        stroke = Image.new("RGB", img.size, outline_fill)
        img.paste(stroke, (0, 0), outline.point(lambda v: (v * outline_alpha) // 255))


def scooter(img: Image.Image, accent: tuple[int, int, int], dark: bool) -> None:
    """A side-on step-through electric scooter, drawn from primitives.

    Coordinates are expressed in a 900-unit design space around the centre and
    scaled to the canvas, so the same shape holds at card, hero and OG sizes.
    """
    w, h = img.size
    s = min(w, h) / 900.0
    cx, cy = w / 2, h * 0.50
    lw = max(3, round(8 * s))

    def pt(x: float, y: float) -> tuple[float, float]:
        return (cx + x * s, cy + y * s)

    body_mask = Image.new("L", img.size, 0)
    line_mask = Image.new("L", img.size, 0)
    b = ImageDraw.Draw(body_mask)
    l = ImageDraw.Draw(line_mask)

    wheel_r = 112 * s
    rear = pt(-250, 130)
    front = pt(255, 130)

    outline_pts = [
        pt(-330, -30),   # tail top
        pt(-150, -46),   # seat front
        pt(-104, 30),    # drop to the footboard
        pt(120, 44),     # footboard, flat and low
        pt(196, -104),   # apron rises
        pt(268, -150),   # front top, under the stem
        pt(300, -96),    # front face
        pt(262, 60),     # apron bottom
        pt(120, 92),
        pt(-120, 92),    # underside of the footboard
        pt(-262, 60),
        pt(-338, 22),    # tail bottom
    ]
    seat = [*pt(-338, -86), *pt(-140, -26)]

    b.polygon(outline_pts, fill=255)
    b.rounded_rectangle(seat, radius=30 * s, fill=255)

    l.polygon(outline_pts, outline=255, width=lw)
    l.rounded_rectangle(seat, radius=30 * s, outline=255, width=lw)
    for wx, wy in (rear, front):
        l.ellipse([wx - wheel_r, wy - wheel_r, wx + wheel_r, wy + wheel_r], outline=255, width=lw)
    l.line([pt(276, -140), pt(250, -268)], fill=255, width=lw)   # stem
    l.line([pt(196, -286), pt(310, -258)], fill=255, width=lw)   # handlebar

    fill_rgb = (255, 255, 255) if dark else (20, 23, 28)
    _stamp(img, body_mask, fill_rgb, 34 if dark else 26, line_mask, fill_rgb, 104 if dark else 92)

    # Hubs and headlight sit on top, in the model's accent.
    draw = ImageDraw.Draw(img, "RGBA")
    for wx, wy in (rear, front):
        draw.ellipse(
            [wx - wheel_r * 0.33, wy - wheel_r * 0.33, wx + wheel_r * 0.33, wy + wheel_r * 0.33],
            fill=accent + (205,),
        )
    draw.ellipse([*pt(240, -142), *pt(300, -86)], fill=accent + (230,))


def portrait(img: Image.Image, accent: tuple[int, int, int]) -> None:
    """Head-and-shoulders silhouette, cropped like a real portrait.

    Deliberately faceless: it depicts nobody. The shoulders run off the bottom
    edge rather than stopping mid-frame, which is what makes it read as a
    photograph crop instead of an icon floating in space.
    """
    w, h = img.size
    cx = w / 2
    head_r = w * 0.150
    head_cy = h * 0.375
    lw = max(3, round(w / 190))

    # Soft accent disc behind the head, as a backdrop rather than a halo.
    ImageDraw.Draw(img, "RGBA").ellipse(
        [cx - head_r * 1.9, head_cy - head_r * 1.9, cx + head_r * 1.9, head_cy + head_r * 1.9],
        fill=accent + (26,),
    )

    body_mask = Image.new("L", img.size, 0)
    line_mask = Image.new("L", img.size, 0)
    b = ImageDraw.Draw(body_mask)
    l = ImageDraw.Draw(line_mask)

    sw = w * 0.345
    top = head_cy + head_r * 0.70
    shoulder_box = [cx - sw, top, cx + sw, top + sw * 2.2]
    flat_y = (shoulder_box[1] + shoulder_box[3]) / 2

    # Neck, then the shoulder dome, then the rectangle that carries the
    # shoulders off the bottom edge of the frame.
    b.rectangle([cx - head_r * 0.44, head_cy, cx + head_r * 0.44, flat_y], fill=255)
    b.pieslice(shoulder_box, start=180, end=360, fill=255)
    b.rectangle([shoulder_box[0], flat_y, shoulder_box[2], h], fill=255)
    b.ellipse([cx - head_r, head_cy - head_r, cx + head_r, head_cy + head_r], fill=255)

    # `arc`, not `pieslice`: a pieslice outline would draw its chord straight
    # across the shoulders as a visible horizontal seam.
    l.arc(shoulder_box, start=180, end=360, fill=255, width=lw)
    l.line([(shoulder_box[0], flat_y), (shoulder_box[0], h)], fill=255, width=lw)
    l.line([(shoulder_box[2], flat_y), (shoulder_box[2], h)], fill=255, width=lw)
    l.ellipse([cx - head_r, head_cy - head_r, cx + head_r, head_cy + head_r], outline=255, width=lw)

    _stamp(img, body_mask, (20, 23, 28), 30, line_mask, (20, 23, 28), 68)


def save(img: Image.Image, *parts: str) -> None:
    path = os.path.join(ROOT, *parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("  ", os.path.relpath(path, ROOT))


# One accent per model so a grid of cards does not read as five copies.
MODELS = [
    ("nduro", "Lectrix NDuro", (34, 168, 110)),
    ("lxs-3-0", "Lectrix LXS 3.0", (36, 128, 190)),
    ("lxs-2-0", "Lectrix LXS 2.0", (120, 96, 200)),
    ("zyro", "Lectrix ZYRO", (206, 120, 46)),
    ("sx25", "Lectrix SX25", (196, 74, 104)),
]

GALLERY_VIEWS = ["Three-quarter front", "Side profile", "Rear three-quarter", "Console detail"]

TEAM = [
    ("owner", "Owner", (34, 168, 110)),
    ("manager", "Showroom Manager", (36, 128, 190)),
    ("sales-1", "Sales Advisor", (120, 96, 200)),
    ("sales-2", "Sales Advisor", (206, 120, 46)),
    ("service", "Service Technician", (30, 150, 150)),
    ("support", "Support Executive", (196, 74, 104)),
]

BRANCH_VIEWS = [
    ("exterior", "Showroom exterior"),
    ("floor", "Display floor"),
    ("delivery", "Delivery bay"),
    ("workshop", "Service workshop"),
]


def main() -> None:
    print("products")
    for slug, name, accent in MODELS:
        for kind, (w, h), dark in (
            ("card", (1200, 900), False),
            ("hero", (1600, 1200), False),
            ("og", (1200, 630), True),
        ):
            img = backdrop(w, h, accent, dark)
            scooter(img, accent, dark)
            label(
                img,
                name,
                "Placeholder visual — replace with photography",
                accent,
                dark,
                caption=kind != "card",
            )
            save(img, "products", f"{slug}-{kind}.png")

        for i, view in enumerate(GALLERY_VIEWS, start=1):
            img = backdrop(1600, 1200, accent, i % 2 == 0)
            scooter(img, accent, i % 2 == 0)
            label(img, f"{name} — {view}", "Placeholder visual", accent, i % 2 == 0)
            save(img, "products", f"{slug}-gallery-{i}.png")

    print("team")
    for slug, role, accent in TEAM:
        img = backdrop(800, 1000, accent, False)
        portrait(img, accent)
        label(img, role, "Placeholder portrait — depicts nobody", accent, False, caption=False)
        save(img, "team", f"{slug}.png")

    print("branches")
    for slug, title in BRANCH_VIEWS:
        img = backdrop(1600, 1200, (34, 168, 110), False)
        label(img, title, "Placeholder photograph", (34, 168, 110), False)
        save(img, "branches", f"{slug}.png")

    print("brand")
    img = backdrop(1200, 630, (34, 168, 110), True)
    scooter(img, (34, 168, 110), True)
    d = ImageDraw.Draw(img)
    d.text((54, 54), "MAA AMBE ENTERPRISES", font=font(SANS_BOLD, 44), fill=(255, 255, 255))
    d.text((54, 112), "Authorized Lectrix EV Dealership", font=font(SANS, 30), fill=(34, 200, 130))
    save(img, "brand", "og-default.png")


if __name__ == "__main__":
    main()
