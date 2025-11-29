import React from 'react';
import { Image, Button, Space } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const ImagePreview = ({ 
  images, 
  onRemove, 
  preview = true, 
  maxImages = 5,
  imageStyle = { 
    width: 100, 
    height: 100, 
    objectFit: 'cover',
    border: '1px solid #d9d9d9',
    borderRadius: '6px'
  }
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, maxImages);
  const hasMore = images.length > maxImages;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {displayImages.map((image, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <Image
            src={image.url || image}
            alt={`图片 ${index + 1}`}
            style={imageStyle}
            preview={preview ? {
              mask: <EyeOutlined />
            } : false}
          />
          {onRemove && (
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onRemove(index)}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                border: '1px solid #ff4d4f',
                color: '#ff4d4f'
              }}
            />
          )}
        </div>
      ))}
      {hasMore && (
        <div style={{
          width: imageStyle.width,
          height: imageStyle.height,
          border: '1px dashed #d9d9d9',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px'
        }}>
          +{images.length - maxImages}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;