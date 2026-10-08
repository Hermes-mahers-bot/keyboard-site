# Keyboard — landing page

A small static site for a keyboard shop: one landing page and a detail page for
each of five switch types, with a scroll-driven keycap animation.

Live: <https://keyboard.aimaher.com>

## What is in here

```
index.html                 landing page: hero, scroll animation, five tiles
types/mechanical.html      one page per switch type
types/normal-profile.html
types/low-profile.html
types/scissor-switch.html
types/magnetic-switch.html
assets/site.css            the whole stylesheet
assets/scroll.js           the scroll animation driver
assets/img/*.jpg           the five product photographs
assets/k/mark.png          the logo: a keycap with an engraved K
assets/k/favicon-32.png
assets/k/apple-touch-icon.png
assets/k/frames/*.webp     40 pre-rendered animation frames
```

No build step, no package manager, no framework, no external requests. System
fonts only. Open `index.html` over a local server and it works:

```sh
python3 -m http.server 8000
```

## The scroll animation

The keycap is a 3D model, not CSS. It was built and rendered headlessly in
Blender 4.5 with Cycles on the CPU: a tapered keycap with a dished top, the
letter K boolean-cut into the surface and the recess assigned a dark material,
lit with three sun lamps against a flat background.

The animation is **not a video**. It is 40 still frames, and `assets/scroll.js`
swaps the image as you scroll: progress through the tall band picks a frame, and
the frame images are preloaded so the swap is instant. That keeps it reliable on
phones, where scrubbing a video by `currentTime` is not.

The band is `240vh` tall with a sticky stage, so one screen of scrolling is about
140 `vh` of animation. With `prefers-reduced-motion: reduce` the script skips the
scrub entirely and shows the final frame.

The frames are 800x600 WebP with a **transparent background**, so the keycap
composites straight onto the band colour. Changing `--night` in the stylesheet
needs no re-render. The whole sequence is about 200 KB.

## The product images

The five source photographs arrived as screenshots with the caption text baked
into the bottom of the file. They were cropped to drop the caption, then
flat-fielded: the background was a white-to-grey gradient, so each row is scaled
so the background becomes exactly the tile colour (`#f5f5f7`). That is why the
keyboards sit on their tiles without a visible edge.

## Editing

Everything is plain HTML and CSS. The five product pages share the same markup
structure, so copy one file and edit the text. The nav and footer are repeated in
each file on purpose: the site has no build step.

Colours live in `:root` at the top of `assets/site.css`. There is one accent
colour, `--accent`.

## Notes

- Pages carry `<meta name="robots" content="noindex">` while the site is a draft.
  Remove that line to let search engines index it.
- No analytics, no cookies, no third-party requests.
