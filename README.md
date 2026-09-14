# Selenized Docs

A dark theme for Google Docs built on perceptually uniform palettes, designed
to cut visual noise and eye strain during long sessions.

![Google Docs with the Selenized Dark theme applied](docs/captura.png)

## Why

Most dark themes just invert colors and stop there. The real problem with an
interface isn't that it's bright — it's that it **competes for your
attention**: colors that jump out more than others, ads, full-color icons,
animations.

This theme goes after both:

- **Calibrated palettes.** Selenized Dark tunes all 16 colors to the same
  perceived lightness. They stay distinguishable by hue, but none of them
  demands attention over the rest.
- **Fewer elements.** The toolbar promos (Google One, Gemini), the logo, the
  account avatar and the add-on side panel are hidden. None of them do
  anything for the document you're writing.

## Install

It isn't on the Chrome Web Store. Load it unpacked:

1. Open `chrome://extensions` (or `brave://extensions`).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and pick this folder.

## Palettes

Switch them from the popup — they apply live, no reload.

| Palette | Source |
|---|---|
| **Selenized Dark** (default) | [jan-warchol/selenized](https://github.com/jan-warchol/selenized) |
| **Everforest Soft** | [sainnhe/everforest](https://github.com/sainnhe/everforest) |
| **Rosé Pine Moon** | [rose-pine](https://rosepinetheme.com) |

They're the same ones I run in kitty, so terminal and document match.

## How it works

Google Docs no longer renders text as HTML — it **rasterizes it into a
`<canvas>`**. There are no nodes inside a canvas to style, so no CSS can
change the color of your document's text. That splits the problem into two
halves with different solutions.

### The interface

Modern Docs paints with `--gm3-sys-color-*` design tokens. Redefining those
covers most of the ground in one go, which is far cleaner than chasing a
hundred selectors. The rest is targeted rules for what resists — Docs paints
some labels with its own brand colors, overriding the tokens.

Icon sprites are dark PNGs that would vanish against a dark background, so
they get inverted — excluding product logos, which are genuinely full-color.

### The page

The canvas is inverted wholesale:

```css
canvas.kix-canvas-tile-content {
  filter: invert(1) hue-rotate(180deg) brightness(var(--sd-ink));
  mix-blend-mode: screen;
}
```

- `invert(1)` — white paper becomes black, black text becomes white.
- `hue-rotate(180deg)` — restores the real hue of photos and colored text.
- `mix-blend-mode: screen` — lets the page background show through wherever
  the canvas turned black, tinting the paper with the palette color instead
  of flat black.
- `brightness()` — without it the text comes out **pure white**. Screening
  over an opaque background yields `255 − (1−b)·(255 − background)`, so solve
  for `b` to land that white exactly on each palette's text gray. That's
  where `--sd-ink` comes from: 0.66, 0.69 and 0.89 respectively.

## Limitations

These come from the technique, not the code, and any dark theme for Docs
shares them:

- **Images in your document get inverted**, because they're painted on the
  same canvas. The `hue-rotate` keeps them acceptable, not perfect.
- **`mix-blend-mode` can vary by GPU.** The popup ships a "flat black" option
  in case the page looks wrong.
- **Everforest and Rosé Pine don't nail the text hue**, only the lightness.
  Their grays are warm, and screening over a cool background can only add
  light, never subtract blue.

## Permissions

Only `storage`, to remember the selected palette. No service worker, no
network requests, and the content script runs solely on
`docs.google.com/document/*`.

## Reverting

Every block that hides something is commented as such in `css/theme.css`. To
bring back the promos, the logo, the avatar or the add-on panel, comment out
the matching block. The popup toggle disables everything at once.

## Credits

The canvas inversion technique comes from
[DocsAfterDark](https://github.com/waymondrang/docsafterdark) by Raymond
Wang. The CSS in this repo is original.

MIT.
