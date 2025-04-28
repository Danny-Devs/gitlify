'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApiKeySection({
  apiKeys,
  isLoading,
  onCreateKey,
  onEditKey,
  onDeleteKey,
  showBreadcrumbs = false,
  title = 'API Keys'
}) {
  const [showKeyStates, setShowKeyStates] = useState({});
  const [copyStates, setCopyStates] = useState({});

  const toggleShowKey = id => {
    setShowKeyStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates(prev => ({
        ...prev,
        [id]: true
      }));

      setTimeout(() => {
        setCopyStates(prev => ({
          ...prev,
          [id]: false
        }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {showBreadcrumbs ? (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Pages
              </Link>{' '}
              /<span className="ml-1">API Keys</span>
            </p>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {title}
            </h1>
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}

        <button
          onClick={onCreateKey}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-0.5 mr-1 h-4 w-4"
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
          New Key
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        The key is used to authenticate your requests to the API. To learn more,
        see the{' '}
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
          documentation
        </a>{' '}
        page.
      </p>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Loading API keys...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Usage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Key
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {apiKeys.map(apiKey => (
                <tr key={apiKey.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {apiKey.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apiKey.type === 'prod'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : apiKey.type === 'test'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {apiKey.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {apiKey.usage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    <span className="text-gray-500 dark:text-gray-400">
                      {showKeyStates[apiKey.id]
                        ? apiKey.key
                        : `${apiKey.key.substring(0, 8)}${'•'.repeat(16)}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleShowKey(apiKey.id)}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label={
                          showKeyStates[apiKey.id]
                            ? 'Hide API key'
                            : 'Show API key'
                        }
                      >
                        {showKeyStates[apiKey.id] ? (
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
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Copy API key"
                      >
                        {copyStates[apiKey.id] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
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
                        )}
                      </button>
                      <button
                        onClick={() => onEditKey && onEditKey(apiKey)}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Edit API key"
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
                      </button>
                      {onDeleteKey && (
                        <button
                          onClick={() => onDeleteKey(apiKey.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Delete API key"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {apiKeys.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No API keys found. Create your first key with the &ldquo;New
                    Key&rdquo; button.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
