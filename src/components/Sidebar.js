import React from 'react';
import { Trash2, Eye } from 'lucide-react';

export function Sidebar({
  documents,
  onDelete,
  onClearHistory,
  onUseDocument,
}) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className='w-1/4 h-full lg:flex hidden bg-[#171717] p-4 flex-col space-y-4'>
      <h2 className='text-lg font-medium'>Document History</h2>
      <div className='flex-grow overflow-y-scroll hide-scrollbar space-y-2'>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className='bg-[#2f2f2f] rounded-lg shadow p-2 px-3 flex items-center justify-between'
          >
            <div className='flex items-center space-x-4'>
              <div>
                <h3 className='font-medium text-sm'>
                  {doc.name.length > 20
                    ? `${doc.name.slice(0, 20)}...`
                    : doc.name}
                </h3>
                <p className='text-xs mt-1 text-gray-500'>
                  {formatFileSize(doc.size)} •{' '}
                  {doc.type.trim().toUpperCase().length > 25
                    ? `${doc.type.trim().toUpperCase().slice(0, 10)}...`
                    : doc.type.trim().toUpperCase()}
                </p>
              </div>
            </div>
            <div className='flex space-x-2'>
              <a
                href={doc.url}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 text-gray-400 hover:text-blue-500 transition-colors'
                aria-label='Preview document'
              >
                <Eye className='w-5 h-5' />
              </a>
              <button
                onClick={() => onDelete(doc.id)}
                className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                aria-label='Delete document'
              >
                <Trash2 className='w-5 h-5' />
              </button>
              <button
                onClick={() => onUseDocument(doc)}
                className='p-2 text-gray-400 hover:text-green-500 transition-colors'
                aria-label='Use document'
              >
                Use
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClearHistory}
        className='bg-[#282828] text-white px-3 py-1 rounded-lg hover:bg-red-600 transition'
      >
        Clear History
      </button>
    </div>
  );
}
