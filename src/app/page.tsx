import type { Metadata } from 'next';
import { homePage } from '@/data/home';
import { HomePage } from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: homePage.seo.title,
  description: homePage.seo.description,
  alternates: { canonical: '/' },
};

export default function Home() {
  return <HomePage />;
}
