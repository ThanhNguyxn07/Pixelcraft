import type { Metadata } from 'next';
import { GalleryView } from '@/components/GalleryView';

export const metadata: Metadata = {
  title: 'Live Gallery — PIXELCRAFT',
  description:
    'Interactive full-page demos built with Pixelcraft skills, complete with verbatim prompts, OKLCH palettes, and verification evidence.',
};

export default function GalleryPage() {
  return <GalleryView />;
}
