# Tempo — Intentional Work Planner

A Sunsama-inspired intentional work planning app built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma ORM v7
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand (UI) + TanStack Query (server)
- **DnD**: @dnd-kit
- **Dates**: date-fns

## Getting Started

```bash
npm install
npx prisma dev          # starts local Prisma PostgreSQL
npx prisma migrate dev  # run migrations
npx prisma db seed      # seed sample data
npm run dev             # start dev server on localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── (app)/          # authenticated app routes
│   │   ├── board/      # kanban board view
│   │   ├── calendar/   # calendar view
│   │   ├── today/      # today focus view
│   │   ├── focus/      # focus mode
│   │   ├── backlog/    # backlog
│   │   ├── rituals/    # daily/weekly planning & review
│   │   └── settings/   # user settings
│   └── api/            # API routes
├── components/
│   ├── board/          # board view components
│   ├── channels/       # channel badge/picker
│   ├── layout/         # sidebar, date nav, right panel
│   ├── tasks/          # task card, form, detail, subtasks
│   └── ui/             # shadcn/ui primitives
├── hooks/              # TanStack Query hooks
├── lib/                # utilities (db, time, workload)
├── providers/          # React context providers
└── stores/             # Zustand stores
```
