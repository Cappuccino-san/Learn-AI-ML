'use client';

import React from 'react';
import { CheckCircle2, Circle, Cloud, Info } from 'lucide-react';
import { MODULE_ROUTES, cloudMatrixData } from '@/data';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { HandbookFigure } from '@/components/ui/HandbookFigure';
import { CloudMapperMatrix } from '@/components/simulators/CloudMapperMatrix';

export function CloudView() {
  const meta = MODULE_ROUTES[4];
  const { completedModuleIds, toggleModuleComplete, hydrated } =
    useLearnerProgress();
  const isComplete = completedModuleIds.includes('module-5');

  return (
    <div className="space-y-10 pb-16">
      {/* Module Header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Module 05
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
            onClick={() => toggleModuleComplete('module-5')}
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

      {/* Multi-Cloud AI Infrastructure Overview */}
      <section aria-labelledby="cloud-overview-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="cloud-overview-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Multi-Cloud AI Infrastructure Overview
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 13, 14]
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              Core System Jobs
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-ink-primary">
              {cloudMatrixData.totalJobs}
            </p>
            <p className="mt-1 text-xs text-ink-secondary">
              Compute through Governance & Compliance
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              Operational Sub-Roles
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-ink-primary">
              {cloudMatrixData.totalSubRoles}
            </p>
            <p className="mt-1 text-xs text-ink-secondary">
              Mapped across AWS, Azure, and GCP
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              Production Services
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-ink-primary">
              {cloudMatrixData.totalServices}
            </p>
            <p className="mt-1 text-xs text-ink-secondary">
              2026 verified service equivalents
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-subtle">
          <div className="flex items-start gap-3">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-ink-secondary">
              <strong className="font-semibold text-ink-primary">
                2026 Service Naming & Closest Equivalents:
              </strong>{' '}
              Cloud providers organize AI infrastructure under different billing
              and control-plane boundaries. Mappings represent closest
              architectural equivalents for each operational sub-role—including
              2026 updates such as{' '}
              <span className="font-mono text-ink-primary">
                Microsoft Foundry
              </span>
              ,{' '}
              <span className="font-mono text-ink-primary">
                Amazon Bedrock / SageMaker AI
              </span>
              , and{' '}
              <span className="font-mono text-ink-primary">
                Google Cloud Vertex AI
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Visual Reference Diagram */}
      <section aria-labelledby="cloud-diagram-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="cloud-diagram-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Visual Reference Diagram
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 13]
          </span>
        </div>
        <HandbookFigure
          id="figure-3-cloud"
          figureNumber={3}
          src="/images/handbook/figure-3-cross-cloud-map.png"
          width={1080}
          height={1272}
          title="AWS vs. Azure vs. GCP Infrastructure Mapping"
          caption="Figure 3: 8 Core Engineering Jobs and 93 Production Cloud Services Grouped by Role (2026 Service Naming)."
          citation="[cite: 13]"
        />
      </section>

      {/* Interactive Cross-Cloud Architecture Matrix */}
      <section aria-labelledby="cloud-matrix-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            <h2
              id="cloud-matrix-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              Interactive Cross-Cloud Service Mapper
            </h2>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 13, 14]
          </span>
        </div>

        <ErrorBoundary title="Cloud Mapper Matrix failed to load">
          <CloudMapperMatrix />
        </ErrorBoundary>
      </section>
    </div>
  );
}
export default CloudView;
