'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Circle,
  Compass,
  FileCheck2,
  FolderGit2,
  RotateCcw,
  Target,
} from 'lucide-react';
import { careerData } from '@/data/career';
import { portfolioData } from '@/data/portfolio';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';

export function skillCompetencyId(tierNumber: number, index: number): string {
  return `skill-tier-${tierNumber}-${index}`;
}

export function CareerReadinessTracker() {
  const {
    hydrated,
    completedChecklistIds,
    toggleChecklistItem,
    masteredInterviewDomains,
    toggleInterviewDomain,
    selectedRoleTrack,
    setSelectedRoleTrack,
    resetAllProgress,
  } = useLearnerProgress();

  const [activeSkillTier, setActiveSkillTier] = useState<number>(1);
  const [confirmReset, setConfirmReset] = useState(false);

  const completedSet = useMemo(
    () => new Set(hydrated ? completedChecklistIds : []),
    [completedChecklistIds, hydrated]
  );

  const masteredSet = useMemo(
    () => new Set(hydrated ? masteredInterviewDomains : []),
    [masteredInterviewDomains, hydrated]
  );

  const metrics = useMemo(() => {
    const allSkillIds: string[] = [];
    for (const tier of careerData.skillsPyramid) {
      tier.competencies.forEach((_, idx) => {
        allSkillIds.push(skillCompetencyId(tier.tier, idx));
      });
    }
    const skillsDone = allSkillIds.filter((id) => completedSet.has(id)).length;
    const skillsTotal = allSkillIds.length; // 24

    const allProjectCheckIds = portfolioData.portfolioProjects.flatMap((p) =>
      p.verificationChecklist.map((c) => c.id)
    );
    const projectChecksDone = allProjectCheckIds.filter((id) =>
      completedSet.has(id)
    ).length;
    const projectsFullyVerified = portfolioData.portfolioProjects.filter((p) =>
      p.verificationChecklist.every((c) => completedSet.has(c.id))
    ).length;

    const resumeDone = portfolioData.resumeChecklist.filter((item) =>
      completedSet.has(item.id)
    ).length;
    const resumeTotal = portfolioData.resumeChecklist.length; // 6

    const interviewDone = portfolioData.interviewDomains.filter((d) =>
      masteredSet.has(d.id)
    ).length;
    const interviewTotal = portfolioData.interviewDomains.length; // 8

    const overallDone =
      skillsDone + projectChecksDone + resumeDone + interviewDone;
    const overallTotal =
      skillsTotal + allProjectCheckIds.length + resumeTotal + interviewTotal;
    const overallPct =
      overallTotal > 0 ? Math.round((overallDone / overallTotal) * 100) : 0;

    return {
      skillsDone,
      skillsTotal,
      skillsPct:
        skillsTotal > 0 ? Math.round((skillsDone / skillsTotal) * 100) : 0,
      projectChecksDone,
      projectChecksTotal: allProjectCheckIds.length,
      projectsFullyVerified,
      projectsTotal: portfolioData.portfolioProjects.length,
      projectsPct:
        allProjectCheckIds.length > 0
          ? Math.round((projectChecksDone / allProjectCheckIds.length) * 100)
          : 0,
      resumeDone,
      resumeTotal,
      resumePct:
        resumeTotal > 0 ? Math.round((resumeDone / resumeTotal) * 100) : 0,
      interviewDone,
      interviewTotal,
      interviewPct:
        interviewTotal > 0
          ? Math.round((interviewDone / interviewTotal) * 100)
          : 0,
      overallDone,
      overallTotal,
      overallPct,
    };
  }, [completedSet, masteredSet]);

  const activeRole = useMemo(() => {
    if (!hydrated || !selectedRoleTrack) return null;
    return (
      careerData.careerRoles.find((role) => role.id === selectedRoleTrack) ??
      null
    );
  }, [hydrated, selectedRoleTrack]);

  const activeTierSpec = useMemo(() => {
    return (
      careerData.skillsPyramid.find((t) => t.tier === activeSkillTier) ??
      careerData.skillsPyramid[0]
    );
  }, [activeSkillTier]);

  const handleConfirmReset = () => {
    resetAllProgress();
    setConfirmReset(false);
  };

  return (
    <section
      aria-label="Career Readiness Tracker"
      className="space-y-6 rounded-xl border border-border bg-surface p-5 shadow-subtle sm:p-6"
    >
      {/* Header & Reset Guard */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ink-secondary">
              CAREER READINESS DASHBOARD
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              [cite: 3, 4, 15, 16]
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink-primary">
            Production Engineering &amp; Interview Readiness Tracker
          </h3>
          <p className="mt-0.5 text-xs text-ink-secondary">
            Persisted locally in your browser across the 4-tier pyramid, 6
            verified projects, 6 resume standards, and 8 interview domains.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              disabled={metrics.overallDone === 0 && !activeRole}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-subtle active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Progress
            </button>
          ) : (
            <div
              role="alertdialog"
              aria-label="Confirm reset all progress"
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 dark:border-rose-800/70 dark:bg-rose-950/50"
            >
              <AlertTriangle
                className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-rose-900 dark:text-rose-200">
                Clear all saved progress?
              </span>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded bg-rose-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-rose-700 active:scale-[0.98] dark:hover:bg-rose-500"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded border border-border bg-surface px-2 py-0.5 text-xs font-medium text-ink-secondary hover:bg-subtle"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress Bar + 4 Summary Cards */}
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-canvas p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink-primary">
              Overall Verification Readiness
            </span>
            <span className="font-mono font-semibold text-ink-primary">
              {metrics.overallPct}% ({metrics.overallDone} /{' '}
              {metrics.overallTotal} checks)
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${metrics.overallPct}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-3.5">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>4-Tier Skills Pyramid</span>
              <Compass className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-lg font-semibold text-ink-primary">
                {metrics.skillsPct}%
              </span>
              <span className="font-mono text-xs text-ink-muted">
                {metrics.skillsDone} / {metrics.skillsTotal} skills
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-3.5">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>6 Portfolio Projects</span>
              <FolderGit2
                className="h-3.5 w-3.5 text-ink-muted"
                aria-hidden="true"
              />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-lg font-semibold text-ink-primary">
                {metrics.projectsPct}%
              </span>
              <span className="font-mono text-xs text-ink-muted">
                {metrics.projectsFullyVerified}/{metrics.projectsTotal} complete
                ({metrics.projectChecksDone}/{metrics.projectChecksTotal})
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-3.5">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Resume Engineering</span>
              <FileCheck2
                className="h-3.5 w-3.5 text-ink-muted"
                aria-hidden="true"
              />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-lg font-semibold text-ink-primary">
                {metrics.resumePct}%
              </span>
              <span className="font-mono text-xs text-ink-muted">
                {metrics.resumeDone} / {metrics.resumeTotal} items
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-3.5">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>8 Interview Domains</span>
              <Award className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-lg font-semibold text-ink-primary">
                {metrics.interviewPct}%
              </span>
              <span className="font-mono text-xs text-ink-muted">
                {metrics.interviewDone} / {metrics.interviewTotal} mastered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Role Target Selector + FDE Focus Note */}
      <div className="space-y-3 rounded-lg border border-border bg-canvas p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-ink-secondary" aria-hidden="true" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Target Role Track (8 Roles)
            </h4>
          </div>
          {activeRole && (
            <button
              type="button"
              onClick={() => setSelectedRoleTrack(null)}
              className="text-xs font-medium text-ink-muted hover:text-ink-primary"
            >
              Clear target
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {careerData.careerRoles.map((role) => {
            const active = activeRole?.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() =>
                  setSelectedRoleTrack(active ? null : role.id)
                }
                aria-pressed={active}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${
                  active
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-border bg-surface text-ink-secondary hover:border-border-strong'
                }`}
              >
                {role.role}
              </button>
            );
          })}
        </div>

        {activeRole && (
          <div className="grid gap-3 rounded-md border border-border bg-surface p-3.5 sm:grid-cols-2">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Core Responsibilities · {activeRole.citation}
              </span>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-ink-secondary">
                {activeRole.responsibilities.map((resp, idx) => (
                  <li key={`${activeRole.id}-resp-${idx}`}>{resp}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Production Deliverables
              </span>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-ink-secondary">
                {activeRole.deliverables.map((del, idx) => (
                  <li key={`${activeRole.id}-del-${idx}`}>{del}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-xs text-ink-secondary">
          <span className="font-semibold text-ink-primary">
            {careerData.fdeCallout.title}:
          </span>{' '}
          {careerData.fdeCallout.description}{' '}
          <span className="font-mono text-[11px] text-ink-muted">
            {careerData.fdeCallout.citation}
          </span>
        </div>
      </div>

      {/* Skills Pyramid Interactive Check-off */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            4-Tier Skills Pyramid Competencies ({metrics.skillsDone}/24)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {careerData.skillsPyramid.map((tier) => {
              const active = activeSkillTier === tier.tier;
              const tierDone = tier.competencies.filter((_, idx) =>
                completedSet.has(skillCompetencyId(tier.tier, idx))
              ).length;
              return (
                <button
                  key={tier.tier}
                  type="button"
                  onClick={() => setActiveSkillTier(tier.tier)}
                  aria-pressed={active}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors active:scale-[0.98] ${
                    active
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-border bg-canvas text-ink-secondary hover:bg-surface'
                  }`}
                >
                  T{tier.tier} {tier.stage}{' '}
                  <span className="font-mono text-[10px] opacity-80">
                    ({tierDone}/{tier.competencies.length})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTierSpec && (
          <div className="rounded-lg border border-border bg-canvas p-3.5">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
              <span className="text-xs font-semibold text-ink-primary">
                Tier {activeTierSpec.tier}: {activeTierSpec.stage} (
                {activeTierSpec.years})
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                {activeTierSpec.citation}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {activeTierSpec.competencies.map((comp, idx) => {
                const id = skillCompetencyId(activeTierSpec.tier, idx);
                const checked = completedSet.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleChecklistItem(id)}
                    aria-pressed={checked}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors active:scale-[0.99] ${
                      checked
                        ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-100'
                        : 'border-border bg-surface text-ink-primary hover:border-border-strong'
                    }`}
                  >
                    {checked ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="h-4 w-4 shrink-0 text-border-strong"
                        aria-hidden="true"
                      />
                    )}
                    <span className={checked ? 'font-medium' : ''}>{comp}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Projects Verification Checklists */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            6 Portfolio Project Verification Checklists (
            {metrics.projectChecksDone}/{metrics.projectChecksTotal})
          </h4>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {portfolioData.portfolioProjects.map((project) => {
            const doneCount = project.verificationChecklist.filter((c) =>
              completedSet.has(c.id)
            ).length;
            const totalCount = project.verificationChecklist.length;
            const allDone = doneCount === totalCount;

            return (
              <div
                key={project.id}
                className="rounded-lg border border-border bg-canvas p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-semibold text-ink-muted">
                      PROJECT 0{project.number}
                    </span>
                    <h5 className="text-xs font-semibold text-ink-primary">
                      {project.title}
                    </h5>
                  </div>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] font-medium ${
                      allDone
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200'
                        : 'border border-border bg-surface text-ink-secondary'
                    }`}
                  >
                    {doneCount}/{totalCount}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1.5">
                  {project.verificationChecklist.map((check) => {
                    const checked = completedSet.has(check.id);
                    return (
                      <button
                        key={check.id}
                        type="button"
                        onClick={() => toggleChecklistItem(check.id)}
                        aria-pressed={checked}
                        className={`flex w-full items-start gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition-colors active:scale-[0.99] ${
                          checked
                            ? 'border-emerald-200 bg-surface text-ink-primary dark:border-emerald-800/70'
                            : 'border-border bg-surface text-ink-secondary hover:border-border-strong'
                        }`}
                      >
                        {checked ? (
                          <CheckCircle2
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-border-strong"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`leading-snug ${
                            checked ? 'line-through decoration-ink-muted' : ''
                          }`}
                        >
                          {check.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resume Checklist + Interview Domains Mastery */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Resume Engineering Checklist */}
        <div className="space-y-2.5 rounded-lg border border-border bg-canvas p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              6 Resume Engineering Standards
            </h4>
            <span className="font-mono text-xs text-ink-secondary">
              {metrics.resumeDone}/{metrics.resumeTotal}
            </span>
          </div>
          <div className="space-y-1.5">
            {portfolioData.resumeChecklist.map((item) => {
              const checked = completedSet.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  aria-pressed={checked}
                  className={`flex w-full items-start gap-2.5 rounded-md border px-3 py-2 text-left text-xs transition-colors active:scale-[0.99] ${
                    checked
                      ? 'border-emerald-200 bg-emerald-50/50 text-ink-primary dark:border-emerald-800/70 dark:bg-emerald-950/35'
                      : 'border-border bg-surface text-ink-primary hover:border-border-strong'
                  }`}
                >
                  {checked ? (
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-border-strong"
                      aria-hidden="true"
                    />
                  )}
                  <span className="leading-snug">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Interview Prep Domains */}
        <div className="space-y-2.5 rounded-lg border border-border bg-canvas p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              8 Interview Domains (Explain → Design → Build → Evaluate)
            </h4>
            <span className="font-mono text-xs text-ink-secondary">
              {metrics.interviewDone}/{metrics.interviewTotal}
            </span>
          </div>
          <div className="space-y-1.5">
            {portfolioData.interviewDomains.map((domain) => {
              const mastered = masteredSet.has(domain.id);
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => toggleInterviewDomain(domain.id)}
                  aria-pressed={mastered}
                  className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors active:scale-[0.99] ${
                    mastered
                      ? 'border-emerald-200 bg-emerald-50/50 text-ink-primary dark:border-emerald-800/70 dark:bg-emerald-950/35'
                      : 'border-border bg-surface text-ink-primary hover:border-border-strong'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {mastered ? (
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="h-3.5 w-3.5 shrink-0 text-border-strong"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {domain.number}. {domain.domain}
                      </div>
                      <div className="truncate text-[11px] text-ink-muted">
                        {domain.focus}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${
                      mastered
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200'
                        : 'bg-subtle text-ink-secondary'
                    }`}
                  >
                    {mastered ? 'Mastered' : 'In Progress'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareerReadinessTracker;
