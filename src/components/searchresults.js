import React from 'react';

export function SearchResults({ results, isLoading }) {
  // Show loading spinner while searching
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Searching documents...</p>
      </div>
    );
  }

  // Show message when no results are found
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results found
      </div>
    );
  }

  return (
    // Display search results with spacing between items
    <div className="space-y-6">
      {results.map((result, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-900 mb-2">{result.documentName}</h3>
          <p className="text-gray-600">{result.excerpt}</p>
          {/* Display relevance score as percentage */}
          <div className="mt-2 text-sm text-gray-500">
            Relevance: {Math.round(result.relevanceScore * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}