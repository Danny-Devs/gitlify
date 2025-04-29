'use client';

import Link from 'next/link';

export default function ApiKeySummary({ apiKeys, isLoading }) {
  // Get the most recent keys (up to 2)
  const recentKeys = [...apiKeys]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            API Keys
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isLoading
              ? 'Loading keys...'
              : apiKeys.length > 0
              ? `You have ${apiKeys.length} API ${
                  apiKeys.length === 1 ? 'key' : 'keys'
                } configured`
              : 'Create your first API key to get started'}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-3 py-2 border border-blue-300 dark:border-blue-800 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-0.5 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Key
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ) : (
        <>
          {apiKeys.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-blue-200 dark:border-blue-800/40 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No API keys yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                API keys allow you to authenticate your requests to the APIBuddy
                service.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First API Key
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Recent Keys
                </h3>
                {apiKeys.length > 2 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Showing {recentKeys.length} of {apiKeys.length} keys
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {recentKeys.map(key => (
                  <div
                    key={key.id}
                    className="flex flex-col p-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/80 border border-blue-100 dark:border-blue-900/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.type === 'prod'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400'
                            : key.type === 'test'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
                        }`}
                      >
                        {key.type.charAt(0).toUpperCase() + key.type.slice(1)}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created on {key.createdAt}
                      </div>
                    </div>

                    <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
                      {key.name}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {key.key.substring(0, 8)}
                        {'•'.repeat(8)}
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        <Link
                          href={`/dashboard?edit=${key.id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View all API keys
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
