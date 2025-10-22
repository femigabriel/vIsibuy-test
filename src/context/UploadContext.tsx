import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadContextType {
  images: File[];
  previewURLs: string[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviewURLs: React.Dispatch<React.SetStateAction<string[]>>;
  clearUploads: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);

  const clearUploads = () => {
    previewURLs.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreviewURLs([]);
  };

  return (
    <UploadContext.Provider value={{ images, previewURLs, setImages, setPreviewURLs, clearUploads }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) throw new Error('useUploadContext must be used within UploadProvider');
  return context;
};
