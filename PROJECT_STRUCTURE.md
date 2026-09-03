# Saplings

Saplings is an AI-powered study tool that turns pasted notes or lecture PDFs into a structured topic tree. Students can explore each collapsible branch, study source-grounded flashcards in a flip-card view, and export cards for a selected subtopic.

## Technology

- React for the interface
- TypeScript for typed application code
- Vite for local development and production builds
- PDF.js for browser-side PDF text extraction

## Project structure

```text
src/
  app/          Application shell and future routes
  components/   Reusable interface pieces
    tree/       Collapsible topic-tree components
    flashcards/ Flashcard and flip-card components
    layout/     Navigation and page layout
    ui/         Small shared UI primitives
  features/     User workflows
    import/     Notes and PDF upload/import flow
    topics/     Topic-tree exploration and selection
    study/      Flashcard review and export flow
  services/     AI, PDF processing, and API integrations
  store/        Shared client-side state
  types/        Shared TypeScript models
  hooks/        Reusable React hooks
  lib/          Utilities and constants
server/
  app.py        FastAPI endpoint that keeps the Gemini key server-side
```

## Setup completed

- Added a Vite + React + TypeScript entry point and configuration.
- Built the first neo-brutalist green/yellow import page and global stylesheet.
- Added PDF selection, in-browser document preview, and client-side text extraction.
- The extracted text is held in page state, ready for the future AI topic-generation service.
- Added `.gitignore` rules for dependencies, builds, local environment files, logs, and editor files.
- Preserved `main.js` as the existing starter file; the application entry is `src/main.tsx`.

## Current import flow

1. Student chooses a PDF in the top import section.
2. The browser previews that PDF in the section below.
3. The PDF parser extracts text from every page.
4. The interface reports the character count ready for AI.

## Topic tree and flashcards

- The Generate button sends extracted text to the local Gemini API endpoint.
- Gemini returns a nested topic/flashcard JSON tree.
- The tree supports expandable branches, hover card previews, and click-to-open flashcards.
- Flashcard arrows appear when a selected topic has more than one card.

## Run locally

- Run npm run dev:api to start the Gemini backend on port 8000.
- Run npm run dev in another terminal to start the React interface.

## Main Files We Would Be Working On 

Main files you’ll work in:
- src/app/App.tsx — main page layout and navigation
- src/features/import/ — paste notes / PDF upload
- src/features/topics/ — generate and manage the collapsible topic tree
- src/features/study/ — flashcard review and export flow
- src/components/tree/ — visual tree UI
- src/components/flashcards/ — flip-card UI
- src/services/ — PDF parsing and AI API calls
- src/types/ — Topic, Flashcard, and document data types
Start with src/app/App.tsx, then build components/tree/ and components/flashcards/.
