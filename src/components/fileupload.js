import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

export function FileUpload({ onFileSelect }) {
  // Prevent default drag behavior and stop event propagation
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle file drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  // Handle file selection through input element
  const handleFileInput = useCallback((e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  return (
    // Drag and drop container with visual feedback
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden file input for traditional file selection */}
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileInput}
        multiple
        accept=".pdf,.doc,.docx"
      />
      {/* Custom styled label acting as the upload button */}
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center gap-4"
      >
        <Upload className="w-12 h-12 text-gray-400" />
        <div>
          <p className="text-lg font-medium text-gray-700">
            Drag and drop your documents here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to select files (PDF, Word)
          </p>
        </div>
      </label>
    </div>
  );
}