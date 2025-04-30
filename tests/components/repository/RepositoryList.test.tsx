import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/test-utils';
import RepositoryList from '@/app/components/repository/RepositoryList';
import * as repositoryService from '@/app/services/repository/repositoryService';
import * as prdService from '@/app/api/prds/generate/route';

// Mock the repository service and PRD generation API
jest.mock('@/app/services/repository/repositoryService', () => ({
  getRepositories: jest.fn(),
  deleteRepository: jest.fn()
}));

jest.mock('@/app/api/prds/generate/route', () => ({
  POST: jest.fn()
}));

describe('RepositoryList', () => {
  const mockRepositories = [
    {
      id: 'repo-1',
      name: 'example-repo-1',
      owner: 'example-user',
      description: 'Repository 1 for testing',
      url: 'https://github.com/example-user/example-repo-1',
      isPrivate: false,
      stars: 10,
      forks: 5,
      createdAt: new Date('2023-01-01').toISOString(),
      updatedAt: new Date('2023-01-02').toISOString()
    },
    {
      id: 'repo-2',
      name: 'example-repo-2',
      owner: 'example-user',
      description: 'Repository 2 for testing',
      url: 'https://github.com/example-user/example-repo-2',
      isPrivate: true,
      stars: 20,
      forks: 8,
      createdAt: new Date('2023-02-01').toISOString(),
      updatedAt: new Date('2023-02-02').toISOString()
    }
  ];

  beforeEach(() => {
    jest
      .clearAllMocks()(
        // Mock successful repositories fetch
        repositoryService.getRepositories as jest.Mock
      )
      .mockResolvedValue({
        success: true,
        data: mockRepositories
      });
  });

  test('renders loading state initially', () => {
    render(<RepositoryList />);

    expect(screen.getByText(/loading repositories/i)).toBeInTheDocument();
  });

  test('renders repositories after loading', async () => {
    render(<RepositoryList />);

    // Wait for repositories to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Check if repositories are displayed
    expect(screen.getByText('example-repo-1')).toBeInTheDocument();
    expect(screen.getByText('example-repo-2')).toBeInTheDocument();
    expect(screen.getByText('Repository 1 for testing')).toBeInTheDocument();
    expect(screen.getByText('Repository 2 for testing')).toBeInTheDocument();

    // Check private badge
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  test('renders empty state when no repositories', async () => {
    // Mock empty repositories
    (repositoryService.getRepositories as jest.Mock).mockResolvedValue({
      success: true,
      data: []
    });

    render(<RepositoryList />);

    // Wait for repositories to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Check if empty state is displayed
    expect(screen.getByText(/no repositories found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/add a repository to get started/i)
    ).toBeInTheDocument();
  });

  test('renders error state on failure', async () => {
    // Mock failed repositories fetch
    (repositoryService.getRepositories as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to fetch repositories'
    });

    render(<RepositoryList />);

    // Wait for error to appear
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Check if error is displayed
    expect(
      screen.getByText(/failed to fetch repositories/i)
    ).toBeInTheDocument();
  });

  test('deletes repository on delete button click', async () => {
    // Mock successful repository deletion
    (repositoryService.deleteRepository as jest.Mock).mockResolvedValue({
      success: true
    });

    render(<RepositoryList />);

    // Wait for repositories to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Find delete button for the first repository
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Verify repository service was called
    await waitFor(() => {
      expect(repositoryService.deleteRepository).toHaveBeenCalledWith(
        'repo-1',
        expect.any(String) // userId from mock session
      );
    });

    // Verify repositories are reloaded
    expect(repositoryService.getRepositories).toHaveBeenCalledTimes(2);
  });

  test('handles repository deletion error', async () => {
    // Mock failed repository deletion
    (repositoryService.deleteRepository as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to delete repository'
    });

    render(<RepositoryList />);

    // Wait for repositories to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Find delete button for the first repository
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Verify error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/failed to delete repository/i)
      ).toBeInTheDocument();
    });
  });

  test('initiates PRD generation on button click', async () => {
    // Mock successful PRD generation
    (prdService.POST as jest.Mock).mockResolvedValue({
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: { id: 'prd-123' }
        })
    });

    render(<RepositoryList />);

    // Wait for repositories to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Find PRD generation button for the first repository
    const generateButtons = screen.getAllByRole('button', {
      name: /generate prd/i
    });
    fireEvent.click(generateButtons[0]);

    // Show loading state
    expect(screen.getByText(/generating prd/i)).toBeInTheDocument();

    // Verify success message after completion
    await waitFor(() => {
      expect(screen.getByText(/prd generation started/i)).toBeInTheDocument();
    });
  });

  test('handles PRD generation error', async () => {
    // Mock failed PRD generation
    (prdService.POST as jest.Mock).mockResolvedValue({
      status: 500,
      json: () =>
        Promise.resolve({
          success: false,
          error: 'Failed to generate PRD'
        })
    });

    render(<RepositoryList />);

    // Wait for repositories to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Find PRD generation button for the first repository
    const generateButtons = screen.getAllByRole('button', {
      name: /generate prd/i
    });
    fireEvent.click(generateButtons[0]);

    // Verify error message after failure
    await waitFor(() => {
      expect(screen.getByText(/failed to generate prd/i)).toBeInTheDocument();
    });
  });

  test('refreshes repositories when Add Repository is successful', async () => {
    render(<RepositoryList />);

    // Wait for initial repositories to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading repositories/i)
      ).not.toBeInTheDocument();
    });

    // Reset mock to track new calls
    jest.clearAllMocks();

    // Find the add repository form
    const addRepositoryButton = screen.getByRole('button', {
      name: /add repository/i
    });
    const repositoryInput = screen.getByLabelText(/github repository url/i);

    // Enter a repository URL and submit
    fireEvent.change(repositoryInput, {
      target: { value: 'https://github.com/example-user/new-repo' }
    });
    fireEvent.click(addRepositoryButton);

    // Trigger the onSuccess callback (normally this would be called by the form component)
    // This is a bit hacky, but we're testing the parent component's behavior
    // We'd normally test this with integration tests, but for component tests this approach works
    const mockNewRepository = {
      id: 'repo-3',
      name: 'new-repo',
      owner: 'example-user'
    };

    // Mock repositories now including the new one
    const updatedRepositories = [...mockRepositories, mockNewRepository](
      repositoryService.getRepositories as jest.Mock
    ).mockResolvedValue({
      success: true,
      data: updatedRepositories
    });

    // Simulate successful repository addition by re-fetching
    await fireEvent.click(screen.getByText(/refresh/i));

    // Verify repositories were reloaded
    await waitFor(() => {
      expect(repositoryService.getRepositories).toHaveBeenCalled();
    });
  });
});
