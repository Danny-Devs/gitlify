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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Analyze GitHub Repositories with Local LLMs
          </h2>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Grok public repositories for FREE - use your own computing power
            instead of paying for closed-source LLMs.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/repositories"
              className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            How It Works
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                1. Choose
              </div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Select any public GitHub repository you want to analyze.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                2. Analyze
              </div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Our system uses your local LLM - zero API costs compared to
                commercial alternatives.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                3. Grok
              </div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Master any public codebase&apos;s architecture, flow, and
                patterns.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
