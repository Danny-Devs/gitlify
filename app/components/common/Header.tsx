'use client';

import Link from 'next/link';
import ThemeToggle from '../../theme/ThemeToggle';
import { useSession } from 'next-auth/react';
import { UserProfile } from '../auth/UserProfile';
import { SignInButton } from '../auth/SignInButton';
import OllamaStatus from './OllamaStatus';

interface HeaderProps {
  showNavigation?: boolean;
}

export default function Header({ showNavigation = true }: HeaderProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Always show navigation for authenticated users
  const shouldShowNavigation = isAuthenticated || showNavigation;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              href={isAuthenticated ? '/repositories' : '/'}
              className="flex-shrink-0"
            >
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Gitlify
              </h1>
            </Link>

            {shouldShowNavigation && (
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                <Link
                  href="/repositories"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Repositories
                </Link>
                <Link
                  href="/prds"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  PRDs
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
            {isAuthenticated && <OllamaStatus />}
            <ThemeToggle />
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <SignInButton>Sign In</SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
