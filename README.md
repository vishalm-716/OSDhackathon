# Aura Local AI Workspace

Privacy-first multimodal AI workspace for OSDHack 2026.

## What this starter includes

- Next.js 14 App Router UI
- Tailwind CSS styling
- WebLLM browser-local chat
- Transformers.js image captioning
- ONNX Runtime Web diagnostics panel
- Prisma + SQLite session history
- Simple PWA manifest + service worker
- MIT license

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Chrome or Edge with WebGPU support for the best local LLM experience

## Setup

1. Copy `.env.example` to `.env`
2. Install packages
3. Create the SQLite database and Prisma client
4. Start development server

## Commands

```bash
npm install
copy .env.example .env
npx prisma migrate dev --name init
npm run dev
```

On macOS/Linux, use:

```bash
cp .env.example .env
```

Open `http://localhost:3000`.

## Important notes

- SQLite does not need a password, host, or port.
- The database is a local file at `prisma/dev.db`.
- WebLLM downloads the chosen model on first use and then reuses browser cache.
- Transformers.js also downloads the vision model on first use.
- For hackathon demo, say clearly that the AI inference stays on-device in the browser.

## Suggested demo script

1. Start the app.
2. Create a new session.
3. In Chat, initialize a small WebLLM model.
4. In Vision, upload an image and generate a caption.
5. Send the caption to chat.
6. Ask the model to create a project pitch, poster text, or social caption.
7. Show session history in the History tab.

## Possible extension ideas

- Add speech-to-text
- Add webcam object detection
- Add local document OCR
- Add export to markdown or PDF

## License

MIT

## Screenshots

### Chat page
![Chat page](chat%20page.png)

### Copy to chat
![Copy to chat](copy%20to%20chat.png)

### Vision page
![Vision page](vision%20page.png)