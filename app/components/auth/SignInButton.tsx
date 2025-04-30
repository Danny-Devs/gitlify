'use client';

import { signIn } from 'next-auth/react';
import { ButtonHTMLAttributes, useState } from 'react';

interface SignInButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider?: string;
  callbackUrl?: string;
}

export function SignInButton({
  provider = 'github',
  callbackUrl = '/repositories',
  className,
  children = 'Sign in',
  ...props
}: SignInButtonProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    localStorage.removeItem('welcomed');
    await signIn(provider, { callbackUrl });
    // Note: No need to set isSigningIn to false as the page will redirect
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer ${
        isSigningIn ? 'opacity-70' : ''
      } ${className}`}
      {...props}
    >
      {isSigningIn ? 'Signing in...' : children}
    </button>
  );
}
