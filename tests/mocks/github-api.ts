// Mock GitHub API responses for testing

export const mockRepository = {
  id: 12345678,
  name: 'example-repo',
  owner: {
    login: 'example-user',
    id: 87654321,
    avatar_url: 'https://avatars.githubusercontent.com/u/87654321?v=4',
    url: 'https://api.github.com/users/example-user'
  },
  html_url: 'https://github.com/example-user/example-repo',
  description: 'An example repository for testing',
  private: false,
  fork: false,
  created_at: '2022-01-01T00:00:00Z',
  updated_at: '2022-01-02T00:00:00Z',
  pushed_at: '2022-01-03T00:00:00Z',
  language: 'TypeScript',
  stargazers_count: 42,
  watchers_count: 42,
  forks_count: 10,
  open_issues_count: 5,
  license: {
    key: 'mit',
    name: 'MIT License',
    url: 'https://api.github.com/licenses/mit'
  },
  default_branch: 'main',
  topics: ['react', 'typescript', 'nextjs']
}

export const mockRepositoryContent = {
  name: 'README.md',
  path: 'README.md',
  sha: 'abc123def456',
  size: 1024,
  url: 'https://api.github.com/repos/example-user/example-repo/contents/README.md',
  html_url: 'https://github.com/example-user/example-repo/blob/main/README.md',
  git_url: 'https://api.github.com/repos/example-user/example-repo/git/blobs/abc123def456',
  download_url: 'https://raw.githubusercontent.com/example-user/example-repo/main/README.md',
  type: 'file',
  content: Buffer.from('# Example Repository\n\nThis is an example repository for testing.').toString('base64'),
  encoding: 'base64'
}

export const mockRepositoryContents = [
  {
    name: 'README.md',
    path: 'README.md',
    sha: 'abc123def456',
    size: 1024,
    type: 'file',
    url: 'https://api.github.com/repos/example-user/example-repo/contents/README.md'
  },
  {
    name: 'src',
    path: 'src',
    sha: 'def456abc789',
    size: 0,
    type: 'dir',
    url: 'https://api.github.com/repos/example-user/example-repo/contents/src'
  },
  {
    name: 'package.json',
    path: 'package.json',
    sha: 'ghi789jkl012',
    size: 512,
    type: 'file',
    url: 'https://api.github.com/repos/example-user/example-repo/contents/package.json'
  },
  {
    name: 'tsconfig.json',
    path: 'tsconfig.json',
    sha: 'mno345pqr678',
    size: 256,
    type: 'file',
    url: 'https://api.github.com/repos/example-user/example-repo/contents/tsconfig.json'
  }
]

export const mockSearchResults = {
  total_count: 1,
  incomplete_results: false,
  items: [mockRepository]
} 