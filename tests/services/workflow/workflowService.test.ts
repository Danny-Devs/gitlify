import {
  createPRDGenerationWorkflow,
  executeWorkflow
} from '@/app/services/workflow/workflowService';
import { NodeStatus } from '@/app/services/workflow/types';
import prisma from '@/lib/prisma';
import { server } from '../../mocks/server';
import { mockRepository, mockRepositoryContents } from '../../mocks/github-api';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  pRD: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn()
  },
  repository: {
    findFirst: jest.fn()
  }
}));

// Mock workflow nodes
jest.mock('@/app/services/workflow/nodes/RepositoryAnalysisNode', () => {
  return {
    RepositoryAnalysisNode: jest.fn().mockImplementation(state => ({
      getState: jest.fn().mockReturnValue(state),
      updateState: jest.fn(updates => {
        state = {
          ...state,
          ...updates,
          data: { ...state.data, ...updates.data }
        };
      }),
      run: jest.fn().mockImplementation(async () => {
        state.status = NodeStatus.COMPLETED;
        state.data = {
          ...state.data,
          repository: mockRepository,
          contents: mockRepositoryContents
        };
        return state;
      })
    }))
  };
});

jest.mock('@/app/services/workflow/nodes/CoreAbstractionsNode', () => {
  return {
    CoreAbstractionsNode: jest.fn().mockImplementation(state => ({
      getState: jest.fn().mockReturnValue(state),
      updateState: jest.fn(updates => {
        state = {
          ...state,
          ...updates,
          data: { ...state.data, ...updates.data }
        };
      }),
      run: jest.fn().mockImplementation(async () => {
        state.status = NodeStatus.COMPLETED;
        state.data = {
          ...state.data,
          abstractions: 'Core abstractions for the repository...'
        };
        return state;
      })
    }))
  };
});

jest.mock('@/app/services/workflow/nodes/RequirementsExtractionNode', () => {
  return {
    RequirementsExtractionNode: jest.fn().mockImplementation(state => ({
      getState: jest.fn().mockReturnValue(state),
      updateState: jest.fn(updates => {
        state = {
          ...state,
          ...updates,
          data: { ...state.data, ...updates.data }
        };
      }),
      run: jest.fn().mockImplementation(async () => {
        state.status = NodeStatus.COMPLETED;
        state.data = {
          ...state.data,
          requirements: 'Functional requirements for the repository...'
        };
        return state;
      })
    }))
  };
});

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

// Close server after all tests
afterAll(() => server.close());

describe('Workflow Service', () => {
  const mockUser = { id: 'user-123' };
  const mockRepositoryData = {
    id: 'repo-123',
    name: 'example-repo',
    owner: 'example-user',
    userId: 'user-123'
  };
  const mockLLMConfig = {
    id: 'llm-123',
    endpoint: 'http://localhost:11434/api/generate',
    modelName: 'codellama:7b',
    contextWindow: 4000
  };

  describe('createPRDGenerationWorkflow', () => {
    test('creates workflow with correct initial data', () => {
      const workflow = createPRDGenerationWorkflow({
        repository: mockRepositoryData,
        llmConfig: mockLLMConfig,
        accessToken: 'test-token',
        userId: 'user-123'
      });

      expect(workflow).toBeDefined();
      expect(workflow.length).toBe(3);

      const [repoAnalysisNode, coreAbstractionsNode, requirementsNode] =
        workflow;

      // Check Repository Analysis Node
      expect(repoAnalysisNode.getState()).toEqual(
        expect.objectContaining({
          nodeId: 'repository-analysis',
          status: NodeStatus.IDLE,
          data: expect.objectContaining({
            repositoryId: 'repo-123',
            owner: 'example-user',
            repo: 'example-repo',
            accessToken: 'test-token'
          })
        })
      );

      // Check Core Abstractions Node
      expect(coreAbstractionsNode.getState()).toEqual(
        expect.objectContaining({
          nodeId: 'core-abstractions',
          status: NodeStatus.IDLE,
          data: expect.objectContaining({
            repositoryId: 'repo-123',
            llmConfig: mockLLMConfig
          })
        })
      );

      // Check Requirements Extraction Node
      expect(requirementsNode.getState()).toEqual(
        expect.objectContaining({
          nodeId: 'requirements-extraction',
          status: NodeStatus.IDLE,
          data: expect.objectContaining({
            repositoryId: 'repo-123',
            llmConfig: mockLLMConfig
          })
        })
      );
    });
  });

  describe('executeWorkflow', () => {
    // Mock PRD creation
    beforeEach(() => {
      // @ts-ignore - mocking
      prisma.pRD.create.mockResolvedValue({
        id: 'prd-123',
        title: 'Example PRD',
        status: 'in_progress',
        repositoryId: 'repo-123',
        userId: 'user-123'
      });

      // @ts-ignore - mocking
      prisma.pRD.update.mockImplementation(async args => ({
        id: 'prd-123',
        ...args.data
      }));

      // @ts-ignore - mocking
      prisma.pRD.findUnique.mockResolvedValue({
        id: 'prd-123',
        title: 'Example PRD',
        status: 'in_progress',
        repositoryId: 'repo-123',
        userId: 'user-123'
      });

      // @ts-ignore - mocking
      prisma.repository.findFirst.mockResolvedValue(mockRepositoryData);
    });

    test('executes workflow successfully', async () => {
      const workflow = createPRDGenerationWorkflow({
        repository: mockRepositoryData,
        llmConfig: mockLLMConfig,
        accessToken: 'test-token',
        userId: 'user-123'
      });

      const result = await executeWorkflow(workflow, 'user-123');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.prd).toBeDefined();
      expect(result.data.prd.id).toBe('prd-123');
      expect(result.data.prd.status).toBe('completed');

      // Verify PRD was created and updated
      expect(prisma.pRD.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          repositoryId: 'repo-123',
          userId: 'user-123',
          status: 'in_progress'
        })
      });

      expect(prisma.pRD.update).toHaveBeenCalledWith({
        where: { id: 'prd-123' },
        data: expect.objectContaining({
          status: 'completed',
          content: expect.any(String)
        })
      });
    });

    test('handles workflow failure correctly', async () => {
      // Mock a failing node
      jest.mock(
        '@/app/services/workflow/nodes/RepositoryAnalysisNode',
        () => {
          return {
            RepositoryAnalysisNode: jest.fn().mockImplementation(state => ({
              getState: jest
                .fn()
                .mockReturnValue({
                  ...state,
                  status: NodeStatus.ERROR,
                  error: 'Test error'
                }),
              updateState: jest.fn(),
              run: jest.fn().mockImplementation(async () => {
                state.status = NodeStatus.ERROR;
                state.error = 'Failed to analyze repository';
                return state;
              })
            }))
          };
        },
        { virtual: true }
      );

      const workflow = createPRDGenerationWorkflow({
        repository: mockRepositoryData,
        llmConfig: mockLLMConfig,
        accessToken: 'test-token',
        userId: 'user-123'
      });

      // Force error in first node
      workflow[0].run = jest.fn().mockImplementation(async () => {
        const state = workflow[0].getState();
        return {
          ...state,
          status: NodeStatus.ERROR,
          error: 'Failed to analyze repository'
        };
      });

      const result = await executeWorkflow(workflow, 'user-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Workflow failed: Failed to analyze repository'
      );

      // Verify PRD was created and updated to error status
      expect(prisma.pRD.create).toHaveBeenCalled();
      expect(prisma.pRD.update).toHaveBeenCalledWith({
        where: { id: 'prd-123' },
        data: expect.objectContaining({
          status: 'failed',
          error: expect.stringContaining('Failed to analyze repository')
        })
      });
    });
  });
});
