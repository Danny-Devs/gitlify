'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, Github, Star, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createGitHubClient } from '../lib/github/githubClient';
import { getRepositories } from '../services/repository/repositoryService';
import { Repository } from '../types';

// Featured repositories for beginners
const FEATURED_REPOS = [
  {
    owner: 'facebook',
    name: 'react',
    description: 'A JavaScript library for building user interfaces'
  },
  {
    owner: 'vercel',
    name: 'next.js',
    description: 'The React Framework for the Web'
  },
  {
    owner: 'tailwindlabs',
    name: 'tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development'
  },
  {
    owner: 'prisma',
    name: 'prisma',
    description: 'Next-generation ORM for Node.js & TypeScript'
  },
  {
    owner: 'shadcn-ui',
    name: 'ui',
    description: 'Accessible and customizable components for React'
  },
  {
    owner: 'trpc',
    name: 'trpc',
    description: 'End-to-end typesafe APIs made easy'
  }
];

// Popular TypeScript project categories
const CATEGORIES = [
  { id: 'frontend', name: 'Frontend Frameworks' },
  { id: 'backend', name: 'Backend & APIs' },
  { id: 'fullstack', name: 'Full-Stack' },
  { id: 'tools', name: 'Developer Tools' },
  { id: 'libraries', name: 'UI Libraries' }
];

export default function RepositoriesPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userRepos, setUserRepos] = useState<Repository[]>([]);
  const [isLoadingUserRepos, setIsLoadingUserRepos] = useState(false);
  const [featuredRepos, setFeaturedRepos] = useState<any[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [selectedTab, setSelectedTab] = useState('featured');

  useEffect(() => {
    // Fetch basic info for featured repos
    async function fetchFeaturedRepos() {
      setIsLoadingFeatured(true);
      try {
        const githubClient = createGitHubClient();
        const repoDetails = await Promise.all(
          FEATURED_REPOS.map(async repo => {
            try {
              const details = await githubClient.getRepo(repo.owner, repo.name);
              return details;
            } catch (error) {
              console.error(
                `Error fetching ${repo.owner}/${repo.name}:`,
                error
              );
              return { ...repo, stars: 0, forks: 0 };
            }
          })
        );
        setFeaturedRepos(repoDetails);
      } catch (error) {
        console.error('Error fetching featured repos:', error);
      } finally {
        setIsLoadingFeatured(false);
      }
    }

    // Fetch user's saved repositories
    async function fetchUserRepos() {
      if (session?.user) {
        setIsLoadingUserRepos(true);
        try {
          const response = await getRepositories(session.user.id);
          if (response.success) {
            setUserRepos(response.data);
          }
        } catch (error) {
          console.error('Error fetching user repositories:', error);
        } finally {
          setIsLoadingUserRepos(false);
        }
      }
    }

    fetchFeaturedRepos();
    fetchUserRepos();
  }, [session]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Use GitHub API to search for repositories
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          searchQuery
        )}+language:typescript+language:javascript&sort=stars&order=desc`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Error searching repositories:', error);
    } finally {
      setIsSearching(false);
    }
  }

  function renderRepositoryCard(repo: any) {
    return (
      <Card key={repo.id} className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Github className="h-5 w-5 mr-2" />
            <span className="truncate">
              {repo.owner?.login || repo.owner}/{repo.name}
            </span>
          </CardTitle>
          <CardDescription className="line-clamp-2 h-10">
            {repo.description || 'No description provided'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              <span>{repo.stargazers_count || repo.stars || 0}</span>
            </div>
            <div className="flex items-center">
              <GitFork className="h-4 w-4 mr-1" />
              <span>{repo.forks_count || repo.forks || 0}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href={`/repositories/${repo.owner?.login || repo.owner}/${
              repo.name
            }`}
            className="w-full"
          >
            <Button variant="default" className="w-full">
              Explore Repository
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Explore GitHub Repositories</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Search for any GitHub repository or choose from our curated selections
          to start your journey to mastery.
        </p>
      </div>

      <div className="mb-8">
        <form
          onSubmit={handleSearch}
          className="flex space-x-2 max-w-2xl mx-auto"
        >
          <Input
            type="text"
            placeholder="Search for a repository (e.g., facebook/react)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      <Tabs
        defaultValue="featured"
        className="mb-8"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="search" disabled={searchResults.length === 0}>
            Search Results
          </TabsTrigger>
          <TabsTrigger value="yours" disabled={userRepos.length === 0}>
            Your Repositories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFeatured
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="h-[200px] animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      </CardContent>
                      <CardFooter>
                        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </CardFooter>
                    </Card>
                  ))
              : featuredRepos.map(repo => renderRepositoryCard(repo))}
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(repo => renderRepositoryCard(repo))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No search results to display. Try searching for repositories
              above.
            </p>
          )}
        </TabsContent>

        <TabsContent value="yours" className="mt-6">
          {isLoadingUserRepos ? (
            <div className="text-center">Loading your repositories...</div>
          ) : userRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRepos.map(repo => renderRepositoryCard(repo))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              You haven't saved any repositories yet. Explore featured
              repositories or search for ones you're interested in.
            </p>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(category => (
            <Button
              key={category.id}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center text-center"
              onClick={() => {
                setSearchQuery(category.name.toLowerCase());
                handleSearch(new Event('submit') as any);
                setSelectedTab('search');
              }}
            >
              <span className="text-lg font-medium">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
