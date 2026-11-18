import type { Metadata } from 'next';
import { PhilosophyView } from '@/components/modules/PhilosophyView';

export const metadata: Metadata = {
  title: 'Philosophy & Master Curriculum | AI/LLM Engineering Hub',
  description:
    'Foundational software engineering discipline, core engineering mandate, execution loop, and 5-stage GitHub repository curriculum.',
};

export default function HomePage() {
  return <PhilosophyView />;
}
