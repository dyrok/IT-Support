# FixMyPC - User Flow

## Overview

FixMyPC is a remote tech support website where users can browse services, book a support session, and wait in a virtual queue to connect with a technician.

---

## The Complete User Journey

```
  +------------------+
  |    HOME PAGE     |
  |   (index.html)   |
  |                  |
  | "Welcome to      |
  |  FixMyPC!"       |
  +--------+---------+
           |
           | User clicks "View Services"
           | or a service card
           v
  +------------------+
  |  SERVICES PAGE   |
  | (services.html)  |
  |                  |
  | Lists all the    |
  | support services |
  | available:       |
  | - Software       |
  | - Hardware       |
  | - Network        |
  | - Data Recovery  |
  +--------+---------+
           |
           | User clicks "Book Now"
           | on a service card
           | (passes ?service=software-os in URL)
           v
  +------------------+
  |  BOOKING PAGE    |
  | (booking.html)   |
  |                  |
  | 1. Service auto- |
  |    selected from |
  |    URL parameter |
  | 2. Fill in name, |
  |    email, phone  |
  | 3. Pick a date   |
  | 4. Pick a time   |
  |    slot          |
  | 5. (Optional)    |
  |    Auto-detect   |
  |    hardware      |
  | 6. (Optional)    |
  |    Record a      |
  |    voice note    |
  | 7. Submit form   |
  +--------+---------+
           |
           | Form submitted!
           | Ticket ID generated (TKT-XXXX)
           | Ticket saved to localStorage
           v
  +------------------+
  |  SUCCESS MODAL   |
  |  (popup on       |
  |   booking page)  |
  |                  |
  | "Your session    |
  |  has been        |
  |  booked!"        |
  | Ticket: TKT-4821 |
  +--------+---------+
           |
           | User clicks
           | "Track Queue Status"
           v
  +------------------+
  |   QUEUE PAGE     |
  |  (queue.html)    |
  |                  |
  | Shows list of    |
  | all booked       |
  | tickets from     |
  | localStorage     |
  +--------+---------+
           |
           | User clicks on
           | a ticket
           v
  +------------------+
  | QUEUE TRACKING   |
  | VIEW             |
  |                  |
  | Position: 5      |
  | Wait: ~25 mins   |
  | [Yellow Ring]    |
  |                  |
  |  ...countdown... |
  |                  |
  | Position: 1      |
  | Wait: Now        |
  | [Green Ring]     |
  | [Connect Button  |
  |  starts pulsing] |
  +--------+---------+
           |
           | User clicks
           | "Connect to Technician"
           v
  +------------------+
  | SESSION SCREEN   |
  |                  |
  | "Session         |
  |  Connected"      |
  |                  |
  | Timer: 02:35     |
  |                  |
  | [End Session]    |
  +------------------+
           |
           | User clicks "End Session"
           | (page reloads)
           v
     Back to Queue Page
     (ticket list)
```

---

## Page-by-Page Breakdown

### 1. Home Page (index.html)
- **What the user sees:** A welcome screen with quick info about FixMyPC, service highlights, and a call-to-action to book or explore services.
- **JavaScript used:** `main.js` (sidebar menu + active nav highlighting)
- **Where they can go next:** Services page, Booking page, any page via sidebar

### 2. Services Page (services.html)
- **What the user sees:** Cards showing all available support categories (Software, Hardware, Network, Data Recovery, etc.) with descriptions and "Book Now" buttons.
- **JavaScript used:** `main.js`
- **Where they can go next:** Booking page (with service pre-selected via URL)

### 3. Booking Page (booking.html)
- **What the user sees:** A multi-section form to book a session.
- **JavaScript used:** `main.js` + `booking.js`
- **Key interactions:**
  - Service dropdown is auto-filled if coming from Services page
  - Date picker for choosing the appointment day
  - Time slot buttons (click to select, only one at a time)
  - "Auto Detect" button to fill in computer specs automatically
  - Voice recorder to describe the issue verbally
  - Submit button to complete booking
- **Where they can go next:** Success modal -> Queue page

### 4. Queue Page (queue.html)
- **What the user sees:** A list of all booked tickets (pulled from localStorage).
- **JavaScript used:** `main.js` + `queue.js`
- **Key interactions:**
  - Click a ticket to see queue position
  - Watch position count down (simulated)
  - See color-coded status ring (red -> yellow -> green)
  - Click "Connect" when it's your turn
  - View session timer after connecting
  - Click "End Session" to finish
- **Where they can go next:** Session screen -> Back to ticket list

### 5. Contact Page (contact.html)
- **What the user sees:** Contact information and possibly a contact form.
- **JavaScript used:** `main.js`
- **A standalone page** — users can visit it anytime from the sidebar.

---

## How Data Flows Between Pages

```
                    localStorage
                 (browser storage)
                        |
    booking.js ----WRITES----> fixmypc_tickets
                        |
    queue.js <----READS----- fixmypc_tickets
```

**The ticket object looks like this:**
```json
{
  "id": "TKT-4821",
  "service": "software",
  "date": "2026-03-20",
  "time": "2:00 PM"
}
```

Multiple tickets are stored as an array (list), newest first.

---

## Sidebar Navigation (Available on Every Page)

```
+------------------------+
|  FixMyPC               |
|------------------------|
|  > Home                |
|  > Services            |
|  > Book a Session      |
|  > My Requests         |
|  > Contact             |
+------------------------+
```

- On **desktop**: Sidebar is always visible on the left
- On **phone**: Sidebar is hidden, opened by tapping the hamburger menu (three lines)
- The **current page** is highlighted in the sidebar

---

## What Each JavaScript File Handles

| File | Pages It Runs On | What It Does |
|------|-------------------|-------------|
| `main.js` | ALL pages | Mobile menu toggle, active nav highlighting |
| `booking.js` | booking.html only | Form handling, hardware detection, voice recording |
| `queue.js` | queue.html only | Ticket list, queue simulation, session connection |
