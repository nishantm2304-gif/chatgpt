'use client';

import React from 'react';
import Link from 'next/link';
import { History, MessageSquare, Search } from 'lucide-react';

interface HistoryEmptyStateProps {
  hasSearch: boolean;
  onClear: () => void;
}

export default function HistoryEmptyState({ hasSearch, onClear }: HistoryEmptyStateProps) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mb-4">
          <Search size={20} className="text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">No conversations match your search</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
          Try a different keyword or clear the search to see all conversations.
        </p>
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm text-foreground font-medium transition-colors duration-150 active:scale-95 border border-border"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <History size={24} className="text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No conversations yet</h3>
      <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm">
        Your chat history will appear here. Start a conversation with GPT-4 and it will be saved automatically.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-accent text-primary-foreground text-sm font-semibold transition-colors duration-150 active:scale-95"
      >
        <MessageSquare size={15} />
        Start your first chat
      </Link>
    </div>
  );
}