import type { Metadata } from 'next';
import {
  Space_Grotesk,
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { ScrollProgress } from '@/components/ScrollProgress';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'optional',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pixelcraft — Evidence-Verified UI/UX Agent Skills',
  description:
    '26 portable Agent Skills, 43 static anti-slop detectors, and a 3-viewport Chromium finish gate for building distinctive, verified interfaces across every stack.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${spaceGrotesk.variable} ${cormorant.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body>
        <ScrollProgress />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[#141311] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#faf8f3]"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
