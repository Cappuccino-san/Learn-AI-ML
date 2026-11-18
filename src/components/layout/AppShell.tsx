'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Cloud,
  Compass,
  Cpu,
  Layers,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import { finetuningData, MODULE_ROUTES } from '@/data';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useLearnerProgress } from '@/hooks/useLearnerProgress';
import { useTheme } from '@/hooks/useTheme';
import type { ModuleId } from '@/types/handbook';

const MODULE_ICONS: Record<
  ModuleId,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  'module-1': Compass,
  'module-2': Briefcase,
  'module-3': Layers,
  'module-4': SlidersHorizontal,
  'module-5': Cloud,
  'module-6': Cpu,
};

function isRouteActive(pathname: string, route: string): boolean {
  if (route === '/') {
    return pathname === '/';
  }
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const {
    hydrated,
    completedModuleIds,
    readinessAnswers,
    masteredInterviewDomains,
  } = useLearnerProgress();

  const { theme, hydrated: themeHydrated, toggleTheme } = useTheme();
  const isDarkTheme = themeHydrated && theme === 'dark';

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!isMobileDrawerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen]);

  const activeModule = useMemo(
    () =>
      MODULE_ROUTES.find((mod) => isRouteActive(pathname, mod.route)) ??
      MODULE_ROUTES[0],
    [pathname]
  );

  const readinessSummary = useMemo(() => {
    const totalModules = MODULE_ROUTES.length;
    const totalGateQuestions = finetuningData.readinessQuestions.length;

    if (!hydrated) {
      return {
        modulesDone: 0,
        totalModules,
        gatePassed: 0,
        totalGateQuestions,
        domainsDone: 0,
        percent: 0,
      };
    }

    const modulesDone = completedModuleIds.length;
    const gatePassed = finetuningData.readinessQuestions.filter(
      (q) => readinessAnswers[q.id] === 'pass'
    ).length;
    const domainsDone = masteredInterviewDomains.length;

    const totalUnits = totalModules + totalGateQuestions;
    const completedUnits = modulesDone + gatePassed;
    const percent =
      totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

    return {
      modulesDone,
      totalModules,
      gatePassed,
      totalGateQuestions,
      domainsDone,
      percent,
    };
  }, [hydrated, completedModuleIds, readinessAnswers, masteredInterviewDomains]);

  const renderNavItems = (collapsed: boolean) => (
    <nav aria-label="Curriculum modules" className="flex-1 space-y-1 px-2 py-3">
      {MODULE_ROUTES.map((mod, idx) => {
        const Icon = MODULE_ICONS[mod.id];
        const active = isRouteActive(pathname, mod.route);
        const completed = hydrated && completedModuleIds.includes(mod.id);

        return (
          <Link
            key={mod.id}
            href={mod.route}
            title={collapsed ? `${idx + 1}. ${mod.shortLabel}` : undefined}
            aria-current={active ? 'page' : undefined}
            className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
              active
                ? 'bg-subtle font-medium text-ink-primary shadow-subtle'
                : 'text-ink-secondary hover:bg-subtle/70 hover:text-ink-primary active:bg-border/50'
            } ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                active
                  ? 'text-ink-primary'
                  : 'text-ink-muted group-hover:text-ink-primary'
              }`}
              aria-hidden={true}
            />

            {!collapsed && (
              <>
                <span className="min-w-0 flex-1 truncate">
                  <span className="mr-1.5 font-mono text-[11px] text-ink-muted">
                    0{idx + 1}
                  </span>
                  {mod.shortLabel}
                </span>
                {completed && (
                  <CheckCircle2
                    className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-label="Completed"
                  />
                )}
              </>
            )}

            {collapsed && completed && (
              <span
                className="sr-only"
                aria-label={`${mod.shortLabel} completed`}
              >
                Completed
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const renderThemeToggle = (collapsed: boolean) => {
    const label = isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode';

    if (collapsed) {
      return (
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={label}
          aria-pressed={isDarkTheme}
          title={label}
          className="flex h-8 w-full items-center justify-center rounded-md border border-border bg-canvas text-ink-secondary transition-colors hover:border-border-strong hover:bg-subtle hover:text-ink-primary active:bg-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
        >
          {isDarkTheme ? (
            <Moon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <Sun className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        aria-pressed={isDarkTheme}
        title={label}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-canvas px-3 py-2 text-xs font-medium text-ink-secondary transition-colors hover:border-border-strong hover:bg-subtle hover:text-ink-primary active:bg-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
      >
        <span className="inline-flex items-center gap-2 text-ink-primary">
          {isDarkTheme ? (
            <Moon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <Sun className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>{isDarkTheme ? 'Dark' : 'Light'}</span>
        </span>
        <span className="font-mono text-[10px] text-ink-muted">
          Theme
        </span>
      </button>
    );
  };

  const renderRailFooter = (collapsed: boolean) => {
    if (collapsed) {
      return (
        <div className="space-y-2 border-t border-border p-2">
          {renderThemeToggle(true)}
          <div
            title={`Readiness: ${readinessSummary.percent}% (${readinessSummary.modulesDone}/${readinessSummary.totalModules} modules)`}
            className="flex flex-col items-center justify-center rounded-md border border-border bg-canvas py-1.5 font-mono text-[10px] font-medium text-ink-secondary"
          >
            {readinessSummary.percent}%
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2.5 border-t border-border p-3">
        {renderThemeToggle(false)}
        <div className="space-y-2 rounded-lg border border-border bg-canvas p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-ink-primary">
              Overall Readiness
            </span>
            <span className="font-mono text-xs font-semibold text-ink-primary">
              {readinessSummary.percent}%
            </span>
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={readinessSummary.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall curriculum and readiness progress"
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${readinessSummary.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-ink-muted">
            <span>
              {readinessSummary.modulesDone}/{readinessSummary.totalModules}{' '}
              modules
            </span>
            <span>
              {readinessSummary.gatePassed}/
              {readinessSummary.totalGateQuestions} gate
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary">
      {/* Global Command Palette */}
      <CommandPalette
        open={isSearchOpen}
        onOpen={() => setIsSearchOpen(true)}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur-sm md:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileDrawerOpen}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-ink-secondary transition-colors hover:bg-subtle hover:text-ink-primary active:bg-border/50"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="truncate text-sm font-semibold text-ink-primary">
            {activeModule.shortLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'
            }
            aria-pressed={isDarkTheme}
            title={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-subtle text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary active:bg-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          >
            {isDarkTheme ? (
              <Moon className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search palette"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-subtle px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary active:bg-border/60"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Search</span>
            <kbd className="rounded border border-border bg-surface px-1 font-mono text-[10px] text-ink-muted">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isMobileDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!isMobileDrawerOpen}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className={`fixed inset-0 bg-zinc-950/25 transition-opacity duration-200 dark:bg-black/60 ${
            isMobileDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Drawer Panel */}
        <aside
          aria-label="Mobile navigation"
          className={`relative z-10 flex h-full w-72 flex-col border-r border-border bg-surface shadow-palette transition-transform duration-200 ease-out ${
            isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold tracking-tight text-ink-primary"
            >
              <BookOpen className="h-4 w-4 text-ink-primary" aria-hidden="true" />
              <span>AI &amp; LLM Handbook</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-subtle hover:text-ink-primary active:bg-border/50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsMobileDrawerOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-canvas px-3 py-2 text-xs text-ink-secondary transition-colors hover:border-border-strong hover:bg-subtle hover:text-ink-primary active:bg-border/50"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                <span>Search handbook...</span>
              </span>
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                ⌘K
              </kbd>
            </button>
          </div>

          {renderNavItems(false)}
          {renderRailFooter(false)}
        </aside>
      </div>

      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        {/* Desktop Collapsible Left Rail */}
        <aside
          aria-label="Primary navigation"
          className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out md:flex ${
            isDesktopCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Rail Header */}
          <div
            className={`flex h-14 items-center border-b border-border px-3 ${
              isDesktopCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            {!isDesktopCollapsed && (
              <Link
                href="/"
                className="flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-sm font-semibold tracking-tight text-ink-primary transition-colors hover:text-ink-secondary"
              >
                <BookOpen
                  className="h-4 w-4 shrink-0 text-ink-primary"
                  aria-hidden="true"
                />
                <span className="truncate">AI &amp; LLM Center</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsDesktopCollapsed((prev) => !prev)}
              aria-label={
                isDesktopCollapsed
                  ? 'Expand navigation rail'
                  : 'Collapse navigation rail'
              }
              aria-expanded={!isDesktopCollapsed}
              title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink-primary active:bg-border/50"
            >
              {isDesktopCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Search Trigger */}
          <div className="px-2 pt-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              title={isDesktopCollapsed ? 'Search (⌘K)' : undefined}
              aria-label="Search handbook (Command+K)"
              className={`flex w-full items-center rounded-lg border border-border bg-canvas text-xs text-ink-secondary transition-colors hover:border-border-strong hover:bg-subtle hover:text-ink-primary active:bg-border/50 ${
                isDesktopCollapsed
                  ? 'justify-center px-2 py-2'
                  : 'justify-between px-2.5 py-2'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Search
                  className="h-3.5 w-3.5 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
                {!isDesktopCollapsed && <span>Search</span>}
              </span>
              {!isDesktopCollapsed && (
                <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                  ⌘K
                </kbd>
              )}
            </button>
          </div>

          {renderNavItems(isDesktopCollapsed)}
          {renderRailFooter(isDesktopCollapsed)}
        </aside>

        {/* Main Content Surface */}
        <main className="min-w-0 flex-1">
          <ErrorBoundary
            key={pathname}
            title="Unable to render this curriculum module"
            onReset={() => router.refresh()}
            className="mx-auto my-8 max-w-4xl"
          >
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
