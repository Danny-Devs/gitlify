import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getRepositoryById } from '@/app/services/repository/repositoryService';
import { getDefaultLLMConfig } from '@/app/services/llm/llmConfigService';
import {
  initializeWorkflow,
  executeRepositoryAnalysis,
  executeCoreAbstractions,
  executeRequirementsExtraction
} from '@/app/services/workflow/workflowService';
import prisma from '@/lib/prisma';

/**
 * POST /api/prds/generate
 * Start the PRD generation process
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    if (!body.repositoryId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // Get repository details
    try {
      await getRepositoryById(body.repositoryId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      );
    }

    // Get or create default LLM configuration
    const llmConfigResult = await getDefaultLLMConfig(userId);

    if (!llmConfigResult.success) {
      return NextResponse.json(
        { error: llmConfigResult.error },
        { status: 400 }
      );
    }

    // Initialize workflow
    const workflowRunId = await initializeWorkflow(
      userId,
      body.repositoryId,
      llmConfigResult.data.id
    );

    // Return the workflow run ID
    return NextResponse.json({ workflowRunId }, { status: 201 });
  } catch (error) {
    console.error('Error starting PRD generation:', error);
    return NextResponse.json(
      { error: 'Failed to start PRD generation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/prds/generate/status
 * Check the status of a PRD generation workflow
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const workflowRunId = url.searchParams.get('workflowRunId');

    if (!workflowRunId) {
      return NextResponse.json(
        { error: 'Workflow run ID is required' },
        { status: 400 }
      );
    }

    // Get workflow run details
    const workflowRun = await prisma.workflowRun.findFirst({
      where: {
        id: workflowRunId,
        userId: session.user.id
      },
      include: {
        workflowStates: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!workflowRun) {
      return NextResponse.json(
        { error: 'Workflow run not found' },
        { status: 404 }
      );
    }

    // Return workflow run status
    return NextResponse.json({
      id: workflowRun.id,
      status: workflowRun.status,
      startedAt: workflowRun.startedAt,
      completedAt: workflowRun.completedAt,
      currentSteps: workflowRun.workflowStates.map(state => ({
        id: state.id,
        nodeName: state.nodeName,
        status: state.status,
        startedAt: state.startedAt,
        completedAt: state.completedAt
      }))
    });
  } catch (error) {
    console.error('Error checking PRD generation status:', error);
    return NextResponse.json(
      { error: 'Failed to check PRD generation status' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/prds/generate/run
 * Execute the next step in the PRD generation workflow
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.workflowRunId) {
      return NextResponse.json(
        { error: 'Workflow run ID is required' },
        { status: 400 }
      );
    }

    // Get workflow run details
    const workflowRun = await prisma.workflowRun.findFirst({
      where: {
        id: body.workflowRunId,
        userId: session.user.id
      },
      include: {
        workflowStates: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!workflowRun) {
      return NextResponse.json(
        { error: 'Workflow run not found' },
        { status: 404 }
      );
    }

    // Check if workflow is already completed or failed
    if (workflowRun.status === 'completed') {
      return NextResponse.json(
        { error: 'Workflow already completed' },
        { status: 400 }
      );
    }

    if (workflowRun.status === 'failed') {
      return NextResponse.json({ error: 'Workflow failed' }, { status: 400 });
    }

    // Determine which step to execute
    const latestState = workflowRun.workflowStates[0];

    if (!latestState || workflowRun.status === 'pending') {
      // Execute repository analysis (first step)
      const state = await executeRepositoryAnalysis(body.workflowRunId);
      return NextResponse.json({
        success: true,
        step: 'repository_analysis',
        nodeId: latestState?.id,
        nextStep: 'core_abstractions',
        state: { repositoryAnalysis: state.repositoryAnalysis }
      });
    }

    if (
      latestState.nodeName === 'repository_analysis' &&
      latestState.status === 'completed'
    ) {
      // Execute core abstractions (second step)
      // First get the state from the last run
      const previousState = await prisma.workflowState.findUnique({
        where: { id: latestState.id }
      });

      if (!previousState || !previousState.output) {
        return NextResponse.json(
          { error: 'Previous state not found' },
          { status: 500 }
        );
      }

      // Execute core abstractions
      const state = await executeCoreAbstractions(previousState.output as any);
      return NextResponse.json({
        success: true,
        step: 'core_abstractions',
        nodeId: latestState.id,
        nextStep: 'requirements_extraction',
        state: { abstractions: state.abstractions }
      });
    }

    if (
      (latestState.nodeName === 'core_abstractions' &&
        latestState.status === 'completed') ||
      (latestState.nodeName === 'requirements_extraction' &&
        latestState.status === 'completed')
    ) {
      // Execute requirements extraction (repeats for each abstraction)
      const previousState = await prisma.workflowState.findUnique({
        where: { id: latestState.id }
      });

      if (!previousState || !previousState.output) {
        return NextResponse.json(
          { error: 'Previous state not found' },
          { status: 500 }
        );
      }

      // Execute requirements extraction
      const state = await executeRequirementsExtraction(
        previousState.output as any
      );

      // Check if we've processed all abstractions
      if (state.abstractionsComplete) {
        return NextResponse.json({
          success: true,
          step: 'requirements_extraction',
          nodeId: latestState.id,
          nextStep: 'complete',
          state: {
            abstractionsComplete: true,
            prdGenerationComplete: true
          }
        });
      }

      return NextResponse.json({
        success: true,
        step: 'requirements_extraction',
        nodeId: latestState.id,
        nextStep: 'requirements_extraction',
        state: {
          currentAbstractionIndex: state.currentAbstractionIndex,
          abstractionsComplete: false
        }
      });
    }

    return NextResponse.json(
      { error: 'Unknown workflow state' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error executing PRD generation step:', error);
    return NextResponse.json(
      { error: 'Failed to execute PRD generation step' },
      { status: 500 }
    );
  }
}
