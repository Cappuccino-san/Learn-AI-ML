'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  Circle,
  Compass,
  Layers,
  Search,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react';
import { MODULE_ROUTES, careerData } from '@/data';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import { HandbookFigure } from '@/components/ui/HandbookFigure';

function competencyChecklistId(tier: number, index: number): string {
  return `skill-tier-${tier}-${index}`;
}

export function RoadmapView() {
  const meta = MODULE_ROUTES[1];
  const {
    completedModuleIds,
    toggleModuleComplete,
    completedChecklistIds,
    toggleChecklistItem,
    selectedRoleTrack,
    setSelectedRoleTrack,
    hydrated,
  } = useLearnerProgress();

  const isComplete = completedModuleIds.includes('module-2');
  const [activeTier, setActiveTier] = useState<number>(
    careerData.skillsPyramid[0]?.tier ?? 1
  );
  const [roleQuery, setRoleQuery] = useState('');

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const tierMatch = /^tier-(\d+)$/.exec(hash);
      if (tierMatch) {
        const tierNum = Number(tierMatch[1]);
        if (careerData.skillsPyramid.some((t) => t.tier === tierNum)) {
          setActiveTier(tierNum);
        }
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const currentTier =
    careerData.skillsPyramid.find((t) => t.tier === activeTier) ??
    careerData.skillsPyramid[0];

  const allPyramidIds = useMemo(
    () =>
      careerData.skillsPyramid.flatMap((t) =>
        t.competencies.map((_, idx) => competencyChecklistId(t.tier, idx))
      ),
    []
  );

  const totalCheckedCompetencies = useMemo(
    () =>
      allPyramidIds.filter((id) => completedChecklistIds.includes(id)).length,
    [allPyramidIds, completedChecklistIds]
  );

  const filteredRoles = useMemo(() => {
    const q = roleQuery.trim().toLowerCase();
    if (!q) return careerData.careerRoles;
    return careerData.careerRoles.filter((role) => {
      const haystack = [
        role.role,
        ...role.responsibilities,
        ...role.deliverables,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [roleQuery]);

  return (
    <div className="space-y-10 pb-16">
      {/* Module Header */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Module 02
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
            onClick={() => toggleModuleComplete('module-2')}
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

      {/* Progression Principle */}
      <section
        aria-labelledby="progression-principle-heading"
        className="space-y-3"
      >
        <div className="flex items-center justify-between gap-3">
          <h2
            id="progression-principle-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Progression Principle
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 3]
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <div className="flex items-start gap-3">
            <Compass
              className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-ink-primary">
              {careerData.progressionPrinciple}
            </p>
          </div>
        </div>
      </section>

      {/* Visual Reference Diagram */}
      <section aria-labelledby="roadmap-diagram-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="roadmap-diagram-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Visual Reference Diagram
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 2, 3]
          </span>
        </div>
        <HandbookFigure
          id="figure-1-roadmap"
          figureNumber={1}
          src="/images/handbook/figure-1-career-roadmap.png"
          width={1312}
          height={1199}
          title="Modern LLM Engineering Career Mastery Roadmap (@e_opore)"
          caption="Figure 1: Skills Pyramid, 8 Specialized Career Roles, Certifications Roadmap, End-to-End LLM System Architecture, Ecosystem Stack, and Career Growth Path."
          citation="[cite: 2, 3]"
        />
      </section>

      {/* Interactive 4-Tier Skills Pyramid */}
      <section aria-labelledby="skills-pyramid-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="skills-pyramid-heading"
              className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
            >
              4-Tier Skills Pyramid
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Select a stage and check off verified competencies as you ship
              real systems.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs tabular-nums text-ink-secondary">
              {hydrated ? totalCheckedCompetencies : 0}/{allPyramidIds.length}{' '}
              verified
            </span>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              [cite: 3]
            </span>
          </div>
        </div>

        {/* Tier Tabs */}
        <div
          role="tablist"
          aria-label="Skills Pyramid Tiers"
          className="grid grid-cols-2 gap-2 lg:grid-cols-4"
        >
          {careerData.skillsPyramid.map((tier) => {
            const tierIds = tier.competencies.map((_, idx) =>
              competencyChecklistId(tier.tier, idx)
            );
            const tierChecked = hydrated
              ? tierIds.filter((id) => completedChecklistIds.includes(id))
                  .length
              : 0;
            const active = currentTier.tier === tier.tier;

            return (
              <button
                key={tier.tier}
                id={`tier-${tier.tier}`}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTier(tier.tier)}
                className={`scroll-mt-20 flex flex-col justify-between rounded-lg border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99] ${
                  active
                    ? 'border-accent bg-surface shadow-card ring-1 ring-accent/10'
                    : 'border-border bg-surface/70 hover:border-border-strong hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-medium uppercase text-ink-muted">
                    Tier 0{tier.tier}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                    {tierChecked}/{tier.competencies.length}
                  </span>
                </div>
                <div className="mt-1.5">
                  <p className="text-sm font-semibold text-ink-primary">
                    {tier.stage}
                  </p>
                  <p className="font-mono text-[11px] text-ink-secondary">
                    {tier.years}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tier Detail & Check-Off */}
        <div
          role="tabpanel"
          aria-label={`Tier ${currentTier.tier}: ${currentTier.stage}`}
          className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers
                  className="h-4 w-4 text-accent-blue"
                  aria-hidden="true"
                />
                <h3 className="text-base font-semibold text-ink-primary">
                  Tier {currentTier.tier}: {currentTier.stage}{' '}
                  <span className="font-mono text-xs font-normal text-ink-muted">
                    ({currentTier.years})
                  </span>
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-secondary">
                {currentTier.engineeringFocus}
              </p>
            </div>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              {currentTier.citation}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {currentTier.competencies.map((comp, idx) => {
              const itemId = competencyChecklistId(currentTier.tier, idx);
              const checked = hydrated && completedChecklistIds.includes(itemId);
              return (
                <button
                  key={itemId}
                  type="button"
                  disabled={!hydrated}
                  aria-pressed={checked}
                  onClick={() => toggleChecklistItem(itemId)}
                  className={`flex items-start gap-3 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99] ${
                    checked
                      ? 'border-accent/40 bg-subtle/80 text-ink-primary'
                      : 'border-border bg-canvas hover:border-border-strong hover:bg-surface'
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
                      checked ? 'font-medium text-ink-primary' : 'text-ink-secondary'
                    }`}
                  >
                    {comp}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Forward Deployed Engineers (FDEs) Callout */}
      <section aria-labelledby="fde-callout-heading">
        <div className="rounded-lg border border-blue-200/80 border-l-4 border-l-blue-600 bg-blue-50/40 p-5 shadow-card dark:border-blue-900/60 dark:border-l-blue-400 dark:bg-blue-950/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              id="fde-callout-heading"
              className="text-sm font-semibold text-ink-primary"
            >
              {careerData.fdeCallout.title}
            </h2>
            <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
              {careerData.fdeCallout.citation}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            {careerData.fdeCallout.description}
          </p>
        </div>
      </section>

      {/* 10 Universal Competencies Bar */}
      <section aria-labelledby="universal-comp-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="universal-comp-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            10 Universal Core Competencies
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 3]
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {careerData.universalCompetencies.map((competency, idx) => (
            <div
              key={competency}
              className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2.5 shadow-subtle"
            >
              <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="truncate text-xs font-medium text-ink-primary">
                {competency}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Searchable / Filterable 8 Career Roles */}
      <section aria-labelledby="career-roles-heading" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="career-roles-heading"
                className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
              >
                8 Specialized Career Role Tracks
              </h2>
              <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                [cite: 4]
              </span>
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              Filter by role, responsibility, or deliverable—or pin your active
              target track.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={roleQuery}
                onChange={(e) => setRoleQuery(e.target.value)}
                placeholder="Filter roles or deliverables..."
                aria-label="Filter career roles"
                className="w-full rounded-md border border-border-strong bg-surface py-1.5 pl-8 pr-7 text-xs text-ink-primary placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              {roleQuery && (
                <button
                  type="button"
                  onClick={() => setRoleQuery('')}
                  aria-label="Clear role filter"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink-primary"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
              {filteredRoles.length}/{careerData.careerRoles.length}
            </span>
          </div>
        </div>

        {filteredRoles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-strong bg-surface p-8 text-center">
            <p className="text-sm font-medium text-ink-primary">
              No career roles match “{roleQuery}”.
            </p>
            <button
              type="button"
              onClick={() => setRoleQuery('')}
              className="mt-2 text-xs font-medium text-accent-blue hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredRoles.map((role) => {
              const isSelectedTarget =
                hydrated && selectedRoleTrack === role.id;
              return (
                <article
                  key={role.id}
                  id={`role-${role.id}`}
                  className={`scroll-mt-20 flex flex-col justify-between rounded-lg border bg-surface p-5 shadow-card transition-colors ${
                    isSelectedTarget
                      ? 'border-accent ring-1 ring-accent/15'
                      : 'border-border'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase
                          className="h-4 w-4 shrink-0 text-ink-muted"
                          aria-hidden="true"
                        />
                        <h3 className="text-sm font-semibold text-ink-primary">
                          {role.role}
                        </h3>
                      </div>
                      <span className="shrink-0 rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                        {role.citation}
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-3">
                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Core Responsibilities
                        </h4>
                        <ul className="mt-1.5 space-y-1">
                          {role.responsibilities.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-xs leading-relaxed text-ink-secondary"
                            >
                              <span
                                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-muted"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Verified Deliverables
                        </h4>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {role.deliverables.map((deliv) => (
                            <span
                              key={deliv}
                              className="rounded border border-border bg-canvas px-2 py-0.5 text-[11px] text-ink-primary"
                            >
                              {deliv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-3">
                    <button
                      type="button"
                      disabled={!hydrated}
                      onClick={() =>
                        setSelectedRoleTrack(isSelectedTarget ? null : role.id)
                      }
                      aria-pressed={isSelectedTarget}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50 ${
                        isSelectedTarget
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-border-strong bg-surface text-ink-secondary hover:bg-subtle hover:text-ink-primary'
                      }`}
                    >
                      <Target className="h-3 w-3" aria-hidden="true" />
                      <span>
                        {isSelectedTarget
                          ? 'Active Target Track'
                          : 'Set as Target Track'}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Certifications Roadmap vs. Demonstrated Engineering Proof */}
      <section aria-labelledby="certifications-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="certifications-heading"
            className="text-sm font-semibold uppercase tracking-wider text-ink-secondary"
          >
            Certifications Roadmap vs. Engineering Proof
          </h2>
          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            [cite: 5]
          </span>
        </div>

        {/* Comparison Panel */}
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-surface p-5 shadow-card md:grid-cols-2">
          <div className="space-y-1.5 md:border-r md:border-border md:pr-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-primary">
              <Award className="h-4 w-4 text-ink-muted" aria-hidden="true" />
              <span>What Certifications Validate</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-secondary">
              Baseline cloud vocabulary, API primitives, and structured
              familiarity across vendor ecosystems.
            </p>
          </div>
          <div className="space-y-1.5 md:pl-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-primary">
              <ShieldCheck
                className="h-4 w-4 text-accent-blue"
                aria-hidden="true"
              />
              <span>What Actually Drives Hiring Decisions</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-secondary">
              {careerData.certificationsNote}
            </p>
          </div>
        </div>

        {/* 4 Certification Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {careerData.certifications.map((cert) => (
            <div
              key={cert.id}
              id={`cert-${cert.id}`}
              className="scroll-mt-20 rounded-lg border border-border bg-surface p-4 shadow-subtle"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-900 dark:border-blue-800/70 dark:bg-blue-950/50 dark:text-blue-200">
                    {cert.tierLabel}
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    {cert.years}
                  </span>
                </div>
                <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                  {cert.citation}
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-semibold text-ink-primary">
                {cert.name}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                {cert.focus}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default RoadmapView;
