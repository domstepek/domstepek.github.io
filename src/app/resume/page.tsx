import type { Metadata } from 'next';
import { resumePage } from '@/data/resume';
import { ResumePage } from '@/components/resume/ResumePage';

export const metadata: Metadata = {
  title: resumePage.seo.title,
  description: resumePage.seo.description,
  alternates: { canonical: '/resume/' },
};

export default function ResumeRoute() {
  return <ResumePage />;
}
