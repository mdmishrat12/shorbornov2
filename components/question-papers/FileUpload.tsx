// components/question-papers/FileUpload.tsx
'use client';

import { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onParseComplete: (questions: any[]) => void;
}

export function FileUpload({ onFileUpload, onParseComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setUploading(true);
    onFileUpload(file);

    try {
      // Parse PDF file (you'll need to implement or use a service)
      const questions = await parsePDFFile(file);
      onParseComplete(questions);
    } catch (error) {
      console.error('Error parsing file:', error);
    } finally {
      setUploading(false);
    }
  };

  // Mock PDF parser - implement with actual library
  const parsePDFFile = async (file: File): Promise<any[]> => {
    // Implement with pdf-parse or external service
    return [];
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-4xl">📄</div>
          <div>
            <h3 className="font-medium text-gray-700">Upload Question Paper</h3>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop a PDF file or click to browse
            </p>
          </div>
          
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <button
              className={`px-6 py-2 rounded-lg border ${
                uploading
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={uploading}
            >
              {uploading ? 'Processing...' : 'Browse Files'}
            </button>
          </div>
          
          <p className="text-xs text-gray-400">
            Supported formats: PDF, DOCX, TXT (Max: 10MB)
          </p>
        </div>
      </div>

      {/* Sample Template Download */}
      <div className="mt-4 text-center">
        <a
          href="/templates/question-paper-template.docx"
          download
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Download sample template
        </a>
        <p className="text-xs text-gray-500 mt-1">
          Use our template for easier formatting
        </p>
      </div>
    </div>
  );
}