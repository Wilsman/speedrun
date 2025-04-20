// import React from 'react';

interface ProgressBarProps {
  value: number; // Current value
  max: number;   // Maximum value
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-600 overflow-hidden">
      <div
        className="bg-amber-500 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
