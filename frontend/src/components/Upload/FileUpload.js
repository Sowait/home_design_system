import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import api from '../api';

const FileUpload = ({
  type = 'image', // 'image' or 'document'
  accept = 'image/*',
  maxSize = 10, // MB
  onSuccess,
  onError,
  children,
  ...props
}) => {
  const [uploading, setUploading] = useState(false);

  const beforeUpload = (file) => {
    const isValidType = type === 'image' 
      ? file.type.startsWith('image/')
      : file.type === 'application/pdf' || file.type.startsWith('image/');
    
    if (!isValidType) {
      message.error(`只能上传${type === 'image' ? '图片' : 'PDF或图片'}文件!`);
      return false;
    }

    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      message.error(`文件大小不能超过 ${maxSize}MB!`);
      return false;
    }

    return false; // 阻止自动上传，我们手动处理
  };

  const handleUpload = async (file) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        message.success('上传成功!');
        onSuccess && onSuccess(response.data.data);
      } else {
        message.error(response.data.message || '上传失败');
        onError && onError(response.data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('上传失败，请重试');
      onError && onError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    beforeUpload,
    customRequest: ({ file }) => handleUpload(file),
    showUploadList: false,
    ...props,
  };

  return (
    <Upload {...uploadProps}>
      {children || (
        <Button 
          icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
          disabled={uploading}
          loading={uploading}
        >
          {uploading ? '上传中...' : `上传${type === 'image' ? '图片' : '文件'}`}
        </Button>
      )}
    </Upload>
  );
};

export default FileUpload;