'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Message, type Conversation } from '@/lib/mockdocs';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import EmptyChatState from './EmptyChatState';
import StreamingBubble from './StreamingBubble';
import ConversationHeader from './ConversationHeader';
import { useChat } from '@/lib/hook/useChat';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'chatai_conversations';
const SYSTEM_MESSAGE = { role: 'system' as const, content: 'You are a helpful AI assistant.' };

function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch {
    // storage full or unavailable
  }
}

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingConvIdRef = useRef<string | null>(null);

  const { response, isLoading, error, sendMessage } = useChat('GROQ', 'openai/gpt-oss-120b', true);

  // Load from localStorage on mount
  useEffect(() => {
    setConversations(loadConversations());
  }, []);

  // Show toast on error
  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, response, scrollToBottom]);

  // When streaming completes, save assistant message
  useEffect(() => {
    if (!isLoading && response && pendingConvIdRef.current) {
      const convId = pendingConvIdRef.current;
      const assistantMsg: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) => {
        let updated = prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages.filter((m) => m.role !== 'assistant' || m.id !== 'streaming'), assistantMsg],
                messageCount: c.messageCount + 1,
                updatedAt: new Date().toISOString(),
              }
            : c
        );
        saveConversations(updated);
        return updated;
      });
      pendingConvIdRef.current = null;
    }
  }, [isLoading, response]);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setInputValue('');
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setInputValue('');
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: Message = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const conversationId = activeConversationId ?? `conv-${Date.now()}`;

      setConversations((prev) => {
        let updated: Conversation[];
        if (!activeConversationId) {
          const title = content.length > 50 ? content.slice(0, 50) + '…' : content;
          const newConv: Conversation = {
            id: conversationId,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            model: 'GPT-4',
            messageCount: 1,
            preview: content,
            messages: [userMsg],
          };
          updated = [newConv, ...prev];
        } else {
          updated = prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, userMsg],
                  messageCount: c.messageCount + 1,
                  updatedAt: new Date().toISOString(),
                }
              : c
          );
        }
        saveConversations(updated);
        return updated;
      });

      if (!activeConversationId) {
        setActiveConversationId(conversationId);
      }

      pendingConvIdRef.current = conversationId;

      // Build messages array for API
      const currentConv = conversations.find((c) => c.id === conversationId);
      const historyMessages = currentConv
        ? currentConv.messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
        : [];

      const apiMessages = [
        SYSTEM_MESSAGE,
        ...historyMessages,
        { role: 'user' as const, content: content.trim() },
      ];

      sendMessage(apiMessages, { max_completion_tokens: 2048 });
      setInputValue('');
    },
    [activeConversationId, isLoading, conversations, sendMessage]
  );

  const handleSuggestedPrompt = useCallback(
    (text: string) => {
      handleSendMessage(text);
    },
    [handleSendMessage]
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        let updated = prev.filter((c) => c.id !== id);
        saveConversations(updated);
        return updated;
      });
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId]
  );

  return (
    <div className="flex h-full">
      {/* Conversation List Panel */}
      <div className="w-64 flex-shrink-0 border-r border-border flex flex-col bg-card/50 hidden lg:flex">
        <div className="px-3 py-3 border-b border-border flex-shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors duration-150 active:scale-95"
          >
            <span className="text-lg leading-none">+</span>
            New conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ConversationHeader
          conversation={activeConversation}
          onNewChat={handleNewChat}
        />

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {!activeConversation ? (
            <EmptyChatState onSelectPrompt={handleSuggestedPrompt} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-1">
              {activeConversation.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <StreamingBubble text={response} onStop={() => {}} />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          isStreaming={isLoading}
          onStop={() => {}}
          disabled={false}
        />
      </div>
    </div>
  );
}

// ─── Conversation List Item ───────────────────────────────────────────────────

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function ConversationListItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ConversationListItemProps) {
  const [hovered, setHovered] = useState(false);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      className={`relative mx-1 my-0.5 rounded-lg cursor-pointer transition-colors duration-150 group ${
        isActive ? 'bg-primary/10' : 'hover:bg-muted/60'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(conversation.id)}
    >
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-medium truncate leading-tight ${
              isActive ? 'text-primary' : 'text-foreground'
            }`}
          >
            {conversation.title}
          </p>
          {hovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation.id);
              }}
              className="flex-shrink-0 text-muted-foreground hover:text-red-400 transition-colors duration-150 mt-0.5"
              aria-label="Delete conversation"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{formatDate(conversation.updatedAt)}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{conversation.messageCount} msgs</span>
        </div>
      </div>
    </div>
  );
}