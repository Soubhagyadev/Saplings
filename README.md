<div align="center">

# SAPLINGS

**Turn lecture PDFs into a navigable knowledge tree and source-grounded flashcards — powered by Gemini AI.**

<br/>

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## What it does

Saplings takes a lecture PDF, extracts the text in the browser, and sends it to a Gemini-powered backend. The AI returns a structured topic tree. Each branch is collapsible, hoverable for a card preview, and clickable to open a full flashcard study session. Every card in the tree can be exported as an Anki-ready CSV in one click.

---

## Features

- **PDF import** — drag and drop or browse, with an in-browser preview
- **AI topic tree** — Gemini generates a nested, collapsible knowledge map from your source
- **Flashcard study** — flip-card modal with keyboard navigation and view count tracking
- **Anki export** — download all cards as a UTF-8 CSV ready to import into Anki
- **Persistent progress** — card view counts saved to localStorage across sessions
- **Responsive** — works on desktop and mobile

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Custom CSS, neo-brutalist design system |
| PDF parsing | pdfjs-dist (client-side, no server needed) |
| AI backend | Google Gemini via FastAPI (local) / Vercel Serverless (production) |
| Deployment | Vercel |

---

## Project structure

```
Saplings/
├── api/
│   ├── generate-tree.py       # Vercel serverless function (Gemini integration)
│   └── requirements.txt       # Python dependencies for the serverless function
├── server/
│   └── app.py                 # FastAPI server for local development
├── src/
│   ├── app/
│   │   └── App.tsx            # Main application shell and state
│   ├── components/
│   │   ├── tree/
│   │   │   └── TopicTree.tsx  # Recursive collapsible topic tree
│   │   └── flashcards/
│   │       └── FlashcardModal.tsx  # Flip-card study modal
│   ├── services/
│   │   ├── parsePdf.ts        # Client-side PDF text extraction
│   │   ├── studyTree.ts       # API call to generate topic tree
│   │   └── exportAnki.ts      # Anki CSV export
│   ├── types/
│   │   └── study.ts           # TopicNode and Flashcard types
│   ├── main.tsx               # React entry point
│   └── styles.css             # Global stylesheet
├── vercel.json                # Vercel deployment config
├── vite.config.ts             # Vite config with local API proxy
├── package.json
└── requirements.txt           # Python dependencies for local dev
```

---

## Running locally

You need Node.js and Python 3.10+ installed.

**1. Install dependencies**

```bash
npm install
pip install -r requirements.txt
```

**2. Set up your Gemini API key**

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

**3. Start the backend**

```bash
npm run dev:api
```

This starts the FastAPI server on `http://localhost:8000`.

**4. Start the frontend**

In a separate terminal:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deploying to Vercel

1. Push the repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add the environment variable `GEMINI_API_KEY` in the Vercel dashboard
4. Deploy — Vercel handles the frontend build and Python serverless function automatically

---

## How it works

```
User uploads PDF
      |
      v
pdfjs-dist extracts text in the browser
      |
      v
POST /api/generate-tree  (text sent to Gemini)
      |
      v
Gemini returns structured JSON topic tree
      |
      v
React renders collapsible tree with flashcard previews
      |
      v
User studies cards / exports to Anki
```

---

## License

MIT

---

<div align="center">
  Built with focus and strong coffee.
</div>
