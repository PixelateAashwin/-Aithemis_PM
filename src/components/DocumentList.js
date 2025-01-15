import React from 'react';
import { Trash2, Eye } from 'lucide-react';

export function DocumentList({ documents, deleting, onDelete }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className='space-y-4 overflow-y-scroll hide-scrollbar'>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className='bg-[#2f2f2f] rounded-lg shadow p-4 flex items-center justify-between'
        >
          <div className='flex items-center space-x-4'>
            <div>
              <h3 className='font-medium'>{doc.name}</h3>
              <p className='text-sm text-gray-500'>
                {formatFileSize(doc.size)} • {doc.type.toUpperCase()}
              </p>
            </div>
          </div>

          <div className='flex space-x-2'>
            {/* Eye Icon for preview */}
            <a
              href={doc.url}
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 text-gray-400 hover:text-blue-500 transition-colors'
              aria-label='Preview document'
            >
              <Eye className='w-5 h-5' />
            </a>

            {/* Delete button */}
            <button
              onClick={() => onDelete(doc.id)}
              className='p-2 text-gray-400 hover:text-red-500 transition-colors'
              aria-label='Delete document'
            >
              {deleting === doc.id ? (
                'Deleting...'
              ) : (
                <Trash2 className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
