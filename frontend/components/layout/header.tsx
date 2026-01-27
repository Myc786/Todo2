'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg border-b border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center">
                <div className="bg-white p-1 rounded-lg mr-3 transform transition-transform duration-300 group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">Todo App</span>
              </div>
            </Link>
          </div>
          <nav className="ml-6 flex space-x-2">
            <Link
              href="/"
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-white text-blue-600 shadow-md scale-105'
                  : 'text-white hover:bg-blue-500/50 hover:scale-105'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/task"
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === '/task'
                      ? 'bg-white text-blue-600 shadow-md scale-105'
                      : 'text-white hover:bg-blue-500/50 hover:scale-105'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Task
                </Link>

                <div className="relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white">
                  <span className="mr-2">Welcome, {user?.email || 'User'}!</span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === '/login'
                      ? 'bg-white text-blue-600 shadow-md scale-105'
                      : 'text-white hover:bg-blue-500/50 hover:scale-105'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === '/signup'
                      ? 'bg-white text-blue-600 shadow-md scale-105'
                      : 'text-white hover:bg-blue-500/50 hover:scale-105'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}