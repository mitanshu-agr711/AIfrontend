# AI Interview Platform Frontend

A polished Next.js application for preparing, running, and reviewing AI-powered interviews. The interface is designed like a modern product experience, with guided flows, motion, workspaces, and feedback views that help users move from practice to review without friction.

## What It Does

- Create and manage interview workspaces.
- Launch AI-driven interview sessions with voice interaction.
- Review completion summaries, analytics, and feedback.
- Share workspaces publicly through token-based links.
- Support auth flows for register, reset password, and silent session restore.

## Highlights

- Animated landing experience with auth entry points.
- Workspace dashboard for creating, renaming, deleting, and sharing workspaces.
- Live interview session flow with timer, speech input, bot responses, and completion handling.
- Interview completion and feedback pages for performance summaries and recent attempts.
- Public shared workspace views for external access.
- Responsive UI built with Tailwind CSS, Chakra UI, Redux Toolkit, Zustand, and motion libraries.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Chakra UI
- Redux Toolkit
- Zustand
- Vapi voice SDK

## Main Routes

- `/` - landing page
- `/home` - main home experience
- `/register` - authentication entry
- `/reset-password` - password reset flow
- `/workspace` - workspace dashboard
- `/workspace/[id]` - workspace details and interview list
- `/workspace/shared/[token]` - public shared workspace view
- `/interview/[id]` - live interview session
- `/interview-complete` - completion summary
- `/feedback` - interview analytics and feedback
- `/shared/[token]` - shared public route

## Getting Started

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## Environment Variables

Create a `.env` file in `aifrontend` and set the API and Vapi token values:

```dotenv
NEXT_PUBLIC_API=https://your-backend-url
NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-token
```

For local development, point `NEXT_PUBLIC_API` to your backend, for example `http://localhost:5000`.

## Project Structure

- `src/app/(routes)` contains the user-facing pages.
- `src/components` contains shared UI components and animations.
- `src/lib` contains API and utility helpers.
- `src/stores` contains client state management.

## Notes

- The app uses the Next.js App Router.
- Shared workspaces use token-based public access.
- Interview completion and feedback views rely on backend analytics responses.

## Deployment

This project can be deployed like any standard Next.js app. Make sure the production environment has the correct `NEXT_PUBLIC_API` and `NEXT_PUBLIC_VAPI_WEB_TOKEN` values configured.
