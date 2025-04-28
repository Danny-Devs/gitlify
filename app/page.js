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
    try {
      setIsLoading(true);
      // Get API keys from localStorage through the service
      const keys = getApiKeys();
      setApiKeys(keys);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading API keys:", err);
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar activePage="overview" />

        {/* Main content area */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h1>
              </div>

              {/* Plan Card */}
              <div className="bg-gradient-to-r from-pink-200 via-purple-300 to-blue-300 dark:from-pink-900/40 dark:via-purple-800/40 dark:to-blue-900/40 rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-5">
                  <h2 className="text-xs font-medium text-white/90 uppercase tracking-wide">Current Plan</h2>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-3xl font-bold text-white">Developer</p>
                    <Link
                      href="#"
                      className="inline-flex items-center px-3 py-1.5 border border-white/20 rounded-md shadow-sm text-sm font-medium bg-white/20 text-white hover:bg-white/30 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Manage Plan
                    </Link>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-white/90 flex items-center">
                        API Usage
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </h3>
                      <div className="ml-auto text-sm text-white/90">0 / 1,000 Credits</div>
                    </div>
                    <div className="mt-2 w-full bg-white/20 rounded-full h-2.5">
                      <div className="bg-white h-2.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>

                    <div className="mt-4 flex items-center">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-white/90">Pay as you go</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Keys Summary */}
              <ApiKeySummary
                apiKeys={apiKeys}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
