'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignInButton } from '@/app/components/auth/SignInButton';
import Header from '@/app/components/common/Header';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header showNavigation={false} />

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            {error && (
              <div className="mt-2 text-center text-sm text-red-600">
                {error === 'OAuthCallback'
                  ? 'There was a problem with the OAuth callback. Please try again.'
                  : `An error occurred: ${error}`}
              </div>
            )}
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex justify-center">
              <SignInButton
                provider="github"
                callbackUrl={callbackUrl}
                className="w-full flex justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign in with GitHub
              </SignInButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
