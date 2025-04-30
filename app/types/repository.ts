/**
 * Repository type definition
 */
export interface Repository {
  id: string;
  name: string;
  owner: string;
  description?: string;
  url: string;
  isPrivate?: boolean;
  stars?: number;
  forks?: number;
  lastAnalyzed?: string;
  lastCommitSha?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
