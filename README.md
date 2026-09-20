# WINGS — 1st Generation Graduation

A cinematic scroll experience for the first generation of the
**Haneda International High School Cheerleading Team, WINGS**.

The whole site is built around one photograph — the last huddle — and
treats it as a storytelling device rather than a picture on a page: it
opens inside the huddle at 420%, pulls back across eight chapters, and
returns whole for the farewell.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

Node 20+ recommended.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css`) |
| Scroll | Lenis, handed to GSAP so both share one clock |
| Animation | GSAP + ScrollTrigger; Framer Motion for the preloader |

## The eight chapters

| | Section | Component | What it does |
|---|---|---|---|
| 01 | Opening | `sections/Opening.tsx` | Dark room, the overture, then a pinned pull-back from inside the huddle to the full cinemascope band |
| 02 | Our Story | `sections/OurStory.tsx` | The huddle holds still; six lines cross-fade over it |
| 03 | Three Years | `sections/ThreeYears.tsx` | Horizontal timeline driven by vertical scroll |
| 04 | Memories | `sections/Memories.tsx` | Polaroids surface out of a drawn sky through 3D depth |
| 05 | Member | `sections/Team.tsx` | Editorial portrait cards with parallax media |
| 06 | The Final Huddle | `sections/FinalHuddle.tsx` | The emotional peak — the longest runway on the site |
| 07 | Thank You | `sections/ThankYou.tsx` | The huddle dissolves into the sunset |
| 08 | Ending | `sections/Ending.tsx` | The page takes flight, the wing draws itself, fade to white |

## Editing the site

**All copy, the roster and the photo manifest live in one file:
`src/lib/content.ts`.** No component needs touching to change a word, add
a member, reorder the memory cloud or repoint an image.

### Adding member portraits

Cards render a monogram plate until a portrait exists, so the section is
complete before every photo has been collected. To switch a card to
photography, drop the file in `public/images/members/` and add one field:

```ts
{ id: 'member-01', name: 'CAPTAIN', /* … */, photo: '/images/members/member-01.webp' }
```

### Replacing the photography

Assets live in `public/images/`. Swapping a file for a real photograph at
the same path is all that is needed — nothing else refers to them.

| File | Used by | Wants |
|---|---|---|
| `huddle-hero.webp` | 01, 02, 03, 05 | The huddle, wide (≈2.9:1) |
| `huddle-final.webp` | 06 | The huddle, tighter crop |
| `sky-sunset.webp` | 07 | Sunset, silhouettes low in frame |
| `year-01/02/03.webp` | 03 | One photo per school year, landscape |
| `memory-01…10.webp` | 04 | Polaroid contents, roughly 4:3 |

> **On the current images.** They were cut from the design comp, which is
> the only source that came with the brief, so they are low-resolution
> derivatives — good enough to build and review against, not what should
> ship. Several comp panels also have the comp's own typography baked into
> the pixels; those regions were avoided, and the Memories sky is drawn in
> CSS (`components/ui/Sky.tsx`) rather than sampled. Replacing them with
> the team's real photographs needs no code changes.

## Motion and accessibility

Every scene has a reduced-motion path that presents the same content at
rest: Lenis stands aside for native scrolling, the pinned runways collapse
(the page goes from ~28 screens to ~11), the memory cloud becomes a
gallery grid, and stacked lines become a readable list. Nothing is
animation-only — no copy is reachable solely by scrolling.

Chapters are landmarked and labelled in Japanese, the nav reflects the
section in view with `aria-current`, and decorative layers (grain,
vignette, rays, particles) are all `aria-hidden`.

## Deploying

A static-friendly Next build with no runtime services. On Vercel it works
with defaults. Set `NEXT_PUBLIC_SITE_URL` to the real origin so Open Graph
and Twitter card image URLs resolve absolutely.
