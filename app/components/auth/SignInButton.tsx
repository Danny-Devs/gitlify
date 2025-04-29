'use client';

import { signIn } from 'next-auth/react';
import { ButtonHTMLAttributes } from 'react';

interface SignInButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider?: string;
  callbackUrl?: string;
}

export function SignInButton({
  provider = 'github',
  callbackUrl = '/',
  className,
  children = 'Sign in',
  ...props
}: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn(provider, { callbackUrl })}
      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
