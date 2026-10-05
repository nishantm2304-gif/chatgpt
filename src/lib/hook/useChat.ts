'use client';

import { useState, useCallback, useRef } from 'react';
import { getStreamingChatCompletion, getChatCompletion, ChatMessage } from '../ai/chatCompletion';

export function useChat(provider: string, model: string, streaming: boolean) {
  const [response, setResponse] = useState('');
  const [fullResponse, setFullResponse] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const accumulatedRef = useRef('');

  const sendMessage = useCallback(
    async (messages: ChatMessage[], parameters: Record<string, unknown> = {}) => {
      setIsLoading(true);
      setError(null);
      setResponse('');
      setFullResponse(null);
      accumulatedRef.current = '';

      try {
        if (streaming) {
          const chunks: unknown[] = [];
          await getStreamingChatCompletion(
            provider,
            model,
            messages,
            (chunk) => {
              chunks.push(chunk);
              const delta = (chunk as { choices?: Array<{ delta?: { content?: string } }> })
                ?.choices?.[0]?.delta?.content ?? '';
              accumulatedRef.current += delta;
              setResponse(accumulatedRef.current);
            },
            () => {
              setFullResponse(chunks);
              setIsLoading(false);
            },
            (err) => {
              setError(err);
              setIsLoading(false);
            },
            parameters
          );
        } else {
          const result = await getChatCompletion(provider, model, messages, parameters);
          const content = result?.choices?.[0]?.message?.content ?? '';
          setResponse(content);
          setFullResponse(result);
          setIsLoading(false);
        }
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setIsLoading(false);
      }
    },
    [provider, model, streaming]
  );

  return { response, fullResponse, isLoading, error, sendMessage };
}
