import type { AppSession } from '@/lib/types';

export function HistoryPanel({
  sessions,
  activeSessionId,
  onSelect
}: {
  sessions: AppSession[];
  activeSessionId: string;
  onSelect: (id: string) => void;
}) {
  if (!sessions.length) {
    return (
      <div className="glass rounded-3xl p-6 text-sm text-slate-300">
        No saved sessions yet. Click <span className="font-semibold text-white">New session</span> to begin.
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-4 flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold text-white">Saved history</h2>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">SQLite</p>
      </div>
      <div className="space-y-3">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
              session.id === activeSessionId
                ? 'border-violet-400 bg-violet-500/10'
                : 'border-slate-700/50 bg-slate-900/50 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{session.title}</p>
                <p className="mt-1 text-xs text-slate-400">Updated {new Date(session.updatedAt).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {session._count?.messages ?? 0} msgs
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
