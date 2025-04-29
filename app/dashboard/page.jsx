'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApiKeyForm from '../components/ApiKeyForm.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import CreateApiKeyModal from '../components/CreateApiKeyModal.jsx';
import ApiKeySection from '../components/ApiKeySection.jsx';
import {
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey
} from '../services/apiKeysService';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true);
        const keys = await getApiKeys();
        setApiKeys(keys);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load API keys');
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const handleCreateKey = async newKey => {
    try {
      const createdKey = await createApiKey(newKey);
      if (createdKey) {
        setApiKeys([...apiKeys, createdKey]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating API key:', error);
      setError('Failed to create API key');
    }
  };

  const handleUpdateKey = async updatedKey => {
    try {
      const success = await updateApiKey(updatedKey);
      if (success) {
        setApiKeys(
          apiKeys.map(key =>
            key.id === updatedKey.id ? { ...key, ...updatedKey } : key
          )
        );
      }
      setEditingKey(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating API key:', error);
      setError('Failed to update API key');
    }
  };

  const handleDeleteKey = async id => {
    try {
      const success = await deleteApiKey(id);
      if (success) {
        setApiKeys(apiKeys.filter(key => key.id !== id));
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      setError('Failed to delete API key');
    }
  };

  const openEditForm = key => {
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
        <Sidebar activePage="api-keys" />

        {/* Main content area */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {isFormOpen ? (
                <>
                  <div className="flex items-center mb-6">
                    <Link
                      href="/dashboard"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                    </Link>
                    <h1 className="ml-3 text-2xl font-semibold text-gray-900 dark:text-white">
                      {editingKey
                        ? `Edit API Key: ${editingKey.name}`
                        : 'Create New API Key'}
                    </h1>
                  </div>
                  <ApiKeyForm
                    initialData={editingKey}
                    onSubmit={editingKey ? handleUpdateKey : handleCreateKey}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setEditingKey(null);
                    }}
                  />
                </>
              ) : error ? (
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden mt-6 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <ApiKeySection
                  apiKeys={apiKeys}
                  isLoading={isLoading}
                  onCreateKey={openModal}
                  onEditKey={openEditForm}
                  onDeleteKey={handleDeleteKey}
                  showBreadcrumbs={true}
                  title="API Keys"
                />
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
