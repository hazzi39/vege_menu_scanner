import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        w-full max-w-xl p-8 border-2 border-dashed rounded-lg 
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        transition-colors duration-200 cursor-pointer
        hover:border-blue-500 hover:bg-blue-50
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-4">
          <Camera className="w-8 h-8 text-gray-400" />
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? 'Drop your menu here' : 'Drag & drop a menu photo or click to select'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Supports JPEG, PNG, and HEIC formats
          </p>
        </div>
      </div>
    </div>
  );
}