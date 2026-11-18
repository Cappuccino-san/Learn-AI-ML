'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ImageIcon,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export interface HandbookFigureProps {
  id?: string;
  figureNumber: 1 | 2 | 3;
  title: string;
  caption: string;
  src: string;
  width: number;
  height: number;
  citation?: string;
  defaultCollapsed?: boolean;
}

export function HandbookFigure({
  id,
  figureNumber,
  title,
  caption,
  src,
  width,
  height,
  citation,
  defaultCollapsed = false,
}: HandbookFigureProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNativeZoom, setIsNativeZoom] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  return (
    <>
      <figure
        id={id}
        className="scroll-mt-20 overflow-hidden rounded-xl border border-border bg-surface shadow-card"
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-canvas/60 px-4 py-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-semibold text-ink-primary">
                <ImageIcon className="h-3 w-3 text-ink-muted" aria-hidden="true" />
                Figure {figureNumber}
              </span>
              {citation && (
                <span className="font-mono text-[11px] text-ink-muted">
                  {citation}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold leading-snug text-ink-primary">
              {title}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-expanded={!isCollapsed}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:border-border-strong hover:bg-subtle hover:text-ink-primary active:bg-border/50"
            >
              {isCollapsed ? (
                <>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Show diagram</span>
                </>
              ) : (
                <>
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Hide diagram</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label={`Expand Figure ${figureNumber} full size`}
              className="inline-flex items-center gap-1.5 rounded-md border border-accent bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-ink shadow-subtle transition-opacity hover:opacity-90 active:opacity-80"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Expand Full-Size</span>
            </button>
          </div>
        </div>

        {/* Diagram Presentation Plate */}
        {!isCollapsed && (
          <div className="p-3 sm:p-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 sm:p-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                aria-label={`Inspect Figure ${figureNumber}: ${title} at full size`}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <Image
                  src={src}
                  alt={`Figure ${figureNumber}: ${title} — ${caption}`}
                  width={width}
                  height={height}
                  unoptimized
                  className="h-auto w-full rounded object-contain"
                />
              </button>
            </div>
          </div>
        )}

        {/* Caption */}
        <figcaption className="border-t border-border bg-canvas/40 px-4 py-2.5 text-xs leading-relaxed text-ink-secondary">
          {caption}
        </figcaption>
      </figure>

      {/* Full-Size Lightbox Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Figure ${figureNumber}: ${title}`}
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-3 backdrop-blur-sm sm:p-6"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border-strong bg-surface shadow-palette"
          >
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-canvas/80 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink-primary">
                    Figure {figureNumber}
                  </span>
                  {citation && (
                    <span className="font-mono text-[11px] text-ink-muted">
                      {citation}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm font-semibold text-ink-primary">
                  {title}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNativeZoom((prev) => !prev)}
                  aria-pressed={isNativeZoom}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:border-border-strong hover:bg-subtle hover:text-ink-primary"
                >
                  {isNativeZoom ? (
                    <>
                      <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Fit width</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Native size ({width}×{height})</span>
                    </>
                  )}
                </button>

                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:border-border-strong hover:bg-subtle hover:text-ink-primary"
                >
                  <span>Open image</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close full-size figure"
                  className="inline-flex items-center gap-1.5 rounded-md border border-accent bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-ink transition-opacity hover:opacity-90"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Scrollable Lightbox Canvas */}
            <div className="flex-1 overflow-auto bg-canvas p-3 sm:p-5">
              <div
                className={`mx-auto rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 sm:p-4 ${
                  isNativeZoom ? 'w-max' : 'w-full'
                }`}
              >
                <Image
                  src={src}
                  alt={`Figure ${figureNumber}: ${title} — ${caption}`}
                  width={width}
                  height={height}
                  unoptimized
                  className={
                    isNativeZoom
                      ? 'h-auto max-w-none rounded'
                      : 'h-auto w-full rounded object-contain'
                  }
                />
              </div>
            </div>

            {/* Modal Footer Caption */}
            <div className="border-t border-border bg-canvas/80 px-4 py-2.5 text-xs text-ink-secondary">
              {caption}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HandbookFigure;
