# booking.js - Explained Like You're 12

## What Does This File Do?

This file controls the **booking page** — where you fill out a form to book a tech support session. It handles 5 things:

1. Pre-filling the service type from the URL
2. Picking a time slot
3. Submitting the form and showing a success popup
4. Auto-detecting your computer's specs
5. Recording a voice note

---

## The Starter Gun (Again!)

```javascript
document.addEventListener('DOMContentLoaded', function () {
  prefillServiceFromURL();
  setupBookingForm();
  setupHardwareDetect();
  setupAudioRecorder();
});
```

Just like `main.js`, we wait for the page to load, then run all our setup functions.

---

## Part 1: Pre-filling the Service (prefillServiceFromURL)

Imagine you're on the Services page and you click "Book Now" on "Software Support." The link takes you to:

```
booking.html?service=software-os
```

That `?service=software-os` part is called a **URL parameter** — it's like a secret note passed through the web address.

This function reads that note, looks at the dropdown menu on the booking form, and **automatically selects "Software"** for you. So you don't have to pick it yourself!

It splits `software-os` by the dash and takes the first word (`software`), then finds the matching option in the dropdown.

---

## Part 2: Time Slot Picking

There are buttons on the page showing different times (like "10:00 AM", "2:00 PM", etc.). When you click one:

1. All buttons lose their "selected" look (so only one can be picked at a time)
2. The one you clicked gets highlighted
3. The chosen time is saved in a hidden input field (so the form knows what time you picked)

It's like picking a seat at the movies — you can only sit in one seat!

---

## Part 3: Submitting the Form

When you click "Book Session":

1. **It checks:** Did you pick a date AND a time? If not, it shows an alert saying "Please select a date and a time slot."

2. **It creates a ticket ID:** Something like `TKT-4821`. The number is random (between 1000 and 9999). Think of it like a receipt number at a restaurant.

3. **It saves your ticket:** The ticket (with its ID, service type, date, and time) gets saved to something called `localStorage`. This is like a tiny notebook inside your browser that remembers things even after you close the page!

4. **It shows a success popup:** A modal (fancy popup) appears saying "Your session has been booked!" with your ticket ID.

5. **The "Track Queue Status" button** in the popup takes you to the queue page.

---

## Part 4: Auto-Detect Hardware (setupHardwareDetect)

There's a cool button that says "Auto Detect" your computer's specs. When you click it:

1. The button changes to say "Detecting..." (so you know it's working)
2. After a short pause (0.8 seconds), it fills in:
   - **Your OS:** It looks at your browser's "user agent" (a string that tells websites what device you're using) to figure out if you're on Windows, Mac, Linux, etc.
   - **Your CPU cores:** It checks `navigator.hardwareConcurrency` — this tells how many processor cores your computer has
   - **Your RAM:** It checks `navigator.deviceMemory` — this tells how much memory your device has (only works in some browsers!)
   - **Your screen size:** It reads `window.screen.width` and `window.screen.height` to get your screen resolution
3. The button changes to "Detected Successfully"

It's like your computer introducing itself: "Hi, I'm a Mac with 8 cores and 16 GB of RAM!"

---

## Part 5: Voice Note Recording (setupAudioRecorder)

Sometimes it's easier to **say** what's wrong than to type it. This feature lets you record a voice message!

There are 4 buttons:

| Button | What it does |
|--------|-------------|
| Record | Asks for microphone permission, then starts recording |
| Stop | Stops the recording and saves it |
| Play | Plays back what you recorded |
| Delete | Throws away the recording so you can start over |

### How Recording Works (Step by Step):

1. **Record button clicked:** The browser asks "Can this website use your microphone?" If you say yes, it starts recording using something called `MediaRecorder`.

2. **While recording:** Audio data comes in as little chunks (like puzzle pieces). They're collected in an array called `audioChunks`.

3. **Stop button clicked:** All the chunks are glued together into one big blob (literally called a `Blob`!). A playable URL is created from this blob.

4. **Play button clicked:** The audio plays through your speakers.

5. **Delete button clicked:** Everything is wiped clean, and you're back to the start.

The status text changes to tell you what's happening: "Recording...", "Recording saved.", "Playing..."

---

## Summary

| Feature | What It Does |
|---------|-------------|
| URL pre-fill | Automatically picks the right service when you come from the Services page |
| Time slots | Let you pick a time, only one at a time |
| Form submit | Creates a ticket ID, saves it, shows a success popup |
| Hardware detect | Reads your computer's specs from the browser |
| Voice recording | Records, plays, and deletes audio messages |

**This file only runs on the booking page** (booking.html).
