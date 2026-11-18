'use client';

import React from 'react';
import {
  CheckCircle2,
  Circle,
  GitBranch,
  Scale,
  SlidersHorizontal,
} from 'lucide-react';
import { MODULE_ROUTES, finetuningData } from '@/data';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { HandbookFigure } from '@/components/ui/HandbookFigure';
import { FineTuningCombinator } from '@/components/simulators/FineTuningCombinator';
import { DiagnosticGateWizard } from '@/components/simulators/DiagnosticGateWizard';

export function FineTuningView() {
  const meta = MODULE_ROUTES[3];
  const { completedModuleIds, toggleModuleComplete, hydrated } =
    useLearnerProgress();
  const isComplete = completedModuleIds.includes('module-4');

  return (
    <div className="space-y-10 pb-16">
      {/* Module Header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Module 04
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
            onClick={() => toggleModuleComplete('module-4')}
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

      {/* 3 Structural Dimensions Overview + Composability & Empirical Rule */}
      <section aria-labelledby="dimensions-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="dimensions-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              3 Structural Dimensions of Model Adaptation
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Fine-tuning techniques are orthogonal across weight-update
              mechanics, training objectives, and capability transfer.
            </p>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 9]
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {finetuningData.structuralDimensions.map((dim) => (
            <article
              key={dim.id}
              id={`dimension-${dim.id}`}
              className="scroll-mt-20 flex flex-col justify-between rounded-lg border border-border bg-surface p-5 shadow-card"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] font-semibold text-ink-primary">
                    <SlidersHorizontal
                      className="h-3 w-3 text-accent-blue"
                      aria-hidden="true"
                    />
                    Dimension {dim.id}
                  </span>
                  <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                    {dim.citation}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-ink-primary">
                  {dim.name}
                </h3>
                <p className="mt-1 text-xs text-ink-secondary">
                  {dim.subtitle}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {dim.methods.map((methodName) => (
                  <span
                    key={methodName}
                    className="rounded border border-border bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink-primary"
                  >
                    {methodName}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Composability & Empirical Rule */}
        <div className="rounded-lg border border-border border-l-4 border-l-accent bg-surface p-5 shadow-subtle">
          <div className="flex items-start gap-3">
            <Scale
              className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-primary">
                  Composability & Empirical Validation Rule
                </h3>
                <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                  [cite: 9, 10, 11]
                </span>
              </div>
              <p className="text-xs leading-relaxed text-ink-secondary">
                {finetuningData.composabilityNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Reference Diagram */}
      <section aria-labelledby="finetuning-diagram-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="finetuning-diagram-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Visual Reference Diagram
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 8]
          </span>
        </div>
        <HandbookFigure
          id="figure-2-finetuning"
          figureNumber={2}
          src="/images/handbook/figure-2-fine-tuning-methods.png"
          width={1080}
          height={1438}
          title="10 Ways to Fine-Tune an LLM (Sathish Kumar Subramani)"
          caption="Figure 2: From changing every weight (100%) to training a <1% low-rank adapter or <0.1% virtual prefix, and from teaching instruction-following tasks to aligning human preference taste and distilling student models."
          citation="[cite: 8]"
        />
      </section>

      {/* Interactive Fine-Tuning Combinator */}
      <section aria-labelledby="combinator-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch
              className="h-4 w-4 text-ink-muted"
              aria-hidden="true"
            />
            <h2
              id="combinator-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              10 Adaptation Methods & Pipeline Combinator
            </h2>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 8–11]
          </span>
        </div>

        <ErrorBoundary title="Fine-Tuning Combinator failed to load">
          <FineTuningCombinator />
        </ErrorBoundary>
      </section>

      {/* Interactive Diagnostic Gate & Readiness Audit */}
      <section aria-labelledby="diagnostic-gate-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="diagnostic-gate-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Pre-Training Diagnostic Gate & 8-Question Readiness Audit
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 11, 12]
          </span>
        </div>

        <ErrorBoundary title="Diagnostic Gate Wizard failed to load">
          <DiagnosticGateWizard />
        </ErrorBoundary>
      </section>
    </div>
  );
}
export default FineTuningView;
