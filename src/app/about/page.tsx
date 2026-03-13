import type { Metadata } from 'next';
import { personalPage } from '@/data/personal';
import { PersonalPage } from '@/components/personal/PersonalPage';

export const metadata: Metadata = {
  title: personalPage.seo.title,
  description: personalPage.seo.description,
  alternates: { canonical: '/about/' },
};

export default function AboutRoute() {
  return <PersonalPage />;
}
