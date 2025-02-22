import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { ImageUpload } from './components/ImageUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { AnalysisResults } from './components/AnalysisResults';
import { createLLMProvider, type LLMProviderType } from './lib/llm';
import type { AnalysisState, ImageFile } from './types';

function App() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle'
  });
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [provider] = useState<LLMProviderType>('deepseek');

  const handleImageSelect = async (file: File) => {
    const imageFile = file as ImageFile;
    imageFile.preview = URL.createObjectURL(file);
    setSelectedImage(imageFile);
    
    try {
      setAnalysisState({ status: 'uploading' });
      
      // Initialize Tesseract.js worker
      const worker = await createWorker('eng');
      
      // Perform OCR on the uploaded image
      const { data: { text } } = await worker.recognize(imageFile);
      await worker.terminate();
      
      if (!text.trim()) {
        throw new Error('No text could be extracted from the image');
      }
      
      setAnalysisState({ status: 'processing' });
      const llm = createLLMProvider(provider);
      const results = await llm.analyzeMenu(text);
      
      setAnalysisState({ 
        status: 'complete',
        results
      });
    } catch (error) {
      setAnalysisState({ 
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to analyze menu'
      });
    }
  };

  const handleReset = () => {
    setAnalysisState({ status: 'idle' });
    setSelectedImage(null);
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vegetarian Menu Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Upload a menu photo to identify vegetarian and vegan dishes
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {analysisState.status === 'idle' && (
            <ImageUpload onImageSelect={handleImageSelect} />
          )}

          {(analysisState.status === 'uploading' || analysisState.status === 'processing') && (
            <ProcessingStatus status={analysisState.status} />
          )}

          {selectedImage?.preview && analysisState.status !== 'idle' && (
            <div className="w-full max-w-md">
              <img
                src={selectedImage.preview}
                alt="Selected menu"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {analysisState.status === 'complete' && analysisState.results && (
            <>
              <AnalysisResults results={analysisState.results} />
              <button
                onClick={handleReset}
                className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Upload New Menu
              </button>
            </>
          )}

          {analysisState.status === 'error' && (
            <div className="text-center text-red-600">
              <p className="text-lg font-medium">
                {analysisState.error || 'An error occurred while analyzing the menu'}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;