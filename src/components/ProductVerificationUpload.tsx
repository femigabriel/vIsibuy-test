import React, { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent, DragEvent } from 'react';
import { Button, Progress, Spin, Alert, Upload, Tooltip } from 'antd';
import { 
  UploadOutlined, 
  InboxOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useUploadStore } from '../store/uploadStore';
    
const { Dragger } = Upload;

const ProductVerificationUpload: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { images, previewURLs, setImages, setPreviewURLs, addUploadedImages, clearImages } =
    useUploadStore();

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) => file.type === 'image/jpeg' || file.type === 'image/png'
    );

    if (newFiles.length === 0) {
      setError('Please select only JPEG or PNG images');
      return;
    }

    if (images.length + newFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setError('');
    const newImages = [...images, ...newFiles];
    const newURLs = newFiles.map((file) => URL.createObjectURL(file));
    setImages(newImages);
    setPreviewURLs([...previewURLs, ...newURLs]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newURLs = previewURLs.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewURLs[index]);
    setImages(newImages);
    setPreviewURLs(newURLs);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Create uploaded images data
    const uploadedImages = images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      uploadTime: new Date().toLocaleString(),
    }));

    addUploadedImages(uploadedImages);
    clearImages();
    setIsSubmitting(false);
    setProgress(0);
    
    // Show success state briefly
    setTimeout(() => {
      // Reset any success states if needed
    }, 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Product Verification
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload clear images of your product from different angles for quality verification
        </p>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all duration-300 ${
          isDragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <InboxOutlined className="text-4xl text-indigo-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Drop your images here
        </h3>
        <p className="text-gray-500 mb-4">
          Supports JPEG, PNG (Max 5 images, 10MB each)
        </p>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          size="large"
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 hover:bg-indigo-700 border-0"
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Requirements */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <InfoCircleOutlined className="text-blue-500 text-lg mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Upload Requirements</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Maximum 5 images per submission</li>
              <li>• Supported formats: JPEG, PNG</li>
              <li>• Maximum file size: 10MB per image</li>
              <li>• Ensure images are clear and well-lit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mb-6 rounded-lg"
        />
      )}

      {/* Image Previews */}
      {previewURLs.length > 0 && !isSubmitting && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">
              Selected Images ({previewURLs.length}/5)
            </h4>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={clearImages}
              className="text-red-500 hover:text-red-700"
            >
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {previewURLs.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-indigo-300 transition-colors duration-200">
                  <img
                    src={url}
                    alt={`Preview ${images[index].name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Tooltip title="Remove image">
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                  >
                    ✕
                  </button>
                </Tooltip>
                <div className="mt-2 text-xs text-gray-600">
                  <div className="font-medium truncate">{images[index].name}</div>
                  <div className="text-gray-500">{formatFileSize(images[index].size)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className="text-center">
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting || images.length === 0}
          icon={isSubmitting ? <Spin /> : <CheckCircleOutlined />}
          className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 ${
            isSubmitting 
              ? 'bg-gray-400 border-0' 
              : images.length === 0
              ? 'bg-gray-300 border-0'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Submit Verification'}
        </Button>

        {isSubmitting && (
          <div className="mt-6">
            <Progress
              percent={progress}
              status="active"
              strokeColor={{
                '0%': '#6366f1',
                '100%': '#8b5cf6',
              }}
              className="mb-2"
            />
            <p className="text-gray-600 text-sm">
              Processing your images... {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVerificationUpload;