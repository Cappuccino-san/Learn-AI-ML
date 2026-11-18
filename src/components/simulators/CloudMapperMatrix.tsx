'use client';

import React, { useMemo, useState } from 'react';
import { Cloud, RotateCcw, Search, X } from 'lucide-react';
import { cloudMatrixData } from '@/data/cloudMatrix';

type ProviderFilter = 'ALL' | 'AWS' | 'Azure' | 'GCP';

export function CloudMapperMatrix() {
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>('ALL');
  const [jobFilter, setJobFilter] = useState<string>('ALL');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredJobs = useMemo(() => {
    return cloudMatrixData.jobs
      .filter((job) => jobFilter === 'ALL' || job.id === jobFilter)
      .map((job) => {
        const matchingSubRoles = job.subRoles.filter((sr) => {
          if (!normalizedQuery) return true;

          const activeServices =
            providerFilter === 'AWS'
              ? sr.aws
              : providerFilter === 'Azure'
                ? sr.azure
                : providerFilter === 'GCP'
                  ? sr.gcp
                  : [...sr.aws, ...sr.azure, ...sr.gcp];

          const haystack = [
            job.number,
            job.name,
            job.tagline,
            sr.subRole,
            ...activeServices,
          ]
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalizedQuery);
        });

        return {
          ...job,
          subRoles: matchingSubRoles,
        };
      })
      .filter((job) => job.subRoles.length > 0);
  }, [jobFilter, normalizedQuery, providerFilter]);

  const counts = useMemo(() => {
    const visibleJobs = filteredJobs.length;
    let visibleSubRoles = 0;
    let visibleServices = 0;

    for (const job of filteredJobs) {
      visibleSubRoles += job.subRoles.length;
      for (const sr of job.subRoles) {
        if (providerFilter === 'ALL' || providerFilter === 'AWS') {
          visibleServices += sr.aws.length;
        }
        if (providerFilter === 'ALL' || providerFilter === 'Azure') {
          visibleServices += sr.azure.length;
        }
        if (providerFilter === 'ALL' || providerFilter === 'GCP') {
          visibleServices += sr.gcp.length;
        }
      }
    }

    return {
      visibleJobs,
      visibleSubRoles,
      visibleServices,
    };
  }, [filteredJobs, providerFilter]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    providerFilter !== 'ALL' ||
    jobFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setProviderFilter('ALL');
    setJobFilter('ALL');
  };

  const renderServiceList = (
    services: string[],
    provider: 'AWS' | 'Azure' | 'GCP'
  ) => {
    const isFocused = providerFilter === provider;
    const isMuted = providerFilter !== 'ALL' && !isFocused;

    return (
      <div
        className={`flex flex-wrap gap-1.5 transition-opacity ${
          isMuted ? 'opacity-45' : 'opacity-100'
        }`}
      >
        {services.map((service) => {
          const isMatch =
            normalizedQuery.length > 0 &&
            service.toLowerCase().includes(normalizedQuery);
          return (
            <span
              key={`${provider}-${service}`}
              className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] leading-tight transition-colors ${
                isMatch
                  ? 'border-accent bg-accent font-medium text-accent-ink'
                  : isFocused
                    ? 'border-border-strong bg-surface font-medium text-ink-primary shadow-subtle'
                    : 'border-border bg-canvas text-ink-primary'
              }`}
            >
              {service}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <section
      aria-label="Cross-Cloud Architecture Mapper Matrix"
      className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-subtle sm:p-6"
    >
      {/* Header & Live Counters */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ink-secondary">
              CROSS-CLOUD MATRIX
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              [cite: 13, 14]
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink-primary">
            Side-by-Side AWS, Azure &amp; GCP Service Mapper
          </h3>
          <p className="mt-0.5 text-xs text-ink-secondary">
            Translate system architecture roles into cloud-native services across
            all 8 core jobs and 24 functional sub-roles.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="rounded-md border border-border bg-canvas px-2.5 py-1 text-ink-primary">
            Jobs: <strong>{counts.visibleJobs}</strong> /{' '}
            {cloudMatrixData.totalJobs}
          </span>
          <span className="rounded-md border border-border bg-canvas px-2.5 py-1 text-ink-primary">
            Sub-Roles: <strong>{counts.visibleSubRoles}</strong> /{' '}
            {cloudMatrixData.totalSubRoles}
          </span>
          <span className="rounded-md border border-border bg-canvas px-2.5 py-1 text-ink-primary">
            Services: <strong>{counts.visibleServices}</strong> /{' '}
            {cloudMatrixData.totalServices}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Instant Search */}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job, sub-role, or service (e.g., Bedrock, Cloud Run, Cosmos DB, EKS)..."
              aria-label="Search cloud services, sub-roles, or system jobs"
              className="w-full rounded-lg border border-border bg-canvas py-2 pl-8 pr-8 text-xs text-ink-primary placeholder:text-ink-muted transition-colors focus:border-border-strong focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear cloud matrix search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:bg-subtle hover:text-ink-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Cloud Provider Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'ALL', label: 'All Clouds' },
                { id: 'AWS', label: 'AWS' },
                { id: 'Azure', label: 'Azure' },
                { id: 'GCP', label: 'GCP' },
              ] as const
            ).map((provider) => {
              const active = providerFilter === provider.id;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setProviderFilter(provider.id)}
                  aria-pressed={active}
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${
                    active
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-border bg-canvas text-ink-secondary hover:border-border-strong hover:bg-surface'
                  }`}
                >
                  {provider.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-secondary hover:bg-subtle active:scale-[0.98]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* System Job Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setJobFilter('ALL')}
            aria-pressed={jobFilter === 'ALL'}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors active:scale-[0.98] ${
              jobFilter === 'ALL'
                ? 'border-accent bg-accent text-accent-ink'
                : 'border-border bg-canvas text-ink-secondary hover:border-border-strong hover:bg-surface'
            }`}
          >
            All 8 Jobs
          </button>
          {cloudMatrixData.jobs.map((job) => {
            const active = jobFilter === job.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => setJobFilter(job.id)}
                aria-pressed={active}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors active:scale-[0.98] ${
                  active
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-border bg-canvas text-ink-secondary hover:border-border-strong hover:bg-surface'
                }`}
              >
                <span className="font-mono text-[11px] opacity-75">
                  {job.number}
                </span>{' '}
                {job.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matrix Content or Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-canvas px-4 py-12 text-center">
          <Cloud className="h-6 w-6 text-ink-muted" aria-hidden="true" />
          <p className="mt-2.5 text-sm font-medium text-ink-primary">
            No cloud services or sub-roles match your filters
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Try clearing your search query or switching back to All Clouds / All
            8 Jobs.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-primary shadow-subtle hover:bg-subtle active:scale-[0.99]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Column Header */}
          <div className="hidden grid-cols-12 overflow-hidden rounded-lg border border-border bg-canvas text-[11px] font-semibold uppercase tracking-wider text-ink-muted md:grid">
            <div className="col-span-3 px-3.5 py-2.5">Functional Sub-Role</div>
            <div
              className={`col-span-3 border-l border-border px-3.5 py-2.5 ${
                providerFilter === 'AWS'
                  ? 'bg-accent text-accent-ink'
                  : providerFilter !== 'ALL'
                    ? 'opacity-50'
                    : ''
              }`}
            >
              AWS {providerFilter === 'AWS' ? '· Focused' : ''}
            </div>
            <div
              className={`col-span-3 border-l border-border px-3.5 py-2.5 ${
                providerFilter === 'Azure'
                  ? 'bg-accent text-accent-ink'
                  : providerFilter !== 'ALL'
                    ? 'opacity-50'
                    : ''
              }`}
            >
              Azure {providerFilter === 'Azure' ? '· Focused' : ''}
            </div>
            <div
              className={`col-span-3 border-l border-border px-3.5 py-2.5 ${
                providerFilter === 'GCP'
                  ? 'bg-accent text-accent-ink'
                  : providerFilter !== 'ALL'
                    ? 'opacity-50'
                    : ''
              }`}
            >
              GCP {providerFilter === 'GCP' ? '· Focused' : ''}
            </div>
          </div>

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              {/* Job Group Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-canvas px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink-primary">
                    {job.number}
                  </span>
                  <span className="text-sm font-semibold text-ink-primary">
                    {job.name}
                  </span>
                  <span className="text-xs text-ink-muted">— {job.tagline}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                  <span>{job.subRoles.length} sub-roles</span>
                  <span>{job.citation}</span>
                </div>
              </div>

              {/* Sub-Role Rows */}
              <div className="divide-y divide-border">
                {job.subRoles.map((sr) => (
                  <div
                    key={sr.id}
                    className="grid grid-cols-1 md:grid-cols-12"
                  >
                    <div className="flex items-center justify-between bg-surface px-3.5 py-3 md:col-span-3">
                      <span className="text-xs font-semibold text-ink-primary">
                        {sr.subRole}
                      </span>
                    </div>

                    <div
                      className={`border-t border-border/60 px-3.5 py-3 md:col-span-3 md:border-l md:border-t-0 md:border-border ${
                        providerFilter === 'AWS' ? 'bg-subtle/60' : 'bg-surface'
                      }`}
                    >
                      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted md:hidden">
                        AWS
                      </span>
                      {renderServiceList(sr.aws, 'AWS')}
                    </div>

                    <div
                      className={`border-t border-border/60 px-3.5 py-3 md:col-span-3 md:border-l md:border-t-0 md:border-border ${
                        providerFilter === 'Azure'
                          ? 'bg-subtle/60'
                          : 'bg-surface'
                      }`}
                    >
                      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted md:hidden">
                        Azure
                      </span>
                      {renderServiceList(sr.azure, 'Azure')}
                    </div>

                    <div
                      className={`border-t border-border/60 px-3.5 py-3 md:col-span-3 md:border-l md:border-t-0 md:border-border ${
                        providerFilter === 'GCP' ? 'bg-subtle/60' : 'bg-surface'
                      }`}
                    >
                      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted md:hidden">
                        GCP
                      </span>
                      {renderServiceList(sr.gcp, 'GCP')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CloudMapperMatrix;
