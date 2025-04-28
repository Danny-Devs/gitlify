"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ApiKeyList from "../components/ApiKeyList";
import ApiKeyForm from "../components/ApiKeyForm";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  // Fetch API keys
  useEffect(() => {
    // This would be replaced with actual API call
    const fetchKeys = async () => {
      try {
        setIsLoading(true);
        // Mock data for demonstration
        const mockData = [
          { id: "1", name: "Production API Key", key: "api_prod_xxxxxxxxxxxx", createdAt: "2023-10-15" },
          { id: "2", name: "Development API Key", key: "api_dev_xxxxxxxxxxxx", createdAt: "2023-11-20" },
          { id: "3", name: "Testing API Key", key: "api_test_xxxxxxxxxxx", createdAt: "2023-12-05" },
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
      key: `api_${Math.random().toString(36).substring(2, 15)}`,
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Key Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create, view, and manage your API keys
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              Back to Home
            </Link>
            {!isFormOpen && (
              <button
                onClick={() => { setEditingKey(null); setIsFormOpen(true); }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New API Key
              </button>
            )}
          </div>
        </div>

        {isFormOpen ? (
          <ApiKeyForm
            initialData={editingKey}
            onSubmit={editingKey ? handleUpdateKey : handleCreateKey}
            onCancel={() => { setIsFormOpen(false); setEditingKey(null); }}
          />
        ) : (
          <ApiKeyList
            apiKeys={apiKeys}
            isLoading={isLoading}
            error={error}
            onEdit={openEditForm}
            onDelete={handleDeleteKey}
          />
        )}
      </div>
    </div>
  );
} 