# Torba Frontend

Frontend for the Torba marketplace. The backend will be a separate Python project.

| Resource   | Link                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Design     | [Marketplace — Torba](https://www.figma.com/design/imQzlvJcm0EMhvUqr3kQFZ/Marketplace--torba?node-id=0-1&m=dev&t=qPg6j28l1Yd7lLL2-1) |
| Repository | [https://github.com/torba-marketplace/torba-marketplace](https://github.com/torba-marketplace/torba-marketplace)                                                     |

## What you need

- Node.js 20 or newer
- npm (included with Node.js)

This project uses **npm** to install packages and run project scripts. `npx` runs a tool once; for normal development use the npm scripts below.

## Start the project

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

| Command              | What it does                       |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the local development server |
| `npm run build`      | Create a production build          |
| `npm start`          | Run the production build           |
| `npm run lint`       | Check code style                   |
| `npm test`           | Run tests once                     |
| `npm run test:watch` | Run tests while editing            |
| `npm run format`     | Format project files               |

## Project folders

```text
public/                  Images and icons used by the site
src/
  app/                   Pages and routes (Next.js App Router)
  components/            Reusable interface pieces, including home-page UI
  config/                Site settings, categories, and locations
  data/                  Sample data shown before the API is ready
  i18n/                  Ukrainian and English translations
  lib/                   Small helper functions used across the site
  types/                 TypeScript types used by the frontend
tests/                   Tests grouped by the code they cover
```

Start with `src/app` to find a page. Put interface pieces in `src/components`, settings in `src/config`, sample content in `src/data`, and helper functions in `src/lib`.

All tests live in `tests/`, grouped into matching folders such as `tests/components`, `tests/config`, and `tests/lib`.

## Stack

- Next.js and React
- TypeScript
- Tailwind CSS
- react-i18next (Ukrainian / English)
- Vitest
- npm

## Backend

The Python API is not part of this repository. When it is available, set `NEXT_PUBLIC_API_URL` in `.env.local` to its URL. The example value is documented in `.env.example`.

## Git workflow

- `dev` is the integration branch for ongoing development.
- `main` is reserved for the finished, release-ready project. Do not develop directly on `main` or use it as the base for feature branches.
- Create one branch per Jira ticket, starting from the latest `dev`.
- Open a pull request from your ticket branch into `dev`. A release is merged from `dev` into `main` when it is ready.

Before starting each ticket, update `dev` and create a branch from it:

```powershell
git switch dev
git pull origin dev
git switch -c feature/zetan-01-8-home-page
```

Choose the branch prefix to match the type of work:

| Work type                         | Branch prefix     | Example                                 |
| --------------------------------- | ----------------- | --------------------------------------- |
| New feature or behavior           | `feature/`        | `feature/zetan-01-8-home-page`          |
| Bug fix                           | `fix/`            | `fix/zetan-01-9-cart-overlay`           |
| Refactor without behavior changes | `refactor/`       | `refactor/zetan-01-10-simplify-header`  |
| Tests                             | `test/`           | `test/zetan-01-11-catalog-filters`      |
| Documentation                     | `docs/`           | `docs/zetan-01-12-update-readme`        |
| Tooling or maintenance            | `chore/`          | `chore/zetan-01-13-update-dependencies` |
| CI or build configuration         | `ci/` or `build/` | `ci/zetan-01-14-checks`                 |

Use the Jira ticket key and a short description in lowercase English, with words separated by hyphens and no spaces. Pick the prefix that best describes the main purpose of the ticket.

Implement designs only from the Figma **Ready for Dev** tab. When the ticket is complete, push the branch and open a pull request into `dev` for review. Then wait for approval; the team lead reviews and merges the PR. Do not merge your own PR:

```powershell
git push -u origin HEAD
```
