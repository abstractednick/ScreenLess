# Design language

ScreenLess should feel like a **paper lamp in a dark library**, not a productivity SaaS and not a neon wellness app.

## Principles

1. **Analog warmth.** Cream paper, forest ink, clay accents. Serif display (Fraunces) with a human sans (Figtree / IBM Plex).
2. **No shame chrome.** No red failure banners. Peek copy is dry and kind.
3. **Presence over metrics.** The live room shows people first, percentages second, and never a ranked list of “worst phone addicts.”
4. **Small circles.** UI never implies scale. We do not show “2.4k windows today” in the consumer app.
5. **Windows as windows.** A screenless window is a frame you step through, not a lock screen.

## Color

| Token | Hex | Use |
|---|---|---|
| Forest | `#1B3A2F` | Primary, live room ground |
| Forest deep | `#0F1F1A` | Admin shell |
| Sage | `#4A7C59` | Focused state, flags on |
| Sage soft | `#9FC3A8` | Live-room labels |
| Cream | `#F4EFE4` | Consumer surfaces |
| Clay | `#C4785A` | Peek, brand letter-spacing, caution |
| Ink | `#1A1814` | Body text |

Do not introduce a fourth accent. If a new state appears, reuse clay or sage.

## Type

- Display / titles: Fraunces, optical size high, weight 500
- UI / body: Figtree (consumer) or IBM Plex Sans (admin)
- Letter-spacing on the word **SCREENLESS**: `0.2em`, clay, never bold black

## Motion

Short. The live room should feel still. A peek arrives as a new paper chip, not a bounce.

## Copy voice

Write like a friend who hates productivity influencers.

Yes: “Karan peeked at socials.”  
No: “Karan failed the session with 94s of Instagram.”

Yes: “Your garden.”  
No: “Gamified engagement loop.”

Yes: “Leave softly.”  
No: “Abandon challenge.”

## Admin vs consumer

The admin panel is **night forest**. The consumer app is **day paper**. Same tokens, inverted so operators never confuse the two windows.
