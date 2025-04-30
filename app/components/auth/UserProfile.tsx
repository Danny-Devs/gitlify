'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/components/ui/avatar';
import { ChevronDown, Bell } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { useToast } from '@/app/components/ui/use-toast';

export function UserProfile() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  // Show welcome toast when user signs in
  useEffect(() => {
    // Check if user just signed in by looking for a session and checking localStorage
    if (status === 'authenticated' && !localStorage.getItem('welcomed')) {
      setShowWelcomeToast(true);
      localStorage.setItem('welcomed', 'true');

      // Clear the welcome flag after 1 minute to allow it to show again on next session
      setTimeout(() => {
        localStorage.removeItem('welcomed');
      }, 60000);
    }
  }, [status]);

  // Show welcome toast
  useEffect(() => {
    if (showWelcomeToast && session?.user) {
      toast({
        title: `Welcome, ${session.user.name || 'User'}!`,
        description: "You're now signed in to Gitlify.",
        duration: 5000
      });
      setShowWelcomeToast(false);
    }
  }, [showWelcomeToast, session, toast]);

  if (status === 'loading') {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session?.user) {
    return null;
  }

  const { user } = session;
  const userInitials = user.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage
                src={user.image || ''}
                alt={user.name || 'User profile'}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/repositories">My Repositories</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/prds">My PRDs</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton className="w-full text-left" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
