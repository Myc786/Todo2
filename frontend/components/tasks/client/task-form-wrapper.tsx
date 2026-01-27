'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { taskApi } from '@/lib/api';
import TaskForm from '../task-form';

export default function TaskFormWrapper() {
  const { token } = useAuth();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTaskSubmit = async (taskData: { title: string; description: string }) => {
    if (!token) {
      setError('You must be logged in to create a task');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await taskApi.create(taskData, token);

      if (result.success) {
        setShowSuccess(true);
        setError(null);

        // Reset success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          router.push('/'); // Redirect to dashboard after successful creation
          router.refresh(); // Refresh to update the task list
        }, 2000);
      } else {
        setError(result.error || 'Failed to create task');
      }
    } catch (err) {
      setError('An error occurred while creating the task');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md animate-fadeIn">
          Task created successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md animate-fadeIn">
          {error}
        </div>
      )}

      <TaskForm onSubmit={handleTaskSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}