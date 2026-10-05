'use client';

import React from 'react';
import { MessageSquare, Plus, Sparkles } from 'lucide-react';
import { type Conversation } from '@/lib/mockdocs';

interface ConversationHeaderProps {
  conversation: Conversation | null;
  onNewChat: () => void;
}

export default function ConversationHeader({ conversation, onNewChat }: ConversationHeaderProps) {
  return (
    <div className="flex-shrink-0 h-14 border-b border-border flex items-center pl-14 pr-3 sm:px-4 gap-2 sm:gap-3 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <MessageSquare size={16} className="text-muted-foreground flex-shrink-0" />
        <h1 className="text-sm font-medium text-foreground truncate">
          {conversation ? conversation.title : 'New Conversation'}
        </h1>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border">
          <Sparkles size={12} className="text-primary" />
          <span className="text-xs text-muted-foreground font-medium">GPT-4</span>
        </div>
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 border border-border active:scale-95"
        >
          <Plus size={13} />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>
    </div>
  );
}