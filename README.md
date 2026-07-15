# Aura Local AI Workspace

Privacy-first multimodal AI workspace for OSDHack 2026. Aura lets users chat with a local browser LLM, analyze images on-device, and save session history without sending prompts or images to a cloud AI backend.

## Features

- Browser-local chat powered by WebLLM
- On-device image captioning with Transformers.js
- Privacy-first workflow with local inference in the browser
- Session history using Prisma + SQLite
- Diagnostics panel for ONNX Runtime Web
- PWA-ready interface built with Next.js 14 and Tailwind CSS

## Tech Stack

- Next.js 14 App Router
- Tailwind CSS
- WebLLM
- Transformers.js
- ONNX Runtime Web
- Prisma
- SQLite

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Chrome or Edge with WebGPU support for the best local LLM experience

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies
3. Create the SQLite database and Prisma client
4. Start the development server

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

## How it works

Aura combines browser-based language and vision models into a single workspace. WebLLM handles local text generation, Transformers.js handles image captioning, and Prisma + SQLite store session history on the local machine.

For the hackathon demo, the key point is that prompts and images stay on-device during inference instead of being sent to a remote AI API.

## Demo flow

1. Start the app.
2. Create a new session.
3. In Chat, initialize a WebLLM model.
4. In Vision, upload an image and generate a caption.
5. Send the caption to chat.
6. Ask the model to create a pitch, poster text, or social caption.
7. Show saved session history in the History tab.

## Important notes

- SQLite does not need a password, host, or port.
- The database is stored locally at `prisma/dev.db`.
- WebLLM downloads the selected model on first use and reuses browser cache afterward.
- Transformers.js also downloads the vision model on first use.

## Possible extensions

- Speech-to-text
- Webcam object detection
- Local document OCR
- Export to Markdown or PDF

## Screenshots

### Chat page
![Chat page](chat%20page.png)

### Copy to chat
![Copy to chat](copy%20to%20chat.png)

### Vision page
![Vision page](vision%20page.png)

## License

MIT
