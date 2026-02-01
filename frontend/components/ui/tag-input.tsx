'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import Badge from '@/components/ui/badge';

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TagInput({ value = [], onChange, placeholder = 'Add tags...', disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag.trim())) {
      const newTags = [...value, tag.trim()];
      onChange?.(newTags);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddTag(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      const lastTag = value[value.length - 1];
      handleRemoveTag(lastTag);
    }
  };

  const handleTagClick = (tag: string) => {
    if (disabled) return;
    handleRemoveTag(tag);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 min-h-10 p-2 border border-gray-300 rounded-md bg-white">
        {value.map((tag) => (
          <div
            key={tag}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-200'}`}
            onClick={() => handleTagClick(tag)}
          >
            <Badge className={`${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {tag}
              {!disabled && (
                <span className="ml-1 text-xs font-bold">×</span>
              )}
            </Badge>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          className={`flex-grow min-w-[100px] border-0 outline-none bg-transparent text-sm ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Press Enter or comma to add tags, click on a tag to remove it
      </p>
    </div>
  );
}