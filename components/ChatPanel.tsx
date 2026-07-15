'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import * as webllm from '@mlc-ai/web-llm';
import type { AppMessage } from '@/lib/types';

function chooseDefaultModel() {
  const modelIds = webllm.prebuiltAppConfig.model_list.map(
    (item: any) => item.model_id
  );

  return (
    modelIds.find((id: string) => /1B|2B|3B|Phi|Gemma/i.test(id)) ||
    modelIds[0] ||
    ''
  );
}

type ChatPanelProps = {
  sessionId?: string | null;
  messages: AppMessage[];
  setMessages: Dispatch<SetStateAction<AppMessage[]>>;
  onDataChanged: () => Promise<void> | void;
  injectedPrompt: string;
  onInjectedPromptConsumed: () => void;
};

export function ChatPanel({
  sessionId,
  messages,
  setMessages,
  onDataChanged,
  injectedPrompt,
  onInjectedPromptConsumed,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [status, setStatus] = useState(
    'Pick a browser-supported model and initialize it.'
  );
  const [selectedModel, setSelectedModel] = useState(chooseDefaultModel());

  const engineRef = useRef<webllm.MLCEngine | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const modelIds = useMemo(
    () => webllm.prebuiltAppConfig.model_list.map((item: any) => item.model_id),
    []
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (injectedPrompt) {
      setInput((prev) => (prev ? `${prev}\n\n${injectedPrompt}` : injectedPrompt));
      onInjectedPromptConsumed();
    }
  }, [injectedPrompt, onInjectedPromptConsumed]);

  async function persistMessage(role: 'user' | 'assistant', content: string) {
    if (!sessionId || !content.trim()) return;

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, role, content }),
    });
  }

  async function initializeModel() {
    if (!selectedModel) return;

    setBusy(true);
    setStatus('Initializing model...');

    try {
      const engine = new webllm.MLCEngine({
        initProgressCallback: (progress: any) => {
          const text = progress?.text || 'Loading';
          const percent = progress?.progress
            ? ` ${Math.round(progress.progress * 100)}%`
            : '';
          setStatus(`${text}${percent}`);
        },
      });

      await engine.reload(selectedModel);
      engineRef.current = engine;
      setEngineReady(true);
      setStatus(`Model ready: ${selectedModel}`);
    } catch (error: any) {
      engineRef.current = null;
      setEngineReady(false);
      setStatus(
        error?.message ||
          'Model initialization failed. Make sure Chrome or Edge has WebGPU enabled.'
      );
    } finally {
      setBusy(false);
    }
  }

  function makeMessage(role: AppMessage['role'], content: string): AppMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

  async function handleSend() {
  const engine = engineRef.current;

  if (!engine || !engineReady || busy || !input.trim()) return;

  const userText = input.trim();
  setBusy(true);
  setStatus('Generating response...');

  try {
    const nextMessages: AppMessage[] = [
      ...messages,
      makeMessage('user', userText),
    ];

    setMessages(nextMessages);
    setInput('');

    if (sessionId) {
      await persistMessage('user', userText);
    }

    const reply = await engine.chat.completions.create({
      messages: nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const rawContent = reply?.choices?.[0]?.message?.content;

    let assistantText = '';
    if (typeof rawContent === 'string') {
      assistantText = rawContent;
    } else if (Array.isArray(rawContent)) {
      assistantText = rawContent
        .map((part: any) => (typeof part === 'string' ? part : (part?.text ?? '')))
        .join('');
    } else {
      assistantText = String(rawContent ?? '');
    }

    if (!assistantText.trim()) {
      assistantText = 'No response generated.';
    }

    const finalMessages: AppMessage[] = [
      ...nextMessages,
      makeMessage('assistant', assistantText),
    ];

    setMessages(finalMessages);

    if (sessionId) {
      await persistMessage('assistant', assistantText);
      await onDataChanged();
    }

    setStatus('Response ready.');
  } catch (error: any) {
    console.error('Send failed:', error);

    const errorMessage = makeMessage(
      'assistant',
      error?.message || 'Something went wrong while generating the reply.'
    );

    setMessages([...messages, errorMessage]);
    setStatus(error?.message || 'Send failed.');
  } finally {
    setBusy(false);
  }
}

  return (
    <div className="glass rounded-3xl p-4 sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-slate-700/40 bg-slate-900/50 p-4">
          <h2 className="text-lg font-semibold text-white">Local LLM</h2>
          <p className="mt-2 text-sm text-slate-300">
            The selected model runs in your browser. First load can take time
            because the model must download and cache locally.
          </p>

          <label className="mt-4 block text-sm text-slate-300">Model</label>

          <select
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {modelIds.map((modelId) => (
              <option key={modelId} value={modelId}>
                {modelId}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={initializeModel}
            disabled={busy}
            className="mt-4 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {engineReady ? 'Reload model' : 'Initialize model'}
          </button>

          <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-950/80 p-3 text-xs text-slate-300">
            <p className="font-medium text-white">Status</p>
            <p className="mt-2 whitespace-pre-wrap break-words">{status}</p>
          </div>
        </div>

        <div className="flex min-h-[620px] flex-col rounded-3xl border border-slate-700/40 bg-slate-950/45">
          <div className="border-b border-slate-700/50 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Chat</h2>
            <p className="text-sm text-slate-400">
              Saved into local SQLite history for your demo.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-700 p-6 text-slate-400">
                Start with a prompt like:{' '}
                <span className="text-slate-200">
                  Summarize this image caption into a hackathon pitch.
                </span>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-4 text-sm ${
                    message.role === 'user'
                      ? 'ml-auto max-w-[85%] bg-violet-500/20 text-violet-100'
                      : 'mr-auto max-w-[85%] bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {message.role}
                  </p>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-700/50 px-4 py-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              placeholder="Ask something private, local, and useful..."
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                Use Chrome or Edge for the best WebGPU support.
              </p>

              <button
                type="button"
                onClick={handleSend}
                disabled={!engineReady || busy || !input.trim()}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? 'Working...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}