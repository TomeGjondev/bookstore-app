# Repository Guidelines

## Project Structure & Module Organization

This is a React 19, TypeScript, and Vite storefront backed by Firebase. Application composition and routes live in `src/app/`. Organize domain code under `src/features/<domain>/`; each feature may contain pages, components, context, services, types, and colocated tests. Reusable layout and routing components belong in `src/components/`, shared hooks in `src/hooks/`, Firebase setup in `src/lib/firebase/`, and global Tailwind tokens/styles in `src/styles/globals.css`. Static assets are stored in `public/`. Firebase rules and indexes remain at the repository root, while emulator tests live in `tests/rules/`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies.
- `npm run dev` starts the Vite development server.
- `npm run build` type-checks with `tsc` and creates the production bundle.
- `npm run lint` checks TypeScript and React code with ESLint.
- `npm test` runs colocated Vitest unit tests once; `npm run test:watch` reruns them during development.
- `npm run test:rules` starts Firestore and Storage emulators and runs security-rule tests. The Firebase CLI must be available.
- `npm run quality` runs linting, unit tests, and the production build; use it before opening a pull request.

## Coding Style & Naming Conventions

Follow the existing style: two-space indentation, single quotes, no semicolons, and trailing commas in multiline structures. TypeScript is strict; avoid `any` and keep Firebase access behind typed `*.service.ts` modules. Use PascalCase for components and pages (`BookDetailPage.tsx`), `useCamelCase` for hooks, camelCase for functions, and descriptive suffixes such as `.context.tsx`, `.types.ts`, and `.test.ts`. Preserve accessibility patterns, including visible focus states, keyboard behavior, and reduced-motion support.

## Testing Guidelines

Vitest discovers `src/**/*.test.ts`; place tests beside the logic they cover. Prefer deterministic tests for reducers, utilities, validation, and state transitions. Security tests belong in `tests/rules/**/*.test.ts` and must exercise the local emulators. There is no enforced coverage threshold, but new behavior and bug fixes should include focused regression tests.

## Commit & Pull Request Guidelines

The current history is too small to establish a convention. Use concise, imperative commits such as `Add catalog price filter`, keeping unrelated changes separate. Pull requests should summarize the user-visible change, note tests run, link relevant issues, and include screenshots for UI changes. Call out Firebase rule, index, or environment-variable changes explicitly.

## Security & Configuration

Copy `.env.example` to `.env.local` and provide `VITE_FIREBASE_*` values; never commit credentials. UI route guards are not authorization—enforce protected operations in `firestore.rules` and `storage.rules`, then verify them with emulator tests.
