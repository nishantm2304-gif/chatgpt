'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

type SortOption = 'recent' | 'oldest' | 'most-messages';

interface HistoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  resultCount: number;
}

export default function HistoryFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  resultCount,
}: HistoryFiltersProps) {
  return (
    <div className="flex-shrink-0 border-b border-border bg-card/30 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search conversations</span>
          <Search
            aria-hidden="true"
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations..."
            className="h-10 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </label>

        <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal aria-hidden="true" size={14} />
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </span>
          <label className="min-w-0">
            <span className="sr-only">Sort conversations</span>
            <select
              value={sortBy}
              onChange={(event) => {
                const value = event.target.value;
                if (value === 'recent' || value === 'oldest' || value === 'most-messages') {
                  onSortChange(value);
                }
              }}
              className="h-10 max-w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
              <option value="most-messages">Most messages</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
