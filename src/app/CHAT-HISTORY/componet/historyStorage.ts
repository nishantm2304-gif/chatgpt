import type { Conversation } from '@/lib/mockdocs';

export const CHAT_HISTORY_KEY = 'chatai_conversations_v1';
export const CHAT_HISTORY_EVENT = 'chatai-history-updated';

export function getSavedConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversation(conversation: Conversation): void {
  if (typeof window === 'undefined') return;

  const conversations = getSavedConversations();
  const index = conversations.findIndex((item) => item.id === conversation.id);

  if (index >= 0) {
    conversations[index] = conversation;
  } else {
    conversations.unshift(conversation);
  }

  window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversations));
  window.dispatchEvent(new CustomEvent(CHAT_HISTORY_EVENT));
}

export function deleteConversation(id: string): void {
  if (typeof window === 'undefined') return;

  const conversations = getSavedConversations().filter((conversation) => conversation.id !== id);
  window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversations));
  window.dispatchEvent(new CustomEvent(CHAT_HISTORY_EVENT));
}
