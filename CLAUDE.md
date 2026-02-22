# Tempo — Claude Code Guide

## What This Project Is

A Sunsama-inspired intentional work planning app called Tempo. Features multiple views (today, board, calendar, focus mode, backlog, rituals, settings) with drag-and-drop task management.

GitHub: https://github.com/sabrinacarmona/sunsama-clone

## Running the Project

Run these in order — the database must be running before the dev server:

1. `npm install`
2. `npx prisma dev` (starts local Prisma PostgreSQL)
3. `npx prisma migrate dev` (run migrations)
4. `npx prisma db seed` (seed sample data — first time only)
5. `npm run dev` (start dev server at http://localhost:3000)

## Tech Stack

- Framework: Next.js 16 (App Router, TypeScript)
- Database: PostgreSQL via Prisma ORM v7
- Styling: Tailwind CSS v4 + shadcn/ui components
- State: Zustand (UI state) + TanStack Query (server/async state)
- Drag and drop: @dnd-kit
- Dates: date-fns
- Package manager: npm

## Coding Standards

- TypeScript throughout — no any types
- Tailwind CSS v4 for all styling — no inline style attributes or separate CSS files
- Use shadcn/ui primitives from src/components/ui/ before building custom UI
- Server components by default; use "use client" only when needed
- TanStack Query for all data fetching — do not fetch in useEffect
- Zustand for UI-only state — do not put server data into Zustand stores
- Keep components small and single-purpose

## Critical Rules

### Protect What Already Works

- Read the relevant existing files before making any changes
- Make targeted, surgical edits — do not refactor files unrelated to the current task
- Extend existing components rather than rewriting them
- Run npm run build after significant changes to catch type errors early

### Keep Solutions Simple

- Implement the simplest solution that solves the problem
- Do not add new npm dependencies without asking first
- Do not create new abstractions or utilities unless immediately needed by multiple files
- One component, one job

### Database Changes

- Always update the Prisma schema before writing code that depends on new fields
- Run npx prisma migrate dev --name description after schema changes
- Never manually edit the database — use migrations only

### Adding New Features

- Confirm the approach in plain English before writing any code
- If a change touches more than 2-3 files, outline the plan first and wait for approval

## What to Ask Before Doing

- Adding any new npm dependency
- Changing the folder or file structure
- Modifying the Prisma schema significantly
- Any change that touches the layout, sidebar, or routing
- Rewriting a component that is already working

## Known Gotchas

- The database must be running before npm run dev — Prisma will throw connection errors otherwise
- Tailwind v4 syntax differs from v3 — check existing usage patterns before adding new utility classes
- shadcn/ui components live in src/components/ui/ — always check there before building a custom component
