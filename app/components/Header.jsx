'use client';

import Link from 'next/link';
import ThemeToggle from '../theme/theme-toggle';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 border-b border-blue-100 dark:border-indigo-900/40 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center pl-2">
            {mounted && (
              <div className="h-8 w-8 mr-1 flex items-center">
                {resolvedTheme === 'dark' ? (
                  <img
                    src="/apibuddy-logo-dark.svg"
                    alt="APIBuddy Logo"
                    className="h-full w-full"
                  />
                ) : (
                  <img
                    src="/apibuddy-logo-light.svg"
                    alt="APIBuddy Logo"
                    className="h-full w-full"
                  />
                )}
              </div>
            )}
            <Link
              href="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-300 dark:hover:to-indigo-300"
            >
              APIBuddy
            </Link>
          </div>
          <div className="flex items-center pr-2">
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded-full text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none transition-colors">
                <span className="sr-only">View notifications</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
