import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'uploading' | 'processing';
}

export function ProcessingStatus({ status }: ProcessingStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <p className="text-lg font-medium text-gray-700">
        {status === 'uploading' ? 'Uploading your menu...' : 'Analyzing menu contents...'}
      </p>
      <p className="text-sm text-gray-500">
        {status === 'uploading' 
          ? 'This should only take a moment'
          : 'We\'re identifying vegetarian and vegan dishes'}
      </p>
    </div>
  );
}