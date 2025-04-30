# Component Organization

This directory contains all the React components for the Gitlify application, organized according to best practices for a Next.js 15+ project with App Router.

## Directory Structure

```
app/components/
├── ui/             # Reusable UI components (buttons, inputs, etc.)
├── features/       # Feature-specific components grouped by domain
│   ├── auth/       # Authentication related components
│   ├── repository/ # Repository management components
│   └── prd/        # PRD generation and display components
└── layout/         # Layout components (header, footer, etc.)
```

## Usage Guidelines

1. **UI Components**: Generic, reusable components that don't contain business logic

   - Import from: `@/app/components/ui/Button`
   - Example: buttons, inputs, cards, modals

2. **Feature Components**: Components specific to a feature or domain

   - Import from: `@/app/components/features/repository/RepositoryList`
   - Contains business logic and may use multiple UI components

3. **Layout Components**: Components that define the structure of the application
   - Import from: `@/app/components/layout/Header`
   - Example: headers, footers, sidebars, navigation

## Migration Status

We're currently in the process of migrating from the old structure (separate `components/` directory at the root level) to this new structure. For now, the old components are still available, but you should use the new imports going forward.
