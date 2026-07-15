'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChatPanel } from '@/components/ChatPanel';
import { VisionPanel } from '@/components/VisionPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { StatusBar } from '@/components/StatusBar';
import type { AppMessage, AppSession } from '@/lib/types';
type TabKey = 'chat' | 'vision' | 'history';

export default function Workspace() {
  const [tab, setTab] = useState<TabKey>('chat');
  const [sessions, setSessions] = useState<AppSession[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [captionBridge, setCaptionBridge] = useState('');

  const currentSession = useMemo(
    () => sessions.find((item) => item.id === sessionId),
    [sessionId, sessions]
  );

  async function loadSessions(nextSessionId?: string) {
    const response = await fetch('/api/sessions');
    const data: AppSession[] = await response.json();
    setSessions(data);
    if (nextSessionId) setSessionId(nextSessionId);
    else if (!sessionId && data[0]) setSessionId(data[0].id);
  }

  async function loadMessages(id: string) {
    if (!id) return;
    const response = await fetch(`/api/messages?sessionId=${id}`);
    const data = await response.json();
    setMessages(
      data.map((item: any) => ({
        id: item.id,
        role: item.role,
        content: item.content,
        createdAt: item.createdAt
      }))
    );
  }

  async function createSession() {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New workspace session' })
    });
    const data = await response.json();
    await loadSessions(data.id);
    setMessages([]);
    setTab('chat');
  }

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (sessionId) loadMessages(sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (captionBridge) setTab('chat');
  }, [captionBridge]);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <section className="glass overflow-hidden rounded-3xl shadow-soft">
        <div className="border-b border-slate-700/40 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-violet-300">Aura Local AI Workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Privacy-first multimodal AI, fully on your device.
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">
                Chat with a browser LLM, caption images locally, store session history in SQLite, and demo an offline-first product for OSDHack.
              </p>
            </div>
            <button
              onClick={createSession}
              className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              New session
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {['chat', 'vision', 'history'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item as TabKey)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    tab === item ? 'bg-white text-slate-900' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            {tab === 'chat' && (
              <ChatPanel
                sessionId={sessionId}
                messages={messages}
                setMessages={setMessages}
                onDataChanged={() => loadSessions(sessionId)}
                injectedPrompt={captionBridge}
                onInjectedPromptConsumed={() => setCaptionBridge('')}
              />
            )}

            {tab === 'vision' && <VisionPanel onUseCaption={(value) => setCaptionBridge(value)} />}

            {tab === 'history' && (
              <HistoryPanel
                sessions={sessions}
                activeSessionId={sessionId}
                onSelect={(id) => {
                  setSessionId(id);
                  setTab('chat');
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <StatusBar currentSession={currentSession} messageCount={messages.length} />

            <div className="glass rounded-3xl p-5">
              <h2 className="text-lg font-semibold text-white">How to demo</h2>
              <ol className="mt-3 space-y-3 text-sm text-slate-300">
                <li>1. Open Chat, pick a model, and click Initialize Model.</li>
                <li>2. Upload an image in Vision and generate a caption locally.</li>
                <li>3. Send the caption to chat and ask for a summary, poster text, or explanation.</li>
                <li>4. Turn off internet after the first model download to highlight browser caching and privacy.</li>
              </ol>
            </div>

            <div className="glass rounded-3xl p-5">
              <h2 className="text-lg font-semibold text-white">No passwords needed</h2>
              <p className="mt-3 text-sm text-slate-300">
                This starter uses Prisma with SQLite, so there is no database host, port, username, or password. The data is stored in a local file at prisma/dev.db.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}