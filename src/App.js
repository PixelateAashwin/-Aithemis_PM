import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChatBox } from './components/ChatBox';
import { Sidebar } from './components/Sidebar';
import { deleteDocument, fetchDocuments } from './services/document';
import { searchDocuments } from './services/document';

function App() {
  const [documents, setDocuments] = useState([]); // Current session documents
  const [historyDocuments, setHistoryDocuments] = useState([]); // Reference history documents
  const [messages, setMessages] = useState([]);
  const [deleting, setDeleting] = useState(null);

  // Load history documents from localStorage on mount
  useEffect(() => {
    const loadHistoryDocuments = async () => {
      try {
        const storedIds = JSON.parse(localStorage.getItem('documentIds')) || [];
        if (storedIds.length > 0) {
          const fetchedDocs = await fetchDocuments(storedIds);
          setHistoryDocuments(fetchedDocs);
        }
      } catch (error) {
        console.error('Error loading history documents:', error);
      }
    };

    loadHistoryDocuments();
  }, []);

  const updateLocalStorage = (updatedIds) => {
    localStorage.setItem('documentIds', JSON.stringify(updatedIds));
  };

  const handleFileUploadComplete = async (uploadedFiles) => {
    try {
      const updatedDocuments = [...documents, ...uploadedFiles];
      setDocuments(updatedDocuments);

      const updatedIds = [
        ...(JSON.parse(localStorage.getItem('documentIds')) || []),
        ...uploadedFiles.map((file) => file.id),
      ];

      updateLocalStorage(updatedIds);
      setHistoryDocuments((prev) => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };
  const handleDeleteDocument = async (id) => {
    setDeleting(id);
    try {
      // Call the API to delete the document
      await deleteDocument(id);

      // Update the current session documents
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));

      // Update the history documents
      const updatedHistoryDocuments = historyDocuments.filter(
        (doc) => doc.id !== id
      );
      setHistoryDocuments(updatedHistoryDocuments);

      // Update localStorage
      const updatedIds = updatedHistoryDocuments.map((doc) => doc.id);
      updateLocalStorage(updatedIds);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete the document. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('documentIds');
      setHistoryDocuments([]);
    } catch (error) {
      console.error('Error clearing document history:', error);
    }
  };

  const handleClearSingleDocument = (id) => {
    try {
      const updatedHistoryDocuments = historyDocuments.filter(
        (doc) => doc.id !== id
      );
      setHistoryDocuments(updatedHistoryDocuments);

      const updatedIds = updatedHistoryDocuments.map((doc) => doc.id);
      updateLocalStorage(updatedIds);
    } catch (error) {
      console.error('Error clearing single document from history:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!documents.length) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Please upload a document to start chatting.' },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    try {
      const response = await searchDocuments(message);
      console.log('Search results:', response.results.results);

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: 'Here are the relevant results:',
          totalResults: response.results.results.length,
          results: response.results.results, 
        },
      ]);
    } catch (error) {
      console.error('Error processing search query:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Error processing your query.' },
      ]);
    }
  };

  return (
    <div className='h-screen flex bg-[#212121] text-gray-100'>
      <Sidebar
        documents={historyDocuments}
        onDelete={handleClearSingleDocument}
        onClearHistory={handleClearHistory}
      />
      <div className='flex mx-2 flex-col flex-grow items-center'>
        <div className='flex w-full shadow flex-col'>
          <div className='bg-[#282828] py-2 rounded-lg flex lg:flex-row flex-col gap-2 lg:pl-4 my-3 items-center justify-between'>
            <h1 className='lg:text-2xl text-xl'>Welcome to Aithemis</h1>
            <FileUpload onFileUploadComplete={handleFileUploadComplete} />
          </div>
        </div>
        <ChatBox
          documents={documents}
          onDelete={handleDeleteDocument}
          deleting={deleting}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;