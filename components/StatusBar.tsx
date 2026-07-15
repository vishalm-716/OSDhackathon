import type { AppSession } from '@/lib/types';

export function StatusBar({
  currentSession,
  messageCount
}: {
  currentSession?: AppSession;
  messageCount: number;
}) {
  const cards = [
    { label: 'Current Session', value: currentSession?.title || 'Create or load a session' },
    { label: 'Saved Messages', value: String(messageCount) },
    { label: 'Inference Mode', value: 'Browser-local only' },
    { label: 'Database', value: 'SQLite + Prisma' }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <div key={card.label} className="glass rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
          <p className="mt-3 text-base font-medium text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
