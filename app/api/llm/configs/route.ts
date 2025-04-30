import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

// Schema for LLM config validation
const llmConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  endpoint: z.string().url('Must be a valid URL'),
  apiKey: z.string().optional(),
  modelName: z.string().min(1, 'Model name is required'),
  contextWindow: z
    .number()
    .int()
    .positive('Context window must be a positive integer'),
  isActive: z.boolean().default(true)
});

// GET - List all configs for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: 'You must be logged in to access LLM configurations'
        },
        { status: 401 }
      );
    }

    const configs = await prisma.lLMConfiguration.findMany({
      where: {
        OR: [{ userId: session.user.id }, { isActive: true }]
      },
      select: {
        id: true,
        name: true,
        endpoint: true,
        modelName: true,
        contextWindow: true,
        isActive: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Mask other users' configurations to only include minimal info
    const maskedConfigs = configs.map(config => {
      if (config.user.id !== session.user.id) {
        return {
          id: config.id,
          name: config.name,
          modelName: config.modelName,
          contextWindow: config.contextWindow,
          isShared: true,
          ownedByUser: false
        };
      }

      return {
        ...config,
        ownedByUser: true
      };
    });

    return NextResponse.json(maskedConfigs);
  } catch (error) {
    console.error('Error fetching LLM configs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch LLM configurations'
      },
      { status: 500 }
    );
  }
}

// POST - Create a new config
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: 'You must be logged in to create LLM configurations'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = llmConfigSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { name, endpoint, apiKey, modelName, contextWindow, isActive } =
      validationResult.data;

    const config = await prisma.lLMConfiguration.create({
      data: {
        name,
        endpoint,
        apiKey,
        modelName,
        contextWindow,
        isActive,
        userId: session.user.id
      }
    });

    // Mask the API key in the response
    const { apiKey: _, ...configWithoutApiKey } = config;

    return NextResponse.json(configWithoutApiKey, { status: 201 });
  } catch (error) {
    console.error('Error creating LLM config:', error);
    return NextResponse.json(
      {
        error: 'Failed to create LLM configuration'
      },
      { status: 500 }
    );
  }
}
