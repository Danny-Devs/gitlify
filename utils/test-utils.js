import React from 'react';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Create a custom render method that includes providers
export function renderWithProviders(ui, options = {}) {
  const mockSession = {
    expires: '1',
    user: { id: 'user-1', name: 'Test User', email: 'test@example.com' }
  };

  const Wrapper = ({ children }) => {
    return React.createElement(
      SessionProvider,
      { session: mockSession },
      children
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Export testing library utilities
export * from '@testing-library/react';
export { renderWithProviders as render }; 