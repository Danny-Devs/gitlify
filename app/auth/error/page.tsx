'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/common/Header';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Map error codes to more user-friendly messages
  const getErrorMessage = (errorCode: string) => {
    const errorMessages: Record<string, string> = {
      Configuration: 'There is a problem with the server configuration.',
      AccessDenied: 'You do not have permission to sign in.',
      Verification:
        'The verification token has expired or has already been used.',
      Default: 'Unable to sign in.',
      OAuthSignin:
        'Could not initiate OAuth sign-in. Check your OAuth provider configuration.',
      OAuthCallback:
        'Error occurred in the OAuth callback. Ensure your OAuth callback URL is correct and database is accessible.',
      OAuthCreateAccount:
        'Could not create OAuth provider user in the database.',
      EmailCreateAccount:
        'Could not create email provider user in the database.',
      Callback:
        'There was an error during the authentication callback. This could be due to database or environment configuration issues.',
      EmailSignin: 'The e-mail could not be sent.',
      CredentialsSignin:
        'Sign in failed. Check the details you provided are correct.',
      SessionRequired: 'Please sign in to access this page.'
    };

    return (
      errorMessages[errorCode] || `An unexpected error occurred: ${errorCode}`
    );
  };

  const errorMessage = error
    ? getErrorMessage(error)
    : 'An unknown error occurred';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header showNavigation={false} />

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Authentication Error
            </h2>
            <div className="mt-4 text-center text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
            <div className="mt-8 text-sm">
              <p>Troubleshooting steps:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Check that your database is running and accessible</li>
                <li>Verify your GitHub OAuth configuration and callback URL</li>
                <li>Ensure your environment variables are set correctly</li>
                <li>Check that your database schema is up to date</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500">
              Return to Home
            </Link>
            <span className="mx-3">•</span>
            <Link
              href="/auth/signin"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Try Again
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
