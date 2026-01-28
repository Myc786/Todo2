'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

interface PrioritySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PrioritySelector({ value, onChange, className }: PrioritySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span>Low</span>
          </div>
        </SelectItem>
        <SelectItem value="medium">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            <span>Medium</span>
          </div>
        </SelectItem>
        <SelectItem value="high">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            <span>High</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}