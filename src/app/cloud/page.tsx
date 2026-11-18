import type { Metadata } from 'next';
import { CloudView } from '@/components/modules/CloudView';

export const metadata: Metadata = {
  title: 'Cross-Cloud Architecture Matrix | AI/LLM Engineering Hub',
  description:
    '8 core system jobs, 24 operational sub-roles, and 93 equivalent production AI services across AWS, Azure, and GCP.',
};

export default function CloudPage() {
  return <CloudView />;
}
