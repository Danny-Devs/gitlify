// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Key Types
export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

// GitHub Repository Types
export interface Repository {
  id: string;
  userId: string;
  name: string;
  owner: string;
  description?: string;
  url: string;
  lastAnalyzed?: Date;
  stars?: number;
  forks?: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Analysis Types
export interface Analysis {
  id: string;
  repositoryId: string;
  userId: string;
  templateId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisResult {
  id: string;
  analysisId: string;
  summary: string;
  details: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface FileAnalysis {
  id: string;
  analysisId: string;
  path: string;
  content?: string;
  analysis: string;
  createdAt: Date;
}

// Template Types
export interface Template {
  id: string;
  userId?: string;
  name: string;
  description: string;
  prompt: string;
  isSystem: boolean;
  parameters?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// LLM Configuration Types
export interface LLMConfiguration {
  id: string;
  userId: string;
  name: string;
  endpoint: string;
  apiKey?: string;
  model: string;
  parameters?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request and Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Component Props Types
export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface LayoutProps {
  children: React.ReactNode;
}

// Pagination and Filtering
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  [key: string]: any;
}
 