'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Send, Square, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  disabled: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isStreaming,
  onStop,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && value.trim()) {
        onSend(value);
        onChange('');
      }
    }
  };

  const handleSend = () => {
    if (!isStreaming && value.trim()) {
      onSend(value);
      onChange('');
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-sm px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex min-w-0 items-end gap-2 rounded-2xl border border-border bg-input px-3 py-3 transition-all duration-150 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 sm:px-4">
          {/* Attachment button */}
          <button
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-150 mb-0.5"
            aria-label="Attach file"
            disabled
          >
            <Paperclip size={18} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatAI…"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed min-h-[24px] max-h-[200px] scrollbar-thin"
            rows={1}
            disabled={disabled}
          />

          <div className="flex items-center gap-1.5 flex-shrink-0 mb-0.5">
            <button
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              aria-label="Voice input"
              disabled
            >
              <Mic size={18} />
            </button>

            {isStreaming ? (
              <button
                onClick={onStop}
                className="w-8 h-8 rounded-lg bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center text-foreground transition-all duration-150 active:scale-95"
                aria-label="Stop generating"
              >
                <Square size={14} className="fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-primary hover:bg-accent text-primary-foreground"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">
          GPT-4 · Conversations saved locally · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
