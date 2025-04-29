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
            Master GitHub Repositories In Record Time
          </h2>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Grok public repositories in record time with our revolutionary
            learning tools - all for FREE using your own computing power.
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
                Our intelligent system enhances local LLMs with specialized
                algorithms to extract key architectural insights.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                3. Grok
              </div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Rapidly master any codebase with our multi-layered learning
                tools that transform steep learning curves into fast-track
                comprehension.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why CodeGrok?
          </h3>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-8">
              <div className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Learning Acceleration
              </div>
              <div className="text-gray-500 dark:text-gray-400 leading-relaxed">
                CodeGrok leverages the power of LLMs to transform steep learning
                curves into fast-track comprehension through multi-layered
                explanations, architectural insights, and specialized learning
                tools that help users quickly understand code flow, patterns,
                and structure.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-8">
              <div className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Cost Efficiency
              </div>
              <div className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Users leverage their own computing resources and local LLMs
                instead of paying for expensive closed-source LLM API calls,
                making the tool completely free to use. No subscriptions, no
                usage limits, no surprise bills.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-8">
              <div className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Repository Reimagination
              </div>
              <div className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Extract detailed project requirements from existing codebases,
                then use them to build improved versions with modern best
                practices. Identify opportunities to contribute superior
                implementations back to the original projects.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
