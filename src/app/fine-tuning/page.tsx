import type { Metadata } from 'next';
import { FineTuningView } from '@/components/modules/FineTuningView';

export const metadata: Metadata = {
  title: 'Fine-Tuning Dimensions & Diagnostic Gate | AI/LLM Engineering Hub',
  description:
    '10 model adaptation methods across 3 structural dimensions, interactive pipeline combinator, and 8-question pre-training diagnostic gate.',
};

export default function FineTuningPage() {
  return <FineTuningView />;
}
