# queue.js - Explained Like You're 12

## What Does This File Do?

This file powers the **"My Requests" page** — where you can see all the support sessions you've booked and watch a simulated queue (like waiting in line at an amusement park ride!).

---

## The Big Picture

There are **two views** on this page:

1. **Ticket List View** — Shows all your booked sessions as a clickable list
2. **Queue Tracking View** — Shows your position in line when you click a ticket

You switch between them by clicking tickets (to go to queue view) or clicking "Back" (to return to the list).

---

## Part 1: Loading Your Tickets (renderTicketList)

Remember how `booking.js` saved your tickets to `localStorage`? This function reads them back!

```javascript
var tickets = JSON.parse(localStorage.getItem('fixmypc_tickets') || '[]');
```

This line says: "Go to the browser's notebook (`localStorage`), find the page called `fixmypc_tickets`, and read what's written there. If there's nothing, use an empty list `[]`."

### If You Have No Tickets:
It shows a friendly message saying "No sessions booked yet" with a big button to go book one. It's like going to a restaurant and being told "You haven't ordered anything yet — here's the menu!"

### If You Have Tickets:
It builds a list where each ticket shows:
- The ticket ID (like `TKT-4821`)
- The service type (like "Software")
- The date and time
- A little arrow (>) on the right to show it's clickable

Each ticket gets a click listener — when you click it, it opens the queue tracking view.

---

## Part 2: The Queue View (openQueueView)

When you click a ticket, the list disappears and you see a **queue tracker**. It shows:

- **Your position in line** (a number)
- **Estimated wait time** (like "~15 mins")
- **A colored ring** that changes color based on how long you'll wait
- **A "Connect" button** that's disabled until it's your turn

Everything starts with placeholder text ("--" and "Connecting to queue...") while the simulation starts up.

---

## Part 3: The Queue Simulation (startQueueSimulation)

This is the fun part! The website **pretends** you're waiting in a real queue.

Here's how it works:

1. **Pick a random starting position:** You start somewhere between position 3 and 7. It's random each time! (Like being placed in a line at random.)

2. **Count down:** Every 4 to 7 seconds (also random), your position moves forward by 1. So you go from 6... to 5... to 4... and so on.

3. **Update the display:** Each time you move forward, the screen updates.

It's like being at the doctor's office and watching the "Now Serving" number get closer and closer to yours!

---

## Part 4: The Color-Coded Ring

The ring around your position number changes color to tell you how long you'll wait:

| Color | Meaning | When It Shows |
|-------|---------|---------------|
| Red | "High wait time. Technicians are busy." | Position 6 or higher |
| Yellow | "Moderate wait. Moving forward." | Position 3 to 5 |
| Yellow | "You are next! Please get ready." | Position 2 |
| Green | "It is your turn!" | Position 1 |

The wait time is estimated as: **position x 5 minutes**. So position 4 = ~20 mins.

---

## Part 5: It's Your Turn! (showYourTurn)

When you reach position 1:

- The ring turns **green**
- The text says **"It is your turn!"**
- The wait time says **"Now"**
- The "Connect" button lights up and starts **pulsing** (glowing on and off) to grab your attention

It's like the roller coaster attendant waving you forward — "You're up!"

---

## Part 6: Connecting to a Technician

When you click the "Connect" button, the entire queue view is replaced with a **"Session Connected" screen**:

- A computer icon
- The text "Session Connected"
- "Secure remote connection established"
- A **live timer** that counts up (00:00, 00:01, 00:02...)
- An "End Session" button

The timer works by counting seconds and converting them to `MM:SS` format. For example, 125 seconds becomes `02:05`.

The `padStart(2, '0')` part makes sure single digits have a leading zero — so you get `02:05` instead of `2:5`.

Clicking "End Session" reloads the page, which takes you back to the ticket list.

---

## Part 7: The Back Button

At any point during the queue view, you can click "Back to requests" to go back to your ticket list. This:

1. Stops the queue countdown (clears the interval timer)
2. Hides the queue view
3. Shows the ticket list again

---

## How localStorage Connects Everything

Here's the cool part — `booking.js` and `queue.js` talk to each other through `localStorage`:

```
booking.js  ──saves tickets──>  localStorage  ──reads tickets──>  queue.js
```

It's like leaving a note in a shared locker:
- `booking.js` writes: "New ticket: TKT-4821, Software, March 15, 2:00 PM"
- `queue.js` opens the locker and reads: "Oh, there's a ticket here! Let me show it."

---

## Summary

| Feature | What It Does |
|---------|-------------|
| Ticket list | Shows all your booked sessions from localStorage |
| Empty state | Friendly message when you have no bookings |
| Queue simulation | Fake countdown from position 3-7 to 1 |
| Color ring | Red/Yellow/Green to show wait severity |
| Connect button | Activates when it's your turn, with a pulse animation |
| Session screen | Shows a timer counting up after you "connect" |
| Back button | Returns you to the ticket list |

**This file only runs on the queue page** (queue.html).
