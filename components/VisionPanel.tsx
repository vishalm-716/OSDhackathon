'use client';

import { useEffect, useMemo, useState } from 'react';

type VisionPanelProps = {
  onUseCaption?: (value: string) => void;
};

export function VisionPanel({ onUseCaption }: VisionPanelProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(
    'Upload an image and prepare a prompt for local AI analysis.'
  );

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const finalPrompt = useMemo(() => {
    if (!caption) return '';
    return (
      `You are helping with a privacy-first multimodal AI demo.\n\n` +
      `Image details:\n${caption}\n\n` +
      `Now write:\n` +
      `1. A likely caption for the image.\n` +
      `2. A more detailed description.\n` +
      `3. Any visible text if present.\n` +
      `4. A short hackathon-style explanation of how this image could be analyzed locally on-device.\n\n` +
      `Be honest about uncertainty.`
    );
  }, [caption]);

  function handleFileChange(file: File | null) {
    if (!file) return;

    if (imageUrl) URL.revokeObjectURL(imageUrl);

    const localUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImageUrl(localUrl);
    setCaption('');
    setStatus('Image ready. Click Prepare prompt.');
  }

  async function generateCaption() {
    if (!imageFile) {
      setStatus('Please upload an image first.');
      return;
    }

    setBusy(true);
    setStatus('Preparing prompt from the uploaded image...');

    try {
      const kb = Math.max(1, Math.round(imageFile.size / 1024));
      const fallbackCaption =
        `User uploaded an image named "${imageFile.name}" (${kb} KB). ` +
        `Create a careful visual description, mention likely objects, scene context, any visible text, and possible use cases. ` +
        `State uncertainty clearly where needed.`;

      setCaption(fallbackCaption);
      setStatus('Prompt ready. You can copy it or send it to Chat.');
    } catch (error: any) {
      console.error(error);
      setStatus(error?.message || 'Failed to prepare prompt.');
    } finally {
      setBusy(false);
    }
  }

  async function copyPrompt() {
    if (!finalPrompt) {
      setStatus('Prepare the prompt first.');
      return;
    }

    try {
      await navigator.clipboard.writeText(finalPrompt);
      setStatus('Prompt copied. Paste it into Chat manually if needed.');
    } catch {
      setStatus('Clipboard copy failed. Select the prompt text below and copy manually.');
    }
  }

  function sendToChat() {
    if (!finalPrompt) {
      setStatus('Prepare the prompt first.');
      return;
    }

    onUseCaption?.(finalPrompt);
    setStatus('Prompt sent to Chat input. If Chat Send still fails, use Copy Prompt.');
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="glass rounded-3xl p-5">
        <h2 className="text-lg font-semibold text-white">Vision workspace</h2>
        <p className="mt-2 text-sm text-slate-300">
          Upload an image, prepare a safe prompt, then copy it or pass it to Chat.
        </p>

        <label className="mt-4 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-600 bg-slate-950/60 p-6 text-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
          <span className="text-sm text-slate-200">Click to upload an image</span>
          <span className="mt-2 text-xs text-slate-400">JPEG, PNG, or WEBP works best.</span>
        </label>

        {imageUrl && (
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950/50 p-3">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-[360px] w-full rounded-2xl object-contain"
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={generateCaption}
            disabled={!imageFile || busy}
            className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Preparing...' : 'Prepare prompt'}
          </button>

          <button
            type="button"
            onClick={sendToChat}
            disabled={!finalPrompt || busy}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Put in chat
          </button>

          <button
            type="button"
            onClick={copyPrompt}
            disabled={!finalPrompt || busy}
            className="rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy prompt
          </button>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">Status</p>
          <p className="mt-2 whitespace-pre-wrap break-words">{status}</p>
        </div>

        <div className="mt-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Prepared Prompt</p>
          <textarea
            value={finalPrompt}
            readOnly
            rows={10}
            className="mt-3 w-full rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-4 text-sm text-slate-100 outline-none"
            placeholder="Your prepared prompt will appear here."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-3xl p-5">
          <h2 className="text-lg font-semibold text-white">How to use</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-300">
            <li>1. Upload image.</li>
            <li>2. Click Prepare prompt.</li>
            <li>3. Click Put in chat or Copy prompt.</li>
            <li>4. If Chat Send still fails, paste the copied prompt manually for the demo.</li>
          </ul>
        </div>

        <div className="glass rounded-3xl p-5">
          <h2 className="text-lg font-semibold text-white">Why this helps</h2>
          <p className="mt-3 text-sm text-slate-300">
            This keeps the Vision workflow demo-ready even if the Chat panel still needs a separate fix.
          </p>
        </div>
      </div>
    </div>
  );
}