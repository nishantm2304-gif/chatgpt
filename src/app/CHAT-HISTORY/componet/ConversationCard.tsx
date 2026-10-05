'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, MessageSquare, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { type Conversation } from '@/lib/mockdocs';

interface ConversationCardProps {
  conversation: Conversation;
  isDeleting: boolean;
  onDelete: (conv: Conversation) => void;
}

export default function ConversationCard({
  conversation,
  isDeleting,
  onDelete,
}: ConversationCardProps) {
  const [hovered, setHovered] = useState(false);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) {
      return (
        'Today ' +
        d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div
      className={`conversation-card group relative flex flex-col border border-border rounded-xl bg-card transition-all duration-300 overflow-hidden ${
        isDeleting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
      } ${hovered ? 'border-primary/30 bg-card/80 shadow-lg shadow-black/20' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={14} className="text-primary" />
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(conversation);
            }}
            className={`conversation-delete p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Delete conversation"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground leading-tight mb-2 line-clamp-2">
          {conversation.title}
        </h3>

        {/* Preview */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {conversation.preview}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} />
            <span>{formatDate(conversation.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare size={11} />
            <span className="font-mono-data">{conversation.messageCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
            <Sparkles size={10} className="text-primary" />
            <span className="text-xs text-primary font-medium">{conversation.model}</span>
          </div>
        </div>
      </div>

      {/* Resume Button — appears on hover */}
      <div
        className={`conversation-resume absolute bottom-0 left-0 right-0 transition-all duration-200 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
      >
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-accent transition-colors duration-150 active:scale-95"
          >
            Resume conversation
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Hover overlay for resume */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-primary/20" />
      )}
    </div>
  );
}
