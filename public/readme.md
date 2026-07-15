# Privacy-First Multimodal AI Workspace

An offline-first, privacy-first AI workspace that runs core LLM inference locally in the browser using on-device AI.

## What I built
A browser-based workspace with:
- Local chat using WebLLM
- Vision-to-prompt workflow for image-assisted prompting
- Local session/history management
- Privacy-first UX with minimal cloud dependence

## Why it matters
Most AI tools send private data to remote servers.
This project shows how useful AI workflows can run locally in the browser, improving privacy, resilience, and offline usability after initial model setup.

## How it works
1. The user initializes a browser-supported local model.
2. Chat inference runs in-browser using WebLLM.
3. The Vision panel prepares image-derived prompts.
4. Chat refines those prompts into summaries, explanations, or pitch-ready outputs.
5. Session/history is stored locally for demo purposes.

## How it uses On-Device AI
- Model inference runs in the browser with WebGPU/WebLLM.
- Core chat interactions work locally after the model is downloaded.
- The app is designed as an offline-first AI experience.
- User prompts do not require a remote inference server for the main chat flow.

## Features
- Browser-local LLM chat
- Offline-first workflow
- Privacy-first interaction model
- Simple multimodal prompt pipeline
- Local session/history storage

## Tech stack
- Next.js
- TypeScript
- Tailwind CSS
- WebLLM
- Prisma + SQLite

## How to run
### Prerequisites
- Node.js 18+
- Chrome or Edge with WebGPU support

### Setup
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Usage
1. Open Chat and initialize a local model.
2. Go to Vision and upload an image.
3. Prepare or inject the prompt into chat.
4. Ask for a summary, explanation, or pitch.
5. Review saved session history.

## Demo video
Add your video link here.

## Screenshots
Add screenshots here with captions.

## Limitations
- First model load requires download time.
- Current vision flow is prompt-assisted rather than full pixel-grounded multimodal reasoning.
- Best experience is in Chrome or Edge with WebGPU.

## Future improvements
- Real local image captioning model
- Stronger image understanding
- Better offline asset caching
- Export/share workflows

## License
MIT