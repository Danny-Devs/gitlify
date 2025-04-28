"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ApiKeyList from "../components/ApiKeyList";
import ApiKeyForm from "../components/ApiKeyForm";
import ThemeToggle from "../theme/theme-toggle";
import Header from "../components/Header";
import CreateApiKeyModal from "../components/CreateApiKeyModal";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch API keys
  useEffect(() => {
    // This would be replaced with actual API call
    const fetchKeys = async () => {
      try {
        setIsLoading(true);
        // Mock data for demonstration
        const mockData = [
          { id: "1", name: "Production API Key", key: "gitl_prod_xxxxxxxxxxxx", type: "prod", usage: 245, createdAt: "2023-10-15" },
          { id: "2", name: "Development API Key", key: "gitl_dev_xxxxxxxxxxxx", type: "dev", usage: 56, createdAt: "2023-11-20" },
          { id: "3", name: "Testing API Key", key: "gitl_test_xxxxxxxxxxx", type: "test", usage: 0, createdAt: "2023-12-05" },
        ];

        // Simulate API delay
        setTimeout(() => {
          setApiKeys(mockData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load API keys");
        setIsLoading(false);
      }
    };

    fetchKeys();
  }, []);

  const handleCreateKey = (newKey) => {
    // This would be replaced with actual API call
    const key = {
      id: Date.now().toString(),
      key: `gitl_${newKey.type || 'dev'}_${Math.random().toString(36).substring(2, 15)}`,
      type: newKey.type || 'dev',
      usage: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...newKey
    };

    setApiKeys([...apiKeys, key]);
    setIsFormOpen(false);
  };

  const handleUpdateKey = (updatedKey) => {
    // This would be replaced with actual API call
    setApiKeys(apiKeys.map(key =>
      key.id === updatedKey.id ? { ...key, ...updatedKey } : key
    ));
    setEditingKey(null);
    setIsFormOpen(false);
  };

  const handleDeleteKey = (id) => {
    // This would be replaced with actual API call
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const openEditForm = (key) => {
    setEditingKey(key);
    setIsFormOpen(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="px-4 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Personal</p>
                  </div>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white dark:bg-gray-900 space-y-1">
                <Link href="/" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Overview
                </Link>
                <Link href="/dashboard" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  API Keys
                </Link>
                <a href="#" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  API Playground
                </a>
                <a href="#" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Use Cases
                </a>
                <a href="#" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Billing
                </a>
                <a href="#" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Pages</Link> /
                    <span className="ml-1">API Keys</span>
                  </p>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">API Keys</h1>
                </div>

                {!isFormOpen && (
                  <button
                    onClick={openModal}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New API Key
                  </button>
                )}
              </div>

              <div className="mb-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The key is used to authenticate your requests to the Gitlify API. To learn more, see the <a href="#" className="font-medium text-blue-600 hover:text-blue-500">documentation</a> page.
                </p>
              </div>

              {isFormOpen ? (
                <ApiKeyForm
                  initialData={editingKey}
                  onSubmit={editingKey ? handleUpdateKey : handleCreateKey}
                  onCancel={() => { setIsFormOpen(false); setEditingKey(null); }}
                />
              ) : (
                isLoading ? (
                  <div className="animate-pulse">
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    {apiKeys.length === 0 ? (
                      <div className="px-4 py-5 sm:p-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No API Keys</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new API key.</p>
                        <div className="mt-6">
                          <button
                            onClick={openModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New API Key
                          </button>
                        </div>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Usage
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Key
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Options
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {apiKeys.map((apiKey) => (
                            <tr key={apiKey.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{apiKey.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Created on {apiKey.createdAt}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${apiKey.type === 'prod' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  apiKey.type === 'test' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  }`}>
                                  {apiKey.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {apiKey.usage}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                                <div className="flex items-center">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {`${apiKey.key.substring(0, 8)}${"•".repeat(16)}`}
                                  </span>
                                  <button
                                    className="ml-2 text-gray-400 hover:text-gray-500"
                                    onClick={() => navigator.clipboard.writeText(apiKey.key)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => openEditForm(apiKey)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteKey(apiKey.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateKey}
      />
    </div>
  );
} 