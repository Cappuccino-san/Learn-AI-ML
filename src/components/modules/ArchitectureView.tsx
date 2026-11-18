'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Cpu,
  Database,
  Layers,
  Server,
  ShieldAlert,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import { MODULE_ROUTES, architectureData } from '@/data';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import { HandbookFigure } from '@/components/ui/HandbookFigure';
import type { ArchitectureLayerSpec } from '@/types/handbook';

export function ArchitectureView() {
  const meta = MODULE_ROUTES[2];
  const { completedModuleIds, toggleModuleComplete, hydrated } =
    useLearnerProgress();
  const isComplete = completedModuleIds.includes('module-3');

  const [selectedLayerNumber, setSelectedLayerNumber] = useState<number>(
    architectureData.layers[0]?.layerNumber ?? 1
  );

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash.startsWith('layer-')) return;
      const match = architectureData.layers.find(
        (layer) => `layer-${layer.id}` === hash
      );
      if (match) {
        setSelectedLayerNumber(match.layerNumber);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const selectedLayer: ArchitectureLayerSpec =
    architectureData.layers.find(
      (l) => l.layerNumber === selectedLayerNumber
    ) ?? architectureData.layers[0];

  const currentIdx = architectureData.layers.findIndex(
    (l) => l.layerNumber === selectedLayer.layerNumber
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Module Header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Module 03
              </span>
              <span className="text-border-strong">·</span>
              <span className="font-mono text-[11px] text-ink-muted">
                {meta.route}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-primary sm:text-[28px]">
              {meta.title}
            </h1>
            <p className="max-w-2xl text-sm text-ink-secondary">
              {meta.subtitle}
            </p>
          </div>

          <button
            type="button"
            disabled={!hydrated}
            onClick={() => toggleModuleComplete('module-3')}
            aria-pressed={isComplete}
            className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99] ${
              isComplete
                ? 'border-accent bg-accent text-accent-ink shadow-subtle hover:opacity-90'
                : 'border-border-strong bg-surface text-ink-primary shadow-subtle hover:bg-subtle hover:border-ink-muted'
            }`}
          >
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Circle className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            )}
            <span>
              {isComplete ? 'Module Complete' : 'Mark Module Complete'}
            </span>
          </button>
        </div>
      </header>

      {/* Interactive 6-Layer System Architecture Stack */}
      <section aria-labelledby="stack-diagram-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="stack-diagram-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              6-Layer Production System Architecture
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Click any layer from Application down to Infrastructure to inspect
              components, responsibilities, failure modes, and optimization
              patterns.
            </p>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 5, 6]
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Interactive Stack */}
          <div
            role="tablist"
            aria-label="6-Layer Architecture Stack"
            className="space-y-2 lg:col-span-5"
          >
            {architectureData.layers.map((layer) => {
              const active = selectedLayer.layerNumber === layer.layerNumber;
              return (
                <button
                  key={layer.id}
                  id={`layer-${layer.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedLayerNumber(layer.layerNumber)}
                  className={`scroll-mt-20 flex w-full items-center justify-between gap-3 rounded-lg border p-3.5 text-left transition-[border-color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.99] ${
                    active
                      ? 'border-accent bg-surface shadow-card ring-1 ring-accent/10'
                      : 'border-border bg-canvas hover:border-border-strong hover:bg-surface'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-semibold tabular-nums ${
                        active
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-border bg-subtle text-ink-secondary'
                      }`}
                    >
                      L{layer.layerNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-primary">
                        {layer.name}
                      </p>
                      <p className="truncate text-[11px] text-ink-muted">
                        {layer.components.slice(0, 2).join(' · ')}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
                    {layer.components.length} comp
                  </span>
                </button>
              );
            })}
          </div>

          {/* Layer Inspector Panel */}
          <div
            role="tabpanel"
            aria-label={`Layer ${selectedLayer.layerNumber}: ${selectedLayer.name}`}
            className="flex flex-col justify-between rounded-lg border border-border bg-surface p-5 shadow-card lg:col-span-7"
          >
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3.5">
                <div className="flex items-center gap-2.5">
                  <Layers
                    className="h-4 w-4 text-accent-blue"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-semibold text-ink-primary">
                    Layer {selectedLayer.layerNumber}: {selectedLayer.name}
                  </h3>
                </div>
                <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                  {selectedLayer.citation}
                </span>
              </div>

              {/* Core Components */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Core Components
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedLayer.components.map((comp) => (
                    <span
                      key={comp}
                      className="rounded-md border border-border bg-canvas px-2.5 py-1 text-xs font-medium text-ink-primary"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Production Responsibilities */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Production Responsibilities
                </h4>
                <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {selectedLayer.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-md border border-border bg-canvas/70 px-2.5 py-2 text-xs text-ink-secondary"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Failure Modes & Optimization Patterns */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-amber-200/70 bg-amber-50/40 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-primary">
                    <ShieldAlert
                      className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                      aria-hidden="true"
                    />
                    <span>Failure Modes</span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {selectedLayer.failureModes.map((mode) => (
                      <li
                        key={mode}
                        className="text-xs leading-relaxed text-ink-secondary"
                      >
                        • {mode}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border border-blue-200/70 bg-blue-50/40 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-primary">
                    <Zap
                      className="h-3.5 w-3.5 text-accent-blue"
                      aria-hidden="true"
                    />
                    <span>Optimization Patterns</span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {selectedLayer.optimizationPatterns.map((pattern) => (
                      <li
                        key={pattern}
                        className="text-xs leading-relaxed text-ink-secondary"
                      >
                        • {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Stepper footer */}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-3.5">
              <button
                type="button"
                disabled={currentIdx <= 0}
                onClick={() =>
                  setSelectedLayerNumber(
                    architectureData.layers[currentIdx - 1].layerNumber
                  )
                }
                className="inline-flex items-center gap-1 rounded-md border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-ink-primary transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Previous Layer</span>
              </button>
              <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                Layer {selectedLayer.layerNumber} of{' '}
                {architectureData.layers.length}
              </span>
              <button
                type="button"
                disabled={currentIdx >= architectureData.layers.length - 1}
                onClick={() =>
                  setSelectedLayerNumber(
                    architectureData.layers[currentIdx + 1].layerNumber
                  )
                }
                className="inline-flex items-center gap-1 rounded-md border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-ink-primary transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Next Layer</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Figure 1 Architecture Reference */}
        <HandbookFigure
          id="figure-1-architecture-ref"
          figureNumber={1}
          defaultCollapsed={true}
          src="/images/handbook/figure-1-career-roadmap.png"
          width={1312}
          height={1199}
          title="Figure 1 Reference — End-to-End LLM System Architecture (Section 6)"
          caption="Original handbook diagram mapping Users, Application, Agent & Orchestration, RAG & Knowledge, LLM, Output & Ops, and Data & Infrastructure layers."
          citation="[cite: 2, 5]"
        />
      </section>

      {/* 4 Hard Operational Problems in Enterprise RAG */}
      <section aria-labelledby="rag-problems-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="rag-problems-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              4 Hard Operational Problems in Enterprise RAG
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Production RAG fails on data freshness, permissions, and error
              isolation—not basic cosine similarity.
            </p>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 6]
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {architectureData.ragHardProblems.map((problem) => (
            <article
              key={problem.number}
              id={`rag-problem-${problem.number}`}
              className="scroll-mt-20 rounded-lg border border-border bg-surface p-5 shadow-subtle"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-subtle font-mono text-xs font-semibold tabular-nums text-ink-primary">
                    {problem.number}
                  </span>
                  <h3 className="text-sm font-semibold text-ink-primary">
                    {problem.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                  {problem.citation}
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-ink-secondary">
                {problem.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Agentic Systems Reliability */}
      <section
        id="agent-reliability"
        aria-labelledby="agent-reliability-heading"
        className="scroll-mt-20 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2
            id="agent-reliability-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Agentic Systems Reliability
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            {architectureData.agentReliability.citation}
          </span>
        </div>

        <div className="rounded-lg border border-rose-200/80 bg-surface p-5 shadow-card dark:border-rose-900/60 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertOctagon
              className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-ink-primary">
                {architectureData.agentReliability.headline}
              </h3>
              <p className="text-sm leading-relaxed text-ink-secondary">
                {architectureData.agentReliability.analysis}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-5 md:grid-cols-3">
            {architectureData.agentReliability.pillars.map((pillar, idx) => (
              <div
                key={pillar.name}
                className="rounded-md border border-border bg-canvas p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold tabular-nums text-accent-blue">
                    0{idx + 1}
                  </span>
                  <h4 className="text-xs font-semibold text-ink-primary">
                    {pillar.name}
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 Production Best Practices & 6 Scalability Strategies */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 9 Production Best Practices */}
        <div className="space-y-3 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
              9 Production Best Practices
            </h2>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              [cite: 7]
            </span>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border bg-surface shadow-subtle">
            {architectureData.bestPractices.map((bp, idx) => (
              <div key={bp.id} className="flex items-start gap-3 px-4 py-3">
                <span className="font-mono text-xs font-medium tabular-nums text-ink-muted">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p className="text-xs leading-relaxed text-ink-primary">
                  {bp.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Scalability & Optimization Strategies */}
        <div className="space-y-3 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
              6 Scalability & Optimization Strategies
            </h2>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              [cite: 7]
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {architectureData.scalabilityStrategies.map((item) => (
              <div
                key={item.id}
                id={`scale-${item.id}`}
                className="scroll-mt-20 flex items-start justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-subtle"
              >
                <div>
                  <h3 className="text-xs font-semibold text-ink-primary">
                    {item.strategy}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-secondary">
                    {item.tactics}
                  </p>
                </div>
                <span className="shrink-0 rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                  {item.citation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2026 Ecosystem Reference Stack */}
      <section aria-labelledby="ecosystem-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="ecosystem-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              2026 Ecosystem Reference Stack
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Representative frontier/open-weight models, orchestration
              frameworks, vector stores, and infrastructure tooling.
            </p>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            {architectureData.ecosystem2026.citation}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <Sparkles
                className="h-3.5 w-3.5 text-accent-blue"
                aria-hidden="true"
              />
              <h3 className="text-xs font-semibold text-ink-primary">
                Foundation Models
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {architectureData.ecosystem2026.models.map((item) => (
                <span
                  key={item}
                  className="rounded border border-border bg-canvas px-2 py-0.5 text-xs font-medium text-ink-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <Wrench
                className="h-3.5 w-3.5 text-ink-secondary"
                aria-hidden="true"
              />
              <h3 className="text-xs font-semibold text-ink-primary">
                Frameworks & Open Source
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {architectureData.ecosystem2026.frameworksAndOpenSource.map(
                (item) => (
                  <span
                    key={item}
                    className="rounded border border-border bg-canvas px-2 py-0.5 text-xs text-ink-primary"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <Database
                className="h-3.5 w-3.5 text-ink-secondary"
                aria-hidden="true"
              />
              <h3 className="text-xs font-semibold text-ink-primary">
                Vector Databases
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {architectureData.ecosystem2026.vectorDatabases.map((item) => (
                <span
                  key={item}
                  className="rounded border border-border bg-canvas px-2 py-0.5 text-xs text-ink-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <Server
                className="h-3.5 w-3.5 text-ink-secondary"
                aria-hidden="true"
              />
              <h3 className="text-xs font-semibold text-ink-primary">
                Containers & Ops
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {architectureData.ecosystem2026.containersAndOps.map((item) => (
                <span
                  key={item}
                  className="rounded border border-border bg-canvas px-2 py-0.5 text-xs text-ink-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default ArchitectureView;
