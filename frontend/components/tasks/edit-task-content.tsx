'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { taskApi } from '@/lib/api';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import PrioritySelector from '@/components/ui/priority-selector';
import TagInput from '@/components/ui/tag-input';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority?: string;
  due_date?: string;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  owner_id: string;
  created_at: string;
  updated_at?: string;
  tags?: Array<{
    id: string;
    name: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
  }>;
}

interface EditTaskContentProps {
  taskId: string;
}

export default function EditTaskContent({ taskId }: EditTaskContentProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [taskNotFound, setTaskNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    recurrence_pattern: '',
    recurrence_end_date: '',
    tag_ids: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTask = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setTaskNotFound(false); // Reset the not found flag

        const result = await taskApi.getById(taskId, token);

        if (result.success && result.data) {
          const fetchedTask = result.data;
          setTask(fetchedTask);

          // Initialize form data with task data
          setFormData({
            title: fetchedTask.title || '',
            description: fetchedTask.description || '',
            priority: fetchedTask.priority || 'medium',
            due_date: fetchedTask.due_date || '',
            recurrence_pattern: fetchedTask.recurrence_pattern || '',
            recurrence_end_date: fetchedTask.recurrence_end_date || '',
            tag_ids: fetchedTask.tags ? fetchedTask.tags.map(tag => tag.id) : [],
          });
        } else {
          // If the API returns a 404 or similar error, set task not found
          if (result.status === 404) {
            setTaskNotFound(true);
          }
          console.error('Failed to fetch task:', result.error);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        // Check if it's a 404 error
        if (error instanceof Error && error.message.includes('404')) {
          setTaskNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTask();
    }
  }, [taskId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.due_date && isNaN(Date.parse(formData.due_date))) {
      newErrors.due_date = 'Invalid date format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('You must be logged in to update a task');
      return;
    }

    if (validate()) {
      setIsSubmitting(true);

      try {
        const result = await taskApi.update(
          taskId,
          {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            due_date: formData.due_date || undefined,
            recurrence_pattern: formData.recurrence_pattern || undefined,
            recurrence_end_date: formData.recurrence_end_date || undefined,
            tag_ids: formData.tag_ids || [],
          },
          token
        );

        if (result.success) {
          router.push('/'); // Redirect to dashboard after successful update
          router.refresh(); // Refresh the page to show updated data
        } else {
          console.error('Failed to update task:', result.error);
          alert(result.error || 'Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
        alert('An error occurred while updating the task');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (taskNotFound) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Task not found</h3>
        <p className="text-gray-500">The task you're looking for doesn't exist or you don't have permission to view it.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Task not loaded</h3>
        <p className="text-gray-500">The task could not be loaded. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <Card>
      <Card.Content className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Task title"
            required
          />

          <div className="w-full">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={`flex min-h-[80px] w-full rounded-md border ${
                errors.description
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              } px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description (optional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Priority Selector */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <PrioritySelector
              value={formData.priority}
              onChange={handlePriorityChange}
              className="w-full"
            />
          </div>

          {/* Due Date */}
          <Input
            id="due_date"
            name="due_date"
            label="Due Date (optional)"
            type="datetime-local"
            value={formData.due_date}
            onChange={handleChange}
            error={errors.due_date}
            placeholder="YYYY-MM-DDTHH:MM"
          />

          {/* Recurrence Pattern */}
          <div>
            <label htmlFor="recurrence_pattern" className="block text-sm font-medium text-gray-700 mb-1">
              Recurrence Pattern (optional)
            </label>
            <select
              id="recurrence_pattern"
              name="recurrence_pattern"
              value={formData.recurrence_pattern}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.recurrence_pattern
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              } px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            >
              <option value="">No recurrence</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.recurrence_pattern && (
              <p className="mt-1 text-sm text-red-600">{errors.recurrence_pattern}</p>
            )}
          </div>

          {/* Recurrence End Date */}
          <Input
            id="recurrence_end_date"
            name="recurrence_end_date"
            label="Recurrence End Date (optional)"
            type="date"
            value={formData.recurrence_end_date}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
          />

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (optional)
            </label>
            <TagInput
              value={formData.tag_ids || []}
              onChange={(tagIds) => setFormData(prev => ({ ...prev, tag_ids: tagIds }))}
              placeholder="Add tags..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Task'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}