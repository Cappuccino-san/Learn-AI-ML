export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading module content"
      className="mx-auto w-full max-w-5xl space-y-8 px-6 py-8"
    >
      <span className="sr-only">Loading module content...</span>

      {/* Header Skeleton */}
      <header className="space-y-4 border-b border-border pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-28 animate-pulse rounded-md bg-subtle" />
          <div className="h-7 w-24 animate-pulse rounded-md bg-subtle" />
        </div>
        <div className="space-y-2.5">
          <div className="h-8 w-72 max-w-full animate-pulse rounded-md bg-border/75 sm:w-96" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-subtle" />
          <div className="h-4 w-2/3 max-w-xl animate-pulse rounded bg-subtle" />
        </div>
      </header>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="h-9 w-full animate-pulse rounded-md border border-border bg-surface sm:w-64" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-8 w-20 animate-pulse rounded-md bg-subtle" />
          <div className="h-8 w-24 animate-pulse rounded-md bg-subtle" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-subtle" />
          <div className="h-8 w-28 animate-pulse rounded-md bg-subtle" />
        </div>
      </div>

      {/* Card Grid Skeleton */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div
            key={card}
            className="space-y-3 rounded-lg border border-border bg-surface p-5 shadow-subtle"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 w-24 animate-pulse rounded bg-subtle" />
              <div className="h-5 w-12 animate-pulse rounded-full bg-subtle" />
            </div>
            <div className="h-5 w-4/5 animate-pulse rounded bg-border/70" />
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-full animate-pulse rounded bg-subtle" />
              <div className="h-3.5 w-5/6 animate-pulse rounded bg-subtle" />
            </div>
          </div>
        ))}
      </section>

      {/* Table / Row List Skeleton */}
      <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-subtle">
        <div className="flex items-center justify-between border-b border-border bg-subtle/60 px-5 py-3">
          <div className="h-4 w-40 animate-pulse rounded bg-border/70" />
          <div className="h-4 w-20 animate-pulse rounded bg-subtle" />
        </div>
        <div className="divide-y divide-border">
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-56 max-w-full animate-pulse rounded bg-border/70" />
                <div className="h-3.5 w-80 max-w-full animate-pulse rounded bg-subtle" />
              </div>
              <div className="h-6 w-20 shrink-0 animate-pulse rounded-md bg-subtle" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
