'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function CreateApiKeyModal({ isOpen, onClose, onSubmit }) {
  const [keyName, setKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);
  const [keyType, setKeyType] = useState('development'); // "production" or "development"
  const { theme } = useTheme();
  const modalRef = useRef(null);

  // Handle click outside to close modal
  const handleBackdropClick = e => {
    // If clicking the backdrop (not the modal content), close the modal
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setKeyName('');
      setMonthlyLimit('');
      setIsLimitEnabled(false);
      setKeyType('development');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = e => {
    e.preventDefault();

    // Create key data object
    const newKey = {
      name: keyName,
      type: keyType === 'development' ? 'dev' : 'prod',
      limit: isLimitEnabled ? parseInt(monthlyLimit) : null
    };

    // Call the parent component's onSubmit
    if (onSubmit) {
      onSubmit(newKey);
    }

    // Reset form and close modal handled by the useEffect now
    onClose();
  };

  // Use a class on the root element that's isolated from the dark mode context
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full mx-4 overflow-hidden"
        style={{ color: '#171717' }}
      >
        <div className="p-6">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: '#171717' }}
          >
            Create a new API key
          </h2>
          <p className="text-sm mb-6" style={{ color: '#374151' }}>
            Enter a name and limit for the new API key.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="keyName"
                className="block text-sm font-medium mb-1"
                style={{ color: '#374151' }}
              >
                Key Name — A unique name to identify this key
              </label>
              <input
                type="text"
                id="keyName"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="Key Name"
                value={keyName}
                onChange={e => setKeyName(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#374151' }}
              >
                Key Type — Choose the environment for this key
              </label>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    keyType === 'production'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setKeyType('production')}
                >
                  <div className="mr-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600">
                      {keyType === 'production' && (
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-sm font-medium"
                      style={{ color: '#111827' }}
                    >
                      Production
                    </h3>
                    <p className="text-xs" style={{ color: '#4B5563' }}>
                      Rate limited to 1000 requests/minute
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    keyType === 'development'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setKeyType('development')}
                >
                  <div className="mr-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600">
                      {keyType === 'development' && (
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-sm font-medium"
                      style={{ color: '#111827' }}
                    >
                      Development
                    </h3>
                    <p className="text-xs" style={{ color: '#4B5563' }}>
                      Rate limited to 100 requests/minute
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={isLimitEnabled}
                    onChange={() => setIsLimitEnabled(!isLimitEnabled)}
                  />
                  <span className="ml-2 text-sm" style={{ color: '#374151' }}>
                    Limit monthly usage*
                  </span>
                </label>

                {isLimitEnabled && (
                  <input
                    type="number"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="1000"
                    value={monthlyLimit}
                    onChange={e => setMonthlyLimit(e.target.value)}
                    required={isLimitEnabled}
                  />
                )}

                {isLimitEnabled && (
                  <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>
                    *If the combined usage of all your keys exceeds your plan's
                    limit, all requests will be rejected.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none rounded-md"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
