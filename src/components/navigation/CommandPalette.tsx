'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, CornerDownLeft, Search, X } from 'lucide-react';
import { globalSearchItems } from '@/data';
import type { SearchableItem } from '@/types/handbook';

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

type CategoryFilter = 'All' | SearchableItem['category'];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Cloud Service',
  'Fine-Tuning',
  'Diagnostic Gate',
  'Architecture',
  'Career & Role',
  'Portfolio Project',
  'Interview Prep',
  'Module',
];

const MAX_VISIBLE_RESULTS = 60;

function scoreItem(item: SearchableItem, tokens: string[]): number {
  if (tokens.length === 0) return 1;

  const titleLower = item.title.toLowerCase();
  const subtitleLower = item.subtitle.toLowerCase();
  const categoryLower = item.category.toLowerCase();
  const keywordsLower = item.keywords.join(' ').toLowerCase();
  const citationLower = item.citation.toLowerCase();

  let score = 0;
  for (const token of tokens) {
    const inTitle = titleLower.includes(token);
    const inKeywords = keywordsLower.includes(token);
    const inSubtitle = subtitleLower.includes(token);
    const inCategory = categoryLower.includes(token);
    const inCitation = citationLower.includes(token);

    if (!inTitle && !inKeywords && !inSubtitle && !inCategory && !inCitation) {
      return 0;
    }

    if (titleLower.startsWith(token)) score += 10;
    else if (inTitle) score += 6;
    if (inKeywords) score += 3;
    if (inCategory) score += 2;
    if (inSubtitle || inCitation) score += 1;
  }

  return score;
}

export function CommandPalette({ open, onClose, onOpen }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>('All');
  const [activeIndex, setActiveIndex] = useState(0);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) {
          onClose();
        } else {
          onOpen?.();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [open, onClose, onOpen]);

  // Focus input and lock scroll when modal opens
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const tokens = useMemo(
    () =>
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length > 0),
    [query]
  );

  const queryMatchedItems = useMemo(() => {
    if (tokens.length === 0) {
      return globalSearchItems;
    }

    const scored: Array<{ item: SearchableItem; score: number }> = [];
    for (const item of globalSearchItems) {
      const score = scoreItem(item, tokens);
      if (score > 0) {
        scored.push({ item, score });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map((entry) => entry.item);
  }, [tokens]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<CategoryFilter, number>();
    for (const cat of CATEGORY_FILTERS) {
      counts.set(cat, 0);
    }
    counts.set('All', queryMatchedItems.length);
    for (const item of queryMatchedItems) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [queryMatchedItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return queryMatchedItems;
    }
    return queryMatchedItems.filter(
      (item) => item.category === selectedCategory
    );
  }, [queryMatchedItems, selectedCategory]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, MAX_VISIBLE_RESULTS),
    [filteredItems]
  );

  // Reset highlighted row when query or category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query, selectedCategory]);

  // Keep active row scrolled into view
  useEffect(() => {
    if (!open || visibleItems.length === 0) return;
    const activeEl = listRef.current?.querySelector<HTMLElement>(
      `[data-result-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open, visibleItems.length]);

  const navigateToItem = (item: SearchableItem) => {
    const targetUrl = item.anchor ? `${item.route}#${item.anchor}` : item.route;
    onClose();
    setQuery('');
    setSelectedCategory('All');
    router.push(targetUrl);
  };

  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (visibleItems.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % visibleItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + visibleItems.length) % visibleItems.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = visibleItems[activeIndex];
      if (target) {
        navigateToItem(target);
      }
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSelectedCategory('All');
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  if (!open) return null;

  const activeItem = visibleItems[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] sm:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Global handbook search"
      onKeyDown={handleModalKeyDown}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/25 backdrop-blur-[1px] transition-opacity dark:bg-black/65"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Window */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border-strong bg-surface shadow-palette">
        {/* Search Input Row */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search
            className="h-4 w-4 shrink-0 text-ink-muted"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cloud services, fine-tuning methods, RAG, roles..."
            aria-label="Search handbook index"
            aria-controls="command-palette-results"
            aria-activedescendant={
              activeItem ? `palette-item-${activeItem.id}` : undefined
            }
            className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className="rounded p-1 text-ink-muted transition-colors hover:bg-subtle hover:text-ink-primary active:bg-border/60"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted transition-colors hover:border-border-strong hover:text-ink-primary active:bg-border/60"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border bg-canvas/70 px-4 py-2">
          {CATEGORY_FILTERS.map((category) => {
            const count = categoryCounts.get(category) ?? 0;
            const isActive = selectedCategory === category;
            const isDisabled =
              count === 0 && category !== 'All' && !isActive;

            return (
              <button
                key={category}
                type="button"
                disabled={isDisabled}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
                  isActive
                    ? 'border-accent bg-accent text-accent-ink shadow-subtle'
                    : 'border-border bg-surface text-ink-secondary hover:border-border-strong hover:bg-subtle hover:text-ink-primary active:bg-border/50 dark:bg-surface/80 dark:hover:bg-subtle'
                } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-surface dark:disabled:hover:bg-surface/80`}
              >
                <span>{category}</span>
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? 'text-accent-ink/75' : 'text-ink-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div
          id="command-palette-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[52vh] overflow-y-auto p-2"
        >
          {visibleItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-subtle text-ink-muted">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-ink-primary">
                  No matching handbook entries
                </p>
                <p className="text-xs text-ink-muted">
                  Try another keyword (e.g. &ldquo;Bedrock&rdquo;,
                  &ldquo;QLoRA&rdquo;, &ldquo;Checkpoint&rdquo;) or reset the
                  category filter.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink-primary shadow-subtle transition-colors hover:bg-subtle active:bg-border/60"
              >
                Clear query
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {visibleItems.map((item, index) => {
                const isSelected = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    id={`palette-item-${item.id}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-result-index={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => navigateToItem(item)}
                    className={`group flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-accent text-accent-ink shadow-subtle'
                        : 'bg-transparent text-ink-secondary hover:bg-subtle/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate text-sm font-medium ${
                            isSelected ? 'text-accent-ink' : 'text-ink-primary'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                            isSelected
                              ? 'border-accent-ink/20 bg-accent-ink/10 text-accent-ink/90'
                              : 'border-border bg-surface text-ink-muted dark:bg-subtle'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p
                        className={`line-clamp-1 text-xs ${
                          isSelected ? 'text-accent-ink/75' : 'text-ink-muted'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pt-0.5">
                      <span
                        className={`hidden font-mono text-[10px] sm:inline ${
                          isSelected ? 'text-accent-ink/75' : 'text-ink-muted'
                        }`}
                      >
                        {item.route}
                      </span>
                      <ArrowUpRight
                        className={`h-3.5 w-3.5 transition-opacity ${
                          isSelected
                            ? 'text-accent-ink opacity-100'
                            : 'text-ink-muted opacity-0 group-hover:opacity-100'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex items-center justify-between border-t border-border bg-canvas/80 px-4 py-2 text-[11px] text-ink-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">
                <CornerDownLeft className="h-2.5 w-2.5" aria-hidden="true" />
              </kbd>
              Open
            </span>
          </div>
          <span className="font-mono">
            {filteredItems.length > MAX_VISIBLE_RESULTS
              ? `Showing ${MAX_VISIBLE_RESULTS} of ${filteredItems.length} matches`
              : `${filteredItems.length} ${
                  filteredItems.length === 1 ? 'result' : 'results'
                }`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
