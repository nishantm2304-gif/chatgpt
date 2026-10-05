'use client';

import React, { useState, useMemo } from 'react';
import { mockConversations, type Conversation } from '@/lib/mockdocs';
import ConversationCard from './ConversationCard';
import HistoryFilters from './HistoryFilters';
import HistoryEmptyState from './HistoryEmptyState';
import DeleteConfirmModal from './DeleteConfirmModal';
import { History } from 'lucide-react';

export default function ChatHistoryContent() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'most-messages'>('recent');
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...conversations];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    } else if (sortBy === 'most-messages') {
      result.sort((a, b) => b.messageCount - a.messageCount);
    }

    return result;
  }, [conversations, search, sortBy]);

  const handleDeleteRequest = (conv: Conversation) => {
    setDeleteTarget(conv);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setTimeout(() => {
      setConversations((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeletingId(null);
    }, 300);
  };

  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div className="flex-shrink-0 border-b border-border px-4 py-4 pl-14 bg-background/80 backdrop-blur-sm sm:px-6 sm:pl-14 lg:px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <History size={18} className="text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Chat History</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} ·{' '}
                {totalMessages} total messages
              </p>
            </div>

            {/* Stats row */}
            <div className="hidden md:flex items-center gap-4">
              <StatPill
                label="This week"
                value={conversations
                  .filter((c) => {
                    const d = new Date(c.updatedAt);
                    const now = new Date();
                    return now.getTime() - d.getTime() < 7 * 86400000;
                  })
                  .length.toString()}
              />
              <StatPill label="Total messages" value={totalMessages.toString()} />
              <StatPill label="Model" value="GPT-4" accent />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <HistoryFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filtered.length}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-screen-2xl mx-auto px-4 py-5 sm:px-6 sm:py-6">
          {filtered.length === 0 ? (
            <HistoryEmptyState hasSearch={search.trim().length > 0} onClear={() => setSearch('')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filtered.map((conv) => (
                <ConversationCard
                  key={conv.id}
                  conversation={conv}
                  isDeleting={deletingId === conv.id}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          conversationTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-semibold font-mono-data ${accent ? 'text-primary' : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  );
}
