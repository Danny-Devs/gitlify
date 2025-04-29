'use client';

import { signOut } from 'next-auth/react';
import { ButtonHTMLAttributes } from 'react';

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function LogoutButton({ className, ...props }: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={className}
      {...props}
    >
      Sign out
    </button>
  );
}
 