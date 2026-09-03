# Saplings

Saplings is an AI-powered study tool that turns pasted notes or lecture PDFs into a structured topic tree. Students can explore each collapsible branch, study source-grounded flashcards in a flip-card view, and export cards for a selected subtopic.

## Technology

- React for the interface
- TypeScript for typed application code
- Vite for local development and production builds

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
```

## Setup completed

- Added a Vite + React + TypeScript entry point and configuration.
- Added a minimal `App` component and global stylesheet.
- Added `.gitignore` rules for dependencies, builds, local environment files, logs, and editor files.
- Preserved `main.js` as the existing starter file; the application entry is `src/main.tsx`.

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
