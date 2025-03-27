"use client"
import React, { useState, useRef } from 'react'
import axios from 'axios'
import { apiUrl } from '@/constants/constants'

const Planilla = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('idle');
      setStatusMessage('');
    }
  };

  const getSignedUrl = async (file: File) => {
    try {
      const fileName = file.name;
      const fileType = file.type;
      
      const response = await axios.get(
        `${apiUrl}/upload`,
        {
          params: {
            fileName,
            fileType
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  };

  const uploadToS3 = async (uploadUrl: string, file: File) => {
    try {
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage('Ningún archivo seleccionado');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('loading');
      setStatusMessage('Obteniendo URL firmada...');

      // Obtener URL firmada
      const { uploadUrl, fileKey, maxFileSize } = await getSignedUrl(selectedFile);
      
      // Verificar el tamaño del archivo
      if (selectedFile.size > maxFileSize) {
        throw new Error(`El archivo es demasiado grande. Tamaño máximo: ${maxFileSize / 1024 / 1024}MB`);
      }

      setStatusMessage('Subiendo archivo a S3...');
      
      // Subir archivo a S3
      await uploadToS3(uploadUrl, selectedFile);
      
      setUploadStatus('success');
      setStatusMessage(`Archivo "${fileKey}" subido exitosamente`);
    } catch (error) {
      console.error('Error en el proceso de carga:', error);
      setUploadStatus('error');
      setStatusMessage(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Subir Planilla de Números</h2>
      
      <div className="flex items-center space-x-3 mb-5">
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          accept=".csv,.xlsx,.xls"
        />
        <button 
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-md border border-gray-700 transition-colors duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose File
        </button>
        <span className="text-gray-400">
          {selectedFile ? selectedFile.name : 'No file chosen'}
        </span>
      </div>
      
      <button 
        className={`py-2 px-6 rounded-md font-medium transition-colors duration-200 ${
          isUploading || !selectedFile
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 text-white'
        }`}
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
      >
        {isUploading ? 'Subiendo...' : 'Upload File'}
      </button>
      
      {statusMessage && (
        <div 
          className={`mt-4 p-3 rounded-md ${
            uploadStatus === 'success' 
              ? 'bg-green-900/50 text-green-400 border border-green-800' 
              : uploadStatus === 'error' 
                ? 'bg-red-900/50 text-red-400 border border-red-800' 
                : 'bg-blue-900/50 text-blue-400 border border-blue-800'
          }`}
        >
          {statusMessage}
        </div>
      )}
      
      <div className="text-right mt-5">
        <span className="text-gray-400 font-semibold">Planilla</span>
      </div>
    </div>
  )
}

export default Planilla