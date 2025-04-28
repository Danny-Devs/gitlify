"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { executeRequest, saveRequestTemplate, getRequestTemplates, deleteRequestTemplate } from "../services/apiRequestService";
import { getApiKeys } from "../services/apiKeysService";

export default function ApiTester() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [requestTemplates, setRequestTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  // Request configuration state
  const [requestConfig, setRequestConfig] = useState({
    method: "GET",
    url: "",
    headers: {},
    body: "",
    auth: {
      type: "none",
      key: "",
      headerName: "X-API-Key"
    },
    apiKeyId: ""
  });

  // Response state
  const [response, setResponse] = useState(null);
  const [requestDuration, setRequestDuration] = useState(null);

  useEffect(() => {
    // Fetch API keys and request templates on load
    const fetchData = async () => {
      const keys = await getApiKeys();
      const templates = await getRequestTemplates();
      setApiKeys(keys);
      setRequestTemplates(templates);
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setRequestConfig({
      ...requestConfig,
      [field]: value
    });
  };

  const handleHeaderChange = (key, value) => {
    const newHeaders = { ...requestConfig.headers };

    if (value === "") {
      delete newHeaders[key];
    } else {
      newHeaders[key] = value;
    }

    setRequestConfig({
      ...requestConfig,
      headers: newHeaders
    });
  };

  const handleAuthChange = (field, value) => {
    setRequestConfig({
      ...requestConfig,
      auth: {
        ...requestConfig.auth,
        [field]: value
      }
    });
  };

  const addHeader = () => {
    const newHeaders = { ...requestConfig.headers, "": "" };
    setRequestConfig({
      ...requestConfig,
      headers: newHeaders
    });
  };

  const loadTemplate = (template) => {
    setSelectedTemplate(template);

    // Parse stored JSON data
    const headers = typeof template.headers === 'string'
      ? JSON.parse(template.headers)
      : template.headers || {};

    const body = typeof template.body === 'string'
      ? template.body
      : JSON.stringify(template.body || "");

    const authConfig = typeof template.auth_config === 'string'
      ? JSON.parse(template.auth_config)
      : template.auth_config || { type: "none", key: "", headerName: "X-API-Key" };

    setRequestConfig({
      method: template.method || "GET",
      url: template.url || "",
      headers,
      body,
      auth: authConfig,
      apiKeyId: requestConfig.apiKeyId
    });
  };

  const handleSaveTemplate = async () => {
    if (!templateName) return;

    const savedTemplate = await saveRequestTemplate(templateName, requestConfig);
    if (savedTemplate) {
      setRequestTemplates([savedTemplate, ...requestTemplates]);
      setShowSaveTemplate(false);
      setTemplateName("");
    }
  };

  const handleDeleteTemplate = async (id) => {
    const success = await deleteRequestTemplate(id);
    if (success) {
      setRequestTemplates(requestTemplates.filter(t => t.id !== id));
      if (selectedTemplate && selectedTemplate.id === id) {
        setSelectedTemplate(null);
      }
    }
  };

  const sendRequest = async () => {
    setIsLoading(true);
    setResponse(null);

    try {
      const result = await executeRequest(requestConfig);
      setResponse(result);
      setRequestDuration(result.duration);
    } catch (error) {
      setResponse({
        error: error.message,
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBody = () => {
    try {
      if (!requestConfig.body) return "";

      const parsed = JSON.parse(requestConfig.body);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return requestConfig.body;
    }
  };

  const formatResponse = (data) => {
    try {
      if (typeof data === 'string') {
        // Try to parse as JSON for pretty formatting
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } else if (typeof data === 'object') {
        return JSON.stringify(data, null, 2);
      }
      return data;
    } catch (e) {
      return data;
    }
  };

  // Common input and select styles with improved text contrast
  const inputClass = "px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white";
  const selectClass = "px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar activePage="api-tester" />

        <div className="flex-1 overflow-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">API Tester</h1>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Templates Sidebar */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Templates</h2>
                    <button
                      onClick={() => setShowSaveTemplate(!showSaveTemplate)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {showSaveTemplate ? "Cancel" : "Save Current"}
                    </button>
                  </div>

                  {showSaveTemplate && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template name"
                        className={inputClass}
                        style={{ width: "100%" }}
                      />
                      <button
                        onClick={handleSaveTemplate}
                        disabled={!templateName}
                        className="mt-2 w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  <div className="overflow-y-auto max-h-96">
                    {requestTemplates.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No saved templates yet</p>
                    ) : (
                      <ul className="space-y-2">
                        {requestTemplates.map((template) => (
                          <li
                            key={template.id}
                            className={`text-sm p-2 rounded cursor-pointer flex justify-between items-center ${selectedTemplate?.id === template.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            <div
                              className="flex-1 truncate"
                              onClick={() => loadTemplate(template)}
                            >
                              <span className="font-medium">{template.name}</span>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full mr-1">
                                  {template.method}
                                </span>
                                <span className="truncate">{template.url}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Request Panel */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Request</h2>

                    {/* Method and URL */}
                    <div className="flex mb-4">
                      <select
                        value={requestConfig.method}
                        onChange={(e) => handleInputChange('method', e.target.value)}
                        className={`${selectClass} rounded-l-md rounded-r-none`}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                        <option value="HEAD">HEAD</option>
                      </select>
                      <input
                        type="text"
                        value={requestConfig.url}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        placeholder="https://api.example.com/endpoint"
                        className={`${inputClass} flex-1 rounded-l-none rounded-r-md`}
                      />
                    </div>

                    {/* Authentication */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authentication</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <select
                            value={requestConfig.auth.type}
                            onChange={(e) => handleAuthChange('type', e.target.value)}
                            className={`${selectClass} w-full`}
                          >
                            <option value="none">None</option>
                            <option value="bearer">Bearer Token</option>
                            <option value="basic">Basic Auth</option>
                            <option value="apiKey">API Key</option>
                          </select>
                        </div>

                        {requestConfig.auth.type !== 'none' && (
                          <>
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={requestConfig.auth.key}
                                onChange={(e) => handleAuthChange('key', e.target.value)}
                                placeholder={
                                  requestConfig.auth.type === 'bearer' ? 'Bearer token' :
                                    requestConfig.auth.type === 'basic' ? 'username:password' : 'API key'
                                }
                                className={`${inputClass} w-full`}
                              />
                            </div>

                            {requestConfig.auth.type === 'apiKey' && (
                              <div className="md:col-span-1">
                                <input
                                  type="text"
                                  value={requestConfig.auth.headerName}
                                  onChange={(e) => handleAuthChange('headerName', e.target.value)}
                                  placeholder="Header name"
                                  className={`${inputClass} w-full`}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* API Key Tracking */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Log this request with API Key (optional)</h3>
                      <select
                        value={requestConfig.apiKeyId}
                        onChange={(e) => handleInputChange('apiKeyId', e.target.value)}
                        className={`${selectClass} w-full`}
                      >
                        <option value="">Don't track</option>
                        {apiKeys.map((key) => (
                          <option key={key.id} value={key.id}>
                            {key.name} ({key.key})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Headers */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Headers</h3>
                        <button
                          onClick={addHeader}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Add Header
                        </button>
                      </div>

                      {Object.keys(requestConfig.headers).length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No headers added</p>
                      ) : (
                        <div className="space-y-2">
                          {Object.entries(requestConfig.headers).map(([key, value], index) => (
                            <div key={index} className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={key}
                                onChange={(e) => {
                                  const newHeaders = { ...requestConfig.headers };
                                  delete newHeaders[key];
                                  newHeaders[e.target.value] = value;
                                  setRequestConfig({
                                    ...requestConfig,
                                    headers: newHeaders
                                  });
                                }}
                                placeholder="Header name"
                                className={`${inputClass} col-span-1`}
                              />
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => handleHeaderChange(key, e.target.value)}
                                placeholder="Value"
                                className={`${inputClass} col-span-2`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    {(requestConfig.method === 'POST' || requestConfig.method === 'PUT' || requestConfig.method === 'PATCH') && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Body</h3>
                        <textarea
                          value={requestConfig.body}
                          onChange={(e) => handleInputChange('body', e.target.value)}
                          rows={6}
                          placeholder='{"key": "value"}'
                          className={`${inputClass} w-full font-mono`}
                        />
                        <div className="text-right mt-1">
                          <button
                            onClick={() => {
                              try {
                                const formatted = formatBody();
                                handleInputChange('body', formatted);
                              } catch (e) {
                                // Ignore formatting errors
                              }
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Format JSON
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={sendRequest}
                      disabled={isLoading || !requestConfig.url}
                      className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>

                  {/* Response Panel */}
                  {response && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Response</h2>
                        <div className="text-sm">
                          <span className={response.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {response.status || (response.error ? 'Error' : 'Unknown')}
                            {response.statusText ? ` ${response.statusText}` : ''}
                          </span>
                          {requestDuration && (
                            <span className="ml-2 text-gray-500 dark:text-gray-400">
                              {Math.round(requestDuration)}ms
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Response Headers */}
                      {response.headers && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headers</h3>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md max-h-40 overflow-y-auto">
                            {Object.entries(response.headers).map(([key, value]) => (
                              <div key={key} className="text-sm mb-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{key}: </span>
                                <span className="text-gray-600 dark:text-gray-400">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Response Body */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body</h3>
                        {response.error ? (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                            <p className="text-sm text-red-700 dark:text-red-400">{response.error}</p>
                          </div>
                        ) : (
                          <pre className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md overflow-x-auto text-sm text-gray-800 dark:text-gray-200 max-h-96">
                            {formatResponse(response.data)}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 