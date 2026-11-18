import type { Metadata } from 'next';
import { ArchitectureView } from '@/components/modules/ArchitectureView';

export const metadata: Metadata = {
  title: 'Production Architecture & RAG/Agent Ops | AI/LLM Engineering Hub',
  description:
    '6-layer production system architecture, 4 hard operational RAG problems, agentic reliability pillars, and 2026 ecosystem stack.',
};

export default function ArchitecturePage() {
  return <ArchitectureView />;
}
