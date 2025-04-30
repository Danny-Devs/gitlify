'use client';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header showNavigation={true} />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">About Gitlify</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <h2>Transform Repositories into PRDs</h2>
          <p>
            Gitlify is a revolutionary platform that uses AI to reverse-engineer comprehensive Project Requirement Documents (PRDs) from public GitHub repositories. This enables developers to understand the "why" behind implementation decisions, not just the "how".
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to help developers learn from open-source projects more effectively by providing detailed specifications that capture the essence of successful repositories. This approach fosters deeper understanding, creativity, and enables developers to rebuild projects from scratch based on requirements rather than just copying code.
          </p>
          
          <h2>Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Repository Analysis</h3>
              <p>Connect your GitHub account and analyze any public repository to extract implicit requirements and design decisions.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">PRD Generation</h3>
              <p>Generate detailed project requirements with user stories, functional specifications, and technical constraints.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Visual Diagrams</h3>
              <p>Automatically generate architecture diagrams that visualize component relationships, data flows, and entity relationships.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Community Curation</h3>
              <p>Rate, review, and discover high-quality PRDs shared by the community of developers.</p>
            </div>
          </div>
          
          <h2>How It Works</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Connect your GitHub account</strong> - Sign in with GitHub to access our platform.
            </li>
            <li>
              <strong>Select a repository</strong> - Choose any public GitHub repository you want to analyze.
            </li>
            <li>
              <strong>Generate PRD</strong> - Our AI system will analyze the codebase and create a comprehensive PRD.
            </li>
            <li>
              <strong>Explore and learn</strong> - Review the generated PRD to understand the project's requirements and architecture.
            </li>
            <li>
              <strong>Rebuild and contribute</strong> - Use the PRD to implement your own version or contribute improvements to the original project.
            </li>
          </ol>
          
          <h2>Frequently Asked Questions</h2>
          <div className="space-y-6 mt-6">
            <div>
              <h3 className="text-xl font-semibold">Is Gitlify free to use?</h3>
              <p>Yes, our core features are free for all users. We may introduce premium features in the future.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Can I analyze private repositories?</h3>
              <p>Currently, Gitlify supports analysis of public repositories only. Support for private repositories is on our roadmap.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">How accurate are the generated PRDs?</h3>
              <p>Our AI system produces high-quality PRDs, but they should be considered interpretations rather than absolute specifications. We continuously improve our algorithms based on user feedback.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Link href="/auth/signin">
            <Button size="lg" className="mr-4">
              Get Started
            </Button>
          </Link>
          <Link href="/repositories">
            <Button variant="outline" size="lg">
              Browse Repositories
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
} 