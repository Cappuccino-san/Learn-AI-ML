import type { Metadata } from 'next';
import { RoadmapView } from '@/components/modules/RoadmapView';

export const metadata: Metadata = {
  title: 'Skills Pyramid & Career Tracks | AI/LLM Engineering Hub',
  description:
    '4-tier competency pyramid, Forward Deployed Engineers focus, 8 specialized LLM engineering roles, and certification roadmap.',
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
