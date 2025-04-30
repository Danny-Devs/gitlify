'use client';

import Link from 'next/link';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header showNavigation={false} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Welcome to Gitlify
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform GitHub repositories into engaging audio code tours
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
              Get Started
            </button>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            How It Works
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                1. Select Repository
              </div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Choose any public GitHub repository you want to analyze and
                transform into a PRD.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                2. Generate PRD
              </div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Our intelligent system uses local LLMs to extract requirements,
                design decisions, and create architecture diagrams.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                3. Rebuild & Contribute
              </div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Use the detailed PRD to implement your own version, then
                contribute improvements back to the original project.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Gitlify?
          </h3>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-8">
              <div className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Comprehensive PRDs
              </div>
              <div className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Gitlify generates detailed Project Requirement Documents with
                chapter-based organization, extracting the "why" behind
                implementation decisions rather than just the "how." Understand
                the original intent, requirements, and design rationale behind
                any codebase.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-8">
              <div className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Visual Architecture
              </div>
              <div className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Automatically generated Mermaid diagrams visualize component
                relationships, data flows, entity relationships, and more. These
                visual aids make it easier to understand complex architectures
                and implement your own versions with confidence.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-8">
              <div className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Community Curation
              </div>
              <div className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Join a growing library of reverse-engineered PRDs that the
                community can rate, review, and improve. Find PRDs for
                technologies you're interested in, or contribute your own
                expertise to help others learn and build better software.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
