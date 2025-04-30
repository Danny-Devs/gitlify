'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  BookOpen,
  GitBranch,
  Users,
  ChevronRight,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import {
  Chapter,
  Diagram,
  PRD,
  Rating,
  Comment,
  Repository,
  User
} from '@prisma/client';
import MermaidDiagram from '../diagram/MermaidDiagram';

interface ChapterWithDiagrams extends Chapter {
  diagrams: Diagram[];
}

interface PRDWithRelations extends PRD {
  chapters: ChapterWithDiagrams[];
  diagrams: Diagram[];
  repository: Repository;
  user: Pick<User, 'id' | 'name' | 'image'>;
  ratings: Rating[];
  comments: (Comment & {
    user: Pick<User, 'id' | 'name' | 'image'>;
    replies: (Comment & {
      user: Pick<User, 'id' | 'name' | 'image'>;
    })[];
  })[];
  _count: {
    ratings: number;
    comments: number;
  };
}

export default function PRDDetail({ prd }: { prd: PRDWithRelations }) {
  const [activeChapter, setActiveChapter] = useState<string>(
    prd.chapters.length > 0 ? prd.chapters[0].id : ''
  );

  const currentChapter = prd.chapters.find(
    chapter => chapter.id === activeChapter
  );

  // Calculate average rating
  const averageRating =
    prd.ratings.length > 0
      ? prd.ratings.reduce((sum, rating) => sum + rating.score, 0) /
        prd.ratings.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/prds" className="hover:underline">
              PRDs
            </Link>
            <ChevronRight size={14} />
            <Link
              href={`/repositories/${prd.repository.owner}/${prd.repository.name}`}
              className="hover:underline"
            >
              {prd.repository.owner}/{prd.repository.name}
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{prd.title}</h1>
              <p className="mt-2 text-muted-foreground">{prd.summary}</p>
            </div>

            <div className="flex flex-col gap-2 items-start sm:items-end">
              <Badge className="px-2 py-1">
                {prd.status.charAt(0).toUpperCase() + prd.status.slice(1)}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Created{' '}
                  {formatDistanceToNow(new Date(prd.createdAt), {
                    addSuffix: true
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span>{prd.chapters.length} chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-muted-foreground" />
              <span>{prd.diagrams.length} diagrams</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-muted-foreground" />
              <span>{prd._count.ratings} ratings</span>
              {prd._count.ratings > 0 && (
                <span className="text-sm text-muted-foreground">
                  (Avg: {averageRating.toFixed(1)}/5)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <span>{prd._count.comments} comments</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chapter navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Chapters</h3>
              <div className="space-y-2">
                {prd.chapters.map(chapter => (
                  <Button
                    key={chapter.id}
                    variant={activeChapter === chapter.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveChapter(chapter.id)}
                  >
                    <span className="truncate">{chapter.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                {currentChapter ? (
                  <div className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
                    <h2>{currentChapter.title}</h2>
                    <ReactMarkdown>{currentChapter.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No chapters available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="diagrams" className="mt-6">
                <div className="grid grid-cols-1 gap-8">
                  {currentChapter && currentChapter.diagrams.length > 0 ? (
                    currentChapter.diagrams.map(diagram => (
                      <div
                        key={diagram.id}
                        className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg"
                      >
                        <h3 className="text-xl font-semibold mb-2">
                          {diagram.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {diagram.description}
                        </p>
                        <div className="border rounded-lg p-4 bg-white dark:bg-slate-800">
                          <MermaidDiagram code={diagram.mermaidCode} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No diagrams available for this chapter</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <div className="space-y-6">
                  {prd.comments.length > 0 ? (
                    prd.comments.map(comment => (
                      <div
                        key={comment.id}
                        className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {comment.user.image ? (
                            <img
                              src={comment.user.image}
                              alt={comment.user.name || 'User'}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <Users className="w-8 h-8" />
                          )}
                          <div>
                            <p className="font-semibold">
                              {comment.user.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(comment.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2">{comment.content}</p>

                        {/* Comment replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 ml-8 space-y-4">
                            {comment.replies.map(reply => (
                              <div
                                key={reply.id}
                                className="bg-white dark:bg-slate-800 p-3 rounded-lg"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {reply.user.image ? (
                                    <img
                                      src={reply.user.image}
                                      alt={reply.user.name || 'User'}
                                      className="w-6 h-6 rounded-full"
                                    />
                                  ) : (
                                    <Users className="w-6 h-6" />
                                  )}
                                  <div>
                                    <p className="font-semibold">
                                      {reply.user.name || 'Anonymous'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(
                                        new Date(reply.createdAt),
                                        { addSuffix: true }
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-2">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No comments yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
