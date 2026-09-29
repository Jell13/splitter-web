# Split-It-Ez

A mobile-first bill-splitting app that lets you scan a receipt, snap a photo, or enter a bill manually — then split it fairly by assigning individual items to the people who ordered them, with tax and tip distributed proportionally.

**Try it without signing up.** Split-it is guest-first by design: you can scan a receipt and split a bill with friends in under a minute, no account required.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Technical Decisions](#technical-decisions)
  - [Receipt OCR: three attempts to get it right](#receipt-ocr-three-attempts-to-get-it-right)
  - [Guest mode as the primary experience](#guest-mode-as-the-primary-experience)
  - [Item-level splitting with proportional tax/tip](#item-level-splitting-with-proportional-taxtip)
  - [Non-obvious bugs worth knowing about](#non-obvious-bugs-worth-knowing-about)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)

---

## Overview

Most bill-splitting apps assume an even split, or make you manually type out every line item on a receipt. Split-it starts from the messier, more realistic case: someone ordered the $22 salmon, someone else got the $9 side salad, and one person's card is the one that actually hit the table.

The app supports three entry points into the same underlying split flow:

1. **Scan a receipt** — take or upload a photo, let AI extract the line items
2. **Manual entry** — type in a description, subtotal, tax, and tip, split evenly across a headcount
3. **Item assignment** — for scanned/photographed receipts, tap to assign each item to the person who ordered it, and the app computes everyone's share including their proportional slice of tax and tip

Everything works immediately as a guest. Signing in exists as an architectural layer underneath the guest experience, ready to be turned on for persistence, history, and multi-device sync — but it was deliberately not required for the app's core value.

## Key Features

- **Photo/camera receipt scanning** with AI-powered OCR that returns structured item data (name + price), not just raw text
- **HEIC support** — iPhone photos are converted to JPEG client-side before being sent for parsing, since the vision API doesn't accept HEIC
- **Manual entry flow** for bills without a receipt, or when scanning isn't worth it (4-step flow: details → headcount → review → summary)
- **Tap-to-assign item splitting** — select a participant, then tap the items that are theirs; multi-select and bulk-assign supported
- **Proportional tax/tip math** — each person's share of tax and tip is calculated from their share of the subtotal, not split evenly
- **Editable OCR output** — every scanned item, price, and total is editable before you commit to a split, because OCR is never perfect
- **Discount/promo handling** — the parser nets discounts into the item price (or drops a comped item entirely) instead of inserting a confusing negative line item
- **Clipboard export** — copy a clean, structured summary of who owes what, ready to paste into a text thread
- **Guest mode by default** — no login wall between opening the app and finishing a split

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | File-based routing mapped cleanly onto a multi-step wizard flow; server/client component split where it mattered |
| Styling | Tailwind CSS v4 | CSS-first config (`@theme`) for a small custom design system (soft blue palette, custom radius scale, tabular figures for money) without a separate config file |
| Client state | Zustand (with `persist`) | Each entry flow (manual, photo) is a multi-page wizard; Zustand + localStorage persistence keeps in-progress bill data alive across route changes without prop-drilling or a heavier state library |
| Backend / DB | Convex | Reactive queries, serverless mutations/actions, and file storage in one system, with a schema that supports both guest and authenticated usage |
| Auth | Clerk | Drop-in auth with a webhook (Svix-verified) that syncs `user.created` / `user.deleted` into Convex's `users` table |
| Receipt OCR | OpenAI Vision API (`gpt-4.1-nano`) | See [Technical Decisions](#receipt-ocr-three-attempts-to-get-it-right) below — this was not the first choice |
| Deployment | Vercel (frontend) + Convex (backend) | Standard pairing for a Next.js + Convex app; env vars split accordingly (see [Getting Started](#getting-started)) |

## Architecture

```
┌─────────────────────────────┐
│         Next.js App         │
│  (App Router, React, TSX)   │
│                              │
│  Zustand stores (client):   │
│   - manual-bill store       │
│   - photo-upload store      │
│   (persisted, hydration-    │
│    safe across route jumps) │
└───────────┬──────────────────┘
            │
            │ Convex client (reactive queries/mutations)
            ▼
┌─────────────────────────────┐        ┌──────────────────────┐
│           Convex             │        │        Clerk          │
│                              │◄───────┤  (authentication)     │
│  schema:                    │  Svix   │  webhook: user.created│
│   - users                   │  verified│  webhook: user.deleted│
│   - splits (items embedded) │  webhook└──────────────────────┘
│   - split_participants      │
│   - receiptImages           │
│                              │
│  functions:                 │
│   - queries / mutations     │
│   - actions (parseReceipt) ─┼────────► OpenAI Vision API
│   - httpActions (webhook)   │          (gpt-4.1-nano)
│   - file storage            │          returns structured
│                              │          {items, subtotal,
└─────────────────────────────┘           tax, tip} as JSON
```

Guest usage never touches the `users` table at all — participant identity for a guest split is generated and held entirely client-side. Signing in is additive, not a prerequisite.

## Technical Decisions

### Receipt OCR: three attempts to get it right

Getting from "a photo of a receipt" to "structured line items I can assign to people" turned out to be the hardest problem in the app, and it took three different approaches before landing on one that actually worked.

**1. Free/open OCR (first attempt).**
The first pass used a free OCR library to pull raw text off the receipt image. This technically "worked" in the sense that it returned text, but the output on a real, physically-photographed receipt — crumpled, off-angle, with a thermal-printer font — was unreliable. Line items ran together, prices got misread, and there was no structure to the output at all; it was just a wall of text that would have needed a second parsing pass (with its own failure modes) to turn into `{name, price}` pairs. For a feature whose entire value proposition is "just take a photo," inaccurate-and-unstructured wasn't a viable foundation.

**2. Google Document AI (second attempt).**
The next attempt was Google's Document AI, expecting a purpose-built receipt parser to solve the accuracy problem. It didn't, for a specific reason: Document AI's specialized processors are strongest on **scanned documents** — flat, well-lit, properly cropped — and at the time, there wasn't a current model with real receipt-specific parsing built for photographs taken on a phone in a restaurant. Getting usable results out of it meant the *input* had to be a near-perfect image (good lighting, minimal skew, no crumpling), which pushed the burden of accuracy onto the user rather than the software. That's a bad trade for a mobile app where the whole point is "just snap a photo," so this was also set aside.

**3. OpenAI Vision API (current approach).**
The final approach flips the problem: instead of a purpose-built document-scanning pipeline, it uses a general-purpose vision model (`gpt-4.1-nano`) with a prompt that asks directly for structured JSON — item names, prices, subtotal, tax, and tip — including explicit instructions for handling discounts and promos (net a discount into the item's price rather than emitting it as a separate line item; drop an item entirely if a promo made it free). This handled real, imperfect, phone-camera receipt photos far better than either prior approach, because the model is reasoning about the image semantically rather than doing character-level recognition against a rigid template.

The result of every attempt is treated as a **first draft, not a final answer** — the review screen after scanning lets the user edit every item, price, and total before committing to a split, because even the best OCR pass on a crumpled receipt isn't going to be perfect every time.

### Guest mode as the primary experience

Most bill-splitting apps assume you'll create an account before you can do anything, because they're built around persistent balances and history. Split-it flips that assumption: **the primary experience requires no account**, and authentication is a layer that sits underneath it for the features that genuinely need persistence (history, multi-device sync, tracking who's paid over time).

This shows up architecturally in a few ways:
- Participant identities in a guest split are generated and held client-side — they never touch the `users` table
- `receiptImages.uploadedByUserId` is optional, so an uploaded receipt doesn't require a signed-in uploader
- The full account/auth system (Clerk + Convex sync via webhook) is built and working, but the UI doesn't gate any core flow behind it — it's there, wired up, and ready to re-enable account-dependent features (see [Roadmap](#roadmap)) without a schema migration

The bet: showing someone the app's value in the first 60 seconds, with zero signup friction, matters more up front than persistence does. Persistence can be layered in later for users who want it, on top of infrastructure that already exists.

### Item-level splitting with proportional tax/tip

A flat "split evenly" model breaks down as soon as one person orders a $30 entrée and another orders a $6 appetizer. Split-it's item-assignment flow lets each item be assigned to one or more participants, then computes:

1. Each participant's **subtotal** — the sum of the prices of items assigned to them
2. Each participant's **share of tax and tip** — proportional to their share of the overall subtotal, not divided evenly across headcount
3. Each participant's **total owed** — their item subtotal plus their proportional tax/tip

This means the person who ordered the $6 side salad isn't paying the same tax and tip as the person who ordered the $30 steak — their share scales with what they actually consumed.

### Non-obvious bugs worth knowing about

A few bugs surfaced during development that weren't visible in desktop browser dev tools and only showed up on real phones — worth documenting since they're easy to reintroduce:

- **`100vh` vs `100dvh` on mobile.** `min-h-screen` (Tailwind's `100vh`) doesn't account for a mobile browser's address bar and toolbar showing/hiding as the user scrolls, which changes the *actual* visible viewport height at runtime. Desktop dev-tools device emulation doesn't reproduce this, so the bug was invisible until testing on an actual phone. Fixed by switching to `dvh` (dynamic viewport height) units, which track the real, current viewport.
- **Flexbox's `min-height: auto` default.** Even after switching to `dvh`, a scrollable middle section inside a `flex flex-col` layout (header / scrollable content / footer button) still wouldn't scroll internally — the whole page scrolled instead, pushing the footer button off-screen. The cause: a flex child's default `min-height` is `auto`, which lets it grow to fit its content and ignore `flex-1` + `overflow-y-auto`. The fix is adding `min-h-0` to the scrollable flex child, alongside a **fixed-height** (`h-dvh`, not `min-h-dvh`) outer container and `shrink-0` on the header/footer regions.
- **HEIC images and the vision API.** Photos taken on an iPhone default to HEIC/HEIF, which OpenAI's vision endpoint doesn't accept. Fixed with a client-side check (`isHeic()` on file type/extension) that converts the image to JPEG via the Canvas API before it's ever uploaded.

## Project Structure

```
splitapp/
├── app/
│   ├── page.tsx                          # Home screen
│   ├── components/
│   │   └── BottomNav.tsx                 # Home / Add expense / About
│   ├── stores/
│   │   ├── manual-bill.ts                # Zustand store: manual entry flow
│   │   └── photo-upload.ts               # Zustand store: photo/scan flow
│   └── add-expenses/
│       ├── manual/
│       │   ├── bill-details/page.tsx     # Step 1: description, subtotal, tax, tip
│       │   ├── guest-count/page.tsx      # Step 2: headcount
│       │   ├── review/page.tsx           # Step 3: confirm totals + participants
│       │   └── summary/page.tsx          # Step 4: per-person share
│       └── photo/
│           ├── confirm/page.tsx          # Photo capture/upload, HEIC conversion, OCR call
│           ├── review/page.tsx           # Editable OCR output (items, tax, tip)
│           ├── assign-items/page.tsx     # Tap-to-assign items to participants
│           ├── final-review/page.tsx     # Computed per-person totals
│           └── summary/page.tsx          # Done screen, clipboard export
├── convex/
│   ├── schema.ts                         # users, splits, split_participants, receiptImages
│   ├── http.ts                           # Clerk webhook (httpAction)
│   ├── users.ts                          # createFromClerk / deleteFromClerk
│   ├── receipts.ts                       # parseReceipt action (OpenAI vision call)
│   └── split.ts                          # file upload + receipt image mutations
└── components/ui/                        # shared primitives (Avatar, etc.)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account and project
- A [Clerk](https://clerk.com) application
- An [OpenAI](https://platform.openai.com) API key with access to vision-capable models

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

These are split across two places, because Next.js/Vercel and Convex don't share an env store.

**`.env.local`** (Next.js — used by the frontend, and mirrored into Vercel's project settings for deployment):

```bash
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

**Convex dashboard** (or `npx convex env set`) — used by Convex functions, not visible to the Next.js frontend:

```bash
OPENAI_API_KEY=
CLERK_WEBHOOK_SECRET=
CLERK_JWT_ISSUER_DOMAIN=
```

> The Clerk webhook endpoint must be registered as a **relative path** (e.g. `/clerk-webhook`), not the full deployment URL — Convex's `http.ts` router matches on the path only.

### 3. Run Convex and the dev server

```bash
npx convex dev
```

In a second terminal:

```bash
npm run dev
```

### 4. Deploy

```bash
npx convex deploy   # backend
vercel deploy       # frontend
```

Remember to set the production equivalents of the env vars above in both Vercel's project settings and the Convex production deployment's environment — they don't inherit from dev.

## Roadmap

The account/authentication system is fully built and functional at the data layer, but not yet exposed in the UI. Planned next steps for re-enabling it:

- Persistent split history for signed-in users (balance/history queries are already written against the schema)
- **Groups** — recurring sets of people you split with regularly
- Settle-up tracking via the existing `hasPaid` field on `split_participants`
- Linking a manually-typed guest participant to a real account after the fact, so history can be reconciled retroactively
- Multi-device sync for a signed-in user's in-progress splits

---

Built as a personal project to explore the intersection of a reactive backend (Convex), a lightweight persisted client state layer (Zustand), and a genuinely hard real-world OCR problem — a receipt photo is a much messier input than it looks like it should be.
