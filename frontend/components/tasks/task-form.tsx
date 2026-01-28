'use client';

import { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import PrioritySelector from '@/components/ui/priority-selector';
import TagInput from '@/components/ui/tag-input';

interface TaskFormProps {
  task?: {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    priority?: string;
    due_date?: string;
    recurrence_pattern?: string;
    tag_ids?: string[];
    tags?: Array<{ id: string; name: string }>;
  };
  onSubmit: (taskData: { title: string; description: string; priority?: string; due_date?: string; recurrence_pattern?: string; recurrence_end_date?: string; tag_ids?: string[]; }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isSubmitting = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    due_date: task?.due_date || '',
    recurrence_pattern: task?.recurrence_pattern || '',
    recurrence_end_date: task?.recurrence_end_date || '',
    tag_ids: task?.tag_ids || (task?.tags ? task.tags.map(tag => tag.id) : []),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        recurrence_pattern: formData.recurrence_pattern || undefined,
        recurrence_end_date: formData.recurrence_end_date || undefined,
        tag_ids: formData.tag_ids || [],
      });
    }
  };

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
              {isSubmitting ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Create Task')}
            </Button>
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}