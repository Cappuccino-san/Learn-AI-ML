'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  FileCheck2,
  FolderGit2,
  MessageSquareCode,
  Sparkles,
  Users,
} from 'lucide-react';
import { MODULE_ROUTES, portfolioData } from '@/data';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { CareerReadinessTracker } from '@/components/simulators/CareerReadinessTracker';

type PracticeLoopStepKey = 'explain' | 'design' | 'build' | 'evaluate';

const PRACTICE_TABS: Array<{
  key: PracticeLoopStepKey;
  label: string;
  stepNum: string;
}> = [
  { key: 'explain', label: 'Explain', stepNum: '01' },
  { key: 'design', label: 'Design', stepNum: '02' },
  { key: 'build', label: 'Build', stepNum: '03' },
  { key: 'evaluate', label: 'Evaluate', stepNum: '04' },
];

export function PortfolioView() {
  const meta = MODULE_ROUTES[5];
  const {
    completedModuleIds,
    toggleModuleComplete,
    completedChecklistIds,
    toggleChecklistItem,
    masteredInterviewDomains,
    toggleInterviewDomain,
    hydrated,
  } = useLearnerProgress();

  const isComplete = completedModuleIds.includes('module-6');

  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([
    portfolioData.portfolioProjects[0]?.id ?? '',
  ]);

  const [activeLoopTabByDomain, setActiveLoopTabByDomain] = useState<
    Record<string, PracticeLoopStepKey>
  >({});

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash.startsWith('project-')) return;
      const projectId = hash.replace(/^project-/, '');
      if (portfolioData.portfolioProjects.some((p) => p.id === projectId)) {
        setExpandedProjectIds((prev) =>
          prev.includes(projectId) ? prev : [...prev, projectId]
        );
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const toggleProjectExpand = (id: string) => {
    setExpandedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allProjectsExpanded =
    expandedProjectIds.length === portfolioData.portfolioProjects.length;

  const toggleExpandAllProjects = () => {
    if (allProjectsExpanded) {
      setExpandedProjectIds([]);
    } else {
      setExpandedProjectIds(portfolioData.portfolioProjects.map((p) => p.id));
    }
  };

  const resumeCheckedCount = hydrated
    ? portfolioData.resumeChecklist.filter((item) =>
        completedChecklistIds.includes(item.id)
      ).length
    : 0;

  return (
    <div className="space-y-12 pb-16">
      {/* Module Header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Module 06
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
            onClick={() => toggleModuleComplete('module-6')}
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

      {/* Live Career Readiness Tracker Simulator */}
      <section aria-labelledby="readiness-tracker-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="readiness-tracker-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Career Readiness & Verification Tracker
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 15, 16]
          </span>
        </div>

        <ErrorBoundary title="Career Readiness Tracker failed to load">
          <CareerReadinessTracker />
        </ErrorBoundary>
      </section>

      {/* 5 Operational Career Progression Milestones */}
      <section aria-labelledby="milestones-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="milestones-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              5 Operational Career Progression Milestones
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Progression from foundational CLI builders to enterprise AI
              platform architecture.
            </p>
          </div>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 15]
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {portfolioData.milestones.map((milestone) => (
            <article
              key={milestone.step}
              id={`milestone-${milestone.step}`}
              className="scroll-mt-20 flex flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-subtle"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold tabular-nums text-accent-blue">
                    STEP 0{milestone.step}
                  </span>
                  <span className="font-mono text-[10px] text-ink-muted">
                    {milestone.years}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-ink-primary">
                  {milestone.role}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-ink-muted">
                  {milestone.phase}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-secondary">
                  {milestone.description}
                </p>
              </div>
              <div className="mt-3 border-t border-border pt-2">
                <span className="font-mono text-[10px] text-ink-muted">
                  {milestone.citation}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6 Portfolio Projects with Expandable Verification Checklists */}
      <section aria-labelledby="portfolio-projects-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="portfolio-projects-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              6 Verified Production Portfolio Projects
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Expand any project to verify engineering requirements and track
              production readiness criteria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleExpandAllProjects}
              className="rounded-md border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-ink-primary transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {allProjectsExpanded ? 'Collapse All' : 'Expand All'}
            </button>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              [cite: 15]
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {portfolioData.portfolioProjects.map((project) => {
            const isExpanded = expandedProjectIds.includes(project.id);
            const verifiedCount = hydrated
              ? project.verificationChecklist.filter((c) =>
                  completedChecklistIds.includes(c.id)
                ).length
              : 0;
            const totalChecks = project.verificationChecklist.length;
            const allChecked =
              hydrated && totalChecks > 0 && verifiedCount === totalChecks;

            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                className="scroll-mt-20 rounded-lg border border-border bg-surface shadow-card"
              >
                <button
                  type="button"
                  onClick={() => toggleProjectExpand(project.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-canvas/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-ink-muted">
                        <FolderGit2
                          className="h-3.5 w-3.5 text-accent-blue"
                          aria-hidden="true"
                        />
                        P0{project.number}
                      </span>
                      <h3 className="text-sm font-semibold text-ink-primary">
                        {project.title}
                      </h3>
                      <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                        {project.citation}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-ink-secondary">
                      {project.verificationSummary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {project.architectureAndStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-border bg-canvas px-2 py-0.5 font-mono text-[11px] text-ink-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-[11px] tabular-nums ${
                        allChecked
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-border bg-subtle text-ink-secondary'
                      }`}
                    >
                      {verifiedCount}/{totalChecks}
                    </span>
                    {isExpanded ? (
                      <ChevronUp
                        className="h-4 w-4 text-ink-muted"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        className="h-4 w-4 text-ink-muted"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border bg-canvas/50 p-5">
                    <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      Verification Requirements Checklist
                    </h4>
                    <div className="space-y-2">
                      {project.verificationChecklist.map((item) => {
                        const checked =
                          hydrated && completedChecklistIds.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={!hydrated}
                            aria-pressed={checked}
                            onClick={() => toggleChecklistItem(item.id)}
                            className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.995] ${
                              checked
                                ? 'border-accent/40 bg-surface'
                                : 'border-border bg-surface/80 hover:border-border-strong hover:bg-surface'
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                checked
                                  ? 'border-accent bg-accent text-accent-ink'
                                  : 'border-border-strong bg-surface'
                              }`}
                              aria-hidden="true"
                            >
                              {checked && <Check className="h-3 w-3" />}
                            </span>
                            <span
                              className={`text-xs leading-relaxed ${
                                checked
                                  ? 'font-medium text-ink-primary'
                                  : 'text-ink-secondary'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 6 Resume Engineering Checklist Items */}
      <section aria-labelledby="resume-checklist-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCheck2
              className="h-4 w-4 text-ink-muted"
              aria-hidden="true"
            />
            <h2
              id="resume-checklist-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              6 Resume Engineering Checklist
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-xs tabular-nums text-ink-secondary">
              {resumeCheckedCount}/{portfolioData.resumeChecklist.length}
            </span>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              [cite: 16]
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {portfolioData.resumeChecklist.map((item, idx) => {
            const checked =
              hydrated && completedChecklistIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={!hydrated}
                aria-pressed={checked}
                onClick={() => toggleChecklistItem(item.id)}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99] ${
                  checked
                    ? 'border-accent/40 bg-subtle/60'
                    : 'border-border bg-surface hover:border-border-strong'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    checked
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-border-strong bg-surface'
                  }`}
                  aria-hidden="true"
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-ink-muted">
                      ITEM 0{idx + 1}
                    </span>
                    <span className="font-mono text-[10px] text-ink-muted">
                      {item.citation}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      checked
                        ? 'font-medium text-ink-primary'
                        : 'text-ink-secondary'
                    }`}
                  >
                    {item.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 8 Interview Prep Domains with Interactive Practice Loop Flashcards */}
      <section aria-labelledby="interview-domains-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquareCode
                className="h-4 w-4 text-ink-muted"
                aria-hidden="true"
              />
              <h2
                id="interview-domains-heading"
                className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
              >
                8 Interview Prep Domains
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              Practice each domain across the 4-step engineering loop:{' '}
              {portfolioData.interviewPracticeLoopSteps.join(' → ')}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs tabular-nums text-ink-secondary">
              {hydrated ? masteredInterviewDomains.length : 0}/
              {portfolioData.interviewDomains.length} mastered
            </span>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              [cite: 16]
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {portfolioData.interviewDomains.map((domain) => {
            const activeStep: PracticeLoopStepKey =
              activeLoopTabByDomain[domain.id] ?? 'explain';
            const isMastered =
              hydrated && masteredInterviewDomains.includes(domain.id);

            return (
              <article
                key={domain.id}
                id={`interview-${domain.id}`}
                className={`scroll-mt-20 flex flex-col justify-between rounded-lg border bg-surface p-5 shadow-card ${
                  isMastered ? 'border-accent/50' : 'border-border'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold tabular-nums text-ink-muted">
                          D0{domain.number}
                        </span>
                        <h3 className="text-sm font-semibold text-ink-primary">
                          {domain.domain}
                        </h3>
                      </div>
                      <p className="text-xs text-ink-secondary">
                        {domain.focus}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!hydrated}
                      aria-pressed={isMastered}
                      onClick={() => toggleInterviewDomain(domain.id)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] ${
                        isMastered
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-border-strong bg-surface text-ink-secondary hover:bg-subtle hover:text-ink-primary'
                      }`}
                    >
                      {isMastered ? (
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Circle className="h-3 w-3" aria-hidden="true" />
                      )}
                      <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>
                  </div>

                  {/* Explain -> Design -> Build -> Evaluate Tabs */}
                  <div
                    role="tablist"
                    aria-label={`${domain.domain} practice loop`}
                    className="mt-3 grid grid-cols-4 gap-1 rounded-md border border-border bg-subtle p-1"
                  >
                    {PRACTICE_TABS.map((tab) => {
                      const active = activeStep === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() =>
                            setActiveLoopTabByDomain((prev) => ({
                              ...prev,
                              [domain.id]: tab.key,
                            }))
                          }
                          className={`rounded px-2 py-1.5 text-center text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            active
                              ? 'bg-surface text-ink-primary shadow-subtle'
                              : 'text-ink-muted hover:text-ink-primary'
                          }`}
                        >
                          <span className="font-mono text-[10px] opacity-70">
                            {tab.stepNum}{' '}
                          </span>
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Flashcard Content */}
                  <div
                    role="tabpanel"
                    className="mt-3 rounded-md border border-border bg-canvas p-3.5"
                  >
                    <p className="text-xs leading-relaxed text-ink-primary">
                      {domain.practiceLoop[activeStep]}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end">
                  <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                    {domain.citation}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Continuous Learning Habits & Communities */}
      <section aria-labelledby="continuous-learning-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="continuous-learning-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Continuous Learning Habits & Open-Source Communities
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            {portfolioData.continuousLearning.citation}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="rounded-lg border border-border bg-surface p-5 shadow-subtle md:col-span-7">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <BookOpen
                className="h-4 w-4 text-accent-blue"
                aria-hidden="true"
              />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-primary">
                5 Core Engineering Habits
              </h3>
            </div>
            <ul className="mt-3 space-y-2">
              {portfolioData.continuousLearning.habits.map((habit, idx) => (
                <li
                  key={habit}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-secondary"
                >
                  <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                    0{idx + 1}
                  </span>
                  <span>{habit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5 shadow-subtle md:col-span-5">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <Users
                className="h-4 w-4 text-ink-secondary"
                aria-hidden="true"
              />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-primary">
                Open-Source Communities
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {portfolioData.continuousLearning.communities.map((community) => (
                <span
                  key={community}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-canvas px-3 py-1.5 text-xs font-medium text-ink-primary"
                >
                  <Sparkles
                    className="h-3 w-3 text-ink-muted"
                    aria-hidden="true"
                  />
                  {community}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Contribute by fixing reproducible issues, improving documentation,
              and sharing verified evaluation tools or agents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default PortfolioView;
