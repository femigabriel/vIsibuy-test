import React from 'react';
import type { FC } from 'react';
import { Card, Row, Col, Empty, Tag, Tooltip } from 'antd';
import { 
  FileImageOutlined, 
  ClockCircleOutlined,
  DeleteOutlined 
} from '@ant-design/icons';
import { useUploadStore } from '../store/uploadStore';

const { Meta } = Card;

const ImageDisplay: FC = () => {
  const { uploadedImages, clearUploadedImages } = useUploadStore();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg h-fit sticky top-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileImageOutlined className="text-indigo-600" />
            Uploaded Images
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        {uploadedImages.length > 0 && (
          <Tooltip title="Clear all images">
            <button
              onClick={clearUploadedImages}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <DeleteOutlined className="text-lg" />
            </button>
          </Tooltip>
        )}
      </div>

      {uploadedImages.length > 0 ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {uploadedImages.map((image, index) => (
            <Card
              key={index}
              style={{ 
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}
              className="hover:shadow-md hover:border-indigo-200"
              bodyStyle={{ padding: '12px' }}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <img
                    draggable={false}
                    alt={image.name}
                    src={image.url}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {image.name}
                    </h3>
                    <Tag color="green" className="text-xs">
                      Verified
                    </Tag>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      <span>{image.uploadTime}</span>
                    </div>
                    {image.file && (
                      <div>
                        Size: {formatFileSize(image.file.size)}
                      </div>
                    )}
                    <div className="text-indigo-600 font-medium">
                      ✓ Verification Complete
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-gray-500">
              <div className="mb-2">No images uploaded yet</div>
              <div className="text-sm">Upload images to see them here</div>
            </div>
          }
          className="py-12"
        />
      )}
    </div>
  );
};

export default ImageDisplay;