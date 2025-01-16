import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../services/document';

export function FileUpload({ onFileUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileInput = useCallback(
    async (files) => {
      setUploading(true);
      setError(null);

      try {
        const uploadedFiles = [];
        for (const file of files) {
          if (
            file.type === 'application/pdf' ||
            file.type ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ) {
            const result = await uploadFile(file);
            uploadedFiles.push({
              id: result.id,
              name: file.name,
              size: file.size,
              type: file.type,
              url: result.url,
            });
          } else {
            setError('Only PDF and Word documents are allowed');
            return;
          }
        }
        onFileUploadComplete(uploadedFiles);
      } catch (err) {
        console.error('Upload error:', err.message);
        setError('Failed to upload files. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onFileUploadComplete]
  );

  // Set up the dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileInput(acceptedFiles),
    accept: '.pdf,.docx',
  });

  return (
    <div
      {...getRootProps()} // Spread dropzone props to the container
      className={`border-2 border-dashed ${
        uploading ? 'border-gray-100' : 'border-gray-300'
      } rounded-lg p-3 px-4 lg:mr-3 text-center transition-colors`} // Corrected className syntax
    >
      <input
        {...getInputProps()} // Spread input props for file selection
        className='hidden'
      />
      <label className='cursor-pointer flex flex-col items-center gap-4'>
        <div>
          <p className='text-xs font-medium text-gray-300'>
            {uploading ? 'Uploading...' : 'Drag and drop your documents here'}
          </p>
          {!uploading && (
            <p className='text-xs text-gray-300 mt-1'>
              or click to select files (PDF, Word)
            </p>
          )}
          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        </div>
      </label>
    </div>
  );
}
