// api.js
import axios from 'axios';

// Set the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Axios instance for reusable configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload file
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error uploading file:', error.response || error);
    throw new Error(error.response?.data?.message || 'Error uploading file');
  }
}

// Fetch documents
export async function fetchDocuments(ids) {
  try {
    const response = await api.post('/files', { ids });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error.response || error);
    throw new Error(
      error.response?.data?.message || 'Error fetching documents'
    );
  }
}

// Delete document
export async function deleteDocument(documentId) {
  try {
    await api.delete(`/files/${documentId}`);
  } catch (error) {
    console.error('Error deleting document:', error.response || error);
    throw new Error(error.response?.data?.message || 'Error deleting document');
  }
}

export async function searchDocuments(query, documentIds) {
  try {
    const response = await api.post('/search', { query, documentIds });

    return {
      results: response.data.data.results,
      totalResults: response.data.data.results.length,
    };
  } catch (error) {
    console.error('Error searching documents:', error.response || error);
    throw new Error(
      error.response?.data?.message || 'Error searching documents'
    );
  }
}

// Handle chat messages
export async function handleSendMessage(message, setMessages) {
  setMessages((prev) => [...prev, { role: 'user', content: message }]);

  try {
    const response = await api.post('/query-documents', { message });
    setMessages((prev) => [
      ...prev,
      { role: 'bot', content: response.data.reply },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { role: 'bot', content: 'Error processing your query.' },
    ]);
  }
}
