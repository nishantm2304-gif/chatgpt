import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, model, messages, stream = false, parameters = {} } = body;

    if (!provider || !model || !messages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your-groq-api-key-here') {
      return NextResponse.json({ error: 'Groq API key not configured. Please add your GROQ_API_KEY.' }, { status: 500 });
    }

    const requestBody = {
      model,
      messages,
      stream,
      ...parameters,
    };

    if (stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });

            if (!groqResponse.ok || !groqResponse.body) {
              const errorText = await groqResponse.text();
              throw new Error(`Groq API error (${groqResponse.status}): ${errorText}`);
            }

            controller.enqueue(encoder.encode('data: {"type":"start"}\n\n'));

            const reader = groqResponse.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() ?? '';

              for (const line of lines) {
                const data = line.trim().replace(/^data:\s*/, '');
                if (!data || data === '[DONE]') continue;
                const chunk = JSON.parse(data);
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'chunk', chunk })}\n\n`)
                );
              }
            }

            controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
            controller.close();
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`)
            );
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } else {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await groqResponse.json();
      if (!groqResponse.ok) {
        return NextResponse.json(
          { error: `Groq API error (${groqResponse.status})`, details: result?.error?.message || result },
          { status: groqResponse.status }
        );
      }

      return NextResponse.json(result);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('API Route Error:', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
