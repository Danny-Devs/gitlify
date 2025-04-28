'use client';

import { useState } from 'react';

/**
 * Component for visualizing API requests and responses
 */
export default function RequestResponseVisualizer({
  requestDetails,
  requestTime,
  responseDetails,
  responseTime,
  error
}) {
  const [activeTab, setActiveTab] = useState('body');

  // Calculate response time in milliseconds
  const calculateResponseTime = () => {
    if (!requestTime || !responseTime) return 'N/A';
    const diff = responseTime - requestTime;
    return `${diff}ms`;
  };

  // Format JSON for display
  const formatJSON = data => {
    try {
      if (typeof data === 'string') {
        // Try to parse as JSON
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } else if (data && typeof data === 'object') {
        return JSON.stringify(data, null, 2);
      }
      return data?.toString() || '';
    } catch (e) {
      // Return as-is if not valid JSON
      return data;
    }
  };

  // Get CSS class for status code
  const getStatusColorClass = status => {
    if (!status) return 'text-gray-500 dark:text-gray-400';
    if (status >= 200 && status < 300)
      return 'text-green-600 dark:text-green-400';
    if (status >= 300 && status < 400)
      return 'text-blue-600 dark:text-blue-400';
    if (status >= 400 && status < 500)
      return 'text-yellow-600 dark:text-yellow-400';
    if (status >= 500) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Determine content type for proper formatting
  const getContentType = () => {
    if (error) return 'error';
    if (!responseDetails) return 'none';

    const contentType =
      responseDetails.contentType ||
      responseDetails.headers?.['content-type'] ||
      '';
    if (contentType.includes('application/json')) return 'json';
    if (contentType.includes('text/html')) return 'html';
    if (contentType.includes('text/plain')) return 'text';
    return 'unknown';
  };

  // Format content size for display
  const formatSize = size => {
    if (!size) return 'N/A';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Render appropriate content based on content type
  const renderContent = () => {
    const contentType = getContentType();

    if (contentType === 'error') {
      return (
        <div className="rounded bg-red-50 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-200">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error?.message || 'An unknown error occurred'}</p>
          {error?.details && (
            <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
      );
    }

    if (contentType === 'none') {
      return (
        <p className="text-gray-500 dark:text-gray-400">
          No response data available
        </p>
      );
    }

    if (activeTab === 'body') {
      if (contentType === 'json') {
        return (
          <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm">
            {formatJSON(responseDetails.body)}
          </pre>
        );
      }

      if (contentType === 'html') {
        return (
          <div className="border dark:border-gray-700 rounded overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs border-b dark:border-gray-700">
              HTML Response
            </div>
            <iframe
              srcDoc={responseDetails.body}
              className="w-full h-80 bg-white"
              title="HTML Response"
            />
          </div>
        );
      }

      // Default text display
      return (
        <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">
          {responseDetails.body}
        </pre>
      );
    }

    if (activeTab === 'headers') {
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded">
          {responseDetails.headers &&
            Object.entries(responseDetails.headers).map(([key, value]) => (
              <div
                key={key}
                className="flex border-b dark:border-gray-700 last:border-0 px-4 py-2"
              >
                <div className="w-1/3 font-semibold text-gray-700 dark:text-gray-300">
                  {key}
                </div>
                <div className="w-2/3 text-gray-800 dark:text-gray-200 break-words">
                  {value}
                </div>
              </div>
            ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {/* Response Stats */}
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
            Status
          </div>
          <div
            className={`font-bold text-lg ${getStatusColorClass(
              responseDetails?.status
            )}`}
          >
            {responseDetails?.status || (error ? 'Error' : 'Pending')}
            {responseDetails?.statusText && ` ${responseDetails.statusText}`}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
            Method
          </div>
          <div className="font-bold text-lg">{requestDetails?.method}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
            Size
          </div>
          <div className="font-bold text-lg">
            {responseDetails?.size ? formatSize(responseDetails.size) : 'N/A'}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
            Time
          </div>
          <div className="font-bold text-lg">
            {responseDetails?.duration
              ? `${responseDetails.duration}ms`
              : calculateResponseTime()}
          </div>
        </div>
      </div>

      {/* Response URL */}
      <div className="mb-4 break-all bg-gray-50 dark:bg-gray-800 p-4 rounded">
        <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
          URL
        </div>
        <div>{requestDetails?.url}</div>
      </div>

      {/* Response Tabs */}
      <div className="border-b dark:border-gray-700 mb-4">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'body'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('body')}
          >
            Body
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'headers'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('headers')}
          >
            Headers
          </button>
        </div>
      </div>

      {/* Response Content */}
      <div>{renderContent()}</div>
    </div>
  );
}
