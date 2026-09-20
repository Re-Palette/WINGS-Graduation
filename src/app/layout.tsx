import type { Metadata, Viewport } from 'next';
import {
  Shippori_Mincho,
  Zen_Kaku_Gothic_New,
  Cormorant_Garamond,
  Jost,
  Kaushan_Script,
  Parisienne,
} from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { team } from '@/lib/content';

const shippori = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-shippori',
  display: 'swap',
  preload: false,
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-zen-kaku',
  display: 'swap',
  preload: false,
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-jost',
  display: 'swap',
});

const kaushan = Kaushan_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-kaushan',
  display: 'swap',
});

const parisienne = Parisienne({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-parisienne',
  display: 'swap',
});

const title = `${team.name} — ${team.generation} ${team.occasion}`;
const description =
  'ハネダ国際高校チアリーディング部 WINGS 一期生、卒業記念サイト。3年間の軌跡と、最後の円陣。';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wings-graduation.example';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: team.name,
  authors: [{ name: `${team.school} ${team.unit}` }],
  keywords: ['WINGS', 'チアリーディング', 'ハネダ国際高校', '卒業', '一期生'],
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'ja_JP',
    siteName: team.name,
    images: [{ url: '/images/huddle-hero.webp', width: 2400, height: 822, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/huddle-hero.webp'],
  },
};

export const viewport: Viewport = {
  themeColor: '#050e21',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    shippori.variable,
    zenKaku.variable,
    cormorant.variable,
    jost.variable,
    kaushan.variable,
    parisienne.variable,
  ].join(' ');

  return (
    <html lang="ja" className={fontVars}>
      <body className="antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
