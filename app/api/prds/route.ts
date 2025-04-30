import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

// Schema for PRD creation validation
const createPRDSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  repositoryId: z.string().min(1, 'Repository is required'),
  llmConfigId: z.string().min(1, 'LLM configuration is required')
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to create a PRD' },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = createPRDSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { title, summary, repositoryId, llmConfigId } = validationResult.data;

    // Verify repository exists and belongs to the user
    const repository = await prisma.repository.findUnique({
      where: {
        id: repositoryId,
        userId: session.user.id
      }
    });

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository not found or access denied' },
        { status: 404 }
      );
    }

    // Verify LLM configuration exists
    const llmConfig = await prisma.lLMConfiguration.findUnique({
      where: {
        id: llmConfigId
      }
    });

    if (!llmConfig) {
      return NextResponse.json(
        { error: 'LLM configuration not found' },
        { status: 404 }
      );
    }

    // Create a workflow run record
    const workflowRun = await prisma.workflowRun.create({
      data: {
        status: 'pending',
        repositoryId,
        userId: session.user.id,
        configurationId: llmConfigId
      }
    });

    // Initialize workflow state
    const workflowState = await prisma.workflowState.create({
      data: {
        nodeName: 'initialize',
        status: 'pending',
        workflowRunId: workflowRun.id,
        input: {
          repositoryId,
          llmConfigId
        }
      }
    });

    // Create the PRD
    const prd = await prisma.pRD.create({
      data: {
        title,
        summary,
        repositoryId,
        userId: session.user.id,
        workflowStateId: workflowState.id,
        status: 'draft'
      }
    });

    // Start the PRD generation process
    // This would typically be a background job, but for simplicity,
    // we'll just update the workflow state
    await prisma.workflowState.update({
      where: {
        id: workflowState.id
      },
      data: {
        status: 'running',
        startedAt: new Date()
      }
    });

    // Return the created PRD
    return NextResponse.json(prd, { status: 201 });
  } catch (error) {
    console.error('Error creating PRD:', error);
    return NextResponse.json(
      { error: 'Failed to create PRD' },
      { status: 500 }
    );
  }
}
