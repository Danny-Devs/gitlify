import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/app/components/ui/toaster';

// Create a custom render method that includes providers
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    // Mock session data
    const mockSession = {
      expires: '1',
      user: { id: 'user-1', name: 'Test User', email: 'test@example.com' }
    };

    return (
      <SessionProvider session={mockSession}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </SessionProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Export testing library utilities
export * from '@testing-library/react';
export { renderWithProviders as render };
