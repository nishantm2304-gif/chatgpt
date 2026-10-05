'use client';

import React from 'react';
import { Sparkles, Code2, FileText, Lightbulb, Bug } from 'lucide-react';
import { suggestedPrompts } from '@/lib/mockdocs';
import Icon from '@/components/ui/AppIcon';


interface EmptyChatStateProps {
  onSelectPrompt: (text: string) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Code: Code2,
  Design: FileText,
  Debug: Bug,
  Learn: Lightbulb,
};

export default function EmptyChatState({ onSelectPrompt }: EmptyChatStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-16 max-w-2xl mx-auto">
      {/* Logo mark */}
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Sparkles size={24} className="text-primary" />
      </div>

      <h2 className="text-2xl font-semibold text-foreground mb-2 text-balance text-center">
        What can I help you with?
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-10 max-w-sm">
        Powered by GPT-4. Ask me anything — code, writing, analysis, or just a conversation.
      </p>

      {/* Suggested prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
        {suggestedPrompts.map((prompt) => {
          const Icon = categoryIcons[prompt.category] ?? Lightbulb;
          return (
            <button
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt.text)}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-border/80 text-left transition-all duration-150 active:scale-98 group"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={14} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground leading-snug line-clamp-2 group-hover:text-foreground">
                  {prompt.text}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">{prompt.category}</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-10 text-center">
        Conversations are saved locally in your browser
      </p>
    </div>
  );
}