'use client';

import Link from 'next/link';
import ThemeToggle from '../../theme/ThemeToggle';

interface HeaderProps {
  showNavigation?: boolean;
}

export default function Header({ showNavigation = true }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Gist of Git
              </h1>
            </Link>

            {showNavigation && (
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                <Link
                  href="/repositories"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Repositories
                </Link>
                <Link
                  href="/analyses"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Analyses
                </Link>
                <Link
                  href="/templates"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Templates
                </Link>
                <Link
                  href="/settings"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Settings
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
