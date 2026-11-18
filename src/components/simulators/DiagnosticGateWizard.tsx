'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CircleSlash,
  HelpCircle,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { finetuningData } from '@/data/finetuning';
import type { DiagnosticGateScenario } from '@/types/handbook';
import {
  useLearnerProgress,
  type ReadinessAnswerStatus,
} from '@/hooks/useLearnerProgress';

const SCENARIO_KEYWORDS: Record<string, string[]> = {
  'gate-volatile-facts': [
    'price',
    'prices',
    'pricing',
    'inventory',
    'stock',
    'policy',
    'policies',
    'weekly',
    'daily',
    'hourly',
    'volatile',
    'fresh',
    'freshness',
    'outdated',
    'update',
    'updates',
    'catalog',
    'facts',
    'realtime',
  ],
  'gate-output-formatting': [
    'json',
    'format',
    'formatting',
    'schema',
    'pydantic',
    'structure',
    'structured',
    'parse',
    'parsing',
    'syntax',
    'inconsistent',
    'brackets',
    'markdown',
    'regex',
    'xml',
  ],
  'gate-bad-retrieval': [
    'retrieval',
    'retrieve',
    'rag',
    'chunk',
    'chunks',
    'chunking',
    'context',
    'irrelevant',
    'search',
    'embedding',
    'embeddings',
    'bm25',
    'rerank',
    'reranking',
    'vector',
    'documents',
  ],
  'gate-capability-deficit': [
    'capability',
    'deficit',
    'domain',
    'task',
    'accuracy',
    'system',
    'prompt',
    'exhaust',
    'examples',
    'classification',
    'extraction',
    'sql',
    'specialized',
    'consistent',
  ],
  'gate-tone-alignment': [
    'tone',
    'style',
    'voice',
    'polite',
    'concise',
    'preference',
    'preferences',
    'refusal',
    'safety',
    'nuance',
    'brand',
    'dpo',
    'rlhf',
    'persona',
  ],
  'gate-cost-latency': [
    'latency',
    'slow',
    'ttft',
    'cost',
    'costs',
    'expensive',
    'gpu',
    'bill',
    'budget',
    'distill',
    'distillation',
    'throughput',
    'qps',
    'small',
    'speed',
    'inference',
  ],
};

interface CustomDiagnosisState {
  query: string;
  matchedScenario: DiagnosticGateScenario | null;
}

function matchDiagnosticScenario(query: string): DiagnosticGateScenario | null {
  const normalized = query.toLowerCase();
  const tokens = normalized
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2);

  if (tokens.length === 0) return null;

  let bestScenario: DiagnosticGateScenario | null = null;
  let bestScore = 0;

  for (const scenario of finetuningData.diagnosticScenarios) {
    let score = 0;
    const corpus = [
      scenario.observedProblem,
      scenario.wrongInstinct,
      scenario.correctSolutionTitle,
      scenario.correctSolutionDetails,
      scenario.recommendedCategory,
    ]
      .join(' ')
      .toLowerCase();

    const synonyms = SCENARIO_KEYWORDS[scenario.id] ?? [];

    for (const token of tokens) {
      if (synonyms.includes(token)) {
        score += 3;
      } else if (corpus.includes(token)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestScenario = scenario;
    }
  }

  return bestScore > 0 ? bestScenario : null;
}

export function DiagnosticGateWizard() {
  const {
    readinessAnswers,
    setReadinessAnswer,
    resetReadinessGate,
    hydrated,
  } = useLearnerProgress();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    finetuningData.diagnosticScenarios[0]?.id ?? ''
  );
  const [symptomInput, setSymptomInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [customDiagnosis, setCustomDiagnosis] =
    useState<CustomDiagnosisState | null>(null);
  const [approvalRequested, setApprovalRequested] = useState(false);

  const activeScenario = useMemo(() => {
    return (
      finetuningData.diagnosticScenarios.find(
        (scenario) => scenario.id === selectedScenarioId
      ) ?? finetuningData.diagnosticScenarios[0]
    );
  }, [selectedScenarioId]);

  const gateSummary = useMemo(() => {
    const failedNumbers: number[] = [];
    const unansweredNumbers: number[] = [];
    let passedCount = 0;

    for (const q of finetuningData.readinessQuestions) {
      const status: ReadinessAnswerStatus =
        readinessAnswers[q.id] ?? 'unanswered';
      if (status === 'pass') {
        passedCount += 1;
      } else if (status === 'fail') {
        failedNumbers.push(q.number);
      } else {
        unansweredNumbers.push(q.number);
      }
    }

    const total = finetuningData.readinessQuestions.length;
    const allPassed = passedCount === total;

    return {
      total,
      passedCount,
      failedNumbers,
      unansweredNumbers,
      allPassed,
    };
  }, [readinessAnswers]);

  const handleSymptomSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = symptomInput.trim();
    if (trimmed.length < 4) {
      setInputError(
        'Enter at least 4 characters describing the observed model symptom to run triage.'
      );
      return;
    }

    setInputError(null);
    const matched = matchDiagnosticScenario(trimmed);
    setCustomDiagnosis({
      query: trimmed,
      matchedScenario: matched,
    });
    if (matched) {
      setSelectedScenarioId(matched.id);
    }
  };

  const handleClearSymptom = () => {
    setSymptomInput('');
    setInputError(null);
    setCustomDiagnosis(null);
  };

  const handleResetGate = () => {
    resetReadinessGate();
    setApprovalRequested(false);
  };

  const isGateApproved = approvalRequested && gateSummary.allPassed;
  const hasAnyNonDefaultAnswer =
    gateSummary.passedCount > 0 || gateSummary.failedNumbers.length > 0;

  return (
    <section
      aria-label="Diagnostic Gate Wizard"
      className="space-y-6 rounded-xl border border-border bg-surface p-5 shadow-subtle sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ink-secondary">
              INTERACTIVE GATE
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              [cite: 11, 12]
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink-primary">
            Diagnostic Decision Gate &amp; 8-Point Pre-Training Readiness Check
          </h3>
          <p className="mt-0.5 text-xs text-ink-secondary">
            Verify whether the bottleneck is a data, retrieval, or prompting
            issue before spending GPU budget on weight updates.
          </p>
        </div>
        <div
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium ${
            isGateApproved
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-800/70 dark:bg-rose-950/50 dark:text-rose-200'
          }`}
        >
          {isGateApproved ? (
            <ShieldCheck
              className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <ShieldAlert
              className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400"
              aria-hidden="true"
            />
          )}
          <span>
            {isGateApproved
              ? 'READY TO TRAIN — Baseline & Eval Verified'
              : 'BLOCKED — Do Not Train'}
          </span>
        </div>
      </div>

      {/* Part A: Symptom Triage & Scenario Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Part A · Observed Business Problem Triage
          </h4>
          <span className="font-mono text-[11px] text-ink-muted">
            {finetuningData.diagnosticScenarios.length} canonical scenarios
          </span>
        </div>

        {/* Custom Symptom Matcher */}
        <form onSubmit={handleSymptomSubmit} noValidate className="space-y-2">
          <label
            htmlFor="diagnostic-symptom-input"
            className="block text-xs font-medium text-ink-secondary"
          >
            Describe an observed production symptom (custom triage matcher)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
              />
              <input
                id="diagnostic-symptom-input"
                type="text"
                value={symptomInput}
                onChange={(e) => {
                  setSymptomInput(e.target.value);
                  if (inputError && e.target.value.trim().length >= 4) {
                    setInputError(null);
                  }
                }}
                placeholder="e.g., Prices change weekly, broken JSON format, high inference latency..."
                aria-invalid={inputError ? 'true' : 'false'}
                className={`w-full rounded-lg border bg-canvas py-2 pl-8 pr-3 text-sm text-ink-primary placeholder:text-ink-muted transition-colors focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/15 ${
                  inputError
                    ? 'border-rose-300 focus:border-rose-500 dark:border-rose-700 dark:focus:border-rose-500'
                    : 'border-border focus:border-border-strong'
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-medium text-accent-ink transition-colors hover:bg-accent/90 active:scale-[0.99]"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Diagnose Symptom
              </button>
              {(symptomInput.length > 0 || customDiagnosis !== null) && (
                <button
                  type="button"
                  onClick={handleClearSymptom}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-subtle active:scale-[0.99]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {inputError && (
            <p
              role="alert"
              className="flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {inputError}
            </p>
          )}

          {customDiagnosis && !inputError && (
            <div
              className={`rounded-lg border px-3.5 py-2.5 text-xs ${
                customDiagnosis.matchedScenario
                  ? 'border-border bg-canvas text-ink-primary'
                  : 'border-amber-200 bg-amber-50/50 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-100'
              }`}
            >
              {customDiagnosis.matchedScenario ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong className="font-semibold text-ink-primary">
                      Matched Pattern:
                    </strong>{' '}
                    &ldquo;{customDiagnosis.matchedScenario.observedProblem}&rdquo;{' '}
                    &rarr;{' '}
                    <span className="font-medium">
                      {customDiagnosis.matchedScenario.correctSolutionTitle}
                    </span>
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-medium ${
                      customDiagnosis.matchedScenario.requiresTraining
                        ? 'bg-accent text-accent-ink'
                        : 'border border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-200'
                    }`}
                  >
                    {customDiagnosis.matchedScenario.requiresTraining
                      ? 'Training Candidate'
                      : 'Non-Training Fix'}
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-semibold">
                    No exact scenario keyword match for &ldquo;
                    {customDiagnosis.query}&rdquo; — apply standard triage order:
                  </p>
                  <p className="text-amber-900/90 dark:text-amber-200/90">
                    1) Rule out non-training root causes first: volatile data
                    freshness (use RAG + CDC sync), inconsistent formatting (use
                    constrained JSON/Pydantic), or irrelevant chunks (fix
                    chunking, hybrid BM25 + vector, and re-ranking). 2) Only
                    proceed to SFT, DPO, or Distillation if a stable capability,
                    style, or cost/latency gap persists after baseline evals.
                  </p>
                </div>
              )}
            </div>
          )}
        </form>

        {/* 6 Scenarios Selector */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {finetuningData.diagnosticScenarios.map((scenario, idx) => {
            const isSelected = activeScenario?.id === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenarioId(scenario.id)}
                aria-pressed={isSelected}
                className={`group flex flex-col justify-between rounded-lg border p-3 text-left transition-all active:scale-[0.99] ${
                  isSelected
                    ? 'border-accent bg-accent text-accent-ink shadow-subtle'
                    : 'border-border bg-canvas text-ink-primary hover:border-border-strong hover:bg-surface'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      isSelected ? 'text-accent-ink/75' : 'text-ink-muted'
                    }`}
                  >
                    0{idx + 1} · {scenario.recommendedCategory}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${
                      scenario.requiresTraining
                        ? isSelected
                          ? 'bg-accent-ink/15 text-accent-ink'
                          : 'border border-border bg-subtle text-ink-primary'
                        : isSelected
                          ? 'bg-emerald-500/20 text-emerald-200 dark:bg-emerald-600/15 dark:text-emerald-800'
                          : 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200'
                    }`}
                  >
                    {scenario.requiresTraining ? 'Training' : 'No Training'}
                  </span>
                </div>
                <p
                  className={`mt-2 text-xs font-medium leading-snug ${
                    isSelected ? 'text-accent-ink' : 'text-ink-primary'
                  }`}
                >
                  {scenario.observedProblem}
                </p>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side Comparison */}
        {activeScenario && (
          <div className="rounded-lg border border-border bg-canvas p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Selected Symptom
                </span>
                <p className="text-sm font-semibold text-ink-primary">
                  {activeScenario.observedProblem}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                    activeScenario.requiresTraining
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200'
                  }`}
                >
                  {activeScenario.requiresTraining
                    ? 'Requires Training (Verify 8-Point Gate Below)'
                    : 'No Training Required — Fix System First'}
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                  {activeScenario.citation}
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3.5 dark:border-rose-800/70 dark:bg-rose-950/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-900 dark:text-rose-200">
                  <XCircle
                    className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400"
                    aria-hidden="true"
                  />
                  <span>Wrong Instinct</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-rose-950 dark:text-rose-100/90">
                  {activeScenario.wrongInstinct}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-surface p-3.5 shadow-subtle dark:border-emerald-800/70">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>Correct Engineering Solution</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-ink-primary">
                  {activeScenario.correctSolutionTitle}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                  {activeScenario.correctSolutionDetails}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part B: 8 Mandatory Pre-Training Readiness Questions */}
      <div className="space-y-4 border-t border-border pt-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Part B · 8 Mandatory Pre-Training Readiness Gate
            </h4>
            <p className="mt-0.5 text-xs text-ink-secondary">
              All 8 checks must be verified as{' '}
              <strong className="font-medium text-ink-primary">Pass</strong>{' '}
              before approving a fine-tuning run. Saved automatically to local
              progress.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-900 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200">
              Pass: {hydrated ? gateSummary.passedCount : 0}/8
            </span>
            <span className="rounded border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-900 dark:border-rose-800/70 dark:bg-rose-950/50 dark:text-rose-200">
              Fail: {hydrated ? gateSummary.failedNumbers.length : 0}
            </span>
            <span className="rounded border border-border bg-subtle px-2 py-0.5 text-ink-secondary">
              Unanswered:{' '}
              {hydrated ? gateSummary.unansweredNumbers.length : 8}
            </span>
          </div>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border bg-surface">
          {finetuningData.readinessQuestions.map((q) => {
            const currentStatus: ReadinessAnswerStatus = hydrated
              ? (readinessAnswers[q.id] ?? 'unanswered')
              : 'unanswered';

            const options: Array<{
              value: ReadinessAnswerStatus;
              label: string;
              icon: React.ReactNode;
            }> = [
              {
                value: 'pass',
                label: 'Pass',
                icon: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
              },
              {
                value: 'fail',
                label: 'Fail',
                icon: <XCircle className="h-3.5 w-3.5" aria-hidden="true" />,
              },
              {
                value: 'unanswered',
                label: 'Unanswered',
                icon: <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />,
              },
            ];

            return (
              <div
                key={q.id}
                className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-5 items-center rounded border border-border bg-subtle px-1.5 font-mono text-[11px] font-semibold text-ink-secondary">
                      Q{q.number}
                    </span>
                    <span className="text-sm font-medium text-ink-primary">
                      {q.question}
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted">
                      {q.citation}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-ink-secondary">
                    {q.verificationHint}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label={`Readiness question ${q.number} status`}
                  className="inline-flex shrink-0 items-center rounded-lg border border-border bg-canvas p-0.5"
                >
                  {options.map((opt) => {
                    const active = currentStatus === opt.value;
                    let activeClasses =
                      'bg-surface text-ink-primary border-border-strong shadow-subtle';
                    if (active && opt.value === 'pass') {
                      activeClasses =
                        'bg-emerald-600 text-white border-emerald-600 shadow-subtle dark:bg-emerald-600 dark:text-white dark:border-emerald-500';
                    } else if (active && opt.value === 'fail') {
                      activeClasses =
                        'bg-rose-600 text-white border-rose-600 shadow-subtle dark:bg-rose-600 dark:text-white dark:border-rose-500';
                    } else if (active && opt.value === 'unanswered') {
                      activeClasses =
                        'bg-accent text-accent-ink border-accent shadow-subtle';
                    }

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setReadinessAnswer(q.id, opt.value)}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-1 rounded-md border border-transparent px-2.5 py-1 text-xs font-medium transition-all active:scale-[0.98] ${
                          active
                            ? activeClasses
                            : 'text-ink-secondary hover:bg-surface/80 hover:text-ink-primary'
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gate Action & Validation Feedback */}
        <div className="space-y-3 rounded-lg border border-border bg-canvas p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              {isGateApproved ? (
                <ShieldCheck
                  className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
              ) : (
                <CircleSlash
                  className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400"
                  aria-hidden="true"
                />
              )}
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isGateApproved
                      ? 'text-emerald-900 dark:text-emerald-200'
                      : 'text-ink-primary'
                  }`}
                >
                  {isGateApproved
                    ? 'READY TO TRAIN — Baseline & Eval Verified'
                    : 'BLOCKED — Do Not Train'}
                </p>
                <p className="text-xs text-ink-secondary">
                  {isGateApproved
                    ? 'All 8 readiness checks passed. Proceed with SFT/LoRA/DPO or Distillation run and track uplift against your quantified baseline.'
                    : `${gateSummary.passedCount} of ${gateSummary.total} readiness checks passed.`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetGate}
                disabled={!hasAnyNonDefaultAnswer && !approvalRequested}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-subtle active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-surface"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Gate
              </button>
              <button
                type="button"
                onClick={() => setApprovalRequested(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-ink transition-colors hover:bg-accent/90 active:scale-[0.99]"
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Approve Fine-Tuning Run
              </button>
            </div>
          </div>

          {approvalRequested && !gateSummary.allPassed && (
            <div
              role="alert"
              className="rounded-md border border-rose-200 bg-rose-50/80 px-3.5 py-2.5 text-xs text-rose-950 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-100"
            >
              <p className="font-semibold text-rose-900 dark:text-rose-200">
                Training Approval Blocked — Complete all 8 readiness checks as Pass:
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-rose-900 dark:text-rose-200/90">
                {gateSummary.failedNumbers.length > 0 && (
                  <li>
                    <span className="font-semibold">Failed questions:</span>{' '}
                    <span className="font-mono">
                      {gateSummary.failedNumbers.map((n) => `Q${n}`).join(', ')}
                    </span>{' '}
                    (resolve root cause before re-testing).
                  </li>
                )}
                {gateSummary.unansweredNumbers.length > 0 && (
                  <li>
                    <span className="font-semibold">Unanswered questions:</span>{' '}
                    <span className="font-mono">
                      {gateSummary.unansweredNumbers
                        .map((n) => `Q${n}`)
                        .join(', ')}
                    </span>{' '}
                    (verify evidence and mark Pass).
                  </li>
                )}
              </ul>
            </div>
          )}

          {isGateApproved && (
            <div
              role="status"
              className="rounded-md border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-950 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-100"
            >
              <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                Gate Cleared: Baseline, audited data, independent held-out eval
                set, and regression criteria verified.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DiagnosticGateWizard;
