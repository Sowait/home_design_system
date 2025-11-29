import React, { useState } from 'react';

const UserCaseImage = ({ coverImage, title }) => {
  const [imageError, setImageError] = useState(false);
  let imageUrl = coverImage;

  // 处理双重转义的JSON字符串
  if (coverImage && typeof coverImage === 'string') {
    // 检查是否是JSON字符串格式
    if (coverImage.startsWith('[') && coverImage.endsWith(']')) {
      try {
        console.log('原始coverImage:', coverImage);
        
        // 第一次解析：去除转义字符
        const firstParse = JSON.parse(coverImage);
        console.log('第一次解析结果:', firstParse);
        
        let imageUrls = [];
        
        if (typeof firstParse === 'string') {
          // 如果第一次解析后还是字符串，需要再次解析
          imageUrls = JSON.parse(firstParse);
          console.log('第二次解析结果:', imageUrls);
        } else if (Array.isArray(firstParse)) {
          // 如果第一次解析后就是数组，直接使用
          imageUrls = firstParse;
        }
        
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          imageUrl = imageUrls[0]; // 取第一张作为封面
          console.log('最终图片URL:', imageUrl);
        }
      } catch (e) {
        console.log('JSON解析失败:', e);
        // 尝试另一种解析方法
        try {
          const imageUrls = JSON.parse(coverImage.replace(/\\"/g, '"'));
          if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            imageUrl = imageUrls[0];
            console.log('备用解析成功:', imageUrls);
          }
        } catch (e2) {
          console.log('备用解析也失败:', e2);
          // 最后作为单个URL处理
          imageUrl = coverImage;
        }
      }
    } else {
      // 如果不是JSON格式，直接使用
      imageUrl = coverImage;
    }
  }

  const handleImageError = () => {
    console.log('用户案例图片加载失败:', imageUrl);
    setImageError(true);
  };

  if (imageError) {
    return <div style={{ width: '100%', height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>加载失败</div>;
  }

  if (!imageUrl) {
    return <div style={{ width: '100%', height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>暂无图片</div>;
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover'
      }}
      onError={handleImageError}
    />
  );
};

export default UserCaseImage;