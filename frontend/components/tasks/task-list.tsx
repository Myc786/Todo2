'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { taskApi } from '@/lib/api';
import TaskItem from './task-item';

export default function TaskList() {
  const { token, isAuthenticated, loading } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTasks();
    } else {
      setTasks([]);
      setFetching(false);
    }
  }, [isAuthenticated, token]);

  const fetchTasks = async () => {
    if (!token) return;

    try {
      setFetching(true);
      const result = await taskApi.getAll(token);

      if (result.success) {
        setTasks(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('An error occurred while fetching tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setFetching(false);
    }
  };

  // Show loading state while checking auth
  if (loading || (isAuthenticated && fetching)) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
          <svg
            className="h-12 w-12 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-900">Please sign in</h3>
        <p className="mt-1 text-sm text-gray-500">Log in to see your tasks.</p>
      </div>
    );
  }

  // Show error if there was an error fetching tasks
  if (error) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="inline-block p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-full mb-4">
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-900">Error loading tasks</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={fetchTasks}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show empty state if no tasks
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4 animate-bounce">
          <svg
            className="h-12 w-12 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-900 animate-pulse">No tasks yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
        <div className="mt-6">
          <a
            href="/task"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-lg text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Task
          </a>
        </div>
      </div>
    );
  }

  return (
    <ul className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl">
      {tasks.map((task, index) => (
        <div key={task.id} className={`transition-all duration-300 ${index === 0 ? 'pt-2' : ''} ${index === tasks.length - 1 ? 'pb-2' : ''}`}>
          <TaskItem task={task} onTaskUpdate={fetchTasks} />
        </div>
      ))}
    </ul>
  );
}