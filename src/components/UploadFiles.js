// uploads files 
// src/components/Upload.js
import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const Upload = () => {
  const onDrop = (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('files', file);
    });

    axios.post('/api/upload', formData)
      .then(response => {
        console.log('Files uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading files:', error);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className='m-4 bg-black' {...getRootProps()}>
      <input className='m-4 bg-black' {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default Upload;
