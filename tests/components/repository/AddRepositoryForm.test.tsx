import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/test-utils';
import AddRepositoryForm from '@/app/components/repository/AddRepositoryForm';
import * as repositoryService from '@/app/services/repository/repositoryService';

// Mock the repository service
jest.mock('@/app/services/repository/repositoryService', () => ({
  addRepository: jest.fn()
}));

describe('AddRepositoryForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(
      <AddRepositoryForm onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    // Check form elements
    expect(screen.getByLabelText(/github repository url/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add repository/i })
    ).toBeInTheDocument();
  });

  test('validates empty form submission', async () => {
    render(
      <AddRepositoryForm onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    // Submit form without input
    const submitButton = screen.getByRole('button', {
      name: /add repository/i
    });
    fireEvent.click(submitButton);

    // Check validation message
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a github repository url/i)
      ).toBeInTheDocument();
    });

    // Verify service was not called
    expect(repositoryService.addRepository).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnError).not.toHaveBeenCalled();
  });

  test('validates invalid URL format', async () => {
    render(
      <AddRepositoryForm onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    // Enter invalid URL
    const input = screen.getByLabelText(/github repository url/i);
    fireEvent.change(input, { target: { value: 'invalid-url' } });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /add repository/i
    });
    fireEvent.click(submitButton);

    // Check validation message
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid github repository url/i)
      ).toBeInTheDocument();
    });

    // Verify service was not called
    expect(repositoryService.addRepository).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnError).not.toHaveBeenCalled();
  });

  test('handles successful repository addition', async () => {
    // Mock successful repository addition
    (repositoryService.addRepository as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'repo-123',
        name: 'example-repo',
        owner: 'example-user'
      }
    });

    render(
      <AddRepositoryForm onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    // Enter valid URL
    const input = screen.getByLabelText(/github repository url/i);
    fireEvent.change(input, {
      target: { value: 'https://github.com/example-user/example-repo' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /add repository/i
    });
    fireEvent.click(submitButton);

    // Verify repository service was called
    await waitFor(() => {
      expect(repositoryService.addRepository).toHaveBeenCalledWith(
        expect.any(String), // userId from mock session
        'https://github.com/example-user/example-repo'
      );
    });

    // Verify success callback was called
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        id: 'repo-123',
        name: 'example-repo',
        owner: 'example-user'
      });
    });

    expect(mockOnError).not.toHaveBeenCalled();

    // Form should be reset
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('handles repository addition error', async () => {
    // Mock failed repository addition
    (repositoryService.addRepository as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to add repository'
    });

    render(
      <AddRepositoryForm onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    // Enter valid URL
    const input = screen.getByLabelText(/github repository url/i);
    fireEvent.change(input, {
      target: { value: 'https://github.com/example-user/example-repo' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /add repository/i
    });
    fireEvent.click(submitButton);

    // Verify repository service was called
    await waitFor(() => {
      expect(repositoryService.addRepository).toHaveBeenCalledWith(
        expect.any(String), // userId from mock session
        'https://github.com/example-user/example-repo'
      );
    });

    // Verify error callback was called
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Failed to add repository');
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('displays loading state during submission', async () => {
    // Mock slow repository addition
    (repositoryService.addRepository as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: 'repo-123',
              name: 'example-repo',
              owner: 'example-user'
            }
          });
        }, 100);
      });
    });

    render(
      <AddRepositoryForm onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    // Enter valid URL
    const input = screen.getByLabelText(/github repository url/i);
    fireEvent.change(input, {
      target: { value: 'https://github.com/example-user/example-repo' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /add repository/i
    });
    fireEvent.click(submitButton);

    // Check for loading state
    expect(submitButton).toBeDisabled();

    // Verify form returns to non-loading state after completion
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(submitButton).not.toBeDisabled();
    });
  });
});
