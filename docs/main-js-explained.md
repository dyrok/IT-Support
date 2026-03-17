# main.js - Explained Like You're 12

## What Does This File Do?

Think of `main.js` like a **helper that runs on every single page** of the website. It does two things:

1. Makes the menu work on phones
2. Highlights which page you're currently on

---

## Part 1: The Starter Gun

```javascript
document.addEventListener('DOMContentLoaded', function () {
  setupMobileNav();
  highlightActiveNavLink();
});
```

Imagine the website is like a classroom. `DOMContentLoaded` is like the school bell ringing — it means "everything is loaded and ready!" Once the bell rings, we call our two helper functions.

---

## Part 2: The Phone Menu (setupMobileNav)

On a computer, the sidebar menu is always visible on the left side. But on a phone, the screen is too small, so the menu is hidden. There's a little **hamburger button** (three lines ☰) that you tap to open it.

Here's what happens:

- **When you tap the hamburger button:** The sidebar slides open (we add a class called `open` to it)
- **When you tap it again:** The sidebar slides closed (we remove `open`)
- **When you tap anywhere else on the screen:** The sidebar closes too — because nobody wants a menu stuck open!

The code uses `classList.toggle('open')` which is like a light switch — tap once = ON, tap again = OFF.

There's also a clever check: `window.innerWidth <= 768`. This means "only do the close-on-click thing if the screen is phone-sized (768 pixels wide or less)." On a big computer screen, we don't need this.

---

## Part 3: Highlighting the Current Page (highlightActiveNavLink)

You know how when you're on a website, the page you're currently on is usually highlighted in the menu? That's what this does!

Here's how it works:

1. It looks at the URL (the web address) to figure out which page you're on
2. It goes through every link in the sidebar menu
3. It checks: "Does this link match the page we're on?"
4. If yes → it adds a class called `active` (which makes it look highlighted with a different color)
5. If no link matches → it just highlights the first one (Home) as a safe default

It's like when you're reading a book and you put a bookmark on the chapter you're currently reading!

---

## Summary

| What | Why |
|------|-----|
| Mobile menu toggle | So people on phones can open/close the sidebar |
| Click outside to close | So the menu doesn't stay stuck open |
| Active link highlight | So you always know which page you're on |

**This file is loaded on EVERY page** because every page needs the menu and the highlighting to work!
