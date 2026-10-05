'use client';

import React, { useState } from 'react';
import { Square } from 'lucide-react';

interface StreamingBubbleProps {
  text: string;
  onStop: () => void;
}

export default function StreamingBubble({ text, onStop }: StreamingBubbleProps) {
  return (
    <div className="flex gap-3 py-1 message-enter">
      {/* AI Avatar */}
      <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex-1 min-w-0 max-w-[85%]">
        {text ? (
          <div className="prose-chat text-sm">
            <p className="text-foreground/90 leading-relaxed streaming-cursor whitespace-pre-wrap">
              {text}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 py-2">
            <div className="dot-pulse flex gap-1">
              <span />
              <span />
              <span />
            </div>
            <span className="text-xs text-muted-foreground ml-2">GPT-4 is thinking…</span>
          </div>
        )}

        {/* Stop button */}
        <button
          onClick={onStop}
          className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 active:scale-95"
        >
          <Square size={11} className="fill-current" />
          Stop generating
        </button>
      </div>
    </div>
  );
}