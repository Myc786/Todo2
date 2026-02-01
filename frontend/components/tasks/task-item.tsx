'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { taskApi, Task } from '@/lib/api';
import Badge from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onTaskUpdate?: () => void;
}

export default function TaskItem({ task, onTaskUpdate }: TaskItemProps) {
  const { token } = useAuth();
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (!token) return;

    try {
      const result = await taskApi.toggleCompletion(task.id, token);

      if (result.success) {
        setIsCompleted(!isCompleted);
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      } else {
        setError(result.error || 'Failed to update task');
      }
    } catch (err) {
      setError('An error occurred while updating the task');
      console.error('Error toggling task:', err);
    }
  };

  const handleDelete = async () => {
    if (!token) return;

    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await taskApi.delete(task.id, token);

      if (result.success) {
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      } else {
        setError(result.error || 'Failed to delete task');
      }
    } catch (err) {
      setError('An error occurred while deleting the task');
      console.error('Error deleting task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // For now, redirect to task edit page (will need to implement)
    window.location.href = `/task/edit/${task.id}`;
  };

  return (
    <li className={`border-b border-gray-200 last:border-b-0 transition-all duration-300 hover:shadow-md ${isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-white'}`}>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 text-sm">
          {error}
        </div>
      )}
      <div className="px-4 py-4 sm:px-6 transition-colors duration-200 hover:bg-opacity-90">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              disabled={!token}
              className={`h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer transition-transform duration-200 hover:scale-110 ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <div className="ml-3">
              <p className={`text-sm font-medium transition-all duration-300 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900 hover:text-blue-700'}`}>
                {task.title}
              </p>
              <p className={`text-sm transition-all duration-300 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                {task.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Priority Badge */}
            {task.priority && (
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-1 ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></span>
                <span className="capitalize text-xs px-2 py-1 rounded bg-gray-100">
                  {task.priority}
                </span>
              </div>
            )}

            {/* Due Date Badge */}
            {task.due_date && (
              <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                {new Date(task.due_date).toLocaleDateString()}
              </div>
            )}

            {/* Recurrence Badge */}
            {task.recurrence_pattern && (
              <div className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                {task.recurrence_pattern.charAt(0).toUpperCase() + task.recurrence_pattern.slice(1)} Recurring
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <Badge variant={isCompleted ? 'success' : 'default'} className="transition-all duration-300 hover:scale-105">
              {isCompleted ? 'Completed' : 'Pending'}
            </Badge>
            <span className="text-xs text-gray-500 transition-all duration-300 hover:text-gray-700">
              {task.created_at}
            </span>
          </div>
        </div>

        {/* Task Actions */}
        <div className="mt-3 flex items-center justify-between transition-all duration-300">
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              disabled={!token}
              className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={!token || isDeleting}
              className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform ${!token || isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}