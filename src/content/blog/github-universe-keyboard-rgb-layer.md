---
title: "Putting RGB controls on a layer for my GitHub Universe keyboard"
description: "A VIA key mapping file for the OmniVision keyboard from GitHub Universe 2026 that moves the RGB lighting controls to their own layer."
pubDate: "2026-11-04"
tags: ["Keyboards", "VIA", "QMK", "GitHub"]
draft: true
---

Greetings all! I picked up the OmniVision keyboard at GitHub Universe 2026, and while it's a fun piece of hardware, I quickly found that there wasn't an easy way to map the RGB lighting controls to keys. Rather than opening VIA every time I wanted to change the lighting, I built a key mapping file that puts those controls on their own layer, and I've shared it as a [gist](https://gist.github.com/jgarverick/c062a13d63d61641850f56fc7e34cc8a) for anyone else in the same boat.

<!-- TODO: Optional: add a photo of the keyboard, or a line about where at Universe you got it. -->

## What's in the gist

The gist has two files:

- **`README.md`:** Notes on the layout, the macro, and a reference table of lighting key codes.
- **`zed65-led.rev1.json`:** The VIA layout file itself. VIA identifies the board as "Zed65 Rev.1," which lines up with Mechlovin's Zed65 65% PCB platform in QMK.

## How the layers are set up

The layout uses the first two of the board's four layers, and the remaining two are left fully transparent:

- **Layer 0:** The standard typing layout, with the Fn key mapped to `FN_MO13` so that holding it switches to layer 1.
- **Layer 1:** F1 through F12, the RGB controls for toggling the lighting and adjusting the effect, hue, saturation, brightness, and speed, plus media, volume, and audio on and off keys.
- **Layers 2 and 3:** Every key is set to `KC_TRNS`, so they fall through to the layers below them.

Layer 1 also has a macro in two positions. Macro slot 0 sends Ctrl+Cmd+Shift+4, which on a Mac takes a screenshot of a selected area and copies it to the clipboard. If you don't use a Mac, be sure to remove it or swap in something more useful.

## Lighting key codes

Not every board handles lighting the same way, so the README includes a reference table of key codes for the three common lighting setups. Take the time to figure out which one your firmware uses before you start remapping:

| Action | RGB Matrix | RGBLight (underglow) | Mono backlight |
| --- | --- | --- | --- |
| Toggle | `RGB_TOG` | `0x7820` | `0x7802` |
| Next effect | `RGB_MOD` | `0x7821` | `0x7805` (step) |
| Previous effect | `RGB_RMOD` | `0x7822` | None |
| Hue up and down | `RGB_HUI` and `RGB_HUD` | `0x7823` and `0x7824` | None |
| Saturation up and down | `RGB_SAI` and `RGB_SAD` | `0x7825` and `0x7826` | None |
| Brightness up and down | `RGB_VAI` and `RGB_VAD` | `0x7827` and `0x7828` | `0x7804` and `0x7803` |
| Speed up and down | `RGB_SPI` and `RGB_SPD` | `0x7829` and `0x782A` | None |

## Using the layout

Getting the layout onto your own keyboard only takes a couple of steps:

1. Download `zed65-led.rev1.json` from the gist.
2. Connect the keyboard and open VIA.
3. Load the JSON file in VIA to apply the layout.
4. Hold Fn and use the layer 1 keys to adjust the lighting.

Of course, this is just how I like things set up. Don't shy away from rearranging the keys to suit the way you work.

<!-- TODO: Optional: add a line on anything you'd still like to change, such as using layers 2 and 3. -->

If you picked up one of these keyboards at Universe too, I hope this saves you a few trips into VIA. Enjoy!
