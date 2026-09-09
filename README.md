# FIT30 AI — Original UI migrated to Next.js

This package is a clean Next.js/JavaScript migration of the uploaded `fitness-ui` project.

## What was preserved

- Original FitAI HTML structure and visual classes
- Original `style.css`
- Original page flow
- Original onboarding pages
- Original dashboard/workout/food scanner/progress pages
- Original button/link destinations, converted to Next.js routes
- Original option-card selection behavior
- Original smooth anchor scrolling
- Original fade-in behavior, made reliable with IntersectionObserver

## Routes

- `/`
- `/login`
- `/onboarding`
- `/basic-info`
- `/goal`
- `/fitness-level`
- `/time`
- `/equipment`
- `/food`
- `/safety`
- `/photo`
- `/analysis`
- `/dashboard`
- `/food-scanner`
- `/workout`
- `/progress`

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build test

```bash
npm run build
npm start
```

## Git

```bash
git init
git add .
git commit -m "migrate FitAI UI to Next.js"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Vercel

Import the GitHub repository into Vercel. Framework detection should select Next.js automatically.

## Important

This is the UI migration stage. Authentication, MongoDB, Express APIs, real AI food analysis, real user data, payments, and production storage are intentionally not connected yet.
