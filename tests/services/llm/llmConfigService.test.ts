import {
  createLLMConfig,
  getLLMConfigs,
  getLLMConfig,
  updateLLMConfig,
  deleteLLMConfig,
  getDefaultLLMConfig
} from '@/app/services/llm/llmConfigService';
import prisma from '@/lib/prisma';
import { server } from '../../mocks/server';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  lLMConfiguration: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock LLM client
jest.mock('@/lib/llm/llmClient', () => ({
  createLLMClient: jest.fn().mockReturnValue({
    complete: jest
      .fn()
      .mockResolvedValue({
        text: 'Connection successful.',
        usage: { totalTokens: 5 }
      })
  })
}));

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

// Close server after all tests
afterAll(() => server.close());

describe('LLM Configuration Service', () => {
  describe('createLLMConfig', () => {
    test('creates new LLM configuration', async () => {
      const mockConfig = {
        id: '1',
        name: 'Test Config',
        endpoint: 'http://localhost:11434/api/generate',
        apiKey: null,
        modelName: 'codellama:7b',
        contextWindow: 4000,
        isActive: true,
        userId: 'user1'
      };

      // @ts-ignore - mocking
      prisma.lLMConfiguration.create.mockResolvedValue(mockConfig);

      const result = await createLLMConfig('user1', {
        name: 'Test Config',
        endpoint: 'http://localhost:11434/api/generate',
        modelName: 'codellama:7b',
        contextWindow: 4000
      });

      expect(result).toEqual({ success: true, data: mockConfig });
      expect(prisma.lLMConfiguration.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test Config',
          endpoint: 'http://localhost:11434/api/generate',
          modelName: 'codellama:7b',
          userId: 'user1'
        })
      });
    });

    test('handles connection failure', async () => {
      // Mock connection failure
      jest.mock(
        '@/lib/llm/llmClient',
        () => ({
          createLLMClient: jest.fn().mockReturnValue({
            complete: jest
              .fn()
              .mockRejectedValue(new Error('Connection failed'))
          })
        }),
        { virtual: true }
      );

      const result = await createLLMConfig('user1', {
        name: 'Test Config',
        endpoint: 'invalid-endpoint',
        modelName: 'codellama:7b',
        contextWindow: 4000
      });

      expect(result).toEqual({
        success: false,
        error:
          'Failed to connect to LLM provider. Please check your configuration.'
      });
      expect(prisma.lLMConfiguration.create).not.toHaveBeenCalled();
    });

    test('handles database errors', async () => {
      // @ts-ignore - mocking
      prisma.lLMConfiguration.create.mockRejectedValue(
        new Error('Database error')
      );

      const result = await createLLMConfig('user1', {
        name: 'Test Config',
        endpoint: 'http://localhost:11434/api/generate',
        modelName: 'codellama:7b',
        contextWindow: 4000
      });

      expect(result).toEqual({
        success: false,
        error: 'Failed to create LLM configuration'
      });
    });
  });

  describe('getLLMConfigs', () => {
    test('returns configurations for user', async () => {
      const mockConfigs = [
        { id: '1', name: 'Config 1', userId: 'user1' },
        { id: '2', name: 'Config 2', userId: 'user1' }
      ];

      // @ts-ignore - mocking
      prisma.lLMConfiguration.findMany.mockResolvedValue(mockConfigs);

      const result = await getLLMConfigs('user1');
      expect(result).toEqual({ success: true, data: mockConfigs });
      expect(prisma.lLMConfiguration.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { createdAt: 'desc' }
      });
    });

    test('handles errors', async () => {
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findMany.mockRejectedValue(
        new Error('Database error')
      );

      const result = await getLLMConfigs('user1');
      expect(result).toEqual({
        success: false,
        error: 'Failed to fetch LLM configurations'
      });
    });
  });

  describe('getLLMConfig', () => {
    test('returns configuration by id', async () => {
      const mockConfig = { id: '1', name: 'Config 1', userId: 'user1' };

      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(mockConfig);

      const result = await getLLMConfig('1', 'user1');
      expect(result).toEqual({ success: true, data: mockConfig });
      expect(prisma.lLMConfiguration.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' }
      });
    });

    test('returns error when config not found', async () => {
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(null);

      const result = await getLLMConfig('1', 'user1');
      expect(result).toEqual({
        success: false,
        error: 'LLM configuration not found'
      });
    });

    test('handles errors', async () => {
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockRejectedValue(
        new Error('Database error')
      );

      const result = await getLLMConfig('1', 'user1');
      expect(result).toEqual({
        success: false,
        error: 'Failed to fetch LLM configuration'
      });
    });
  });

  describe('updateLLMConfig', () => {
    test('updates LLM configuration', async () => {
      const mockExistingConfig = {
        id: '1',
        name: 'Old Name',
        endpoint: 'http://localhost:11434/api/generate',
        modelName: 'codellama:7b',
        userId: 'user1'
      };

      const mockUpdatedConfig = {
        ...mockExistingConfig,
        name: 'New Name'
      };

      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(mockExistingConfig);
      // @ts-ignore - mocking
      prisma.lLMConfiguration.update.mockResolvedValue(mockUpdatedConfig);

      const result = await updateLLMConfig('1', 'user1', { name: 'New Name' });
      expect(result).toEqual({ success: true, data: mockUpdatedConfig });
      expect(prisma.lLMConfiguration.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'New Name' }
      });
    });

    test('returns error when config not found', async () => {
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(null);

      const result = await updateLLMConfig('1', 'user1', { name: 'New Name' });
      expect(result).toEqual({
        success: false,
        error: 'LLM configuration not found'
      });
      expect(prisma.lLMConfiguration.update).not.toHaveBeenCalled();
    });

    test('validates connection when updating endpoint or model', async () => {
      const mockExistingConfig = {
        id: '1',
        name: 'Test Config',
        endpoint: 'http://localhost:11434/api/generate',
        modelName: 'codellama:7b',
        userId: 'user1'
      };

      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(mockExistingConfig);
      // @ts-ignore - mocking
      prisma.lLMConfiguration.update.mockResolvedValue({
        ...mockExistingConfig,
        endpoint: 'http://localhost:11434/api/generate-v2',
        modelName: 'codellama:13b'
      });

      const result = await updateLLMConfig('1', 'user1', {
        endpoint: 'http://localhost:11434/api/generate-v2',
        modelName: 'codellama:13b'
      });

      expect(result.success).toBe(true);
    });
  });

  describe('deleteLLMConfig', () => {
    test('deletes LLM configuration', async () => {
      const mockConfig = { id: '1', name: 'Config 1', userId: 'user1' };

      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(mockConfig);
      // @ts-ignore - mocking
      prisma.lLMConfiguration.delete.mockResolvedValue(mockConfig);

      const result = await deleteLLMConfig('1', 'user1');
      expect(result).toEqual({ success: true });
      expect(prisma.lLMConfiguration.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    test('returns error when config not found', async () => {
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(null);

      const result = await deleteLLMConfig('1', 'user1');
      expect(result).toEqual({
        success: false,
        error: 'LLM configuration not found'
      });
      expect(prisma.lLMConfiguration.delete).not.toHaveBeenCalled();
    });

    test('handles errors', async () => {
      const mockConfig = { id: '1', name: 'Config 1', userId: 'user1' };

      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(mockConfig);
      // @ts-ignore - mocking
      prisma.lLMConfiguration.delete.mockRejectedValue(
        new Error('Database error')
      );

      const result = await deleteLLMConfig('1', 'user1');
      expect(result).toEqual({
        success: false,
        error: 'Failed to delete LLM configuration'
      });
    });
  });

  describe('getDefaultLLMConfig', () => {
    test('returns active configuration', async () => {
      const mockConfig = {
        id: '1',
        name: 'Active Config',
        isActive: true,
        userId: 'user1'
      };

      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(mockConfig);

      const result = await getDefaultLLMConfig('user1');
      expect(result).toEqual({ success: true, data: mockConfig });
      expect(prisma.lLMConfiguration.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          isActive: true
        }
      });
    });

    test('falls back to most recent configuration', async () => {
      const mockConfig = { id: '1', name: 'Recent Config', userId: 'user1' };

      // First call returns null (no active config)
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValueOnce(null);
      // Second call returns the most recent config
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValueOnce(mockConfig);

      const result = await getDefaultLLMConfig('user1');
      expect(result).toEqual({ success: true, data: mockConfig });
    });

    test('creates default configuration if none exists', async () => {
      const mockConfig = {
        id: '1',
        name: 'Default Ollama Configuration',
        endpoint: 'http://localhost:11434/api/generate',
        modelName: 'codellama:7b',
        contextWindow: 4000,
        isActive: true,
        userId: 'user1'
      };

      // Both findFirst calls return null
      // @ts-ignore - mocking
      prisma.lLMConfiguration.findFirst.mockResolvedValue(null);
      // Create returns the new config
      // @ts-ignore - mocking
      prisma.lLMConfiguration.create.mockResolvedValue(mockConfig);

      const result = await getDefaultLLMConfig('user1');
      expect(result).toEqual({ success: true, data: mockConfig });
      expect(prisma.lLMConfiguration.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Default Ollama Configuration',
          userId: 'user1'
        })
      });
    });
  });
});
