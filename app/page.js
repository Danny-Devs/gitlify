"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ApiKeySummary from "./components/ApiKeySummary";
import { getApiKeys } from "./services/apiKeysService";

export default function Home() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true);
        // Get API keys from Supabase through the service
        const keys = await getApiKeys();
        setApiKeys(keys);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading API keys:", err);
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30">
      <Header />

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar activePage="overview" />

        {/* Main content area */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h1>
              </div>

              {/* Overview Card */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 dark:from-indigo-900/60 dark:via-purple-900/60 dark:to-blue-900/60 rounded-lg shadow-md overflow-hidden mb-8 border border-white/20 dark:border-indigo-800/30">
                <div className="px-6 py-5">
                  <h2 className="text-xs font-medium text-white uppercase tracking-wide">APIBuddy Dashboard</h2>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-3xl font-bold text-white">Welcome to APIBuddy</p>
                    <Link
                      href="/api-tester"
                      className="inline-flex items-center px-3 py-1.5 border border-white/30 rounded-md shadow-sm text-sm font-medium bg-white/20 text-white hover:bg-white/30 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Test API
                    </Link>
                  </div>

                  <div className="mt-4 text-white/90">
                    <p>A powerful tool for testing, monitoring, and managing API endpoints and authentication.</p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <h3 className="text-sm font-medium text-white">API Testing</h3>
                        <p className="text-xs mt-1 text-white/80">Test your API endpoints with various authentication methods</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <h3 className="text-sm font-medium text-white">API Key Management</h3>
                        <p className="text-xs mt-1 text-white/80">Create and manage API keys for secure access</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <h3 className="text-sm font-medium text-white">Request Templates</h3>
                        <p className="text-xs mt-1 text-white/80">Save and reuse common API request configurations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Keys Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                <div className="p-4 sm:p-6">
                  <ApiKeySummary
                    apiKeys={apiKeys}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
