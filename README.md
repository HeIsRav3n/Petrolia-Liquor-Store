# Petrolia Liquor Store

A modern Next.js 15 e-commerce storefront for Petrolia Liquor Store, featuring a custom dark/ash theme, client-side cart management, responsive design, and product catalog synced from a Shopify export.

## Features

- **Next.js App Router**: Utilizing the latest Next.js 15 features.
- **Tailwind CSS v4**: Modern styling with custom utility classes and variables.
- **Dark Theme**: A custom "ashy/dim" theme toggle.
- **Product Catalog**: Full product listing with filtering by categories (Beer, Wine, Whisky, etc.).
- **Shopping Cart**: Client-side cart using React Context and `localStorage`.
- **Checkout Flow**: Simple email-based checkout intent.
- **Admin Dashboard**: A secure portal (`/admin-portal-x9k2`) for viewing catalog data.
- **Responsive Animations**: Custom SVG animations (martini pour, drunk stickman).

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API
- **Testing:** Vitest & React Testing Library
- **Icons/Animations:** Custom SVGs

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run test`: Runs the Vitest test suite.

## Data Management

Products are served via a custom API route (`/api/products`) which reads from a local JSON database generated from a legacy Shopify CSV export.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Release Quality Gates

This repo includes release workflows and a checklist for:
- code review
- security audit
- automated tests
- performance test
- UI/UX QA
- documentation check
- CI/CD setup
- monitoring setup
- staging deployment
- production launch

See `docs/release-checklist.md`.

### Required GitHub Secrets (for deploy workflows)

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
