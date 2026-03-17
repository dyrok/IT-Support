# Hero Animation - Explained Like You're 12

## What Is the Hero Section?

The "hero" is the big banner at the top of the home page — the first thing you see when you visit the website. It has:

- **Left side:** A heading, description, and two buttons ("Book a Session" and "View Services")
- **Right side:** A cool animated visual with fake cursors moving around and little UI cards floating in the background

The animation is **entirely done with CSS** — no JavaScript needed!

---

## What's in the Animation?

The right side of the hero has two layers:

### Layer 1: Mock UI Cards (Background)

Three small fake "cards" that look like mini app windows. They sit in the background and don't move — they're just decoration to make it look like a collaborative workspace.

```
+--------------------+
| [green dot]        |   <-- mock-1 (top left)
| ████████████████   |       Has a green dot + two gray lines
| █████████          |
+--------------------+

    +--------------------+
    | [blue dot]         |   <-- mock-2 (middle right)
    | ████████████████   |       Has a blue dot + two gray lines
    | ██████████         |
    +--------------------+

+----------------+
| [amber dot]    |   <-- mock-3 (bottom left)
| █████████      |       Has an amber dot + one gray line
+----------------+
```

Each card is made of:
- A **colored dot** (like a status light — green, blue, or amber)
- **Gray lines** (representing fake text — like a skeleton/placeholder)
- A **frosted glass effect** (`backdrop-filter: blur(8px)` makes the background behind them blurry, like looking through frosted glass)

They're positioned with `position: absolute`, meaning they're placed at exact spots inside the hero visual area.

### Layer 2: Live Cursors (Foreground)

Three mouse cursors that float around on top of the cards. Each one has a **name tag** — like you'd see in Figma, Google Docs, or any collaborative tool where multiple people work together.

| Cursor | Name | Color | Speed |
|--------|------|-------|-------|
| cursor-1 | Alex | Blue (#2563eb) | 6 seconds per loop |
| cursor-2 | Priya | Rose/Pink (#e11d48) | 7 seconds per loop |
| cursor-3 | Sam | Green (#059669) | 5 seconds per loop |

Each cursor is an **SVG arrow shape** (the classic mouse pointer) followed by a colored **name label** (like a chat bubble).

---

## How the Cursor Animation Works

This is where the magic happens! Each cursor has a CSS `@keyframes` animation that makes it drift around in a loop.

### What Are Keyframes?

Imagine you're drawing a path on a map with 4 pins:

```
Pin 1 (start) -----> Pin 2 -----> Pin 3 -----> Pin 4 -----> back to Pin 1
```

CSS keyframes work the same way. You tell the browser: "At 0% of the animation, be HERE. At 25%, be THERE. At 50%, be over THERE." The browser smoothly moves between each point.

### Alex's Path (cursorMove1 — 6 seconds)

```
0%   → Start position (0, 0)
25%  → Move right 20px, down 15px
50%  → Move right 40px, up 5px
75%  → Move right 10px, down 20px
100% → Back to start (0, 0)
```

Picture it like this:
```
    Start/End
        *
         \
          * (25% — down-right)
         /
        * (50% — far right, slightly up)
         \
          * (75% — slight right, down)
         /
    Back to start
```

### Priya's Path (cursorMove2 — 7 seconds)

```
0%   → Start (0, 0)
30%  → Left 25px, down 10px
60%  → Left 10px, up 20px
80%  → Left 30px, down 5px
100% → Back to start
```

Priya's cursor mostly drifts to the **left** — opposite of Alex.

### Sam's Path (cursorMove3 — 5 seconds)

```
0%   → Start (0, 0)
20%  → Right 15px, up 10px
50%  → Left 10px, up 25px
80%  → Right 20px, up 5px
100% → Back to start
```

Sam's cursor drifts mostly **upward**.

### Why Different Speeds?

Each cursor loops at a different speed (5s, 6s, 7s). This is intentional! If they all moved at the same speed, they'd look robotic and synchronized — like a dance routine. By using different speeds, they look **random and natural**, like real people moving their mice independently.

The `ease-in-out` part means each movement starts slow, speeds up in the middle, then slows down at the end — just like how a real person moves a mouse (you don't jerk it from point to point).

The `infinite` part means the animation repeats forever, never stopping.

---

## The Background Glow

The hero section itself has a subtle glowing background made with `radial-gradient`:

```css
background:
  radial-gradient(ellipse 60% 50% at 85% 30%, rgba(37, 99, 235, 0.15) ...),
  radial-gradient(ellipse 40% 60% at 70% 80%, rgba(99, 102, 241, 0.08) ...),
  radial-gradient(ellipse 80% 40% at 20% 90%, rgba(37, 99, 235, 0.05) ...);
```

There are **3 soft blue/purple blobs** layered on top of each other. Think of it like shining 3 colored flashlights at a wall from different angles — you get a soft, blended glow. The `rgba` colors have very low opacity (0.15, 0.08, 0.05) so they're super subtle, like a gentle haze.

---

## The Frosted Glass Effect

The mock cards use:

```css
background-color: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(8px);
```

- `rgba(255, 255, 255, 0.75)` = white that's 75% opaque (slightly see-through)
- `backdrop-filter: blur(8px)` = everything behind the card gets blurred

Together, this creates a **frosted glass** look — like looking through a bathroom window. It's the same effect you see on iPhone notifications or macOS windows.

---

## Responsive Behavior

On screens smaller than 900px wide (tablets and phones), the entire hero visual section **disappears**:

```css
@media (max-width: 900px) {
  .hero-visual { display: none; }
}
```

This makes sense — on a small screen, there's no room for both the text and the animated cursors. The text content is more important, so the animation is hidden.

---

## No JavaScript Needed!

Here's a cool thing: **this entire animation uses zero JavaScript**. It's all CSS:

- `@keyframes` defines the movement paths
- `animation` applies the paths to elements
- `position: absolute` places everything precisely
- `radial-gradient` creates the background glow
- `backdrop-filter` creates the frosted glass

CSS animations run super smoothly because the browser's rendering engine handles them directly, without needing to run any code.

---

## Summary

| Element | What It Is | How It Moves |
|---------|-----------|-------------|
| Alex (blue cursor) | SVG arrow + name tag | Drifts right and down, 6s loop |
| Priya (pink cursor) | SVG arrow + name tag | Drifts left, 7s loop |
| Sam (green cursor) | SVG arrow + name tag | Drifts upward, 5s loop |
| Mock card 1 | Fake UI card (green dot) | Static (no animation) |
| Mock card 2 | Fake UI card (blue dot) | Static (no animation) |
| Mock card 3 | Fake UI card (amber dot) | Static (no animation) |
| Background | 3 radial gradients | Static soft blue/purple glow |

**The whole effect says:** "Look, multiple people are collaborating on your tech support — like a real-time teamwork tool!"
