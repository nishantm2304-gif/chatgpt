import { callAIEndpoint } from './aiClient';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'developer';
  content: string | unknown[];
}

export async function getChatCompletion(
  provider: string,
  model: string,
  messages: ChatMessage[],
  parameters: Record<string, unknown> = {}
) {
  const response = await callAIEndpoint('/api/ai/chat', {
    provider,
    model,
    messages,
    stream: false,
    parameters,
  });
  return response.json();
}

export async function getStreamingChatCompletion(
  provider: string,
  model: string,
  messages: ChatMessage[],
  onChunk: (chunk: unknown) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  parameters: Record<string, unknown> = {}
) {
  try {
    const response = await callAIEndpoint('/api/ai/chat', {
      provider,
      model,
      messages,
      stream: true,
      parameters,
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';
    let completed = false;

    const processLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) return;
      const data = trimmed.slice(5).trim();
      if (!data) return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'chunk') onChunk(parsed.chunk);
        if (parsed.type === 'done' && !completed) {
          completed = true;
          onComplete();
        }
        if (parsed.type === 'error') onError(new Error(parsed.error || 'Stream error'));
      } catch {
        // Skip malformed events so one bad chunk does not end the response.
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      lines.forEach(processLine);
    }

    if (buffer) processLine(buffer);
    if (!completed) onComplete();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
