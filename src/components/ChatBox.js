import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { DocumentList } from './DocumentList';

const SearchResult = ({ result, onShowMore }) => (
  <div className='bg-[#2f2f2f] rounded-lg p-4 mb-2'>
    <div className='text-sm text-gray-400 mb-2 flex justify-between'>
      <span>Page {result.metadata.page + 1}</span>
      <span>Match Score: {(result.score * 100).toFixed(1)}%</span>
    </div>

    {/* Show snippet if available, otherwise show full content */}
    <div className='text-gray-100 whitespace-pre-wrap'>
      {result.isExpanded ? result.content : result.snippet || result.content}
    </div>

    {/* Show "Show more" button if there's a snippet */}
    {result.snippet && result.snippet !== result.content && (
      <button
        className='text-blue-400 text-sm mt-2 hover:text-blue-300'
        onClick={onShowMore}
      >
        Show more
      </button>
    )}
  </div>
);

export function ChatBox({
  documents,
  onDelete,
  deleting,
  messages,
  onSendMessage,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [expandedResults, setExpandedResults] = useState({});

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';

    const handleShowMore = (resultIndex) => {
      setExpandedResults((prev) => ({
        ...prev,
        [resultIndex]: !prev[resultIndex],
      }));
    };

    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-3xl rounded-lg ${
            isUser
              ? 'bg-[#1b1b1b] mt-2 text-white'
              : 'bg-[#2f2f2f] text-gray-100'
          }`}
        >
          {isUser ? (
            <div className='px-4 py-2'>{msg.content}</div>
          ) : (
            <div className='p-2 px-4'>
              {msg.totalResults && (
                <div className='text-gray-400 mb-2'>
                  Found {msg.totalResults} results
                </div>
              )}

              {msg.content && <div className=''>{msg.content}</div>}

              {msg.results &&
                Array.isArray(msg.results) &&
                msg.results.length > 0 && (
                  <div className='space-y-2'>
                    {msg.results
                      .sort((a, b) => b.score - a.score) // Sort by score descending
                      .map((result, idx) => (
                        <SearchResult
                          key={idx}
                          result={{
                            ...result,
                            isExpanded: expandedResults[idx],
                          }}
                          onShowMore={() => handleShowMore(idx)}
                        />
                      ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-full overflow-y-scroll hide-scrollbar mx-4 mb-4 w-full bg-[#282828] rounded-lg shadow'>
      <div className='overflow-y-scroll hide-scrollbar flex-grow p-4'>
        <DocumentList
          documents={documents}
          deleting={deleting}
          onDelete={onDelete}
        />
        <div className='space-y-4'>{messages?.map(renderMessage)}</div>
        <div ref={messagesEndRef} />
      </div>

      <div className='p-4 bg-[#2f2f2f] flex items-center space-x-2 mt-auto rounded-b-lg'>
        <textarea
          className='flex-1 bg-[#2f2f2f] text-gray-100 rounded-lg px-2 py-2 focus:outline-none resize-none'
          placeholder='Type your message here...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows='1'
        />
        <button
          onClick={handleSend}
          className='text-white p-2 hover:bg-[#3f3f3f] rounded-lg transition-colors'
        >
          <Send className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
}
