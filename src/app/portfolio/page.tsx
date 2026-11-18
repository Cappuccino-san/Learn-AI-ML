import type { Metadata } from 'next';
import { PortfolioView } from '@/components/modules/PortfolioView';

export const metadata: Metadata = {
  title: 'Portfolio, Verification & Interview Lab | AI/LLM Engineering Hub',
  description:
    '5 operational career milestones, 6 verified production portfolio projects, resume engineering checklist, and 8 interview prep domains.',
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
