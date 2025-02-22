import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onImageSelect(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  if (showCamera) {
    return (
      <div className="w-full max-w-xl relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button
            onClick={capturePhoto}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Take Photo
          </button>
          <button
            onClick={stopCamera}
            className="p-3 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex justify-center space-x-4">
        <button
          onClick={startCamera}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
        >
          <Camera className="w-5 h-5" />
          <span>Take Photo</span>
        </button>
        <span className="flex items-center text-gray-500">or</span>
        <div 
          {...getRootProps()} 
          className={`
            flex-1 p-6 border-2 border-dashed rounded-lg cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            transition-colors duration-200
            hover:border-blue-500 hover:bg-blue-50
            flex items-center justify-center
          `}
        >
          <input {...getInputProps()} />
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 font-medium">
              {isDragActive ? 'Drop your menu here' : 'Upload Menu'}
            </span>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500">
        Supports JPEG, PNG, and HEIC formats
      </p>
    </div>
  );
}
