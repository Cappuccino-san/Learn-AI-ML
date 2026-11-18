'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  FileCode2,
  FolderOpen,
  Quote,
  Terminal,
} from 'lucide-react';
import { MODULE_ROUTES, philosophyData } from '@/data';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import type { RepoDirectorySpec } from '@/types/handbook';

function slugifyPath(path: string): string {
  return path
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const EXECUTION_LOOP_NOTES: Record<string, string> = {
  Build: 'Ship minimal, observable services with explicit contracts.',
  Test: 'Verify deterministic HTTP, state, and schema boundaries.',
  Measure: 'Capture p95 latency, recall@k, and token unit economics.',
  Evaluate: 'Audit failures against independent golden test sets.',
  Iterate: 'Fix root-cause bottlenecks before changing models.',
};

export function PhilosophyView() {
  const meta = MODULE_ROUTES[0];
  const { completedModuleIds, toggleModuleComplete, hydrated } =
    useLearnerProgress();
  const isComplete = completedModuleIds.includes('module-1');

  const [selectedRepoPath, setSelectedRepoPath] = useState<string>(
    philosophyData.repoStructure[0]?.path ?? ''
  );
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash.startsWith('repo-')) return;
      const match = philosophyData.repoStructure.find(
        (repo) => `repo-${slugifyPath(repo.path)}` === hash
      );
      if (match) {
        setSelectedRepoPath(match.path);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const selectedRepo: RepoDirectorySpec =
    philosophyData.repoStructure.find((r) => r.path === selectedRepoPath) ??
    philosophyData.repoStructure[0];

  const reinforcingPrinciples = philosophyData.foundationalPrinciples.filter(
    (p) => p.id !== 'execution-loop'
  );
  const loopPrinciple = philosophyData.foundationalPrinciples.find(
    (p) => p.id === 'execution-loop'
  );

  const handleCopyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      window.setTimeout(() => {
        setCopiedCommand((prev) => (prev === command ? null : prev));
      }, 1800);
    } catch {
      // Clipboard API may be unavailable in restricted contexts.
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Module Header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Module 01
              </span>
              <span className="text-border-strong">·</span>
              <span className="font-mono text-[11px] text-ink-muted">
                {meta.route}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-primary sm:text-[28px]">
              {philosophyData.title}
            </h1>
            <p className="max-w-2xl text-sm text-ink-secondary">
              {philosophyData.subtitle}
            </p>
          </div>

          <button
            type="button"
            disabled={!hydrated}
            onClick={() => toggleModuleComplete('module-1')}
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

      {/* Core Failure Pattern */}
      <section aria-labelledby="failure-pattern-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="failure-pattern-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Core Failure Pattern
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            {philosophyData.coreFailurePattern.citation}
          </span>
        </div>

        <div className="rounded-lg border border-amber-200/80 bg-surface p-5 shadow-card dark:border-amber-900/60 sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/50 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-ink-primary">
                {philosophyData.coreFailurePattern.summary}
              </p>
              <ul className="space-y-2 border-t border-border pt-3">
                {philosophyData.coreFailurePattern.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-secondary"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-muted"
                      aria-hidden="true"
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Mandate */}
      <section aria-labelledby="mandate-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="mandate-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Core Engineering Mandate
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            {philosophyData.coreMandate.citation}
          </span>
        </div>

        <blockquote className="rounded-lg border border-border border-l-4 border-l-accent bg-surface p-5 shadow-card sm:p-6">
          <div className="flex items-start gap-3">
            <Quote
              className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted"
              aria-hidden="true"
            />
            <div className="space-y-2.5">
              <p className="text-base font-semibold tracking-tight text-ink-primary sm:text-lg">
                “{philosophyData.coreMandate.quote}”
              </p>
              <p className="text-sm leading-relaxed text-ink-secondary">
                {philosophyData.coreMandate.explanation}
              </p>
            </div>
          </div>
        </blockquote>
      </section>

      {/* 5-Step Execution Loop + 4 Reinforcing Principles */}
      <section aria-labelledby="principles-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="principles-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Engineering Execution Loop & Principles
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 1, 2]
          </span>
        </div>

        {/* 5-step execution loop */}
        <div
          id="principle-execution-loop"
          className="scroll-mt-20 rounded-lg border border-border bg-surface p-5 shadow-card"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-ink-primary">
                {loopPrinciple?.title ??
                  'Build -> Test -> Measure -> Evaluate -> Iterate'}
              </h3>
              <p className="mt-0.5 text-xs text-ink-secondary">
                {loopPrinciple?.summary}
              </p>
            </div>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              {loopPrinciple?.citation ?? '[cite: 1]'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-5">
            {philosophyData.executionLoop.map((step, index) => (
              <div
                key={step}
                className="relative flex flex-col justify-between rounded-md border border-border bg-canvas p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-medium tabular-nums text-ink-muted">
                    0{index + 1}
                  </span>
                  {index < philosophyData.executionLoop.length - 1 && (
                    <ArrowRight
                      className="hidden h-3.5 w-3.5 text-ink-muted sm:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-ink-primary">
                    {step}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink-secondary">
                    {EXECUTION_LOOP_NOTES[step] ?? ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Reinforcing Principles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {reinforcingPrinciples.map((principle, idx) => (
            <div
              key={principle.id}
              id={`principle-${principle.id}`}
              className="scroll-mt-20 rounded-lg border border-border bg-surface p-4 shadow-subtle"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                    P{idx + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-ink-primary">
                    {principle.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                  {principle.citation}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                {principle.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Master GitHub Repository Explorer */}
      <section aria-labelledby="repo-explorer-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="repo-explorer-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              Master GitHub Repository Explorer
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Select any curriculum directory to inspect deliverables, sample
              artifacts, and its local verification check.
            </p>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 1, 2]
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Directory list */}
          <div
            role="tablist"
            aria-label="Master curriculum repository directories"
            className="space-y-2 lg:col-span-5"
          >
            {philosophyData.repoStructure.map((repo, idx) => {
              const anchorId = `repo-${slugifyPath(repo.path)}`;
              const active = selectedRepo.path === repo.path;
              return (
                <button
                  key={repo.path}
                  id={anchorId}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedRepoPath(repo.path)}
                  className={`scroll-mt-20 flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99] ${
                    active
                      ? 'border-accent bg-surface shadow-card ring-1 ring-accent/10'
                      : 'border-border bg-surface/70 hover:border-border-strong hover:bg-surface'
                  }`}
                >
                  <FolderOpen
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      active ? 'text-accent-blue' : 'text-ink-muted'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs font-semibold text-ink-primary">
                        {repo.path}
                      </span>
                      <span className="font-mono text-[10px] tabular-nums text-ink-muted">
                        0{idx + 1}/05
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-secondary">
                      {repo.focus}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Inspector Panel */}
          <div
            role="tabpanel"
            aria-label={selectedRepo.path}
            className="rounded-lg border border-border bg-surface p-5 shadow-card lg:col-span-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3.5">
              <div className="flex items-center gap-2">
                <FolderOpen
                  className="h-4 w-4 text-accent-blue"
                  aria-hidden="true"
                />
                <h3 className="font-mono text-sm font-semibold text-ink-primary">
                  {selectedRepo.path}
                </h3>
              </div>
              <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                {selectedRepo.citation}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Technical Focus
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-ink-primary">
                  {selectedRepo.focus}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Engineering Deliverables
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                  {selectedRepo.deliverables}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Sample Repository Artifacts
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {selectedRepo.sampleFiles.map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 rounded-md border border-border bg-canvas px-2.5 py-1.5 font-mono text-xs text-ink-primary"
                    >
                      <FileCode2
                        className="h-3.5 w-3.5 shrink-0 text-ink-muted"
                        aria-hidden="true"
                      />
                      <span className="truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Verification Command
                </h4>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-border bg-zinc-950 px-3 py-2 text-zinc-100 dark:border-zinc-800">
                  <div className="flex min-w-0 items-center gap-2">
                    <Terminal
                      className="h-3.5 w-3.5 shrink-0 text-zinc-400"
                      aria-hidden="true"
                    />
                    <code className="truncate font-mono text-xs">
                      {selectedRepo.verificationCommand}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyCommand(selectedRepo.verificationCommand)
                    }
                    className="inline-flex shrink-0 items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-200 transition-colors hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {copiedCommand === selectedRepo.verificationCommand ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default PhilosophyView;
