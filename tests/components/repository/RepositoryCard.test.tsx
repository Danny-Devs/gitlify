import React from 'react';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import RepositoryCard from '@/app/components/repository/RepositoryCard';

describe('RepositoryCard', () => {
  const mockRepository = {
    id: 'repo-123',
    name: 'example-repo',
    owner: 'example-user',
    description: 'An example repository for testing',
    url: 'https://github.com/example-user/example-repo',
    isPrivate: false,
    stars: 42,
    forks: 10,
    createdAt: new Date('2023-01-01').toISOString(),
    updatedAt: new Date('2023-01-02').toISOString()
  };

  const mockOnDelete = jest.fn();
  const mockOnGeneratePRD = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders repository details correctly', () => {
    render(
      <RepositoryCard
        repository={mockRepository}
        onDelete={mockOnDelete}
        onGeneratePRD={mockOnGeneratePRD}
      />
    );

    // Check if repository name, owner and description are rendered
    expect(screen.getByText('example-repo')).toBeInTheDocument();
    expect(screen.getByText('@example-user')).toBeInTheDocument();
    expect(
      screen.getByText('An example repository for testing')
    ).toBeInTheDocument();

    // Check if stars and forks are rendered
    expect(screen.getByText('42')).toBeInTheDocument(); // Stars
    expect(screen.getByText('10')).toBeInTheDocument(); // Forks
  });

  test('clicking Generate PRD button calls onGeneratePRD', () => {
    render(
      <RepositoryCard
        repository={mockRepository}
        onDelete={mockOnDelete}
        onGeneratePRD={mockOnGeneratePRD}
      />
    );

    const generateButton = screen.getByRole('button', {
      name: /generate prd/i
    });
    fireEvent.click(generateButton);

    expect(mockOnGeneratePRD).toHaveBeenCalledWith(mockRepository.id);
  });

  test('clicking delete button calls onDelete', () => {
    render(
      <RepositoryCard
        repository={mockRepository}
        onDelete={mockOnDelete}
        onGeneratePRD={mockOnGeneratePRD}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockRepository.id);
  });

  test('renders GitHub link with correct URL', () => {
    render(
      <RepositoryCard
        repository={mockRepository}
        onDelete={mockOnDelete}
        onGeneratePRD={mockOnGeneratePRD}
      />
    );

    const link = screen.getByRole('link', { name: /view on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/example-user/example-repo'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('displays private badge for private repositories', () => {
    const privateRepo = { ...mockRepository, isPrivate: true };

    render(
      <RepositoryCard
        repository={privateRepo}
        onDelete={mockOnDelete}
        onGeneratePRD={mockOnGeneratePRD}
      />
    );

    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  test('does not display private badge for public repositories', () => {
    render(
      <RepositoryCard
        repository={mockRepository}
        onDelete={mockOnDelete}
        onGeneratePRD={mockOnGeneratePRD}
      />
    );

    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });
});
