import React, { useEffect } from 'react';
import type { FC } from 'react';
import ProductVerificationUpload from './components/ProductVerificationUpload';
import ImageDisplay from './components/ImageDisplay';
import { useUploadStore } from './store/uploadStore';
import { ConfigProvider, theme } from 'antd';

const App: FC = () => {
  const { clearImages } = useUploadStore();

  useEffect(() => {
    return () => {
      clearImages(); 
    };
  }, [clearImages]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      useUploadStore.getState().clearUploadedImages();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 12,
        },
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Product Verification
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Upload product images for verification and quality assessment
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProductVerificationUpload />
            </div>
            <div className="lg:col-span-1">
              <ImageDisplay />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;