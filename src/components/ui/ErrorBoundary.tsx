'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
  onReset?: () => void;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const title = this.props.title ?? 'Something went wrong in this view';
    const errorMessage =
      this.state.error?.message?.trim() ||
      'An unexpected rendering error occurred.';

    return (
      <div
        role="alert"
        className={`rounded-lg border border-border bg-surface p-6 shadow-subtle ${
          this.props.className ?? ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-subtle text-ink-secondary">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-ink-primary">
                {title}
              </h2>
              <p className="text-xs text-ink-muted">
                The error was isolated to this section so your saved progress
                remains intact.
              </p>
            </div>

            <div className="rounded-md border border-border bg-subtle px-3 py-2 font-mono text-xs text-ink-secondary break-words">
              {errorMessage}
            </div>

            <div>
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink-primary shadow-subtle transition-colors hover:bg-subtle hover:border-ink-muted active:bg-border/60 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
