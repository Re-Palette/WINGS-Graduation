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

### Importing photographs

Put the originals in a `photos/` folder and run:

```bash
npm run photos              # reads ./photos, writes ./public/images
npm run photos -- --dry-run # report what it would do, write nothing
```

```
photos/
  huddle-hero.jpg      the huddle, wide — the whole site opens on it
  huddle-final.jpg     the huddle, tighter crop            (chapter 06)
  sky-sunset.jpg       sunset, silhouettes low in frame    (chapter 07)
  year-01.jpg          1年生 / 初大会
  year-02.jpg          2年生 / 新体制
  year-03.jpg          3年生 / 最後の大会
  memories/*.jpg       the memory cloud, in filename order (chapter 04)
  members/*.jpg        one portrait per member; the filename becomes
                       the member id                       (chapter 05)
```

Every slot is optional — import what you have and run it again as more
photographs arrive. Slots you haven't supplied are left untouched, so a
second run never wipes out the first.

The script auto-orients from EXIF, crops to each slot's shape with
face-aware framing, converts to WebP, and **drops EXIF metadata** so
camera originals don't carry GPS coordinates or device names onto a
public site. The originals stay out of git (see `.gitignore`); the
optimised files in `public/images` are what get committed.

JPEG, PNG, WebP, TIFF and AVIF are read directly. iPhone `.HEIC` files
need converting first — on a Mac, opening them in Preview and exporting
as JPEG is enough.

### Adding to the memory cloud

Set `MEMORY_COUNT` in `src/lib/content.ts` to the number of photographs
and the layout places them for you — spread across the frame, each at its
own depth so they surface one at a time. Nothing needs positioning by
hand at any count.

Captions and alt text come from `memoryDetails` in the same file, in file
order. The list can be shorter than the photographs; anything past the
end falls back to a generic label, so you can add pictures first and
describe them later.

### Adding member portraits

Cards render a monogram plate until a portrait exists, so the section is
complete before every photo has been collected. To switch a card to
photography, put the file at `public/images/members/<id>.webp` (or run
the import) and add one field to that roster entry in
`src/lib/content.ts`:

```ts
{
  id: 'member-01',
  name: '山田 花子',                              // or a role, as now
  reading: 'やまだ はなこ',
  monogram: '01',
  role: 'CAPTAIN',
  word: '誰よりも先に立って、誰よりも長く残っていた。',
  photo: '/images/members/member-01.webp',
}
```

The roster is a plain list — add or remove entries freely; the grid
reflows.

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
