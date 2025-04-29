import Link from "next/link";

export default function Sidebar({ activePage }) {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-blue-100 dark:border-indigo-900/40 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="px-4 py-2 mb-2">
            <div className="flex items-center p-2 rounded-lg bg-white/80 dark:bg-gray-800/50 shadow-sm border border-blue-100/50 dark:border-blue-900/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Personal</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Developer</p>
              </div>
            </div>
          </div>

          <nav className="mt-3 flex-1 px-3 space-y-1.5">
            <Link
              href="/"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${activePage === 'overview'
                ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500 dark:border-blue-400 shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/70 hover:border-l-4 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`mr-3 flex-shrink-0 h-5 w-5 ${activePage === 'overview'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </Link>

            <Link
              href="/dashboard"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${activePage === 'api-keys'
                ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500 dark:border-blue-400 shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/70 hover:border-l-4 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`mr-3 flex-shrink-0 h-5 w-5 ${activePage === 'api-keys'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              API Keys
            </Link>

            <Link
              href="/api-tester"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${activePage === 'api-tester'
                ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500 dark:border-blue-400 shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/70 hover:border-l-4 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`mr-3 flex-shrink-0 h-5 w-5 ${activePage === 'api-tester'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              API Tester
            </Link>

            <div className="mt-6 pt-4 border-t border-blue-100 dark:border-gray-800">
              <a
                href="#"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/70 transition-all duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>

              <a
                href="#"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/70 transition-all duration-150 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help &amp; Support
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
} 