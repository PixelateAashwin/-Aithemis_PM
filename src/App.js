import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/fileupload'
import { DocumentList } from './components/Document list';
import { SearchBar } from './components/searchbar';
import { SearchResults } from './components/searchresults';
import { Search } from 'lucide-react';

function App() {
  // State management for documents, search results, and loading state
  const [documents, setDocuments] = useState([]); // Stores uploaded documents
  const [searchResults, setSearchResults] = useState([]); // Stores search results
  const [isSearching, setIsSearching] = useState(false); // Controls loading state during search

  // Handle file selection from the upload component
  const handleFileSelect = useCallback((files) => {
    // Convert FileList to array and create document objects
    const newDocs = Array.from(files).map((file) => ({
      id: crypto.randomUUID(), // Generate unique ID for each document
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
    }));
    // Add new documents to existing list
    setDocuments((prev) => [...prev, ...newDocs]);
  }, []);

  // Handle document deletion
  const handleDelete = useCallback((id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  // Handle search functionality
  const handleSearch = useCallback((query) => {
    setIsSearching(true);
    // Simulate search delay (to be replaced with actual API call)
    setTimeout(() => {
      const results = documents.map((doc) => ({
        documentId: doc.id,
        documentName: doc.name,
        excerpt: `Sample excerpt containing the search term "${query}"...`,
        relevanceScore: Math.random(), // Placeholder for actual relevance scoring
      }));
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  }, [documents]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section with app title */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Search className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Document Search
            </h1>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          {/* File upload section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Documents
            </h2>
            <FileUpload onFileSelect={handleFileSelect} />
          </section>

          {/* Document list section - only shown when documents exist */}
          {documents.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Documents
              </h2>
              <DocumentList
                documents={documents}
                onDelete={handleDelete}
              />
            </section>
          )}

          {/* Search section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Search Documents
            </h2>
            <SearchBar onSearch={handleSearch} />
            <div className="mt-6">
              <SearchResults
                results={searchResults}
                isLoading={isSearching}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;