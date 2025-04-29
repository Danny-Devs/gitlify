# Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the Gist of Git application. A robust testing approach is essential to ensure the application works reliably across different environments, especially given the complex integrations with GitHub and local LLM instances.

## Testing Principles

1. **Test-Driven Development**: Write tests before implementing features
2. **Comprehensive Coverage**: Test across all layers of the application
3. **Automation First**: Automate tests wherever possible
4. **Realistic Scenarios**: Design tests that simulate real user behavior
5. **Continuous Testing**: Run tests as part of CI/CD pipeline

## Test Types

### Unit Tests

Unit tests verify that individual components work as expected in isolation.

**Key Areas for Unit Testing:**

- Service functions
- Utility functions
- React components
- API route handlers
- Database models and queries

**Technology:**

- Jest as the test runner
- React Testing Library for component tests
- Mock Service Worker for API mocking

**Example Unit Test:**

```typescript
// Testing an API service function
describe('createApiKey', () => {
  it('should create a new API key for an authenticated user', async () => {
    // Arrange
    const mockUser = { id: 'user-id', name: 'Test User' };
    const mockNewKeyData = { name: 'Test Key', type: 'dev' };
    const mockPrisma = mockPrismaClient();
    mockPrisma.apiKey.create.mockResolvedValue({
      id: 'key-id',
      name: 'Test Key',
      keyValue: 'test-key-value',
      userId: 'user-id',
      scopes: ['dev'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Act
    const result = await createApiKey(mockNewKeyData, mockUser, mockPrisma);

    // Assert
    expect(mockPrisma.apiKey.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Test Key',
        userId: 'user-id',
        scopes: ['dev']
      })
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: 'key-id',
        name: 'Test Key',
        key: 'test-key-value'
      })
    );
  });
});
```

### Integration Tests

Integration tests verify that different components work together correctly.

**Key Areas for Integration Testing:**

- API endpoints with database interactions
- User authentication flows
- GitHub API integration
- LLM connectivity and processing

**Technology:**

- Jest with Supertest for API testing
- Test database environment
- Mock external services (GitHub API, LLM services)

**Example Integration Test:**

```typescript
// Testing an API endpoint
describe('POST /api/repositories', () => {
  it('should add a repository and return repository details', async () => {
    // Arrange
    const repoUrl = 'https://github.com/owner/repo';
    await setupTestUser();

    // Mock GitHub API response
    mockGitHubApi.getRepository.mockResolvedValue({
      name: 'repo',
      owner: { login: 'owner' },
      html_url: repoUrl
    });

    // Act
    const response = await request(app)
      .post('/api/repositories')
      .set('Authorization', `Bearer ${testApiKey}`)
      .send({ url: repoUrl });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        url: repoUrl,
        name: 'repo',
        owner: 'owner'
      })
    );

    // Verify database record was created
    const dbRecord = await prisma.repository.findFirst({
      where: { url: repoUrl }
    });
    expect(dbRecord).not.toBeNull();
  });
});
```

### End-to-End Tests

E2E tests verify complete user flows and interact with the application as a user would.

**Key User Flows to Test:**

- User registration and login
- Repository addition and analysis
- Template creation and application
- LLM configuration
- Viewing and exploring analysis results

**Technology:**

- Playwright for browser automation
- Mocked external services where necessary
- Visual regression testing

**Example E2E Test:**

```typescript
// Testing repository analysis flow
test('User can add and analyze a repository', async ({ page }) => {
  // Arrange
  await loginUser(page);

  // Act - Navigate to dashboard
  await page.goto('/dashboard');

  // Add repository
  await page.getByRole('button', { name: 'Add Repository' }).click();
  await page.getByLabel('Repository URL').fill('https://github.com/owner/repo');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for repository to be added
  await page.waitForSelector('text=Repository added successfully');

  // Start analysis
  await page.getByText('repo').click();
  await page.getByRole('button', { name: 'Analyze' }).click();

  // Select template
  await page.getByLabel('Architecture Analysis').check();
  await page.getByRole('button', { name: 'Start Analysis' }).click();

  // Assert - Wait for analysis to complete
  await page.waitForSelector('text=Analysis completed', { timeout: 30000 });

  // Verify results are displayed
  expect(await page.isVisible('text=Architecture Overview')).toBeTruthy();
  expect(await page.isVisible('text=Components')).toBeTruthy();
});
```

### Performance Tests

Performance tests verify that the application meets performance requirements.

**Key Performance Metrics:**

- Page load time
- API response time
- Analysis processing time
- Database query performance

**Technology:**

- Lighthouse for web performance
- Custom timing metrics in key flows
- Load testing with k6 for API endpoints

**Example Performance Test:**

```typescript
// Load testing an API endpoint with k6
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const payload = JSON.stringify({
    url: 'https://github.com/owner/repo'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${__ENV.API_KEY}`
    }
  };

  const res = http.post(
    'https://api.gistofgit.com/v1/repositories',
    payload,
    params
  );

  check(res, {
    'status is 200': r => r.status === 200,
    'response time < 500ms': r => r.timings.duration < 500
  });

  sleep(1);
}
```

### Security Tests

Security tests identify potential vulnerabilities in the application.

**Key Security Areas:**

- Authentication and authorization
- Input validation
- API security
- Dependency security

**Technology:**

- OWASP ZAP for automated security scanning
- npm audit for dependency vulnerabilities
- Manual penetration testing

## Test Environments

### Local Development Environment

- Developers run tests locally before committing code
- Mock external dependencies
- Use Docker for database and infrastructure dependencies

### CI/CD Environment

- Automated test runs on pull requests and merge to main
- Integration with GitHub Actions
- Test database provisioned for each CI run

### Staging Environment

- Complete application deployment
- Integration with real (test) external services
- Performance and security testing

## Test Data Management

### Test Data Sources

- Synthetic data generation for most tests
- Anonymized production data for complex scenarios
- GitHub test repositories for repository analysis tests

### Database Seeding

- Seed scripts for consistent test data
- Database reset between test runs
- Fixtures for common test scenarios

## Testing LLM Integrations

LLM integration testing requires special consideration due to the variability of LLM responses.

### Strategies for Testing LLM Integration:

1. **Mock LLM responses** for deterministic testing
2. **Test for structure rather than exact content**
3. **Implement validation rules** to verify LLM outputs
4. **Record and replay** approach for complex scenarios

**Example LLM Integration Test:**

```typescript
// Testing the LLM analysis service
describe('analyzeDependencies', () => {
  it('should process repository content and return dependency analysis', async () => {
    // Arrange
    const mockRepoContent = {
      'package.json': JSON.stringify({
        dependencies: {
          react: '^18.0.0',
          next: '^13.0.0'
        }
      })
    };
    const mockLlmResponse = {
      summary: 'This is a React application with Next.js',
      dependencies: [
        { name: 'react', category: 'ui', isCritical: true },
        { name: 'next', category: 'framework', isCritical: true }
      ]
    };

    mockLlmService.analyze.mockResolvedValue(mockLlmResponse);

    // Act
    const result = await analyzeDependencies('repo-id', mockRepoContent);

    // Assert
    expect(mockLlmService.analyze).toHaveBeenCalledWith(
      expect.objectContaining({
        template: 'dependency-analysis',
        content: expect.any(String)
      })
    );

    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('dependencies');
    expect(result.dependencies.length).toBeGreaterThan(0);
    expect(result.dependencies[0]).toHaveProperty('name');
    expect(result.dependencies[0]).toHaveProperty('category');
  });
});
```

## Continuous Integration/Continuous Deployment

### CI Workflow

1. Run linting and type checking
2. Run unit tests
3. Run integration tests
4. Build the application
5. Run end-to-end tests
6. Run security scans
7. Deploy to staging environment (for main branch)

### CD Workflow

1. Run all CI steps
2. Deploy to production environment
3. Run smoke tests against production
4. Monitor for errors and performance issues

## Test Coverage Goals

- **Unit tests**: 80%+ coverage of all business logic
- **Integration tests**: 70%+ coverage of API endpoints
- **E2E tests**: Cover all critical user flows
- **Security tests**: Cover all OWASP Top 10 vulnerabilities

## Responsibilities

### Developers

- Write unit and integration tests for new features
- Fix failing tests before merging code
- Maintain and improve test suite

### QA Team

- Design and implement E2E test scenarios
- Perform exploratory testing
- Validate fixes for reported bugs

### DevOps

- Maintain test infrastructure
- Configure and monitor CI/CD pipeline
- Ensure test environments match production

## Test Reporting

### Metrics to Track

- Test coverage percentage
- Test execution time
- Number of failing tests
- Flaky tests

### Reporting Tools

- Jest coverage reports
- GitHub PR status checks
- Automated dashboard in CI/CD platform

## Conclusion

This testing strategy provides a comprehensive approach to ensure the quality and reliability of the Gist of Git application. By implementing these testing practices, we can confidently deliver new features and improvements while maintaining a stable and secure application.
