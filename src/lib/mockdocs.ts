import React, { useEffect } from 'react';
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  model: string;
  messageCount: number;
  preview: string;
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    title: 'React useEffect cleanup functions',
    createdAt: '2026-09-07T08:15:00Z',
    updatedAt: '2026-09-07T08:42:00Z',
    model: 'GPT-4',
    messageCount: 8,
    preview: 'Can you explain when and why we need cleanup functions in useEffect?',
    messages: [
      {
        id: 'msg-001-1',
        role: 'user',
        content: 'Can you explain when and why we need cleanup functions in useEffect?',
        timestamp: '2026-09-07T08:15:00Z',
      },
      {
        id: 'msg-001-2',
        role: 'assistant',
        content: `Cleanup functions in \`useEffect\` are essential for preventing memory leaks and unexpected behavior. Here's when you need them:

**When to use cleanup:**
- Event listeners added to \`window\` or DOM elements
- Timers (\`setTimeout\`, \`setInterval\`)
- WebSocket connections
- Subscriptions (RxJS, Redux, etc.)
- Async operations that might update unmounted components

**Example with event listener:**
\`\`\`js
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  
  // Cleanup: remove listener when component unmounts
  return () => window.removeEventListener('resize', handleResize);
}, []);
\`\`\`

Without the cleanup, the event listener persists even after the component unmounts, causing memory leaks and potential errors when the handler tries to update state on an unmounted component.`,
        timestamp: '2026-09-07T08:15:30Z',
        tokensUsed: 187,
      },
      {
        id: 'msg-001-3',
        role: 'user',
        content: 'What about cleanup with async/await inside useEffect?',
        timestamp: '2026-09-07T08:20:00Z',
      },
      {
        id: 'msg-001-4',
        role: 'assistant',
        content: `Great question — async/await in useEffect requires a specific pattern because the cleanup function must be synchronous.

**The pattern:**
\`\`\`js
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const data = await fetchSomething();
    if (!cancelled) {
      setState(data); // Only update if still mounted
    }
  }
  
  fetchData();
  
  return () => {
    cancelled = true; // Flag to prevent state update
  };
}, [dependency]);
\`\`\`

You can also use \`AbortController\` for fetch requests:
\`\`\`js
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setState(data))
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });
    
  return () => controller.abort();
}, []);
\`\`\`

The \`AbortController\` approach is cleaner and cancels the actual network request, not just the state update.`,
        timestamp: '2026-09-07T08:21:00Z',
        tokensUsed: 223,
      },
    ],
  },
  {
    id: 'conv-002',
    title: 'Python vs Rust for CLI tools',
    createdAt: '2026-09-06T14:30:00Z',
    updatedAt: '2026-09-06T15:10:00Z',
    model: 'GPT-4',
    messageCount: 6,
    preview: 'I want to build a fast CLI tool. Should I use Python or Rust?',
    messages: [
      {
        id: 'msg-002-1',
        role: 'user',
        content: 'I want to build a fast CLI tool. Should I use Python or Rust?',
        timestamp: '2026-09-06T14:30:00Z',
      },
      {
        id: 'msg-002-2',
        role: 'assistant',
        content: `It depends on your priorities. Here's a clear breakdown:

**Choose Python if:**
- Rapid development matters more than raw speed
- The tool does I/O-bound work (file processing, API calls)
- You want easy distribution via \`pip\`
- You're comfortable with ~100ms startup time
- Libraries like \`click\`, \`typer\`, or \`argparse\` cover your needs

**Choose Rust if:**
- Startup time must be <10ms (e.g., shell completions, hooks)
- CPU-intensive work (parsing, encoding, compression)
- You want a single binary with no runtime dependency
- Memory usage is a concern
- Long-term maintenance by multiple contributors

**Real-world examples:**
- \`ripgrep\`, \`fd\`, \`bat\` — Rust, because they run on every keypress
- \`aws-cli\`, \`youtube-dl\`, \`httpie\` — Python, because startup cost is acceptable

**My recommendation:** If this is a personal tool you'll run occasionally, Python will ship 5x faster. If it's something invoked hundreds of times per session (like a git hook), Rust's startup time pays off.`,
        timestamp: '2026-09-06T14:31:00Z',
        tokensUsed: 241,
      },
    ],
  },
  {
    id: 'conv-003',
    title: 'Explain transformer architecture simply',
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T10:45:00Z',
    model: 'GPT-4',
    messageCount: 10,
    preview: 'Can you explain how transformers work without too much math?',
    messages: [
      {
        id: 'msg-003-1',
        role: 'user',
        content: 'Can you explain how transformers work without too much math?',
        timestamp: '2026-09-05T10:00:00Z',
      },
      {
        id: 'msg-003-2',
        role: 'assistant',
        content: `Sure! Let me use an analogy that makes the key ideas click.

**The core idea: attention**

Imagine you're reading: *"The bank by the river had steep walls."* To understand"bank," you look at nearby words — "river," "walls," "steep" — and give them different amounts of attention. "River" gets high attention (it disambiguates "bank"), "The" gets almost none.

Transformers do exactly this, but for every word simultaneously, in parallel.

**The three components:**

1. **Self-Attention** — Every token looks at every other token and decides how much to "attend" to it. This is how context flows across long distances.

2. **Feed-Forward Network** — After attention, each token's representation is transformed through a small neural network independently. This is where "knowledge" is stored.

3. **Positional Encoding** — Since attention has no sense of order, we add position information (token 1, token 2...) to the input embeddings.

**Why it beat RNNs:**
- RNNs processed tokens sequentially — slow, and early tokens got "forgotten"
- Transformers process all tokens in parallel — fast, and attention can connect token 1 to token 1000 directly

That's the core intuition. The math (Q/K/V matrices, softmax, layer norm) is just making that attention mechanism efficient and stable.`,
        timestamp: '2026-09-05T10:02:00Z',
        tokensUsed: 298,
      },
    ],
  },
  {
    id: 'conv-004',
    title: 'PostgreSQL query optimization tips',
    createdAt: '2026-09-04T16:20:00Z',
    updatedAt: '2026-09-04T17:05:00Z',
    model: 'GPT-4',
    messageCount: 12,
    preview: 'My PostgreSQL queries are slow. What are the most impactful optimizations?',
    messages: [
      {
        id: 'msg-004-1',
        role: 'user',
        content: 'My PostgreSQL queries are slow. What are the most impactful optimizations?',
        timestamp: '2026-09-04T16:20:00Z',
      },
      {
        id: 'msg-004-2',
        role: 'assistant',
        content: `Here are the highest-impact optimizations, ordered by how often they help:

**1. Add the right indexes**
\`\`\`sql
-- Check what's missing with EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- Add index if you see "Seq Scan"
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
\`\`\`

**2. Use EXPLAIN ANALYZE, not just EXPLAIN**
\`EXPLAIN ANALYZE\` actually runs the query and shows real timing. Look for:
- "Seq Scan" on large tables → needs an index -"Hash Join"vs "Nested Loop" → check row estimates - High"actual rows" vs "rows=X" estimate → stale statistics, run \`ANALYZE\`

**3. Avoid SELECT ***
Fetching unused columns wastes I/O and prevents index-only scans.

**4. Partial indexes for filtered queries**
\`\`\`sql
-- If you always query active users:
CREATE INDEX idx_users_active ON users(email) WHERE status = 'active';
\`\`\`

**5. Connection pooling**
Use PgBouncer. Raw connection overhead is often the real bottleneck.

What does your slow query look like? Share it and I can give specific advice.`,
        timestamp: '2026-09-04T16:21:30Z',
        tokensUsed: 267,
      },
    ],
  },
  {
    id: 'conv-005',
    title: 'Writing a cover letter for senior dev role',
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-03T11:30:00Z',
    model: 'GPT-4',
    messageCount: 4,
    preview: 'Help me write a cover letter for a senior frontend developer position at a startup.',
    messages: [
      {
        id: 'msg-005-1',
        role: 'user',
        content: 'Help me write a cover letter for a senior frontend developer position at a startup.',
        timestamp: '2026-09-03T11:00:00Z',
      },
      {
        id: 'msg-005-2',
        role: 'assistant',
        content: `Here's a strong cover letter template for a senior frontend role at a startup. Customize the bracketed sections:

---

**[Your Name]**
[your.email@domain.com] · [LinkedIn] · [GitHub]

[Date]

Hiring Team at [Company Name]

---

I'm writing to apply for the Senior Frontend Developer role at [Company]. I've spent the last [X] years building fast, accessible, and maintainable web applications — and I'm drawn to [Company] because [specific reason: product you use, mission you believe in, tech stack you're excited about].

At [Previous Company], I led the rebuild of [specific feature/product] using [React/Next.js/etc.], reducing load time by [X%] and improving [metric]. I take ownership of the full frontend lifecycle — from component architecture to CI/CD — and I'm comfortable being the person who figures things out when there's no playbook.

What I bring to a startup specifically:
- Moving fast without accumulating unmanageable debt
- Making good decisions with incomplete information
- Mentoring junior engineers without slowing down delivery
- Caring about the product, not just the code

I'd love to talk about how I can contribute to [Company]'s growth. Happy to share specific examples of past work.

[Your Name]

---

Want me to tailor this further? Share the job description and I'll make it more specific.`,
        timestamp: '2026-09-03T11:01:30Z',
        tokensUsed: 312,
      },
    ],
  },
  {
    id: 'conv-006',
    title: 'Docker Compose for local dev environment',
    createdAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-09-02T09:50:00Z',
    model: 'GPT-4',
    messageCount: 7,
    preview: 'How do I set up a Docker Compose file for a Next.js app with PostgreSQL and Redis?',
    messages: [
      {
        id: 'msg-006-1',
        role: 'user',
        content: 'How do I set up a Docker Compose file for a Next.js app with PostgreSQL and Redis?',
        timestamp: '2026-09-02T09:00:00Z',
      },
      {
        id: 'msg-006-2',
        role: 'assistant',
        content: `Here's a production-ready Docker Compose setup for Next.js + PostgreSQL + Redis:

\`\`\`yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/myapp
      REDIS_URL: redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
\`\`\`

Run with \`docker compose up -d\`. For development, the app volume mount enables hot reload.`,
        timestamp: '2026-09-02T09:02:00Z',
        tokensUsed: 289,
      },
    ],
  },
  {
    id: 'conv-007',
    title: 'Negotiating salary as a developer',
    createdAt: '2026-09-01T13:00:00Z',
    updatedAt: '2026-09-01T13:40:00Z',
    model: 'GPT-4',
    messageCount: 5,
    preview: 'I have a job offer but the salary is lower than expected. How do I negotiate?',
    messages: [
      {
        id: 'msg-007-1',
        role: 'user',
        content: 'I have a job offer but the salary is lower than expected. How do I negotiate?',
        timestamp: '2026-09-01T13:00:00Z',
      },
      {
        id: 'msg-007-2',
        role: 'assistant',
        content: `Negotiating a job offer is expected — most companies build in room for it. Here's how to do it well:

**Step 1: Respond with gratitude and a counter**
Don't just ask "can you do better?" — give a number.

*"Thank you for the offer — I'm genuinely excited about the role. Based on my experience with [X] and market rates for this level, I was expecting something closer to [your number]. Is there flexibility to get there?"*

**Step 2: Anchor higher than your target**
If you want ₹24L, ask for ₹26L. This gives them room to "negotiate" while you still hit your goal.

**Step 3: Know your leverage**
- Do you have competing offers? Mention them (without bluffing)
- Are you a strong candidate with specialized skills? State that
- Is the role been open for a while? They're motivated to close

**Step 4: If base salary is fixed, negotiate the total package**
- Signing bonus (one-time, often easier to approve)
- Extra vacation days
- Remote flexibility
- Equity or ESOP acceleration
- Learning & development budget

**Step 5: Get it in writing before giving notice**

What's the gap between offer and expectation? I can help you draft the exact message.`,
        timestamp: '2026-09-01T13:01:30Z',
        tokensUsed: 276,
      },
    ],
  },
  {
    id: 'conv-008',
    title: 'Understanding TypeScript generics',
    createdAt: '2026-08-31T15:00:00Z',
    updatedAt: '2026-08-31T15:55:00Z',
    model: 'GPT-4',
    messageCount: 9,
    preview: 'TypeScript generics confuse me. Can you explain them with practical examples?',
    messages: [
      {
        id: 'msg-008-1',
        role: 'user',
        content: 'TypeScript generics confuse me. Can you explain them with practical examples?',
        timestamp: '2026-08-31T15:00:00Z',
      },
      {
        id: 'msg-008-2',
        role: 'assistant',
        content: `Generics are TypeScript's way of writing reusable code that works with multiple types while still being type-safe. Think of them as type parameters.

**The simplest example:**
\`\`\`ts
// Without generics — only works with strings
function first(arr: string[]): string {
  return arr[0];
}

// With generics — works with any array type
function first<T>(arr: T[]): T {
  return arr[0];
}

const num = first([1, 2, 3]);      // TypeScript knows: num is number
const str = first(['a', 'b', 'c']); // TypeScript knows: str is string
\`\`\`

**Practical: A typed API response wrapper**
\`\`\`ts
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

// Now TypeScript knows response.data is a User
const response = await fetchUser('123');
console.log(response.data.name); // ✓ autocomplete works
\`\`\`

**Constraints with \`extends\`:**
\`\`\`ts
// T must have an id property
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
\`\`\`

Does this help? What specific use case is confusing you?`,
        timestamp: '2026-08-31T15:01:30Z',
        tokensUsed: 334,
      },
    ],
  },
];

export const suggestedPrompts = [
  { id: 'prompt-1', text: 'Explain how async/await works in JavaScript', category: 'Code' },
  { id: 'prompt-2', text: 'Write a Python script to rename files in bulk', category: 'Code' },
  { id: 'prompt-3', text: 'What are the best practices for REST API design?', category: 'Design' },
  { id: 'prompt-4', text: 'Help me debug this React component re-render issue', category: 'Debug' },
  { id: 'prompt-5', text: 'Summarize the key differences between SQL and NoSQL', category: 'Learn' },
  { id: 'prompt-6', text: 'Write unit tests for a TypeScript utility function', category: 'Code' },
];