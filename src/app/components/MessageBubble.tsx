'use client';

import React, { useState } from 'react';
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { type Message } from '@/lib/mockdocs';

interface MessageBubbleProps {
  message: Message;
}

function formatContent(content: string): React.ReactNode {
  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const lang = lines[0].trim();
      const code = lines.slice(1).join('\n');
      return (
        <CodeBlock key={`codeblock-${i}`} code={code} language={lang} />
      );
    }

    // Process inline markdown
    const processed = part
      .split(/(`[^`]+`)/g)
      .map((segment, j) => {
        if (segment.startsWith('`') && segment.endsWith('`')) {
          return (
            <code key={`inline-code-${i}-${j}`} className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-green-400">
              {segment.slice(1, -1)}
            </code>
          );
        }

        // Bold
        const boldParts = segment.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bp, k) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={`bold-${i}-${j}-${k}`} className="font-semibold text-foreground">{bp.slice(2, -2)}</strong>;
          }
          return <span key={`text-${i}-${j}-${k}`}>{bp}</span>;
        });
      });

    // Split by newlines and render paragraphs
    const paragraphs = part.split('\n\n').filter(Boolean);
    return paragraphs.map((para, pi) => {
      if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split('\n').filter((l) => l.trim());
        return (
          <ul key={`ul-${i}-${pi}`} className="list-disc pl-5 space-y-1 my-2">
            {items.map((item, ii) => (
              <li key={`li-${i}-${pi}-${ii}`} className="text-foreground/90">
                {item.replace(/^[-*]\s/, '')}
              </li>
            ))}
          </ul>
        );
      }

      if (/^\d+\./.test(para)) {
        const items = para.split('\n').filter((l) => l.trim());
        return (
          <ol key={`ol-${i}-${pi}`} className="list-decimal pl-5 space-y-1 my-2">
            {items.map((item, ii) => (
              <li key={`oli-${i}-${pi}-${ii}`} className="text-foreground/90">
                {item.replace(/^\d+\.\s/, '')}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <p key={`para-${i}-${pi}`} className="text-foreground/90 leading-relaxed mb-2 last:mb-0">
          {para.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((seg, si) => {
            if (seg.startsWith('`') && seg.endsWith('`')) {
              return <code key={`ic-${i}-${pi}-${si}`} className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-green-400">{seg.slice(1, -1)}</code>;
            }
            if (seg.startsWith('**') && seg.endsWith('**')) {
              return <strong key={`b-${i}-${pi}-${si}`} className="font-semibold text-foreground">{seg.slice(2, -2)}</strong>;
            }
            return <span key={`s-${i}-${pi}-${si}`}>{seg}</span>;
          })}
        </p>
      );
    });
  });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (isUser) {
    return (
      <div
        className="flex justify-end py-1 message-enter"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="max-w-[75%] group">
          <div className="bg-primary/15 border border-primary/20 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className={`flex items-center justify-end gap-2 mt-1 transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              aria-label="Copy message"
            >
              {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex gap-3 py-1 message-enter"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* AI Avatar */}
      <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className="prose-chat text-sm">
          {formatContent(message.content)}
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-3 mt-2 transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          {message.tokensUsed && (
            <span className="text-xs text-muted-foreground font-mono-data">{message.tokensUsed} tokens</span>
          )}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150 p-1 rounded hover:bg-muted"
              aria-label="Copy response"
            >
              {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
            </button>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors duration-150 p-1 rounded hover:bg-muted"
              aria-label="Regenerate response"
            >
              <RotateCcw size={13} />
            </button>
            <button
              className="text-muted-foreground hover:text-green-400 transition-colors duration-150 p-1 rounded hover:bg-muted"
              aria-label="Good response"
            >
              <ThumbsUp size={13} />
            </button>
            <button
              className="text-muted-foreground hover:text-red-400 transition-colors duration-150 p-1 rounded hover:bg-muted"
              aria-label="Bad response"
            >
              <ThumbsDown size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Code Block ──────────────────────────────────────────────────────────────

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-border bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono font-medium">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          {copied ? (
            <>
              <Check size={12} className="text-primary" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto scrollbar-thin">
        <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}