/**
 * Every word and every asset reference in the experience lives here.
 * Editing this file is how you update the site — no component needs touching.
 */

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
export type Memory = {
  src: string;
  alt: string;
  caption: string;
  x: number;
  y: number;
  depth: number;
  rotate: number;
  scale: number;
};

export const memories = {
  index: '04',
  label: 'MEMORIES',
  title: ['たくさんの', '思い出たち。'],
  caption: ['笑って、泣いて、', 'みんなで過ごした時間は、', '一生の宝物。'],
  aside: 'Thank you for all the memories.',
  items: [
    { src: '/images/memory-01.webp', alt: '円陣を組む背中', caption: 'Huddle', x: 22, y: 26, depth: 0.10, rotate: -6, scale: 1.0 },
    { src: '/images/memory-02.webp', alt: '集合写真', caption: 'Everyone', x: 74, y: 20, depth: 0.22, rotate: 5, scale: 0.92 },
    { src: '/images/memory-03.webp', alt: '夕暮れの整列', caption: 'Sunset', x: 50, y: 62, depth: 0.34, rotate: -3, scale: 1.06 },
    { src: '/images/memory-04.webp', alt: '大会前の集合', caption: 'Before the mat', x: 15, y: 68, depth: 0.46, rotate: 7, scale: 0.88 },
    { src: '/images/memory-05.webp', alt: '重ねた手', caption: 'Our hands', x: 82, y: 58, depth: 0.55, rotate: -8, scale: 1.02 },
    { src: '/images/memory-06.webp', alt: '青と金のポンポン', caption: 'Blue & Gold', x: 36, y: 14, depth: 0.64, rotate: 4, scale: 0.86 },
    { src: '/images/memory-07.webp', alt: 'ユニフォーム姿', caption: 'Uniform', x: 64, y: 76, depth: 0.72, rotate: -5, scale: 0.9 },
    { src: '/images/memory-08.webp', alt: '屋外でのスタンツ', caption: 'Practice', x: 28, y: 46, depth: 0.80, rotate: 6, scale: 0.84 },
    { src: '/images/memory-09.webp', alt: 'ベンチで待つチーム', caption: 'Waiting', x: 86, y: 38, depth: 0.88, rotate: -4, scale: 0.8 },
    { src: '/images/memory-10.webp', alt: '夜の競技会場', caption: 'The arena', x: 58, y: 32, depth: 0.95, rotate: 3, scale: 0.76 },
  ] satisfies Memory[],
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

export const member = {
  index: '05',
  label: 'MEMBER',
  title: ['WINGSを', 'つくった人たち。'],
  caption: ['ひとりでは、ここまで来られなかった。', '誰かがいたから、飛べた。'],
  aside: 'These were the people who built WINGS.',
  roster: [
    { id: 'member-01', name: 'CAPTAIN', reading: 'キャプテン', monogram: '01', role: 'Captain', word: '誰よりも先に立って、誰よりも長く残っていた。' },
    { id: 'member-02', name: 'VICE CAPTAIN', reading: '副キャプテン', monogram: '02', role: 'Vice Captain', word: '隣にいるだけで、なぜか大丈夫だと思えた。' },
    { id: 'member-03', name: 'BASE', reading: 'ベース', monogram: '03', role: 'Base', word: '支える側の手は、いつも静かに震えていた。' },
    { id: 'member-04', name: 'FLYER', reading: 'フライヤー', monogram: '04', role: 'Flyer', word: '一番高いところで、一番遠くを見ていた。' },
    { id: 'member-05', name: 'BACK SPOT', reading: 'バックスポット', monogram: '05', role: 'Back Spot', word: '誰も見ていない場所で、全部を見ていた。' },
    { id: 'member-06', name: 'TUMBLER', reading: 'タンブラー', monogram: '06', role: 'Tumbler', word: '何度転んでも、また助走をはじめた。' },
  ] satisfies Member[],
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
  skyClouds: '/images/sky-clouds.webp',
} as const;

export const huddleAlt =
  'ハネダ国際高校チアリーディング部 WINGS 一期生、最後の円陣';
