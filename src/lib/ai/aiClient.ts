export async function callAIEndpoint(endpoint: string, payload: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let details = '';
    try {
      const err = await response.json();
      details = err.details || err.error || '';
    } catch {
      details = response.statusText;
    }
    // console.error('API Route Error:', { error: `HTTP ${response.status}`, details });
    throw new Error(details || `Request failed with status ${response.status}`);
  }

  return response;
}
