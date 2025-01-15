import React from 'react'; // Import the React library for building user interfaces
import { FileText, Trash2 } from 'lucide-react'; // Import icons from the lucide-react library for file and delete actions

// Define the DocumentList functional component
export function DocumentList({ documents, onDelete }) {
  // Function to format file size from bytes to a more readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'; // Return '0 Bytes' if the size is zero
    const k = 1024; // Define the conversion factor for kilobytes
    const sizes = ['Bytes', 'KB', 'MB', 'GB']; // Define the size units
    const i = Math.floor(Math.log(bytes) / Math.log(k)); // Calculate the index of the size unit
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; // Return the formatted size
  };

  // Check if there are no documents to display
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500"> {/* Centered message for no documents */}
        No documents uploaded yet
      </div>
    );
  }

  // Render the list of documents
  return (
    <div className="space-y-4"> {/* Container for spacing between document items */}
      {documents.map((doc) => ( // Map through each document in the documents array
        <div
          key={doc.id} // Unique key for each document item
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between" // Styling for the document item
        >
          <div className="flex items-center space-x-4"> {/* Flex container for document details */}
            <FileText className="w-8 h-8 text-blue-500" /> {/* Icon representing a document */}
            <div>
              <h3 className="font-medium text-gray-900">{doc.name}</h3> {/* Document name */}
              <p className="text-sm text-gray-500">
                {formatFileSize(doc.size)} • {doc.type.toUpperCase()} {/* Display formatted file size and type */}
              </p>
            </div>
          </div>
          <button
            onClick={() => onDelete(doc.id)} // Call the onDelete function with the document ID when clicked
            className="p-2 text-gray-400 hover:text-red-500 transition-colors" // Styling for the delete button
            aria-label="Delete document" // Accessibility label for the button
          >
            <Trash2 className="w-5 h-5" /> {/* Icon for the delete action */}
          </button>
        </div>
      ))}
    </div>
  );
}
