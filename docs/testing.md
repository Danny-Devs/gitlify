# Testing Strategy for Gitlify

This document outlines the testing strategy for the Gitlify application, which transforms GitHub repositories into comprehensive Project Requirement Documents (PRDs).

## Overview

We use Jest and React Testing Library for testing the Gitlify application. The testing infrastructure is designed to ensure reliability, maintainability, and extensibility of the codebase.

## Testing Types

### Unit Tests

Unit tests verify that individual components and functions work correctly in isolation. We focus on testing:

- **Service functions**: Repository operations, LLM configurations, etc.
- **Utility functions**: GitHub URL parsing, data transformation, etc.
- **React components**: Individual UI components such as RepositoryCard

### Integration Tests

Integration tests verify that multiple components work together correctly. We focus on testing:

- **Workflow nodes**: Test complete prep → exec → post lifecycle
- **API endpoints**: Test request handling and response formatting
- **Form submissions**: Test form validation and submission handlers

### Component Tests

Component tests verify that React components render correctly and handle user interactions properly. We focus on testing:

- **UI rendering**: Correct display of data
- **User interactions**: Clicking buttons, submitting forms, etc.
- **State changes**: Loading, success, and error states

## Testing Utilities

### Mock Server

We use Mock Service Worker (MSW) to intercept and mock API requests. This allows us to test components and services without actual network requests.

### Test Helpers

We provide utilities in `tests/utils/test-utils.tsx` to simplify test setup:

- **Custom render**: Renders components with necessary providers (auth, theme)
- **Mock data**: Common test fixtures for repositories, LLM responses, etc.

## Test Organization

Tests are organized to mirror the project structure:

```
/tests
  /components        # Tests for React components
    /repository
    /prd
    /common
  /services          # Tests for server functions
    /repository
    /llm
    /workflow
  /lib               # Tests for utility functions
    /github
    /llm
  /api               # Tests for API routes
  /utils             # Test utilities
  /mocks             # Test fixtures and mock data
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run validation (lint + type-check + test)
npm run validate
```

## Testing Principles

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Follow the AAA pattern**: Arrange, Act, Assert
3. **Keep tests small and focused**: Test one behavior per test
4. **Use meaningful test names**: Describe what is being tested
5. **Mock external dependencies**: Use MSW for API requests, Jest mocks for libraries
6. **Test edge cases**: Handle empty states, errors, loading states
7. **Test accessibility**: Ensure components meet accessibility standards

## Coverage Goals

We aim for:

- **80%** statement coverage
- **70%** branch coverage
- **90%** coverage for critical components and services:
  - Repository service
  - LLM integration
  - Workflow nodes
  - PRD generation

## Continuous Integration

Tests run on every pull request and merge to main branch through our CI pipeline. The pipeline performs:

1. Linting
2. Type checking
3. Running tests with coverage report

## Notes

- **Server Components**: Testing server components requires special considerations due to Next.js App Router architecture
- **Authentication**: Tests use mocked authentication sessions to simulate authenticated users
- **Database**: Tests use mocked Prisma client to avoid actual database operations
