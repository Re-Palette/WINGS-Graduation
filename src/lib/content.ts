/**
 * Every word and every asset reference in the experience lives here.
 * Editing this file is how you update the site — no component needs touching.
 */

import { buildMemoryCloud, type MemoryDetail } from '@/lib/memoryCloud';

export type { Memory } from '@/lib/memoryCloud';

export const team = {
  school: 'HANEDA INTERNATIONAL HIGH SCHOOL',
  unit: 'CHEERLEADING TEAM',
  name: 'WINGS',
  generation: '1st Generation',
  occasion: 'Graduation',
} as const;

export const nav = [
  { id: 'top', label: 'TOP' },
  { id: 'story', label: 'STORY' },
  { id: 'years', label: '3 YEARS' },
  { id: 'memories', label: 'MEMORIES' },
  { id: 'member', label: 'MEMBER' },
  { id: 'message', label: 'MESSAGE' },
] as const;

/* -----------------------------------------------------------------
   01 — OPENING
----------------------------------------------------------------- */
export const opening = {
  index: '01',
  label: 'OUR BEGINNING',
  /** Revealed one after another over the dark screen, before the photo. */
  overture: [team.school, team.unit, team.name],
  /** Lands as the huddle finishes pulling back into view. */
  declaration: ['あの日、', '私たちは', 'WINGSになった。'],
  year: '2024',
  scrollCue: 'SCROLL',
} as const;

/* -----------------------------------------------------------------
   02 — OUR STORY
----------------------------------------------------------------- */
export const story = {
  index: '02',
  label: 'OUR DAYS',
  lines: [
    '私たちは出会った。',
    '支え合った。',
    'ぶつかった。',
    '笑った。',
    '泣いた。',
    'そして、成長した。',
  ],
  aside: 'We grew together.',
  caption: ['同じ制服、同じ空の下。', '知らなかった私たちが、', 'チアリーディングでつながった。'],
} as const;

/* -----------------------------------------------------------------
   03 — THREE YEARS
----------------------------------------------------------------- */
export const years = {
  index: '03',
  label: 'OUR 3 YEARS',
  title: '3年間の軌跡',
  caption: [
    'たくさんの挑戦と、',
    'たくさんの想い出があった。',
    'それは、私たちにとって',
    'かけがえのない時間。',
  ],
  aside: '3 years, 1 story.',
  chapters: [
    {
      id: 'year-1',
      ordinal: '1st Year',
      grade: '1年生',
      title: '初大会',
      body: 'はじめてのユニフォーム。はじめての円陣。まだ何者でもなかった私たちが、マットの上に立った日。',
      image: '/images/year-01.webp',
      alt: 'WINGS の1年生が初めての大会に臨む様子',
    },
    {
      id: 'year-2',
      ordinal: '2nd Year',
      grade: '2年生',
      title: '新体制',
      body: '託された背中。積み上げたスタンツ。何度も崩れて、何度も組み直した一年。',
      image: '/images/year-02.webp',
      alt: '新体制となった2年生がスタンツを組む様子',
    },
    {
      id: 'year-3',
      ordinal: '3rd Year',
      grade: '3年生',
      title: '最後の大会',
      body: '照明の下、最後の2分30秒。三年分の想いを、ひとつの演技に。',
      image: '/images/year-03.webp',
      alt: '3年生最後の大会、満員の会場',
    },
  ],
} as const;

/* -----------------------------------------------------------------
   04 — MEMORIES
   `depth` (0–1) places each polaroid in Z space; `x`/`y` are viewport
   percentages. Tuned so nothing collides at any breakpoint.
----------------------------------------------------------------- */
/**
 * How many photographs are in the memory cloud. Drop the files in as
 * `memory-01.webp`, `memory-02.webp`, … (or run `npm run photos`) and set
 * this to match — the layout places them for you.
 */
export const MEMORY_COUNT = 10;

/**
 * Optional wording per photograph, in the same order as the files.
 * Anything past the end of this list falls back to a generic label, so
 * you can add photographs first and describe them later.
 *
 * `alt` is read aloud by screen readers; `caption` is printed on the
 * polaroid.
 */
const memoryDetails: MemoryDetail[] = [
  { alt: '円陣を組む背中', caption: 'Huddle' },
  { alt: '集合写真', caption: 'Everyone' },
  { alt: '夕暮れの整列', caption: 'Sunset' },
  { alt: '大会前の集合', caption: 'Before the mat' },
  { alt: '重ねた手', caption: 'Our hands' },
  { alt: '青と金のポンポン', caption: 'Blue & Gold' },
  { alt: 'ユニフォーム姿', caption: 'Uniform' },
  { alt: '屋外でのスタンツ', caption: 'Practice' },
  { alt: 'ベンチで待つチーム', caption: 'Waiting' },
  { alt: '夜の競技会場', caption: 'The arena' },
];

const memoryItems = buildMemoryCloud(MEMORY_COUNT, memoryDetails);

export const memories = {
  index: '04',
  label: 'MEMORIES',
  title: ['たくさんの', '思い出たち。'],
  caption: ['笑って、泣いて、', 'みんなで過ごした時間は、', '一生の宝物。'],
  aside: 'Thank you for all the memories.',
  items: memoryItems,
} as const;

/* -----------------------------------------------------------------
   05 — TEAM
   Drop a portrait at `public/images/members/<id>.webp` and add
   `photo: '/images/members/<id>.webp'` to switch a card to photography.
   Without a photo the card renders its monogram treatment.
----------------------------------------------------------------- */
export type Member = {
  id: string;
  name: string;
  reading: string;
  monogram: string;
  role: string;
  word: string;
  photo?: string;
};

const roster: Member[] = [
  { id: 'member-01', name: 'CAPTAIN', reading: 'キャプテン', monogram: '01', role: 'MEMBER 01', word: '誰よりも先に立って、誰よりも長く残っていた。' },
  { id: 'member-02', name: 'VICE CAPTAIN', reading: '副キャプテン', monogram: '02', role: 'MEMBER 02', word: '隣にいるだけで、なぜか大丈夫だと思えた。' },
  { id: 'member-03', name: 'BASE', reading: 'ベース', monogram: '03', role: 'MEMBER 03', word: '支える側の手は、いつも静かに震えていた。' },
  { id: 'member-04', name: 'FLYER', reading: 'フライヤー', monogram: '04', role: 'MEMBER 04', word: '一番高いところで、一番遠くを見ていた。' },
  { id: 'member-05', name: 'BACK SPOT', reading: 'バックスポット', monogram: '05', role: 'MEMBER 05', word: '誰も見ていない場所で、全部を見ていた。' },
  { id: 'member-06', name: 'TUMBLER', reading: 'タンブラー', monogram: '06', role: 'MEMBER 06', word: '何度転んでも、また助走をはじめた。' },
];

export const member = {
  index: '05',
  label: 'MEMBER',
  title: ['WINGSを', 'つくった人たち。'],
  caption: ['ひとりでは、ここまで来られなかった。', '誰かがいたから、飛べた。'],
  aside: 'These were the people who built WINGS.',
  roster,
} as const;

/* -----------------------------------------------------------------
   06 — THE FINAL HUDDLE
----------------------------------------------------------------- */
export const finale = {
  index: '06',
  label: 'LAST PERFORMANCE',
  lines: ['最後の演技。', '最後の大会。', '最後の円陣。', 'ありがとう。'],
  caption: ['この景色を、', '一生忘れない。'],
} as const;

/* -----------------------------------------------------------------
   07 — THANK YOU
----------------------------------------------------------------- */
export const thanks = {
  index: '07',
  label: 'THANK YOU',
  wordmark: team.name,
  generation: team.generation,
  lines: ['ありがとう。', 'そして、次の世代へ。'],
  signature: ['HANEDA INTERNATIONAL', 'HIGH SCHOOL', 'CHEERLEADING TEAM', 'WINGS'],
} as const;

/* -----------------------------------------------------------------
   08 — ENDING
----------------------------------------------------------------- */
export const ending = {
  index: '08',
  lines: ['THE END', 'AND', 'A NEW BEGINNING'],
  footer: `© ${team.name} ${team.generation}`,
} as const;

export const imagery = {
  huddleHero: '/images/huddle-hero.webp',
  huddleFinal: '/images/huddle-final.webp',
  skySunset: '/images/sky-sunset.webp',
} as const;

export const huddleAlt =
  'ハネダ国際高校チアリーディング部 WINGS 一期生、最後の円陣';
