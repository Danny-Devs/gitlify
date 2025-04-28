'use client';

import { useState, useEffect } from 'react';

/**
 * Component for configuring API requests
 */
export default function RequestConfigForm({
  config,
  onConfigChange,
  onSendRequest,
  onSaveTemplate,
  onSelectTemplate,
  onDeleteTemplate,
  isSending,
  templates = [],
  templateName,
  onTemplateNameChange
}) {
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [activeTab, setActiveTab] = useState('params');
  const [jsonError, setJsonError] = useState(null);

  // Available HTTP methods
  const httpMethods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS',
    'HEAD'
  ];

  // Authentication types
  const authTypes = [
    { value: 'none', label: 'No Auth' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'apiKey', label: 'API Key' }
  ];

  // API Key locations
  const apiKeyLocations = [
    { value: 'header', label: 'Header' },
    { value: 'query', label: 'Query Parameter' }
  ];

  // Check if JSON is valid
  useEffect(() => {
    if (
      config.body &&
      config.headers['content-type']?.includes('application/json')
    ) {
      try {
        JSON.parse(config.body);
        setJsonError(null);
      } catch (err) {
        setJsonError(err.message);
      }
    } else {
      setJsonError(null);
    }
  }, [config.body, config.headers]);

  // Update a specific field in the config object
  const updateConfig = (field, value) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  // Update a nested field in the auth object
  const updateAuthConfig = (field, value) => {
    onConfigChange({
      ...config,
      auth: {
        ...config.auth,
        [field]: value
      }
    });
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    onSendRequest();
  };

  // Add a new header field
  const addHeader = () => {
    const updatedHeaders = { ...config.headers, '': '' };
    updateConfig('headers', updatedHeaders);
  };

  // Remove a header field
  const removeHeader = keyToRemove => {
    const updatedHeaders = { ...config.headers };
    delete updatedHeaders[keyToRemove];
    updateConfig('headers', updatedHeaders);
  };

  // Update a header key or value
  const updateHeader = (oldKey, newKey, value) => {
    const updatedHeaders = { ...config.headers };

    // If the key changed, remove the old key
    if (oldKey !== newKey && oldKey !== '') {
      delete updatedHeaders[oldKey];
    }

    // Set the new key-value pair
    updatedHeaders[newKey] = value;
    updateConfig('headers', updatedHeaders);
  };

  // Handle changes to request method
  const handleMethodChange = e => {
    updateConfig('method', e.target.value);
  };

  // Handle changes to request URL
  const handleUrlChange = e => {
    updateConfig('url', e.target.value);
  };

  // Handle changes to request body
  const handleBodyChange = e => {
    updateConfig('body', e.target.value);
  };

  // Handle changes to authentication type
  const handleAuthTypeChange = e => {
    updateAuthConfig('type', e.target.value);
  };

  // Handle changes to authentication details
  const handleAuthChange = (field, value) => {
    updateAuthConfig(field, value);
  };

  // Handle changes to headers
  const handleHeaderChange = (e, key) => {
    const newHeaders = { ...config.headers };

    if (e.target.value === '') {
      delete newHeaders[key];
    } else {
      newHeaders[key] = e.target.value;
    }

    updateConfig('headers', newHeaders);
  };

  // Handle adding common content-type headers
  const addContentTypeHeader = contentType => {
    updateConfig('headers', {
      ...config.headers,
      'content-type': contentType
    });
  };

  return (
    <div className="space-y-4">
      {/* Template selector */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-end">
        <div className="flex-grow">
          <label
            htmlFor="template-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Request Templates
          </label>
          <select
            id="template-select"
            className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value=""
            onChange={e => {
              if (e.target.value) {
                onSelectTemplate(e.target.value);
              }
            }}
          >
            <option value="">Select a template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Only show delete button when a template is selected */}
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/40 disabled:opacity-50"
          onClick={onDeleteTemplate}
          disabled={!templates.length}
        >
          Delete Template
        </button>
      </div>

      {/* URL and method */}
      <div className="flex space-x-2">
        <div className="w-28">
          <select
            className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={config.method}
            onChange={handleMethodChange}
          >
            {httpMethods.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-grow">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://api.example.com/data"
            value={config.url}
            onChange={handleUrlChange}
          />
        </div>

        <button
          type="button"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSendRequest}
          disabled={isSending || !config.url}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b dark:border-gray-700">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'params'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('params')}
          >
            Params
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'auth'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('auth')}
          >
            Auth
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
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        {activeTab === 'params' && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Query parameters should be included in the URL. For example:
              https://api.example.com/data?param1=value1&param2=value2
            </p>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Authentication Type
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.auth?.type || 'none'}
                onChange={handleAuthTypeChange}
              >
                {authTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {config.auth?.type === 'bearer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Token
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bearer token"
                  value={config.auth?.token || ''}
                  onChange={e => handleAuthChange('token', e.target.value)}
                />
              </div>
            )}

            {config.auth?.type === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username"
                    value={config.auth?.username || ''}
                    onChange={e => handleAuthChange('username', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
                    value={config.auth?.password || ''}
                    onChange={e => handleAuthChange('password', e.target.value)}
                  />
                </div>
              </div>
            )}

            {config.auth?.type === 'apiKey' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="API Key Name (e.g. 'x-api-key')"
                    value={config.auth?.keyName || ''}
                    onChange={e => handleAuthChange('keyName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key Value
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="API Key Value"
                    value={config.auth?.keyValue || ''}
                    onChange={e => handleAuthChange('keyValue', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Add To
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={config.auth?.location || 'header'}
                    onChange={e => handleAuthChange('location', e.target.value)}
                  >
                    {apiKeyLocations.map(loc => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => addContentTypeHeader('application/json')}
              >
                + JSON
              </button>
              <button
                type="button"
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() =>
                  addContentTypeHeader('application/x-www-form-urlencoded')
                }
              >
                + Form URL Encoded
              </button>
              <button
                type="button"
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => addContentTypeHeader('multipart/form-data')}
              >
                + Form Data
              </button>
              <button
                type="button"
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => addContentTypeHeader('text/plain')}
              >
                + Text
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(config.headers).map(([key, value], index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    className="w-1/3 px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Header name"
                    value={key}
                    onChange={e => updateHeader(key, e.target.value, value)}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Header value"
                    value={value}
                    onChange={e => updateHeader(key, key, e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => removeHeader(key)}
                  >
                    &times;
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={addHeader}
              >
                + Add Header
              </button>
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Request Body
              </label>
              <textarea
                className="w-full h-64 px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder={
                  config.headers['content-type']?.includes('application/json')
                    ? '{\n  "key": "value"\n}'
                    : 'Enter request body'
                }
                value={config.body}
                onChange={handleBodyChange}
              />
            </div>

            {jsonError && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {jsonError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save template */}
      <div className="border-t dark:border-gray-700 pt-4 flex space-x-4 items-end">
        <div className="flex-grow">
          <label
            htmlFor="template-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Template Name
          </label>
          <input
            id="template-name"
            type="text"
            className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My API Request"
            value={templateName}
            onChange={e => onTemplateNameChange(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSaveTemplate}
          disabled={!templateName || !config.url}
        >
          Save Template
        </button>
      </div>
    </div>
  );
}
