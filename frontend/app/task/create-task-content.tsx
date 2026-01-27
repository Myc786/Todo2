'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import TaskFormWrapper from '@/components/tasks/client/task-form-wrapper';

export default function CreateTaskContent() {
  const { isAuthenticated, loading } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          Please sign in to create tasks
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return <TaskFormWrapper />;
}