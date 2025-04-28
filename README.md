This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Components

### ApiKeySection

The `ApiKeySection` component is a reusable component that provides a consistent UI for displaying and managing API keys throughout the application. It is used in both the main dashboard and homepage.

Features:

- Displays API keys in a table format
- Shows/hides full API key values
- Provides copy-to-clipboard functionality
- Supports key management actions (create, edit, delete)
- Displays appropriate loading and empty states
- Optional breadcrumbs for navigation context

Props:

- `apiKeys`: Array of API key objects
- `isLoading`: Boolean indicating if keys are loading
- `onCreateKey`: Function to handle creating a new key
- `onEditKey`: Optional function to handle editing a key
- `onDeleteKey`: Optional function to handle deleting a key
- `showBreadcrumbs`: Boolean to control breadcrumb display (default: false)
- `title`: String for section title (default: "API Keys")

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
