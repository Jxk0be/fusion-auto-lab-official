"""
Turns the supplied JPEG logo files into transparent PNGs for the website.

Run again any time the source art changes:

    python scripts/build-logos.py

Source files are expected on the Desktop (override with SOURCE_DIR below).
The black-background art is separated by treating each pixel's brightest
channel as its alpha and un-premultiplying the color, which keeps the soft
blue glow intact instead of leaving a hard cut-out edge.
"""

from pathlib import Path

from PIL import Image

SOURCE_DIR = Path.home() / "Desktop"
OUT = Path(__file__).resolve().parent.parent / "public"
DARK_BG = (16, 19, 21)  # --color-ink-950, used for the iOS icon


def unmultiply_from_black(im: Image.Image, cutoff: int = 7) -> Image.Image:
    """Art drawn on black: brightness becomes alpha."""
    im = im.convert("RGB")
    out = Image.new("RGBA", im.size)
    src = im.load()
    dst = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            a = max(r, g, b)
            if a <= cutoff:
                dst[x, y] = (0, 0, 0, 0)
                continue
            scale = 255 / a
            dst[x, y] = (
                min(255, int(r * scale)),
                min(255, int(g * scale)),
                min(255, int(b * scale)),
                a,
            )
    return out


def unmultiply_from_white(im: Image.Image, cutoff: int = 249) -> Image.Image:
    """Art drawn on white: distance from white becomes alpha."""
    im = im.convert("RGB")
    out = Image.new("RGBA", im.size)
    src = im.load()
    dst = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            lowest = min(r, g, b)
            if lowest >= cutoff:
                dst[x, y] = (0, 0, 0, 0)
                continue
            a = 255 - lowest
            f = a / 255
            dst[x, y] = (
                max(0, min(255, int((r - 255 * (1 - f)) / f))),
                max(0, min(255, int((g - 255 * (1 - f)) / f))),
                max(0, min(255, int((b - 255 * (1 - f)) / f))),
                a,
            )
    return out


def trim(im: Image.Image, pad: int = 8) -> Image.Image:
    box = im.getchannel("A").point(lambda v: 255 if v > 4 else 0).getbbox()
    if not box:
        return im
    left, top, right, bottom = box
    return im.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(im.width, right + pad),
            min(im.height, bottom + pad),
        )
    )


def to_width(im: Image.Image, width: int) -> Image.Image:
    height = round(im.height * width / im.width)
    return im.resize((width, height), Image.LANCZOS)


def shrink(im: Image.Image, colors: int = 200) -> Image.Image:
    """Palette-quantize with alpha. Glow gradients survive this fine and the
    files come out ~5x smaller, which matters for a logo in the header."""
    return im.quantize(colors=colors, method=Image.FASTOCTREE).convert("RGBA")


def square(im: Image.Image, size: int, background=None) -> Image.Image:
    """Centers the art on a transparent (or solid) square canvas."""
    art = im.copy()
    art.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (*background, 255) if background else (0, 0, 0, 0))
    canvas.paste(art, ((size - art.width) // 2, (size - art.height) // 2), art)
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    full = trim(unmultiply_from_black(Image.open(SOURCE_DIR / "Logo_Full.jpg")))
    mark = trim(unmultiply_from_black(Image.open(SOURCE_DIR / "Logo_Image_Only.jpg")))
    word = trim(unmultiply_from_white(Image.open(SOURCE_DIR / "Logo_Text_Only.jpg")))

    # Displayed at ~44px and ~180px wide, so 3x of that is plenty of pixels.
    shrink(to_width(mark, 320)).save(OUT / "logo-mark.png", optimize=True)
    shrink(to_width(word, 720)).save(OUT / "logo-wordmark.png", optimize=True)
    shrink(to_width(full, 720)).save(OUT / "logo.png", optimize=True)

    shrink(square(mark, 512)).save(OUT / "icon-512.png", optimize=True)
    shrink(square(mark, 192)).save(OUT / "icon-192.png", optimize=True)
    square(mark, 180, background=DARK_BG).convert("RGB").save(
        OUT / "apple-touch-icon.png", optimize=True
    )
    shrink(square(mark, 32), colors=128).save(OUT / "favicon.png", optimize=True)

    # Social share card: 1200x630 is what Facebook, iMessage and X expect.
    card = Image.new("RGBA", (1200, 630), (*DARK_BG, 255))
    art = to_width(full, 760)
    art.thumbnail((760, 470), Image.LANCZOS)
    card.paste(art, ((1200 - art.width) // 2, (630 - art.height) // 2), art)
    card.convert("RGB").save(OUT / "og-image.jpg", quality=88, optimize=True)

    for name in ("logo.png", "logo-mark.png", "logo-wordmark.png", "icon-512.png", "og-image.jpg"):
        img = Image.open(OUT / name)
        print(f"{name:22} {img.size[0]}x{img.size[1]}  {(OUT / name).stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
